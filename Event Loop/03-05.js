var http = require('http');
var url = require('url');
var fs = require('fs');
const route = 'fact';


var factorial = (x) => 
{
    if (x < 0)
        return "Invalid value!";
    else if (x == 0 || x == 1) 
        return 1; 
    else 
        return x * factorial(x - 1);
};


function Fact(k, func)
{
    this.k = k;
    this.factorial = factorial;
    this.func = func;
    this.calculateFact = () => {setImmediate(() => {this.func(null, this.factorial(this.k))})};
}


http.createServer((request, response) => {
 
    var rc = JSON.stringify({ k: 0 , fact: 0 });
    if (url.parse(request.url).pathname === '/' + route && typeof url.parse(request.url, true).query.k != 'undefined')
    {
        var k = parseInt(url.parse(request.url, true).query.k);
        if (Number.isInteger(k) && k >= 0)
        {
            response.writeHead(200, {'Content-Type': 'application/json; charset=utf-8'});
            var facts = new Fact(k, (err, result) => 
            {
                err != null ? console.log('Error: ' + err) : response.end(JSON.stringify({ k: k, fact: result })); 
            });
            facts.calculateFact();
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