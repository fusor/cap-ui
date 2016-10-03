const webpack = require('webpack');
const path = require('path');

const projRoot = path.join(__dirname, '..');
const clientRoot = path.join(projRoot, 'client');
const buildDir = path.join(projRoot, 'build');
const sharedStylesDir = path.join(clientRoot, 'shared', 'styles');

const wpConfig = {
  debug: true,
  devtool: 'source-map',
  entry: [
    'webpack-hot-middleware/client',
    path.join(clientRoot, 'Main')
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['babel'],
        include: clientRoot,
        exclude: /test.*spec.js$/
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css?sourceMap', 'sass?sourceMap'],
        include: clientRoot
      }
    ]
  },
  output: {
    filename: 'cap_ui.js',
    path: buildDir,
    // http://stackoverflow.com/questions/28846814/what-does-publicpath-in-webpack-do
    // WP needs to know where the generated bundle will be hosted so it can request
    // chunks or references files loaded with certain loaders.
    publicPath: '/public/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  resolve: {
    root: clientRoot,
    extensions: ['', '.jsx', '.js']
  },
  sassLoader: {
    includePaths: [sharedStylesDir]
  }
};

module.exports = wpConfig;
