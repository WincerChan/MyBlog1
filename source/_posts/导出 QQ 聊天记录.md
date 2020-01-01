---
title: 导出 QQ 聊天记录
type: categories
categories: 实验室
copyright: true
tags:
  - QQ
  - Python
date: '2017/07/01 15:57:33'
updated: '2019/04/12 10:02:59'
abbrlink: 1060d444
thumbnail: https://ae01.alicdn.com/kf/HTB1OsC_ajvuK1Rjy0Fa7602aVXaM.png
---



## 前言

从 2013 年开始，手机 QQ 就已经不支持私人聊天记录的导出功能了（群聊的记录还是可以导出），目的当然是为了推广超级会员，毕竟超级会员的聊天记录有 2 年漫游时间，而不想给腾讯送钱的我，就只好另辟蹊径了。

<!-- more -->

配合视频教程食用更加哦~：https://youtu.be/Y4y-UWg5vco

## 准备

我并不算是那种埋头造轮子的人，所以遇到问题总是先问谷歌，确实也寻找到了一些工具，可惜有的不能用能用的还要收费。看来还是需要自己动手（当然，不动手也就没有这篇文章了）。

### 数据库位置

安卓手机 QQ 的数据库文件保存在 `data/data/com.tencent.monileqq/databases/{QQ 号}.db` 下，所以需要 Root（更改 AndroidManifest.xml 的 debuggable 属性之后可以使用 adb 工具导出），这里并非本文的重点，就不展开说了。数据库里面不仅有聊天记录，基本上包括了 QQ 号的所有信息。

不幸的是，里面的重要数据被加密了。

### 加密方式

另外很幸运的是，加密方式采用的是「[异或加密](https://zh.wikipedia.org/zh-hans/%E5%BC%82%E6%88%96%E5%AF%86%E7%A0%81)」，而用于加密的字符串就是你手机的 [IMEI](https://zh.wikipedia.org/wiki/IMEI)，所有手机的 IMEI 都是不同的，这样也可以确保加密后的数据是唯一的，既然知道了加密方式和密钥，那么解密自然也就不是难事了。

## 开始

先想一下，我们聊天记录想导出成什么格式：

我的想法是：`时间--发信人--内容` 这样的格式。打开数据库文件：

如下图，mr_friend_\** **\_New 就是你与每一个好友聊天的信息，包括昵称、备注、qq 号码、聊天记录等，直接查看就会发现是被加密过的。这一串 32 位的字符串就是 QQ 号码的 md5 值。

![](https://ae01.alicdn.com/kf/HTB1gaMPKeySBuNjy1zd760PxFXak.png)



由于 QQ 在手机端使用的数据库是 sqlite，Python 有很方便的 sqlite 的工具，而且 Python 针对字符串处理很方便，这里就采用 Python 来解密。

用浏览工具打开数据库，以我的数据库为例：

![](https://ae01.alicdn.com/kf/HTB1Pf7yKkOWBuNjSspp760PgpXar.png)

`msgData` 保存的就是聊天记录，`selfuin` 就是聊天对象的 QQ 号码，`time `就是发送消息的时间，既然知道了这三个就是我们想要的，那么接下来的就好办多了，解密这三个就好了。

## 解密

既然牵扯到解密，自然也就逃不掉编码和解码。尤其是 `msgData` 项，确实是花费了我好久才解决（哼，我才不会说这是因为我对 Python 的编码不熟悉呢）。

代码已托管至 Gist，见[这里](https://gist.github.com/362331456a6e0417c5aa1cf3ff7be2b7.git)。

参考：

- [用 Python 解密手机 QQ 聊天记录](http://www.freebuf.com/articles/terminal/68224.html)
