module.exports = {
  extends: 'airbnb',
  parserOptions: {
    ecmaVersion: 2021,
  },
  rules: {
    // I disagree
    'react/require-default-props': 'off',
    // I disagree
    'react/function-component-definition': ['error', {
      namedComponents: 'function-declaration',
      unnamedComponents: 'arrow-function',
    }],
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'jsx-a11y/label-has-for': ['error', {
      components: [],
      required: {
        some: ['nesting', 'id'],
      },
      allowChildren: false,
    }],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      extends: ['airbnb-typescript'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
};
