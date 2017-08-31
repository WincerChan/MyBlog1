---
title: 爬虫模拟登录之一般性解决方法(Cookie)
type: categories
categories: 教程
tags:
  - 爬虫
  - Python
  - 模拟登录
date: '2017/08/31 15:08:10'
copyright: true
abbrlink: d68153f1
---

## 前言

前几周写了[一篇文章](https://itswincer.com/posts/94e157f8/)，介绍了如何利用post方法来验证登录的问题，我也是一直在使用此方法登录豆瓣爬取一些信息，可是前两天突然就不能用了。我也再次查看了豆瓣的源代码，确认了豆瓣的验证信息并没有发生改变，但就是一直登录不上去，我猜想到可能是这个方法行不通了，于是我就换了一个思路：之前需要将post提交的表单数据保存在一个session实例中，然后调用这个session实例的get方法从而可以获取登录信息。

而现在这一方法失效了，猜想就是post方法提交数据这一步出了问题，那么就换一个思路，直接将数据存入session，那么这个数据从哪来呢？这就是这篇文章所要谈到的。

<!--more-->

## Cookie

### 作用

这里简单说一下Cookie的作用，详细的定义见[RFC2109](https://www.ietf.org/rfc/rfc2109.txt)。

> 当登录一个网站的时候，网站往往会请求用户输入用户名和密码，并且用户可以勾选“下次自动登录”。如果勾选了，那么下次访问同一网站，用户会发现没输用户名和密码就已经登录了。这是因为前一次登录时，服务器发送了包含登录凭据的Cookie到用户的硬盘里。下次登录时，如果Cookie尚未到期，那么浏览器就会发送该Cookie，服务器验证凭据，于是就不需要用户名和密码就可以登录了。——维基百科

### 获取

打开Chrome的开发工具的Network一栏，输入完用户名和密码及验证码后，点击登录。以简书(因为简书是需要滑动验证的，比豆瓣的验证码更麻烦)为例：

![](https://ws1.sinaimg.cn/large/ba22af52gy1fj2y1160frj20n306vach.jpg)

你会发现有一个`Type`为document、名为`www.jianshu.com`的文档，点开他滑动到最下面你就会看到有一项名为`Cookie`的很长很长的字符串，这里面就保存了你的登录信息，Cookie的格式一般是：`name1=value1;name2=value2`。

## 如何使用

那么获取了Cookie之后，该怎么在程序中使用呢？

requests库提供了[这样的方法](http://docs.python-requests.org/zh_CN/latest/user/advanced.html#session-objects)，首先我们将从浏览器获取的Cookie的格式转换成Python的字典格式，如：

```python
cookie = {
    'name1': 'value1',
    'name2': 'value2'
}
```

然后，运用requests.get获取的时候将cookie传入就ok了：

```python
from requests import get, session
head = {
    'User-Agent':
    ('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 '
     '(KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36')
}
url = 'http://www.jianshu.com'
r = get(url, headers=head, cookies=cookie)
# 如果登录成功就会在首页的html中出现我的主页字样
r.text.find('我的主页')
```

当然这有一点麻烦，每次都需要在get的参数中加入headers和cookies项，那么可不可以简化一下呢？

当然可以，这里就要借用到上篇文章中使用的session，我们创建一个session()的实例，然后首次获取需要提交headers和cookies，然后这些信息就会保存在实例中，下次直接调用实例的get方法，只需传入一个url即可。

```python
ssion = session()
ss = ssion.get(url, headers=head, cookies=cookies)
>>> ss.text.find('我的主页')
>>> 5180
>>> s = ssion.get(url)
>>> s.text.find('我的主页')
>>> 5180
```

## 结语

我之所以把这种方法成为一般性解决方法是因为这种方法的应用范围更广泛。上一篇文章介绍的方法仅适用于验证方式最为简单的网站（如豆瓣）而且失误率还高；本文介绍的方法就不会有这些缺点，唯一繁琐的一点可能就是将cookies转化为字典需要花费一点时间了。