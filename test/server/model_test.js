/* eslint-env mocha */
'use strict';

var assert = require('assert');
var Model = require('../../lib/server/model').Model;

describe('model', () => {
  it('should receive messages', () => {
    let model = new Model;
    assert.equal(0, model.recentHistory().length);
    model.post({'user': {'name': 'user1'}, 'body': 'test message'});
    assert.equal(1, model.recentHistory().length);
    assert.equal('user1', model.recentHistory()[0].user.name);
    assert.equal(1, model.recentHistory()[0].id);
  });

  it('should sign-up users', () => {
    let model = new Model;
    assert.equal(0, Object.keys(model.usersList()).length);
    let user = model.signup({'name': 'user1'});
    assert.equal(user.name, 'user1');
    assert.equal(1, Object.keys(model.usersList()).length);
    assert(model.usersList()['user1']);
  });

  it('should logout users', () => {
    let model = new Model;
    model.signup({'name': 'user1'});
    assert.equal(1, Object.keys(model.usersList()).length);
    assert(model.logout({'name': 'user1'}));
    assert.equal(0, Object.keys(model.usersList()).length);
  });
});