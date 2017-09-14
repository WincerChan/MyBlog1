---
title: 从HTTP到HTTPS再到HSTS
type: categories
categories: 网络
tags: 
	- 安全
	- HSTS
date: 2017/09/13 10:05:33
copyright: true
---

## 前言

我的博客是在三个月前就完成了 `HTTPS` 加密工作，方式嘛，和大多数网站类似，是将 `HTTP` 的请求301跳转至 `HTTPS` ，这样虽然可以让用户即使输入的不包含 `HTTPS` 的网址，也可以跳转至 `HTTPS` 。但是当你输入的是域名（不带 `HTTP` 或 `HTTPS` ）时，浏览器会自动帮助你填充 `HTTP` 。

虽然正常情况你会跳转至 `HTTPS` ，但是啊但是目前有一种称为「**降级攻击**」的技术（具体原理自行查阅），我这里简单说一下后果：这种技术是借助中间人发动的攻击，中间人会在浏览器和目标网站之间尝试拦截跳转至 `HTTPS` 的内容，将浏览器重定向至受攻击者控制的服务器，这也就是我们所说的「HTTP请求劫持」。

那么怎么预防呢？

1. 在每个域名之前手动输入 `https://`
2. 网站启用 `HSTS`

第一种每次都要手写输入，自然很麻烦，第二点也就是本文所说的。

## HSTS原理

 `HSTS` 是 `HTTP Strict Transport Security` 的简称，定义在「[RFC 6797](https://tools.ietf.org/html/rfc6797) 」，旨在帮助使用 `HTTPS` 的服务器免受「**降级攻击**」。

工作流程如下：

1. 用户首次访问开启 `HSTS` 服务的网站
2. 浏览器会留下一个包含 `max-age` 参数的 `HSTS` 缓存文件
3. 在`max-age`到期之前访问网站，浏览器会根据缓存中的 `HSTS` 设置自动访问 `HTTPS` 页面

开启 `HSTS` 后可以有效防止「**降级攻击**」，同时也会省去301至`HTTPS`的时间，于安全系数和用户体验都有提升。

## 如何开启HSTS

由于我的网站的 cdn 提供商 Cloudflare（CloudFlare大法好！） 已经提供了 `HSTS` 技术，只需要手动开启就可以了。

在 `Crypto -> HTTP Strict Transport Security (HSTS) `开启如下配置：

![](https://ws1.sinaimg.cn/large/ba22af52gy1fjiuosceepj20r10903yy.jpg)

### 安全系数检测

开启之后，进入 https://www.ssllabs.com/ssltest/ 这个网站，输入域名后，该网站会对你的网站进行一次测试：

![](https://ws1.sinaimg.cn/large/ba22af52gy1fjiuub5d6sj20rd0du3zd.jpg)

在开启后，我的网站安全等级变成了 A+ ，开启之前是A 。

## 尾巴

在用户第一次访问时，如果输入网址没有 `HTTPS` 字段，无法避免的会进行一次 301 跳转，有可能还是会被攻击。

这个时候就需要用到 HSTS Preload ，这是由Google维护的一个域名列表，只要加入这个列表的域名，当使用主流浏览器，如：Chrome, Firefox, Opera, Safari, IE 11 和 Edge时，即使第一次也会强制转换成 `HTTPS` 再访问。从而使访问更加安全。