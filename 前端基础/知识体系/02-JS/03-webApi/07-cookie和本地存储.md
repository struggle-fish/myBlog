# cookie 和本地存储


## cookie

最初用于服务器端会话状态管理。

每次 HTTP 请求都会自动携带（包括图片、CSS、JS 请求），会增加网络流量。

- `HttpOnly`：JS 无法读取（防 XSS）
- `Secure`：只在 HTTPS 下发送
- `SameSite=Lax/Strict/None`：防 CSRF（非常重要）


会话 Cookie（关闭浏览器即失效）

持久 Cookie（设置过期时间）



## localStorage 

HTML5 新增，永久存储（除非用户手动清除或调用 `localStorage.clear()`）。

同源策略严格限制，不同域名完全隔离。

支持二级域名共享（通过 document.domain，但已较少使用）。

存取都是字符串，对象需 `JSON.stringify() / JSON.parse()`

## sessionStorage

页面会话级存储，关闭当前标签页/浏览器就自动清除。

**即使是同一个域名，不同标签页也是完全独立的。**

刷新页面数据仍然保留。



![LOGO](/public/image/base/ScreenShot_2026-05-19_174223_865.png)

![LOGO](/public/image/base/ScreenShot_2026-05-19_174744_861.png)



## 同域名不同标签


![LOGO](/public/image/base/ScreenShot_2026-05-19_180108_621.png)


假设在 `https://example.com` 这个域名下：

LocalStorage 示例：


```js

// 在标签页 A 中执行
localStorage.setItem('username', '张三')

// 在标签页 B（同一个域名）中执行
console.log(localStorage.getItem('username'))   // "张三"

```

**→ 标签页 B 可以读到标签页 A 存的数据，它们是共享的。**


SessionStorage 示例：

```js

// 在标签页 A 中执行
sessionStorage.setItem('tempData', '我是临时数据')

// 在标签页 B 中执行
console.log(sessionStorage.getItem('tempData'))   // null

```

**→ 标签页 B 完全读不到标签页 A 的数据，它们是独立的。**




![LOGO](/public/image/base/ScreenShot_2026-05-19_180349_264.png)


不同子域名：

`a.example.com` 和 `b.example.com `的 LocalStorage 不共享


:::tip


LocalStorage：同域名下所有标签页共享，适合需要跨标签页同步的数据。子域名不共享

SessionStorage：同域名下每个标签页独立，适合只在当前标签页使用的临时数据。

:::

