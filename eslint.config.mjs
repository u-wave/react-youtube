import js from '@eslint/js';
import ts from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import vitest from '@vitest/eslint-plugin';

export default [
  { ignores: ['coverage/**', 'dist/**', 'example/dist/**'] },

  js.configs.recommended,
  ts.configs.eslintRecommended,
  ...ts.configs.recommended,
  vitest.configs.recommended,

  react.configs.flat.recommended,
  react.configs.flat['jsx-runtime'],
  reactHooks.configs.flat['recommended-latest'],
  jsxA11y.flatConfigs.recommended,
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
