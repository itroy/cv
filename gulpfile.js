/* file: gulpfile.js */

/*

The gulp api is incredibly light containing 4 top level functions. They are

gulp.task : defines your tasks.

gulp.task('dependenttask', ['mytask'], function() {
  //do stuff after 'mytask' is done.
});

gulp.src : points to the files we want to use.
gulp.dest : points to the output folder we want to write files to.
gulp.watch : run tasks when a file or files are changed

*/

// gulp core packages
var gulp            = require('gulp'),
    gutil           = require('gulp-util');

// gulp packages
var jshint          = require('gulp-jshint'),
    htmlmin         = require('gulp-htmlmin'),
    sass            = require('gulp-sass'),
    sourcemaps      = require('gulp-sourcemaps'),
    concat          = require('gulp-concat'),
    uglify          = require('gulp-uglify'),
    livereload      = require('gulp-livereload'),
    webserver       = require('gulp-webserver');

// helper variables
var input = {
        'sass'          : 'source/scss/**/*.scss',
        'javascript'    : 'source/javascript/**/*.js',
        'html'          : 'source/**/*.html',
        'vendorjs'      : 'public/assets/javascript/vendor/**/*.js'
    },

    output = {
        'stylesheets' : 'public/assets/stylesheets',
        'javascript' : 'public/assets/javascript',
        'html' : 'public/'
    };



// run watch tast when gulp is called without arguements
gulp.task('default', ['jshint','build-css','build-js','watch','webserver']);

// configure the jshint task
gulp.task('jshint', function() {
    return gulp.src(input.javascript)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// build the css from sass & create sourcemaps
gulp.task('build-css', function() {
    return gulp.src(input.sass)
        .pipe(sourcemaps.init()) // Process the original sources
            .pipe(sass())
        .pipe(sourcemaps.write()) // Add the map to the modified source
        .pipe(gulp.dest(output.stylesheets))
});

// concat and minify javascript
gulp.task('build-js', function() {
    return gulp.src(input.javascript)
        .pipe(sourcemaps.init())
            .pipe(concat('bundle.js'))
            // only uglify if gulp is ran with '--type production'
            .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(output.javascript));
});

gulp.task('build-html', function() {
    return gulp.src(input.html)
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(output.html))
});

// configure which files to watch and what tasks to use on file change
gulp.task('watch', function() {
    gulp.watch(input.javascript, ['jshint', 'build-js']);
    gulp.watch(input.sass, ['build-css']);
    gulp.watch(input.html, ['build-html']);
});

gulp.task('webserver', function() {
    gulp.src('public')
        .pipe(webserver({
            livereload: true,
            directoryListing: false,
            open: true,
            fallback: 'index.html'
        }));
});
