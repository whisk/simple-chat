'use strict';

function Model() {
  this.messages = [];
  this.users = {};
  this.base_id = 1;
}
exports.Model = Model;

Model.prototype.genId = function() {
  return this.base_id++;
}

Model.prototype.usersList = function() {
  return this.users;
};

Model.prototype.recentHistory = function() {
  return this.messages.slice(-10);
};

Model.prototype.post = function(msg) {
  msg = {
    id:         this.genId(),
    user:       msg.user,
    body:       msg.body,
    created_at: Date.now()
  };
  this.messages.push(msg);
  return msg;
};

Model.prototype.signup = function(user) {
  if (!this.users[user.name]) {
    this.users[user.name] = {
      name:      user.name,
      joined_at: Date.now()
    };
    return this.users[user.name];
  } else {
    return false;
  }
};

Model.prototype.logout = function(user) {
  if (this.users[user.name]) {
    delete this.users[user.name];
    return true;
  } else {
    return false;
  }
};