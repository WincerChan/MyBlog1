---
title: Python 知多少（二）——继承
date: 2018/10/21 18:18:20
updated: 2018/10/21 18:18:20
categories: 分享境
tags:
  - Python
  - 继承
  - super
  - 知多少
abbrlink: 58dd3c61
mathrender: true
thumbnail: https://ae01.alicdn.com/kf/HTB1IszcacrrK1Rjy1zeq6xalFXaE.jpg
---

好像又有一段日子没写技术类博文，翻了翻归档，发现最近一篇技术类文章已经是俩月多之前的事了，吓得我赶紧~~水~~写一篇的技术文章不然怕是要被人当成生活博主了。思来想去写些什么好，还是继续上次开的新坑，来聊聊 Python 中的继承。

<!-- more -->

 Python 作为一种具备多种编程范式的语言，面向对象自然也是它所具备的范式之一；而继承，作为面向对象程序设计的三大特性之一，其重要性也是不容忽视的。尤其这一特性在支持面向对象范式的语言里还有着不同的规则，如：C++ 同时支持普通继承和虚继承；Java 则是将其它语言中的 class 细分为 class 和 interface；还有 Python，「无痛地」支持多重继承。 

## 多重继承 

当一个语言支持多重继承时，至少需要解决这两个问题，以下图为例逐个分析 C++、Java、Python 对多重继承的支持情况：

```markdown
            A
          /   \
         B     C
          \   /
            D
```

1. 怎么处理共同的父类（基类、超类）
2. 多个父类方法名重复的问题

### C++

首先看看 C++ 是怎么解决第一个问题的：C++ 在遇到这种情况时，最顶层的基类（A）会被创建两次，虽然可以通过将 A 设置为 B、C 的虚基类来解决，但这种虚继承是有副作用的：不只是在获取成员会更慢、占用内存更多，在和虚函数一起出现时会更难以理解：当 A、B、C、D 中都有一个虚函数 f 时， `D::f` 内部调用了 `B::f` 和 `C::f`；`B::f`和`C::f`内部都调用了`A::f`，于是 `A::f`就被调用了两次。当然也不是没有办法解决，[Template Parameters as Base Classes](https://books.google.com/books?id=PSUNAAAAQBAJ&lpg=PA767&ots=DrtrIigY4J&dq=27.4.%20Template%20Parameters%20as%20Base%20Classes&hl=zh-CN&pg=PA767#v=onepage&q&f=false) 就是 C++ 之父专门用于解决这个问题所开发的技术。

第二个问题：如果这里的 B 和 C 同时实现了 `hello` 方法，同时 D 中没有实现 `hello` 方法，那么在调用 `d.hello()`（d 为 D 的 instance） 的时候会调用哪一个？编译器对于这种 Ambiguous base classes 的情况会直接报错，解决方法也简单粗暴，你必须显式指定 `d.B::hello()` 来调用 B 中的 `hello`。虽然以上两个问题在 C++ 中都解决的并不好，但也总归是解决了。下面来说说 Java。

### Java

Java 之父觉得 C++ 太难用了，于是他决定创造一门语言来取代 C++，这门语言需要保留 C++ 的优点，但又需要把 C++ 中较为混乱、复杂、危险的部分剔除（其中就包括了多重继承），于是，Java 就在这样的理念里诞生了。在 Java 诞生之初，对多重继承的支持少的可怜：一个 class 仅可继承（实现）多个 interface。本来是挺好的，但是在 Java 8 中为 interface 中的方法引入了 default 关键字，这就让 interface 里定义的方法可以有方法体了。

那么 inteface 有了方法体之后，对这解决这两个问题有什么影响呢？将上例中的 A、B、C、D 换成四个 interface：

第一个问题：Java 遇到了和 C++ 中的虚函数一样的问题，即 D 中如果想同时调用 B 和 C 中的某方法，且 B、C 中也调用了 A 的方法，那么 A 的该方法会重复运行两次。并且 Java 无法像 C++ 中使用模板技术来解决这个问题。

第二个问题：Java 8 之前一个 class 可以实现多个 interface，即使 interface 有同名方法也没关系，毕竟 inteface 里定义的方法没有方法体，所以不会导致二义性。但有了 default method 之后，Java 反而无法处理这个问题了：D 不允许同时继承两个实现了 default 方法的接口（一个实现了，另一个没有实现也不行）。

C++ 解决的不好，Java 压根就没解决。所以我认为 Java 在多重继承这一方面比 C++ 处理的更加不好。

### Python

终于到 Python 了，那么先来看看 Python 是如何解决第一个问题的：如果 D 中需要同时调用 B 和 C 中的 `hello` 方法，且 B、C 中也需要调用 A 的 `hello` 方法，那么仅需在 B、C、D 的该方法中写下 `super().hello()` 即可。因为继承图的缘故，Python 中的 `super()` 会沿着继承图顺序依次找寻 D 的所有超类。

第二个问题：还是得益于继承图，当 D 中没有实现 `hello` 方法时，Python 会依据继承图顺序来寻找 D 的所有超类中是否有该方法，直到找到为止，而这个顺序也就是方法解析顺序。

Python 完美的解决了这两个问题，这也是为什么我说 Python「无痛地」支持多重继承。

既然这两个问题都是靠方法解析顺序解决的，那么它到底是个什么东西？看官先别急，下面会着重阐述。

## 方法解析顺序

方法解析顺序（Method Resolution Order，简写为 MRO），是描述该类自继承顶层超类的一种顺序，它在类中以 `__mro__` 属性存放，值是一个元组（`.mro()` 返回的则是一个列表，然而这列表并不可变），上例中的 D 的 MRO 为：

```python
>>> D.mro()
[__main__.D, __main__.B, __main__.C, __main__.A, object]
```

这里的意思是：D 的最顶层超类为 `object`（新式类中所有类都继承自 `object`），其次是 A、C、B。

下面来具体看看 Python 的代码是如何解决上文提到的第一个问题的：

```python
class A:
    def hello(self):
        print("Hello from A")

class B(A):
    def hello(self):
        print("Hello from B")
        super().hello()

class C(A):
    def hello(self):
        print("Hello from C")
        super().hello()

class D(B, C):
    def hello(self):
        print("Hello from D")
        super().hello()
        
>>> d = D()
>>> d.hello()
Hello from D
Hello from B
Hello from C
Hello from A
```

在 D 中遇到的 `super()` 会沿着 D 的 MRO 依次向上寻找超类中的 `hello` 方法并执行，即依次执行 D -> B -> C -> A 这个顺序。

那么为什么 Java 或 C++ 无法通过这种写法解决呢，原因在于 Java 的 `super` 在多重继承中必须指定父类是哪一个，因为编译器是无法获知你想要运行的是哪一个父类的方法。而一旦指定了父类（B），那么与这个父类同时继承的另一个父类（C）你也必须要指定，而这两个父类又具有相同的更高层次的父类（A），所以就导致了最顶层的父类（A）中的方法被调用了两次。

下面来具体说说 Python 中的 `super` 类。

## super 的作用

在 Python 中某 class 使用了 `super()` 后，`super` 即会沿着最初调用 `super()` 的那个 class 的 MRO 向上寻找超类：

```python
>>> B.mro()
[__main__.B, __main__.A, object]
>>> C.mro()
[__main__.C, __main__.A, object]
```

也就是说：在 B 中调用的 `super` 不会顺着 B 的 MRO 来向上寻找，而是从最初调用的 D 的 MRO 来向上寻找。那么 `super` 是怎么知道最初的 class 是哪一个呢？

嘿嘿，你可能已经猜到了，没错，就是通过 `self` 这个参数来指定的：当我们调用 `d.hello()`时 ，实际上调用的是：`D.hello(d)`，而我们调用的 `super()` 也只是 Python 3 对 `super(a_class, a_instance)` （其实这里的 `instance` 也可以换成 `class`）的简写，所以其实 B、C、D 中的 `super()` 中的 `a_instance` 其实都是 d。 

当我们以 `super(a_class, a_instance)` 调用时，这里的 MRO 即为 `a_instance.__class__` 的 MRO，而 `a_class` 必须为该 MRO 中的某一项，也就是说 `isinstance(a_instance, a_class) == True`。

**简单来说**，`super()` 做的事就是：你提供给它一个 class 以及一个 instance，它返回从该 instance 的 MRO 中排在 class 之后的类里，查找方法的对象。

说了这么多，那么这个 MRO 到底是怎么产生的？

## C3 算法

在 Python 2.3 之后，MRO 是由 C3 算法来计算得出的，而在 2.3 之前是按照如下规则计算：新式类是广度优先，经典类是深度优先。这里仅讨论 Python 2.3 版本之后的 MRO 计算方法，也就是 C3 算法：

为表述方便，先做出如下规定：
$$
head([C_1,C_2,...,C_N]) = C_1
$$

$$
tail([C_1,C_2,...,C_N]) = [C_2, C_3,...,C_N]
$$

$$
L[C(C_1,...,C_N)]=[C]+merge(L[C_1],...L[C_N],[C_1,...,C_N])
$$

则用 C3 算法计算这个列表的线性化可以用公式 (4) 表示，其中的 C 是继承自 C1，C2，… CN 的类。

对其中的 merge 操作可以解释为：

1. 选取等号右边 merge 列表的第一项 L[C1] 为 K；
2. 如果 head(K) 没有在 merge 中的任何列表的 tail 中出现（这时称 head(K) 为 `good head`），则把 head(K) 加入 C 的线性化列表中，并将 head(K) 从 merge 的所有列表中删除，重复 2；
3. 否则，设置 merge 中的下一项 L[C2] 为 K，如果 head(K) 为 `good head`，重复 2；
4. 重复以上操作直到所有的 class 都被移除或者已经找不到 `good head` 为止；如果找不到 `good head` 那么就抛出异常，否则创建成功。

来看个例子吧：

```python
A = object
class B(A): ...
class C(A): ...
class D(C, B): ...
class E(C, D): ...
```

首先 L[A] = [A]，然后：
$$
L[B]=[B]+merge(L[A],[A])=[B, A]
$$

$$
L[C]=[C]+merge(L[A],[A])=[C,A]
$$

这两个等式很简单，没什么好说的，来看个稍微复杂一点的：
$$
\begin{aligned}
L[D]&=[D]+merge(L[C],L[B],[C,B])\\\
&=[D]+merge([C,A],[B,A],[C, B])\\\
&=[D,C]+merge([A],[B,A],[B])\\\
&=[D,C,B]+merge([A], [A])\\\
&= [D,C,B]
\end{aligned}
$$
稍微解释一下：

第二行，设置 K 为 [C, A]，其中 C，也就是 head(K) 是一个 `good head`，那么就把 C 加入 D 的列表，并把 C 删去；

第三行，这时设置 K 为 [A]，A 此时并不是一个 `good head`，因为他在 tail([B, A]) 中出现了，所以要设置下一项 [B, A] 为 K，此时 B 是一个 `good head`，那么就把 B 加入列表，并删除 B；

第四行，这时 K 为 [A]，A 此时是一个 `good head`，加入列表，并删除 A，此时所有 class 都已经被移除，算法结束。

来个错误的例子：
$$
\begin{aligned}
L[E]&=E+merge(L[C],L[D],[C,D])\\\
&=E+merge([C,A],[D,C,B,A],[C,D])
\end{aligned}
$$
这时算法好像没有办法继续往下走了：因为设置 K 为 [C, A]，head(K) 并不是一个 `good head`，那么就把 K 设置为 [D, C, B, A]，这时还是不行，因为 D 也在后面列表中的 tail 出现了。

所以是无法选择 (C, D) 为基类来创建 E 的，如果你在解释器中执行一下代码，你就会发现，它报错了：

```python
Traceback (most recent call last):
  File "<stdin>", line 1, in <module>
TypeError: Cannot create a consistent method resolution
order (MRO) for bases C, D
```

---

以上，

愿对你有所帮助。

参考：

- [The Python 2.3 Method Resolution Order](https://www.python.org/download/releases/2.3/mro/)
- [Item 40：明智地使用多继承](https://harttle.land/2015/09/07/effective-cpp-40.html)
- [Python: super 没那么简单 - Huang Huang 的博客](https://mozillazg.com/2016/12/python-super-is-not-as-simple-as-you-thought.html)

