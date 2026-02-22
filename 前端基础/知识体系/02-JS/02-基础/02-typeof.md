# typeof

## typeof 能判断哪些类型

typeof 是一元运算符，返回一个小写字符串，表示操作数的类型。它能准确判断以下 7 种类型：

- Undefined -> undefined

- Boolean -> boolean

- Number -> number  注意📢 `typeof NaN` 也是number

- String -> string

- Symbol -> symbol

- Function -> function  注意📢 `typeof class A {}` 也是 function

- BigInt -> bigint 


## typeof 判断不了的类型

- 盲区 1：null（历史遗留 Bug）

问题：typeof null 返回 'object'，但 null 是基本类型，不是对象。

解决方案：直接用 === null 判断。

```js
let a = null;
console.log(typeof a); // 'object'（错误）
console.log(a === null); // true（正确）
```

- 盲区 2：除 Function 外的所有引用类型

问题：数组、普通对象、日期、正则等引用类型，typeof 都返回 'object'，无法区分。

```js

typeof {}; // 'object'
typeof []; // 'object'
typeof new Date(); // 'object'
typeof /abc/; // 'object'

```


- 盲区 3：未声明的变量（特殊情况）

问题：如果变量未声明，typeof 不会报错，而是返回 'undefined'（这是 typeof 的安全特性）。


```js

console.log(typeof a); // 'undefined'（a 未声明，不报错）
console.log(a); // ReferenceError: a is not defined（直接访问会报错）

```


typeof 只能可靠区分 7 种原始类型 + function，剩下所有对象（包括 null）都返回 "object"，没有任何细分能力。



## 常见面试题


### typeof null 的结果是什么？

'object'，这是 JavaScript 的历史遗留 Bug（早期版本用 32 位存储类型，null 的机器码全是 0，被误判为对象），为了兼容旧代码一直没修复。

### typeof NaN 的结果是什么？

NaN（Not a Number）是 “非数字”，但它属于 Number 类型（IEEE 754 标准规定）。


### 以下代码的输出结果是什么？


```js

console.log(typeof a); // undefined
var a = 10;

// 变量提升！var a 会被提升到作用域顶部，
// 但赋值 a = 10 不会提升，所以 typeof a 执行时，
// a 已声明但未赋值，返回 'undefined'。
```

```js

let a;
console.log(typeof a);
console.log(typeof b);

// undefined undefined

// a 已声明但未赋值，typeof a 返回 'undefined'；

// b 未声明，但 typeof 有安全特性，不会报错，返回 'undefined'。


```

### 如何准确判断一个变量是数组

- Array.isArray(arr)（ES6 新增，最简洁）；

- Object.prototype.toString.call(arr) === '[object Array]'（兼容性最好）



## Object.prototype.toString.call()


```js

Object.prototype.toString.call(null)          // "[object Null]"
Object.prototype.toString.call(undefined)     // "[object Undefined]"
Object.prototype.toString.call(123)           // "[object Number]"
Object.prototype.toString.call("abc")         // "[object String]"
Object.prototype.toString.call(true)          // "[object Boolean]"
Object.prototype.toString.call({})            // "[object Object]"
Object.prototype.toString.call([])            // "[object Array]"
Object.prototype.toString.call(new Date())    // "[object Date]"
Object.prototype.toString.call(/abc/)         // "[object RegExp]"
Object.prototype.toString.call(new Map())     // "[object Map]"
Object.prototype.toString.call(new Set())     // "[object Set]"
Object.prototype.toString.call(function(){})  // "[object Function]"


```


每个对象都有一个内部属性 `[[Class]]`，这个 `[[Class]]` 是引擎在对象（包括基本类型的包装对象）创建时硬编码进去的，不可修改，不受原型链影响，所以非常可靠。



`Object.prototype.toString` 的作用：`读取 [[Class]]`，**`Object.prototype.toString` 是 JavaScript 原生的一个方法，它的唯一作用就是：**

- 读取 this 指向的对象的 `[[Class]]` 属性；
- 返回一个格式固定的字符串：`"[object " + [[Class]] + "]"`。

```js
// 1. 直接调用 Object.prototype.toString（此时 this 是 Object.prototype）
// "[object Object]"（因为 Object.prototype 的 [[Class]] 是 'Object'）
Object.prototype.toString(); 

// 2. 用 call 改变 this 指向到数组（此时 this 是数组，[[Class]] 是 'Array'）
Object.prototype.toString.call([]); // "[object Array]"

// 3. 用 call 改变 this 指向到 null（此时 this 是 null，[[Class]] 是 'Null'）
Object.prototype.toString.call(null); // "[object Null]"


```


## 为什么不能直接用 obj.toString()

因为很多引用类型都 “重写” 了 toString 方法，覆盖了` Object.prototype.toString` 的原始逻辑，导致我们拿不到想要的类型信息。

```js
// 数组重写了 toString：返回元素拼接的字符串
const arr = [1, 2, 3];
arr.toString(); // "1,2,3"（不是我们要的类型信息）
Object.prototype.toString.call(arr); // "[object Array]"（这才是对的）

// 函数重写了 toString：返回函数体的字符串
const fn = function() {};
fn.toString(); // "function() {}"（不是类型信息）
Object.prototype.toString.call(fn); // "[object Function]"（这才是对的）

// 日期重写了 toString：返回日期的字符串
const date = new Date();
date.toString(); // "Sun Feb 22 2026 12:00:00 GMT+0800..."（不是类型信息）
Object.prototype.toString.call(date); // "[object Date]"（这才是对的）


```



## 为什么基本类型也能用？


因为当 call 的参数是基本类型（如 100、'hello'、true）时，JavaScript 会自动把它包装成对应的对象类型（包装对象）：

- 100 → `new Number(100)（[[Class]] 是 'Number'）`；

- 'hello' → `new String('hello')（[[Class]] 是 'String'）`；

- true → `new Boolean(true)（[[Class]] 是 'Boolean'）`。


```js
Object.prototype.toString.call(100); // "[object Number]"
Object.prototype.toString.call('hello'); // "[object String]"
Object.prototype.toString.call(true); // "[object Boolean]"

```
















