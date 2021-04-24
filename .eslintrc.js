module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier", "plugin:prettier/recommended"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "no-underscore-dangle": "off",
    "import/prefer-default-export": "off",
    "import/extensions": "off",
    "no-await-in-loop": "off",
    "prefer-destructuring": "off",
    "no-restricted-syntax": ["error", "LabeledStatement", "WithStatement", "ForInStatement"],
  },
  settings: {
    "import/resolver": {
      node: {
        extensions: [".js", ".d.ts", ".ts"],
      },
    },
  },
};
