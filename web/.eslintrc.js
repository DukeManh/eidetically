// .eslintrc.js
module.exports = {
  root: true,
  parserOptions: { ecmaVersion: 8 },
  parser: '@typescript-eslint/parser',
  settings: {
    react: { version: 'detect' },
    'import/resolver': {
      typescript: {},
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended', // TypeScript rules
    'plugin:react/recommended', // React rules
    'plugin:react-hooks/recommended', // React hooks rules
    'plugin:jsx-a11y/recommended', // Accessibility rules
    'plugin:prettier/recommended',
  ],
  rules: {
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    // We will use TypeScript's types for component props instead
    'react/prop-types': 'off',

    // No need to import React when using Next.js
    'react/react-in-jsx-scope': 'off',

    // This rule is not compatible with Next.jss <Link /> components
    'jsx-a11y/anchor-is-valid': 'off',

    // Why would you want unused vars?
    '@typescript-eslint/no-unused-vars': 'warn',

    // I suggest this setting for requiring return types on functions only where useful
    '@typescript-eslint/explicit-function-return-type': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.ts', '.tsx'] }],

    '@typescript-eslint/explicit-module-boundary-types': 'off',

    'react/no-unescaped-entities': 'off',

    'no-empty-function': 'off',
    '@typescript-eslint/no-empty-function': ['off'],
    '@typescript-eslint/no-non-null-assertion': ['off'],
  },
};
