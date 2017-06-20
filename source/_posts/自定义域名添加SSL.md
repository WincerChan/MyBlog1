---
title: 自定义域名的GitHub Pages添加SSL的方案
date: '2017/06/16 10:25:30'
type: categories
categories: 网络
copyright: true
tags:
  - 安全
  - HTTPS
abbrlink: 444a2b9d
---

> 从2017年1月份正式发布的Chrome 56开始，Google将把某些包含敏感内容的HTTP页面标记为“不安全”，比如含有密码或支付表单信息。

GitHub Pages不支持用户自定义证书，所以当你用自定义域名的时候是不能用自己购买的SSL证书的，会和GitHub的起冲突，这里采用的是[CloudFlare](https://www.cloudflare.com/)自主研发的[Keyless SSL](https://www.cloudflare.com/ssl/keyless-ssl/)服务。简单来说就是你把网站放在CloudFlare的cdn上，不用提供自己的私钥，也能使用SSL加密链接。

## 创建CloudFlare账户

首先你需要购买自己的域名，然后添加CNAME确定通过购买的域名能访问到GitHub Pages（我的CNAME写的是`wincer.top`）。

1. 点击注册[CloudFlare](https://www.cloudflare.com/a/sign-up)
2. 登录后，添加域名，例如：wincer.top（大约需要等待1分钟扫描）。注意：**不要填写前缀**

<!-- more -->

## 添加DNS记录

![](https://ws1.sinaimg.cn/large/ba22af52gy1fgmugjxm3mj20ql08zt98.jpg)

按照上图，将`wincer.top`换成你自己的域名，ip地址不用换，是GithHub服务器的ip

完成之后，去你的域名提供商出修改你的DNS服务器为CloudFlare提供的（完成上一步后CloudFlare会提供两个DNS服务器给你）。

> 官方说明修改域名服务器需要最快72小时生效，我大概花了10分钟生效，如下图代表已生效。

![](https://ws1.sinaimg.cn/large/ba22af52gy1fgmuohxy0yj20qm06b3yl.jpg)

## 设置SSL

点击上方菜单的Crypto选项，设置Flexible

再点击Page Rules选项，添加如下两条规则

1. 将`www.wincer.top`重定向至`https://www.wincer.top`

![](https://ws1.sinaimg.cn/large/ba22af52gy1fgmutr20e5j20m70dzwfc.jpg)

2. 强制站内所有网页使用HTTPS

![](https://ws1.sinaimg.cn/large/ba22af52gy1fgmuuekyzuj20m70csaav.jpg)

添加SSL的教程就此完成。

{% note warning %} 注意：CloudFlare为你的网站颁发的SSL证书需要最多24小时才会生效，请耐心等待，我是半小时生效的。{% endnote %}

参考：[Secure and fast GitHub Pages with CloudFlare](https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/)