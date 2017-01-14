const {spawn} = require('child_process');
const {EventEmitter} = require('events');
const {join, resolve} = require('path');

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const compiler = webpack({
  entry: [
    'webpack-dev-server/client?http://localhost:8080/', // devServer.inline = true;
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
  devtool: 'source-map',
});

const compilerEmitter = new EventEmitter();

compiler.plugin('done', () => {
  compilerEmitter.emit('done');
});

const server = new WebpackDevServer(compiler, {
  contentBase: 'app',
  // inline: true,
  publicPath: '/gui/',
});

server.listen(8080);

compilerEmitter.once('done', () => {
  spawn('npm', ['run', 'electron'], {
    env: Object.assign({}, process.env, {NODE_ENV: 'development'}),
  });
});
