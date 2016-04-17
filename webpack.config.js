var path = require("path");
module.exports = {
  entry: {
    app: ["./app/main.jsx"]
  },
  output: {
    libraryTarget: 'umd',
    filename: "./bundle.js"
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        loaders: ['babel'],
        exclude: /node_modules/,
      },
      { test: /\.css$/, loader: "style-loader!css-loader" }
    ]
  }
};
