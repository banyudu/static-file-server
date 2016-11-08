const fs = require('fs')
const https = require('https')
const express = require('express')
const config = require('./config')
const auth = require('basic-auth')

let keyFile = config.sslKey || './key.pem'
let certFile = config.sslCert || './cert.pem'
let key = fs.readFileSync(keyFile, 'utf8')
let cert = fs.readFileSync(certFile, 'utf8')

let credentials = {key: key, cert: cert}
let app = express()

const authenticate = (user, password) => {
  return user === config.username && password === config.password
}

const midAuth = (req, res, next) => {
  var user = auth(req)
  if (user !== undefined && authenticate(user.name, user.pass)) {
    return next()
  } else {
    res.status(401).set({
      'WWW-Authenticate': 'Basic realm="localhost"'
    }).send()
  }
}
app.use(auth)
let filePath = config.filePath || './'
app.use('/', express.static(filePath))

let httpsServer = https.createServer(credentials, app)
let port = config.listen_port || 3100
httpsServer.listen(port)
