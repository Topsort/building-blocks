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
  globals: {
    USE_MOCK_SERVER: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    "object-shorthand": "error",
    "no-duplicate-imports": "error",

    /*
     * Disabling this rule because it unnecessarily flags unused vars
     * in function type definitions, and actual unused vars are still
     * caught by the typescript-eslint/no-unused-vars rule.
     */
    "no-unused-vars": "off",

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
    jest: {
      version: "latest",
    },
  },
};
