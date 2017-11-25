---
title: Manjaro 大法好
type: categories
categories: 笔记
tags:
  - KDE
	- Linux
copyright: true
date: 2017-06-08 21:18:32
updated: 2017-06-10 20:17:29
abbrlink: 7e325dad
---

### 前言

从去年 8 月到现在，终于无法忍受 Ubuntu 了，原因有以下几点：

1. 依赖太过混乱，自带 Python 默认版本居然是 2.7，而且更改默认版本后安装软件会各种报错
2. 时不时报一个内部错误
3. 软件版本更新太慢

考虑到以上三点，我选择了  [Arch](https://www.archlinux.org/) 系的 [Manjaro Linxu](https://manjaro.org/)，选择 Arch 是因为去年有装过，是滚动更新模式，提供最新版本的软件，而不直接用的原因是安装步骤太过繁琐，没有必要，故而选择了基于 Arch 的 Manjaro 发行版。
<!-- more -->
###  制作启动盘

建议采用「[rufus](https://rufus.akeo.ie/)」烧制到 u 盘，制作的时候选择 dd 模式，不要选择 iso 模式，否则会无法从 u 盘启动，随后一路点点点。

### 安装后的配置

安装完成后，界面挺丑的，首先：

1. 更换中国的源，建议 USTC，这是[教程](https://mirrors.ustc.edu.cn/help/manjaro.html)
2. 换一张壁纸
3. 将面板从底部删除，在顶部新建一个，添加一些部件
4. 工作空间主题中更换观感和桌面主题
5. 应用风格中更换窗口样式
6. 更换图标包
7. fcitx 输入法
8. 安装 docky
9. 美化终端，安装 zsh、 Oh my zsh、powerline
10. 配置 conky（之前 Ubuntu 上的不知道为什么不能用了）

### 使用感想

1. Arch 的包管理 pacman 比 Ubuntu 的不知道高到哪里去了，还有 Octopi 图形界面客户端
2. 特效比 Ubuntu 华丽多了
3. 可随意切换工作区，效率确实高了一些
4. KDE 设置确实较多，需要花时间
5. KDE Connect 简直方便到爆炸！！

### 效果图

![](https://ws1.sinaimg.cn/large/ba22af52gy1fg9ifqaop9j21hc0u07wi.jpg)
