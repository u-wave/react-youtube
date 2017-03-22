import fs from 'fs';
import path from 'path';
import babel from 'rollup-plugin-babel';

const meta = require('./package.json');

// build a babel config that works for the rollup babel plugin
function getBabelConfig() {
  const babelrc = fs.readFileSync(path.join(__dirname, '.babelrc'), 'utf8');
  const babelConfig = JSON.parse(babelrc);
  babelConfig.presets[0] = ['es2015', { loose: true, modules: false }];
  babelConfig.plugins.push('external-helpers');
  babelConfig.babelrc = false;
  return babelConfig;
}

export default {
  entry: './src/index.js',
  targets: [
    { format: 'cjs', dest: meta.main, exports: 'named' },
    { format: 'es', dest: meta.module },
  ],

  external: Object.keys(meta.dependencies)
    .concat(Object.keys(meta.peerDependencies)),
  plugins: [
    babel(getBabelConfig()),
  ],
};
