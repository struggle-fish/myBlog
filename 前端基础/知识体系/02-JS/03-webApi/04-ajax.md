# ajax

## ajax是什么

`AJAX = Asynchronous JavaScript and XML`（异步的 JavaScript 和 XML）

本质：在不重新加载整个网页的情况下，与服务器进行数据交互，并局部更新页面内容的技术。

- 传统网页：点击按钮 → 整个页面刷新 → 等待服务器响应
- AJAX 网页：点击按钮 → 后台悄悄请求数据 → 只更新页面局部内容（用户几乎无感知）

**整个过程页面不刷新，这就是 AJAX 的核心价值。**


## ajax的核心原理

AJAX 的实现依赖于浏览器提供的异步请求对象：

- 核心对象： `XMLHttpRequest`（简称 XHR，老标准）
- 现代推荐：`fetch API`（新标准，基于 Promise）


工作流程：

- 创建 XMLHttpRequest 对象
- 配置请求（地址、方法、参数等）
- 发送请求（异步，不阻塞页面）
- 服务器返回数据
- JavaScript 通过回调函数接收数据
- 用 DOM 操作更新页面局部内容





## 手写一个简易的ajax

```js
// 创建
const xhr = new XMLHttpRequest()

// 监听状态变化（最重要的事件）
xhr.onreadystatechange = function () {
  console.log('readyState 变化:', xhr.readyState)
  // 注意这里为什么是4呢？
  if (xhr.readyState === 4) {           // 请求已完成
    if (xhr.status >= 200 && xhr.status < 300) {
      console.log('请求成功:', xhr.responseText)
    } else {
      console.log('请求失败:', xhr.status)
    }
  }
}

// 打开请求
xhr.open('GET', '/api/users', true)   // 第三个参数 true 表示异步

// 发送请求
xhr.send()

```


```js
/**
 * 简单易懂的 ajax 封装
 * @param {Object} options 配置对象
 */
function ajax(options) {
  // 默认参数
  const defaults = {
    method: 'GET',
    url: '',
    data: null,           // 请求数据
    async: true,          // 是否异步（几乎总是 true）
    headers: {},          // 请求头
    success: function() {}, // 成功回调
    error: function() {}    // 失败回调
  }

  // 合并配置
  const opts = Object.assign({}, defaults, options)

  // 1. 创建 XMLHttpRequest 对象
  const xhr = new XMLHttpRequest()

  // 2. 处理 GET 请求的参数拼接
  let url = opts.url
  if (opts.method.toUpperCase() === 'GET' && opts.data) {
    const params = new URLSearchParams(opts.data).toString()
    url += (url.includes('?') ? '&' : '?') + params
  }

  // 3. 打开请求
  xhr.open(opts.method, url, opts.async)

  // 4. 设置请求头
  Object.keys(opts.headers).forEach(key => {
    xhr.setRequestHeader(key, opts.headers[key])
  })

  // 5. 监听请求状态
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {           // 请求已完成
      if (xhr.status >= 200 && xhr.status < 300) {  // 请求成功
        let response = xhr.responseText
        try {
          response = JSON.parse(response)   // 尝试转为 JSON
        } catch (e) {}
        
        opts.success(response, xhr)
      } else {
        opts.error(xhr.status, xhr.statusText, xhr)
      }
    }
  }

  // 6. 发送请求
  if (opts.method.toUpperCase() === 'GET') {
    xhr.send()
  } else {
    const body = opts.data ? new URLSearchParams(opts.data).toString() : null
    xhr.send(body)
  }

  return xhr   // 支持链式调用或手动 abort
}



// GET 请求
ajax({
  url: 'https://api.example.com/users',
  method: 'GET',
  success: function(data) {
    console.log('成功获取数据：', data)
  },
  error: function(status) {
    console.error('请求失败', status)
  }
})

// POST 请求
ajax({
  url: 'https://api.example.com/login',
  method: 'POST',
  data: {
    username: 'admin',
    password: '123456'
  },
  headers: {
    'Content-Type': 'application/json'
  },
  success: function(res) {
    console.log('登录成功', res)
  }
})
```


## readyState五个状态

`readyState` 是 `XMLHttpRequest` 对象最重要的属性之一，用于表示当前请求处于什么阶段。

它有 5 个状态值（从 0 到 4），每当状态发生变化时，就会触发 `onreadystatechange` 事件。

- `0 `  -> UNSENT -> 未初始化 / 未发送 -> 刚刚创建了 XHR 对象，还没有调用 `open()` 方法
- `1`   -> OPENED -> 已打开 -> 已调用 open() 方法，完成了请求初始化，但还未发送
- `2`   -> HEADERS_RECEIVED -> 已接收响应头 -> 已调用 `send()`，并且服务器已经返回了响应头
- `3`   -> LOADING  -> 正在下载 / 接收响应体 -> 正在接收响应体（数据正在传输中），`responseText` 会包含已接收的部分数据
- `4`   -> DONE -> 请求完成


```text

创建 XHR 对象
     ↓
   readyState = 0   (UNSENT)

调用 open() 方法
     ↓
   readyState = 1   (OPENED)

调用 send() 方法
     ↓
   readyState = 2   (HEADERS_RECEIVED)  ← 收到响应头

服务器开始返回数据
     ↓
   readyState = 3   (LOADING)           ← 正在下载（可能触发多次）

数据接收完成
     ↓
   readyState = 4   (DONE)              ← 请求结束


```


## 常用状态码

- 2xx 表示成功处理请求 如 200
- 3xx 需要重定向，浏览器直接跳转 如 301 永久重定向 302 临时重定向 304 资源未修改（缓存协商）
- 4xx 客户端请求错误 如 404  403 Forbidden 禁止访问
- 5xx 服务端错误


