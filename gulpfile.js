const async = require('async');
const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const consolidate = require('gulp-consolidate');
const rename = require('gulp-rename');
const runTimestamp = Math.round(Date.now()/1000);
const clean = require('gulp-clean');
const browserSync = require('browser-sync');
const config = require('./config');

const src = './src/';
const dist = './dist/';

const path = {
  svgs: src + 'svgs/*.svg',
  fonts: dist + 'fonts/',
  fontUrl: './fonts/'
};

const transform = (name, path, types) =>
 types.reduce((obj, type) => {
   obj[type] = `${path}${name}.${type}`
   return obj
 }, {});

const fontName = config.fontName;
const className = config.className;
const inputName = config.inputName;
const outputName = config.outputName;



const fileTypes = ['css', 'html', 'json'];

const inputs = transform(inputName, src, fileTypes);
const outputs = transform(outputName, '', fileTypes);

gulp.task('iconfont', function (done) {
  const iconStream = gulp.src(path.svgs)
    .pipe(iconfont({
      fontName: fontName,
      prependUnicode: true,
      formats: ['ttf', 'woff', 'woff2'],
      timestamp: runTimestamp,
      normalize: true,
      fontHeight: 1000,
      startUnicode: 0xE000
    }));

  async.parallel([
    function handleGlyphs (cb) {
      iconStream.on('glyphs', function (glyphs) {
        var options = {
          glyphs: glyphs,
          fontName: fontName,
          outputName: outputName,
          fontPath: path.fontUrl,
          className: className,
        };
        gulp.src(inputs.css)
          .pipe(consolidate('lodash', options))
          .pipe(rename(outputs.css))
          .pipe(gulp.dest(dist));
        gulp.src(inputs.html)
          .pipe(consolidate('lodash', options))
          .pipe(rename(outputs.html))
          .pipe(gulp.dest(dist));
        gulp.src(inputs.json)
          .pipe(consolidate('lodash', options))
          .pipe(rename(outputs.json))
          .pipe(gulp.dest(dist))
          .on('finish', cb);
      });
    },
    function handleFonts (cb) {
      iconStream
        .pipe(gulp.dest(path.fonts))
        .on('finish', cb);
    }
  ], done);
});

gulp.task('clean', function (cb) {
  gulp.src(dist)
  .pipe(clean({ force: true }));
  cb();
});

gulp.task('server', ['iconfont'], function () {
  browserSync.init({
    server: {
      baseDir: dist,
      index: outputName + '.html'
    }
  });
  gulp.watch('src/**/*.svg', {
    interval: 500
  },
  ['iconfont', browserSync.reload]);
});


gulp.task('dev', ['clean', 'iconfont', 'server']);

gulp.task('build', ['clean', 'iconfont']);