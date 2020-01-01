---
title: Hitokoto（一言）API 2.0 正式上线
date: '2018/07/16 11:48:15'
updated: '2018/07/16 11:48:15'
tags:
  - 一言
  - API
  - Hitokoto
categories: 分享境
abbrlink: a5c39267
thumbnail: https://ae01.alicdn.com/kf/HTB1hMO7acnrK1RkHFrd760CoFXaa.png
---

去年夏天的时候，用 Flask 开发了一个[简易版的一言](../f6e1eb2a/)，算是最初的 beta 版，部署在了 Heroku 上面（那时我还没购买服务器），由于 Heroku 免费版有时间池的限制，在我购置了服务器后就重新用 Go 重写了一下[部署在自己的服务器上](../b3085a7/#搭建-API)，算是 1.0 版，这两天又重新拾坑，开发出了 2.0 版本。

<!-- more -->

## 前言

在 1.0 版本使用了较长的时间后，基于以下考量，我还是重构了部分代码：

1. 收录一言数太少：我没事的时候就喜欢刷新玩，经常发现眼熟的，毕竟也就不到一千条；
2. 性能：由于使用的是 SQLite，在每秒请求数在 1000 的时候就 GG 了；
3. 查询参数：返回不超过查询长度参数的一言，但翻了一大堆 API，都并没有提供这个功能；

于是乎，本着「生命不死，折腾不止」的态度，2.0 版本诞生了。

> 本 API 的[源码](https://github.com/WincerChan/Hitokoto)已开源至 GitHub，如有需要的可自行搭建。

以下是 2.0 版本的更新日志：

## 数量问题

爬取数据时采用了异步爬虫，解决了 1.0 版本爬取时效率低下的问题，同时选取了 xxhash 作为散列函数，将一言主体 hash 后，得到的 64bit 的无符号整数作为主键，这样如果爬取到了重复的一言也不会插入数据库中。

得益于异步爬虫的高效率，在很短的时间内，爬取到了足够的一言数。目前，数据库内共有 `15371` 条一言。以后数量还会不断地增加。[爬虫程序](https://github.com/WincerChan/Hitokoto-Spider)已托管至 GitHub。

## 性能问题

数据库更换成了 MySQL，以承受高并发访问，以下为建表语句：

```mysql
+----------+---------------------+------+-----+---------+-------+
| Field    | Type                | Null | Key | Default | Extra |
+----------+---------------------+------+-----+---------+-------+
| id       | bigint(20) unsigned | NO   | PRI | NULL    |       |
| hitokoto | varchar(300)        | NO   |     | NULL    |       |
| source   | varchar(64)         | NO   |     | NULL    |       |
| origin   | varchar(12)         | NO   |     | NULL    |       |
+----------+---------------------+------+-----+---------+-------+
```

## 参数问题

2.0 版本共包含以下请求参数：

### 编码格式

格式为 `encode=`，包含以下四个参数值：

- js：JavaScript 脚本，将一言插入 HTML 中第一次出现 `class = 'hitokoto'` 的标签中
- json：JSON 格式的字符串，包含主体（hitokoto），出处（source）
- text：一言句子的主体
- 默认为：`×××××——「×××」`，即主体 + 出处

### 字符集

格式为 `charset=`，包含以下两个参数值：

- utf-8：在 Header 中的 `content-type` 字段添加 `charset=utf-8`
- gbk：同上

### 长度

格式为 `length=`，会随机返回一条不超过这个查询长度的语句。

### 回调

格式为 `callback=`，会根据回调参数的值返回对应的函数调用，其中函数的参数为一个字典，key 分别为 `hitokoto` 和 `source`。

> **注意：callback 参数会覆盖掉 encode 参数**

## 使用示例

调用地址：`https://api.itswincer.com/hitokoto/v2/`

例如，我想请求一个长度不超过 10 的一言，并以 JSON 格式返回：

```bash
curl 'https://api.itswincer.com/hitokoto/v2/?encode=json&length=10'

{"hitokoto":"(눈_눈)","source":"进击的巨人"}
```

如果想在自己的网页使用的话，可以采取以下两种方法：

### JS 方法

只需要在想要展示的标签加上 `class='hitokoto'` 属性，随后在任何地方加上：

```html
<script src="https://api.itswincer.com/hitokoto/v2/?encode=js"></script>
```

插入页面的显示结果是：××××××× ——「×××」形式。

展示结果见侧栏。

### 回调方法

如果对 `encode=js` 返回的格式不满意，可自行定义页面展示的格式：比如以下代码仅展示一言的主体部分：

定义标签和函数：

```html
<p class="hitokoto"></p>
<script>
    // 定义回调函数名 showHitokoto
    function showHitokoto(data){
        // 比如我只想展示一言主体部分
        var hitokoto = data.hitokoto;
        // 插入 class=hitokoto 的标签
        var dom = document.querySelector('.hitokoto');
        Array.isArray(dom)?dom[0].innerText=hitokoto:dom.innerText=hitokoto;
    }
</script>
```

随后将请求地址加上参数 `callback=showHitokoto`：

```html
<script src="https://api.itswincer.com/hitokoto/v2/?callback=showHitokoto"></script>
```

以上示例将会在 HTML 标签首个包含 `class='hitokoto'` 的标签内部插入仅包含一言主体的部分。

## 尾巴

你看到某句熟悉的一言从屏幕上显示的时候，勾起了之前第一次看到这句话时或感动、或开心、或难过的回忆，而某个陌生人也会因此和你一样陷入属于他的短暂回忆——想到这些不是很快乐吗？而我想那个陌生人一定也正想着同样的事情。我一直这样觉得。

而这，应当就是文字赋予一言的最大作用了。
