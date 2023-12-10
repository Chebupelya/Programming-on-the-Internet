const nodemailer = require('nodemailer');

function send(email, password, message) {
    return new Promise((resolve, reject) => {

        const mailData = {
            from: email,
            to: email,
            subject: 'Message from m06_INS Module',
            text: message
        };

        nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: false,
            service: 'gmail',
            auth:
            {
                user: email,
                pass: password,
            }
        }).sendMail(mailData, (err, info) => {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });
}
module.exports = { send };
