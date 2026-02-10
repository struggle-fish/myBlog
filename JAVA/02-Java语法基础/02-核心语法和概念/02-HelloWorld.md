# HelloWord 以及基础


## 开发一个java程序

- 编码 (写代码)
- 编译 (javac进行编译)
- 运行 (java工具进行运行)


![LOGO](/public/image/javapublic/1639738100464.png)


## HelloWorld 程序

```java

public class HelloWorld { // 类名
    // 快捷键 psvm / main + tab
    public static void main(String[] args) { // 主方法
        // 快捷键 sout + tab
        System.out.println("Hello World!"); // 输出语句
    }
}

```


## Java三大技术平台

- Java SE 标准版

![LOGO](/public/image/javapublic/1639722499072.png)

- Java ME 小型版

![LOGO](/public/image/javapublic/1639722609776.png)

- Java EE 企业版

![LOGO](/public/image/javapublic/1639722652087.png)



## 代码结构

- 项目 (Project)
    - 模块 (Module)
        - 包 (Package)
            - 类 (Class)


其中 `项目 , 模块, 包,` 都是**文件夹** 对类进行分类管理.


![LOGO](/public/image/javapublic/1639744035432.png)

## 注释

- 单行注释：`//` `command + /`

- 多行注释： `/*  */` `command + shift + /`

- 文档注释: `/**  */` 


## 字面量

直接写出来的人可以理解的数据,是用来表示源代码中的一个固定值, 例如: `123` , `3.14` , `"Hello"` 等等.

![LOGO](/public/image/javapublic/1639748232481.png)

## 常量和变量

常量: 程序运行中其值不会发生改变的量;

- long 数字后面加L
- float 数字后面加F
- char 字符常量 ` 用单引号，有且只有1个字符`
- boolean 布尔常量 只能有true和false两个值
- String 字符串常量 不是基本数据类型，它用双引号，凡是程序中`“”`引起来都是字符串的值。


变量: 变量名 = 变量值; 

变量就是内存中的存储空间,空间中存储的数据是可以发生改变的.
在程序中可以定义一些单词,成为变量名,用他们来存储数据,
变量名可以在程序中多次使用,并且可以改变变量的值.

`数据类型 变量名 = 变量值;`



```java
// 数据类型 变量名 = 变量值;
int age; // 变量声明
age = 18; // 变量赋值

```



## 数据类型

java 语言是强类型语言,对于每一个数据都给出了明确的类型



- 基本数据类型

    - 整数类型
        - byte
        - short
        - int
        - long
    - 浮点类型
        - float
        - double
    - 字符类型
        - char (单字符)
    - 布尔类型
        - boolean


- 引用数据类型

    - 数组 `[]`
    - 类 `class`
    - 接口 `interface`
    - 枚举 `enum`
    - 注解 `@interface`
    - 记录 `record`




## 关键字

关键字就是被 java 语言赋予了特定含义的单词

有  `51` 个关键字

`3个保留字`: `goto, const, _`

`48个关键字`: `abstract, assert, boolean, break, byte, case, catch, char, class, continue, default, do, double, else, enum, extends, final, finally, float, for, if, implements, import, instanceof, int, interface, long, native, new, null, package, private, protected, public, return, short, static, strictfp, super, switch, synchronized, this, throw, throws, transient, try , void , volatile , while`

## 标识符

标识符,自己起的名字都是标识符 ,就是各种 java 元素的`名称`,例如: 类名,方法名,变量名,包名等.

标识符的命名规则: 必须遵守的硬性规则

- 只能由字母,数字,下划线(`_`),美元符号(`$`)组成
- 不能以数字开头
- 不能使用关键字和保留字
- 不能包含空格
- 长度不限
- 区分大小写


## 三元运算符

格式: `条件 ? 表达式1 : 表达式2`

运算规则:
- 如果条件为 true, 则返回表达式1的值
- 如果条件为 false, 则返回表达式2的值



















