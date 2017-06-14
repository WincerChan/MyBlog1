---
title: 使用WebDav(坚果云)同步 SafeInCloud
type: categories
categories: 软件
tags:
  - 安全
copyright: true
abbrlink: c7bc4900
date: 2017-05-06 00:00:00
---

#### SafeInCloud 介绍

[SafeInCloud](https://www.safe-in-cloud.com/en/) 密码管理器允许您保存您的登录名、 密码和其他私人信息在安全和牢固的加密数据库中。您可以通过您的云帐户与另一台电话，平板电脑，Mac 或 PC 同步您的数据。

应用下载：[酷安下载](http://www.coolapk.com/apk/com.safeincloud)   [谷歌商店](https://play.google.com/store/apps/details?id=com.safeincloud)

#### 数据同步

SafeInCloud支持的云同步大多都是国外的，考虑到国内的网络环境，可以选择OneDrive和坚果云同步，OneDrive同步直接登录就可以，本文主要讲解如何利用WebDav和坚果云同步：<!-- more -->

1. 登录[坚果云](https://www.jianguoyun.com/)，左上角 **创建-->新建个人同步文件夹** .记住该文件夹的名字

   ![](https://ws1.sinaimg.cn/large/ba22af52gy1ffhaoxnvrbj20r907hwfc.jpg)

2. 进入SafeInCloud，在登录界面选择WebDav登录：

   ![](https://ws1.sinaimg.cn/large/ba22af52gy1ffjifoiladj20bt096jrx.jpg)

   - 协议：https
   - Host：dav.jianguoyun.com/dav
   - 端口：空
   - 本地路径：刚刚创建的个人同步文件夹名字
   - 用户名：坚果云账户名
   - 密码：坚果云账户密码

至此，本篇教程结束，祝使用愉快。

