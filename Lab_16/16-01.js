require('dotenv').config();
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
const db = require('./database');
const token = process.env.TELEGRAM_BOT_TOKEN;
const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY;
const cron = require('node-cron');
const { sendDailyFact } = require('./facts');
const { sendStickerOnMessage } = require('./stickers');
const { getWeatherByCity } = require('./weather');
const { getRandomJoke } = require('./joke');
const { getPictureByName } = require('./picture');

try
{    
    const bot = new TelegramBot(token, {polling: true});
    bot.on('message', (msg) => {
        const chatId = msg.chat.id;
        bot.sendMessage(chatId, 'Привет! Ты сказал: ' + msg.text);
        sendStickerOnMessage(bot, msg);
        getPictureByName(bot, msg);
    });

    bot.onText(/\/subscribe/, (msg) => {
        const chatId = msg.chat.id;
        db.run('INSERT OR IGNORE INTO subscribers (chat_id) VALUES (?)', [chatId], function(err) {
          if (err) {
            return bot.sendMessage(chatId, 'Произошла ошибка при попытке подписки.');
          }
          bot.sendMessage(chatId, 'Вы подписались на ежедневную рассылку.');
        });
    });
      
    bot.onText(/\/unsubscribe/, (msg) => {
    const chatId = msg.chat.id;
    db.run('DELETE FROM subscribers WHERE chat_id = ?', [chatId], function(err) {
        if (err) {
        return bot.sendMessage(chatId, 'Произошла ошибка при попытке отписки.');
        }
        bot.sendMessage(chatId, 'Вы отписались от ежедневной рассылки.');
        });
    });

    cron.schedule('*/10 * * * * *', () => {
        sendDailyFact(bot);
    });

    bot.onText(/\/weather (.+)/, (msg, match) => {
        getWeatherByCity(bot, msg, match, axios, weatherApiKey);
    });

    bot.onText(/\/joke/, (msg) => {
        getRandomJoke(bot, msg);
    });


}
catch
{
    console.log("ОШИБКА!!!")
}
