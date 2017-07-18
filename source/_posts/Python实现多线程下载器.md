---
title: Python实现多线程下载器
type: categories
categories: 技术
copyright: true
tags:
	- Python
	- 多线程
date: 2017/07/19 14:53:24
---

## 前言

我为什么会想到要写一个下载器呢，实在是被百度云给逼的没招了，之前用Axel配合直链在百度云下载视频能达到满速，结果最近Axel两天忽然不能用了，于是我就想着要不干脆自己写一个吧，就开始四处查询资料，这就有了这篇博客。

我假设阅读这篇博客的你已经对以下知识有所了解：

- Python的文件操作
- Python的多线程
- Python的线程池
- Python的requests库
- HTTP报文的首部信息

## 下载

获取文件采用的是requests库，该已经封装好了许多http请求，我们只需要发送get请求，然后将请求的内容写入文件即可：

```python
import requests

r = requests.get('http://files.smashingmagazine.com/wallpapers/july-17/summer-cannonball/cal/july-17-summer-cannonball-cal-1920x1080.png')
with open('wallpaper.png', 'wb') as f:
    f.write(r.content)
```

随后看看文件夹，那张名为`wallpaper.png`的图片就是我们刚刚下载的。

但是这个功能太简单了，甚至简陋，我们需要多线程并发执行下载各自的部分，然后再汇总。

## 拆分

为了拆分，首先得知道数据块的大小，HTTP报文首部提供了这样的信息：

- 用head方法去获取http首部信息，再从获取的信息提取出`Content-Length`字段（上文图片大小为 261258 bytes）

```python
import requests

headers = {'Range': 'bytes={}-{}'.format(0, 100000)}
r = requests.get('http://files.smashingmagazine.com/wallpapers/july-17/summer-cannonball/cal/july-17-summer-cannonball-cal-1920x1080.png', headers = headers)
with open('wallpaper.png', 'wb') as f:
    f.write(r.content)
```

我们得到了图片的前 100001 个字节（Range的范围是包括起始和终止的），打开`wallpaper.png`你应该能看到一幅“半残”的图。

这样我们里目标更近了一步，继续：

- 确认线程数（比如8个），261258//8=32657,前7个线程都取32657个bytes，第八个取剩余的


```python
part = size // nums

for i in range(nums):
        start = part * i
        if i == num_thread - 1:   # 最后一块
            end = file_size
        else:
            end = start + part
```

- 每个线程获取到的内容按顺序写入文件（file.seek()调节文件指针）


```python
def down(start, end):
	headers = {'Range': 'bytes={}-{}'.format(start, end)}
	# 这里最好加上 stream=True，避免下载大文件出现问题
	r = requests.get(self.url, headers=headers, stream=True)
	with open(filename, "wb+") as fp:
        fp.seek(start)
        fp.write(r.content)
```

嘛，线程多了起来就扔到线程池让它来帮我们调度。

## 封装

功能复杂了，用对象来封装整理一下：

```python
class Downloader(): 
    def __init__(self, url, num, name):
        self.url = url
        self.num = num
        self.name = name
        r = requests.head(self.url)
        self.size = int(r.headers['Content-Length']) 

    def down(self, start, end):
        
        headers = {'Range': 'bytes={}-{}'.format(start, end)}
        r = requests.get(self.url, headers=headers, stream=True)
        
        # 写入文件对应位置
        with open(self.name, "rb+") as f:
            f.seek(start)
            f.write(r.content)
        
 
    def run(self):
        f = open(self.name, "wb")
        f.truncate(self.size)
        f.close()
        
        tutures = []
        part = self.size // self.num 
        pool = ThreadPoolExecutor(max_workers = self.num)
        for i in range(self.num):
            start = part * i
            if i == self.num - 1:   
                end = self.size
            else:
                end = start + part - 1
            # 扔进线程池
            futures.append(pool.submit(self.down, start, end))
        wait(futures)
```

至此，核心功能都完成了，剩下的就是实际体验的优化了。

这几天会把命令行参数、以及一些报错信息给加上。

完整的代码会在功能都完善之后再贴出。

## 结语

很可惜，我写的这个下载器还是不能下载百度云直链，不过嘛，好多人都说结果不重要，都说重要的是过程，不是么？写这个下载器我也确实学到了许多，至于一开始我是出于什么样的目的？管他呢