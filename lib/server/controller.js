'use strict';

var fs = require('fs');
var url = require('url');
var path = require('path');
var Model = require('./model').Model;

var Controller = function() {
  this.model = new Model;
}
exports.Controller = Controller;

Controller.prototype.do_static = function(req, res) {
  // XXX: unsafe path handling!
  let p = path.join('app/public/', url.parse(req.url).pathname);
  let parsed = path.parse(p);
  if (parsed.ext == '') {
    p = path.join(p, 'index.html');
  }
  fs.readFile(p, (err, data) => {
    if (err) throw err;
    res.end(data.toString());
  });
};

Controller.prototype.do_users = function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(this.model.usersList()));
};

Controller.prototype.do_history = function(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(this.model.recentHistory()));
};

Controller.prototype.do_post = function(req, res) {
  let body = '';
  req.on('data', (chunk) => { body += chunk });
  req.on('end', () => {
    let msg = this.model.post(JSON.parse(body));
    if (msg) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(msg));
    } else {
      res.statusCode = 500;
      res.end('');
    }
  });
};

Controller.prototype.do_signup = function(req, res) {
  let body = '';
  req.on('data', (chunk) => { body += chunk });
  req.on('end', () => {
    let user = this.model.signup(JSON.parse(body));
    if (user) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(user));
    } else {
      res.statusCode = 500;
      res.end('');
    }
  });
};

Controller.prototype.do_logout = function(req, res) {
  let body = '';
  req.on('data', (chunk) => { body += chunk });
  req.on('end', () => {
    if (this.model.logout(JSON.parse(body))) {
      res.statusCode = 200;
    } else {
      res.statusCode = 500;
    }
    res.end('');
  });
};
