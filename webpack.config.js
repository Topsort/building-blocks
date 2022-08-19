/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");
/* eslint-enable @typescript-eslint/no-var-requires */

module.exports = {
  entry: "./src/index.tsx",
  mode: "production",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    // TODO(christophberbot) confirm if we need these?
    // alias: {
    //   react: "preact/compat",
    //   "react-dom/test-utils": "preact/test-utils",
    //   "react-dom": "preact/compat",
    // },
    alias: {
      "@components": path.resolve(__dirname, "src/components/"),
    },
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: {
      name: "TopsortElements",
      type: "umd",
      export: "default",
    },
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./demo/index.html"),
    }),
  ],
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  devServer: {
    host: "localhost",
    port: 8080,
    open: true,
    watchFiles: ["src/**/*", "demo/**/*"],
    // https: true,
    // static: {
    //   directory: path.join(__dirname, "dist"),
    // },
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
};
