---
title: Sorry，会写代码真的能为所欲为
date: '2018/05/27 10:34:21'
updated: '2018/05/27 10:35:20'
categories: 实验室
tags:
  - 表情包
  - JavaScript
abbrlink: '8575e868'
thumbnail: https://upload-images.jianshu.io/upload_images/2133488-5e5d5089fbc720d5.png
description: 前一段时间「这个仇我先记下了」的表情包突然火了，我也萌生了自己写一个表情包生成工具的想法，而网上目前有的生成器大都是后端版，我就决定用 JavaScript 写一个。
---

前一段时间「这个仇我先记下了」的表情包突然火了，导致我也萌生了自己写一个表情包生成工具的想法，毕竟我是重度表情包玩家😌。其实之前我就很喜欢做表情包，不过是用的 PS 等软件，有些麻烦，而且改 GIF 也不太方便。

于是乎，我决定也蹭一波热度，也写了一个，最初是只有「记仇」这个静态表情包的，现在加上了王境泽、为所欲为、打工是不可能打工的等等动图，模板后续还会添加，如果有好的素材可以私我。<!--more-->

## 思路

当然网上也有一些表情包生成器，比如「[sorry](https://github.com/xtyxtyx/sorry)」，但界面我不太喜欢，而且我觉得这类较为简单的处理没必要借助服务器端渲染合成，直接在浏览器端渲染就好了，~~毕竟 JavaScript 算是一门「万能的语言」~~。

核心思路是采用 omggif 对 GIF 进行解码，再用 Canvas 将文字绘制在每一帧上，最后再用 gif.js 将每一帧合成，再渲染后输出成 Blob 文件对象（[现在不支持 Blob 的浏览器应该没有了吧？](https://caniuse.com/#search=blob)），传递给 IMG 标签进行显示。

这是解码过程：

```javascript
// 解码
let gifReader = new omggif.GifReader(buffer);	
// 获取帧
let frameZero = girReader.frameInfo(0)			
// 获取帧的宽高，绘制 Canvas 的时候会用到
let [width, height] = [frameZero.width, frameZero.height]	

let imageBuffer = new Uint8ClampedArray(width * height * 4)
gifReader.decodeAndBlitFrameRGBA(frameNum, imageBuffer);
// 生成图像数据，供 Canvas 使用
let imageData = new window.ImageData(imageBuffer, width, height)
```

这是绘制过程：

```javascript
ctx.putImageData(imageData, 0, 0)
// 这是字幕的白边
ctx.strokeText(caption, width / 2, height - 5, width);
// 这是字幕的主体
ctx.fillText(caption, width / 2, height - 5, width)
```

这是编码（渲染）过程：

```javascript
let gif = new GIF({
    workers: 3,
    quality: 10,
    width: imageWidth,
    height: imageHeight,
})

// Canvas 的数据加入帧
gif.addFrame(ctx, {
    copy: true,
    delay: frameInfo.delay,
    dispose: -1
})
// 开始渲染
gif.render()
// 渲染完成
gif.on('finished', Blob => {
    gifUrl = window.URL.createObjectURL(Blob);
    img.src = gifUrl;
})
```

以上是动图的设计思路，静态图就显得简单多了，采用 dom-to-img 绘制就行了，但是在 Edge 上似乎是无法使用的，作者提到似乎是因为添加了 foreignObject 标签，倒置 toDataUrl() 在 Edge 上无法工作，所以 Edge 用户只能使用动图部分了。

其实核心思路很简单， gif.js 和 omggif 提供的 API 也不复杂，但我还是花了将近一周的时间，因为这是我首次使用 React 开发应用，所以有大半时间都花在了学习 React 上，然而写出来的结果还是偏「Pure JavaScript」一些。

[本项目](https://github.com/WincerChan/Meme-generator)采用 [create-react-app](https://github.com/facebook/create-react-app) 构建，CSS 框架采用了 [bulma](https://github.com/jgthms/bulma)，部分动图模板来自 [sorry](https://github.com/xtyxtyx/sorry)。

## 实现

刚刚有提到，我在设计该工具的时候大部分时间都没有花在核心思路部分，而是花在了——我称为「薛定谔的 Bug」上，即：你在设计该工具的蓝图的时候，没有设想到会出现这些 Bug，而实际编程中，也不一定会遇到，只有你亲自编写了，才知道这 Bug 是否会出现。

我在这次编程中就遇到了四个「薛定谔的 Bug」：

### Blob 文件对象

关于静态图部分，我设计了两个按钮：「戳我预览」和「戳我下载」，其实本应该只需要一个下载按钮就够了，因为我使用 contenteditable 属性以编辑 p 标签。和生成的预览图几乎没什么差别，那么为什么要设计两个呢？就是因为 Blob 对象（后续思考了一下，虽然可以先行判断浏览器是否支持 Blob 下载，但针对动态图还是需要预览修正的，故为了设计上的统一性，还是将预览按钮保留了）。

其实大部分人应该是没有听说过这个名词的（包括我），但它还真的不是一个新玩意，甚至都不是 HTML5 新增的 API，相比于 HTML5 在 2014 年才完成标准制定，在 [MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 上查到 Blob 对象在 2010 年就被主流浏览器支持了（Chrome 5、Firefox 4、Opera 11.1），但，如今大部分手机浏览器却仍不支持 Blob 文件下载协议。

所以只好提供一个预览按钮来供不支持 Blob 文件下载协议的浏览器长按进行保存。

### 服务器问题

由于我的服务器是在国外，而且还套了一层 Cloudflare，故而在某些情况下，加载动图会非常慢，尤其是在晚上（大约花费 1min，而且居然还没断，我真是很佩服 Cloudflare 的稳定性）。

当然图片的加载问题还不算大，可以放在[支持跨域的图床](https://sm.ms)上，由 `fetch` 调用，问题最大的是 Web Worker（合成 GIF 的时候需要使用），但这个 Web Worker 的地址在 Chrome 下**只允许**同域名下的脚本，即使是公共 CDN 上允许跨域都不行。

这里采用还是借助 Blob 对象，巧妙的规避这一限制：

```javascript
let tmpWorker = await fetch(url),
    workerSrcBlob = new Blob([await tmpWorker.text()], { type: 'text/javascript' }),
    workerBlobURL = window.URL.createObjectURL(workerSrcBlob);
```

### React Router 404 错误

在将代码生成「production build」时，遇到了一个 Bug，有时访问二级路由会出现 404，多次复现后，终于确定了：

在访问二级路由时，如果是正常从一级页面点击跳转的，则会正常访问；

但如果是直接访问二级路由或者是在二级路由刷新页面，则会出现 404；

但是这个 Bug 在「development build」中是没有的，原因在于当你点击路由时，并不是直接向服务器发起请求，而是由 react-router 路由库给出路由网址，故而刷新二级路由页面或者直接访问二级路由页面服务器是无法正确响应的。

以下是解决办法，在 Nginx 中添加 `try_files` 语句：

```nginx
server {
    location / {
        try_files $uri /index.html
    }
}
```

### GIF 渲染

当我解决了以上问题的时候，我发给室友首先试用，看到了「戳我预览」这个按钮，他就以「单身十八年」的手速猛戳了四五下，随后标志着渲染进度条就「鬼畜」了起来。因为他猛戳的那几下相当于在后台启动了好几个渲染程序，不仅会让进度条「鬼畜」起来，如果你以更快的手速戳的话（单身八十年？）还会让 CPU 负担加重，甚至会卡死，当然我是没有试过。其实这 Bug 算是无伤大雅的，本不太需要修复，~~因为不像其它生成器拿服务器做后端，可能会造成服务器宕机，我的纯前端写的~~。但我本着人道主义情怀、不让我的 Bug 陪我过夜的心理，以及最重要的强迫症，还是决定修复这个 Bug。

其实很简单，设置一个全局变量 `finished`，在渲染的过程中，该变量为 `false`，渲染完毕后设置成 `true`，再将渲染过程放置在 `if(finished)` 内就解决了。

## 教程

见[本项目的 Wiki](https://github.com/WincerChan/Meme-generator/wiki)。

## 结语

本工具还有很多需要改进的地方，比如 React 的写法不够规范、没有完全实现静态动态资源分离、用户自定义添加模板等等，这些我在空闲时间里都会一点点的改进。

目前在实用的角度来说，该工具已经可以投入使用了，剩下的细节就需要慢慢雕琢了。:)

参考：

- [xtyxtyx/sorry](https://github.com/xtyxtyx/sorry)
- [纯 JS 实现在前端制作 GIF 表情包的网站](https://blog.csdn.net/xfgryujk/article/details/79889942)
- [Histories](https://react-guide.github.io/react-router-cn/docs/guides/basics/Histories.html)