---
title: 为终端使用SS代理
type: categories
categories: 教程
tags:
  - 代理
copyright: true
date: 2017-06-04 20:31:10
updated: 2017-06-12 16:32:18
abbrlink: 39613bbd
---

Shadowsocks是我们最常用的代理工具，它使用socks协议，而我们目前使用的终端只支持http、https协议，所以我们需要用软件来将socks协议转化为http等协议，我采用的是Proxychains软件（SS的安装和配置自行谷歌）

#### Proxychains安装

```bash
git clone https://github.com/rof10r/proxychains-ng.git
cd proxychains-ng
./config
make && make install
cp ./src/proxychains.conf /etc/proxychains.conf
cd .. && rm -rf proxychains-ng
```

<!-- more  -->

#### 编辑Proxychains配置

```bash
vim /etc/proxychains.conf
```

将最后一行

```
socks4 127.0.0.1 9095
```

改成：

```
socks5 127.0.0.1 1080
```

#### 使用方法

在需要代理的命令前加上`proxychains4`，可用`curl ip.gs`命令测试一下



![未使用](https://ws1.sinaimg.cn/large/ba22af52gy1fg9gcb3kr3j20qh0igmz6.jpg)


![已使用](https://ws1.sinaimg.cn/large/ba22af52gy1fg9gdbm5tfj20qh0igwgo.jpg)
