---
title: 解除百度云下载限速
type: categories
categories: 分享境
tags:
  - 教程
  - 百度云加速
copyright: true
abbrlink: cfd78fa9
date: 2017/05/22 14:32:00
updated: 2018/02/22 19:39:13
thumbnail: https://s1.ax1x.com/2017/12/24/vJYCQ.png
---

目前关于破解百度云限速其实就只有一个方法：高速链接 + 多线程下载工具。而目前获取的「高速链接」的方法并非完美且存在诸多限制（如：并非不限速，每个连接仍然会限速在 100kB/s、并非所有文件都可以用，只有可以分享的文件才可获得高速链接），但聊胜于无。

<!-- more -->

## Axel 下载

### 安装

- Ubuntu:

  ```
  sudo apt-get install axel
  ```
- CentOS:

  ```
  sudo yum install axel
  ```

### 使用

终端输入 `axel --help`:

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


### 获取直链

~~目前解决百度云限速的思路主要是先获取百度云文件的直链，Linux 下直接登录云盘，点击下载，下载内容界面右击下载内容：`复制链接地址`，即可获取百度云的下载直链，Windows 可用[这个插件](https://github.com/cloudroc/baidu-nolimit)来禁止启动百度云管家。~~

> **注：此方法获取的直链已无法通过 Axel 下载，却可以通过 ariac2 下载，原因是百度云增加了 User-Agent 检测，而亲测 Axel 设置 User-Agent 好像也没有什么用，而 ariac2 最多只能 32 线程，所以此方法已基本无用**

## 百度网盘直接下载助手

下载助手只能在文件分享的界面使用，如下图：

![下载助手实例](https://i.loli.net/2018/02/22/5a8e3840a300e.png)

### 使用

1. 安装[油猴脚本管理器](http://tampermonkey.net/)
2. 安装[下载助手脚本](https://greasyfork.org/zh-CN/scripts/37515)
3. 点击`显示链接`后复制「高速链接」
4. 使用多线程工具如：Axel、aria2、IDM 下载

## baidudl

这是爱吾破解的一位大佬开发的插件，已在 GitHub 上[开源](https://github.com/Kyle-Kyle/baidudl)，同时也已上架 [Chrome 应用商店](https://chrome.google.com/webstore/detail/baidudl/mccebkegnopjehbdbjbepjkoefnlkhef)

### 使用

1. 在百度云盘的界面点击「baidudl 图标」：会列出当前文件夹的所有文件
2. 点击 `Generate` 按钮
3. 复制生成的 `Glinks`，即为「高速链接」

> **注意：此插件原理与「下载助手」类似，只能针对可以分享的文件，而对于一些敏感资源（如新出的电影等等）是无法使用的**

## ADM + ES

那么，针对无法分享的文件，该怎么办呢？

目前我可以想到的就只有用手机端「ES 文件浏览器」+「ADM」的方法了

同样该方法并非完美，用「ES 文件浏览器」获取的百度云链接只能在该手机端使用，因为该链接是通过本地端口远程链接所生成的，故还是有一些限制，速度倒是挺快：

![ADM 下载](https://i.loli.net/2018/02/22/5a8e419cd7d7f.png)

基本可以达到满速。

### 使用

1. 安装 [ES 文件浏览器](https://www.coolapk.com/apk/com.estrongs.android.pop)
2. 安装 ADM（酷安手机客户端下载）
3. 线程数调至 9
4. 修改 User-Agent：`ADM -> 设置 -> 下载 -> 用户代理 -> <Custom>`，将以下内容复制进去：`netdisk;7.8.1;Red;android-android;4.3`
5. `ES 文件浏览器 -> 网络 -> 新建 -> 百度网盘`，随后登录就会进入网盘界面，进入文件夹找到需要下载的文件后：`长按 -> 更多 -> 打开为 -> 视频 -> ADM`，这样就会调用 ADM 下载了

> **注意：下载过程中需要保证「ES 文件浏览器」在后台运行**