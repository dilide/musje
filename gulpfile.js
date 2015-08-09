/* jshint node: true */

'use strict';

var gulp = require('gulp');
var jisonCli = require('gulp-jison-cli');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('jison', function () {
  return gulp.src('./src/parser/parser.jison')
    .pipe(jisonCli({
      'module-type': 'js'
    }))
    .pipe(gulp.dest('./.tmp/'));
});

gulp.task('parser', ['jison'], function() {
  return gulp.src([
      './src/parser/pre-parser.js',
      './.tmp/parser.js',
      './src/parser/post-parser.js'
    ])
    .pipe(concat('parser.js'))
    .pipe(gulp.dest('./.tmp/'));
});

gulp.task('build', ['parser'], function () {
  return gulp.src([
    './src/utilities.js',
    './src/model/makeClasses.js',
    './src/model/makeJSONSchema.js',  // only for development
    './src/model/model.js',
    './.tmp/parser.js',
    './src/renderer/svgPaths.js',
    './src/renderer/defs/TimeDef.js',
    './src/renderer/defs/AccidentalDef.js',
    './src/renderer/defs/PitchDef.js',
    './src/renderer/defs/DurationDef.js',
    './src/renderer/defs/Defs.js',
    './src/renderer/layout/layoutOptions.js',
    './src/renderer/layout/layout.js',
    './src/renderer/render/renderDuration.js',
    './src/renderer/render/render.js',
    './src/player.js'
    ])
    .pipe(sourcemaps.init())
      .pipe(concat('musje.js'))
    .pipe(sourcemaps.write('./.tmp/'))
    .pipe(gulp.dest('./'));
  });

gulp.task('default', ['build']);
