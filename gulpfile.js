'use strict';

var gulp     = require('gulp');
var concat   = require('gulp-concat');
var htmlmin  = require('gulp-htmlmin');
var wrapper  = require('gulp-wrapper');
var template = require('gulp-underscore-template');
var watch    = require('gulp-watch');
var plumber  = require('gulp-plumber');

gulp.task('tpl', function() {
	gulp.src('./WEB-INF/templates/*.html')
	    .pipe(htmlmin({
		    collapseWhitespace: true,
		    conservativeCollapse: true
	    }))
        .pipe(plumber())
	    .pipe(template())
	    .pipe(concat('templates.js'))
	    .pipe(wrapper({
		    header: 'define(function(require, exports, module){',
		    footer: '});'
	    }))
	    .pipe(gulp.dest('./resources/js/common'));
});

gulp.task('watch-tpl', function() {
	watch('./WEB-INF/templates/*.html', function() {
		gulp.start('tpl');
	});
});

gulp.task('default', ['watch-tpl']);
