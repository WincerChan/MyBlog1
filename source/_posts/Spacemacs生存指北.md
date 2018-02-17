---
title: Spacemacs 生存指北
type: categories
categories: 分享境
tags:
  - Spacemacs
  - 编辑器
date: '2017/09/26 13:01:33'
updated: '2017/12/23 19:38:23'
copyright: true
abbrlink: 2aa541e6
thumbnail: https://i.loli.net/2017/11/23/5a16dc087c01e.jpeg
---

## 简介

[Spacemacs](http://spacemacs.org/) 是一份 [Emacs](https://www.gnu.org/s/emacs/) 的配置文件，将 [Vim](https://github.com/vim/vim) 的快捷键移植到了 Emacs 上，可以提供 Vimer 至 Emacs 的无缝衔接。有了 Spacemacs，你不需要花那么多时间去学习 Emacs 就可以真正用 Spacemacs 开始做一些事情。

<!-- more -->

## 安装

```bash
$ mv ~/.emacs.d ~/.emacs.d.bak
$ git clone https://github.com/syl20bnr/spacemacs ~/.emacs.d
$ emacs
```

Clone 至本地后，第一次使用 Spacemacs 时要加载一些 Package，以及根据你的喜好所生成的配置，建议一路回车。

此时会加载很多的 Package，如果没有挂代理的话，就会很慢很慢，可以采用 [emacs-china](https://elpa.emacs-china.org/) 的配置源。

## 快捷键

Spacemacs 基本使用的是原生 Vim 的快捷键，此前请先熟悉 Vim 的操作。我这里只贴出个人认为比较常用的快捷键。

### 配置文件

`SPC f e d` 快速打开配置文件

`SPC f e R` 同步配置文件

`SPC q q ` 退出 Emacs

`SPC q R` 重启 Emacs

### 文件管理

`SPC f f` 打开文件

`SPC f t` neotree 方式显示文件路径

`Ctrl s` 搜索当前文件（需安装 ivy layer）

`*` 另一种搜索文件的姿势（需将光标置于需搜索的单词处）

- `n`  下一个匹配
- `N/p` 前一个匹配
- `r` 改变范围：当前屏幕，当前函数，当前 buffer
- `e` 编辑所有匹配（类似于替换）
- `/` 在当前 project 搜索

`SPC s c` 清除搜索高亮

`SPC f R` 重命名当前文件

`SPC f E` 使用 sudo 来编辑文件（当某些文件的权限是只读的时候）

`SPC f D` 删除当前文件

`SPC f r` 打开最近文件列表（需安装 ivy layer）

`SPC f y` 复制当前文件的绝对路径

`SPC f c` 复制文件

### buffer 管理

`SPC b b` 显示已经打开的 buffer

`SPC b d` 关闭当前 buffer

`SPC b h` 进入 Spacemacs 初始界面

`SPC b N` 新建一个 buffer

`SPC b R` 从自动备份的文件中恢复

`SPC b Y` 复制整个 buffer 的内容

`SPC b P` 将剪贴板的内容粘贴到整个 buffer

`SPC Tab` 切换至上一个 buffer

### 窗口管理

`SPC n(number)` 跳转至第 n 号窗口

`SPC 0` 跳转至 neotree 侧边栏

`SPC w m` 当前窗口最大化

`SPC w s` 或 `SPC w -` 水平分割窗口

`SPC w v` 或 `SPC w /` 竖直分割窗口

`SPC w =` 平衡窗口

`SPC w d` 删除当前窗口

`SPC w o` 切换至其他窗口

`SPC t g` 将当前窗口与其他窗口 黄金分割

### project 管理

`SPC p f` 在当前 project 中查找文件

`SPC p p` 切换项目

`SPC /` 在该项目中搜索字符串

`SPC p R` 在项目中替换字符串，先输入「匹配」的，再输入「替换」的字符串（我一般不使用这种方式，我用`*`来替换）

### 缩进代码

`SPC j =` 自动对齐

`SPC m =` 美化代码（不适用于所有语言）

### shell 操作

`SPC '` 打开/关闭 Eshell（需安装 shell layer）

`SPC a s` 打开其它种类的 Shell

### 中断操作

`C g` 输错命令时，可取消该次输入

## 显示动态行号

将  `dotspacemacs-line-numbers` 的值改为 'relative

## Magit

Spacemacs 中集成了 Git 管理工具，需先安装 git layer。

常用的快捷键：

| git                    | magit               |
| ---------------------- | ------------------- |
| `git init`             | `SPC g i`           |
| `git status`           | `SPC g s`           |
| `git add`              | `SPC g s` 弹出然后按 `s` |
| `git add currentfile ` | `SPC g`             |
| `git commit`           | `SPC g c c`         |
| `git push`             | `SPC g P`           |
| `git log`              | `SPC g l l`         |
| `git checkout xxx`     | `SPC gn C`          |
| `git checkout -- xxx`  | `SPC g s` 弹出然后按 `u` |
| `git reset --hard xxx` | `SPC g s` 弹出然后按 `x` |

## 守护模式

终端使用 `emacs -daemon` 以守护模式开启 emacs：

`$ emacsclient -c` 打开 Emacs GUI
`$ emacsclient -t ` 打开 命令行 Emacs

当开启守护进程时，点击关闭按钮后进程还是会保留在后台，如果想要彻底关闭 Emacs 可以：`SPC q q` 或者`$ killall emacs`

以下是我针对我常用的一些语言做的一些特殊的设置：

## C/C++

我没有采用 Spacemacs 提供的 c/c++ layer，而是采用的 [Irony-Mode](https://github.com/Sarcasm/irony-mode)，因为原生的 c/c++ layer 自动补全需要 ycmd，而 ycmd 安装配置起来实在太麻烦了。

### 快捷键

`:gdb` 启用 gdb 调试

`SPC c C` 编译程序

- 默认是用 `cmake` 编译，可以替换成 `clang/gcc -g main.C -o main` （这些参数会被记住）


## Python

Python 用的 Spacemacs 自带的 python layer，添加了一些参数：

```emacs-lisp
(python :variables
        python-enable-yapf-format-on-save t ;; 当保存的时候自动 `yapf' 美化
        python-fill-column 80				;; 开启 80 列的提示
        python-sort-imports-on-save t)		;; 当保存的时候自动排序导入的包
```

### 快捷键

`, c c` 运行当前文件

`, =` 美化代码

`, '` 打开 IPython repl

`, g` 跳转至定义处：

- `, g g` 在当前窗口跳转至定义处
- `, g G` 在另一窗口跳转至定义处
- `, g b` 回到原处

`, s` 将当前文件发送至 repl:

- `, s b` 将当前 buffer 发送至 repl
- `, s f` 将当前 defun 发送至 repl
- `, s r` 将当前选中内容发送至 repl

## JavaScript

我将 JavaScript layer 自带的 repl 换成了 nodejs，自带的不太好用。

```emacs-lisp
(javascript :variables
            tern-command '("node" "/home/wincer/.npm-global/bin/tern")	;; 指定 `tern' 的路径
            javascript-disable-tern-port-files nil)
```

设置了一些快捷键：(o 开始的默认为用户自定义的)

`SPC o s i` 启动 nodejs repl

`SPC o s b` 将当前 buffer 发送至 repl

`SPC o s r` 将选中内容发送至 repl

`SPC o s l` 将当前行发送至 repl

## Scheme

我是在学 sicp 时才用到 Scheme，所以采用的 Scheme 实现是 MIT-Scheme，并将其设置为默认 repl：

### 快捷键

`, '` 切换至 repl

`, s` 评估算式：

- `, s b` 计算当前 buffer
- `, s e` 计算最后一个表达式
- `, s f` 计算当前定义的函数
- `, s r` 计算当前选中的内容

## 结语

我的 Spacemacs 配置放在了 GitHub 上，[这是地址](https://github.com/WincerChan/Spacemacs-Config)。
