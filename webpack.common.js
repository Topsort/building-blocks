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
    // TODO(christophberbot) confirm if we need these?
    // https://preactjs.com/guide/v10/typescript#typescript-preactcompat-configuration
    // also would need similar "paths" in tsconfig.json
    // alias: {
    //   react: "preact/compat",
    //   "react-dom/test-utils": "preact/test-utils",
    //   "react-dom": "preact/compat",
    // },
    alias: {
      "@api": path.resolve(__dirname, "src/api/"),
      "@components": path.resolve(__dirname, "src/components/"),
      "@constants": path.resolve(__dirname, "src/constants"),
      "@context": path.resolve(__dirname, "src/context"),
      "@hooks": path.resolve(__dirname, "src/hooks/"),
      "@services": path.resolve(__dirname, "src/services/"),
      "@types": path.resolve(__dirname, "src/types"),
      "@utils": path.resolve(__dirname, "src/utils/"),
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
