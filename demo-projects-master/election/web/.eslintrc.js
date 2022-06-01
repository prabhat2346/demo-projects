module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:react/recommended', 'google', 'prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier', 'react-hooks', 'import'],
  rules: {
    'require-jsdoc': 0,
    'prettier/prettier': 0,
    'no-invalid-this': 0,
    'react/prop-types': 0,
    quotes: [0, "single", { "avoidEscape": true }],
    'react-hooks/rules-of-hooks': 'warn',
    'react-hooks/exhaustive-deps': 'error',
    'import/no-unresolved': [2, {commonjs: true, amd: true}],
    'import/named': 2,
    'import/default': 2,
    'import/export': 2,
    'import/order': [
      0,
      {
        groups: [
          'index',
          'sibling',
          'parent',
          'internal',
          'external',
          'builtin',
        ],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
