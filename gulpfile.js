const gulp = require('gulp');
const babel = require('gulp-babel');
const newer = require('gulp-newer');
const plumber = require('gulp-plumber');
const watch = require('gulp-watch');
const through = require('through2');
const log = require('gulp-util').log;
const colors = require('gulp-util').colors;
const relative = require('path').relative;
const rollup = require('rollup').rollup;
const rollupBabel = require('rollup-plugin-babel');
const readFileSync = require('fs').readFileSync;
const joinpath = require('path').join;
const meta = require('./package.json');

const src = 'src/**/*.js';
const dest = 'lib/';

gulp.task('default', ['build', 'dist']);

// build a babel config that works for the rollup babel plugin
function rollupBabelConfig() {
  const babelrc = readFileSync(joinpath(__dirname, '.babelrc'), 'utf8');
  const babelConfig = JSON.parse(babelrc);
  babelConfig.presets[0] = ['es2015', { loose: true, modules: false }];
  babelConfig.plugins.push(
    'external-helpers',
    ['transform-react-remove-prop-types', { mode: 'wrap' }]);
  babelConfig.babelrc = false;
  return babelConfig;
}

gulp.task('dist', () =>
  rollup({
    entry: './src/index.js',
    plugins: [
      rollupBabel(rollupBabelConfig()),
    ],
    external: Object.keys(meta.dependencies),
  }).then(bundle => Promise.all([
    bundle.write({
      format: 'cjs',
      exports: 'named',
      dest: 'lib/rollup.js',
    }),
    bundle.write({
      format: 'es',
      dest: 'lib/rollup.es.js',
    }),
  ])));

gulp.task('build', () =>
  gulp.src(src)
    .pipe(plumber())
    .pipe(newer(dest))
    .pipe(through.obj((file, enc, cb) => {
      const path = relative(__dirname, file.path);
      log(`Compiling '${colors.cyan(path)}'...`);
      cb(null, file);
    }))
    .pipe(babel())
    .pipe(gulp.dest(dest)));

gulp.task('watch', ['build'], () => {
  watch(src, () => {
    gulp.start('build');
  });
});
