---
title: NexT主题配置备份（二）
type: categories
categories: 笔记
tags:
  - NexT
  - 博客
copyright: true
date: '2017/06/30 10:55:34'
abbrlink: 654861fb
---

这篇博客是承接上一篇[Next主题配置备份](https://www.itswincer.com/posts/a40f8cd0/)，按照个人喜好做了一些修改。

### 加密文章

网上针对Hexo博客加密文章的办法有两种：

#### js的阻塞机制

在`themes->next->layout->_partials->head.swig`中的\<meta>标签后添加以下代码：

```javascript
<script>
    (function(){
        if('{{ page.password }}'){
            if (prompt('请输入文章密码', '') !== '{{ page.password }}'){
                alert('密码错误');
                history.back();
            }
        }
    })();
</script>
```

这里的`page`变量就是文章的首部：需要在首部自行添加`password`字段，再设置一个密码值：

```markdown
---
title: NexT主题配置备份（二）
type: categories
categories: 笔记
tags:
	- NexT
	- 博客
copyright: true
date: 2017/06/20 10:55:34
password: ffffff
---
```

当然这个并不是真的加密，用查源代码的方式还是能看出博客的内容，不过这已经可以阻挡绝大部分访客了。

#### crypto-js的AES加密

采用的是[hexo-encrypt](https://github.com/edolphin-ydf/hexo-encrypt)插件，原理见作者[博客](http://edolphin.site/2016/05/31/encrypt-post/)，这个就属于真正的加密了，不知道密码查看源代码就是一堆无法辨认的字符。

### 添加一言

使用效果见我的博客侧边栏的底部。

需要修改`themes->next->layout->_macro->sidebar.swig`，在倒数第三行的</div>后面加上：

```html
<div class = "cost"></div>
<script type="text/javascript" src="https://work.prinzeugen.net/hitokoto/hitokoto.php?encode=javascript"></script>
<div class="cost-inner"><script>hitokoto();</script></div>
```

然后修改`themes->next->source->css->_schemes->Pisces`，添加：

```css
.cost {
  margin-top: 10px;
}

.cost-inner {
  box-sizing: border-box;
  width: 240px;
  padding: 20px 10px;
  background: white;
  box-shadow: $box-shadow;
  border-radius: $border-radius;
}

```

### 压缩博客文章

这里采用的是`gulp`插件，hexo根目录新建`gulpfile.js`文件：

```javascript
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    del = require('del');
    rename = require('gulp-rename'),
    cssmin = require('gulp-minify-css');
    htmlclean = require('gulp-htmlclean');
    htmlmin = require('gulp-htmlmin');
    imagemin = require('gulp-imagemin');
    runSequence = require('run-sequence');
    Hexo = require('hexo');
    
//清除public
gulp.task('clean', function(){
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
        return cb()
    }).catch(function(err) {
        console.log(err);
        hexo.exit(err);
        return cb(err);
    })
})
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
        .pipe(gulp.dest('./public'))
});
// 同上，压缩图片，这里采用了： 最大化压缩效果。
gulp.task('minify-img-aggressive', function() {
    return gulp.src('./public/images/**/*.*')
        .pipe(imagemin(
        [imagemin.gifsicle({'optimizationLevel': 3}), 
        imagemin.jpegtran({'progressive': true}), 
        imagemin.optipng({'optimizationLevel': 7}), 
        imagemin.svgo()],
        {'verbose': true}))
        .pipe(gulp.dest('./public/images'))
})

// 用run-sequence并发执行，同时处理html，css，js，img
gulp.task('compress', function(cb) {
    runSequence(['minify-html', 'cssmin', 'uglify', 'fancybox:js', 'fancybox:css', 'minify-img-aggressive'], cb);
});
// 执行顺序： 清除public目录 -> 产生原始博客内容 -> 执行压缩混淆
gulp.task('build', function(cb) {
    runSequence('clean', 'generate', 'compress', cb)
});
gulp.task('default', ['build'])

```

需要用npm安装一些包：

```json
"del": "^3.0.0",
"gulp": "^3.9.1",
"gulp-clean-css": "^3.4.2",
"gulp-htmlclean": "^2.7.14",
"gulp-htmlmin": "^3.0.0",
"gulp-minify-css": "^1.2.4",
"gulp-rename": "^1.2.2",
"gulp-sourcemaps": "^2.6.0",
"gulp-uglify": "^3.0.0",
"run-sequence": "^1.2.2",
"gulp-imagemin": "^3.3.0",
```

在执行`gulp build`时，会自动执行`hexo clean`、`hexo g` ，这时直接 `hexo d`就行了。

这是网站优化后的结果：![](https://ws1.sinaimg.cn/large/ba22af52gy1fh33l1gzdxj20no08uaaj.jpg)