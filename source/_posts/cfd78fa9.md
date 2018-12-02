---
title: 解除百度云下载限速
type: categories
categories: 分享境
tags:
  - 教程
  - 百度云加速
  - 百度云
  - 限速
copyright: true
abbrlink: cfd78fa9
date: 2017/05/22 14:32:00
updated: 2018/12/13 10:46:10
thumbnail: https://ae01.alicdn.com/kf/HTB1aFu_aiLrK1Rjy1zdq6ynnpXaU.jpg
---

目前关于破解百度云限速的方法网上提供了许多种，实则是殊途同归，即：高速链接 + 多线程下载工具。而目前获取的链接的方法并非完美且存在一些限制，但聊胜于无。我将目前网上能搜集到的方法一一列举，同时也会针对每个方法的适用性与方便性做出评价。

<!-- more -->

## TL; DR

Windows 客户端用[这种方法](../../#速盘（Windows）)。

浏览器用[这种方法](../../#BaiduExporter)。

## 获取下载直链

这一类方法都是以插件获取下载直链，再辅以多线程下载工具来达到不限速的目的，以下为各个插件的具体说明：（有关多线程下载工具 Axel 见文章末端）

### 下载助手

1. 下载[油猴脚本管理器](http://tampermonkey.net/)

2. 安装[下载助手修改版](https://greasyfork.org/zh-CN/scripts/39776)脚本

3. 打开百度云，勾选需要下载的文件

4. 上方会出现「下载助手」的按钮，依次点击：*压缩按钮 -> 获取压缩按钮*：

   ![下载助手](https://ae01.alicdn.com/kf/HTB1XhIyKkOWBuNjSspp760PgpXaD.png)

此方法适用性应当比较高。以下是 Axel 开启 128 线程的示例：

![下载实例](https://ae01.alicdn.com/kf/HTB1vlqNKgaTBuNjSszf760gfpXaF.png)

缺点就是有些麻烦：需复制 Header 信息才可掉调用下载工具（如 Axel 等）下载，获得 Header 的方法就是打开调试窗口，粘贴该链接在 Chrome 地址栏，在 Network 选项卡中查看该链接的 Request Headers，至少需要将 Cookie、User-Agent 两项传入给下载工具。

> **注意：这里的 Cookie 并不是当前域名（pan.baidu.com）的 Cookie，是 `pcs.baidu.com` 的 Cookie，其实所需要的仅仅是 Cookie 的 `BDUSS` 和 `pcsett` 值**

### baidudl

该方法已失效。

这是爱吾破解的一位大佬开发的插件，已在 GitHub 上[开源](https://github.com/Kyle-Kyle/baidudl)，同时也已上架 [Chrome 应用商店](https://chrome.google.com/webstore/detail/baidudl/lflnkcmjnhfedgibjackiibmcdnnoadb)

1. 在百度云盘的界面点击「baidudl 图标」：会列出当前文件夹的所有文件
2. 点击 `Generate` 按钮
3. 复制生成的 `Glinks`，即为「高速链接」

此方法适用性较低，许多敏感的资源无法使用此方法下载。

### BaiduExporter

> ~~自本文最近一次更新起，该方法获取的链接已无法在 Axel 中使用，原因是 URL 参数中的 app_id 失效，但这失效的 app_id 的 URL 却仍然可以用 aria2c 下载。~~可以使用我 [Fork 后修改](https://github.com/WincerChan/BaiduExporter)的版本作为代替。
>
> 我的小号在使用这个方法的时候被封了，直接 403，更换帐号后可正常下载。被封之后大概两天内会解封。建议线程数不要开太多，被封之后可以更换速盘下载。

1. clone 该仓库

2. *Chrome -> 更多工具 -> 扩展程序 -> 加载已解压的扩展程序（需勾选开发者模式） -> chrome/release（文件夹）*

3. 进入想要下载文件的界面

4. 勾选，点击 *导出下载 -> 文本导出 -> 拷贝下载链接*：![导出下载](https://ae01.alicdn.com/kf/HTB11O.dttcnBKNjSZR0763FqFXam.png)

5. 复制链接后，是一串格式类似以下内容的命令：

   ```bash
   axel -o "xxxxxx" -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36" -H "Cookie: BDUSS=9aRnpJYjF-THlHUbbjxkTYUnjk^&8naddR2NscTF-cFZJVWV3cDBvVkVaeHpHOFNJcXRhQVFBQUFBJCQAAAAAAAAAAAEAAADvjlIvY3cwODI5OQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABKVg1oSlYNaS0; pcsett=4789643579-hukfa445465a15156c1515a5f12cxzw4" "URL" -n 233
   ```

   其中包含两个 HTTP 首部信息：分别是 UA、Cookie，这两个信息在上一步骤的框里均会显示，**不要直接复制我的，Cookie 会过期**。其中最后一个参数 `-n 233` 是需要你手动输入的线程数量，即为采取 233 个线程下载。

[该项目](https://github.com/acgotaku/BaiduExporter)算是目前比较完美的解决方案了，以下是使用 Axel 开启 256 个线程后的速度（不要在意中间的乱码）：

![截图](https://ae01.alicdn.com/kf/HTB1YuS7B5OYBuNjSsD4762SkFXai.png)

原项目是将链接导出至 ariac2 下载，但是 ariac2 却只能最多开启 16 个线程，这对一般下载任务也够了，但是对于百度这种老流氓来说（每个连接限速至 10Kb/s ），还是不够用的，所以我 Fork 后采用 Axel 代替 ariac2，Axel 可以设置任意连接数）。

此方法也是我目前一直在使用的方法。

### ADM + ES

这个方法是酷安上流传已久的方法，但我一直都无法满速，还是在这里提一下吧，造福一下手机党：

1. 安装 [ES 文件浏览器](https://www.coolapk.com/apk/com.estrongs.android.pop)
2. 安装 ADM（酷安手机客户端下载）
3. ADM 线程数调至最高
4. 修改 User-Agent：*ADM -> 设置 -> 下载 -> 用户代理 -> \<Custom>*，将以下内容复制进去：`netdisk;7.8.1;Red;android-android;4.3`
5.  *ES 文件浏览器 -> 网络 -> 新建 -> 百度网盘*，随后登录就会进入网盘界面，进入文件夹找到需要下载的文件后 *长按 -> 更多 -> 打开为 -> 视频 -> ADM*，这样就会调用 ADM 下载了

同样该方法并非完美，用「ES 文件浏览器」获取的百度云链接只能在该手机端使用，因为该链接是通过本地端口远程链接所生成的，故还是有一些限制，速度不稳定（会有一些不稳定的波动）：

![ADM 下载](https://ae01.alicdn.com/kf/HTB1hMjxB2uSBuNkHFqD760fhVXaI.png)

## 第三方客户端

这一类方法使用的是别人已经封装好了的第三方客户端，其实就相当于把 获取链接的插件 + 多线程下载工具 打包好成为一个客户端。比上一类方法方便性会强一些，但适用性会弱一些。

### 速盘（Windows）

[该软件](https://www.speedpan.com/)同样是由爱吾一位大神创作，只有 Windows 版。

![SpeedPan 1](https://ae01.alicdn.com/kf/HTB1wVyNKqmWBuNjy1Xa760CbXXah.png)

与其它软件的不同之处在于它还支持网盘资源搜索的功能。

据说是支持直接通过分享链接下载的，但我试了一下通过分享链接下载总是报错。但登录后下载还是可以的。

![SpeedPan 2](https://ae01.alicdn.com/kf/HTB18HzCKeuSBuNjy1Xc763YjFXaP.png)

### BaiduPCS-Go（全平台）

[该项目](https://github.com/iikira/BaiduPCS-Go)是使用 Go 语言编写的**命令行**客户端，支持下载、分享、上传、离线下载等功能。

我没有使用过该项目，但该项目在 GitHub 上收获 6.5k 的 star，应当是获得了许多人的认可。

## 附 Axel 使用方法

我为什么提倡使用 Axel 来代替 aria2c 作为多线程下载工具呢，原因是 aria2c 最多只能设置 16 线程下载，虽说网上有修改成 512 线程的版本，但我试了之后发现速度并没有提升。而 Axel 对此则没有限制。

### 安装

该软件已经附在各发行版的源仓库中了，直接安装就行。对于 Windows 来说可以自行从源码编译，这是[教程](https://github.com/axel-download-accelerator/axel#3-building-from-source)。

### 使用

终端输入 `axel --help`：

```bash
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

本文持续更新中。
