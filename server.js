const {spawn} = require('child_process');
const {EventEmitter} = require('events');
const {resolve} = require('path');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const compiler = webpack({
  entry: [
    'webpack-dev-server/client?http://localhost:8080/', // devServer.inline = true;
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
  devtool: 'source-map',
});

const compilerEmitter = new EventEmitter();

compiler.plugin('done', () => {
  compilerEmitter.emit('done');
});

const server = new WebpackDevServer(compiler, {
  contentBase: 'app',
  // inline: true,
});

server.listen(8080);

compilerEmitter.once('done', () => {
  spawn('npm', ['run', 'electron'], {
    env: Object.assign({}, process.env, {NODE_ENV: 'development'}),
  });
});
