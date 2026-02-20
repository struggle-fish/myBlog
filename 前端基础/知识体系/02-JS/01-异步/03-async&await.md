# async / await

## 是什么

**async/await** 是 ES2017（ES8）引入的 异步编程的语法糖，用来用**同步写法**写异步逻辑，避免 Promise 的 `.then` 链。让异步代码看起来像同步代码，极大提高可读性，同时保留了 Promise 的所有能力


::: code-group

```js [Promise + then]
// Promise + then 链式写法
fetchData()
  .then(data => process(data))
  .then(result => save(result))
  .catch(err => handleError(err));

```

```js [async + await]

// async/await 写法（推荐）
async function main() {
  try {
    const data   = await fetchData();
    const result = await process(data);
    await save(result);
  } catch (err) {
    handleError(err);
  }
}

```

:::



## 本质是什么

- `async` 关键字：标在函数前，函数**一定返回 Promise**；若 return 非 Promise，会被 `Promise.resolve()` 包一层。
- `await` 关键字：只能写在 async 函数里；后面跟一个 Promise（或 thenable），**暂停当前 async 函数**，等该 Promise 完成后才继续，并把结果当作表达式的值。


## 最核心的几句话

async/await 的底层实现完全依赖 **`Promise + Generator 函数 + 状态机`**（或者更现代的实现是直接用 Promise 的微任务调度）。


实现方式大致是：

- 把 `async function` 转换成一个 状态机（内部是一个 Generator 函数的变种）

- 每次遇到 `await`，就把后面的表达式当作一个 `Promise`

- 把后续的代码注册为这个` Promise` 的 `.then` 回调

- 当前 async 函数立即返回一个 Promise（外部拿到的那个）

- 当 await 的 Promise 完成时，通过微任务调度继续执行后面的代码（从上一次暂停的地方继续）

用最直白的话说：**`await 其实就是“把后面的代码包成 then 回调，然后把自己挂起”的语法糖`**


:::tip

async/await = Generator + Promise 的语法糖 + 更优雅的状态机调度

- async 函数返回 Promise
- await = 暂停 + 订阅 Promise 的 then
- 底层靠微任务（queueMicrotask）驱动状态机继续执行
:::

## 原理简述

1. **async 函数**：被调用时同步执行到第一个 `await`（或 return），然后返回一个 Promise；该 Promise 的 resolve/reject 由函数内所有 await 和 return 的结果决定。
2. **await 表达式**：`await p` 会：
   - 把 `p` 转成 Promise（`Promise.resolve(p)`）；
   - 在 then 里把「当前 async 函数从 await 之后继续执行」的逻辑挂上去（相当于把后续代码包成微任务）；
   - 所以 await 之后的代码相当于放在 `p.then(...)` 里执行，这就是「看起来同步、实际是异步」的原因。


## 如何理解 await

await 后面必须跟一个 Promise（或 thenable），它会暂停当前 async 函数的执行，直到这个 Promise 完成（resolve 或 reject）


当前 async 函数的执行上下文被暂时“挂起”（suspended），函数体不再继续向下执行，控制权立刻返回给调用者（通常是事件循环），直到 Promise 完成后再通过微任务重新“恢复”（resume）执行。

这是一种协程式（coroutine-like）的暂停，非常轻量，几乎不消耗 CPU。


到底是怎么实现的？

![LOGO](/public/image/base/ScreenShot_2026-02-17_205358_633.png)

现代 V8 最主流的实现方式是：

1. async 函数被标记为 “resumable” 函数
    - 引擎在编译时就知道这个函数会在某些点（await）被暂停和恢复
    - 函数内部被编译成带有多个“恢复点”的状态机（类似 switch-case 的结构）

2. 遇到 await 时发生了什么（核心步骤）

```js

async function example() {
  console.log("A")
  const x = await fetchSomething()   // ← 这里
  console.log("B", x)
}

```

当代码运行到 await 这一行时，引擎大致做这些事：

  - 计算 await 后面的表达式（这里是 `fetchSomething()`，得到一个 Promise）
  - 如果 Promise 已经 resolved → 直接取值，继续执行（几乎不暂停）
  - 如果 Promise 还是 pending：
    - 保存当前执行上下文（寄存器、局部变量、作用域、this、try-catch 状态、当前字节码位置等） → 存到一个叫 AsyncFunctionContext 或类似的对象里
    - 把后续代码的“恢复逻辑”注册为 then/catch 回调
      - 成功时：恢复上下文 → 把 resolved 值赋给 x → 从 "B" 那行继续执行
      - 失败时：恢复上下文 → 在 await 位置 throw 出 reject 的原因
    - 立即从当前函数返回（return 到上层调用者，通常回到事件循环）
    - 当前 async 函数的 implicit_promise（就是你调用 `example()` 拿到的那个 Promise）暂时不 resolve

3. Promise 完成后怎么继续？

    - Promise 内部 `resolve(value)` 或 `reject(reason)` 时
    - 会把之前注册的 then/catch 回调 推入 微任务队列（microtask queue）
    - 事件循环执行完当前宏任务 → 清空微任务队列时
    - 取出刚才的回调 → 恢复（resume） 刚才保存的上下文
    - 从 await 下一行继续执行（带着正确的值或抛出错误）


4. 最形象的比喻

await 就像在函数里突然插了个“存档点 + 退出到大厅”,等到 Promise 完成 → 游戏从存档点读档，继续玩（值已经准备好）


5. 对比 Generator 的老实现（帮助理解概念）

老方式（Babel 早期、co 库）：

```js

function* gen() {
  console.log("A")
  const x = yield fetchSomething()   // yield 暂停
  console.log("B", x)
}

```

- yield 会真的把控制权完全交出去
- 下次 next(value) 才能带着值回来继续
- async/await 本质上是把这种模式自动化了 + 优化了`（不用手写 * 和 yield）`

现代引擎已经把这个过程内置到字节码层面，不再走 Generator 对象，性能更好、内存占用更低。

::: tip

“暂停” = 保存函数状态 + 注册 then 回调 + 立刻返回控制权给事件循环

恢复 = 微任务中读档 + 从 await 下一行继续执行

:::






## await + 不同值



![LOGO](/public/image/base/ScreenShot_2026-02-20_092132_347.png)


```js

async function test() {
  console.log("1 开始");

  // 情况1：普通值（非 Promise）
  const a = await 100;
  console.log("2 a =", a);           // 立即（微任务）得到 100

  // 情况2：已经 fulfilled 的 Promise
  const b = await Promise.resolve("已完成");
  console.log("3 b =", b);           // 立即（微任务）得到 "已完成"

  // 情况3：已经 rejected 的 Promise
  try {
    const c = await Promise.reject("出错了！");
    console.log("4 c =", c);         // 永远不会执行
  } catch (err) {
    console.log("5 捕获到错误:", err);   // 立即（微任务）打印 "出错了！"
  }

  // 情况4：pending 的 Promise
  console.log("6 准备等 1 秒...");
  const d = await new Promise(resolve => {
    setTimeout(() => {
      resolve("等到了！");
    }, 1000);
  });
  console.log("7 d =", d);           // 1秒后（微任务）打印

  // 情况5：thenable 对象
  const thenable = {
    then(resolve) {
      setTimeout(() => resolve("我是 thenable"), 500);
    }
  };
  const e = await thenable;
  console.log("8 e =", e);           // 500ms 后得到

  console.log("9 全部结束");
}

console.log("同步开始");
test().catch(err => console.log("顶层捕获:", err));
console.log("同步结束");




```



![LOGO](/public/image/base/ScreenShot_2026-02-20_092355_287.png)


::: tip

最容易错的两个点（很多人踩坑）

- 即使 await 一个已经完成的 Promise，后续代码也仍然是微任务，不是同步继续！
所以 `await Promise.resolve(1); console.log(2)` 中的 2 永远比外面的同步代码晚打印。

- `await Promise.reject()` 会直接 throw
不会返回 rejected 的 Promise 给你，而是直接中断函数，进入 catch 块（或顶层 unhandled rejection）。


:::



## 手写实现（用 Generator + 自动执行器模拟）

async/await 与「Generator + 自动执行器」等价，下面用 Generator 模拟「按顺序 await 多个 Promise」的效果。是最经典的 co 库 / spawn 函数 的核心逻辑，也是 Babel 早期转译 async/await 的主要方式

```js
// 极简版：把 async/await 转换成 Promise + Generator 的样子

function spawn(genFn) {
  return new Promise((resolve, reject) => {
    const iterator = genFn();// 执行生成器，得到迭代器

    function step(nextFn) {
      let next;
      try {
        next = nextFn(); // 执行 next() → {value, done}
      } catch (e) {
        return reject(e);
      }

      const { value, done } = next;

      if (done) {
        // 生成器跑完了
        return resolve(value);
      }

      // value 应该是一个 Promise（这就是 await 后面的东西）
      Promise.resolve(value) // 兼容普通值
        .then(
          // yield 负责 “等 Promise”，
          // then 里的 next(res) 负责 “把 Promise 的结果塞回给变量”～
          res => step(() => iterator.next(res)),// 成功 → 继续下一个 yield
          err => step(() => iterator.throw(err))// 失败 → throw 进生成器
        );
    }

    step(() => iterator.next(undefined));  // 启动
  });
}


// 使用方式（模拟 async function）
function fakeAsync() {
  return spawn(function* () {
    const a = yield Promise.resolve(100);
    console.log(a);

    const b = yield new Promise(r => setTimeout(() => r(200), 1000));
    console.log(b);

    const c = yield 300;   // 普通值也会被包装
    console.log(c);

    return a + b + c;
  });
}

fakeAsync()
  .then(result => console.log("最终结果:", result))
  .catch(err => console.error(err));

```

要点：
- **Generator**：`yield promise` 暂停，把 promise 交给外面；外面用 `iterator.next(value)` 把结果塞回 generator，并恢复执行。
- **spawn**：不断 `iterator.next()` 取到 `{ value, done }`，把 `value` 用 `Promise.resolve` 包一层，then 里用结果再调 `iterator.next(v)` 或 `iterator.throw(e)`，实现「等 Promise 完成再继续」。
- 这样 **yield** 就相当于 **await**，**spawn(gen)** 就相当于**调用一个 async 函数**（返回 Promise）。


## 调用栈解读

```js

function fakeAsync() {
  return spawn(function* () {             // 生成器函数
    const a = yield Promise.resolve(100); // yield 1
    console.log(a);                       // → 100

    const b = yield new Promise(r => 
      setTimeout(() => r(200), 1000)
    );                                    // yield 2
    console.log(b);                       // → 200（1秒后）

    const c = yield 300;                  // yield 3
    console.log(c);                       // → 300

    return a + b + c;                    // → 600
  });
}

fakeAsync().then(result => 
  console.log("最终结果:", result)
);


```

### 调用栈拆解（重点关注 step 函数）


::: code-group

```js [第0步]

fakeAsync()
  ↓
spawn(genFn)
  ↓
const iterator = genFn();            // 创建生成器，函数体未执行
  ↓
step(() => iterator.next(undefined)) // ← 第1次 step 调用

```

```js [步骤 1]
步骤 1：第1次 step 执行（同步）

调用栈：
- step( () => iterator.next(undefined) )

执行：
- next() → 执行到第一个 yield
- 得到：{ value: Promise.resolve(100), done: false }
- Promise.resolve(100) 是已 resolved 的 Promise
- 注册 then：
    .then(res => step(() => iterator.next(100)) )

→ 函数执行到末尾，**立即 return**（调用栈弹出）
→ 当前调用栈：清空
```

```js [步骤 2]
微任务立即触发（Promise.resolve(100) 已完成）

调用栈：
- then回调 → step( () => iterator.next(100) )  ← 第2次 step

执行：
- iterator.next(100) → 把 100 赋给 const a
- console.log(100) 打印
- 执行到第2个 yield
- 得到：{ value: Promise<pending> (setTimeout 1000ms), done: false }
- 注册 then：
    .then(res => step(() => iterator.next(res)) )

→ 函数执行完，**立即 return**（调用栈再次弹出）

→ 当前调用栈：清空
```

```js [步骤 3]
1秒后（宏任务 setTimeout 触发 → Promise resolve → 微任务）

调用栈：
- setTimeout 回调 → Promise resolve(200)
  ↓（推入微任务队列）
- then回调 → step( () => iterator.next(200) )   ← 第3次 step

执行：
- iterator.next(200) → 把 200 赋给 const b
- console.log(200) 打印
- 执行到第3个 yield
- 得到：{ value: 300, done: false }
- Promise.resolve(300)（同步）
- 注册 then：
    .then(res => step(() => iterator.next(300)) )

→ 函数执行完，**立即 return**（调用栈弹出）

→ 当前调用栈：清空

```


```js [步骤 4]
微任务立即触发（Promise.resolve(300) 已完成）

调用栈：
- then回调 → step( () => iterator.next(300) )   ← 第4次 step

执行：
- iterator.next(300) → 把 300 赋给 const c
- console.log(300) 打印
- 执行到 return a + b + c
- 得到：{ value: 600, done: true }

if (done) {
  return resolve(600);   // ← spawn 的 Promise 被 resolve
}

→ 函数结束

→ 当前调用栈：清空

```



```js [步骤 5]
最终 then 执行

fakeAsync().then(result => console.log("最终结果:", result))
→ 打印：最终结果: 600

```
:::


最关键的 3 点总结（看懂这 3 点就彻底明白）

- 每次 step 最多只压 1 层栈
`进入 step → 干一点活 → 注册 .then → 立刻结束 → 栈弹出`
- 下一次 step 是全新的调用，栈深度永远 ≤ 3`（fakeAsync → spawn → step）`
“立即 return” 的精确位置
就是 `Promise.resolve(value).then(...)` 这行语句执行完毕之后，

- step 函数体已经没有代码了 → JavaScript 自动 return → 栈弹出

真正的“递归”其实是异步的
看起来是 step 调用 step，但每次调用之间隔着微任务
栈永远不会累积成 100 层、1000 层


形象比喻
**step 就像一个快递小哥：**
- 每次只送一站 → 登记“下一站地址”（then 回调）→ 立刻回去休息
- 等客户签收（Promise resolve）→ 再派一个新的小哥继续送下一站
- 所以你看到的所有 step 调用，都是“新小哥”，不是同一个小哥越走越深。

这样你就完全能看到：
**调用栈永远很浅，真正驱动流程的是微任务队列 + then 回调。**


::: tip

每次调用 `.next()`，生成器就从上次暂停的地方继续跑，直到下一个 yield / return / 函数结束，然后再次暂停，并把 yield 后面的值（或 return 值）包装成 `{value, done}` 返回。
:::


## 现代引擎模拟

现在的 V8 引擎已经不完全依赖 Generator，而是直接生成了类似下面的内部代码结构：
JavaScript

```js

// 伪代码：V8 内部大概长这样
function asyncFunction() {
  let __this = this;
  let __state = 0;   // 状态机变量
  let __result;

  const promise = new Promise((res, rej) => {
    __this._resolve = res;
    __this._reject  = rej;
  });

  // 立刻启动微任务
  queueMicrotask(() => {
    try {
      outer: while (true) {
        switch (__state) {
          case 0:
            // 第一段代码
            __result = somePromise();
            __state = 1;
            // 遇到 await → 挂起，注册 then
            __result.then(
              v => { __result = v; continue outer; },
              e => { __state = "error"; __result = e; continue outer; }
            );
            return;  // 挂起

          case 1:
            // await 完成，继续执行
            console.log(__result);
            __state = 2;
            break;

          // ... 更多状态

          default:
            __this._resolve(__result);
            return;
        }
      }
    } catch (e) {
      __this._reject(e);
    }
  });

  return promise;
}



```















## Generator 


Generator 函数是 ES6 引入的一种异步编程解决方案，也是一种**状态机**，内部封装了多个状态。它最大的特点是**可以暂停执行，又可以恢复执行**，这使得它非常适合处理异步操作、控制流管理等场景。

### 核心概念

- `function* `声明：Generator 函数通过 function* 关键字定义（注意星号位置，通常紧跟 function）。

- yield 表达式：函数内部使用 yield 关键字来暂停执行，并返回一个值。

- 迭代器对象：调用 Generator 函数不会立即执行，而是返回一个迭代器对象（Iterator）。

- `next()` 方法：通过调用迭代器的 `next()` 方法，函数会从上次暂停的地方继续执行，直到遇到下一个  `yield 或 return`。



``` js

function* myGenerator() {
  console.log('第一步');
  yield '第一个结果'; 
  
  console.log('第二步');
  yield '第二个结果'; 
  
  console.log('第三步');
  return '结束'; 
}

// 1. 调用 Generator 函数，此时函数**不会执行**，只返回一个迭代器对象
const gen = myGenerator(); 

// 2. 第一次调用 next()
console.log(gen.next()); 
// 输出：
// 第一步
// { value: '第一个结果', done: false }

// 3. 第二次调用 next()
console.log(gen.next()); 
// 输出：
// 第二步
// { value: '第二个结果', done: false }

// 4. 第三次调用 next()
console.log(gen.next()); 
// 输出：
// 第三步
// { value: '结束', done: true }

// 5. 后续调用 next()
console.log(gen.next()); 
// 输出：
// { value: undefined, done: true }

```


- **暂停与恢复**：yield 是暂停点，`next()` 是恢复执行的触发器。

- 状态记忆：Generator 函数能记住上次执行的位置，下次从那里继续 即 **「分段执行」**。

- **双向通信：**
  - `next()` 可以传参数，参数会作为上一个 yield 表达式的返回值。
  - yield 表达式本身有一个「返回值」—— 这个返回值不是 yield 后面跟着的那个值，而是下一次 `next()` 传入的参数。
  - 例如：`gen.next(100)`，这个 100 会传给上一个 yield。


### next 传参


Generator 函数的执行是「分段执行」的：

- 每次 `next()` 会让函数从上次暂停的位置继续，直到遇到下一个` yield 或 return`。

- yield 表达式本身有一个「返回值」——  **这个返回值不是 yield 后面跟着的那个值，而是下一次 next() 传入的参数**。


```js

function* myGen() {
  console.log('开始执行');
  
  // 第1个 yield：先返回 10，然后暂停
  // 注意：这里的 x 要等下一次 next() 传参才会被赋值
  let x = yield 10; 
  console.log('x 的值是：', x);
  
  // 第2个 yield：先返回 20，然后暂停
  let y = yield 20; 
  console.log('y 的值是：', y);
  
  return x + y;
}

```

### next 执行过程

我们分 4 次调用 `next()`，仔细看每一步的变化：

1. 第一次调用： `const g = myGen(); g.next()`
    - 函数开始执行，打印 '开始执行'。
    - 遇到 yield 10：
      - 先把 10 作为 `next()` 的返回值（即 `{ value: 10, done: false }`）。
      - 然后暂停执行—— 注意：此时 `let x = ...` **只执行了一半，x 还没被赋值！**
    - 结果：返回 `{ value: 10, done: false }`

2. 第二次调用：`g.next(100)`

    - 重点来了：从上次暂停的 `yield 10 `处继续执行。
    - 此时，`yield 10 `这个表达式需要一个「返回值」—— 这个返回值就是本次 `next() `传入的 100。
    - 于是：`x = 100`（x 终于被赋值了！）。
    - 继续执行，打印 'x 的值是：100'。
    - 遇到 yield 20：
      - 返回 `{ value: 20, done: false }`。
      - 再次暂停，y 还没被赋值。
    - 结果：返回 `{ value: 20, done: false }`。

3. 第三次调用：`g.next(200)`
    
    - 从上次暂停的 yield 20 处继续执行。
    - yield 20 的返回值是本次传入的 200，于是：`y = 200`。
    - 继续执行，打印 'y 的值是：200'。
    - 遇到 `return x + y`：计算 100 + 200 = 300。
    - 结果：返回 `{ value: 300, done: true }`。

4. 第四次调用：`g.next()`

    - 函数已经执行完毕，直接返回 `{ value: undefined, done: true }`。


::: tip

为什么是「上一个」？

- 当你调用 `next(参数)` 时，函数是从上一次暂停的那个 yield 之后继续执行的。

- 上一次的 yield 表达式虽然已经「暂停」，但它还没完成「给变量赋值」的动作 —— 这个赋值需要一个「返回值」，而这个返回值就是当前` next()`传入的参数。

简单说：上一个 yield 是「坑」，当前 `next() `的参数是「填坑的土」。

`next ()` 可以传参数，参数会作为上一个 yield 表达式的返回值

:::


::: tip 注意

第一次 `next()` 传参没用

注意：第一次调用 `next() `时，因为之前没有「暂停的 yield」，所以传参是无效的。比如：

```js
const g = myGen();
g.next(500); // 这里的 500 会被忽略，因为没有上一个 yield 需要返回值

```
:::


### 在一个例子

``` js

function* gen() {
  console.log("开始")
  yield 1
  console.log("中间")
  yield 2
  console.log("结束")
  return 3
}

const g = gen()  // ← 这里什么都没打印！
console.log(g)  // Generator {<suspended>}
// 这个 g 就是“暂停的函数执行上下文的句柄”。
```

普通函数调用时立刻执行函数体。

**Generator 函数（带 `*`）调用时 不会立刻执行函数体**，而是立刻返回一个特殊的对象 → **Generator 对象（也叫迭代器 iterator）。**




![LOGO](/public/image/base/ScreenShot_2026-02-17_210737_308.png)


::: tip
每次调用 `.next()`，生成器就从上次暂停的地方继续跑，直到下一个 yield / return / 函数结束，然后再次暂停，并把 yield 后面的值（或 return 值）包装成 {value, done} 返回。
:::


带图的执行流程:


```text

时间线：

0ms   const g = gen()                  → 返回 Generator 对象，函数体还没跑
      状态：suspended（挂起），代码指针在函数开头

10ms  g.next() 第一次
      → 执行 console.log("开始")
      → 遇到 yield 1
      → 保存当前状态（局部变量、作用域链、try-catch 栈等）
      → 暂停函数
      → 返回 { value: 1, done: false }

20ms  g.next() 第二次
      → 恢复刚才保存的状态
      → 继续执行（从 yield 1 后面开始）
      → console.log("中间")
      → 遇到 yield 2
      → 再次保存状态
      → 暂停
      → 返回 { value: 2, done: false }

30ms  g.next() 第三次
      → 恢复
      → console.log("结束")
      → 遇到 return 3（或函数自然结束）
      → 返回 { value: 3, done: true }
      → 生成器进入 closed 状态

40ms  g.next() 第四次及以后
      → 直接返回 { value: undefined, done: true }

```


next 可以带参数:


```js

function* twoWay() {
  const a = yield "先给你 A"
  console.log("收到外面传的 →", a)

  const b = yield "再给你 B"
  console.log("收到 →", b)

  return "结束啦"
}

const g = twoWay()

console.log(g.next())     
// { value: "先给你 A", done: false }

console.log(g.next(100))  
// 打印：收到外面传的 → 100
// { value: "再给你 B", done: false }

console.log(g.next(200))  
// 打印：收到 → 200
// { value: "结束啦", done: true }

```

规律：

第一次 `next()`不能传值（传了也没用），永远是 undefined 启动

之后的 `next(值)` 会把这个“值”作为上一个 yield 表达式的返回值


::: tip 双向通信
为什么是双向通信？

普通函数只能单向：
- 外面调用函数 → 函数只能 return 一个值给外面。

Generator 可以来回传：

- 外面随时可以传值给里面（通过 next(值)）

- 里面随时可以传值给外面（通过 yield）

- 它不是一次性的单向函数，而是可以多次交互的“会话”。

这就是为什么 Generator 是 async/await 的底层基础——await 其实就是“yield 一个 Promise，然后等外面（引擎）传回结果”。
:::






## 常见面试题

### 第一题

```js 

const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log(2);
    resolve(); // 注意这里
    console.log(3);
  });
});

promise.then(() => {
  console.log(4);
});

console.log(5);

// 1 → 5 → 2 → 3 → 4

// 因为 then() 中的回调函数虽然是微任务，
// 但也得等到 promise 变为 fulfilled 状态才会执行。


```

---
### 第二题

```js 

async function fun() {
  console.log(1); // 同步
  const n = await 2;
  console.log(n);
}

fun();
console.log(3);

// 1 → 3 → 2
// 因为 fun() 函数中的同步语句会直接执行，异步的才会延迟执行。

// 以上约等于

function fun() {
  console.log(1);
  Promise.resolve(2).then((n) => {
    console.log(n);
  })
}

```


---
### 第三题

```js
async function fun() {
  console.log(1); // 同步
  const n = await 2;
  console.log(n);
}

(async () => {
  await fun();
  console.log(3);
})();

console.log(4);

// 1 → 4 → 2 → 3

// 立即执行函数执行后，await fun() 中的同步代码先执行，
// 异步代码进入微队列等待执行。所以先输出 1 后输出 4。

```

---
### 第四题



```js
// 没有 await 时发生了什么
async function fun1() {
  return 1;
}

async function fun2() {
  const n = await fun1();
  console.log(n); // 1
  return 2; // 没用被用到，对比fun3的返回
}

async function fun3() {
  const n = fun2(); // 注意没有 await
  console.log(n);
  return 3;
}

fun3().then((n) => {
  console.log(n); // n 是 fun3 的返回值 3
});

fun3();

console.log(4);



// Promise { <pending> }
// Promise { <pending> }
// 4
// 1
// 3
// 1
```
---
**核心原则**

1. async 函数的执行：
    - 调用 async 函数会立即执行其内部的同步代码，直到遇到 await 才会暂停执行，并立即返回一个 `pending` 状态的 Promise。
    - await 后面的代码会被注册为微任务，等待 await 的 Promise 解决后执行。

2. 事件循环的执行顺序：
    - 先执行所有同步代码。
    - 同步代码执行完后，按先进先出的顺序执行微任务队列里的所有任务。


:::tip

- 加了 await → 等 Promise 完成，拿到值
- 没加 await → 立即拿到 Promise 对象，继续往下走


- async 函数调用后立刻返回 Promise
- await 是唯一能“暂停”并拆箱 Promise 的语法
- 不写 await = 不暂停 = 拿到的是 Promise 本身

:::

---
**执行过程解析**

阶段 1：执行全局同步代码（按顺序）

全局代码从上到下执行，步骤如下：

1. 定义函数：fun1、fun2、fun3 是函数声明，先提升（无输出）。

2. 第一次调用 `fun3().then(...)：`
    - 进入 fun3：执行 `const n = fun2()`
    - 进入 fun2 ： 执行 `const n = await fun1()`
      - 先执行 `fun1()`：fun1 是 async，立即返回 `Promise.resolve(1)`。
      - 遇到 await：暂停 fun2 执行，将 fun2 中 await 后面的代码`（console.log(n); return 2;）` **注册为微任务 1**，然后 `fun2()` 返回一个 pending 的 Promise。
    - 回到 fun3：执行 `console.log(n) → 打印 Promise { <pending> }`（因为 `fun2()` 刚返回的是 pending 状态）
    - fun3 执行完毕，返回 Promise.resolve(3)。
    - 执行` .then(...)`：将 then 回调`（console.log(n);）` **注册为微任务 2**，等待 fun3 的 Promise 解决。

3. 第二次调用 `fun3()（注意这里没有 .then）`
    - 再次进入 fun3：`执行 const n = fun2()`
    - 再次进入 fun2： `执行 const n = await fun1()`
      - 执行 `fun1()，返回 Promise.resolve(1)`
      - 遇到 await：暂停 fun2，将 await 后面的代码`（console.log(n); return 2;）` **注册为微任务 3**，`fun2() 返回 pending 的 Promise`。
    - 回到 fun3：执行 `console.log(n) → 打印 Promise { <pending> }。`
    - fun3 返回 Promise.resolve(3)（无后续处理）。


4. 执行 console.log(4) → 打印 4。


阶段 2：处理微任务队列（按注册顺序）

此时同步代码全部执行完，微任务队列里的任务按顺序是：微任务 1 → 微任务 2 → 微任务 3，依次执行：

1. 执行微任务 1（第一次 fun2 中 await 后的代码）
    - `fun1()` 的 Promise 已解决为 1，所以 n = 1。
    - 执行 console.log(n) → 打印 1。
    - fun2 返回 2（但没人用，忽略）。

2. 执行微任务 2（第一次 fun3 的 then 回调）：
    - fun3 的 Promise 已解决为 3，所以 n = 3。
    - 执行 console.log(n) → 打印 3。

3. 执行微任务 3（第二次 fun2 中 await 后的代码）：
    - n = 1，执行 console.log(n) → 打印 1。



---
**如何理解fun2中return 2没有被用到**

async 函数返回的是「同一个 Promise」，它的状态会随着函数内部代码的执行而动态变化—— 之前的 pending Promise 并没有消失，而是在 fun2 执行完 return 2 后，状态变成了 fulfilled，值就是 2。


**先明确 async 函数返回 Promise 的机制** 当你调用一个 async 函数时，它会立即返回一个 Promise 对象，这个 Promise 的状态变化规则是：

1. 函数执行中遇到 await 暂停：此时返回的 Promise 是 pending 状态。
2. 函数继续执行完毕（遇到 return 或正常结束）：之前返回的那个 Promise 会自动变成 fulfilled 状态，resolve 的值就是 return 的值（如果没有 return，则是 undefined）。

3. 函数执行中报错：Promise 会变成 rejected 状态。


看 fun2 返回的 Promise 是怎么变的

1. 步骤 1：调用 `fun2()`，返回 pending Promise

```js

// 在 fun3 里执行 const n = fun2() 时
function* fun2() {
  const n = await fun1(); // 这里遇到 await
  console.log(n);
  return 2;
}

```

- 进入 fun2，执行到 `await fun1() `时暂停。
- 此时 `fun2()` 立即返回一个 Promise，状态是 pending`（这就是你看到的 console.log(n) 打印的 Promise { <pending> }）`。

- 记这个 Promise 为 P，此时 `P = Promise { <pending> }`。


2. 步骤 2：微任务 1 执行，fun2 继续，P 的状态变成 fulfilled

```js

// 微任务 1 是 fun2 中 await 后面的代码
console.log(n); // n = 1
return 2;

```

- 微任务 1 执行：fun2 从暂停处继续，先打印 1，然后执行 return 2。

- 此时，之前返回的那个 Promise P 会自动更新状态：
    - 状态从 pending 变成 fulfilled。
    - resolve 的值就是 return 的 2，即 `P = Promise { 2 }`。



代码里，没有地方去监听这个 Promise P 的状态变化——fun3 里只是把 `fun2()` 的返回值赋给了 n 并打印了当时的 pending 状态，但之后没有用 `.then()` 去接 P 的结果。

如果我们改一下代码，给 `fun2() `加个 `.then()`，你就能看到它的状态变化了：


```js
async function fun3() {
  const n = fun2(); // n 是那个 pending 的 Promise P
  console.log(n); // 打印 Promise { <pending> }
  
  // 加个 .then() 监听 P 的状态变化
  n.then(res => console.log('fun2 的返回值：', res)); 
  // 后面会打印 2
  return 3;
}

```

---
**Promise处理的结果再then里获取**

::: code-group

```js [不使用]

async function fun2() {
  const n = await fun1();
  console.log(n); // 1
  return 2; // 2 被赋值给 fun2 返回的 Promise，但没人拿
}

async function fun3() {
  const n = fun2(); // n 是 Promise，但没处理它的结果
  console.log(n); // 打印 Promise { <pending> }
  return 3;
}

// 结果：2 存在于 Promise 里，但代码里没用到。

```

```js [监听Promise的处理结果]

async function fun2() {
  const n = await fun1();
  console.log(n); // 1
  return 2; // 2 被赋值给 Promise
}

async function fun3() {
  const n = fun2(); 
  console.log(n); // 打印 Promise { <pending> }
  
  // 用 .then() 拿到 2
  n.then(res => 
    console.log('用到了 fun2 的返回值：', res)// 会打印 2
  ); 
  
  return 3;
}

```
:::

---

#### 解题思路

::: tip 解题思路 5个关键点

一、解答这类问题的 5 个核心关键点

1. async 函数的本质 **非常重要**

调用 async 函数会立即执行内部同步代码（直到遇到 await），并返回一个 Promise：

- 遇到 await 前：同步执行，返回 pending 状态的 Promise；
- 函数执行完 return：Promise 自动变为 fulfilled，值为 return 的值。

2. await 的双重作用
- 暂停：让 async 函数让出主线程，继续执行后面的同步代码；
- 注册微任务：将 await 后面的代码注册为微任务，等待 await 后的 Promise 状态改变后执行。

3. 事件循环的优先级

严格按 「同步代码 → 微任务队列 → 宏任务队列」 的顺序执行：

- 同步代码先全部跑完；
- 同步跑完后，按注册顺序清空微任务队列；
- 微任务清空后，执行一个宏任务，然后再次清空微任务队列（循环往复）。

4. Promise 链的独立性

每次调用 async 函数或 new Promise，都会产生独立的 Promise 链，互不干扰（比如你题目中两次调用 `fun3()`，会产生两组独立的微任务）。



5. `then()` 的透传规则
如果 `.then()` 的参数不是函数，会被忽略，直接将上一个 Promise 的值透传给下一个` .then()`（这个点在纯 Promise 链题目中常考）。


:::



::: danger 4 步标准化解题流程

二、4 步标准化解题流程（可直接套用）

步骤 1：标记代码中的「关键元素」

先快速扫一遍代码，用不同符号标记：

🟢 同步代码：console.log、Promise 的 executor 函数、async 函数中 await 之前的代码；

🟡 微任务：await 后面的代码、`.then()/.catch()/.finally()`；

🔴 宏任务：setTimeout、setInterval、I/O 操作。


步骤 2：按顺序执行「全局同步代码」

从上到下执行所有同步代码，注意：**重要**

- 遇到 await：暂停当前 async 函数，将 await 后的代码注册为微任务，继续执行后面的同步代码；

- 遇到 `.then()`：先注册微任务（但要等前面的 Promise 状态改变后才会加入微任务队列执行）；

- 遇到宏任务：先注册到宏任务队列，等同步和微任务跑完再执行。



步骤 3：按注册顺序「清空微任务队列」

同步代码执行完后，按「先注册先执行」的顺序，把微任务队列里的任务全部跑完。

步骤 4：处理「宏任务队列」（如果有）

微任务清空后，执行一个宏任务，然后再次清空微任务队列（循环直到所有任务跑完）。


:::

---
### 第五题

```js

Promise.resolve(1)        // 步骤1
.then(2)                  // 步骤2
.then(Promise.resolve(3)) // 步骤3
.then(console.log)        // 步骤4


```


::: tip then 参数规则

 `Promise then()` 方法的一个关键规则：如果 `then() `的参数不是函数，会被忽略，
 并直接将上一个 Promise 的值 “透传” 给下一个 `then()`

- 先明确 `then()` 的参数规则

`then()` 方法接收两个可选参数：onFulfilled（成功回调）和 onRejected（失败回调）。
如果传入的参数不是函数（比如是数字、字符串、Promise 对象等），Promise 会直接忽略这个无效参数，创建一个新的 Promise，并将上一个 Promise 的值原样传递下去（相当于 value => value 的透传函数）。


:::

- `Promise.resolve(1)` 创建一个 **立即成功（fulfilled）** 的 Promise，值为 1
- `.then(2)` 传入的 2 是数字，不是函数，所以被忽略 ，Promise 直接透传上一个值 1，创建一个新的 fulfilled Promise，值仍为 1
- `.then(Promise.resolve(3))` 这里传入的是一个 Promise 对象，不是函数，同样被忽略，继续透传上一个值 1，创建一个新的 fulfilled Promise，值还是 1
- `.then(console.log)` 这里传入的 console.log 是函数，所以会被执行，它接收上一个透传下来的值 1，执行 console.log(1)，最终打印 1


```js
Promise.resolve(1)
  .then(() => 2)  // 传函数，返回 2
  .then(() => Promise.resolve(3))  // 传函数，返回 Promise.resolve(3)
  .then(console.log)

```





---
### 第六题

```js
promise1 undefined end
var a
var b = new Promise((resolve, reject) => {
  console.log('promise1')
  setTimeout(() => {
    resolve()
  }, 1000)
})
  .then(() => {
    console.log('promise2')
  })
  .then(() => {
    console.log('promise3')
  })
  .then(() => {
    console.log('promise4')
  })

a = new Promise(async (resolve, reject) => {
  console.log(a)
  await b
  console.log(a)
  console.log('after1')
  await a
  resolve(true)
  console.log('after2')
})
console.log('end')

```

**代码执行过程拆解**


将执行分为「同步代码阶段」「宏任务触发阶段」「微任务执行阶段」三个部分，按时间线梳理：

1. 阶段 1：执行全局同步代码（按顺序）

- 声明变量：`var a（此时 a = undefined）、var b`。

- 初始化 b 的 Promise
    - 执行 `new Promise((resolve, reject) => { ... })`：Promise 的 executor 函数是同步执行的，所以先打印 'promise1'。
    - 遇到 `setTimeout(...)`：这是宏任务，注册到宏任务队列，等待 1 秒后执行。
    - 链式调用 `.then()`：三个 `.then()` 会注册微任务，但此时 b 的 Promise 还没 resolve（因为 setTimeout 没执行），所以这些微任务先 “挂起”，等 b 状态改变后才会加入微任务队列。

- 初始化 a 的 Promise：
    - 执行 `new Promise(async (resolve, reject) => { ... })`：executor 是 async 函数，async 函数内 await 之前的代码是同步执行的。
    - 先执行 `console.log(a)`：此时 a 还没被赋值（因为 new Promise 还在执行中，a 要等构造完成才会被赋值），所以打印 undefined。
    - 遇到 await b：await 会暂停 async 函数的执行，将 await 后面的代码`（console.log(a)、console.log('after1') 等）`注册为微任务，等待 b 状态改变。
    - a 的 Promise 构造完成，a 被赋值为这个新的 Promise 对象（状态为 pending）


- 执行最后一行同步代码：`console.log('end')`，打印 'end'


2. 阶段 2：等待宏任务触发（1 秒后）

同步代码执行完后，微任务队列为空（因为 b 还没 resolve），所以等待宏任务执行。1 秒后，setTimeout 的回调执行：

调用 `resolve()`，b 的 Promise 状态从 pending 变为 fulfilled。


3. 阶段 3：执行微任务队列（按注册顺序）

b 状态改变后，之前挂起的微任务按顺序加入队列并执行：

- b 的第一个 .then() 回调：
    - 执行 `console.log('promise2')`，打印 'promise2'。
    - 该 `.then()` 返回的 Promise 自动 resolve，触发第二个 `.then()` 回调加入微任务队列。
- b 的第二个 `.then()` 回调：
    - 执行 `console.log('promise3')`，打印 'promise3'。
    - 触发第三个 `.then()` 回调加入队列。

- b 的第三个 `.then()` 回调：
    - 执行 `console.log('promise4')`，打印 'promise4'。
    - 此时 b 的 Promise 链执行完毕，b 状态为 fulfilled。

- a 中 await b 后的微任务：
    - b 已 resolve，await b 暂停的代码继续执行：
    - 执行 `console.log(a)`：此时 a 是之前构造的 Promise 对象（状态仍为 pending，因为还没调用 `resolve(true)）`，所以打印` Promise { <pending> }`。
    - 执行 `console.log('after1')`，打印 'after1'。
    - 遇到 await a：await 会等待 a 状态改变，但 a 的` resolve(true)` 在 await a 之后，永远不会执行，因此 a 永远是 pending 状态，后续代码`（resolve(true)、console.log('after2')）`会死等，不再执行。



#### 解题思路

::: tip 解题思路

1. 牢记执行优先级：同步代码 → 微任务 → 宏任务
    - 同步代码：优先执行，包括 Promise 的 executor 函数、async 函数中 await 之前的代码。
    - 微任务：同步代码执行完后，立即清空微任务队列（包括 `.then()/.catch()/.finally()、await 后的代码`）。
    - 宏任务：微任务清空后，执行一个宏任务（如 setTimeout、setInterval），执行完后再次清空微任务队列（循环往复）。

2. Promise 的 executor 是同步执行的，`.then() `是微任务
    - `new Promise((resolve, reject) => { ... })` 里的代码会立即同步执行。
    - `.then()` 只是注册微任务，必须等 Promise 状态变为 fulfilled/rejected 后，才会加入微任务队列。


3. await 会 “暂停” 并注册微任务

async 函数中，await 之前的代码同步执行，遇到 await 后：

- 暂停函数执行；
- 将 await 后面的代码注册为微任务；
- 等待 await 后的 Promise 状态改变。


4. 注意变量的 “赋值时机”

比如 a = `new Promise(...)`：在 executor 函数执行时，a 还没被赋值为这个 Promise 对象（要等构造完成才会赋值），所以 executor 里先打印 a 会是 undefined。

5. 避免 “死等” 陷阱

如果 await 的 Promise，其 resolve/reject 写在 await 之后，会导致 Promise 永远是 pending 状态，后续代码永远不会执行（如本题中 await a 后才 resolve(true)）。
:::











---
### 第七题

```js
async function async1() {
  console.log('async1 start')
  await async2() 
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(() => {
  console.log('settimeout')
}, 0) 

async1()

new Promise(function (resolve) {
  console.log('p1')
  resolve()
}).then(function () { 
  console.log('p2')
})

console.log('script end')



```

将执行分为 3 个阶段，每一步标清楚「做了什么」「注册了什么任务」「打印了什么」：

阶段 1：执行全局同步代码（从上到下）








#### 解题思路

::: tip

1. async 函数的执行
    - await 之前的代码同步执行
    - 遇到 await 后暂停，将 await 之后的代码注册为微任务

2. async 函数的返回值
    - 即使没有显式 return，也会自动返回 Promise.resolve(undefined)状态立即 fulfilled。

3. 事件循环优先级
    - 严格按 「同步代码 → 微任务队列（按注册顺序） → 宏任务队列」 执行

4. Promise 的基本规则
    - executor 函数同步执行
    - `.then()` 只是注册微任务，等 Promise 状态改变后才会执行

5. 微任务的注册顺序
    - 按代码中「遇到 await 或 `.then() `的先后顺序」注册，执行时也按这个顺序
:::






```js

async function fn() {
  return 100
}


(async function() {
  const a = fn() // ??
  console.log('a', a) // Promise fulfilled
  const b = await fn() // ?? 
  console.log('b', b) // 100
})()

```


```js
(async function() {
  console.log('start')                    // ① 同步执行，立即打印

  const a = await 100                     // ② await 非 Promise → 自动包装成 Promise.resolve(100)
                                          //    → 立即 fulfilled → a = 100
  console.log('a', a)                     // ③ 打印 a 100

  const b = await Promise.resolve(200)    // ④ Promise 已经 fulfilled
                                          //    → await 得到 200（拆箱）
  console.log('b', b)                     // ⑤ 打印 b 200

  const c = await Promise.reject(300)     // ⑥ Promise 立即 rejected
                                          //    → await 遇到 reject → 抛出异常 300
                                          //    → 整个 async 函数 reject
                                          //    → 后面的代码不再执行

  console.log('c', c)                     // ⑥ 永不执行
  console.log('end')                      // ⑦ 永不执行
})()
```







