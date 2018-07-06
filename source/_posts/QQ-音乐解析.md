---
title: QQ 音乐外链解析
date: '2018/03/07 12:23:06'
categories: 实验室
tags:
  - 音乐解析
  - Javascript
  - 网易云
updated: '2018/03/08 17:39:51'
thumbnail: 'https://res.cloudinary.com/wincer/image/upload/v1530861006/blog/qqmusic_parse/cover.png'
abbrlink: '72171293'
---

## 起因

大概在五天前，忽然发现一直在用的网易云解析不能用了，去作者的项目查看才知道原来是网易云更换了新的接口，旧接口的请求现在统一返回 403。于是乎，便萌生了自己写一个接口的想法。<!-- more -->

其实网易云的外链获取目前还是有几种可用方案，比如：

1. [云音乐直链生成器](https://m1.jixun.moe/)
2. 手动替换：`https://music.163.com/song/media/outer/url?id=[].mp3`，将中括号改为歌曲 id，即为外链

这两种方法其实大同小异，都会 302 至歌曲的缓存地址，但也存在一个身为强迫症的我无法忍受的缺点——缓存地址的协议是 `http `（从云音乐官网现在还有大量的 Mixed Content 就可以看出网易对这方面并不上心），而且自己将协议修改成 `https` 后访问部分歌曲又会有机率出现 403，这可真是逼死我了：于是决定暂时放弃掉网易云，换其他家的顶着。

## QQ 音乐

考虑了一圈，还是决定选 QQ 音乐。在网上也找到了 QQ 音乐所提供的接口：

- 请求地址：`https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg`
- 参数，有三个：
  1. songmid：歌曲页 Url 的 `https://y.qq.com/n/yqq/song/{}.html` 括号部分
  2. filename：歌曲名 `'C00' + songmid + '.m4a' `
  3. guid：随机生成的数字串 `int(random() * 2147483647) * int(time() * 1000) % 10000000000`

综上，歌曲的请求地址为：`https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json&cid=205361747&uin=0&songmid={smid}&filename={filename}&guid={guid}`

向这个地址请求后，会得到一个 JSON 格式的数据文件，包含了我们需要的信息：vkey

```bash
curl 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?format=json&cid=205361747&uin=0&songmid={smid}&filename={filename}&guid={guid}'
{"code":0,"cid":205361747,"userip":"××.××.××.××","data":{"expiration":80400,"items":[{"subcode":104001,"songmid":"000uhMwj387EBp","filename":"C00000uhMwj387EBp.m4a","vkey":"B6BB8F604606DFDC82FD81CE33BC9C0277365D4B8B1BC8BCC909E408EAC9822315B2B9D021F42B495FA14AADCB598B21BCDB867931B7A953"}]}}
```

得到了最重要的 `vkey` 字段后，就可以解析出歌曲的「真实链接」了：

`https://dl.stream.qqmusic.qq.com/{filename}?vkey={vkey}&guid={guid}&uin=0&fromtag=66`

你可能注意到返回的信息中还包含了 `expiration` 字段。是的，`vkey` 只有在该时间段内才有效，当然这个问题很好解决，可以把该程序部署至服务器，而从服务器发起请求获取链接后 302 至歌曲链接。

而当我满心欢喜的把这个脚本向服务端部署的时候，却失败了：原因是接口的请求地址只支持国内的（想来是因为 QQ 音乐只拿到了在大陆地区的版权），而我的服务器在美国，这个问题就有些难解决了（我没有国内的服务器）。

于是我想另辟蹊径。

## 纯 JS 解析

既然服务端无法解析，那就用 JS 在用户端解析。

但又带来了另一个问题——跨域。

目前跨域请求比较好的解决方案有两种：CORS 和 JSONP，其中 CORS 需要服务器端设置 `Access-Control-Allow-Origin`，所以也就只有使用 JSONP 了。

> 注意：跨域请求失败原因浏览器端阻止显示，并非服务器端无法返回数据

使用 JSONP 时要求服务端返回的是满足 [JSONP 模式](https://zh.wikipedia.org/wiki/JSONP#%E5%8E%9F%E7%90%86)的文件，不能是纯 JSON 文件，举个例子：

```javascript
var url1 = "https://lab.itswincer.com/jsonp/without-callback.js";
var url2 = "https://lab.itswincer.com/jsonp/with-callback.js";
function foo(data) {
    alert(`Hi, I am ${data.name}`);
}
var script = document.createElement('script');
script.setAttribute('src', url1);
document.body.appendChild(script);
script.setAttribute('src', url2);
document.body.appendChild(script);
```

其中 `without-callback.js` 返回的是纯 JS 文件，`with-callback.js` 返回的是满足模式的 JS 文件。可以运行上面代码看看结果。

本想直接用现成的 `ajax`，考虑到并非所有的网站都引入了 jQuery，而为 `ajax` 就引入一个那么庞大的库又有些没必要。

于是就自己封装了一个 `getJSONP()` 接口来搭配 `getMusic()` 使用。

项目已开源，具体的代码见[这里](https://github.com/WincerChan/QQMusic-Parse)，有很详细的注释。

### 使用

为了使接口更干净，没有使用 callback 函数，而是使用了 ES7 的新特性 async、await。尝试过使用 Babel 等工具转换成兼容更好的 ES5 代码，但是并没有成功，故而浏览器的兼容可能存在问题。

引入[这个 JS 文件](https://cdn.jsdelivr.net/gh/wincerchan/QQMusic-Parse@0.3/parse.min.js)：

接口：`await getMusic()`，如下图：

![示例](https://res.cloudinary.com/wincer/image/upload/v1530844981/blog/qqmusic_parse/sample.png)

> 注意：在调用 getMusic() 的时候一定要加上 await 关键字，否则返回的就是一个 Promise 对象了

### 配合 Aplayer

由于使用了 ES7 的新特性：async 和 await，故而 Aplayer 的配置文件也需要稍加改动：需要将原配置信息放至包含 `async` 关键字的函数内，随后调用这个函数，如下：

```javascript
async function syncHand() {
    new Aplayer(...);
}
syncHand();
```

## 结语

越来越认同保罗 · 格雷厄姆那句「黑客就像画家，工作起来是有心理周期的有时候，你有了一个令人兴奋的新项目，你会愿意为它一天工作 16 个小时。等过了这一阵，你又会觉得百无聊赖，对所有事情都提不起兴趣。」话了，简直就是我的写照：这四天大约花费了 30 小时（当然有很大一部分缘由是之前没怎么学过 JavaScript，修改一下别人的代码还行，自己写就有点「捉襟见肘」了），而估计后几天又会陷入「空窗期」了。

而 JavaScript 又是一门有很多~~坑爹~~特性的语言，也让我把初学者的坑基本上都踩完了（还是写 Python 爽）。同时也感觉学习新东西的最好、最快的方法就是实战，换句话说，抱着解决问题的目的去学习所学到的知识远比你抱着单纯学习目的所学的知识要更快、更牢靠。