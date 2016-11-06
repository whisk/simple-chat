# Simple Chat

[![Build Status](https://travis-ci.org/whisk/simple-chat.svg?branch=master)](https://travis-ci.org/whisk/simple-chat)

## Synopsis

Demo chat application featuring Node, Socket IO, React and Bootstrap. Quickstart:

```
npm install
npm start
```

And type in your browser: `http://localhost:8080`. Enjoy!

## Docker

Create docker image:
```
docker build -t simple-chat .
```

Run container:
```
docker run -P -d simple-chat
```

Chat backend is exposed on port 8080.

## Features

* Simple HTTP server with router, controller and a model (not using Express or other framework)
* Socket IO for communications
* React for chat frontend
* React Bootstrap for style
* Webpack and Babel for JSX transformation
* ES6 Style (mostly)

## Development

```
npm install
npm test
npm jsdoc
npm webpack
```

## TODO

* Safer static file handling
* Better frontend error handling (user name already in use etc.)
* Support log rotation, config reload etc. for HTTP server
* Logout
* Persistent storage
* Authorization

## License

MIT
