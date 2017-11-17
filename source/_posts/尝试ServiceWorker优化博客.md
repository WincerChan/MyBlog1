---
title: 使用 Service Worker 优化网站
type: categories
categories: 技术
tags:
  - ServiceWorker
  - 博客
  - 优化
date: '2017/07/25 13:06:47'
copyright: true
abbrlink: a0df572f
---

静态博客的内容是很适合用缓存来加速访问的，除了采用常见的CDN加速和压缩博文等方法，通过客户端也可以实现加速访问，本文介绍的是「服务工作线程——Service Worker」。关于Service Worker的具体介绍见[这里](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)。本文主要需要的是它的离线加载的特性。

## 启用Service Worker

### 添加注册代码

位置需要在网站的根目录添加，这样才能保证接管整个网站的全部资源。

```javascript
<script>
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
</script>
```

<!-- more -->

当然不是直接添加在生成的静态文件`/public/index.html`，那样每次`hexo g`之后都会消失，太麻烦。我这里是放在了`/next/layout/_thrid-party/comments/livere.swig`，因为我采用了livere的评论系统，当然你也可以不放在这里，只需要确保生成的`/publuc/index.html`包含上述代码就可以了。

### 添加Js文件

从[这里](https://gist.github.com/WincerChan/a553ea6ab3de0afc0d3945bbbccaebd3)下载所需文件(sw.js)，需要添加如下文件在`/source`目录下：

- `sw.js`
- `offline.svg`
- `offline.html`

> 离线后，用户依旧可以访问已缓存的页面。但是对于没有缓存的页面和图片，你可以通过 `offline.svg` 和 `offline.html` 加以提示。

修改文件中的以下内容：

```javascript
const matchFetch = [/https?:\/\/itswincer.com\//];
const ignoreFetch = [
  /https?:\/\/www.google-analytics.com\//,
  /https?:\/\/dn-lbstatics.qbox.me\//
];
```

具体看你的网站音引用了哪些资源可以打开 `Dev Tools` 的 `Source` 逐个筛选。

### 是否成功？

同样在 `Dev Tools` 的Application选项卡中看到 `Service Workers` 就表示成功了。见下图

## 加速效果

### 离线

可以看到在启用了 `Offline` 仍然可以加载页面

![效果1](https://ws1.sinaimg.cn/large/ba22af52gy1fhvzzyefwxg213l0mvawg.gif)



### 缓存 

刷新页面可以看到许多资源是直接 (from ServiceWorker) 加载的，大大提高载入速度。

![效果2](https://ws1.sinaimg.cn/large/ba22af52gy1fhw07svg0cg213l0bcwre.gif)

## 先决条件

### 浏览器

 [is Serviceworker ready](https://jakearchibald.github.io/isserviceworkerready/) 详细列出了所有浏览器支持的情况。

![](https://ws1.sinaimg.cn/large/ba22af52gy1fhw4volxvyj20qc09dacd.jpg)

### HTTPS

服务器工作线程只能工作在HTTPS加密的网站上，本地的 `localhost` 是默认安全。

<div class="pr"></div>

参考文章：

- [服务工作线程：简介](https://developer.google.com/web/fundamentals/getting-started/primers/service-workers)
- [Web 性能优化（1）——浅尝 Service Worker](https://blog.nfz.moe/archives/wpo-by-service-worker.html)
