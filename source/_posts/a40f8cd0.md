---
title: NexT 主题配置备份
type: categories
categories: 博客栈
tags:
  - NexT
  - 博客
copyright: true
abbrlink: a40f8cd0
date: 2017/05/31 18:04:00
updated: 2017/11/24 19:38:38
thumbnail: https://res.cloudinary.com/wincer/image/upload/v1530859222/blog/next_config1/cover.png
---

### 基本设置

参照 [NexT 使用文档](http://theme-next.iissnan.com/getting-started.html#theme-settings)，设置中文语言、头像、作者、网站描述和 URL 等。

### 动态背景

修改 `themes/next/layout/_layout.swig`:

加上下面内容：

```javascript
<script type="text/javascript" src="js/src/particle.js><script>
<script type="text/javascript" src="/js/src/particle.js" count="50" zindex="-2" opacity="1" color="0,104,183"></script>
```

目前的 NexT 主题已经自带 canvas_nest 等四个特效，可以在主题配置文件搜索并将对应的值改为 `true`，这里不用自带是因为想添加彩色的线条，自带的只有黑色。

<!-- more -->

然后在 `thmems/next/source/js/src/` 目录新建 `particle.js`，文件写入以下代码：

```javascript
! function() {
    function n(n, e, t) {
        return n.getAttribute(e) || t
    }

    function e(n) {
        return document.getElementsByTagName(n)
    }

    function t() {
        var t = e("script"),
            o = t.length,
            i = t[o - 1];
        return {
            l: o,
            z: n(i, "zIndex", -1),
            o: n(i, "opacity", .5),
            c: n(i, "color", "0,0,0"),
            n: n(i, "count", 99)
        }
    }

    function o() {
        c = u.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth, a = u.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
    }

    function i() {
        l.clearRect(0, 0, c, a);
        var n, e, t, o, u, d, x = [w].concat(y);
        y.forEach(function(i) {
            for (i.x += i.xa, i.y += i.ya, i.xa *= i.x > c || i.x < 0 ? -1 : 1, i.ya *= i.y > a || i.y < 0 ? -1 : 1, l.fillRect(i.x - .5, i.y - .5, 1, 1), e = 0; e < x.length; e++) n = x[e], i !== n && null !== n.x && null !== n.y && (o = i.x - n.x, u = i.y - n.y, d = o * o + u * u, d < n.max && (n === w && d >= n.max / 2 && (i.x -= .03 * o, i.y -= .03 * u), t = (n.max - d) / n.max, l.beginPath(), l.lineWidth = t / 2, l.strokeStyle = "rgba(" + m.c + "," + (t + .2) + ")", l.moveTo(i.x, i.y), l.lineTo(n.x, n.y), l.stroke()));
            x.splice(x.indexOf(i), 1)
        }), r(i)
    }
    var c, a, u = document.createElement("canvas"),
        m = t(),
        d = "c_n" + m.l,
        l = u.getContext("2d"),
        r = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(n) {
            window.setTimeout(n, 1e3 / 45)
        },
        x = Math.random,
        w = {
            x: null,
            y: null,
            max: 2e4
        };
    u.id = d, u.style.cssText = "position:fixed;top:0;left:0;z-index:" + m.z + ";opacity:" + m.o, e("body")[0].appendChild(u), o(), window.onresize = o, window.onmousemove = function(n) {
        n = n || window.event, w.x = n.clientX, w.y = n.clientY
    }, window.onmouseout = function() {
        w.x = null, w.y = null
    };
    for (var y = [], s = 0; m.n > s; s++) {
        var f = x() * c,
            h = x() * a,
            g = 2 * x() - 1,
            p = 2 * x() - 1;
        y.push({
            x: f,
            y: h,
            xa: g,
            ya: p,
            max: 6e3
        })
    }
    setTimeout(function() {
        i()
    }, 100)
}();
```

### 鼠标点击小红心

修改 `themes/next/layout/_layout.swig`:

加上下面内容：

```javascript
<script type="text/javascript" src="/js/src/love.js"></script>
```

然后在 `themes/next/source/js/src/` 目录新建文件 `love.js`，添加以下代码：

```javascript
! function(e, t, a) {
    function n() {
        c(".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: fixed;}.heart:after{top: -5px;}.heart:before{left: -5px;}"), o(), r()
    }

    function r() {
        for (var e = 0; e < d.length; e++) d[e].alpha <= 0 ? (t.body.removeChild(d[e].el), d.splice(e, 1)) : (d[e].y--, d[e].scale += .004, d[e].alpha -= .013, d[e].el.style.cssText = "left:" + d[e].x + "px;top:" + d[e].y + "px;opacity:" + d[e].alpha + ";transform:scale(" + d[e].scale + "," + d[e].scale + ") rotate(45deg);background:" + d[e].color + ";z-index:99999");
        requestAnimationFrame(r)
    }

    function o() {
        var t = "function" == typeof e.onclick && e.onclick;
        e.onclick = function(e) {
            t && t(), i(e)
        }
    }

    function i(e) {
        var a = t.createElement("div");
        a.className = "heart", d.push({
            el: a,
            x: e.clientX - 5,
            y: e.clientY - 5,
            scale: 1,
            alpha: 1,
            color: s()
        }), t.body.appendChild(a)
    }

    function c(e) {
        var a = t.createElement("style");
        a.type = "text/css";
        try {
            a.appendChild(t.createTextNode(e))
        } catch (t) {
            a.styleSheet.cssText = e
        }
        t.getElementsByTagName("head")[0].appendChild(a)
    }

    function s() {
        return "rgb(" + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + "," + ~~(255 * Math.random()) + ")"
    }
    var d = [];
    e.requestAnimationFrame = function() {
        return e.requestAnimationFrame || e.webkitRequestAnimationFrame || e.mozRequestAnimationFrame || e.oRequestAnimationFrame || e.msRequestAnimationFrame || function(e) {
            setTimeout(e, 1e3 / 60)
        }
    }(), n()
}(window, document);
```

### 文章的标签

文章的 tags 是用「#」来标注，将「#」换成图标：

修改 `layout/_macro/post.swig`，搜索 `rel="tag">#`，将 # 换成 `<i class="fa fa-tag"></i>`

### 博文置顶

修改 `hexo-generator-index` 插件：

修改文件：`node_modules/hexo-generator-index/lib/generator.js` 为：

```javascript
'use strict';
var pagination = require('hexo-pagination');
module.exports = function(locals){
  var config = this.config;
  var posts = locals.posts;
    posts.data = posts.data.sort(function(a, b) {
        if(a.top && b.top) { // 两篇文章top都有定义
            if(a.top == b.top) return b.date - a.date; // 若top值一样则按照文章日期降序排
            else return b.top - a.top; // 否则按照top值降序排
        }
        else if(a.top && !b.top) { // 以下是只有一篇文章top有定义，那么将有top的排在前面（这里用异或操作居然不行233）
            return -1;
        }
        else if(!a.top && b.top) {
            return 1;
        }
        else return b.date - a.date; // 都没定义按照文章日期降序排
    });
  var paginationDir = config.pagination_dir || 'page';
  return pagination('', posts, {
    perPage: config.index_generator.per_page,
    layout: ['index', 'archive'],
    format: paginationDir + '/%d/',
    data: {
      __index: true
    }
  });
};
```

在文章的 `Front-matter` 中添加 `top` 值，数值越大文章越靠前，如：

```yaml
title: Next主题配置备份
type: categories
categories: 笔记
tags:
- Next
copyright: true
top: 10
date: 2017-05-31 18:04:00
```

### NexT 主题自定义无序列表样式

打开 `\themes\next\source\css\_custom\custom.styl` 加入：

```css
ul {
list-style-type: circle;  // 空心圆，实心圆为 disc
}
```

### 修改侧边栏头像为圆形

修改文件 `themes\next\source\css\_common\components\sidebar\sidebar-author.styl`，修改其中的 `.site-author-image` 段代码，改为如下形式：

```css
.site-author-image {
  display: block;
  margin: 0 auto;
  max-width: 96px;
  height: auto;
  border: 2px solid #333;
  padding: 2px;
  border-radius: 50%;
}
```

鼠标悬停旋转效果：

```css
.site-author-image {
  display: block;
  margin: 0 auto;
  max-width: 96px;
  height: auto;
  border: 2px solid #333;
  padding: 2px;
  border-radius: 50%
  webkit-transition: 1.4s all;
  moz-transition: 1.4s all;
  ms-transition: 1.4s all;
  transition: 1.4s all;
}
.site-author-image:hover {
  background-color: #55DAE1;
  webkit-transform: rotate(360deg) scale(1.1);
  moz-transform: rotate(360deg) scale(1.1);
  ms-transform: rotate(360deg) scale(1.1);
  transform: rotate(360deg) scale(1.1);
}
```

参考链接：

- [http://codepub.cn/2016/03/20/Hexo-blog-theme-switching-from-Jacman-to-NexT-Mist/](http://codepub.cn/2016/03/20/Hexo-blog-theme-switching-from-Jacman-to-NexT-Mist/)

### 文章链接唯一化

也许你会数次更改文章题目或者变更文章发布时间，在默认设置下，文章链接都会改变，不利于搜索引擎收录，也不利于分享。唯一永久链接才是更好的选择。安装此插件后，不要在 `hexo s` 模式下更改文章文件名，否则文章将成空白。

安装：`npm install hexo-abbrlink --save`

在站点配置文件中查找代码 `permalink`，将其更改为：`permalink: posts/:abbrlink/  # “posts/” 可自行更换`

同样在站点配置文件中添加代码：

```yaml
# abbrlink config
abbrlink:
  alg: crc32  # 算法：crc16(default) and crc32 
  rep: hex    # 进制：dec(default) and hex
```

可选模式：

- crc16 & hex
- crc16 & dec
- crc32 & hex
- crc32 & dec

### 文章底部增加版权信息

自定义版权信息，不采用 NexT 本身的版权设置

添加 `next/layout/_macro/my-copyright.swig` 文件：

```swig
<div class="my_post_copyright">
  <script src="//cdn.bootcss.com/clipboard.js/1.5.10/clipboard.min.js"></script>
  <!-- JS库 sweetalert 可修改路径 -->
  <script src="http://jslibs.wuxubj.cn/sweetalert_mini/jquery-1.7.1.min.js"></script>
  <script src="http://jslibs.wuxubj.cn/sweetalert_mini/sweetalert.min.js"></script>
  <link rel="stylesheet" type="text/css" href="http://jslibs.wuxubj.cn/sweetalert_mini/sweetalert.mini.css">
  <p><span>本文标题:</span><a href="{{ url_for(page.path) }}">{{ page.title }}</a></p>
  <p><span>文章作者:</span><a href="/" title="访问 {{ theme.author }} 的个人博客">{{ theme.author }}</a></p>
  <p><span>发布时间:</span>{{ page.date.format("YYYY年MM月DD日 - HH:MM") }}</p>
  <p><span>最后更新:</span>{{ page.updated.format("YYYY年MM月DD日 - HH:MM") }}</p>
  <p><span>原始链接:</span><a href="{{ url_for(page.path) }}" title="{{ page.title }}">{{ page.permalink }}</a>
    <span class="copy-path"  title="点击复制文章链接"><i class="fa fa-clipboard" data-clipboard-text="{{ page.permalink }}"  aria-label="复制成功！"></i></span>
  </p>
  <p><span>许可协议:</span><i class="fa fa-creative-commons"></i> <a rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/" target="_blank" title="Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)">署名-非商业性使用-禁止演绎 4.0 国际</a> 转载请保留原文链接及作者。</p>  
</div>
<script> 
    var clipboard = new Clipboard('.fa-clipboard');
	clipboard.on('success', $(function(){
	  $(".fa-clipboard").click(function(){
		swal({   
		  title: "",   
		  text: '复制成功',   
		  html: false,
		  timer: 500,   
		  showConfirmButton: false
	    });
	  });
    }));  
</script>
```

在目录 `next/source/css/_common/components/post/` 下添加 `my-post-copyright.styl`：

```css
.my_post_copyright {
  width: 85%;
  max-width: 45em;
  margin: 2.8em auto 0;
  padding: 0.5em 1.0em;
  border: 1px solid #d3d3d3;
  font-size: 0.93rem;
  line-height: 1.6em;
  word-break: break-all;
  background: rgba(255,255,255,0.4);
}
.my_post_copyright p{margin:0;}
.my_post_copyright span {
  display: inline-block;
  width: 5.2em;
  color: #b5b5b5;
  font-weight: bold;
}
.my_post_copyright .raw {
  margin-left: 1em;
  width: 5em;
}
.my_post_copyright a {
  color: #808080;
  border-bottom:0;
}
.my_post_copyright a:hover {
  color: #a3d2a3;
  text-decoration: underline;
}
.my_post_copyright:hover .fa-clipboard {
  color: #000;
}
.my_post_copyright .post-url:hover {
  font-weight: normal;
}
.my_post_copyright .copy-path {
  margin-left: 1em;
  width: 1em;
  +mobile(){display:none;}
}
.my_post_copyright .copy-path:hover {
  color: #808080;
  cursor: pointer;
}
```

修改 `next/layout/_macro/post.swig`，在代码

```javascript
<div>
      {% if not is_index %}
        {% include 'wechat-subscriber.swig' %}
      {% endif %}
</div>
```

之前添加增加如下代码：

```javascript
<div>
      {% if not is_index %}
        {% include 'my-copyright.swig' %}
      {% endif %}
</div>
```

修改 `next/source/css/_common/components/post/post.styl` 文件，在最后一行增加代码：`@import "my-post-copyright"`

每当发布一篇文章，需要在 `Front-matter ` 添加 `copyright: true`

参考链接：[务虚笔记](http://www.wuxubj.cn/)