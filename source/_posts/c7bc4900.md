---
title: 使用 WebDav（坚果云）同步 SafeInCloud
type: categories
categories: 分享境
tags:
  - 安全
  - 云同步
  - 密码
copyright: true
abbrlink: c7bc4900
date: 2017/05/06 13:24:18
updated: 2017/12/24 19:34:27
thumbnail: https://res.cloudinary.com/wincer/image/upload/v1530859673/blog/webdav_sync/cover.png
---

#### SafeInCloud 介绍

[SafeInCloud](https://www.safe-in-cloud.com/en/) 密码管理器允许您保存您的登录名、密码和其他私人信息在安全和牢固的加密数据库中。您可以通过您的云帐户与另一台电话，平板电脑，Mac 或 PC 同步您的数据。<!-- more -->

应用下载：[酷安下载](http://www.coolapk.com/apk/com.safeincloud)   [谷歌商店](https://play.google.com/store/apps/details?id=com.safeincloud)

#### 数据同步

SafeInCloud 支持的云同步大多都是国外的，考虑到国内的网络环境，可以选择 OneDrive 和坚果云同步，OneDrive 同步直接登录就可以，本文主要讲解如何利用 WebDav 和坚果云同步：

1. 登录[坚果云](https://www.jianguoyun.com/)，左上角 **创建-->新建个人同步文件夹**。记住该文件夹的名字

   ![](https://res.cloudinary.com/wincer/image/upload/v1530862043/blog/webdav_sync/jianguoyun.png)

2. 进入 SafeInCloud，在登录界面选择 WebDav 登录：

   ![](https://res.cloudinary.com/wincer/image/upload/v1530862067/blog/webdav_sync/safeincloud.png)

   - 协议：https
   - Host（主机）：dav.jianguoyun.com/dav
   - 端口：空
   - 本地路径：刚刚创建的个人同步文件夹名字
   - 用户名：坚果云账户名
   - 密码：坚果云账户密码

至此，本篇教程结束，祝使用愉快。

