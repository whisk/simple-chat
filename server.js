/**
 * @fileOverview Chat server entry point
 */
'use strict'

var Backend = require('./lib/backend').Backend

// TODO: read from file
var options = {
  host: 'localhost',
  port: '8080'
}

/** Start server (backend) */
Backend.start(options, (err, srv) => {
  if (err) {
    console.log('Error starting server:', err)
  } else {
    let addr = srv.address()
    console.log(`Server started on ${addr.address}:${addr.port}. PID ${process.pid}`)
  }
})

/** Catch keyboard interrupts (CTRL-C) */
process.on('SIGINT', () => {
  console.log('Got SIGINT')
  Backend.shutdown()
})

/** Catch TERM signals */
process.on('SIGTERM', () => {
  console.log('Got SIGTERM')
  Backend.shutdown()
})

/** Catch HUP signals (for graceful restart) */
process.on('SIGHUP', () => {
  console.log('Got SIGHUP')
  Backend.reload()
})

/** Catch USR1 signals for log rotation */
process.on('SIGUSR1', () => {
  console.log('Got SIGUSR1')
  Backend.logrotate()
})