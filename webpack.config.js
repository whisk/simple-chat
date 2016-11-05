var webpack = require('webpack');

module.exports = {
  target: 'web',
  entry: './lib/client/app.jsx',
  output: { path: './app/public/', filename: 'bundle.js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-2']
        }
      }
    ]
  },
  plugins: [
    new webpack.EnvironmentPlugin(["NODE_ENV"])
  ]
};

