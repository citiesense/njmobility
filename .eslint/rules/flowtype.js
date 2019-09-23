module.exports = {
  parser: 'babel-eslint',
  plugins: ['flowtype'],
  rules: {
    // If it is 'boolean' then a problem is raised when using bool instead of boolean.
    'flowtype/boolean-style': [2, 'boolean'],
    // Marks Flow type identifiers as defined.
    'flowtype/define-flow-type': 1,

    // Enforces consistent use of trailing commas in Object and Tuple annotations.
    'flowtype/delimiter-dangle': [2, 'always-multiline'],

    // Enforces consistent spacing within generic type annotation parameters.
    'flowtype/generic-spacing': [0, 'never'],
    'flowtype/no-weak-types': 0,
    'flowtype/require-parameter-type': 0,
    'flowtype/require-return-type': [
      0,
      'always',
      {
        annotateUndefined: 'never',
      },
    ],
    'flowtype/require-valid-file-annotation': 2,
    'flowtype/semi': [0, 'always'],
    // 'flowtype/space-after-type-colon': [
    //   2,
    //   'always'
    // ],
    'flowtype/space-before-generic-bracket': [2, 'never'],
    // 'flowtype/space-before-type-colon': [
    //   2,
    //   'never'
    // ],
    'flowtype/type-id-match': [0, '^([A-Za-z0-9]+)+T$'],
    'flowtype/union-intersection-spacing': [2, 'always'],
    'flowtype/use-flow-type': 1,
    'flowtype/valid-syntax': 1,
  },

  settings: {
    flowtype: {
      // When true, only checks files with a @flow annotation in the first comment.
      onlyFilesWithFlowAnnotation: true,
    },
  },
};
