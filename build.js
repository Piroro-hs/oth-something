const {resolve} = require('path');

const webpack = require('webpack');

const compiler = webpack({
  entry: [
    './src/index.js',
  ],
  output: {
    path: resolve('app'),
    filename: 'index.js',
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }, {
      test: /\.json/,
      loader: 'json-loader',
    }],
  },
  target: 'electron',
});

compiler.run(() => {});
