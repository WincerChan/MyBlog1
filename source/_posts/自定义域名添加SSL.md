---
title: 自定义域名的 GitHub Pages 添加 SSL 的方案
date: '2017/06/16 10:25:30'
type: categories
categories: 博客栈
copyright: true
tags:
  - 安全
  - HTTPS
abbrlink: 444a2b9d
---

> 从 2017 年 1 月份正式发布的 Chrome 56 开始，Google 将把某些包含敏感内容的 HTTP 页面标记为“不安全”，比如含有密码或支付表单信息。

GitHub Pages 不支持用户自定义证书，所以当你用自定义域名的时候是不能用自己购买的 SSL 证书的，会和 GitHub 的起冲突，这里采用的是 [CloudFlare](https://www.cloudflare.com/) 自主研发的 [Keyless SSL](https://www.cloudflare.com/ssl/keyless-ssl/) 服务。简单来说就是你把网站放在 CloudFlare 的 cdn 上，不用提供自己的私钥，也能使用 SSL 加密链接。

## 创建 CloudFlare 账户

首先你需要购买自己的域名，然后添加 CNAME 确定通过购买的域名能访问到 GitHub Pages，我的 CNAME 写的是 `wincer.top`。

1. 点击注册 [CloudFlare](https://www.cloudflare.com/a/sign-up)
2. 登录后，添加域名，例如：wincer.top（大约需要等待 1 分钟扫描）。注意：**不要填写前缀**

<!-- more -->

## 添加 DNS 记录

![](https://ws1.sinaimg.cn/large/ba22af52gy1fgmugjxm3mj20ql08zt98.jpg)

按照上图，将 `wincer.top` 换成你自己的域名，ip 地址不用换，是 GithHub 服务器的 IP。

完成之后，去你的域名提供商处修改你的 DNS 服务器为 CloudFlare 提供的（完成上一步后 CloudFlare 会提供两个 DNS 服务器给你）。

> 官方说明修改域名服务器需要最快 72 小时生效，我大概花了 10 分钟生效，如下图代表已生效。

![](https://ws1.sinaimg.cn/large/ba22af52gy1fgmuohxy0yj20qm06b3yl.jpg)

## 设置 SSL

点击上方菜单的 Crypto 选项，设置 Flexible

再点击 Page Rules 选项，添加如下两条规则

1. 将 `www.wincer.top` 重定向至 `https://www.wincer.top`

![](https://ws1.sinaimg.cn/large/ba22af52gy1fgmutr20e5j20m70dzwfc.jpg)

2. 强制站内所有网页使用 HTTPS

![](https://ws1.sinaimg.cn/large/ba22af52gy1fgmuuekyzuj20m70csaav.jpg)

添加 SSL 的教程就此完成。

**注意：CloudFlare 为你的网站颁发的 SSL 证书需要最多 24 小时才会生效，请耐心等待，我是半小时生效的。**

参考：[Secure and fast GitHub Pages with CloudFlare](https://blog.cloudflare.com/secure-and-fast-github-pages-with-cloudflare/)
