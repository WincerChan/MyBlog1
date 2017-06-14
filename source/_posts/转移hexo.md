---
title: Hexo转移
type: categories
categories: 笔记
tags:
  - Hexo
  - 教程
encrypt: true
enc_pwd: zyi
copyright: true
abbrlink: 7efd2818
date: 2017-06-02 21:37:00
---

![](https://i.v2ex.co/5bb7J7NT.png)

<!-- more -->

换电脑或者重装系统后，Hexo如何转移是个问题，可采取下面这种方法
1. 从官网Git下载git，在新电脑上安装，因为https速度慢，而且每次都要输入口令，常用的是使用ssh。使用下面方法创建：
  1. 打开git bash，在用户主目录下运行：ssh-keygen -t rsa -C "youremail@example.com" 把其中的邮件地址换成自己的邮件地址，然后一路回车
  2. 最后完成后，会在用户主目录下生成.ssh目录，里面有id_rsa和id_rsa.pub两个文件，这两个就是SSH key密钥对，id_rsa是私钥，千万不能泄露出去，id_rsa.pub是公钥，可以放心地告诉任何人。
  3. 登陆GitHub，打开「Settings」->「SSH and GPG keys」，然后点击「new SSH key」，填上任意Title，在Key文本框里粘贴公钥id_rsa.pub文件的内容（千万不要粘贴成私钥了！），最后点击「Add SSH Key」，你就应该看到已经添加的Key。注意：不要在git版本库中运行ssh，然后又将它提交，这样就把密码泄露出去了。
2. 下载Node.js和npm，并安装
3. 打开git bash客户端，输入 npm install hexo-cli -g，开始安装hexo
4. 下面就将原来的文件拷贝到新电脑中，但是要注意哪些文件是必须的，哪些文件是可以删除的。
  1. 讨论下哪些文件是必须拷贝的：首先是之前自己修改的文件，像站点配置_config.yml，theme文件夹里面的主题，以及source里面自己写的博客文件，这些肯定要拷贝的。除此之外，还有三个文件需要有，就是scaffolds文件夹（文章的模板）、package.json（说明使用哪些包）和.gitignore（限定在提交的时候哪些文件可以忽略）。其实，这三个文件不是我们修改的，所以即使丢失了，也没有关系，我们可以建立一个新的文件夹，然后在里面执行hexo init，就会生成这三个文件，我们只需要将它们拷贝过来使用即可。总结：_config.yml，theme/，source/，scaffolds/，package.json，.gitignore，是需要拷贝的。
  2. 再讨论下哪些文件是不必拷贝的，或者说可以删除的：首先是.git文件，无论是在站点根目录下，还是主题目录下的.git文件，都可以删掉。然后是文件夹node_modules（在用npm install会重新生成），public（这个在用hexo g时会重新生成），.deploy_git文件夹（在使用hexo d时也会重新生成），db.json文件。其实上面这些文件也就是是.gitignore文件里面记载的可以忽略的内容。总结：.git/，node_modules/，public/，.deploy_git/，db.json文件需要删除。
5. 在git bash中切换目录到新拷贝的文件夹里，使用 npm install 命令，进行模块安装。很明显我们这里没用hexo init初始化，因为有的文件我们已经拷贝生成过来了，所以不必用hexo init去整体初始化，如果不慎在此时用了hexo init，则站点的配置文件_config.yml里面内容会被清空使用默认值，所以这一步一定要慎重，不要用hexo init。
6. 安装其他的一些必要组件，如果在node_modules里面有的，就不要重复安装了：
  1. 为了使用hexo d来部署到git上，需要安装npm install hexo-deployer-git --save
  2. 为了建立RSS订阅，需要安装npm install hexo-generator-feed --save
  3. 为了建立站点地图，需要安装npm install hexo-generator-sitemap --save插件安装后，有的需要对配置文件_config.yml进行配置，具体怎么配置，可以参考上面插件在github主页上的具体说明
7. 使用`hexo g`，然后使用`hexo d`进行部署，如果都没有出错，就转移成功了！
