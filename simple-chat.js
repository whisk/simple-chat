'use strict';

var Server = require('./lib/server').Server

// TODO: read from file
var options = {
  host: 'localhost',
  port: '8080'
};

Server.start(options, (err, srv) => {
  if (err) {
    console.log('Error starting server:', err);
  } else {
    let addr = srv.address();
    console.log(`Server started on ${addr.address}:${addr.port}. PID ${process.pid}`);
  }
});

process.on('SIGINT', () => {
  console.log('Got SIGINT');
  Server.shutdown();
});

process.on('SIGTERM', () => {
  console.log('Got SIGTERM');
  Server.shutdown();
});

process.on('SIGHUP', () => {
  console.log('Got SIGHUP');
  Server.reload();
})

process.on('SIGUSR1', () => {
  console.log('Got SIGUSR1');
  Server.logrotate();
});