---
title: Java 抽象类和接口
date: '2017/06/17 08:43:23'
updated: 2017/06/18 19:22:30
copyright: true
type: categories
categories: 文字阁
tags:
  - Java
abbrlink: 43fc1528
---

## 抽象类

在说抽象类之前，先说说抽象方法。抽象方法是用 `abstract` 修饰的方法，这种方法只声明返回的数据类型、方法名称和所需的参数，没有方法体，也就是说抽象方法只需要声明而不需要实现。

在《Java 编程思想》一书中，将抽象类定义为「包含抽象方法的类」，但是如果一个类不包含抽象方法，只是用 `abstract` 修饰的话也是抽象类。许多初学者会觉得很奇怪：如果一个抽象类不包含任何抽象方法，为何还要设计为抽象类？记住以下这一点：

> 一个抽象类里面没有一个抽象方法可用来禁止产生这种类的对象。

对于一个父类，如果它的某个方法在父类中实现出来没有任何意义，必须根据子类的实际需求来进行具体的实现，那么就可以就将这个方法声明为 `abstract` 方法，此时这个类也就成为了 `abstract` 类了。如：

```java
[public] abstract class Name{
    abstract void func();
} 
```

<!-- more -->

抽象类和普通类一样，同样可以拥有成员变量和普通的成员方法。抽象类和普通类主要区别有三点：

1. 抽象方法修饰词必须为 `public` 或者 `protected`（因为如果为 private，则不能被子类继承），缺省情况下默认为 `public`。
2. 抽象类不能创建对象。
3. 如果一个类继承于一个抽象类，则子类必须实现父类的抽象方法。如果子类没有实现父类的抽象方法，则必须将子类也定义为 `abstract` 类。

## 接口

接口泛指实体把自己提供给外界的一种抽象化物，用以由内部操作分离出外部沟通方法，使其能够被修改外部而不影响外界其他实体与其交互的方式。

接口中可以含有变量和方法。但是要注意，接口中的变量会被隐式指定（并且只能是）为 `public`、`static`、`final` 变量，用 `private` 修饰会编译错误，而方法会被隐式地指定（并且只能是）为 `public`、`abstract` 方法，其他关键字如 `private`、`protected`、`static`、`final` 等修饰会编译错误，并且接口中所有的方法不能用具体的实现，也就是说，接口中的方法必须都是抽象方法。如：

```java
[public] interface InterfaceName{
    //...
}

class ClassName implements Interface1, Interface2, [...]{
    //...
}
```

允许一个类遵循多个特定的接口。如果一个非抽象类遵循某个接口，就必须实现该接口中所有的方法。而对于遵循某个接口的抽象类，可以不实现该接口中的抽象方法。

## 区别

### 语法层面

1. 抽象类可以写非抽象的方法，从而避免在子类中重复书写他们，这样可以提高代码的[可复用性](https://zh.wikipedia.org/wiki/%E4%BB%A3%E7%A0%81%E5%A4%8D%E7%94%A8)，这是抽象类的优势，而接口中只能存在抽象的方法；
2. 一个类只能继承一个抽象类，而一个类却可以实现多个接口；
3. 接口中不能含有静态代码快和静态方法，而抽象类可以有静态代码块和静态方法；
4. 抽象类中的成员变量可以是各种类型的，而接口中的成员变量只能是 `public`、`static`、`final `类型的。

### 设计层面

抽象类是一种对事物本质的抽象，而接口是对动作的抽象。

1. 对于抽象类，比如男人、女人这两个类设计一个更抽象的类：人；
2. 对于接口，比如鸟、飞机、老鹰是不同的食物，但他们都有一个共性（接口），就是飞。

也就是说：继承是一种描述“是不是”的关系，而接口则是“有没有”的关系。

## 举例

下面举一个门和响铃的例子：

门都有 `open()`、`close()` 两个动作，此时我们可以定义抽象类和接口来定义这个抽象概念：

```java
abstract class Door{
    public abstract void open();
    public abstract void close();
}
```

或者：

```java
interface Door{
    public abstract void open();
    public abstract void close();
}
```

但是现在如果我们需要门具有门铃 `ring()` 的功能，那么该如何实现呢？

1. 将这三个功能都放在抽象类里面，但是这样以来所有继承于这个抽象类的子类都具备了门铃功能，但是有的门并不具备门铃功能；
2. 将这三个功能都放在接口里面，需要用到门铃功能的类就需要实现这个接口中的 `open()`、`close()`，也许这个类根本就不具备 `open()`、`close` 这两个功能，比如闹钟。

从这里可以看出，Door 的 `open()`、`close()`、`ring()` 根本就属于两个不同范畴的行为，`open()` 和 `close()` 属于门本身固有的行为，而 `ring()` 属于延伸的附加行为。因此最好的解决办法是单独将响铃设计为一个接口，包含 `ring()` 行为，Door 设计为单独的一个抽象类，包含 `open()`、`close()` 两种行为。在设置一个有门铃的门继承 Door 类和实现 Ring 接口。

```java
interface Ring{
    void ring();
}
abstract class Door{
    void open();
    void close();
}
class RingDoor extends Door implements Ring{
    void open(){
        //...
    }
    void close(){
        //...
    }
    void alarm(){
        //...
    }
}
```

参考：

[抽象类与接口的区别](http://blog.csdn.net/ttgjz/article/details/2960451)

[java 提高篇(五)-----抽象类与接口](http://www.cnblogs.com/chenssy/p/3376708.html)