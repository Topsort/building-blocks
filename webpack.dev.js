/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = merge(common, {
  mode: "development",
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./demo/index.html"),
    }),
  ],
  devServer: {
    host: "localhost",
    port: 8080,
    open: true,
    hot: true,
    watchFiles: ["src/**/*", "demo/**/*"],
    static: [
      {
        directory: path.resolve(__dirname, "./demo"),
        publicPath: "/",
      },
      {
        directory: path.resolve(__dirname, "./dist"),
        publicPath: "/dist",
      },
    ],
  },
});
