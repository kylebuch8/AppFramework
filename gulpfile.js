var gulp = require('gulp');
var concat = require('gulp-concat-util');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var del = require('del');
var runSequence = require('run-sequence');
var dir = require('node-dir');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var iife = require('gulp-iife');
var cssmin = require('gulp-cssmin');

var modules;

gulp.task('sass', function () {
    return gulp.src('./sass/main.scss')
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('./dist'))
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function (cb) {
    del(['./dist/**/*'], cb);
});

gulp.task('getModules', function (cb) {
    modules = [];

    dir.readFiles('./src', {
        match: /.js$/,
        exclude: /_spec.js$/
    }, function (err, content, next) {
        var re = /angular\.module\('(app-framework.*?)',(.*?)/,
            result = re.exec(content);

        if (result && result[1]) {
            modules.push(result[1]);
        }

        next();
    }, function () {
        modules = modules.join('\',\'');
        cb();
    });
});

gulp.task('minify', function () {
    gulp.src(['./src/**/*.js', '!./src/**/*_spec.js'])
        .pipe(gulp.dest('./dist/src'))
        .pipe(sourcemaps.init())
        .pipe(concat('app-framework.concat.js'))
        .pipe(concat.header('angular.module(\'app-framework\', [\'' + modules + '\']);\n'))
        .pipe(iife())
        .pipe(rename('app-framework.js'))
        .pipe(gulp.dest('./dist'))
        .pipe(uglify())
        .pipe(rename('app-framework.min.js'))
        .pipe(sourcemaps.write('./', { sourceRoot: 'src'}))
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function (cb) {
    del(['./dist/**/*'], cb);
});

gulp.task('build', function (cb) {
    runSequence(
        ['getModules', 'clean'],
        ['minify', 'sass']
    );
});

gulp.task('default', []);
