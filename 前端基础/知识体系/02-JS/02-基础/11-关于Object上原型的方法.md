# Object 关于原型的方法



JavaScript 中与原型（prototype） 操作直接相关的 Object 上的方法，主要分为两类：

- 静态方法（直接挂在 Object 上调用）：用于读取、设置、创建对象的原型

- 实例方法（挂在 Object.prototype 上）：用于判断属性归属（间接与原型链相关）




一、核心原型操作方法（必掌握）

## Object.create

```js

Object.create(prototype[, propertiesObject])

```

创建一个新对象，并指定这个新对象的 [[Prototype]]（原型）为第一个参数；第二个参数可选，用于给新对象定义自有属性（和 Object.defineProperties 格式一致）。


核心场景： 
- ES5 实现原型链继承（替代 Child.prototype = new Parent()）；

- 干净创建 “纯原型对象”（无多余自有属性）


```js

// 1. 基础用法：指定原型创建对象
const parent = { 
  name: '父对象', 
  say() {
    console.log(this.name)
  }
};
const child = Object.create(parent);
console.log(child.__proto__ === parent); // true
child.say(); // 父对象（继承原型方法）

// 2. 带属性配置的用法（第二个参数）
const child2 = Object.create(parent, {
  age: {
    value: 18,
    writable: true, // 可修改
    enumerable: true // 可枚举
  }
});
console.log(child2.age); // 18


```


## Object.getPrototypeOf(obj)


获取指定对象的原型（[[Prototype]]），返回该原型对象（等价于 `obj.__proto__`，但这是官方标准方法）。


核心场景：

- 检查对象的原型链指向；

- 验证继承关系。

```js

const arr = [1,2,3];
// 获取数组实例的原型（即 Array.prototype）
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true

// 获取原型的原型（最终到 Object.prototype）
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype); // true

```


## Object.setPrototypeOf(obj, prototype)


设置指定对象的原型（[[Prototype]]） 为第二个参数（可以是对象或 null），返回修改后的对象。


核心场景：

- 动态修改对象的原型链；

- ES5 模拟 extends 的静态继承（`Child.__proto__ = Parent`）。


```js

const obj = { a: 1 };
const newProto = { 
  b: 2, 
  say() { 
    console.log(this.b)
  }
};

// 设置 obj 的原型为 newProto
Object.setPrototypeOf(obj, newProto);
console.log(obj.__proto__ === newProto); // true
obj.say(); // 2

// 注意：性能提示——尽量避免频繁修改已有对象的原型（影响V8优化）

```

## Object.prototype.isPrototypeOf(obj)

这个方法在 Object.prototype 上（不是 Object 构造函数），但核心是判断原型关系，必须一起掌握。


判断当前对象是否存在于目标对象的原型链上（注意：不是仅判断直接原型）。

核心场景：

- 替代 instanceof 更灵活地判断原型链；

- 验证 “某对象是否是另一对象的原型（包括间接原型）”。


```js

const parent = {};
const child = Object.create(parent);
const grandChild = Object.create(child);

// parent 是 child 的直接原型
console.log(parent.isPrototypeOf(child)); // true
// parent 是 grandChild 的间接原型（原型链上）
console.log(parent.isPrototypeOf(grandChild)); // true
// Object.prototype 是所有对象的原型
console.log(Object.prototype.isPrototypeOf(grandChild)); // true

```


## Object.hasOwn(obj, prop)

判断指定属性是否是对象的自有属性（而非从原型链继承的属性），返回布尔值。




核心场景： 

- 遍历对象时过滤原型链继承的属性；

- 避免使用 obj.hasOwnProperty（可能被对象自身覆盖）。


```js

const parent = { name: '父属性' };
const child = Object.create(parent, { 
    age: { 
      value: 18, 
      enumerable: true
    }
  });

// age 是 child 的自有属性
console.log(Object.hasOwn(child, 'age')); // true
// name 是从原型继承的，不是自有属性
console.log(Object.hasOwn(child, 'name')); // false

```


## 小结

- 想知道“它爹是谁” → Object.getPrototypeOf()
- 想生一个有指定爹的孩子 → Object.create()
- 想强行换爹（慎用） → Object.setPrototypeOf()
- 想知道“这个属性是不是亲生的” → hasOwnProperty()
- 想知道“某对象是不是我的后代” → isPrototypeOf()