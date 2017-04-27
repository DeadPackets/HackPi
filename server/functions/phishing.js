import express from 'express';
import http from 'http';
var app = express()
var port = 80
var httpsport = 443
import https from 'https';
import fs from 'fs';
var options = {
	key: fs.readFileSync('./ssl/server.key'),
	cert: fs.readFileSync('./ssl/server.cert')
};

var server = https.createServer(options, app).listen(httpsport, () => {
	console.log("Express server listening on port " + httpsport);
});

var httpserver = http.createServer(app).listen(port, () => {
	console.log("Express server listening on port " + port);
});


app.get('*', (req, res) => {
	console.log(req.headers.host + req.url)
	if (req.headers.host !== '192.168.69.1') {
		console.log(req.headers['user-agent'])
		res.redirect('http://192.168.69.1/')
	} else {
		res.send("<h1>HELLO WORLD</h1>")
	}
})
