const dgram = require('dgram');
const server = dgram.createSocket('udp4');

const PORT = 3000;
const HOST = '192.168.247.85';

server.on('message', (message, remoteInfo) => {

    console.log(`message from client: "${message}"`);

    const msgResponse = `ECHO: ${message}`;

    server.send(msgResponse, remoteInfo.port, remoteInfo.address, (err) => {
        if (err) {
            server.close();
        }
    });

});

server.bind();