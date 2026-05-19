# BOM

BOM操作（Browser Object Model）,浏览器对象模型，是浏览器提供的一套用于操作浏览器窗口和浏览器本身的 JavaScript 接口。

BOM 是浏览器提供给 JavaScript 的一套操作浏览器窗口、历史记录、地址栏、存储等功能的接口集合，其核心对象是 window，最常用的部分是 location、history、navigator 和各种存储 API。

## BOM 的核心对象层级

window 对象是 BOM 的顶级根对象

```text

window（BOM 的核心对象，所有 BOM API 都挂在 window 下）
├── location
├── history
├── navigator
├── screen
├── document（其实属于 DOM，但挂在 window 下）
├── frames / parent / top
├── localStorage / sessionStorage
├── alert / confirm / prompt
└── setTimeout / setInterval / requestAnimationFrame

```

## Location对象

- location.href 获取或设置完整 URL

- location.pathname 获取路径部分 `/user/123`

- location.search 获取查询字符串 `?id=100&name=xx`

- location.hash  获取锚点（`#`后面的部分）`#section1`

- location.reload() 刷新当前页面 `location.reload(true)` 强制从服务器刷新

- location.replace(url) 替换当前历史记录（不产生新历史）



## History对象

- history.back()  后退

- history.forward() 前进

- history.go(n) 跳转到历史记录中的第 n 步

- history.pushState() 添加一条历史记录（SPA 核心）现代前端路由基础

- history.replaceState() 替换当前历史记录


## Navigator

浏览器信息对象 ——判断设备、浏览器、网络

- navigator.userAgent  获取浏览器 User-Agent 字符串

- navigator.platform  操作系统平台

- navigator.language  当前浏览器语言

- navigator.onLine  判断当前是否在线

- navigator.geolocation 获取地理位置


## 如何识别浏览器的类型

核心：navigator.userAgent 拿到字符串，用关键词 + 排除法区分。

- Chrome：Chrome 且 不是 Edge
- Edge：Edg / Edge
- Firefox：Firefox
- Safari：Safari 且 不含 Chrome
- IE：MSIE 或 Trident

```js

function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browser = "Unknown";
  let version = "";

  // Edge
  if (ua.includes("Edg") || ua.includes("Edge")) {
    browser = "Edge";
    version = ua.match(/Edg\/([\d.]+)/)?.[1] || "";
  }
  // Chrome
  else if (ua.includes("Chrome") && !ua.includes("Edg")) {
    browser = "Chrome";
    version = ua.match(/Chrome\/([\d.]+)/)?.[1] || "";
  }
  // Firefox
  else if (ua.includes("Firefox")) {
    browser = "Firefox";
    version = ua.match(/Firefox\/([\d.]+)/)?.[1] || "";
  }
  // Safari
  else if (ua.includes("Safari") && !ua.includes("Chrome")) {
    browser = "Safari";
    version = ua.match(/Version\/([\d.]+)/)?.[1] || "";
  }
  // IE
  else if (ua.includes("MSIE") || ua.includes("Trident")) {
    browser = "IE";
    version = ua.match(/(MSIE |rv:)([\d.]+)/)?.[2] || "";
  }

  return { browser, version };
}

console.log(getBrowserInfo());
// {browser: "Chrome", version: "125.0.0.0"}

```



## 分析拆解URL的各部分

URL 一共 7 部分：协议、认证、主机、端口、路径、查询、锚点

最常用 5 部分：协议、主机、端口、路径、参数


```js

https://user:pass@www.example.com:8080/path/to/resource?query=hello&sort=desc#section1

协议://用户名:密码@主机名:端口/路径?查询参数#锚点


```

### 协议（Protocol）
- 内容：https
- 作用：告诉浏览器用什么方式访问（`http/https/ftp/file` 等）
- 写法：后面必须跟 `://`
---

### 认证信息（Auth）→ 很少用
- 用户名：admin
- 密码：123456
- 格式：用户名:密码@
---

### 主机（Host / 域名 / IP）
- 内容：`www.baidu.com`
- 作用：服务器地址（域名 或 IP 都可以）
---

### 端口（Port）
- 内容：8080
- 作用：服务器上的服务入口
- 默认端口可以省略：
  - http → 80
  - https → 443
---

### 路径（Path）
- 内容：/s/news
- 作用：服务器上的文件 / 接口位置
- 以 / 开头
---

### 查询参数（Query）
- 内容：wd=js&page=1
- 开头：?
- 格式：key=value，多个用 & 连接
---

### 锚点（Hash / Fragment）
- 内容：#top
- 作用：页面内定位
- 不会发送到服务器，只在浏览器里使用



```text

https://admin:123456@www.baidu.com:8080/s/news?wd=js&page=1#top

┌协议：https
┌认证：admin:123456
┌主机：www.baidu.com
┌端口：8080
┌路径：/s/news
┌查询：wd=js&page=1
└锚点：top

```
