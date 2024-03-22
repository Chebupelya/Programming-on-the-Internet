const http = require('http');
const url = require('url');

function factorial(n) {
    if (n === 0 || n === 1) return 1;
    else return n * factorial(n - 1);
}

const server = http.createServer((request, response) => {

    const parsedUrl = url.parse(request.url, true);

    const k = parseInt(parsedUrl.query.k, 10);

    if (isNaN(k) || k < 0) 
    {
        response.writeHead(400, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ error: 'Параметр k должен быть целым числом.' }));
    } 
    else
    {
        const factResult = factorial(k);

        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({ k, fact: factResult }));
    }
}).listen(5000, () => console.log('Server running at http://localhost:5000/'));
