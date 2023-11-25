var http = require('http');
var url = require('url');
var fs = require('fs');
const route = 'fact';


function factorial(x) 
{
    if (x == 0 || x == 1) return 1; 
    else return x * factorial(x - 1);
}


http.createServer((request, response) => {
 
    var rc = JSON.stringify({ k: 0 , fact: 0 });
    if (url.parse(request.url).pathname === '/' + route && typeof url.parse(request.url, true).query.k != 'undefined')
    {
        var parsedUrl = url.parse(request.url, true);
        var k = parseInt(parsedUrl.query.k, 10);
        if (isNaN(k) || k < 0) 
        {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({ error: 'Параметр k должен быть целым числом.' }));
        } 
        else
        {
            response.writeHead(200, {'Content-Type': 'application/json' });
            response.end(JSON.stringify({k: k, fact: factorial(k)}));
        }
    }
    else if (url.parse(request.url).pathname === '/')
    {
        rc = fs.readFileSync('./03-03.html');
        response.writeHead(200, {'Content-Type': 'text/html' });
        response.end(rc);
    }
    else 
        response.end(rc);
}).listen(5000, () => console.log('Server running at http://localhost:5000/'));