---
title: 使用持续集成（CI）开发项目
date: '2018/06/09 10:22:34'
updated: '2018/06/15 12:34:43'
categories: 分享境
tags:
  - CI
  - 持续集成
copyright: true
abbrlink: f011ea9c
thumbnail: https://ae01.alicdn.com/kf/HTB15F15adfvK1RjSspo762fNpXaC.png
---

我的博客在建站后不久就使用了 [Travis CI](https://travis-ci.org/) 自动部署服务，即我只需要将修改的源码推送至 GitHub，Travis CI 会自动将我提交的代码拉取，在 Travis CI 端生成静态文件后，同步至我的服务器，这样可以减少一些麻烦的步骤：可以直接在 GitHub 端修改代码；不用等待生成静态文件、压缩静态文件的时间。<!--more-->

## Circle CI

虽然使用 Travis CI 是能简化部分开发流程，但这货和 GitHub 是一对一的，只支持在 GitHub 托管的项目，并不支持 Bitbucket 和 GitLab，而 GitHub 免费版在私人仓库这一方面是比不上 Bitbucket 和 GitLab 的（虽然我是学生，可以使用 GitHub 私人仓库，可我也不一直是学生呀），同时支持 Bitbucket 的和 GitHub 私人仓库的 CI 工具（自建的除外）好像真的也就 [CircleCI](https://circleci.com/) 了，这里之所以没有考虑 GitLab 是因为 GitLab 自带有 CI/CD，而且这家公司给我的印象实在不太好（包括之前的删库事件，以及莫名奇妙的 Bug）。

在了解 CircleCI 后发现比 Travis CI 真是强不少（CircleCI 是基于 Docker 和 Workflows 设定模式的），不过在网上并没有很完善的中文教程~~（虽然官方英文文档已经很完善了）~~。所以如果你懒得翻官方文档的话，继续往下看我这篇文章就好了🤓。

## 选择仓库

CircleCI 支持 GitHub 和 Bitbucket 帐号的登录，授权登录完成后，就可以添加 Projects 了，支持 GitHub 和 Bitbucket 的公有及私有仓库。这里以我的 [Meme-generator](https://github.com/WincerChan/Meme-generator) 仓库为例。

选完仓库后，就可以开始配置 CircleCI 了。

## 准备工作

### 添加 SSH 密钥

[Meme-generator](https://github.com/WincerChan/Meme-generator) 仓库用到 SSH 密钥的地方有两处：

1. 从 GitHub 克隆仓库
2. 将编译后的静态文件推送至我的服务器

如果你是用来推送至 GitHub 的话，可以直接用 GitHub 提供为该仓库提供的 Token 密钥，第一点也可以使用 HTTPS 方式克隆，就可以省去添加 SSH 密钥这个步骤。

点击 CircleCI 个人主页的 JOBS 菜单项，随后点击仓库名称右边的齿轮按钮 -> 点击 `SSH Permissions` -> 点击蓝色的 `Add SSH Key` 按钮，将**私钥**（看清楚了，是私钥）粘贴进去（超级良心有木有啊，比 Travis CI 将私钥加密上传这种土办法不知道高到哪里去了）。

### 添加 IP 至 known\_hosts

添加 SSH 密钥后，还需要将服务器的 IP 添加至 known_hosts 列表，否则每次部署的时候都会让你确认以下消息：

```bash
The authenticity of host '××.×××.×××.×××' can't be established.
ECDSA key fingerprint is SHA256:7hkfahfla8VeiuyF/TLHKfhakgcJ0sHjaLxDyIKlfhak9fuaofoa.
Are you sure you want to continue connecting (yes/no)?
```

同 Travis CI 类似，CircleCI 在运行的过程中也是不接受命令行输入的（当然运行完成后就更不行了），所以我们需要提前将 IP 写入 known\_hosts（在 CircleCI 中如何做？继续往后看）：

```bash
ssh-keyscan $SSH_IP >> ~/.ssh/known_hosts
```

在该仓库的管理页面中的 `Environment Variables` 选项卡中添加 SSH_IP 的环境变量。

## 配置文件

### 简单的例子

由于我的配置文件太过长了，先以一个简化版为例：

```yaml
version: 2
jobs:
  build:
    docker:
      - image: circleci/node:10.4.0
    steps:
      - checkout
      - run:
          name: Install Dependence
          command: |
            yarn install && yarn build
      - run:
      	  name: Deploy
      	  command: |
      	    echo "Denpendence installed."
```

首先指明 CircleCI 的版本号——2.0（1.0 在 18 年 9 月之后就停止支持了）。

其次，为 Docker 指定 image（[这是](https://circleci.com/docs/2.0/circleci-images/)官方已经构建完成的镜像列表），可以指定多个 image。先前提到过，CircleCI 并不默认像 Travis CI 那样提供 Linux 虚拟机镜像，推荐使用的是 Docker（当然你也可以指定工作方式为 Machine），这是官方针对 Docker 和 Machine 的[对比报告](https://circleci.com/docs/2.0/executor-types/#overview)。

随后在 `steps` 里面是需要运行的指令：

1. `checkout` 是一个用于检查配置路径的源代码的特殊步骤，并可以通过 SSH 来 clone 远程仓库的代码（如果你已经添加了 SSH 私钥的话，不然就只好手动 clone 了），详解见[官方文档](https://circleci.com/docs/2.0/configuration-reference/#checkout)
2. `run:` 后面接的是 bash 命令，`name` 该任务的名称，`command` 为具体 bash 的指令

### 安装额外命令

需要注意的是，如果你需要将生成的静态文件同步至服务器所用的 `rsync` 命令是没有被安装的，只有[这些命令](https://circleci.com/docs/2.0/circleci-images/#pre-installed-tools)是被安装在所有镜像中的。

docker 镜像预装的系统是 Ubuntu，可采取 `apt-get` 命令来安装需要的软件包：

```yaml
run: 
  name: Update System
  command: |
    sudo apt-get update && sudo apt-get install rsync
```

### 设置缓存

CircleCI 建议的 Workflows 中建议将整个工作流分割成不同的子作业，比如说以 Yarn 项目为例，可以分成 `build` 和 `deploy` 两个流程。其中 `build` 用以安装依赖和生成待部署的静态文件；`deploy` 用以将生成的静态文件部署至服务器。

可以看出，静态文件是横跨两个作业的，所以我们需要将包含静态文件的文件夹缓存下来（当然你也可以选择不使用 Workflows，这样就只需创建一个工作就好了），在 `build` 工作中缓存采取如下命令：

```yaml
steps:
  - restore_cache:
    keys:
      - build-v1-{{ checksum "package.json" }}
    paths:
      - "build"
```

以上命令是将 `build` 文件夹以 `key-value` 形式缓存，其中 `key` 选择的是 `package.json` 的哈希值。这里的文件名最好选择仓库自带的文件。更多 `key` 的形式可以参考[这里](https://circleci.com/docs/2.0/caching/#using-keys-and-templates)。

在 `deploy` 工作中恢复缓存采取以下命令：

```yaml
steps:
  - checkout
  - restore_cache:
    keys:
      - meme-v1-{{ checksum "package.json" }}
```

注意在 `restore_cache` 之前一定要有 `checkout` 命令。

### 完整的示例

直接放 [Meme-generator](https://github.com/WincerChan/Meme-generator) 项目的配置代码了：[点我](https://gist.github.com/WincerChan/04b5e1ee8a1fbc8bc2e078d2c354bd7b)。

每次构建完成后，commits 列表的画风就变成这样了：

![CircleCI 构建](https://res.cloudinary.com/wincer/image/upload/v1530858045/blog/ci_project/circleci_construction.png)

点击 Details 就会显示每次构建的详细过程。

## 后记

虽然本文名为「使用持续集成（CI）开发项目」，但实际却好像只介绍了 CircleCI，当然我的意思不是钦定 CircleCI 作为最好的持续集成系统，我没有说 CircleCI 是最好的持续集成系统，没有任何这个意思。但你一定要问我为什么选 CircleCI，它现在对 Bitbucket 和 GitHub 的私人仓库支持最完善，我怎么能不支持它呢？

参考：

- [2.0 Docs](https://circleci.com/docs/2.0/)
