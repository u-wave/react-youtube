import babel from '@rollup/plugin-babel';

const meta = require('./package.json');

export default {
  input: './src/index.js',
  output: [
    { format: 'cjs', file: meta.exports['.'].require, exports: 'named' },
    { format: 'esm', file: meta.exports['.'].import },
  ],

  external: Object.keys(meta.dependencies)
    .concat(Object.keys(meta.peerDependencies)),
  plugins: [
    babel({
      babelHelpers: 'bundled',
    }),
  ],
};
