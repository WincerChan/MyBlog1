var gulp = require('gulp'),
    del = require('del'),
    htmlclean = require('gulp-htmlclean'),
    htmlmin = require('gulp-htmlmin'),
    Hexo = require('hexo');

//清除public
gulp.task('clean', async () => {
    await del(['public/**/*']);
});
// 利用Hexo API 来生成博客内容， 效果和在命令行运行： hexo g 一样
// generate html with 'hexo generate'
var hexo = new Hexo(process.cwd(), {});
gulp.task('generate', async (cb) => {
    await hexo.init().then(function () {
        return hexo.call('generate', {
            watch: false
        });
    }).then(function () {
        return hexo.exit();
    }).then(function () {
        return cb();
    }).catch(function (err) {
        console.log(err);
        hexo.exit(err);
        return cb(err);
    });
});

// 压缩public目录下的所有html
gulp.task('minify-html', async () => {
    await gulp.src('./public/**/*.html')
        .pipe(htmlclean())
        .pipe(htmlmin({
            removeComments: true,
            minifyJS: true,
            minifyCSS: true,
            minifyURLs: true,
            collapseWhitespace: true,
        }))
        .pipe(gulp.dest('./public'));
});
gulp.task('default', gulp.series('clean', 'generate', 'minify-html', async (cb) => {
    await gulp.series(cb)
}));
