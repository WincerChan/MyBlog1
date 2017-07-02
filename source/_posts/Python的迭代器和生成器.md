---
title: Python的迭代器和生成器
date: '2017/07/02 09:23:42'
type: categories
categories: 编程
tags:
  - Python
copyright: true
abbrlink: 903c6509
---

## 前言

我最初接触Python这门语言是在17年2月份，入门是依据[麻省理工：计算机科学和 Python 编程导论](http://www.xuetangx.com/courses/course-v1%3AMITx%2B6_00_1x%2Bsp/about)，这门课是介绍了生成器和迭代器的概念，不过现在差不多小半年时间，我却忘的精光（其实当时上这门课就不是很理解），最近正在恶补Python的特性，写篇文章记录一下。

## 容器

在介绍生成器和迭代器的概念之前，先介绍以下什么是容器。

容器是一种把多个元素组织在一起的数据结构，容器中的元素可以逐个地迭代（Iteration）获取（即通过`for`循环来遍历这个容器），可以用`in`、`not in`关键字来判断元素是否包含在容器内。在Python中，常见的容器类对象有：

- list, deque, ......
- set, frozensets, ......
- dict, defaultdict, OrderedDict, Counter, ......
- tuple, namedtuple, ......
- str

列出的有许多不认识？没关系，继续往下看

你可以把容器看作一个盒子、一见屋子，里面可以塞任何东西。从某种角度来说，只要它可以被询问某个元素是否包含在其中时，那么这个对象就可以认为是一个容器，比如：`list`、`set`、`tuple`等都是容器。

```python
>>> assert 1 in [1, 2 ,3]
>>> assert 4 not in [1, 2, 3]
```

尽管大多数容器提供了某种方式来获取其中一个元素，但这个并不是容器的能力，而是**可迭代对象**赋予容器的能力。

## 可迭代对象

刚刚说到了很多容器都是可迭代对象，但凡可以返回一个**迭代器**的对象都可称之为可迭代对象，听起来可能有点困惑，没关系，再看一个例子

```python
from collections import Iterable
isinstance(obj, Iterable)
```

