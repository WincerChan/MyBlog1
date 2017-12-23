---
title: 构建一言 API 踩坑记录
date: '2017/10/30 10:44:41'
type: categories
categories: 实验室
tags:
  - Hitokoto
  - Flask
  - API
copyright: true
abbrlink: f6e1eb2a
thumbnail: https://i.loli.net/2017/12/22/5a3c7701e7e79.png
---

## 前言

最初是在手机上一个叫「一言」的 App 接触到 Hitokoto，一见倾心啊。之前我看书时遇到写的不错的句子就喜欢摘录下来，在有自己的博客之后，本想是单独写一篇博文来存放，后来分析了 NexT 的布局后，就想到在侧栏底部可以加上一个单独的模块。

最开始，是使用别人的 API，后来觉得不太好，有诸多限制，而我又没有主机，于是就自己用 Javascript 写了一个本地的脚本。后来发现这样也不太好，因为本地的脚本每次加载势必要加载存放 Hitokoto 的 JSON 文件一次，当记录越来越多时，会消耗不必要的资源。毕竟每次只需要加载一条。
<!--  more -->

## 获取一言

最开始准备构建的时候，就遇到了一个问题：一言的数据库去哪里找。我翻便了 Google，基本都是提供 API 的，并不会将完整的数据库给你。这想想也正常，都把数据库给你了，那谁还用你的 API 呢。

我就花了一下午，写了一个爬虫，对准了几个提供 API 的网站，开始爬去数据。但是由于 API 产生的数据是随机的，难免会有重复。所以爬取之后又要查重，着实花费了我不少时间。

整个过程大概花了一天多，做成了一个 JSON 格式的文件，然后用 JS 导入成为数组，再随机访问数组的某一项，这便是最初“本地版”的「一言」了。

## 转化数据库

先前已经说过，一旦数据多了起来。那么数组的访问和加载都是问题，而访问慢的问题可以用数据库来解决。而这学期正好在学数据库这门课，于是便花了点时间将 JSON 格式的数据转化成 sqlite 数据库。JSON 格式的数据有需要的只有 3 项，分别是 ID（用以标识每个 Hitokoto）、HITOKOTO（每个 Hitokoto 的内容）、SOURCE（每个 Hitokoto 的出处）。知道了这些，转化的代码就呼之欲出了：

```python
import json
import sqlite3

JSON_FILE = "hitodb.json"
DB_FILE = "HITODB.db"
conn = sqlite3.connect(DB_FILE)

with open(JSON_FILE, 'r') as load_f:
    data = json.load(load_f)
    for line in data:
        print(int(line["id"]), line["hitokoto"], line["from"])
        conn.execute(
            'INSERT INTO HITOKOTO (ID, HITO, SOURCE) VALUES ({a}, \'{b}\', \'{c}\')'.
            format(a=line['id'], b=line['hitokoto'], c=line['from']))
        conn.commit()

print('Successfully')

conn.close()
```

截至至本文发布，该「一言」数据库共收录了 880 条记录，以后我还会陆续添加。

## 生成 API

有了数据库，自然要构建一个 API，这里选用的是 Flask 框架提供的接口。

首先你需要安装 Flask，而 Python 是自带 sqlite3 模块的。直接上代码：

```python
import sqlite3

from flask import Flask, jsonify

app = Flask(__name__)


@app.route('/')
def index():
    return 'Hello World!'


@app.route('/api/')
def get_hito():
    conn = sqlite3.connect('HITODB.db')
    hito = conn.execute(
        'select * from hitokoto order by random() limit 1').fetchone()
    hitokoto = "{} ——「{}」".format(hito[1], hito[2])
    return 'function hitokoto() { ' + 'document.write(\'{}\');'.format(
        hitokoto) + '}'


@app.route('/api/json/')
def get_json():
    conn = sqlite3.connect('HITODB.db')
    hito = conn.execute(
        'select * from hitokoto order by random() limit 1').fetchone()
    hitokoto = {}
    hitokoto['id'] = hito[0]
    hitokoto['hito'] = hito[1]
    hitokoto['source'] = hito[2]
    return jsonify(hitokoto)


if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
```

保存为 `run.py`。然后运行，打开 `http://0.0.0.0/api/` 如果没有意外的话，应当是成功了。接下来就是部署了。

## 部署至 Heroku

### 环境准备

一开始担心是没有主机，后来才知道有「[Heroku](https://dashboard.heroku.com/)」这个造福大众的云平台服务。

首先你需要安装 [Heroku 客户端工具](https://toolbelt.heroku.com/)，安装完成后，输入以下命令来验证安装是否成功：

```bash
$ heroku --version
```

安装成功后，在本地命令行登录 Heroku：

```bash
$ heroku login
```

然后输入你的帐号和密码即可

### 创建应用

可以在[网页端创建](https://dashboard.heroku.com/apps)，也可以在命令行创建：

```bash
$ heroku create wincer-hito
```

这里或许会提示你名字已经被使用了，换一个就好。接下来要初始化本地和远程代码库。

```bash
$ mkdir hitokoto					# 创建本地代码仓库
$ cd hitokoto						# 切换至本地仓库目录
$ git init							# 初始化本地仓库
$ heroku git:remote -a wincer-hito	# 链接到远程仓库
```

### 部署应用

除了代码和数据库外，两个必要的文件：`requirements.txt` 部署应用时，远程环境会自动安装 `requirements.txt` 文件中列出的依赖。我们 `requirements.txt` 文件内容如下：

```python
Flask==0.12.2
gunicorn==19.4.5
```

接下来，我们如何告诉服务器如何运行这个文件呢？就要通过 `Procfile` 文件了。

```
web: gunicorn run:app
```

以上就是 `Procfile` 的内容。

另根据习惯，可自行添加对该项目的描述。

接下来就是激动人心的提交了：

```bash
$ git add .
$ git commit -m "Init commit"
$ git push heroku master
```

打开 https://wincer-hito.herokuapp.com/api/ 看看效果吧！

### 升级应用

升级程序的时候，在所有的改动提交后，建议按照如下步骤升级：

```bash
$ heroku maintenance:on
$ git push heroku master
$ heroku run python run.py deploy		# run.py改成自己的文件名
$ heroku restart
$ heroku maintenance:off
```

## 使用 API

数据获取：


- 请求地址：https://wincer-hito.herokuapp.com/api/
- 请求方式：GET
- 返回函数名 hitokoto 的 js 脚本，本质为 document.write 函数的脚本
- 如果需要 json 格式的数据：https://wincer-hito.herokuapp.com/api/json/
- 如果仅需要 hitokoto 主体：https://wincer-hito.herokuapp.com/api/main/


在你想使用「一言」的地方插入以下代码：

```html
<script type="text/javascript" src="https://wincer-hito.herokuapp.com/api/"></script>
<script>hitokoto();</script>
```
演示效果看侧栏。

注：由于是 Heroku 的主机是在美国，所以该 API 延迟可能会有一点高。
