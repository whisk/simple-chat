/**
 * @fileOverview Backend for serving HTTP requests
 * @module Backend
 */
'use strict'

var http = require('http')
var url  = require('url')

var Controller = require('./backend/controller').Controller

class Backend {
  constructor() {
    this.srv = null
  }

  start(options, callback) {
    this.srv = http.createServer((req, res) => { this.process(req, res) })
    this.io = require('socket.io')(this.srv)
    this.router = require('./backend/router')
    this.controller = {
      chat: new Controller(this.io)
    }

    this.srv.on('error', (err) => { callback(err) })

    this.connections = {}
    this.srv.on('connection', (conn) => {
      let key = conn.remoteAddress + ':' + conn.remotePort
      this.connections[key] = conn
      conn.on('close', () => delete this.connections[key])
    })
    this.srv.listen(options.port, options.host, () => { callback(null, this.srv) })

    process.on('uncaughtException', (e) => {
      console.log(e, e.stack)
    })
  }

  shutdown(callback) {
    console.log(`Shutting down... Closing ${Object.keys(this.connections).length} open connection(s)`)
    for (let i in this.connections) {
      this.connections[i].destroy()
    }
    this.srv.close(callback)
  }

  process(req, res) {
    res.on('finish', () => { this.accessLog(req, res) })

    let route = this.router.route(url.parse(req.url).pathname)
    let ctrl_name = route[0]
    let method_name = route[1]

    try {
      if (ctrl_name && method_name && this.controller[ctrl_name]) {
        this.controller[ctrl_name]['do_' + method_name](req, res)
      } else {
        this.page_not_found(req, res)
      }
    } catch (e) {
      res.statusCode = 500
      res.end('')
      this.errorLog(req, res, {error: e})
    }
  }

  accessLog(req, res, other) {
    console.log(`access_log: ${req.connection.remoteAddress} - [${(new Date).toUTCString()}] "${req.method} ${req.url}" ${res.statusCode}`)
  }

  errorLog(req, res, other) {
    console.log(`error_log: ${req.connection.remoteAddress} - [${(new Date).toUTCString()}] "${req.method} ${req.url}" ${res.statusCode} ${other.error}`)
  }

  reload() {
    // TODO
    console.log('Stub for reload...')
  }

  logrotate() {
    // TODO
    console.log('Stub for logrotate...')
  }

  page_not_found(req, res) {
    res.statusCode = 404
    res.end("Not Found\n")
  }
}

exports.Backend = new Backend