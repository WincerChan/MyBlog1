---
title: 基于 Socket 编写 HTTP 服务器
date: '2018/08/03 12:06:13'
updated: '2018/08/03 12:06:13'
tags:
  - Socket
  - 异步
  - HTTP
  - 服务器
categories: 实验室
abbrlink: 89381f22
thumbnail: https://ae01.alicdn.com/kf/HTB1MIW8acfrK1Rjy0Fm760hEXXaS.png
---
在大二上《计算机网络》这门课的时候，由于并不是很喜欢这门课的老师，导致我在上课的大部分时间都在摸鱼~~（啊喂，学校教的哪门课你没在摸鱼啊？）~~。最近看了《[图解HTTP](https://book.douban.com/subject/25863515/)》这本书，借这本书正好也复习了一下应用层和传输层协议，毕竟现在的 Web 应用几乎都是在应用层的 HTTP 协议运行的，而 HTTP 又是基于传输层的 TCP 协议来实现的。

<!-- more -->

我一直认为检验学习新知识是否牢靠最好的方法就是写一个小的实例，于是乎，借助于 Socket 模块（仅对 BSD Sockets API 进行封装），我也实现了一个静态的 HTTP 服务器，当然，比标准库提供的 SimpleHTTP 要强一点，因为我编写的支持并发。源码见[这里](https://github.com/WincerChan/Tiny-Http)。

## Socket 服务器

### Socket 

HTTP 协议是基于 TCP 协议来实现的，也就是说要实现 HTTP 服务器首先就需要先创建一个 TCP 连接，而一个完整的 TCP 连接是同时需要客户端和服务端的，而客户端和服务端的创建，就需要借助 Socket（套接字）了。

通常创建一个 Socket 需要为其指定地址族（包括本机、IPV4、IPV6）、套接字类型（流式、数据报式，分别对应 TCP 和 UDP）

```python
from socket import AF_INET, SOCK_STREAM, socket

# create a tcp socket
sock = socket(AF_INET,SOCK_STREAM)
# equal to
sock = socket()
```

随后需要为该 `socket` 绑定一个 IP 地址和端口，并开始监听该地址（listen 可传入参数，表示排队连接的数量）：

```python
sock.bind(('0.0.0.0', 8888))

sock.listen()
```

随后，就可以等待客户端发起连接请求了：

```python
conn, addr = socket.accept()
```

随后该连接会阻塞，直到 accept 到客户端的连接之后（客户端可使用 `telnet 0.0.0.0 8888` 来连接），随后程序就会继续运行，这时就可以通过 socket 连接来传输数据了，在 telnet 输入任何字符，随后在客户端接收，再响应请求：

```python
# accept 10 bytes data
conn.recv(10)
# send response
conn.send(b'hello world')
```

### 封装

我们后续编写 HTTP 服务器仍是基于这一套流程，只是在客户端请求和服务端应答的内容不一样，故而封装成一个类，方便继承，以下为一个回显服务端，从客户端接收到的任何消息都会将其返回：

```python
from socket import AF_INET, SOCK_STREAM, socket


class EchoServer:
    def __init__(self, port=8888, addr='0.0.0.0', family=AF_INET,
                 type_=SOCK_STREAM, backlog=0, init=True):
        self.addr = addr
        self.port = port
        self.family = family
        self.type_ = type_
        self.backlog = backlog

    def _echo(self, sock: socket):
        while True:
            try:
                req_head = sock.recv(1)
            except BrokenPipeError:
                break
            else:
                if not req_head:
                    break
                sock.send(req_head)

    def _run(self):
        self.sock.listen(self.backlog)
        while True:
            sock, addr = self.sock.accept()
            print('Connect by {} Port {}'.format(*addr))
            self._echo(sock)

    def __call__(self):
        self.sock = socket(self.family, self.type_)
        self.sock.bind((self.addr, self.port))
        print('Listen in %s port.' % self.port)
        self._run()

```

### 测试用例

```python
>>> serve = EchoServer()

>>> serve()

"""
telnet 0.0.0.0 8888
Trying 0.0.0.0...
Connected to 0.0.0.0.
Escape character is '^]'.
Hello
Hello
I'm Wincer.
I'm Wincer.
"""

Listen in 8888 port.
Connect by 127.0.0.1 Port 45186
...
```

## HTTP 服务器

### HTTP 报文

那么有了 TCP 连接，该怎么实现 HTTP 协议呢，其实很简单，HTTP 协议只是在传输的内容上做了规定：满足「报文首部」、「空行」、「报文主体」，这样通过服务器发出去就算是一个 HTTP 报文了，不信？试试就知道了。

将上面的 EchoServer 中的 `_echo` 方法修改一下，让其返回以下数据：

```python
data = """HTTP/1.1 200 OK
Content-Length: 11

Hello World
"""

class EchoServer:
    def _echo(self, sock):
        try:
            req_head = sock.recv(1)
        except BrokenPiperError:
            return 
        else:
            if not req_head:
                return
            # 注意这里必须要将字符串编码成 bytes 才能发送。
        sock.send(data.encode('utf-8'))
        sock.close()
    
    
>>> serve = EchoServer(8888)

>>> serve()
Listen in 8888 port.
```

咳咳，准备好了吗，打开浏览器，输入 `http://0.0.0.0:8888`，如无意外，你就可以在屏幕上看见 `Hello World` 了。

这就算最「小」的 HTTP 服务器了，不管向它发送什么请求，不管请求的是什么，它都会返回 `Hello World`：

```bash
curl http://0.0.0.0:8888
Hello World
curl http://0.0.0.0:8889/\?test
Hello World
curl -X OPTIONS http://0.0.0.0:8889/\?test
Hello World
curl -X POST http://0.0.0.0:8889/\?test\&param\=block
Hello World
```

这是因为我们还没有对请求报文首部进行分析，从而根据请求路径的不同或者请求方式的不同来返回相应的数据。

### 响应请求

既然要做一个静态的服务器，最少也应该分析 `GET` 请求，根据请求的 URL 作出响应，那么就需要增加额外的函数了：

```python
class HttpServer(EchoServer):
	def _echo(self, sock: socket):
        try:
            req_head = sock.recv(1024)
        except BrokenPipeError:
            return
        else:
            if not req_head:
                return
            head = self._get_head(req_head)
            sock.send(head.encode('utf-8'))
            self._send_body(sock)
            logging.info('HTTP/1.1 %s GET %s' % (self.status, Signal.path))
        sock.close()
```

我这里（在 `_echo` 中）增加了两个函数：`_get_head` 和 `_send_body`。作用分别是根据客户端的请求报文的首部来生成相应的服务端响应报文首部和根据客户端的请求 URL 发送响应的报文主体内容，比如，请求首部：

```http
GET /index.html HTTP/1.1
HOST: 0.0.0.0:8888
USER-AGENT: curl/7.61.0
Accept: */*
```

响应首部（可将请求的资源以 `rb` 模式打开，并读入内存，再作为响应报文主体发送）：

```http
HTTP/1.1 200
Content-Length: 11
Content-Type: text/html; charset=utf-8
Date: Thu, 02 Aug 2018 03:58:09 GMT
Server: TinyHttp

Hello World
```

有关这两个函数的具体实现，可以参考我这部分的[源码](https://github.com/WincerChan/Tiny-Http/blob/master/tinyhttp/http/server.py#L49-L70)。

## 并发请求优化

我们的服务器现在已经可以根据 GET 请求的 URL 来返回相应的报文了，很好，但现在的服务器不支持并发请求，也就是说必须先对前一个请求作出完整的响应，并将响应发送出去之后，才能处理下一个请求，造成这种后果最重要的一点原因就是：`socket.recv()` 和 `socket.send()` 都是阻塞型 I/O 函数，也就是说，CPU 会一直等待这两个函数执行完成才继续执行后面的代码。

虽然在本地局域网内，作出大部分响应的时间都很快（毫秒级别），但我们仍有必要对阻塞型 I/O 函数进行优化，优化方法有两种：

1. 在单独的线程中运行该阻塞型操作
2. 把该阻塞调用转化为非阻塞的异步调用使用

其中第一个方法很简单，借助 `threading` 模块即可实现，重写一下 `_run` 方法：

```python
class ThreadHttpServer(HttpServer):
    def _run(self):
        self.sock.listen(self.backlog)
        while True:
            sock, addr = self.sock.accept()
            Thread(target=self._echo, args=(sock,)).start()
```

而第二个方法就需要借助 Asyncio 这个库了（由于借助了 Asyncio 这个库，要求 Python 版本为 3.5+），该库重写了标准库 socket 中的阻塞 I/O 函数，将其改为了非阻塞形式的异步调用，由于该方法改动的地方太大，就不贴完整的代码了，可移步至这部分的[源码](https://github.com/WincerChan/Tiny-Http/blob/master/tinyhttp/async/asyncserver.py)。

## 薛定谔的 BUG

同我在[之前一篇博文](../8575e868/#%E5%AE%9E%E7%8E%B0)提到的类似，这次同样遇上了一些薛定谔的 BUG：

### 大文件传输

当以 `open` 函数打开某一个文件时，会把这个文件的内容读入到内存中，如果只是普通的文本或者图片倒是不会出现什么问题，但是一旦读入的文件过大（比如我就喜欢在电脑开启静态 HTTP 服务，然后在局域网内其它的设备打开共享的视频来播放），就会出现两个情况：

1. 占用的内存空间过大，程序 gg；
2. 成功读入内存，但花了很多时间读入内存，服务端又花了很多时间发送，客户端又花了很多时间接收；

于是乎，大名鼎鼎的「generator（生成器）」终于派上了用场。将 `_get_body` 函数（请求的文件内容）中的 `open` 函数作为一个生成器，每读取一行（`readline()`）就 yield 一次，在 `_send_body` 函数中不断对 `_get_body()` 返回的数据进行迭代发送，这样既不会一次性全部读入内存，造成内存空间不足、又不会花费过多的时间在 I/O 上，一举两得，当然，为此你需要加上一个 `Content-Lenght` 的首部，用以告诉客户端什么时候接收完毕。

### 目录与文件

当请求的是目录时，URL 最尾端应当为 `/`，这时返回的应该是该目录下的 `index.html` 文件，如没有的话就返回该目录下的文件列表（同样的，列表中的目录应当以 `/` 在末尾标识），如果点击了该目录下的子目录，则应递归的显示子目录。

但当以 `os.listdir` 列出文件列表时，并不会显式的将目录以 `/` 标识，而仍需我们手动判断，当请求同名目录但末尾没有 `/` 时，应当将状态码设置为 301，并在响应头部加上 `Location: https://localhost:8888/xxx/` 用以显式的指向目录。

## 结语

其实这个服务器在结构上并不复杂，甚至可以说简单，就是依据 Socket 建立 TCP 连接，再分析请求首部得到的 URL，用 `rb` 模式加载并作为响应主体返回，但也确实让我学习到了不少：比如说「面向对象」范式的好处，即在构建以 `TCP->HTTP->ThreadHTTP、AsyncHTTP` 这样自顶向下的结构时，继承（`ThreadHTTP` 继承于 `HTTP`，而 `HTTP` 又继承于 `TCP`）可以大大的减少代码量和提高可重用性；再比如说生成器，即惰性求值的好处（节省内存），这好像还是我第一次正式在代码中用到生成器。

而这两点，想来只有自己在生产代码中遇到过，才能切实体会到好处。
