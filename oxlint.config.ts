import { defineConfig } from 'oxlint';

export default defineConfig({
  plugins: [
    'eslint',
    'import',
    'jsx-a11y',
    'react',
    'react-perf',
    'typescript',
    'vitest',
  ],
});
