var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var env = process.env.WEBPACK_ENV;

var path = require("path");
module.exports = {
  entry: {
    app: ["./app/main.jsx"]
  },
  output: {
    library: 'see-cda',
    libraryTarget: 'umd',
    filename: "./see-cda.js",
    path: 'dist',
    publicPath: '/'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('PRODUCTION')
    }),
    new UglifyJsPlugin({
      include: /\.min\.js$/,
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        loaders: ['babel'],
        exclude: /node_modules/,
      },
      { test: /\.css$/, loader: "style!css" },
      { test: /\.png$/, loader: "url-loader?limit=100000" },
      { test: /\.jpg$/, loader: "file-loader" }
    ]
  }
};
