---
title: 再见 LiveRe，拥抱 Disqus
type: categories
categories: 博客栈
tags:
  - Disqus
  - 博客
date: '2017/07/29 10:08:32'
copyright: true
abbrlink: e5d13eb
thumbnail: https://ws1.sinaimg.cn/large/ba22af52gy1fi35u8pm3xj20sg0ayaa4.jpg
---

没错，我又双叒叕换评论系统了，从最初的网易云跟帖，到后来的 LiveRe，再到现在的 Disqus，两个多月就换了好了三四次（中间从 LiveRe 切换过一次 Disqus，后来又换回来了）了，仿佛我在折腾这些非博客主体的路上越走越远，也幸好我的博客才建成，没啥人留言，不然就得不偿失了。

<!-- more -->

## LiveRe

其实 LiveRe 真的做的挺棒的，中国的本地化做的更是没话说，支持国内的社交媒体：微信、QQ、百度、人人、豆瓣、新浪，国外的支持的就更多了，上次我因为评论框颜色的问题发送了邮件，结果不到 12 个小时 LiveRe 中国区的负责人亲自发邮件解答了这个疑问，就这点来说简直太良心了。

但是美中不足的是：

1. 不支持游客评论（其实这点倒无关紧要）
2. 不支持导出评论
3. 在我博客的加载速度问题

我最不能忍受的就是第三点了，由于我博客是采用了 CloudFlare 的 Keyless SSL 技术，流量都会走 CloudFlare 的 CDN 节点，但是由于节点在国外，国内访问速度实在是太慢了（见下图），这简直不能忍啊，于是我就想做一个延时加载的，后来想想，既然都要做延时加载的了，那我为什么不干脆换成 Disqus 呢？

![](https://ws1.sinaimg.cn/large/ba22af52gy1fi0kzhd1o9j20xc0dzabx.jpg)

## Disqus

那么说到 Disqus，之前为什么会不用 Disqus 呢，主要还是担心国内不会翻墙用户无法评论的问题，后来想想其实这点不重要，因为：

1. 我的博客只是在 [Google Search Console](https://www.google.com/webmasters/tools/home#utm_source=zh-CN-wmxmsg&utm_medium=wmxmsg&utm_campaign=bm&authuser=0) 添加了信息，没有在百度站长平台添加，~~所以百度是搜索不到我的网站~~现在貌似已经可以搜到了；既然是从谷歌搜索进入的话，那自然也就不存在不会翻墙的问题了；
2. 不是所有的用户都需要看评论，于是我就把评论功能隐藏了起来，需要的话点击下方按钮加载评论；

这样优化过后，对比上一张图，国内部分地区速度果然提升了不少：

![](https://ws1.sinaimg.cn/large/ba22af52gy1fi0lhcyoyvj20xc0dx760.jpg)

最后，列一下我对博客的优化：

1. 使用 glup 插件压缩 html、css、js、img 等；
2. CloudFlare 的 CDN 加速访问资源；
3. ServiceWorker 提供离线访问技术；
4. 延时加载 Disqus 评论；

每一点优化我都有写文章，文章链接可以通过搜索关键字获取。