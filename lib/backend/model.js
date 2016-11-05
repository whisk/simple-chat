/**
 * @fileOverview Model for storing users and messages
 * @module Backend/Model
 */
'use strict'

class Model {
  constructor() {
    this.messages = []
    this.users = {}
    this.base_id = 1
  }

  genId() {
    return this.base_id++
  }

  usersList() {
    return this.users
  }

  recentHistory(num) {
    num = num || 10
    return this.messages.slice(-num)
  }

  post(msg) {
    msg = {
      id:         this.genId(),
      user:       msg.user,
      body:       msg.body,
      created_at: Date.now()
    }
    this.messages.push(msg)
    return msg
  }

  signup(user) {
    if (!this.users[user.name]) {
      this.users[user.name] = {
        name:      user.name,
        joined_at: Date.now()
      }
      return this.users[user.name]
    } else {
      return false
    }
  }

  logout(user) {
    if (this.users[user.name]) {
      delete this.users[user.name]
      return true
    } else {
      return false
    }
  }
}

exports.Model = Model