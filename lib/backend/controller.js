/**
 * @fileOverview Chat controller. Mediator between HTTP backend and domain-specific model
 * @module Backend/Controller
 */
'use strict'

var fs = require('fs')
var url = require('url')
var path = require('path')
var Model = require('./model').Model

class Controller {
  constructor(io) {
    this.model = new Model
    this.io = io
  }

  /**
   * Respond with static file contents
   */
  do_static(req, res) {
    // XXX: unsafe path handling!
    let p = path.join('app/public/', url.parse(req.url).pathname)
    let parsed = path.parse(p)
    if (parsed.ext == '') {
      p = path.join(p, 'index.html')
    }
    fs.readFile(p, (err, data) => {
      if (err) throw err
      res.end(data.toString())
    })
  }

  /**
   * Respond with user list
   */
  do_users(req, res) {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(this.model.usersList()))
  }

  /**
   * Respond with recent message history
   * XXX: Also works as 'welcoming' method (all users request this)
   */
  do_history(req, res) {
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(this.model.recentHistory()))
    // XXX: extract method
    this.flash(`There are ${Object.keys(this.model.usersList()).length} user(s) here`)
  }

  /**
   * Post message
   */
  do_post(req, res) {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      let msg = this.model.post(JSON.parse(body))
      if (msg) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(msg))
        this.io.emit('msg', msg)
      } else {
        res.statusCode = 500
        res.end('')
      }
    })
  }

  /**
   * Sign up user. Since we have not authorization, it is registration and login combined
   * Responds with 200 when successful (username not already taken etc.)
   */
  do_signup(req, res) {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      let user = this.model.signup(JSON.parse(body))
      if (user) {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(user))
        this.broadcast(`User ${user.name} has joined`)
      } else {
        res.statusCode = 500
        res.end('')
      }
    })
  }

  /**
   * Logout user
   */
  do_logout(req, res) {
    let body = ''
    req.on('data', (chunk) => { body += chunk })
    req.on('end', () => {
      let user = JSON.parse(body);
      if (this.model.logout(user)) {
        res.statusCode = 200
        this.broadcast(`User ${user.name} has left`)
      } else {
        res.statusCode = 500
      }
      res.end('')
    })
  }

  /**
   * Send broadcast message which stores in history
   * @param  {String} msg Message test
   */
  broadcast (msg) {
    this.model.post({user: {'name': 'Server'}, body: msg})
    this.flash(msg)
  }

  /**
   * Send broadcast message which DOES NOT appear in history
   * @param  {String} msg Message test
   */
  flash (msg) {
    this.io.emit('msg', {user: {'name': 'Server'}, body: msg, created_at: Date.now()})
  }
}

exports.Controller = Controller