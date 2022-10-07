/* eslint-disable @typescript-eslint/no-var-requires */
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./demo/index.html"),
    }),
    new CopyPlugin({
      patterns: [
        { from: "./demo/loader.js" },
        { from: "./demo/lumaProducts.js" },
      ],
    }),
  ],
});
