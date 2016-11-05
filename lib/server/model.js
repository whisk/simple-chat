'use strict';

function Model() {
  this.messages = [];
  this.users = {};
}
exports.Model = Model;

Model.prototype.usersList = function() {
  return this.users;
};

Model.prototype.recentHistory = function() {
  return this.messages.slice(-10);
};

Model.prototype.post = function(msg) {
  msg = {
    body:       msg.body,
    created_at: Date.now()
  };
  this.messages.push(msg);
};

Model.prototype.signup = function(user) {
  this.users[user.name] = {
    name:      user.name,
    joined_at: Date.now()
  };
};

Model.prototype.logout = function(user) {
  if (this.users[user.name]) {
    delete this.users[user.name];
    return true;
  } else {
    return false;
  }
};