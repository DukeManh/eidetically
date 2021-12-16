module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'func-names': 'off',
    'no-console': 'off',
    'prefer-arrow-callback': 'warn',
    'no-unused-vars': 'warn',
    'no-nested-ternary': 'off',
  },
};
