var path = require("path");
module.exports = {
  entry: {
    app: ["./app/main.jsx"]
  },
  output: {
    libraryTarget: 'umd',
    filename: "./dist/see-cda.js"
  },
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
