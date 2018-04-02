---
title: NextCloud 搭建私人云服务教程
date: '2018/03/31 15:03:31'
updated: '2018/04/01 19:03:34'
categories: 分享境
tags:
  - 云服务
  - NextCloud
  - VPS
thumbnail: 'https://upload-images.jianshu.io/upload_images/2133488-aa8847b1c99b1c80.png'
abbrlink: bf0413ac
---

我一直很不相信国内的那些云服务提供商（尤其是在李彦宏发表的讲话「中国用户对隐私问题没那么敏感，在个人隐私方面更加开放，一定程度上愿用隐私换方便和效率」后），因为怕隐私得不到保障，故而我的一些隐私数据都是存放在国外的云盘（如 Dropbox、Drive 等）上。<!-- more -->

可这俩在国内都被墙了，而手机翻墙总是显得有些不够方便，与是我就琢磨着自己搭建一个云服务，随后就发现了 NextCloud 这一开源云服务。而网上的教程都太过复杂了，对新手太过不友好，于是乎——一篇近乎傻瓜式的 NextCloud 教程诞生了。

## 安装

这里采用 Docker 容器方式来安装 NextCloud，这样就不用担心各种环境依赖了（NextCloud 的依赖简直多得吓人，而 Dockerfile 会帮你把依赖都配置好）

### 安装 Docker

> 注：Docker 仅支持 64-bit 的系统

Docker 现已被各大发行版的仓库收入，采用正常安装命令即可：

```bash
yum -y install docker
```

随后，启动 Docker 守护进程：

```bash
# systemctl
systemctl start docker
# Service
service docker start
```

### 安装 NextCloud

#### 自动安装

有了 Docker 后，就可以几行代码安装 NextCloud 了：

```bash
# clone nextcloud 的 docker 容器
git clone https://github.com/nextcloud/docker.git
# 耐心等待安装
docker run -d -p 8080:80 nextcloud 
```

安装完成后先别忙着启动，`docker ps -a -q` 查看一下容器的 id，是一串 12 位的字符串，为了便于记忆，重命名一下：

```bash
docker rename ××× nextcloud     # ××× 即为容器 id
```

随后就可以采用如下命令启动了：

```bash
docker start nextcloud
# 测试
curl http://localhost:8080
```

这样，就完成了 NextCloud 的安装工作。

#### 手动安装

方法一只能安装最新版的 NextCloud，而最新版缺少部分功能，如：无法添加 Drive 和 Dropbox 的外置存储。如果你对外置存储不是很 care 的话，那就按照方法一安装就可以了。

```bash
git clone https://github.com/nextcloud/docker.git
cd docker/12.0/apache
```

这里采用官方编写的 Dockerfile 手动构建，所以时间会花得比较久。

```bash
docker build -t nextcloud .
```

这时候用 `docker images` 应该可以看到刚刚创建的镜像了，随后创建容器：

```bash
docker create -v /var/www/html/apps/:/var/www/html/apps -v /var/www/html/config/:/var/www/html/config -v /var/www/html/data/:/var/www/html/data -p 127.0.0.1:8080:80/tcp --name nextcloud nextcloud
```

稍稍解释一下参数：

- -v 后面是地址，前半部分是 VPS 的地址，后半部分是容器内的地址
- -p 后面是端口号
- --name 后面是容器名称
- 最后的 nextcloud 是镜像名称

## 配置

### Nginx 配置

由于 NextCloud 已经占用了 8080 端口，这里采用 Nginx 做反向代理，将域名直接解析至 8080 端口。

```nginx
server {
  listen 80;
  server_name cloud.example.com;
  location / {
    proxy_pass http://localhost:8080;
  }
}
```

重启 Nginx 服务后，就可以通过 cloud.example.com 来访问云服务了。

### NextCloud 配置

```bash
# 进入容器内的 bash
docker exec -i -t nextcloud bash
```

有时候 NextCloud 会自己定向至本地的 8080 端口，所以需要手动重写正确的地址：如果提示不能定位软件包，先执行 `apt-get update`

```bash
vim config/config.php
# 加上下面这行
'overwritehost' => 'cloud.example.com',
```

重启，让配置生效：

```bash
docker restart nextcloud
```

### MySQL 配置

~~由于我 VPS 的内存比较小，所以并没有启用 MySQL/MariaDB 数据库（怕爆内存），而是采用了 SQLite，反正也是我一个人用，问题不大。~~

开启了 MySQL 后发现内存也就多了 20M（但性能的提升可不是一点半点），遂还是改成 MySQL 了：

1. 安装 MySQL（这里采用 MariaDB 分支）

   ```bash
   yum -y install mariadb-server mariadb-client
   # 设置一下 root 密码等
   mysql_secure_installation
   ```

2. 开启 daemon 服务

   ```bash
   systemctl start mariadb
   systemctl enable mariadb
   ```

3. `mysql -uroot -p` 登录 MySQL

   ```mysql
   # 创建 nextcloud 数据库
   CREATE DATABASE nextcloud CHARACTER SET = utf8 COLLATE = utf8_general_ci;
   # 创建 nextcloud 的用户
   CREATE USER nextcloud IDENTIFIED BY 'admin123';
   # 赋予对数据库所有的权限
   GRANT ALL ON nextcloud.* TO nextcloud;
   ```



### 初始设置

1. 打开 https://cloud.example.com

2. 创建管理员帐号和密码

3. 数据库就选择 MySQL/MariaDB，其它参考下表：

|  名称  |     值      |
| :--: | :--------: |
| 用户名  | nextcloud  |
|  密码  |  admin123  |
| 数据库名 | nextcloud  |
|  地址  | 172.17.0.1 |

**注意：这里的地址千万不要填写成了 localhost 或者 172.0.0.1，因为这里的地址需要容器内与外部通信。**

点击完成后，等待几秒就可以使用了。

## 挂载外部云盘

由于我 VPS 的容量只有 10g，故而放不了过多的视频，就考虑采用外部存储的方法，将 Drive、Dropbox 挂载至 NextCloud 外部存储或者 VPS。

> 注：NextCloud 13 已经取消对 Drive、Dropbox 外部存储的支持（这时候你也可以选择把 Drive 直接挂载至 VPS 本地目录，再通过外部存储链接至挂载目录来完成）。

### 启用外部存储插件

在应用页面，启用 `External storage support` 插件：如果提示：「没有安装 “smbclient”无法挂载 “SMB / CIFS”, “SMB / CIFS 使用 OC 登录信息”. 请联系您的系统管理员安装.」

解决办法：

### 安装 smbclient

```bash
# 进入容器的内的 console
docker exec -i -t nextcloud bash
apt-get install libsmbclient-dev
```

这里简单说一下，不管你的 VPS 原本的系统是 CentOS、RedHat、Debian，统一都用 apt-get 安装，因为现在处于的是 docker 容器内的系统，与 VPS 的系统是分离的。

接着再安装 smbclient：

```bash
pecl install smbclient
```

同时会提示：「You should add "extension=smbclient.so" to php.ini」，这里又被小坑一把，网上大部分教程所说的 `/etc/php.d/php.ini` 并不存在，在 docker 容器内部该文件是在 ：

```bash
vim /usr/local/etc/php/conf.d/docker-php-ext-intl.ini
# 加上下面这行
extension=smbclient.so
```

随后重启 NextCloud 服务就应该就 OK 了。

随后如果你安装的 NextCloud 是 13 版本及以上的话，就只有考虑用 [box](https://www.box.com/) 提供的 [WebDAV](https://community.box.com/t5/Upload-and-Download-Files-and/WebDav-with-Box/ta-p/310) 来作为外置存储了，不过只有 10G 的容量，且最大文件限制是 250MB。如果是用的 12 版本及以下的话，就可以考虑采取 Drive 作为外置存储了：

### 获取 API

1. 访问 [Google 开发者平台](https://www.orgleaf.com/go.php?url=https://console.developers.google.com)：

2. 点击「启用 API 和服务」

3. 点击「Google Drive API」

4. 点击「启用」

5. 点击左侧的凭据 -> OAuth 同意屏幕：

   ![Screenshot_20180401_114932.png](https://i.loli.net/2018/04/01/5ac056ed28f61.png)

   按照以上格式填写，点击保存

6. 随后创建凭据：

   应用类型选择**网页应用**，其它的参考以下：

   ![Screenshot_20180401_115235.png](https://i.loli.net/2018/04/01/5ac0579b7ebd2.png)

   点击创建后，会弹出悬浮框告诉你 ID 和 Key。


### 配置 NextCloud

登录 NextCloud，转至管理页面，点击「外部存储」，选择 Google Drive，填入 API 和 Key，点击授权，若授权时出现 400 错误，那么是重定向的 URI 出问题了，再添加如下一条：

```
https://cloud.example.com/index.php/settings/admin/externalstorages
```

如果提示「此应用未经过验证」，点击高级 -> 转至 example.com，忽略掉就行。

![Screenshot_20180401_115546.png](https://i.loli.net/2018/04/01/5ac058548493a.png)

当出现了绿色按钮，就表示配置成功了。

Enjoy it！

参考：

- [Docker image of Nextcloud](https://github.com/nextcloud/docker#how-to-use-this-image)
- [用 Docker 和 Nginx 搭建自己的云服务器（Nextcloud）](https://oing9179.github.io/blog/2017/03/Setup-Nextcloud-using-Docker-and-Nginx/)
- [连接 Google Drive 教程](https://www.orgleaf.com/903.html)
- [FreeNAS 10 NextCloud 開啟外部儲存媒體的 SMB 功能](https://www.brilliantcode.net/486/freenas-10-nextcloud-use-smb-as-external-storage/)