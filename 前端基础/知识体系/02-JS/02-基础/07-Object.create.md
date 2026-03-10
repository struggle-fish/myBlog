# Object.create

## 基本语法

`Object.create()` 是 JavaScript 中用于**创建一个新对象，并显式指定该新对象的原型**的方法。它是理解原型链继承和手动实现 new 的核心工具。它是实现原型式继承、创建纯对象、精确控制原型链的最常用方式之一


```js

Object.create(proto, propertiesObject)

// proto 新对象的原型（即新对象的 __proto__ 会指向这个值）
// propertiesObject 可选，给新对象添加属性描述符（如 writable、enumerable 等）
```





## 核心作用


Object.create(proto) 的唯一核心作用是：

创建一个空的新对象，并将这个新对象的 __proto__（隐式原型）直接指向 proto。


```js

// 1. 定义一个父对象
const parent = {
  name: 'Parent',
  sayHi: function() {
    console.log(`我是${this.name}`);
  }
};

// 2. 用 Object.create() 创建新对象 child，让 child 的原型指向 parent
const child = Object.create(parent);

// 3. 验证原型链接
console.log(child.__proto__ === parent); // true（child 的原型是 parent）

// 4. child 可以访问 parent 的属性和方法（通过原型链）
child.name = 'Child'; // 给 child 自己添加属性
child.sayHi(); // 我是Child（调用 parent 原型上的方法）

```

## 使用场景

### 实现原型式继承

ES5 继承方式之一，这是 `Object.create()` 最经典的应用场景 —— 基于现有对象创建新对象，新对象继承现有对象的属性和方法。

```js

// 父对象（不是构造函数）
const person = {
  species: '人类',
  sayHi: function() {
    console.log(`我是${this.name}`);
  }
};

// 用 Object.create() 基于 person 创建 student
const student = Object.create(person);
student.name = '张三'; // 给 student 添加自己的属性
student.grade = 3;

// student 继承了 person 的属性和方法
console.log(student.species); // 人类（来自原型）
student.sayHi(); // 我是张三（来自原型）

```

### 手动实现 new 操作符

合并创建空对象和链接原型

```js

function myNew(Constructor, ...args) {
  // 核心：用 Object.create() 直接创建一个原型已链接好的对象
  const obj = Object.create(Constructor.prototype)
  // 绑定 this 并执行构造函数
  const result = Constructor.apply(obj, args)
  // 判断返回值
  return typeof result === 'object' && result !== null ? result : obj

}

// 测试
function Person(name) {
  this.name = name;
}
Person.prototype.sayHi = function() {
  console.log(`我是${this.name}`);
};

const p = myNew(Person, '张三');
p.sayHi(); // 我是张三
console.log(p.__proto__ === Person.prototype); // true

```

### 创建一个没有原型的纯净对象

如果传入 proto 为 null，则创建的新对象没有任何原型（__proto__ 是 null），是一个 “纯净的字典对象”，不会受到 Object.prototype 上属性的干扰。

普通对象 `{}` 的原型是 Object.prototype，会继承 toString、hasOwnProperty 等方法，如果用普通对象做字典，可能会出现意外：

```js
// 普通对象做字典的问题
const obj1 = {};
console.log(obj1.toString); // [Function: toString]（继承自 Object.prototype）
// 如果不小心覆盖了原型方法，会有问题
obj1.hasOwnProperty = 'test';
console.log(obj1.hasOwnProperty); // 'test'（不是方法了）

```

用 Object.create(null) 创建纯净对象

```js

// 纯净对象：没有原型，不会继承任何属性
const obj2 = Object.create(null);
console.log(obj2.__proto__); // undefined（没有原型）
console.log(obj2.toString); // undefined（不会继承 Object.prototype 的方法）

// 完美的字典对象，不会有原型干扰
obj2.name = '张三';
obj2.age = 18;
console.log(obj2); // { name: '张三', age: 18 }

```




![LOGO](/public/image/base/ScreenShot_2026-03-05_150345_822.png)
