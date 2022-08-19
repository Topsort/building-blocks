module.exports = {
  presets: [
    "@babel/preset-env",
    // TODO(christopherbot) confirm if we need preset-react
    // @babel/preset-react
    ["@babel/preset-typescript", { jsxPragma: "h" }],
  ],
  plugins: [
    [
      "@babel/plugin-transform-react-jsx",
      {
        pragma: "h",
        pragmaFrag: "Fragment",
      },
    ],
  ],
};
