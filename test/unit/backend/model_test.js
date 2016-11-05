/* eslint-env mocha */
'use strict'

var assert = require('assert')
var Model = require('../../../lib/backend/model').Model
var model;

describe('model', () => {
  before(() => {
    model = new Model
  })

  it('should receive messages', () => {
    assert.equal(0, model.recentHistory().length)
    model.post({'user': {'name': 'user1'}, 'body': 'test message'})
    assert.equal(1, model.recentHistory().length)
    assert.equal('user1', model.recentHistory()[0].user.name)
    assert.equal(1, model.recentHistory()[0].id)
  })

  it('should sign-up users', () => {
    assert.equal(0, Object.keys(model.usersList()).length)
    let user = model.signup({'name': 'user1'})
    assert.equal(user.name, 'user1')
    assert.equal(1, Object.keys(model.usersList()).length)
    assert(model.usersList()['user1'])
  })

  it('should not signup duplicate user', () => {
    model.signup({'name': 'user1'})
    let res = model.signup({'name': 'user1'})
    assert(!res)
    assert.equal(1, Object.keys(model.usersList()).length)
    assert(model.usersList()['user1'])
  })

  it('should logout users', () => {
    model.signup({'name': 'user1'})
    model.signup({'name': 'user2'})
    assert.equal(2, Object.keys(model.usersList()).length)
    assert(model.logout({'name': 'user1'}))
    assert.equal(1, Object.keys(model.usersList()).length)
    assert.equal('user2', model.usersList()['user2'].name)
  })

  it('should return history', () => {
    for (let i = 0; i < 42; i++) {
      model.post({'user': {'name': 'user1'}, 'body': `test message ${i}`})
    }
    assert.equal('test message 41', model.recentHistory(10)[9].body)
    assert.equal(13, model.recentHistory(13).length)
  })
})