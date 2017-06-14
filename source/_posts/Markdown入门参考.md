---
title: Markdown入门参考
type: categories
categories: 笔记
tags:
  - Markdown
abbrlink: '3e793072'
date: 2017-05-25 21:00:38
---



## 基本语法

### 标题

以下分别代表一至五级标题：

```markdown
#h1
##h2
###h3
####h4
#####h5
```
<!-- more -->
### 引用

在段落等内容前使用`>`符号，可以将这段内容标记为**引用**的内容：

```markdown
>引用内容
>>二级引用
```

> 引用内容
>
> > 二级引用

### 列表

#### 无序列表

```markdown
* 可以作为标记
+ 也可以
- 同样可以
```

* 可以作为标记
+ 也可以
- 同样可以

#### 有序列表

```markdown
1. 以数字和`. `开始；
3. 数字的顺序并不会影响生成的列表序列；
```

1. 以数字和`. `开始；
2. 数字的顺序并不会影响生成的列表序列；

#### 嵌套的列表

```markdown
1. 第一层
	+ 1-1
	+ 1-2
2. 无序列表和有序列表可以随意嵌套
	1. 2-1
    2. 2-2
```

1. 第一层
  + 1-1
  + 1-2
2. 无序列表和有序列表可以随意嵌套
   1. 2-1
   2. 2-2

### 代码

#### 代码块

在代码的头部和尾部用\`\`\`包围起来，需要高亮的话，在\`\`\`包围的代码块头部标注语法的名字：


```python
s = 'Python syntax highlighting'
for chr in s:
    print (s)
```

#### 行内代码

通过` `插入行内代码 ：

`print(Hello world)`

### 分隔线

一行中使用三个即以上的`*` 、`-`、`_` 来添加分隔线：

```markdown
****
```
***
### 超链接

需要显示的文本为[]的内容，小括号中的链接可以是本地也可以是网络

```markdown
[Google](https://google.com)
```

[Google](https://google.com)

### 图片

语法与超链接基本一致，只是需要在前面加一个`！`：

```markdown
![title](https://cdn.pixabay.com/photo/2012/10/26/00/45/senegal-pechlibelle-62964_960_720.jpg)
```

### 强调

#### 粗体

使用`** **`或`__ __`包括的文本会转化成**粗体**

#### 斜体

使用`* *`或`_ _`包括的文本会转化为_斜体_

### 字符的转义

当需要显示一些特殊的字符的时候，需要使用反斜线`\`来进行转义：

```markdown
这是一个*转义*的_例子_
这是一个\*转义\*的\_例子\_
```

这是一个*转义*的_例子_

这是一个\*转义\*的\_例子\_

## 进阶语法

### 删除线

```markdown
这是~~删除线~~
```
这是~~删除线~~

### 下划线

Markdown原生并无下划线语法，可以通过HTML来实现：

```html
<u>这是下划线</u>
```
<u>这是下划线</u>

### 表格

#### 单元格和表头

使用`|`来分隔不同单元格，使用`-` 来分隔表头和其他行：

```markdown
| name  | age  |
| ----- | ---- |
| Leo   | 16   |
| Virgo | 18   |
```

| name  | age  |
| ----- | ---- |
| Leo   | 16   |
| Virgo | 18   |

#### 对齐

在表头下方的分隔线标记加入`:`， 可更换下方单元格的对齐方式：

```markdown
| left | center | right |
| ---- | :----: | ----: |
| left | center | right |
```



| left | center | right |
| ---- | :----: | ----: |
| left | center | right |

### 待办事宜(hexo不支持以下语法)

```markdown
- [ ] 吃饭
- [x] 唱歌
```

![](https://ws1.sinaimg.cn/large/ba22af52gy1ffy07lxnyhj20fn02ct8i.jpg)

### 流程图
以flow为关键字

```flow
st=>start: Start
e=>end: End
op=>operation: My Operation
cond=>condition: Yes or No?

st->op->cond
cond(yes)->e
cond(no)->op
```
![](https://ws1.sinaimg.cn/large/ba22af52gy1ffy055sa4mj20710bgt8p.jpg)

### 时序图

以sequence为关键字

```sequence
Alice->Bob: Hello Bob, how are you?
Note right of Bob: Bob thinks
Bob-->Alice: I am good thanks!
```

![](https://ws1.sinaimg.cn/large/ba22af52gy1ffy05m64ttj20e607i3yk.jpg)

### Latex公式

#### 行内公式

用`$ $`包括起来的表示行内公式：

```markdown
质能守恒方程：$E=mc^2$
```
质能守恒方程：$E=mc^2$

#### 整行公式

用`$$ $$`包括起来的表示整行公式：

```markdown
$$\sum_{i=1}^n a_i=0$$
$$f(x_1,x_x,\ldots,x_n)=x_1^2+x_2^2+\cdots+x_n^2$$
```

$$\sum_{i=1}^n a_i=0$$

$$f(x_1,x_x,\ldots,x_n)=x_1^2+x_2^2+\cdots+x_n^2$$

### 脚注

使用`[^keyword]`表示脚注：
```markdown
这是一个脚注[^1]的例子

[^1]: 这是一个脚注 
```
这是一个脚注[^1]的例子

[^1]: 这是一个脚注 

