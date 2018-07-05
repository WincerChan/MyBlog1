---
title: 使用 Service Worker 优化网站
type: categories
categories: 实验室
tags:
  - ServiceWorker
  - 博客
  - 优化
  - sw-toolbox
date: '2017/07/25 13:06:47'
updated: '2018/07/05 20:02:59'
copyright: true
abbrlink: a0df572f
thumbnail: https://i.loli.net/2017/12/24/5a3f3ce69775c.png
---

静态博客的内容是很适合用缓存来加速访问的，除了采用常见的 CDN 加速和压缩博文等方法，通过客户端也可以实现加速访问，本文介绍的是「服务工作线程—— Service Worker」。关于 Service Worker 的具体介绍见[这里](https://developers.google.com/web/fundamentals/getting-started/primers/service-workers)。本文主要需要的是它的离线加载的特性。

<!-- more -->

本博客使用 Service Worker 可分为两个阶段，在我最初撰写本文的时候，使用的是 Service Worker 原生的接口。在不久之后，Google 推出了 [sw-toolbox](https://github.com/GoogleChromeLabs/sw-toolbox) 和 [sw-precache](https://github.com/GoogleChromeLabs/sw-precache) 用以让用户更全面的掌控 Service Worker 缓存的方式：包括版本控制、文件缓存级别、具体路径等，与、于是在经历了漫长的实践后（其实是因为懒），有了本文 Version 2.0。

## 启用 Service Worker

### 添加注册代码

以下注册代码需要在网站的根目录添加，这样才能保证接管整个网站的全部资源。

```javascript
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js')
    .then(function() {
        console.log('A new service worker is being installed.');
    })
    .catch(function(error) {
      console.log('Service worker registration failed:', error);
    });
  } else {
    console.log('Service workers are not supported.');
  }
```

将以上代码加入主题中，至于加在哪需要根据主题的结构决定。你只需要保证生成的静态资源中包含以上代码，那么就算添加成功。以 NexT 为例，你可以把以上代码添加到 ``/next/layout/_thrid-party/comments/ ` 下的任一评论配置文件中（前提是你开启了该评论组件）。

### 添加静态资源

将以下代码保存为 `sw.js`，并确保生成静态文件的时候，`sw.js` 在网站根目录下（你可以把它放在 `source` 文件夹内）。

```javascript
 "use strict";
 (function() {
     var cacheVersion = "-180503";
     var staticCacheName = "asset" + cacheVersion;
     var maxEntries = 100;
     self.importScripts("https://cdn.jsdelivr.net/npm/sw-toolbox@3.6.0/sw-toolbox.js");
     self.toolbox.options.debug = false;
     self.toolbox.options.networkTimeoutSeconds = 1;

     /* staticImageCache */
     self.toolbox.router.get("/(.*)",self.toolbox.cacheFirst, {
     	cache: {
     	 name: staticCacheName,
             maxEntries: maxEntries
     	}
     })
 })();
```

首先指定 cacheVersion，在刷新缓存的时候会进行匹配；其次是一个 Cache Storage 名称的有关变量，我这里只是简单划分为静态资源——全部从缓存中加载的资源；关闭 debug 模式，设置 Timeout 时间为 1s。

其中 sw-toolbox 的[缓存级别](https://github.com/GoogleChromeLabs/sw-toolbox/blob/master/docs/api.md#handlers)共有 5 个（网络优先、缓存优先、速度优先、仅缓存、仅网络）。

我这里采用的是 `cacheFirst`，即缓存优先加载。可针对具体的资源进行不同的缓存级别分配。

其中 `self.toolbox.router.get` 表示每一个你需要操作的资源，第一个参数表示匹配的网址，第二个表示缓存级别，第三个是回调函数。

具体到以本站为例的话，你可以参考本站的[配置文件](https://github.com/WincerChan/MyBlog/blob/hexo/source/sw.js)。

## 加速效果

### 离线

可以看到在启用了 `Offline` 仍然可以加载页面

![效果1](https://ws1.sinaimg.cn/large/ba22af52gy1fhvzzyefwxg213l0mvawg.gif)



### 缓存 

刷新页面可以看到许多资源是直接 ( from ServiceWorker ) 加载的，并未发起新的 http 请求。

![效果2](https://ws1.sinaimg.cn/large/ba22af52gy1fhw07svg0cg213l0bcwre.gif)

## 先决条件

### 浏览器

 [is Serviceworker ready](https://jakearchibald.github.io/isserviceworkerready/) 详细列出了所有浏览器支持的情况。

![](https://ws1.sinaimg.cn/large/ba22af52gy1fhw4volxvyj20qc09dacd.jpg)

### HTTPS

服务器工作线程只能工作在 HTTPS 加密的网站上，本地的 `localhost` 是默认安全。

参考文章：

- [服务工作线程：简介](https://developer.google.com/web/fundamentals/getting-started/primers/service-workers)
- [ServiceWorkerRegistration](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration)
