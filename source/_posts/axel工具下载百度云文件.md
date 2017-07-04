---
title: Axel工具下载百度云文件
type: categories
categories: 软件
tags:
  - 教程
  - 百度云加速
copyright: true
abbrlink: cfd78fa9
date: 2017-05-22 14:32:00
---

## Axel工具
### Axel简介

- [**Axel**](https://github.com/eribertomota/axel)是为Linux和Unix命令行加速下载的工具。

- 支持多线程下载、断点续传，尝试通过为一个文件使用多个连接来加速下载过程，类似于DownThemAll和其他着名的程序。它也可以使用多个镜像进行一次下载。

- Axel支持HTTP，HTTPS，FTP和FTPS协议。

### Axel安装

- Ubuntu:

  ```
  sudo apt-get install axel
  ```
- CentOS:

  ```
  sudo yum install axel
  ```

<!-- more -->

### Axel使用

终端输入`axel --help`:

```
用法: axel [选项] 地址1 [地址2] [地址...]

--max-speed=x		-s x	指定最大速率（字节 / 秒）
--num-connections=x	-n x	指定最大连接数
--output=f		-o f	指定本地输出文件
--search[=x]		-S [x]	搜索镜像并从 X 服务器下载
--no-proxy		-N	不使用任何代理服务器
--quiet			-q	使用输出简单信息模式
--verbose		-v	更多状态信息
--alternate		-a	文本式进度指示器
--help			-h	帮助信息
--version		-V	版本信息
```



## 百度云

### 获取直链

目前解决百度云限速的思路主要是先获取百度云文件的直链，Linux下直接登录云盘，点击下载，下载内容界面右击下载内容：`复制链接地址` ，即可获取百度云的下载直链，Windows可用[这个插件](https://github.com/cloudroc/baidu-nolimit)来禁止启动百度云管家。

## 图文实例

比如我想在我的网盘下载一个1.1GB的视频文件：

1. 在上面的链接处单击右键选择`复制链接地址(E)` ，这样就获得了该文件的直链

   ![](https://ws1.sinaimg.cn/large/ba22af52gy1ffu4ikixrqj20ht04omx9.jpg)

2. 打开终端输入`axel -n 64 'URLs' -o 4-2.mp4` ，把url替换成刚刚文件的直链，`-n 64`指定使用64线程下载，`-o 4-2.mp4`指定保存路径为当前目录，文件名为`4-2.mp4`![](https://ws1.sinaimg.cn/large/ba22af52gy1ffu4jbf6dbj20mq0dlq6i.jpg)

3. 当输入以上命令时可能会提示`不能处理长度超过 1024 的URLs`，此时需要将百度云需要下载的文件名更改为较短的，再重新执行步骤1，即可

