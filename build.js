const {join, resolve} = require('path');

const webpack = require('webpack');

const compiler = webpack([
  {
    entry: [
      './src/index.js',
    ],
    output: {
      path: join(resolve('app'), 'gui'),
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
  },
  {
    entry: [
      './src/cui.js',
    ],
    output: {
      path: join(resolve('app'), 'cui'),
      filename: 'cui.js',
      library: 'cui',
      libraryTarget: 'commonjs2',
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
    target: 'node',
  },
]);

compiler.run(() => {});
