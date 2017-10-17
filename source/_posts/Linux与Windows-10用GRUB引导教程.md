---
title: Linux与Windows 10用GRUB引导教程
type: categories
tags:
  - Linux
  - Windows
  - 双系统
date: '2017/10/17 11:35:19'
copyright: true
abbrlink: ad42f575
---

## 前言
去年暑假的时候，写了一篇如何装Linux和Windows 10双系统的文章发在了简书上，我写这篇文章的原因是当初装双系统确实是折腾了许久，网上也找不到一篇详尽的教程。由于去年对于写教程还不是熟练，而这一年多的使用过程也遇到了一些问题，所以就准备“Refactoring”这篇文章。
## EFI分区
在教程正式开始之前，先花一点时间说明EFI分区的组成和作用。
首先，在你装了Windows之后，Windows在装机过程中会将硬盘划分出一个约100m大小的分区，称为EFI分区这个分区就是起引导作用的。在资源管理器中是看不到的这个分区的，可以在磁盘管理中看到，管理则需要借助[DG工具](http://www.diskgenius.cn/)。便于说明，在装好了Linux之后，我将EFI挂载至boot分区截图:
<!-- more -->
![](https://ws1.sinaimg.cn/large/ba22af52gy1fkl3a5pwv6j20ng0hwwfn.jpg)
可以看到，该分区包含3个文件夹(如果你没有装Linux的话，就只有两个)，分别是Boot、Microsoft和Manjaro，其中Boot文件夹就是UEFI引导所必需的文件。
我们继续打开`Microsoft/Boot`文件夹:

![](https://ws1.sinaimg.cn/large/ba22af52gy1fkl3b006w1j20ng0hwdhj.jpg)

这些文件就是启动Windows 10所必需的，包含了语言包、字体等，BCD包含了 windows 引导开始以后的信息。其中，**bootmgfw.efi 是 Windows 默认引导文件**。
1. EFI/Boot/bootx64.efi
2. EFI/Microsoft/Boot/bootmgfw.efi

以上是采用UEFI启动Windows 10的文件结构，也就是说，当你按下开机按钮的时候，首先UEFI找到EFI分区的Boot文件夹，然后加载`bootx64.efi`文件，读取文件信息，找到`EFI/Microsoft/Boot/bootmgfw.efi`，按照`bootmgfw.efi`的要求，加载所需的启动信息，启动Windows 10。

## 准备工作
在正式装系统之前，我们还需要做一些准备工作:
### 关闭Windows的快速启动
这个功能的作用是在于关机的时候不完全断电，类似将系统处于“休眠”状态，这样可以让开机更加迅速。但这也就导致了只能使用Windows系统。
### 关闭BIOS的Secure Boot的功能
在默认情况下，UEFI固件只会加载那些被签名的引导程序。在缺少Secure Boot功能的传统PC机上，恶意的后门程序可以加载自身，进而摇身一变伪装成一个引导程序。这样的话，BIOS就会在启动的时候加载后门程序，这样它就可以躲过操作系统，把自己隐藏得很深。
但是不得不说，这对我们安装Linux造成了很大的困扰，也是直接导致我们重启到Windows 10后进不去Linux的原因。
首先我们要关闭这个功能:进入BIOS找到Secure Boot，选择disabled，这样就关闭了。当然，有些人进入BIOS会发现Secure Boot这个选项是灰色的（比如我的就是），这时你需要先给你的BIOS设一个密码，然后就能关Secure Boot了。
## 安装Linux
所有的准备都已经完成，这时就可以准备刻录U盘了，不推荐UltraISO，经亲测，软碟通仅刻录Ubuntu能成功，其它绝大多数发行部都会失败。推荐「[Rufus](https://rufus.akeo.ie/)」和「[USBWriter](https://sourceforge.net/projects/usbwriter/)」，这两个软件都可以。
刻录完成后，重启按`f12`，选择从USB设备启动，对于绝大多数发行版来说一路回车就行了，只需要注意一点：**在选择挂载boot位置的时候，一定要挂载在efi分区**，别的都不行。
重启之后，不出意外的话，你会直接进入Windows 10，不要担心，这时Linux已经安装成功了，我们只需要将引导文件替换一下。

## 替换引导文件
先用DG打开EFI分区，你会看到多了一个文件夹，名称取决于你安装的是哪一个发行版。我安装的是Manjaro Linux，名称就是Manjaro，打开之后会发现里面有一个名为`grubx64.efi`的文件，这就是启动Linux的引导文件。和Windows 10的`bootmgfw.efi`类似，我们想要用`grubx64.efi`引导代替掉`bootmgfw.efi`，这样就可以用GRUB引导了。步骤:
1. 进入管理员命令行。方法:win+x，再按a
2. 输入`bcdedit /set {bootmgr} path \EFI\Manjaro\grubx64.efi`。提示操作成功的话，就完成了。

至此，如果你安装的是除arch之外绝大多数发行版，那么接下来就和你没有啥关系了，你已经成功了，好好享受吧！

开机之后会发现进入GRUB的引导了，通常会包含至少三个选项（以Manjaro举例）：Manjaro、Manjaro 高级选项和Windows Manager。这就代表你已经完美的解决了Windows和Linux双系统引导的问题。
## 修复Windows引导
这一点是我安装Arch Llinux的时候发现的，Arc Linux安装过程是手动安装的，在编写GRUB的时候会扫描不到Windows Manager所在的分区（当然可能不是所有人都会遇到），所以在GRUB界面可能会看不到Windows Manager选项，导致进不去Windows 10，这里就需要手动编辑GRUB信息，我们打开/boot/grub/grub.cfg文件，发现里面确实没有Windows 10的启动信息，在后面加上：

```bash
menuentry "Microsoft Windows 10" {
  insmod part_get
  insmod fat
  insmod search_fs_uuid
  insmod chain
  search --fs-uuid --set=root $hints_string $fs_uuid
  chainloader /EFI/Microsoft/Boot/bootmgfw.efi
}
```

**注意**：

这里的`$hints_string`，代表的是终端执行命令：

```bash
sudo grub-probe --target=hints_string /boot/efi/EFI/Microsoft/Boot/bootmgfw.efi
```
后的输出；

而`$fs_uuid`代表的是：

```bash
sudo grub-probe --target=fs_uuid /boot/efi/EFI/Microsoft/Boot/bootmgfw.efi
```

的输出。

然后保存。在终端执行命令：`sudo grub-mkconfig -o /boot/grub/grub.cfg`，就OK了。

到此， Arch Linux和Windows 10双系统也配置完毕了。

## 附加问题

在使用这一年多的时间，遇到了以下的几个问题:
1. 在Windows 10进行了一个大更新后，会发现GRUB引导界面没有了，还是直接进入了Windows 10，这时只需要按照 `替换引导文件` 的方法重新输入一遍命令就行。
2. 使用Linux某个发行版一段时间之后，难免会想尝试一下另一个发行版。这时请务必将之前的发型版的引导文化删除，否则可能会出现无论怎么设置都无法进入GRUB的情况。例如:我之前用的是Ubuntu，我现在换成了Manjaro，我就需要用DG删除EFI分区的Ubuntu文件夹。
3. 在我使用Manjaro更新了一次Linux的内核后，进不去Windows 10了，这个时候千万不要直接修复Windows 10引导，这会格式化EFI分区，只需要按上面 `修复Windows引导` 的方法编辑一下GRUB就可以了。

最后：祝使用愉快。