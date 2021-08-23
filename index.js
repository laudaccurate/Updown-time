/*
 Primary File
*/

// Dependencies
const http = require('http');
const https = require('https');
const fs = require('fs');
const url = require('url');
const { StringDecoder } = require('string_decoder');
const config = require('./config');
const data = require('./lib/data');

/*
 TO BE REMOVED
*/

// Instantiate the HTTP Server
var httpServer = http.createServer((req, res) => {
	unifiedServerLogic(req, res);
});

// Start the HTTP Server
httpServer.listen(
	config.httpPort,
	console.log(
		`HTTP Server is listening on PORT ${config.httpPort} in ${config.envName} mode!!`
	)
);

// Instantiate the HTTPS Server
var httpsServerOptions = {
	key: fs.readFileSync('./https/key.pem'),
	cert: fs.readFileSync('./https/cert.pem'),
};
var httpsServer = https.createServer(httpsServerOptions, (req, res) => {
	unifiedServerLogic(req, res);
});

// Start the HTTPS Server
httpsServer.listen(
	config.httpsPort,
	console.log(
		`HTTPS Server is listening on PORT ${config.httpsPort} in ${config.envName} mode!!`
	)
);

const unifiedServerLogic = function (req, res) {
	//Get the HTTP method
	const method = req.method.toUpperCase();

	// Get the path from the request url
	const parsedUrl = url.parse(req.url, true);
	const path = parsedUrl.pathname.replace(/^\/+|\/+$/g, '');

	// Get the request query parameters as an object
	const queryStringParameters = parsedUrl.query;

	// Get the request headers as an object
	const headers = req.headers;

	// Get the payload from the request
	var decoder = new StringDecoder('utf-8');
	var buffer = '';

	req
		.on('data', (data) => {
			buffer += decoder.write(data);
		})
		.on('end', () => {
			buffer += decoder.end();

			// Choose the handler this request should go to. If none, then the Not found handler is used
			var chosenHandler =
				typeof router[path] !== 'undefined' ? router[path] : handlers.notFound;

			// Construct the data object to send to chosen handler
			var data = {
				path: path,
				queryStringObject: queryStringParameters,
				method: method,
				headers: headers,
				payload: buffer,
			};

			// Route the request to the specified handler in the router
			chosenHandler(data, function (statusCade, payload) {
				// Use the status code called back by the handler or default to 200
				statusCade = typeof statusCade == 'number' ? statusCade : 200;

				//Use the payload called back by the handler or default to empty object
				payload = typeof payload == 'object' ? payload : {};

				var payloadString = JSON.stringify(payload);

				// Return the response
				res.setHeader('Content-Type', 'application/json');
				res.writeHead(statusCade).end(payloadString);

				// Log the response
				console.log('Returning this response ', statusCade, payloadString);
			});
		});
};

var handlers = {};

// sample handler
handlers.ping = function (data, callback) {
	// Callback an HTTP status and a payload oboject
	callback(200);
};

//Not found handler
handlers.notFound = function (data, callback) {
	callback(404);
};

// Define a request router
var router = {
	ping: handlers.ping,
};
