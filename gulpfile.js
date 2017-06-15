var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    cssmin = require('gulp-minify-css');
//JS压缩
gulp.task('uglify', function() {
    return gulp.src('././public/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('././public/js/'));
});
//public-fancybox-js压缩
gulp.task('fancybox:js', function() {
    return gulp.src('././public/fancybox/jquery.fancybox.js')
        .pipe(uglify())
        .pipe(gulp.dest('././public/fancybox/'));
});
//public-fancybox-css压缩
gulp.task('fancybox:css', function() {
    return gulp.src('././public/fancybox/jquery.fancybox.css')
        .pipe(cssmin())
        .pipe(gulp.dest('././public/fancybox/'));
});
//CSS压缩
gulp.task('cssmin', function() {
    return gulp.src('././public/css/style.css')
        .pipe(cssmin())
        .pipe(gulp.dest('././public/css/'));
});
//图片压缩
gulp.task('images', function() {
    gulp.src('././public/img/*.*')
        .pipe(imagemin({
            progressive: false
        }))
        .pipe(gulp.dest('././public/img/'));
});
gulp.task('build', ['uglify', 'cssmin', 'fancybox:js', 'fancybox:css']);
