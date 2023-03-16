/* eslint-disable @typescript-eslint/no-var-requires */
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");

module.exports = (algo) => {
  console.log({ algo });
  return merge(common, {
    mode: "production",
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "./demo/index.html"),
      }),
      new CopyPlugin({
        patterns: [
          { from: "./demo/loader.js" },
          { from: "./demo/topsortedProducts.js" },
        ],
      }),
    ],
    module: {
      rules: [
        {
          test: /loader\.js/,
          loader: "string-replace-loader",
          options: {
            multiple: [
              {
                search: "demo-api-key",
                replace: JSON.stringify(process.env.DEMO_API_KEY),
              },
              {
                search: "demo-external-id",
                replace: JSON.stringify(process.env.DEMO_EXTERNAL_ID),
              },
            ],
          },
        },
      ],
    },
  });
};
