---
title: Web 性能优化（一）——使用 localStorage
type: categories
categories: 实验室
tags:
  - 优化
  - localStorage
  - Web
date: '2017/11/30 15:09:34'
updated: '2017/11/24 19:39:24'
abbrlink: a9d193c6
thumbnail: https://s1.ax1x.com/2017/12/24/vYeaT.png
---

## localStorage 的意义

为了针对我的网站提供更好的浏览体验（或者说更接近原生 App 的用户体验），在之前我就已经[开启了 Server Worker 技术](https://itswincer.com/posts/a0df572f/)，针对离线或者网速慢的情况下改善用户体验。但只有少数几个浏览器支持 （Chrome、Firefox、Opera），对目前手机端用户数最多的 QQ 浏览器、UC 浏览器却没有支持，也就是说该方法针对 QQ 浏览器和 UC 浏览器并没有什么实际优化。

<!-- more -->

而且对于 Server Worker，它并不能减少你的 HTTP 连接数量，只是拦截你的请求，减少 Stalled、Request sent 和 TTFB 的时间，见下图：

![左边从 SW 加载，右边正常加载](https://i.loli.net/2017/11/30/5a1fb5e57fcf3.png "左边从 SW 加载，右边正常加载")

针对以上两个问题，本博客采用另一种 HTML5 新技术 —— local Storage。

## localStorage 简介

localStorage 是在 HTML5 中新引进的一项存储技术，（如果不被清除）存储没有时间限制，但是有大小限制，一般对于每个域名是 5MB，对于存储一些纯字符串脚本，足够了。且目前所有主流浏览器均支持此项技术。

但是需要注意，SW 是可以将所有的 HTTP 请求全部拦截，无论服务器的 Response Headers 中的 Content-Type 是什么类型都可以拦截从本地加载。而 localStorage 仅能存储静态资源（JS/CSS）。

而存储在 localStorage 的中的静态资源所带来的优点就在于再次加载时不需要发起 HTTP 请求（Queueing、Stalled、Request sent、TTFB、Content Download 这些都不需要），这可以大大改善不支持 SW 技术的浏览器在访问我网站时的浏览体验。

## 本博客的实践

本博客采用的是 [basket.js](https://github.com/addyosmani/basket.js/) 方案，将 js 和 css 存储在 localStorage 中，利用 localStorage 的特性，减少 HTTP 连接的次数，以达到改善页面加载体验的目的。

为了避免每次刷新页面 main.css 加载先后页面出现抖动的问题，默认不将 main.css 放入 localStorage 中存储。

另一个问题是 NexT 在设计之初就很依赖于 js（会加载大量的 js 文件），而这些 js 文件的加载顺序是有要求的，jquery 必须优先被加载，否则就会出现奇怪的 bug，好在 basket.js 提供了控制加载先后顺序的方案。

## 危险性

在[这篇知乎回答](https://www.zhihu.com/question/28467444)中，很详细的列出了 localStorage 的优点和缺点。

其中最危险的是网站出现 xss 漏洞，就会被人利用将恶意代码注入到 localStorage 中，导致即便修复了 xss 漏洞存储的代码依然是被篡改的。

好在 basket.js 可以提供将 localStorage 中的代码重新从网络加载的问题。具体见[官方文档](https://addyosmani.com/basket.js/)。
