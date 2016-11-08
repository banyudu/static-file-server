const fs = require('fs');
const https = require('https');
const express = require('express');
const config = require('./config')

let key = fs.readFileSync(config.sslKey, 'utf8');
let cert = fs.readFileSync(config.sslCert, 'utf8');

let credentials = {key: key, cert: cert};
let app = express();

let httpsServer = https.createServer(credentials, app);
httpsServer.list(config.listen_port);
