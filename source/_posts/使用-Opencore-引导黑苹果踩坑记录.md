---
title: 使用 OpenCore 引导黑苹果踩坑记录
date: '2020/04/22 21:02:19'
updated: '2020/04/22 21:02:19'
categories: 实验室
tags:
  - 黑苹果
  - OpenCore
  - Hackintosh
  - Bootcamp
copyright: true
thumbnail: 'https://ae01.alicdn.com/kf/H8226478d458a4bd0b0f6d79e9544e4eet.jpg'
abbrlink: 7a2a84c6
description: 说起来是有些奇怪，明明我这么想用 macOS，为什么不直接买一台 Mac 呢，其实是因为我对 Windows 还有需要：闲暇时我也会打打游戏，而购置一台用于打游戏顺畅的 Mac，恐怕就只能从 (i)Mac Pro 起步了——我肯定是不会买的。于是，我选择了黑苹果。
---

从大一暑假开始，我便一直使用 Linux 作为日常所用的系统，这三年要说我用 Linux 如何顺心，那绝对是鬼话；可要说我使用得特别难受，那也不至于。因为它的确提升了我的开发体验和编程技能。它的优点我很喜欢、它的缺点我一开始就知道并能接受——这便是我能坚持使用 Linux 三年的原因。

虽然坚持使用了这么久，可我还是要说一句 Linux 作为日常使用的系统真的很不方便，而不方便就会想要去折腾，折腾来折腾去发现时间都浪费了，它还是老样子；可使用 Windows 吧，看着丑哭的字体渲染和残废的命令行工具，感觉自己写代码都没什么动力了，所以当我第一次见到 macOS 时，我在心里就默默地种草了。

种草容易拔草难啊，这一拔就拔了三年。

说起来是有些奇怪，明明我这么想用 macOS，为什么不直接买一台 Mac 呢，其实是因为我对 Windows 还有需要：闲暇时我也会打打游戏，而购置一台用于打游戏顺畅的 Mac，恐怕就只能从 (i)Mac Pro 起步了——我肯定是不会买的。于是，我选择了黑苹果。

## 配置单

> 按照 Tonymacx86 的说法，黑苹果最好选用八代或九代的 Intel CPU ➕ AMD 的显卡配合 Z390 芯片的主板。

本节的撰写时间是 2019 年 9 月，以下是当时的价格，仅供参考：

| 配件 | 型号                       | 价格（¥） |
| ---- | -------------------------- | --------- |
| CPU  | Intel 9700KF               | 2499      |
| 显卡 | AMD Vega 56                | 1600      |
| 固态 | 西部数据黑盘 512G          | 614       |
| 散热 | ID-COOLING CHROMAFLOW 240  | 359       |
| 电源 | 全汗 MS600                 | 599       |
| 主板 | 技嘉 Z390 I AORUS PRO WIFI | 1319      |
| 内存 | 海盗船 DDR4 3000           | 718       |
| 机箱 | Sunmilo T03（定制）        | 939       |
| 合计 |                            | 8647      |

在本文发布时候，我已经使用基于 Clover 引导的黑苹果半年时间了，最近突然手贱升级了 Catalina 导致系统挂了，所以才想干脆放弃 Clover，转向 OpenCore，于是便有了这篇文章。 

> ⚠️：如果你是 OpenCore 纯新手，强烈建议先读读我文末的几篇文章。否则可能会看不懂这篇文章在说什么。

## ACPI 相关

ACPI 的补丁会被 patched 到 OpenCore 引导的所有系统，因此某些非必须的补丁（比如 SSDT-USBX.aml）不建议在 ACPI 中加入，不然可能会造成其他系统无法启动等情况。

### DSDT 提取

目前比较推崇的提取 DSDT 的方式是采用 Clover 来提取，因为这种方法能提取出原生的未曾被 patched 过的 ACPI，但这对从未安装过 Clover 引导的人有些麻烦：需要在 U 盘上创建一个 Clover 的 EFI 分区。

由于 ACPI 的补丁范围并非针对单一的操作系统，因此在使用 OpenCore 引导的系统中提取到的 DSDT 可能并非原生的，不过如果你未曾修补过你的 ACPI，也没使用过黑苹果，可以考虑使用 [SSDTTime](https://github.com/corpnewt/SSDTTime) 工具来提取 DSDT（支持 Windows 和 Linux，不支持 macOS）：双击 SSDTTime.bat（需要 Python 3 环境），选 4 来提取 DSDT：

```bash
#######################################################
#                     SSDT Time                       #
#######################################################

Current DSDT:  None

1. FixHPET    - Patch out IRQ Conflicts
2. FakeEC     - OS-aware Fake EC
3. PluginType - Sets plugin-type = 1 on CPU0/PR00
4. Dump DSDT  - Automatically dump the system DSDT

D. Select DSDT or origin folder
Q. Quit

Please make a selection: 4
```

DSDT.aml 会被提取到脚本目录的 Results 目录下。

 ### 注入原生电源管理

SSDT-PLUG.aml（名字并无限制） 补丁是用于支持原生的 CPU 电源管理。使用 SSDTTime 进行生成：

1. 运行 ./SSDTTime.command（SSDTTime.bat）

   ```bash
     #####################################################
    #                    SSDT Time                      #
   #####################################################
   
   Current DSDT:  None
   
   1. FixHPET    - Patch out IRQ Conflicts
   2. FakeEC     - OS-aware Fake EC
   3. PluginType - Sets plugin-type = 1 on CPU0/PR00
   
   D. Select DSDT or origin folder
   Q. Quit
   
   Please make a selection: 
   ```

2. 输入 「3」后，将 DSDT.aml 拖入当前终端窗口，并 Enter :

   ```bash
     #####################################################
    #                   Select DSDT                     #
   #####################################################
   
   M. Main
   Q. Quit
   
   Please drag and drop a DSDT.aml or origin folder here:
   ```

3. SSDT-PLUG.aml 会自动生成在 Results 文件夹：

   ```bash
     #####################################################
    #                   Plugin Type                     #
   #####################################################
   
   Determining CPU name scheme...
    - Found PR00
   Determining CPU parent name scheme...
    - Found _SB_
   Creating SSDT-PLUG...
   Compiling...
   
   Done.
   
   Press [enter] to return...
   ```

### 开启原生 NVRAM

SSDT-PMC.aml（名字并无限制）补丁是用于开启主板原生的 NVRAM 支持。

使用方法见 xjn [这篇文章](https://blog.xjn819.com/?p=543)的 3.12 节。如果你的主板和我的一样，可以直接使用[我的 SSDT-PMC.aml 文件]( https://github.com/WincerChan/Gigabyte-Z390I-OC/raw/master/EFI/OC/ACPI/SSDT-PMC.aml)。

加载了 SSDT-PMC.aml 之后，「系统偏好设置-节能」里面能看到五个选项——未加载 PMC.aml 之前只有 4 项；未加载 PLUG.aml 之前只有两项。

如果没有开启（模拟或者原生）的 NVRAM，系统可能会出现以下问题：

1. 关机或者重启非常慢且功能错位：明明点了关机，却触发了重启；
3. 睡眠唤醒之后屏幕在鼠标键盘失灵，屏幕冻住（freezing），然后重启。

## 定制 USB 端口

由于 OpenCore 的配置比较追求轻量化，因此一些人在将 Clover 换成 OpenCore 的时候可能会出现一些 USB 设备失灵的问题：鼠标和键盘的指示灯都没有亮，显示没有通电。

这里可以使用 SSDT-USBX.aml 来解决这个问题，但是并不推荐，原因之前也说过了，ACPI 的补丁对 Windows 也是适用的，而 Windows 压根不需要这个 USBX 的补丁，并且这个补丁有一个 bug（feature？）：它会将所有的 USB 设备识别成内置的接口，即使你插入的是 U 盘。一旦系统将 U 盘识别成内置的硬盘，就无法使用 Mac 自带的「启动转换助理」来刻录 Windwos 系统盘了（这一点下一节会详细讲）。

除了使用 ACPI 补丁之外，还可以使用 macOS 内核扩展（kext）来解决这个问题：首先使用 USBInjectAll.kext 来设置所有 USB 接口为外置 USB，确保系统能正常使用；然后打开 Hackintool 的 USB 选项卡，随后将主板的所有 USB 逐个插一遍，将非活动端口删掉，并使用连接器定制每个端口的类型。

![Hackintool 使用](https://ae01.alicdn.com/kf/He25802d3c2794f5798061c54d99eb7308.png)

随后点击导出图标，会导出 USBPorts.kext 和几个 ACPI 补丁到桌面，在 config.plist 里面加载 USBPorts.kext，并停掉 USBInjectAll.kext 就可以了。

## 双系统引导

> 戳[这里](https://www.bilibili.com/video/BV1GA411b7H9)观看双系统使用 Bootcamp 引导的视频。

在使用 Clover 引导的时候，需要将 CLOVERX64.efi 设置为默认的引导，在使用 OpenCore 的时候稍稍有点不一样，不需要且**不能**在 Windows 直接使用 bcdedit 命令更改 Path 为 OpenCore 自带 BOOTx64.efi 的值。

### 安装 Windows

> **如果你电脑目前已经安装了 Windows，直接看下一节。**

下载 Windows 10 ISO 镜像，插入 U 盘，打开「启动转换助理」，将三个勾全部选上，点击继续。

![启动转换助理](https://ae01.alicdn.com/kf/Hcd2c33e5ad594203afe6a9184b2d47a47.png)

如果启动转换助理没有报错的话，会让你选择分给 Windows 的硬盘空间。选择完了之后会重启。

如果在下载 Windows 支持软件的时候，提示无法连接到服务器的话，依次选择左上角的 操作菜单 -> 下载 Windows 支持软件，路径选择 U 盘。此时也需手动使用磁盘工具分区出一块 Windows 所用的硬盘。

重启后，**一定要继续使用 OpenCore 引导，而不要按 F12 直接进入 U 盘的引导**。

在 OpenCore 引导选择界面应该会看到名为「 U 盘的名称（external）」的引导项。选择它，就会进入系统安装的界面了。

安装完 Windows 之后，系统会自动重启，重新进入引导选择界面的时候，会看到多了一个名为 Windows 的引导项（排名应该只在 U 盘名称的后面一位），选择它。

### Windows 修复引导

如果在选择 Windows 启动时提示「ocb-startimage-failed-already-started」，别慌，这是因为 OpenCore 不知道从哪引导 Windows，你需要手动指定一下：进入 macOS，在 config.plist 的 Misc -> BlessOverride 添加一项：「\EFI\Microsoft\Boot\bootmgfw.efi」。这时再重启，应该就可以正常进入 Windows 了。

正常进入系统之后，将 U 盘里刚刚下载的 Windows 支持软件安装（文件夹名称应该是 WindowsSupport，文件是 setup.exe，双击安装），安装后会要求重启。

重启时在 OpenCore 引导菜单时选择进入 Windows，进入系统后，右下角应该会显示 Bootcamp 的运行图标，选择重启到 macOS，应该就能正常重启到 macOS 了。

> 需要注意的是：如果没有开启 NVRAM，是没办法做到这一点的：Windows 使用 Bootcamp 重启到 Mac，Mac 使用启动磁盘重启到 Windows，因为无法使用 NVRAM 来指定开机时的启动项。

---

参考：

- [iShengP 的 Z370F + i7–8700K + RX570 Hackintosh Build 黑蘋果建置 (Catalina ver. with OpenCore)](https://medium.com/ishengp-laboratory/ishengp-catalina-OpenCore-80be977427ae)
- [使用 OpenCore 引导黑苹果](https://blog.xjn819.com/?p=543)
- [精解OpenCore](https://blog.daliansky.net/OpenCore-BootLoader.html)







