var http = require('http');
var fs = require('fs');
const route = 'png';

http.createServer(function (request, response) {
    console.log(request.url);

    if (request.url === '/' + route) {
        const fname = './photo.png';
        let png = null;

        fs.stat(fname, (err, stat) => {
            if (err)
                console.log('error: ', err)
            else {
                png = fs.readFileSync(fname);
                response.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': stat.size });
                response.end(png, 'binary');
            }
        })
    }
    else
        response.end('<html><body><h1>Error! Visit localhost:5000/' + route + '</h1></body></html>');
}).listen(5000, () => console.log('Server running at localhost:5000/' + route));
