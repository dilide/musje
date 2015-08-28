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
      './src/model/makeClasses-arrayConstructors.js',
      './src/model/makeJSONSchema.js',  // only for development
      './src/model/model.js',
      './src/model/Score.js',
      './src/model/Cell.js',

      './src/parser/pre-parser.js',
      './.tmp/parser.js',
      './src/parser/post-parser.js',

      './src/renderer/svgPaths.js',
      './src/renderer/Defs/defIds.js',
      './src/renderer/Defs/Defs.js',
      './src/renderer/Defs/Defs.BarDef.js',
      './src/renderer/Defs/Defs.TimeDef.js',
      './src/renderer/Defs/Defs.AccidentalDef.js',
      './src/renderer/Defs/Defs.PitchDef.js',
      './src/renderer/Defs/Defs.DurationDef.js',

      './src/renderer/Layout/Layout.js',
      './src/renderer/Layout/Layout.options.js',
      './src/renderer/Layout/Layout.Svg.js',
      './src/renderer/Layout/Layout.Body.js',
      './src/renderer/Layout/Layout.Header.js',
      './src/renderer/Layout/Layout.Content.js',
      './src/renderer/Layout/Layout.System.js',
      './src/renderer/Layout/TimewiseMeasure.js',
      './src/renderer/Layout/Cell.js',
      './src/renderer/Layout/MusicData.js',

      './src/renderer/Renderer/Renderer.js',
      './src/renderer/Renderer/Renderer.renderBar.js',
      './src/renderer/Renderer/Renderer.renderDuration.js',

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


gulp.task('demo', ['build'], function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    startPath: '/demo/',
  });

  gulp.watch('src/parser/parser.jison', function () {
    runSequence('jison', 'concat', browserSync.reload);
  });
  gulp.watch('src/**/*.js', function () {
    runSequence('concat', browserSync.reload);
  });
  gulp.watch('musje.css', function () {
    gulp.src('musje.css')
      .pipe(browserSync.stream());
  });
  gulp.watch('demo/main.css', function () {
    gulp.src('demo/main.css')
      .pipe(browserSync.stream());
  });
  gulp.watch(['demo/*.html', 'demo/main.js'])
    .on('change', browserSync.reload);
});


gulp.task('default', ['build']);
