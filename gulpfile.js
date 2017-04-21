
// Node Plugins
var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var del = require('del');

// CSS
gulp.task('css', function () {
	gulp.src('_dev/css/feref_video.css')
	.pipe(rename({suffix: '.min'}))
	.pipe(minifycss())
	.pipe(gulp.dest('_dist/css'))
});

// JS
gulp.task('js', function() {
	return gulp.src('_dev/js/feref_video.js')
	.pipe(gulp.dest('_dev/js'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify().on('error', function(e){
		console.log(e);
	}))
	.pipe(gulp.dest('_dist/js'));
});

// IMG
gulp.task('img', function() {
	return gulp.src('_dev/img/**/*')
	.pipe(gulp.dest('_dist/img'));
});

// Clean
gulp.task('clean', function() {
	return del([
		'_dist/css/**/*',
		'_dist/js/**/*',
		'_dist/img/**/*'
	]);
});

// Default
gulp.task('default', ['clean'], function() {
	gulp.start('css', 'js', 'img');
});

// Watch
gulp.task('watch', function() {
	gulp.watch('_dev/css/**/style.css', ['css']);
	gulp.watch('_dev/js/**/scripts.js', ['js']);
	gulp.watch('_dev/img/**/*', ['img']);
});