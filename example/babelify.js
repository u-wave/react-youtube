/* eslint-disable */
const { Transform } = require('stream');
const babel = require('@babel/core');

module.exports = function (file) {
  let src = '';
  return new Transform({
    transform(chunk, enc, cb) {
      src += chunk;
      cb();
    },
    flush(cb) {
      babel.transform(src, { filename: file }, (err, res) => {
        if (err) cb(err);
        else {
          this.push(res.code);
          cb();
        }
      });
    },
  });
};
