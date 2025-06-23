module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential', 
    'eslint:recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'error',
    'semi': ['off', 'always'],
    'prefer-promise-reject-errors': ['error', { 'allowEmptyReject': true }],
    'no-trailing-spaces': ['error', { 'skipBlankLines': true }],
    'prefer-const': ['off'],
    'quote-props': ['off'],
    'object-curly-spacing': ['off'],
    'dot-notation': ['off'],
    'lines-between-class-members': ['off'],
    'no-undef': ['off', 'always'],
    'no-unused-vars': ['off', 'always'],
    'no-new-func': ['off', 'always'],
    'no-prototype-builtins': 'off',
    'array-callback-return': 'off',
    'no-useless-escape': 'off',
    'no-eval': 'off',
    'no-useless-call': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/no-mutating-props': 'off',
    'no-unused-vars': 'off',
    'vue/no-unused-vars': 'off',
    'no-new-object': 'off',
    'no-undef': 'off',
    'vue/no-v-model-argument': 'off',
    'camelcase': 'off',
    'no-template-curly-in-string': 'off',
    'vue/no-v-for-template-key': 'off',
    'vue/valid-v-for': 'off',
    'vue/no-unused-components': 'off',
    'vue/no-export-in-script-setup' :'off',
    'vue/return-in-computed-property' : 'off',
    'vue/no-multiple-template-root': 'off'
  },
  plugins: [
    "prettier",
    "sort-keys"
  ],
  overrides: [
    {
      files: [
        '**/__tests__/*.{j,t}s?(x)',
        '**/tests/unit/**/*.spec.{j,t}s?(x)'
      ],
      env: {
        jest: true
      }
    },
    {
      files: ["src/lang/*.js"],
      rules: {
        'sort-keys/sort-keys-fix': 1,
        'sort-keys': ['error', 'asc', {'caseSensitive': true, 'natural': false}],
      }
    }
  ]
}
