var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    cssmin = require('gulp-minify-css'),
    htmlclean = require('gulp-htmlclean'),
    htmlmin = require('gulp-htmlmin'),
    imagemin = require('gulp-imagemin'),
    runSequence = require('run-sequence'),
    Hexo = require('hexo');

//清除public
gulp.task('clean', function() {
    return del(['public/**/*']);
});
// 利用Hexo API 来生成博客内容， 效果和在命令行运行： hexo g 一样
// generate html with 'hexo generate'
var hexo = new Hexo(process.cwd(), {});
gulp.task('generate', function(cb) {
    hexo.init().then(function() {
        return hexo.call('generate', {
            watch: false
        });
    }).then(function() {
        return hexo.exit();
    }).then(function() {
        return cb();
    }).catch(function(err) {
        console.log(err);
        hexo.exit(err);
        return cb(err);
    });
});
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

// 压缩public目录下的所有html
gulp.task('minify-html', function() {
    return gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
        }))
        .pipe(gulp.dest('./public'));
});
// 同上，压缩图片，这里采用了： 最大化压缩效果。
gulp.task('minify-img-aggressive', function() {
    return gulp.src('./public/img/*.*')
        .pipe(imagemin(
            [imagemin.gifsicle({
                    'optimizationLevel': 3
                }),
                imagemin.jpegtran({
                    'progressive': true
                }),
                imagemin.optipng({
                    'optimizationLevel': 7
                }),
                imagemin.svgo()
            ], {
                'verbose': true
            }))
        .pipe(gulp.dest('./public/img'));
})
gulp.task('minify-img-cover', function() {
    return gulp.src('./public/life/cover/*.*')
        .pipe(imagemin(
            [imagemin.gifsicle({
                'optimizationLevel': 3
            }),
             imagemin.jpegtran({
                 'progressive': true
             }),
             imagemin.optipng({
                 'optimizationLevel': 7
             }),
             imagemin.svgo()
            ], {
                'verbose': true
            }))
        .pipe(gulp.dest('./public/life/cover'));
})
// 用run-sequence并发执行，同时处理html，css，js，img
gulp.task('compress', function(cb) {
    runSequence(['minify-img-aggressive'], cb);
});
// 执行顺序： 清除public目录 -> 产生原始博客内容 -> 执行压缩混淆
gulp.task('build', function(cb) {
    runSequence('clean', 'generate', 'compress', cb);
});
gulp.task('default', ['build']);
