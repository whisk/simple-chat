'use strict';

var Model = require('./model').Model;

var Controller = function() {
  this.model = new Model;
}
exports.Controller = Controller;

Controller.prototype.do_users = function(req, res) {
  res.statusCode = 200;
  res.end(JSON.stringify(this.model.usersList()));
};

Controller.prototype.do_history = function(req, res) {
  res.statusCode = 200;
  res.end(JSON.stringify(this.model.recentHistory()));
};

Controller.prototype.do_post = function(req, res) {
  res.statusCode = 200;
  res.end('');
};

Controller.prototype.do_signup = function(req, res) {

};

Controller.prototype.do_logout = function(req, res) {

};
