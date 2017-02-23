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
    path: resolve('app', 'gui'),
    filename: 'index.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)/,
        include: [
          resolve(__dirname, 'src'),
        ],
        loader: 'babel-loader',
      },
    ],
  },
  target: 'electron-renderer',
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
