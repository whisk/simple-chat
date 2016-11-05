/* eslint-env mocha */
'use strict'

var assert  = require('assert')
var request = require('request')

var Backend = require('../../lib/backend').Backend

describe('backend', () => {
  before((done) => {
    Backend.start({host: 'localhost', port: 8181}, (err) => {
      done(err)
    })
  })

  it('should return 404', (done) => {
    request.get({url: 'http://localhost:8181/unknown-url'}, (err, res) => {
      assert(!err)
      assert.equal(res.statusCode, 404)
      done(err)
    })
  })

  it('should return chat history', (done) => {
    request.get({url: 'http://localhost:8181/history'}, (err, res) => {
      assert(!err)
      assert.equal(res.statusCode, 200)
      assert.equal(res.body, '[]')
      done(err)
    })
  })

  after(() => {
    Backend.shutdown()
  })
})