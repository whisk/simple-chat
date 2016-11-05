'use strict';

var http = require('http');
var url  = require('url');

var Controller = require('./server/controller').Controller;

var Server = function() {
  this.srv = null;
};
exports.Server = new Server;

Server.prototype.start = function(options, callback) {
  this.connections = {};
  this.router = require('./server/router');
  this.controller = {
    chat: new Controller
  };

  this.srv = http.createServer((req, res) => { this.process(req, res) });
  this.srv.on('error', (err) => { callback(err) });
  this.srv.on('connection', (conn) => {
    let key = conn.remoteAddress + ':' + conn.remotePort;
    this.connections[key] = conn;
    conn.on('close', () => delete this.connections[key]);
  });
  this.srv.listen(options.port, options.host, () => { callback(null, this.srv) });

  process.on('uncaughtException', (e) => {
    console.log(e, e.stack);
  });
};

Server.prototype.shutdown = function(callback) {
  console.log(`Shutting down... Closing ${Object.keys(this.connections).length} open connection(s)`);
  for (let i in this.connections) {
    this.connections[i].destroy();
  }
  this.srv.close(callback);
};

Server.prototype.process = function(req, res) {
  res.on('finish', () => { this.accessLog(req, res) });

  let route = this.router.route(url.parse(req.url).pathname);
  let ctrl_name = route[0];
  let method_name = route[1];

  try {
    if (ctrl_name && method_name && this.controller[ctrl_name]) {
      this.controller[ctrl_name]['do_' + method_name](req, res);
    } else {
      this.page_not_found(req, res);
    }
  } catch (e) {
    res.statusCode = 500;
    res.end('');
    this.errorLog(req, res, {error: e});
  }
};

Server.prototype.accessLog = function(req, res, other) {
  console.log(`access_log: ${req.connection.remoteAddress} - [${(new Date).toUTCString()}] "${req.method} ${req.url}" ${res.statusCode}`);
}

Server.prototype.errorLog = function(req, res, other) {
  console.log(`error_log: ${req.connection.remoteAddress} - [${(new Date).toUTCString()}] "${req.method} ${req.url}" ${res.statusCode} ${other.error}`);
}

Server.prototype.reload = function() {
  // TODO
  console.log('Stub for reload...');
};

Server.prototype.logrotate = function() {
  // TODO
  console.log('Stub for logrotate...');
};

Server.prototype.page_not_found = function(req, res) {
  res.statusCode = 404;
  res.end("Not Found\n");
};