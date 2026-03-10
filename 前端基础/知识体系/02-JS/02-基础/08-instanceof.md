# instanceof


## 核心作用

instanceof 用于判断一个对象是否是某个构造函数的实例，者说某个对象是否出现在另一个对象的原型链上。（本质是检查该构造函数的 prototype 是否存在于这个对象的原型链上）。


Constructor.prototype 是否在 obj 的原型链上

```js
obj instanceof Constructor
// 返回 true：obj 的原型链上能找到 Constructor.prototype
```

::: code-group

```js [例子1]
[] instanceof Array             // true
{} instanceof Object            // true
new Date() instanceof Date      // true
null instanceof Object          // false
undefined instanceof Object     // false
function(){} instanceof Function // true
```

```js [例子2]

// 1. 基础用法：判断对象是否是构造函数的实例
const arr = [];
console.log(arr instanceof Array); // true（Array.prototype 在 arr 原型链上）
console.log(arr instanceof Object); // true（Object.prototype 也在 arr 原型链上）

// 2. 继承场景：子类实例也能匹配父类
function Parent() {}
function Child() {}
Child.prototype = Object.create(Parent.prototype); // 继承

const c = new Child();
console.log(c instanceof Child); // true
console.log(c instanceof Parent); // true（Parent.prototype 在 c 的原型链上）

// 3. 非对象/特殊值：返回 false
console.log(123 instanceof Number); // false（123 是基本类型，不是对象）
console.log(null instanceof Object); // false（null 没有原型链）
console.log(undefined instanceof Object); // false

```
:::

## 底层原理

从 obj 的 __proto__（隐式原型）开始，沿着原型链向上查找；如果能找到 Constructor.prototype（显式原型），返回 true；直到原型链末端（null）还没找到，返回 false。



原型链查找流程（以 arr instanceof Array 为例）


```js
arr.__proto__ → Array.prototype → 匹配成功 → 返回 true

arr.__proto__ → Array.prototype → 
Array.prototype.__proto__ → Object.prototype → 
所以 arr instanceof Object 也为 true

```

伪代码表示：

```js
function instanceof(left, right) {
   // 或者 Object.getPrototypeOf(left)
  let proto = left.__proto__         
  const prototype = right.prototype   // 目标原型对象

  while (proto !== null) {
    if (proto === prototype) {
      return true
    }
    proto = proto.__proto__
  }
  return false
}

```

## 关键点

- 查找的是原型链（__proto__），不是对象自身的属性
- 只要右边的 prototype 出现在左边的原型链上，就返回 true
- 如果左边是 null 或 undefined，直接返回 false
- instanceof 右侧必须是函数（有 prototype 属性），否则会报错
- 如果修改了构造函数的 prototype，会影响 instanceof 的结果

```js

function Person() {}
const p = new Person();
Person.prototype = {}; // 重新赋值 prototype
// false（原型链上找不到新的 Person.prototype）
console.log(p instanceof Person); 

```



## 手动实现

```js

/**
 * 手写 instanceof
 * @param {any} obj - 要判断的对象（可以是任意值）
 * @param {Function} Constructor - 构造函数
 * @returns {boolean}
 */
function myInstanceof(obj, Constructor) {
  // 1. 边界处理：
  // - 基本类型（非对象/非函数）直接返回 false
  // - Constructor 必须是函数（否则报错，和原生 instanceof 一致）
  if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
    return false;
  }
  if (typeof Constructor !== 'function') {
    throw new TypeError('Right-hand side of instanceof is not a function');
  }

  // 2. 获取构造函数的 prototype（关键：要匹配的原型）
  const constructorProto = Constructor.prototype;
  // 3. 从 obj 的 __proto__ 开始向上查找原型链
  // 等价于 obj.__proto__，更规范
  let currentProto = Object.getPrototypeOf(obj); 

  // 4. 循环查找原型链，直到 null
  while (currentProto !== null) {
    // 5. 找到匹配的 prototype，返回 true
    if (currentProto === constructorProto) {
      return true;
    }
    // 6. 没找到，继续向上找（currentProto = currentProto.__proto__）
    currentProto = Object.getPrototypeOf(currentProto);
  }

  // 7. 原型链遍历完仍未找到，返回 false
  return false;
}


// 测试 1：基础类型
console.log(myInstanceof(123, Number)); // false（原生也是 false）
console.log(myInstanceof('abc', String)); // false（原生也是 false）

// 测试 2：对象类型
const arr = [];
console.log(myInstanceof(arr, Array)); // true（原生 true）
console.log(myInstanceof(arr, Object)); // true（原生 true）

// 测试 3：继承场景
function Parent() {}
function Child() {}
Child.prototype = Object.create(Parent.prototype);
const c = new Child();
console.log(myInstanceof(c, Child)); // true
console.log(myInstanceof(c, Parent)); // true

// 测试 4：修改 prototype
function Person() {}
const p = new Person();
Person.prototype = {};
console.log(myInstanceof(p, Person)); // false（原生也是 false）

// 测试 5：特殊值
console.log(myInstanceof(null, Object)); // false
console.log(myInstanceof(undefined, Object)); // false

```





- instanceof 和 typeof 区别？

![LOGO](/public/image/base/instanceofvstypeof.png)


typeof 判断基本类型 + function，基本返回字符串

instanceof 判断对象是否是某个构造函数的实例，返回布尔值，依赖原型链





instanceof 的作用是沿着对象的原型链（proto）向上查找，看能否找到右侧构造函数的 prototype 属性。
它本质上是原型链查找，实现时就是 while 循环不断取 __proto__ 直到 null。









