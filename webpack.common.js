/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

module.exports = {
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "style-loader",
            options: {
              /*
               * NOTE(christopherbot) Insert our stylesheets at the top to
               * ensure our styles can be extended by consumers. See:
               * https://webpack.js.org/loaders/style-loader/#insert-styles-at-top
               */
              /* eslint-disable no-var */
              insert: function insertAtTop(element) {
                var parent = document.querySelector("head");

                var lastInsertedElement =
                  window._lastElementInsertedByStyleLoader;

                if (!lastInsertedElement) {
                  parent.insertBefore(element, parent.firstChild);
                } else if (lastInsertedElement.nextSibling) {
                  parent.insertBefore(element, lastInsertedElement.nextSibling);
                } else {
                  parent.appendChild(element);
                }

                window._lastElementInsertedByStyleLoader = element;
              },
              /* eslint-enable no-var */
            },
          },
          "css-loader",
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    alias: {
      // `react` and `react-dom` aliases are necessary to use
      // React libraries in Preact. See:
      // https://github.com/preactjs/preact/issues/2150
      react: "preact/compat",
      "react-dom": "preact/compat",
      // "react-dom/test-utils": "preact/test-utils",
      "@api": path.resolve(__dirname, "src/api/"),
      "@components": path.resolve(__dirname, "src/components/"),
      "@constants": path.resolve(__dirname, "src/constants"),
      "@context": path.resolve(__dirname, "src/context"),
      "@hooks": path.resolve(__dirname, "src/hooks/"),
      "@services": path.resolve(__dirname, "src/services/"),
      "@state": path.resolve(__dirname, "src/state"),
      "@types": path.resolve(__dirname, "src/types"),
      "@utils": path.resolve(__dirname, "src/utils/"),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./demo/index.html"),
    }),
    new webpack.DefinePlugin({
      USE_MOCK_SERVER: JSON.stringify(process.env.USE_MOCK_SERVER),
    }),
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    library: {
      name: "TopsortBlocks",
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
