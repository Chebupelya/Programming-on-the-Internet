function sendStickerOnMessage(bot, msg) {    
    const text = msg.text;
    const chatId = msg.chat.id;

    switch(text.toLowerCase()) 
    {
        case "привет":
        {
            bot.sendSticker(chatId, "CAACAgIAAxkBAAEEIHpl-BoumD1stuRuXSXWwm2jSPhdRgACNAEAAlKJkSMTzddv9RwHWDQE");
            break;
        }
        case "пока":
        {
            bot.sendSticker(chatId, "CAACAgIAAxkBAAEEIH5l-BpIbbpbiBCj_V7b7Almu3mxzgACUgADQbVWDAIQ4mRpfw9yNAQ");
            break;
        }
        case "торч":
        {
            bot.sendSticker(chatId, "CAACAgIAAxkBAAEEIIdl-Bq6cV9P5almWjlsMCZcHvUKnwACtx0AAs3DcUufHIdPsHPh6TQE");
            break;
        }
        case "уф":
        {
            bot.sendSticker(chatId, "CAACAgIAAxkBAAEEIItl-Buco5SH9m52EMhPP0wBFNYbcQACwhUAAlAdSUhTlP1Qw1XqODQE");
            break;
        }
    }
}

module.exports = { sendStickerOnMessage };