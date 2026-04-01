# call / apply / bind


call 和 apply 是做什么的？

它们都是用来「改变函数的 this 指向」，并且「立即执行这个函数」的！

## 改变this 并立即执行
为什么需要改变 this 指向？

```js
// 张三有一个「自我介绍」的方法
const zhangsan = {
  name: '张三',
  sayHi: function() {
    console.log(`大家好，我是${this.name}`);
  }
};

// 李四也想「自我介绍」，但他没有这个方法
const lisi = { name: '李四' };

// 这时候就可以用 call/apply：「借」张三的方法给李四用！
zhangsan.sayHi.call(lisi); // 大家好，我是李四
zhangsan.sayHi.apply(lisi); // 大家好，我是李四
```


## call 和 apply的区别


```js

// 定义一个需要传参的函数
function introduce(gender, hobby) {
  console.log(`大家好，我是${this.name}，${gender}，喜欢${hobby}`);
}

const lisi = { name: '李四' };

// 1. call：逐个传参（逗号隔开）
introduce.call(lisi, '男', '编程'); 
// 大家好，我是李四，男，喜欢编程

// 2. apply：传一个数组
introduce.apply(lisi, ['男', '编程']); 
// 大家好，我是李四，男，喜欢编程

```

::: tip

call apply 亲兄弟，改变 this 立即执行；

call 用逗号传参数，apply 数组来传递；

借个方法给别人，用完就还不扯皮。

:::



## 2个常见场景

1. 借用数组方法处理 “类数组对象

比如 arguments（函数的参数列表）是类数组，没有数组的 push、slice 等方法，可以用 call/apply 借数组的方法：

```js

function func() {
  // arguments 是类数组，没有 push 方法
  // 借数组的 push 方法给 arguments 用
  Array.prototype.push.call(arguments, 4);
  console.log(arguments); // [1, 2, 3, 4]
}
func(1, 2, 3);


```

2. 求数组的最大值 / 最小值

`Math.max` 原本只能逐个传参，用 apply 可以直接传数组：

```js

const arr = [1, 5, 3, 9, 2];

// 不用 apply：Math.max(1,5,3,9,2)（麻烦）
// 用 apply：直接传数组
const max = Math.max.apply(null, arr); // 9
const min = Math.min.apply(null, arr); // 1

```


## 手写call

::: tip 核心原理

1. 将函数作为 thisArg（目标 this）的一个临时属性

2. 执行这个临时属性（此时函数内的 this 就是 thisArg）；

3. 传参：用扩展运算符接收逐个参数；

4. 删除临时属性，返回函数执行结果。

:::

```js

// 给 Function.prototype 添加 myCall 方法（所有函数都能调用）
Function.prototype.myCall = function(thisArg, ...args) {
  // 1. 处理边界：如果 thisArg 是 null/undefined，默认指向 window（浏览器）/global（Node）
  const context = thisArg ?? (typeof window !== 'undefined' ? window : global);
  
  // 2. 生成唯一的临时属性名（避免覆盖原有属性）
  const fnKey = Symbol('tempFn');
  
  // 3. 将当前函数（this 就是调用 myCall 的函数）挂载到 context 上
  context[fnKey] = this;
  
  // 4. 执行函数，传入参数，获取结果
  const result = context[fnKey](...args);
  
  // 5. 删除临时属性，避免污染 context
  delete context[fnKey];
  
  // 6. 返回函数执行结果
  return result;
};



// 测试用例
const person = { name: '张三' };
function sayHi(gender, hobby) {
  console.log(`我是${this.name}，${gender}，喜欢${hobby}`);
  return '执行完成';
}

// 原生 call
sayHi.call(person, '男', '编程'); // 我是张三，男，喜欢编程
// 手写 myCall
const res = sayHi.myCall(person, '男', '编程'); // 我是张三，男，喜欢编程
console.log(res); // 执行完成

// 测试边界：thisArg 为 null
sayHi.myCall(null, '女', '读书'); // 浏览器中 this 指向 window，Node 中指向 global

```




## 手写 apply

::: tip 核心原理


和 call 几乎完全一样，唯一区别：apply 接收数组 / 类数组参数，而非逐个参数。


:::


```js

// 给 Function.prototype 添加 myApply 方法
Function.prototype.myApply = function(thisArg, argsArr) {
  // 1. 处理边界：thisArg 为 null/undefined 时的默认指向
  const context = thisArg ?? (typeof window !== 'undefined' ? window : global);
  
  // 2. 生成唯一临时属性
  const fnKey = Symbol('tempFn');
  
  // 3. 挂载函数到 context
  context[fnKey] = this;
  
  // 4. 执行函数：处理参数（argsArr 可能是 undefined，需兼容）
  const result = context[fnKey](...(argsArr || []));
  
  // 5. 删除临时属性
  delete context[fnKey];
  
  // 6. 返回结果
  return result;
};


// 测试用例
const person = { name: '李四' };
function sayHi(gender, hobby) {
  console.log(`我是${this.name}，${gender}，喜欢${hobby}`);
  return '执行完成';
}

// 原生 apply
sayHi.apply(person, ['女', '跑步']); // 我是李四，女，喜欢跑步
// 手写 myApply
const res = sayHi.myApply(person, ['女', '跑步']); // 我是李四，女，喜欢跑步
console.log(res); // 执行完成

// 测试边界：无参数
sayHi.myApply(person); // 我是李四，undefined，喜欢undefined

```



## 手写 bind

::: tip 核心原理

1. bind 不立即执行函数，而是返回一个新函数；

2. 新函数执行时，this 指向传入的 thisArg；

3. 支持柯里化传参：bind 时传一部分参数，调用新函数时传另一部分；

4. 新函数可以被 new 调用（此时 this 指向新实例，而非 thisArg）。

:::


```js

// 给 Function.prototype 添加 myBind 方法
Function.prototype.myBind = function(thisArg, ...bindArgs) {
  const fn = this; // 保存原函数（调用 myBind 的函数）
  
  // 1. 返回新函数
  const boundFn = function(...callArgs) {
    // 2. 判断新函数是否被 new 调用（关键！）
    // 如果是 new 调用，this 指向新实例；否则指向 thisArg
    // this 指向：
    // 1. new 调用 → this 是新实例
    // 2. 普通调用 → this 是绑定的 thisArg
    const context = this instanceof boundFn ? this : thisArg;
    
    // 3. 执行原函数：合并 bind 时的参数和调用时的参数
    return fn.apply(context, [...bindArgs, ...callArgs]);
  };
  
  // 4. 继承原函数的原型（保证 new 调用时，实例能访问原函数原型的方法）
  boundFn.prototype = Object.create(fn.prototype);
  boundFn.prototype.constructor = boundFn;
  
  return boundFn;
};




// 测试用例 1：基础用法（柯里化传参）
const person = { name: '王五' };
function sayHi(gender, hobby) {
  console.log(`我是${this.name}，${gender}，喜欢${hobby}`);
  return '执行完成';
}

// 原生 bind
const boundSayHi = sayHi.bind(person, '男');
boundSayHi('游泳'); // 我是王五，男，喜欢游泳
// 手写 myBind
const myBoundSayHi = sayHi.myBind(person, '男');
const res = myBoundSayHi('游泳'); // 我是王五，男，喜欢游泳
console.log(res); // 执行完成

// 测试用例 2：new 调用绑定后的函数（关键边界）
function Person(name, age) {
  this.name = name;
  this.age = age;
}
// 绑定 this 为 window，但 new 调用时 this 指向新实例
const BoundPerson = Person.myBind(window, '赵六');
const p = new BoundPerson(20);
console.log(p.name); // 赵六（参数合并正确）
console.log(p.age); // 20
console.log(p instanceof Person); // true（原型继承正确）

```


```js

Function.prototype.bind1 = function() {
  // 将参数拆解为数组
  const args = Array.prototype.slice.call(arguments);

  // 获取 this (数组第一项)
  const t = args.shift()

  // fn1.bind() 中的fn1
  const self = this

  // 返回一个函数
  return function() {
    return self.apply(t, args)
  }
}


function fn1(a, b, c) {
  console.log('this', this)
  console.log(a, b, c)
  return 'this is fn1'
}
const fn2 = fn1.bind1({ x:100 }, 10, 20 ,30)
const res = fn2()
console.log(res)

```


bind 是柯里化的典型应用

```js

const person = { name: '张三' };
function sayHi(gender, hobby) {
  console.log(`我是${this.name}，${gender}，喜欢${hobby}`);
}

// 第一步：bind 时传 this 和第一个参数（gender）
const boundSayHi = sayHi.bind(person, '男');

// 第二步：调用新函数时传第二个参数（hobby）
boundSayHi('编程'); // 我是张三，男，喜欢编程

```

bind 的柯里化逻辑：

1. `bind(person, '男')`：传了 this 和第一个参数 gender，返回新函数（延迟执行，不立即调用 sayHi）；

2. `boundSayHi('编程')`：传第二个参数 hobby，参数传完，执行 sayHi 并合并所有参数





## 柯里化

### 什么是柯里化

把接收多个参数的函数，转换成一系列只接收单个参数的函数，并且可以分步传参、延迟执行。

普通函数是 “一口吃”（一次性传所有参数），柯里化函数是 “小口吃”（分步传参，每传一次参数就返回新函数，直到参数传完才执行）。

1. “非柯里化” vs “柯里化”


```js
// 普通函数（非柯里化）：一次性传所有参数
// 计算 a + b + c
function add(a, b, c) {
  return a + b + c;
}

// 必须一次性传完所有参数
add(1, 2, 3); // 6

```

```js

// 分步传参，每一步传一个（或多个）参数

// 柯里化后的 add 函数
function curriedAdd(a) {
  return function(b) {
    return function(c) {
      return a + b + c;
    };
  };
}

// 分步传参（核心！）
const add1 = curriedAdd(1); // 传第一个参数，返回新函数
const add1And2 = add1(2); // 传第二个参数，返回新函数
const result = add1And2(3); // 传第三个参数，执行并返回结果
console.log(result); // 6

// 也可以链式调用（一步传完）
curriedAdd(1)(2)(3); // 6

```




### 柯里化的核心特性

柯里化的本质：收集参数，凑够原函数的参数个数就执行，没凑够就继续收集。

1. 分步传参（最核心）

参数可以分多次传递，每传一次参数就返回一个新函数，直到参数全部传完才执行核心逻辑。

```js

// 柯里化 add：支持“传 1 个”“传 2 个”“传 3 个”参数
function curriedAdd(a, b, c) {
  // 如果参数没传完，返回新函数；传完则执行
  if (arguments.length < 3) {
    return function(...args) {
      return curriedAdd(...[a, b, c].filter(Boolean), ...args);
    };
  }
  return a + b + c;
}

// 传 1 个参数：返回新函数
const add1 = curriedAdd(1);
// 传 2 个参数：返回新函数
// 这里多传一个也没关系，柯里化不强制“单参数”
const add1And2 = add1(2, 0); 
// 传最后 1 个参数：执行并返回结果
add1And2(3); // 6

// 也可以混合传参
curriedAdd(1)(2, 3); // 6
curriedAdd(1, 2)(3); // 6



```


2. 延迟执行

函数不会在传第一个 / 第二个参数时执行，只会在参数全部传完时执行核心逻辑（比如加法、生成结果）。


3. 参数复用（柯里化的核心价值）

如果某个参数在多次调用中都相同，可以提前传这个参数，复用 “部分传参后的函数”。

```js

// 场景：计算商品总价 = 数量 * 单价
function calculatePrice(count, price) {
  return count * price;
}

// 柯里化后
const curriedCalculate = (price) => (count) => count * price;

// 复用“单价 10 元”的函数（比如苹果单价固定 10 元）
const calculateApplePrice = curriedCalculate(10);

// 后续只需要传数量，不用重复传单价
calculateApplePrice(5); // 50（5个苹果）
calculateApplePrice(8); // 80（8个苹果）
calculateApplePrice(10); // 100（10个苹果）

// 这里提前传了 “单价 10 元”，后续调用只需要传数量，
// 避免了重复传相同的参数 —— 这就是柯里化的参数复用价值。

```

## 手写柯里化


```js

/**
 * 通用柯里化函数
 * @param {Function} fn - 要柯里化的原函数
 * @returns {Function} 柯里化后的函数
 */
function curry(fn) {
  // 保存原函数的参数个数
  const fnArgLength = fn.length;
  
  // 递归函数：收集参数
  // curried是核心：负责收集参数、判断是否执行原函数
  const curried = function(...args) {
    // 1. 如果收集的参数 >= 原函数需要的参数，执行原函数
    if (args.length >= fnArgLength) {
       // 够了 → 执行原函数，把收集的参数传进去
      return fn.apply(this, args);
    }
    // 2. 如果参数不够，返回新函数，继续收集参数
    return function(...newArgs) {
      // 合并已有参数和新参数，递归调用curried
      return curried.apply(this, [...args, ...newArgs]);
    };
  };
  
  return curried;
}

// 测试：给普通 add 函数柯里化
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);

// 各种传参方式都支持
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6


```


## 应用场景

1. 参数复用（最常用）

比如接口请求中，固定 baseUrl，后续只传接口路径：

```js

// 普通请求函数
function request(baseUrl, path, method) {
  console.log(`${method} ${baseUrl}${path}`);
}

// 柯里化后，固定 baseUrl
const curriedRequest = curry(request);
const apiRequest = curriedRequest('https://api.example.com');

// 后续只需要传 path 和 method，不用重复传 baseUrl
apiRequest('/user', 'GET'); // GET https://api.example.com/user
apiRequest('/order', 'POST'); // POST https://api.example.com/order

```

2. 延迟执行（比如 bind、事件绑定）

```js

// 场景：给按钮绑定点击事件，提前传部分参数
const btnClick = (name, e) => {
  console.log(`${name} 点击了按钮，事件对象：`, e);
};

// 柯里化后，提前传 name 参数，延迟到点击时传 e
const curriedClick = curry(btnClick);
const zhangsanClick = curriedClick('张三');

// 绑定事件：点击时只需要传 e 参数即可
document.querySelector('button').addEventListener('click', zhangsanClick);

```


3. 函数式编程（组合函数）

柯里化是函数式编程的基础，比如结合 map/filter 实现更简洁的逻辑：

```js

// 柯里化的乘法函数
const multiply = curry((a, b) => a * b);
const double = multiply(2); // 固定乘以 2

// 给数组每个元素乘以 2
const arr = [1, 2, 3];
const doubledArr = arr.map(double); // [2, 4, 6]

```







