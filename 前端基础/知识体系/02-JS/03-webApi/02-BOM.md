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


