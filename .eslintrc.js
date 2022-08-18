module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "preact",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "object-shorthand": "error",
    "no-duplicate-imports": "error",

    // Disabled rules from @typescript-eslint
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
  },
  // overrides: [
  //   {
  //     files: ["*.js"],
  //     rules: {
  //       "@typescript-eslint/no-var-requires": "off",
  //     },
  //   },
  // ],
  settings: {
    react: {
      // eslint-plugin-preact interprets this as "h.createElement",
      // however we only care about marking h() as being a used variable.
      pragma: "h",
    },
  },
};
