---
title: Python正则表达式
type: categories
categories: 笔记
tags:
  - Python
  - 正则表达式
copyright: true
abbrlink: fc635c56
date: 2017-05-26 09:26:00
---

目前在跟Udacity的[cs212](https://classroom.udacity.com/courses/cs212)课程，避免懒癌发作，开篇博客来记录一下

## Python的正则表达式

### 正则表达式模式

| special | example |        match         |
| :-----: | :-----: | :------------------: |
|    *    |   a*    | '', a, aa, aaa, ...  |
|    ?    |   a?    |      '', a, ...      |
|    .    |    .    |  a, b, c, 7, !, ...  |
|    ^    |   ^b    | ba, bb, ...  ~~abc~~ |
|    $    |   a$    |   ba, ...,  ~~ab~~   |
|   ''    |   ''    |          ''          |
|    a    |    a    |          a           |
|   ba    |   bba   |  ba, ~~aa~~, ~~bb~~  |

<!-- more -->

### re.search和re.search的区别

re.macth只匹配字符串的开始，如果字符串开始不符合正则表达式，则匹配失败，函数返回None；

re.search匹配整个字符串的所有位置，如果整个字符串都匹配不到，则返回None.

如：

```python
def test():
    assert search('baa*!', 'Sheep said baaaa!')
    assert search('baa*!', 'Sheep said baaaa humbug') == False
    assert match('baa*!', 'Sheep said baaa!') == False
    assert match('baa*!', 'baaaaaaaa! said the sheep')
```

### 自己实现的match和search

```python
def search(pattern, text):
    "Return True if pattern appears anywhere in text."
    if pattern.startswith('^'):
        return match(pattern[1:], text)
    else:
        return match('.*' + pattern, text)

def match(pattern, text):
    "Return True if pattern appears at the start of text."
    if pattern == '':
        return True
    elif pattern == '$':
        return (text == '')
    elif len(pattern) > 1 and pattern[1] in '*?':
        p, op, pat = pattern[0], pattern[1], pattern[2:]
        if op == '*':
            return match_star(p, pat, text)
        elif op == '?':
            if match1(p, text) and match(pat, text[1:]):
                return True
            else:
                return match(pat, text)
    else:
        return (match1(pattern[0], text) and
                match(pattern[1:], text[1:]))

def match1(p, text):
    """Return true if first character of text matches
    pattern character p."""
    if not text: return False
    return p == '.' or p == text[0]


def match_star(p, pattern, text):
    """Return true if any number of char p,
    followed by pattern, matches text."""
    return (match(pattern, text) or
    (match1(p, text) and
     match_star(p, pattern, text[1:])))


print(search('ba*!', 'this a baaa!'))
```

---未完待续---

