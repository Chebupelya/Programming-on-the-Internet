const http = require('http');
const fs = require('fs');
const url = require('url');
const nodemailer = require('nodemailer');

http.createServer((request, response) => {
    const pathname = url.parse(request.url).pathname;

    switch (pathname) {
        case '/':
            if(request.method === 'GET'){
                fs.readFile("./06-02.html", (error, data) => {
                    if (error) {
                        console.log(error.message);
                        return;
                    }
                    response.end(data);
                });
            }
            else if(request.method === 'POST'){
                request.on("data", (data) => sendFromMailToMail(JSON.parse(data)));
                response.end("Email send successful");
            }
            else console.log("Something went wrong");
            break;
    }
}).listen(3000, () => console.log('Start server at http://localhost:3000'));

function sendFromMailToMail(sendInformation){
    let mailData = {
        from: sendInformation.sender,
        to: sendInformation.receiver,
        subject: sendInformation.theme,
        text: sendInformation.textMessege
    }
    nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: false,
        service: 'gmail',
        auth: {
            user: sendInformation.sender,
            pass: sendInformation.password,
        }
    }).sendMail(mailData, (err,info) => {
        if(err) return console.log(err)
        else console.log('Email send successful')
    })
}