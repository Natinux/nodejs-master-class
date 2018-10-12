
const http = require('http');
const https = require('https');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const fs = require('fs');
const config = require('./config');
const router = require('./router');

// Server Logic
const mainHandler = (req, res) => {
    const parsedUrl = url.parse(req.url, true);

    const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

    const queryStringObject = parsedUrl.query;

    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', data => buffer += decoder.write(data));

    req.on('end', () => {
        buffer += decoder.end();
        const chosenHandler = typeof(router[path]) !== 'undefined' ? router[path] : router.notFound;

        const data = {
            path,
            queryStringObject,
            'method': req.method.toLowerCase(),
            'headers': req.headers,
            'payload': buffer
        };

        chosenHandler(data, (statusCode, payload) => {

            statusCode = typeof(statusCode) == 'number' ? statusCode : 400;

            payload = typeof(payload) == 'object' ? payload : {};

            const payloadString = JSON.stringify(payload);

            res.setHeader('Contet-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(payloadString);
            console.log('returning response: ' + statusCode, payloadString);
        });
      
    });
};

// Init HTTP + HTTPS
const httpServer = http.createServer(mainHandler);
const httpsServer = https.createServer({
    'key': fs.readFileSync('./https/key.pem'),
    'cert': fs.readFileSync('./https/cert.pem')
}, mainHandler);

//Start HTTP + HTTPS
httpServer.listen(config.httpPort, () => console.log(`The HTTP server is running on port ${config.httpPort}`));
httpsServer.listen(config.httpsPort, () => console.log(`The HTTPS server is running on port ${config.httpsPort}`));