module.exports = {
  rules: {
    "no-console": 0,
    "no-native-reassign": 0
  },
  plugins: [
    "react"
  ],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
      experimentalObjectRestSpread: true
    }
  },
  env: {
    es6:   false,
    node:  true
  },
  extends: "eslint:recommended"
};