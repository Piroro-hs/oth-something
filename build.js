const {resolve} = require('path');

const webpack = require('webpack');

const compiler = webpack([
  {
    entry: [
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
  },
  {
    entry: [
      './src/cui.js',
    ],
    output: {
      path: resolve('app', 'cui'),
      filename: 'cui.js',
      library: 'cui',
      libraryTarget: 'commonjs-module',
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
    target: 'node',
  },
]);

compiler.run(() => {});
