---
title: Python 字典的原理及高级用法
date: '2018/05/12 09:23:02'
updated: '2018/05/12 12:36:13'
categories: 分享境
tags:
  - Python
  - 字典
description: >-
  对于字典这一基础的数据结构来说，其对 Python 程序的重要性是无可替代的，在《代码之美》一书中，作者是这么描述的：字典这个数据结构活跃在所有
  Python 程序的背后，即便你的源码里并没有直接用到它。——A.M.Kuchling
thumbnail: 'https://upload-images.jianshu.io/upload_images/2133488-6554894593d92b16.png'
abbrlink: 4f2b4bfb
---

算算时间有段时间没写技术类的文章了，部分原因是最近过得确实比较忙。当然，也并没有忙到完全抽不出时间写博客，根本原因还是没有找到啥好的写作素材，随随便便糊弄一篇我又有点不好意思发上来，于是乎，就一直搁置到现在。<!--more-->

对于字典这一基础的数据结构来说，其对 Python 的程序重要性是无可替代的，在《代码之美》一书中，作者是这么描述的：

> 字典这个数据结构活跃在所有 Python 程序的背后，即便你的源码里并没有直接用到它。——A.M.Kuchling

在 Python 程序里，无论是模块、函数、还是对象，均有自己的「命名空间」，而这命名空间即为一个字典（dict），key 就是变量名，value 就是变量值，除去「命名空间外」，对象的函数（方法）关键字也是存放在字典中，此时的 key 就是函数（方法）名，value 就是该函数（方法）的引用。可以采用 \_\_builtins\_\_.\_\_dict\_\_ 来查看这些函数（方法）。

## 字典的原理

Python 的字典是依据[散列表](https://zh.wikipedia.org/wiki/%E5%93%88%E5%B8%8C%E8%A1%A8)（也叫哈希表）来实现的，首先简单介绍一下散列表的原理。

散列表中的每一个单元称为表元。在 dict 的实现里，每个 key-value 均占用一个表元，其中 key 为**键的引用**（这里是键的引用，而不是键本身，因为 key 可以为任意可散列对象），value 为值的引用。因为是引用：表元大小均一致，所以可通过偏移量来读取某个表元。

在 Python 中，散列函数由 hash() 方法出任，当我们查询 my_dict[search_key] 时，Python 会调用 hash(search_key) 来计算 search_key 的散列值，并将这个值的低几位数字当作偏移量，在散列表中查找表元，具体是几位，需要根据散列表的大小来决定。若表元为空，则说明 search_key 不存在，抛出 KeyError 异常。若非空，则表元会有一对 found_key:found_value，这时若 search_key == found_key 为真，那么就返回 found_value。

如果 search_key 和 found_key 不相等，这种情况成为散列冲突，发生这种情况是因为散列表只把该元素映射到了只有几位数字上。为了解决散列冲突，算法会在散列值中另外取几位，用新得到的数字做偏移量再次寻找。

## 创建字典

创建一个字典有许多方式：

```python
a = dict(one=1, two=2, three=3)
b = {'one': 1, 'two': 2, 'three': 3}
c = dict(zip(['one', 'two', 'three'], [1, 2, 3]))
d = dict([('two', 2), ('one', 1), ('three', 3)])
e = dict({'three': 3, 'one': 1, 'two': 2})
>>> a == b == c == d == e
True
```

在刚刚的原理中说到，由于字典的索引是根据 hash() 函数来获得的，所以 dict 其实是无序的，这也解释了为什么上面代码中的等式会成立。

## 字典推导

没错，在 Python3+ 里，推导式不再是列表的特性了。

```python
numbers = range(5)
numbers_square = {number: number ** 2 for number in numbers}
```

## 键查询

最简单的方法是采用下标方式来查询。即：my_dict[key]，这也是推荐的方法，但这是 key 存在的情况，而现实中，一定会遇到 key 不存在的时候，这时就会 raise 一个 KeyError。以下有几种解决办法：

### 用 get 来获取

```python
my_id = {'name': 'wincer'}
>>> my_id.get('name')
'wincer'
>>> my_id.get('age', 'default')
'default'
```

若 key 存在，则返回对应的 value，若 key 不存在，且传入第二个参数，那么返回该参数，若无第二个参数，则返回 None。

### 用 defaultdict 预先设置缺省（推荐）

```python
from collections import defaultdict

my_id = defaultdict(list)
my_id.update({'name': 'wincer'})
>>> mydict['name']
'wincer'
>>> mydict['age']
[]
```

defaultdict 需要指定一个 factory，当查询 key 不存在时，会创建一个空的 factory 返回。推荐使用这种方式来处理 key 不存在的情况，因为该方法不仅可用于读取 value 值，还可随时用 append 来更新 value。同时需注意：**defaultdict 中的参数只会在 \_\_getitem\_\_ 中被调用。如 dd 是一个 defaultdict，k 是一个不存在的键，dd[k] 用 factory 来创造一个默认值，但 dd.get(k) 却仍会返回 None。**

### 使用 \_\_missing\_\_ 方法

当我们调用 my_dict[key] 时，**如果 key 是一个字符串**，我们会需要用 my_dict['name'] 来获取，如果你觉得比较麻烦，想直接用 my_dict[name] 的话，可以采用如下方法：

```python
from collections import UserDict


class StrKeyDict(UserDict):
    def __missing__(self, key):
        if isinstance(key, str):
            raise KeyError(key)
        return self[str(key)]

    def __contains__(self, key):
        return str(key) in self.data

    def __setitem__(self, key, item):
        self.data[str(key)] = item

d = StrKetDict([('name', 'wincer'), ('age', '20')])
>>> d[2]
'two'
```

### 使用 \_\_getattr\_\_ 方法（不推荐）

有时我们可能更懒，想要用类属性类似的 my_dict.name 方法来获取 value，这时，可以使用 \_\_getattr\_\_ 方法：

```python
from collections import UserDict


class AttrDict(UserDict):
    def __getattr__(self, attr):
        return self[attr]
    
d = AttrDict([('name', 'wincer'), ('age', '20')])

>>> d.name
'wincer'
```

并不推荐这样做，因为在 dict 实现中，并没有要求 key 一定为合法标识符，只需要是可散列对象即可，而上面的写法一旦 key 不为合法标识符，会 raise 一个 SyntaxError：

```python
d.update({(0): 'zero'})
>>> d[(0)]
'zero'
>>> d.0
SyntaxError: invalid syntax
```

如果非常想使用 . 来获取 value 的话，建议使用 namedtuple

当然这也就意味着必须使用合法标识符了：

```python
from collections import namedtuple
ID = namedtuple('ID', 'name age')
me = ID('wincer', 20)
>>> me.name
'wincer'

ID = namedtuple('ID', '(1, 0) age')
ValueError: Type names and field names must be valid identifiers: '(1'
```

### 实现 switch ... case 结构

同样借助键查询，可以实现 Python 中没有的 switch ... case 结构：

```python
def foo(x):
    data = {
        0: 'zero',
        1: 'one',
        2: 'two',
    }
    return data.get(x, None)
```

所以说 Python 不设计 switch ... case 语句是有原因的，看上面的实现，比 switch ... case 不知道高到哪里去了。

## dict 和它的小伙伴们

### OrderedDict

在添加键的时候会按顺序添加，同时 .popitem 是会删除并返回字典的最后一个元素而不是像 dict 里面一样可能会删除任意元素。

### Counter

这个映射会给键一个计数器，每次更新键时都会增加这个计时器，所以这个类型可以用以给可迭代类型计数：

```python
from collections import Counter

ct = Counter('hfkjahfkakhf')
>>> ct

Counter({'a': 2, 'f': 3, 'h': 3, 'j': 1, 'k': 3})
ct.update('fdjlahkla')
>>> ct
Counter({'a': 4, 'd': 1, 'f': 4, 'h': 4, 'j': 2, 'k': 4, 'l': 2})

>>> ct.most_common(2)
[('h', 4), ('f', 4)]
```

### UserDict

用法见键查询。

### 不可变映射

在 Python 3.3 后的版本，types 模块引入一个名为 MappingProxyType 的类。如果给这个类一个映射，它会返回一个只读的映射视图。但它是动态的，如果原映射改动，那么它也会相应改动。

```python
>>> int.__dict__
mappingproxy({'__abs__': <slot wrapper '__abs__' of 'int' objects>,
              '__add__': <slot wrapper '__add__' of 'int' objects>,
              ...})

from types import MappingProxyType
d = {1: 'A'}
d_proxy = MappingProxyType(d)

>>> d_proxy[2] = 'x'
TypeError: 'mappingproxy' object does not support item assignment

d[2] = 'B'
>>> d_proxy[2]
'B'
```

