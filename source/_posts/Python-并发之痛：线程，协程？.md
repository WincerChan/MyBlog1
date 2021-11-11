---
title: Python 并发之痛：线程，协程？
date: '2020/09/29 20:43:29'
updated: '2020/09/29 20:43:29'
categories: 分享境
tags:
  - Python
  - asyncio
  - 并发
copyright: true
thumbnail: 'https://p.pstatp.com/origin/13743000163c4e3a9a0be'
abbrlink: c12de45e
---

算算日子，我又有两个多月没有写新文章了，是时候给博客除除草了——拖更的原因是（ ~~懒~~ ）换了一份新的工作，在适应新的工作与生活环境。在入职奇安信（上一份工作）的时候，有半年的时间没有更新博客，当时的我把原因归咎于公司 push 员工太厉害，导致员工没有属于自己的空间；可现在的工作明明给予了我足够的空间，我却还是两个多月没有新文章产出，看来个人方面也有一定的原因。

废话好像有点太多了，本篇文章准备分享一下最近工作上遇到的问题以及解决办法。

<!--more-->

## 起因

起因是部门产品的图相关部分的 API 查询（使用 GraphQL 自己实现的）太慢，一次普通的查询往往在后端会解析成十几个不同的子查询，子查询的内容上没有相关性；涉及的数据源也大相径庭，包括：MongoDB、ClickHouse，以及其他产品的 Web API，因此也无法通过关联查询减少查询次数。由于子查询太多，即使每一条子查询耗时都能控制在 300 毫秒内，那一条完整的查询也会耗费将近 5 秒的时间（来自十几个子查询耗时的叠加），这显然不正常。如果能将十几个子查询的方式从「顺序」改成「并发」就好了。

因此我很自然的想到了使用 asyncio 来实现并发的查询，而 GraphQL 也提供了 AsyncioExecutor 的方式来异步执行查询语句，但是正当我沾沾自喜以为这个问题就这么从理论上解决了的时候——开发负责人告知只有图相关的 API 需要改成异步方式，其他的 API 保持不变，并说出了基于两个方面的考量：

1. 大部分其他 API 只是针对一个数据源查询，不会像图一样有十几条子查询，换成异步并不能提升单次查询的性能；
2. 将其他的 API 都换成异步工作量太大，且需要测试各种兼容性，再结合上一条原因，得不偿失。

但直觉上，我认为如果只是将图相关的 API 改成异步，在后续可能会出问题，但具体为什么会出问题、以及出什么问题我还不知道，因此就先着手试试。迁移的过程比我想象中要轻松很多——motor、aiochclient、aiohttp 等库已经很成熟了，在这些异步库上封装一层与现使用的同步库的兼容层就行了。

## 问题

花费了一周时间，在本地测试没什么问题之后就放到了线上先让系统运行着测试。头几天没出什么问题，在我以为这个问题就这么完美的解决了并准备做其他事的时候，前端突然找到我说查询请求会报一个很奇怪的错误，复现的概率不高，但有时候就会出现，我心里咯噔一下，感觉是之前异步改造不完全造成的问题。在前端发给我看具体报错之后，我确认了的确是和异步相关的问题。错误信息相信大多数接触过 asyncio 的都看过，这差不多是 asyncio 里最常见的错误之一了：`RuntimeError: This event loop is already running`。

和前端沟通后，在我本地的开发环境上却没有复现此 bug，因此我认为应该是生产环境上部署的工具与 asyncio 冲突了。

部署的方式与其他 Python Web 端程序并没有什么区别，WSGI 服务器使用的是 Gunicorn，worker_class 设置为 sync（一共开启 6 个），每个 worker 开启了 20 个 threads，一开始我怀疑是 worker_class 的问题，可将其设置为 gevent 之后，仍然会出现这个错误，我开始觉得有点棘手了。

## 吐槽

在出现这个问题的时候，我就和朋友吐槽过，Python 这门语言真的是太割裂了（Python 2 和 3 版本间的割裂就不用说了），公司产品和开源社区完全就是两个极端：开源社区一个新 Feature 接一个发布，可大多数公司仍然守着 Python 2 不肯升级，原因也很简单：Python 3 对比 2 最大的更新就是 asyncio，可这玩意所解决的痛点相比 Python 2 升级 3 耗费的精力实在太微不足道了——Python 2 使用 monkey patch 一下再使用 gevent，也比用 asyncio 慢不了多少吧，既然如此，那我还费心思升级干啥？

往远了说，我认为这仍然是 Python 的历史包袱仍然没有完全甩掉（即使 Python 3 在发布的时候宣称想甩掉一些历史包袱从而决定不兼容 Python 2），也是我认为 Python 最大的痛点——并发的问题。既然 Python 之禅宣称做「最好是只有一种方法来做一件事」，此话也被社区奉为圭臬，那为什么 thread，process，greenlet，asyncio 都可以用来实现并发这件事呢？要我说就应该在 Python 3 问世的时候甩包袱甩得更彻底一些，干脆就像 Node.JS、Go 一样，想用并发？可以，只提供一种方式，想直接调用系统原生的线程？不好意思，没这种操作。**让用户只用一种方法做一件事的最好办法就是不提供其他的方法。**

在 Linux kernel 2.6 版本正式引入 IO 多路复用的时候，Python 2.4 已经发布，各种功能已经很完善了，不太可能抛弃掉现有的多线程模型转而投向异步 IO 模型。如果将此时作为分水岭的话，在这之前就诞生的语言（Python，Java，C/C++）大多都是使用内核提供的多线程实现的并发模型，而在这之后诞生的语言（Node.JS、Go 等）大多是自己实现的并发模型。而 Python 则因为 GIL（Global Interpreter Lock）的存在，即使提供的是系统内核级的多线程也无法像 Java 一样实现并行处理，所以 Python 的并发一直都为人诟病。而同为解释型语言的 Node.JS，人家压根就没多线程这玩意，所有 IO 事件都放在一个事件循环里跑，和 GIL 河水不犯井水。这也是为什么我说 Python 仍然具有一定的历史包袱的原因。

## 定位

在确定了是 Gunicorn 与 asyncio 的冲突之后，我开启了 asyncio 的 debug 模式，希望能从中获取一些有用的信息，果然，一个新的错误出现了：`RuntimeError: Non-thread-safe operation invoked on an event loop other than the current one`，报错文件是：`asycnio/base_event.py` 中的` BaseEventLoop.call_soon()` ，此方法是一个非线程安全的方法，因此在开启了 debug 的情况下，会 `_check_thread()`。报错原因则是 `_check_thread()` 函数会检测当前线程是否是 event loop（事件循环）运行中的线程。

那么，event loop（事件循环）可能会在其他的线程调用吗？——一般情况是不会的，对于大多数程序而言，有异步 IO 处理并发就够了，不需要再使用线程了。但是，基于上面的两点考虑，我们不得不选择在使用 asyncio 的情况下再额外使用线程。

> 这里的线程其实是广义的概念，并非指的是系统级别的线程，gevent patch 之后的 gthread 也算在内。

在我们的项目里，event loop 是作为 module 级别的变量声明的，按照 Python 的内存管理，是存放在私有堆上的，因此从同一个 Gunicorn worker 里衍生的线程自然会共享这个变量。也就是说出现这个错误的原因在于当前的线程操作了由另一个线程（通常是主线程）创建的 event loop。

可以更具体的解释为：`AsyncioExecutor.wait_until_finished()` 调用了 `loop.run_until_complete()` 方法，此方法会对 loop 进行`_check_closed()` 和 `_check_running()` 检测。而最先开始的 `this event loop is already running` 报错就是 `_check_running()` 时抛出的。

## 解决

问题定位到之后，解决就很简单了。既然多线程一定要使用，那么将 call_soon 换成线程安全的 `call_soon_threadsafe` 就好了。

`AsyncioExecutor.wait_until_finished()` 里的 `loop.run_until_complete()` 也需要换成 `asyncio.run_coroutine_threadsafe()`，该函数可以向指定的事件循环提交 coroutine。

这两处需要修改 GraphQL 相关库的源代码的地方可以使用 monkey patch 的方式修改。

除此之外，event loop 的创建也需要改一下，不能直接通过 `asyncio.new_event_loop()` 来获取了，需要把它专门放在一个线程里 `run_forever`（因为 `call_soon_threadsafe` 会使用 `_check_closed` 检测 loop 的状态，所以需要保证 loop 一直处于 running 状态，而 `run_forever` 这个操作是阻塞的，所以需要另起一个线程），然后由其他的线程向它提交：

```python
class ThreadEventLoop:
	"""
	Run Event Loop in different thread.
	"""
	@property
	def loop(self):
		return self._loop

	def __init__(self):
		self._loop = new_event_loop()
		Thread(target=self._start_background, daemon=True).start()

	def _start_background(self):
		set_event_loop(self.loop)
		self._loop.run_forever()

```

## 结语

从接触 Python 到现在，已经有近四年的时间了。最初觉得它语法简洁、标准库功能齐全，工作了一段时候后又觉得动态类型的有些不便以及写法过于开放难以维护，再到最近感受到协程与线程的并发之痛，不知是否是因为我的水平逐渐变高，越来越能发现 Python 的不足。对于把编程语言当做是一种工具的人来说，发现工具的不足或者不好的地方之后，只需要换一种工具就好了，只是我始终没有把编程语只当做是工具，更喜欢把它当成一门「手艺」，所以我自然希望这门「手艺」使用起来越顺心越好。

吐完槽冷静下来后，我也尝试站在 Python 开发者的角度想，如果真的完全不顾历史包袱，不管和老版本的兼容性，那似乎就相当于创建了一门新的语言了。而假如未来真的有某一版本的 Python 完全没有历史包袱，又拿什么去吸引用户做迁移呢？我想这也是最初 Python 3 发布的新特性也会向 2.6 和 2.7 版本添加的原因吧。

---

所以如果要问我为什么喜欢 Python 反而还大力的吐槽，我想是因为哇真的希望它变得更好吧。