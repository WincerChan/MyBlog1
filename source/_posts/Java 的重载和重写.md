---
title: Java 的重载和重写
date: 2017/06/16 17:42:39
updated: 2017/12/24 19:32:28
type: categories
categories: 文字阁
copyright: true
published: false
tags:
  - Java
  - 多态
abbrlink: af291f12
thumbnail: https://res.cloudinary.com/wincer/image/upload/v1530859113/blog/reload_and_rewrite/cover.png
---

## 重载（Overload）

重载是让类以统一的方式处理不同类型的数据的一种手段。多个同名的函数同时存在，具有不同的参数类型。最典型的应用是：构造函数。

```java
class Dog{
    public void bark(){
        System.out.println("狗可以吠叫");
    }
    public void bark(String name){
        System.out.println(name+"可以吠叫");
    }
}
```

<!-- more -->

1. 被重载的方法必须改变参数列表；
2. 被重载的方法可以改变返回类型；
3. 被重载的方法可以改变访问修饰符；
4. 被重载的方法可以声明新的或者更广的检查异常；
5. 方法能够在同一个类或子类中被重载；
6. 无法以返回值作为重载函数的区分标准。

## 重写（Override）

重写（又称“覆盖”）是子类对父类的函数的重新定义，返回值和形参都不能改变，好处在于子类可以根据需要，定义特定的行为。

重写的方法不能抛出比父类更宽泛的异常。

```java
class Animal{
    public void move(){
        System.out.println("动物可以移动");
    }
}

class Dog extends Animal{
    public void move(){
        System.out.println("狗可以跑");
    }
}

public class TestDog{
    public static void main(String args[]){
        Animal a1 = new Animal();
        Animal a2 = new Dog();		
        
        a1.move();
        a2.move();
    }
}
```

输出结果：

>动物可以移动
>
>狗可以跑

上例中，`a2` 对象被定义为 `Animal` 类型。在编译器会检查 `Animal` 类中是否有可访问的 `move()` 方法，只要其中包含 `move()`，那么就可以编译通过。在运行期，`Dog` 对象被 new 出来，并复制给 `a2` 变量，这时，JVM 明确知道 `a2` 变量指向的其实是 `Dog` 对象的引用。所以，当 `a2` 调用 `move()` 方法的时候，就会调用 `Dog` 类中定义的 `bark()` 方法。这就是所谓的动态多态性。

1. 参数列表必须完全与被重写方法相同；
2. 返回类型必须完全与被重写方法的返回类型相同；
3. 访问权限不能比父类访问权限更低；（如：父类的方法声明 public，则子类该方法声明不能为 protected。）
4. 父类的成员方法只能被它的子类重写；
5. 声明为 final 的方法不允许被重写；
6. 声明为 static 的方法不能被重写，但可以被声明；
7. 重写的方法不能抛出比被重写的方法声明更广泛的异常；
8. 构造方法不能被重写。

## 对比

|  区别  |  重载  |          重写           |
| :--: | :--: | :-------------------: |
| 参数类型 | 必须修改 |        一定不能修改         |
| 返回类型 | 可以修改 |        一定不能修改         |
|  异常  | 可以修改 | 可以减少或删除，一定不能抛出新的或更广泛的 |
| 访问权限 | 可以修改 |      一定不能做更严格的限制      |

1. 重载是一个编译时期概念，遵循「编译期绑定」，又称为编译时的多态，即在编译时根据参数变量的类型判断应该调用哪个方法。
2. 重写是一个运行时期概念，遵循「运行期绑定」，又称为运行时的多态，即在运行时根据引用变量所指向的实际对象的类型来调用方法。

