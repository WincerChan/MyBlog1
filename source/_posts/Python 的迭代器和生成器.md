---
title: Python 的迭代器和生成器
date: '2017/07/02 12:03:42'
updated: '2018/06/15 12:34:43'
type: categories
categories: 文字阁
tags:
  - Python
copyright: true
abbrlink: 903c6509
published: false
thumbnail: https://res.cloudinary.com/wincer/image/upload/v1530859358/blog/iterator_and_generator/cover.png
---

我最初接触 Python 是在 17 年 2 月份，现在半年过去了，对迭代器和生成器的概念却及其有限，其实也是因为其它主流语言如：C、Java 中没有生成器的概念，所以当时学了就忘了。现在正准备好好复习一下迭代器和生成器。

## 容器

容器是一种把多个元素组织在一起的数据结构，容器中的元素可以逐个地迭代（即可以通过 `for` 循环去遍历）获取，可以用 `in`，`not in` 关键字判断元素是否包含在容器中。

在 Python 中，常见的容器对象有：

- list, deque
- set, frozensets
- dict, defaultdict, OrderedDict, Counter
- tuple, namedtuple
- str

<!-- more-->

容器的概念比较容易理解，你可以把它看作一个盒子、一间屋子，里面可以塞许多东西。从某种意义来说，当它可以被询问某个元素是否包含在其中时，那么它就可以认为是一个容器。比如 `list`、`set`、`tuple` 等都是容器对象：

```python
>>> assert 1 in [1, 2, 3]    
>>> assert 4 not in [1, 2, 3]
>>> assert 1 in {1: 'foo', 2: 'bar', 3: 'qux'}
>>> assert 'foo' not in {1: 'foo', 2: 'bar', 3: 'qux'}  
>>> assert 'b' in 'foobar'
>>> assert 'x' not in 'foobar'
```

尽管绝大多数容器都提供了迭代的方式来获取其中每一个元素，但这并不是容器本身的能力，而是当容器对象需要提供迭代功能的时候，**可迭代对象**赋予了容器这种能力。

## 迭代器协议

迭代器协议是指对象需要提供 `__iter__()`、`__next__()` 方法，其中：

- `__iter__() `返回迭代器对象本身
- `__next__() `从容器中返回迭代中的下一项，要么引起一个 `StopIteration` 异常，以终止迭代

而迭代器对象就是实现了迭代器协议的对象。

```python
>>> x = [1, 2, 3]
>>> y = x.__iter__()
>>> type(x)
<class 'list'>
>>> next(x)
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: 'list' object is not an iterator
>>> type(y)
<class 'list_iterator'>
>>> next(y)
1
```

这里的 `x` 就是一个可迭代对象（但并不是一个迭代器，注意看报错），可迭代对象和容器一样是一种通俗的叫法，不是某种具体的数据类型。`y` 是一个迭代器，具体来说 `y` 的迭代器类型是 `list_iterator`。可迭代对象实现了 `__iter__()`，该方法返回一个迭代器对象。

对 Python 稍微熟悉的朋友应该知道，`for` 循环不但可以用来遍历 `list`，还可以来遍历文件对象：

```python
>>> f = open('test.txt', 'r') 
>>> type(f)
<_io.TextIOWrapper name='test.txt' mode='r' encoding='UTF-8'>
>>> for line in f:
    	print(line)
...
>>> next(f)
...
```

为什么在 Python 中，文件还可以使用 `for` 循环遍历呢，这是因为文件对象实现了迭代器协议，`for` 循环并不知道它遍历的是一个文件爱呢对象，它只需要使用迭代器协议访问对象即可。

## 迭代器

那么什么才是迭代器呢？它是一个带状态的对象，能在调用 `next()` 方法的时候返回容器下一个值，任何遵循了迭代器协议的对象都是迭代器。

为了更直观感受迭代器内部执行，我们自己定义一个迭代器，以斐波那契数列为例：

```python
class Fib:
    def __init__(self):
        self.prev, self.curr = 0, 1
        
    def __iter__(self):
        return self
    
    def __next__(self):
        value = self.curr
        self.curr += self.prev
        self.prev = value
        return value

>>> f = Fib()
>>> f
<__main__.Fib object at 0x7f383fbdd438>
>>> for x in range(5):
...     next(f)
... 
1
1
2
3
5
```

Fib 既是一个可迭代对象（实现了 `__iter()` 方法），又是一个迭代器（实现了 `__next__()` 方法）。变量 `prev` 和 `curr` 用户维护迭代器内部的状态。每次调用 `next()` 方法的时候做两件事：

1. 为下一次调用 `next() `方法修改状态
2. 为当前这次调用生成返回结果

迭代器使用的是惰性计算，等到有需要的时候才给它生成值返回，没调用的时候就处于休眠状态等待下一次调用。

## 生成器

在 Python 这门语言中，生成器算得上最有用的特性之一了，也算是使用最不广泛的特性之一。原因嘛，就像我开头所说的，其它主流语言没有这个概念。

生成器是一种特殊的迭代器，不过这种迭代器更加优雅。它不再需要上面的类一样需要写 `__iter__()`、`__next__()` 方法，只需要一个 `yield` 语句，`yield` 语句一次返回一个结果，在返回结果之后，挂起函数，以便下次从离开的地方继续执行。下面用生成器来实现斐波那契数列：

```python
def Fib():
    prev, curr = 0, 1
    while True:
        yield curr
        prev, curr = curr, curr + prev
>>> f = Fib()
>>> f
<generator object Fib at 0x7f307048e570>
>>> >>> for x in range(5):
...     next(f)
... 
1
1
2
3
5
```

当执行 `f = Fib()` 的时候返回的是一个生成器的对象，此时函数体的代码并没有执行，只有调用 `next()` 的时候才会真正执行代码。

除了给函数加上 `yield `语句之外，还有一种方法创建生成器，只要把一个列表生成式的 `[]` 改成 `()`，就创建了一个生成器：

```python
>>> L = [x for x in range(5)]
>>> L
[0, 1, 2, 3, 4]
>>> G = (x for x in range(5))
>>> G
<generator object <genexpr> at 0x7f307048e5c8>
```

生成器在 Python 中是非常强大的，可以更少的使用中间变量，也可以更少的占用内存空间，而且可以缩减代码量来维持相同的功能：

```python
def something():
    result = []
    for x in ... :
        result.append(x)
    return result
```

类似的都可以用生成器来替换：

```python
def gen_something():
    for x in ... :
        yield x
```

**注意事项：生成器只能遍历一次**
