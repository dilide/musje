/* jshint node: true */

'use strict';

var gulp = require('gulp');
var runSequence = require('run-sequence');
var jisonCli = require('gulp-jison-cli');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();

gulp.task('jison', function () {
  return gulp.src('./src/parser/parser.jison')
    .pipe(jisonCli({
      'module-type': 'js'
    }))
    .pipe(gulp.dest('./.tmp/'));
});

gulp.task('concat', function () {
  return gulp.src([
      './src/utilities.js',
      './src/model/makeClasses.js',
      './src/model/makeJSONSchema.js',  // only for development
      './src/model/model.js',
      './src/model/Score.makeBeams.js',
      './src/parser/pre-parser.js',
      './.tmp/parser.js',
      './src/parser/post-parser.js',
      './src/renderer/svgPaths.js',
      './src/renderer/defs/TimeDef.js',
      './src/renderer/defs/AccidentalDef.js',
      './src/renderer/defs/PitchDef.js',
      './src/renderer/defs/DurationDef.js',
      './src/renderer/defs/Defs.js',
      './src/renderer/layout/layoutOptions.js',
      './src/renderer/layout/Layout.js',
      './src/renderer/layout/Layout.Svg.js',
      './src/renderer/layout/Layout.Body.js',
      './src/renderer/layout/Layout.Header.js',
      './src/renderer/layout/Layout.Content.js',
      './src/renderer/layout/Layout.makeSystems.js',
      './src/renderer/Renderer.js',
      './src/renderer/Renderer.renderDuration.js',
      './src/player.js'
    ])
    .pipe(sourcemaps.init())
      .pipe(concat('musje.js'))
    .pipe(sourcemaps.write('./.tmp/'))
    .pipe(gulp.dest('./'));
});

gulp.task('build', function () {
  runSequence('jison', 'concat');
});

gulp.task('concat-watch', ['concat'], function () {
  browserSync.reload();
});
gulp.task('jison-watch', ['jison'], function () {
  browserSync.reload();
});


gulp.task('demo', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    startPath: '/demo/',
  });

  gulp.watch('src/parser/parser.jison', ['jison-watch']);
  gulp.watch('src/**/*.js', ['concat-watch']);
  gulp.watch('demo/main.css', function () {
    gulp.src('demo/main.css')
      .pipe(browserSync.stream());
  });
  gulp.watch(['demo/*.html', 'demo/main.js'])
    .on('change', browserSync.reload);
});


gulp.task('default', ['build']);
