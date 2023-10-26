var http = require('http');
var fs = require('fs');
const labels = require('./labelModule.js');
const route = 'fetch';

http.createServer((request, response) => {
    const httpFileName = './fetch.html';

    if (request.url === '/api/name') {
        response.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
        response.end(labels.myName)
    }
    else if (request.url === '/' + route) {
        fs.readFile(httpFileName, (error, data) => {
            response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            error != null ? console.log("error:" + error) : response.end(data);
        });
    }
    else
        response.end('<html><body><h1>Error! Visit localhost:5000/' + route + '</h1></body></html>');
}).listen(5000, () => console.log('Server running at localhost:5000/' + route));