---
title: 再见 LiveRe，拥抱 Disqus
type: categories
categories: 博客栈
tags:
  - Disqus
  - 博客
  - 评论
date: '2017/07/29 10:08:32'
updated: '2018/03/08 19:35:36'
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

我最不能忍受的就是第三点了，由于我博客是采用了 CloudFlare 的 Keyless SSL 技术，流量都会走 CloudFlare 的 CDN 节点，但是由于节点在国外，国内访问速度实在是太慢了，每次点开网页都会看到圈圈不停的转，这简直不能忍啊，于是我就想做一个延时加载的，后来想想，既然都要做延时加载的了，那我为什么不干脆换成 Disqus 呢？

## Disqus

那么说到 Disqus，之前为什么会不用 Disqus 呢，主要还是担心国内不会翻墙用户无法评论的问题，后来想想其实这点不重要，因为：

1. 我的博客只是在 [Google Search Console](https://www.google.com/webmasters/tools/home#utm_source=zh-CN-wmxmsg&utm_medium=wmxmsg&utm_campaign=bm&authuser=0) 添加了信息，没有在百度站长平台添加，~~所以百度是搜索不到我的网站~~现在貌似已经可以搜到了；既然是从谷歌搜索进入的话，那自然也就不存在不会翻墙的问题了；
2. 不是所有的用户都需要看评论，于是我就把评论功能隐藏了起来，~~需要的话点击下方按钮加载评论~~，如果网络比较好的话，会自动显示，否则需要手动点击；

这样优化过后，总算好多了。

## 延迟加载

原理嘛，先用 ajax 异步发送一个 get 请求至 Disqus 服务器，接收成功则屏蔽按钮，加载评论；超时则自动断开，并显示加载按钮：

```ejs
<button class="disqus_click_btn">点击以加载评论</button>
<%
/*
延迟加载 disqus，timeout 可以自己设置时长
*/
%>
<script type="text/javascript" id="disqus-lazy-load-script">
    $.ajax({
    url: 'https://disqus.com/next/config.json',
    timeout: 300,
    type: 'GET',
    success: function(){
        var d = document;
        var s = d.createElement('script');
        s.src = '//<%= theme.comment.shortname %>.disqus.com/embed.js';
        s.setAttribute('data-timestamp', + new Date());
        (d.head || d.body).appendChild(s);
        $('.disqus_click_btn').css('display', 'none');
    },
    error: function() {
        $('.disqus_click_btn').css('display', 'block');
    }
    });
</script>
<%
/*
由于我超时时长设置得比较短，所以可能翻墙了还是没有自动加载评论，这时就需要手动点击加载了
*/
%>
<script type="text/javascript" id="disqus-click-load">
    $('.btn_click_load').click(() => {  //click to load comments
        (() => { // DON'T EDIT BELOW THIS LINE
            var d = document;
            var s = d.createElement('script');
            s.src = '//<%= theme.comment.shortname %>.disqus.com/embed.js';
            s.setAttribute('data-timestamp', + new Date());
            (d.head || d.body).appendChild(s);
        })();
        $('.disqus_click_btn').css('display','none');
    });
</script>
```

最后，列一下我对博客的优化：

1. 使用 glup 插件压缩 html、css、js、img 等；
2. CloudFlare 的 CDN 加速访问资源；
3. ServiceWorker 提供离线访问技术；
4. 延时加载 Disqus 评论；

每一点优化我都有写文章，文章链接可以通过搜索关键字获取。