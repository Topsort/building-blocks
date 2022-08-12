const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  mode: "production",
  // entry: "./",
  // mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "topsort-elements.js",
    library: {
      name: "TopsortElements",
      type: "umd",
    },
    clean: true,
  },
  // plugins: [
  //   new HtmlWebpackPlugin({
  //     title: "Topsort Elements",
  //   }),
  // ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  devServer: {
    host: "localhost",
    port: 8080,
    open: true,
    // https: true,
    // static: {
    //   directory: path.join(__dirname, "dist"),
    // },
    static: {
      directory: path.resolve(__dirname, "./dist"),
      publicPath: "/dist",
    },
  },
};