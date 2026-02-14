# Promise

## Promise 有哪些状态，如何变化

### 三种状态

| 状态 | 说明 |
|------|------|
| **pending**（进行中） | 初始状态，既不是 fulfilled 也不是 rejected |
| **fulfilled**（已成功） | 操作成功完成，会调用 `onFulfilled` |
| **rejected**（已失败） | 操作失败，会调用 `onRejected` |

状态一旦从 pending 变为 fulfilled 或 rejected，就**不可再变**。


## Promise 详解与原理

### 是什么

Promise 是 ES6 的异步编程方案，表示一个**未来才会结束的结果**（一个异步操作的最终完成（或失败）及其结果值）。解决回调地狱，支持链式调用。


### 核心原理

Promise 的核心是**基于事件驱动和状态机的机制**。它是一个构造函数，可以通过 new Promise() 创建实例。

Promise 对象有三个核心部分：

- Executor 函数：在创建 Promise 时立即执行的函数，接收 resolve 和 reject 两个参数，用于控制 Promise 的状态。
- then 方法：用于注册成功（fulfilled）和失败（rejected）时的回调，支持链式调用。
- catch 方法：用于捕获错误，等价于 then(null, onRejected)。
- finally 方法：无论成功或失败都会执行的回调（ES2018 引入）。

### 核心特点

1. **状态不受外界影响**：只有异步结果能改变状态
2. **状态一旦改变就不会再变**
3. **无法取消**：一旦新建就会执行


### 状态流转

```
                    resolve(value)
    pending ──────────────────────────► fulfilled
       │                                      │
       │                                      │  then 的回调被调用
       │                                      ▼
       │                                 [ 微任务队列 ]
       │
       │    reject(reason)
       └──────────────────────────────► rejected
                                              │
                                              │  catch / then 的第二个回调
                                              ▼
                                         [ 微任务队列 ]
```

- **pending** ：初始状态，既没有 fulfilled 也没有 rejected，此时 Executor函数正在执行异步操作
- **pending → fulfilled**：调用 `resolve(value)`，后续 `.then(onFulfilled)` 会收到 value
- **pending → rejected**：调用 `reject(reason)`，后续 `.catch()` 或 `.then(_, onRejected)` 会收到 reason
- 状态只能改变一次，之后再调用 `resolve`/`reject` 无效

---


### 常用 API

| API | 说明 |
|-----|------|
| `new Promise(executor)` | 创建 Promise，executor 里执行异步逻辑，内部调用 resolve/reject |
| `Promise.resolve(x)` | 返回一个 fulfilled 的 Promise，值为 x |
| `Promise.reject(r)` | 返回一个 rejected 的 Promise，原因为 r |
| `p.then(onFulfilled, onRejected)` | 注册成功/失败回调，返回新 Promise |
| `p.catch(onRejected)` | 等价于 `p.then(null, onRejected)` |
| `p.finally(cb)` | 无论成功失败都执行 cb，不改变结果值 |
| `Promise.all(iterable)` | 全部 fulfilled 才 fulfilled，一个 rejected 就 rejected |
| `Promise.race(iterable)` | 谁先有结果（fulfilled/rejected）就用谁 |
| `Promise.allSettled(iterable)` | 等所有结束，返回每个的状态和结果 |
| `Promise.any(iterable)` | 有一个 fulfilled 就 fulfilled，全 rejected 才 rejected |



**链式调用**中，每个 then 都会返回一个新的 Promise，其状态取决于上一个 Promise 的结果或回调的返回值：

- 如果回调返回普通值，新 Promise 为 Fulfilled
- 如果回调返回 Promise, 新 Promise 的状态跟随该Promise
- 如果回调抛出错误，新 Promise 为 Rejected


---


## Promise 实现原理

核心：**状态 + 回调队列 + then 时把回调存起来，resolve/reject 时再依次执行**。

```js
class MyPromise {
  static PENDING   = 'pending';
  static FULFILLED = 'fulfilled';
  static REJECTED  = 'rejected';

  constructor(executor) {
    this.state = MyPromise.PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.fulfilledCallbacks = [];
    this.rejectedCallbacks  = [];

    // 成功时最终落地的动作
    const fulfill = (value) => {
      this.state = MyPromise.FULFILLED;
      this.value = value;
      this.fulfilledCallbacks.forEach(fn => fn(value));
      this._clearCallbacks();
    };

    // 失败时最终落地的动作
    const reject = (reason) => {
      this.state = MyPromise.REJECTED;
      this.reason = reason;
      this.rejectedCallbacks.forEach(fn => fn(reason));
      this._clearCallbacks();
    };

    // 包装 resolve，处理 thenable + 循环引用 + 异步
    const resolve = (x) => {
      if (this.state !== MyPromise.PENDING) return;
      // 推入微任务队列
      queueMicrotask(() => {
        // 再次判断，防止在异步中状态已被改变
        if (this.state !== MyPromise.PENDING) return;

        // 核心：解析 thenable / promise / 普通值
        this._resolveValue(x, fulfill, reject);
      });
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  // 清理回调数组，防止内存泄漏
  _clearCallbacks() {
    this.fulfilledCallbacks = [];
    this.rejectedCallbacks = [];
  }

  /**
   * 规范 2.3 Resolve Promise
   * 处理 x 的各种情况：普通值 → thenable → Promise → 自己
   */
  _resolveValue(x, fulfill, reject) {
    // 禁止循环引用
    if (x === this) {
      return reject(new TypeError("Cannot resolve promise with itself"));
    }

    // 如果已经是自己的 Promise 实例，直接跟随它的状态
    if (x instanceof MyPromise) {
      x.then(fulfill, reject);
      return;
    }

    // 不是对象/函数 → 普通值，直接 fulfill
    if (typeof x !== 'object' || x === null) {
      return fulfill(x);
    }

    // 尝试获取 then 方法（可能抛错）
    let then;
    try {
      then = x.then;
    } catch (err) {
      return reject(err);
    }

    // 不是函数 → 当普通对象处理
    if (typeof then !== 'function') {
      return fulfill(x);
    }

    // 是 thenable，调用它的 then（防止多次调用）
    let called = false;
    try {
      then.call(
        x,
        y => { 
          if (!called) { 
            called = true; 
            this._resolveValue(y, fulfill, reject); 
          } 
        },
        r => { 
          if (!called) { 
            called = true; 
            reject(r); 
          }
        }
      );
    } catch (err) {
      if (!called) {
        reject(err);
      }
    }
  }

  then(onFulfilled, onRejected) {
    // 提供默认函数（规范要求）
    const handleFulfill = typeof onFulfilled === 'function'
      ? onFulfilled
      : value => value;

    const handleReject = typeof onRejected === 'function'
      ? onRejected
      : reason => { throw reason };

    return new MyPromise((resolve, reject) => {
      // 已完成 → 异步执行回调
      const handleFulfilled = () => {
        queueMicrotask(() => {
          try {
            const x = onFulfilled(this.value);
            resolve(x);  // 交给外层的 resolve 去解析（会调用 _resolveValue）
          } catch (err) {
            reject(err);
          }
        });
      };

      const handleRejected = () => {
        queueMicrotask(() => {
          try {
            const x = onRejected(this.reason);
            resolve(x);  // 注意：onRejected 返回值也会 resolve
          } catch (err) {
            reject(err);
          }
        });
      };

      if (this.state === MyPromise.FULFILLED) {
        handleFulfilled();
      } else if (this.state === MyPromise.REJECTED) {
        handleRejected();
      } else {
        // pending → 收集（包装成带 resolve/reject 的函数）
        this.onFulfilledCallbacks.push(handleFulfilled);
        this.onRejectedCallbacks.push(handleRejected);
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }

  finally(onFinally) {
    if (typeof onFinally !== 'function') return this.then();
    
    return this.then(
      value  => MyPromise.resolve(onFinally()).then(() => value),
      reason => MyPromise.resolve(onFinally()).then(() => { 
        throw reason;
      })
    );
  }

  static resolve(value) {
    // 如果已经是 MyPromise，直接返回
    if (value instanceof MyPromise) return value;
    return new MyPromise(resolve => resolve(value));
  }

  static reject(reason) {
    return new MyPromise((_, reject) => reject(reason));
  }
}






```


要点：

- 用 `state`、`value`、`reason` 存状态和结果
- `then` 时若仍是 pending，把回调放进 `onFulfilledCallbacks` / `onRejectedCallbacks`
- `resolve`/`reject` 时改状态并**依次执行**对应回调（用 `queueMicrotask` 保证是微任务）
- `then` 返回新 Promise，实现链式；



## 常用 Promise 场景

1. **接口请求封装**：`axios`、`fetch` 返回 Promise，`.then` 处理数据
2. **文件操作**：`Node.js` 的 `fs.promises` 模块，提供 `Promise` 版的读写文件
3. **并发控制**：使用 `Promise.all()` 处理多个异步并行、`Promise.race()` 取最快结果、`Promise.allSettled()` 获取所有结果（无论成败）
4. **顺序请求**：`.then` 里再 return 下一个请求，避免回调嵌套
5. **图片/脚本加载**：
  `new Promise((resolve, reject) => { img.onload = resolve; img.onerror = reject })`
6. **确认弹窗**：用户点击确定 resolve，取消 reject
7. **async/await 底层**：async 函数返回 Promise，await 等价于 then


## 常见面试题

### 1. then 和 catch 的链式连接（执行顺序）
::: code-group

```js [执行顺序1]
// 第一题
Promise.resolve().then(() => {
  console.log(1)
}).catch(() => {
  console.log(2)
}).then(() => {
  console.log(3)
})
// 1 → 3（没有 reject，catch 不执行）
```

```js [执行顺序2]
// 第二题
Promise.resolve().then(() => {
  console.log(1)
  throw new Error('error1')
}).catch(() => {
  console.log(2)
}).then(() => {
  console.log(3)
})
// 1 → 2 → 3
// then 里抛错，被 catch 捕获，
// catch 返回的 Promise 默认 fulfilled，所以还会执行后面的 then
```

```js [执行顺序3]
// 第三题
Promise.resolve().then(() => {
  console.log(1)
  throw new Error('error1')
}).catch(() => {
  console.log(2)
}).catch(() => {
  console.log(3)
})
// 1 → 2（第一个 catch 已处理错误，第二个 catch 不会执行）
```
:::


### 2. Promise 与 setTimeout 顺序

微任务先于宏任务，所以先执行完所有同步和微任务，再执行 setTimeout。

```js
console.log(100)
setTimeout(() => console.log(200))
Promise.resolve().then(() => console.log(300))
console.log(400)
// 100 → 400 → 300 → 200
```

### 3. Promise.all 与错误处理

- `Promise.all`：一个 rejected 就整体 rejected，值为第一个 reject 的 reason
- 若希望“全部执行完再统一处理”：用 `Promise.allSettled`

### 4. 手写 Promise.all

```js
Promise.myAll = function (promises) {
  return new Promise((resolve, reject) => {
    const result = []
    let count = 0
    const len = promises.length
    if (len === 0) return resolve(result)
    promises.forEach((p, i) => {
      Promise.resolve(p).then(
        (val) => {
          result[i] = val
          if (++count === len) resolve(result)
        },
        reject
      )
    })
  })
}
```

### 5. 手写 Promise.race

```js
Promise.myRace = function (promises) {
  return new Promise((resolve, reject) => {
    promises.forEach((p) => {
      Promise.resolve(p).then(resolve, reject)
    })
  })
}
```

### 6. 实现 sleep / 延迟

```js
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
await sleep(1000)
```







