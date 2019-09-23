module.exports = {
  plugins: ['react', 'import', 'flowtype', 'jsx-a11y', 'jest'],
  parser: 'babel-eslint',
  env: {
    browser: true,
    mocha: true,
    node: true,
    'jest/globals': true,
  },
  extends: [
    './rules/best-practices',
    './rules/errors',
    './rules/style',
    './rules/variables',
    './rules/react',
    './rules/jest',
    './rules/es6',
    './rules/flowtype',
  ].map(require.resolve),
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      experimentalObjectRestSpread: true,
      legacyDecorators: true,
    },
  },
  rules: {
    strict: 'error',
    'comma-dangle': ['error', 'always-multiline'],
    semi: 'off',
    indent: 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    'react/jsx-closing-bracket-location': 'off',
  },
};
