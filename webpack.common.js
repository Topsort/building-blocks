/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      // TODO(christopherbot) remove if we don't end up importing css
      // {
      //   test: /\.css$/i,
      //   use: ["style-loader", "css-loader"],
      // },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    // TODO(christophberbot) confirm if we need these?
    // https://preactjs.com/guide/v10/typescript#typescript-preactcompat-configuration
    // also would need similar "paths" in tsconfig.json
    // alias: {
    //   react: "preact/compat",
    //   "react-dom/test-utils": "preact/test-utils",
    //   "react-dom": "preact/compat",
    // },
    alias: {
      "@components": path.resolve(__dirname, "src/components/"),
      "@defaults": path.resolve(__dirname, "src/defaults"),
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
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
