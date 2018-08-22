---
title: Python 知多少（一）——不常见的数据结构
date: '2018/08/08 11:30:32'
updated: '2018/08/08 11:33:32'
categories: 分享境
tags:
  - Python
  - 数据结构
  - 高级
  - 知多少
thumbnail: >-
  https://res.cloudinary.com/wincer/image/upload/v1533699590/blog/python_rarely_data_structure/cover.png
abbrlink: dbcdebb
---

近来准备写几篇文章用于介绍 Python 较高级一些的特性，归为一个系列。本文是这个系列的第一篇文章，主要介绍一下内置的一些数据结构。

对 Pythoner 而言，元组（tuple）、列表（list）、字典（dict）这三个应该最熟悉的数据结构了，恰当使用这三个数据结构的话的确可以应对大部分的使用场合了，但有时因为其它方面的问题（内存占用、插入效率、删除效率等），我们仍有必要学习其它不那么常见的数据结构。

<!-- more -->

## 数组

初学者可能会认为在 Python 里，列表（list） 就是数组（array），其实不然。数组应当是一系列类型相同的变量的集合，而 Python 中的列表却可以存放任何不同类型的数据。Python 里也是有数组这个概念的，与列表有所不同的是数组里数据的存放方式（类型）并不是 Python 的基础类型（int、float、char）等，而是数字的机器标识（说白了就是和在 C 语言中存储方式一样），也因此，在将数据存入和读取文件时效率会更高一些。

`array.array` 支持的数据类型包括整数、浮点数、字符三种，其中创建每个数组需要一个类型码（Type code），用以标识在 C 语言中存放怎样的数据类型，比如 `array('l')` 这样创建的就是存放四个字节大小的整数，范围从 - 2^31 到 2^31 - 1（更多的类型码使用 help(array) 查看）。

```python
from array import array
from reprlib import repr
ints = array('l', (i for i in range(10**7)))
>>> repr(ints)
"array('l', [0, 1, 2, 3, 4, ...])"
# write to file
with open('ints.bin', 'wb') as fp:
	ints.tofile(fp)

ints2 = array('l')
# read from file
with open('ints.bin', 'wb') as fp:
    ints2.fromfile(fp, 10**7)
```

数组支持列表的大部分操作（准确地说是支持所有和可变序列的有关的操作），包括 `pop()`、``insert()``、``extend()`` 等。

```python
>>> len(ints)
10000000
>>> ints[-1]
9999999
>>> ints.pop()
9999999
```

在排序这里与列表有一点小区别，列表支持 `list.sort()` 这种就地排序的方法，但数组不支持，所以想对数组进行排序的话，得用 `sorted` 新建一个数组：

```python
tmp = array(ints.typecode, sorted(ints))
```

## 队列

队列的特性是先进先出，虽然我们可以把列表当作队列来使用：``append()`` 来模拟进队列，``pop(0)`` 来模拟出队列：

```python
class Queue:
    def __init__(self, queue):
        self.queue = list(queue)

    def pop(self):
        return self.queue.pop(0)

    def push(self, num):
        self.queue.append(num)

    def __repr__(self):
        return 'Queue<%s>' % self.queue

q = Queue(range(5))
>>> q
Queue<[0, 1, 2, 3, 4]>
>>> q.push(5)
>>> q
Queue<[1, 2, 3, 4, 5]>
>>> q.pop()
1
```

似乎看上去很完美，但是这种方法的弹出操作是很耗时的，因为删除列表的第一个元素会牵扯到移动列表里的所有元素。

这里介绍标准库中两种不同的队列：

### 双向队列

`collections.deque` 类提供了一个双向队列，也就是说 `deque` 也完全可以栈来使用。它的 `append()`、``appendleft()`` 和 `pop()`、``popleft()`` 都是原子操作，这也意味这 `deque` 是线程安全的。`deque` 同样实现了所有和可变序列相关的操作。`deque` 可以接受一个可选参数（`maxlen`）表示队列可容纳元素的数量：

```python
from collections import deque
dq = deque(range(5), maxlen=5)
>>> dq
deque([0, 1, 2, 3, 4])
>>> dq.append(5)
>>> dq
deque([1, 2, 3, 4, 5])
>>> dq.popleft()
1
>>> dq
deque([2, 3, 4, 5])
>>> dq.appendleft(1)
deque([1, 2, 3, 4, 5])
```

需注意，一旦添加了 `maxlen` 属性，这个属性就无法修改了。当对一个已满的队列进行添加操作时（第 5 行），另一头的元素会被挤掉。

### 单向队列

（原谅我想不出一个好名字了，只能用单向队列来和刚刚介绍的双向队列做区分了）。

`queue.Queue` 类提供的是一个单向的队列，它与上面双向队列最大不同除了它是单向的之外，还有对于队列已经满了或空了的情况下，还要对队列进行添加或删除操作的结果不同：在满员（为空）时，如果还向 `Queue` 中插入（取出）元素的话，它不会扔掉旧的元素来腾出位置，反而是会锁住——直到另外的线程移除了某个位置，这一特性很适合用做生产者——消费者的模型，尤其是当生产者的生产时间与消费者的消费时间不匹配的情况，比如：生产者的生产时间快于消费者的消费时间，如果采用 `deque` 的话，就会丢失生产者最早时候生产的数据（反之就会造成消费者从空队列中取出数据的情况）。

```python
from queue import Queue
from threading import Thread
import logging
import time

logging.basicConfig(level=logging.INFO,
                    format=('%(asctime)s %(message)s'))

queue = Queue(1)


def consumer():
    time.sleep(.1)
    queue.get()
    logging.info('Consumer got 1')
    queue.get()
    logging.info('Consumer got 2')


def producer():
    queue.put(1)
    logging.info('Producer put 1')
    queue.put(2)
    logging.info('Producer put 2')
    thread.join()
    logging.info('Producer done')


thread = Thread(target=consumer)
thread.start()
producer()
>>>
2018-08-07 19:56:42,234 Producer put 1
2018-08-07 19:56:42,335 Consumer got 1
2018-08-07 19:56:42,335 Producer put 2
2018-08-07 19:56:42,335 Consumer got 2
2018-08-07 19:56:42,335 Producer done
```

消费者线程先等待了片刻是为了给生产线程留部分时间，使其在消费者从队列获取之前先将两个对象放入队列。然而，这里的缓冲区容量为 1，这就意味着生产线程在放入第一个数据后，会卡在第二个 `put` 方法那里，必须等待消费线程通过 `get` 方法把第一个数据消费之后，才能放入第二个对象。

## 堆

堆的性质是父节点（下标为 k）的值，总是小于（大于）等于其左（下标为 2k + 1）右（下标为 2k + 2）两个子节点的值。堆这种数据结构实际中多用于实现**优先级队列**（在 `queue` 模块中也有优先级队列的实现：`PriorityQueue ` ）：在队列中，优先级较高的元素**总**排在前面。

`heapq` 模块可以在标准的列表之中创建堆结构：

```python
from heapq import heappush, heapify, heappop

heap = []
heappush(heap, 5)
heappush(heap, 3)
heappush(heap, 7)
heappush(heap, 4)

>>> assert heap[0] == min(heap)
>>> heappush(heap, 2)
>>> heap
[2, 3, 7, 5, 4]
>>> heappop(heap), heappop(heap), heappop(heap)
(2, 3, 4)

heap2 = [9, 8, 7, 6, 5, 4]
heapify(heap2)
>>> heap2
[4, 5, 7, 6, 8, 9]
```

`heappush` 和 `heappop` 方法总会保持堆的性质，将数据插入或弹出，`heappop` 总会将堆中优先级最高的元素弹出。其中 `heapify` 可在线性时间内将列表转化为堆。

## 内存视图

内存视图（memoryview）可以在不需要复制内容的前提下，在不同的数据结构之间共享内存。当你需要在内存中处理大量二进制数据时，或者需要反复修改内存中某块数据的内容，内存视图可能会对你有很大帮助：因为在 Python 中，对字符串（str）和字节数组（bytesarray）进行切片都是会造成内存的复制，尤其是当需要对较大的数据进行切片的时候，所耗费的代价将会非常昂贵。

```python
from time import time


def mv_vs_bytes(factory, name):
    for n in (100000, 200000, 300000, 400000):
        data = b'x' * n
        t0 = time()
        b = factory(data)
        while b:
            b = b[1:]
        print(name, n, time() - t0)


mv_vs_bytes(lambda x: x, 'bytes')
mv_vs_bytes(lambda x: memoryview(x), 'memoryview')

"""
output:
bytes 100000 0.15474176406860352
bytes 200000 0.6353733539581299
bytes 300000 1.5503427982330322
bytes 400000 2.8593809604644775
memoryview 100000 0.008246183395385742
memoryview 200000 0.017104148864746094
memoryview 300000 0.025980710983276367
memoryview 400000 0.03431963920593262
"""
```

可以看出，对 `bytes` 切片的时间复杂度是 O(n^2)，而对 `memoryview` 切片总能在线性时间内完成。

当然，由于 `bytes` 本身是不可变（immutable）的字节序列，如果想对 `memoriview` 中的数据进行修改的话，就需要用 `bytearray` 的方式构造 `memoryview` 对象：

```python
# readonly
b = b'Hello'
mv_b = memoryview(b)
assert mv_b.readonly == True
>>> mv_b[0] = 73
TypeError: cannot modify read-only memory

# can write
ba = bytearray(b)
mv_ba = memoryview(ba)
assert mv_ba.readonly == False
>>> mv_ba[0] = 73
>>> mv_ba.tobytes()
b'Iello'
```

由于 `memoryview` 使用了缓冲区协议（协议提供的是 C 语言级别的 API），导致 `memoryview` 只有在 CPython 中才能发挥它最大的作用。

本系列全部文章可访问「[知多少](../../tags/知多少/)」标签查看。

参考：

- [Fluent Python](https://www.oreilly.com/library/view/fluent-python/9781491946237/)
- [Effective Python](https://effectivepython.com/)
- [Less copies in Python with the buffer protocol and memoryviews](https://eli.thegreenplace.net/2011/11/28/less-copies-in-python-with-the-buffer-protocol-and-memoryviews)

