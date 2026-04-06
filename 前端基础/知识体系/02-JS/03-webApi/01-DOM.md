# DOM


DOM 操作即 Document Object Model

## DOM的本质

`DOM（Document Object Model）`是浏览器将 HTML 文档解析后，在内存中构建的一棵结构化的对象树，它是 JavaScript 操作 HTML 文档的接口。


- HTML 是文本（写在 `.html `文件里的字符串）
- DOM 是对象（浏览器把 HTML 解析成内存中的树形对象结构）
- JavaScript 通过 DOM 这个“接口”来读取和修改这个对象树，从而改变页面展示

DOM = HTML 文档在内存中的对象树映射。

### （1）结构化的对象树（树状数据结构）

浏览器解析 HTML 后，会在内存中生成一棵树：


```html

<html>
  <head>...</head>
  <body>
    <div id="app">
      <h1>标题</h1>
      <p class="text">内容</p>
    </div>
  </body>
</html>

```

对应的 DOM 树结构是：

```text

Document
  └─ html
      ├─ head
      └─ body
          └─ div#app
              ├─ h1
              └─ p.text


```

每个节点都是一个 对象（Node 对象），主要有以下几种节点类型：

- Element 节点：标签节点（如 div、p、span）nodeType为1
- Text 节点：文本内容
- Attribute 节点：属性（如 id、class）
- Document 节点：整个文档（document）
- Comment 节点：注释

这颗对象树，就叫 **DOM**，HTML 是字符串文本，DOM 是内存里的对象结构
JS 不能直接操作字符串，只能操作 DOM 对象

### （2）JavaScript 可以操作的接口（API）

DOM 不是 JS，而是浏览器提供的 API，DOM 提供了一整套标准 API，让 JavaScript 可以：

- 查询节点（querySelector、getElementById 等）
- 修改节点（innerHTML、textContent、style 等）
- 创建/删除节点（createElement、appendChild、removeChild 等）
- 绑定事件（addEventListener）
- 操作属性（setAttribute、dataset 等）


### （3）浏览器与 JavaScript 之间的桥梁

- 浏览器：负责解析 HTML → 生成 DOM 树 → 渲染页面

- JavaScript：通过 DOM API 操作这棵树 → 触发浏览器重新渲染

所以你写 `document.getElementById('app').innerHTML = '新内容' 时`，实际上是在通过 JavaScript 操作浏览器内存中的对象树。

**DOM 不是 JavaScript 发明的，而是由 W3C 制定的跨语言标准。目前主流是 DOM Level 4 规范。**


### 常见误区

- DOM 就是 HTML ❌  -> HTML 是文本，DOM 是 HTML 被解析后的对象树 ✅
- DOM 是 JavaScript 的一部分 ❌ -> DOM 是浏览器提供的接口，JavaScript 通过它操作页面
- 修改 DOM 就是直接改 HTML 文件 ❌ -> 修改的是内存中的 DOM 树，HTML 文件本身不变
- innerHTML 修改就是改文本 ❌ -> 实际上是解析字符串后重新构建 DOM 子树


### 总结

DOM的本质：浏览器把 HTML 文档解析后，在内存中生成的一棵结构化的对象树（Node Tree），并提供了一套标准的 JavaScript 接口（DOM API），让开发者可以通过 JavaScript 程序化地读取、修改、创建和删除这棵树上的节点，从而动态改变网页的内容、结构和样式。

DOM 是浏览器渲染引擎和 JavaScript 引擎 之间的桥梁，修改 DOM 会触发 重排（Reflow） 和 重绘（Repaint），是性能优化的关键点，

Vue/React 等框架的核心工作之一就是高效操作 DOM（虚拟 DOM → 真实 DOM 的映射）



## DOM 节点操作


::: code-group

```js [查询]
// 通过 id 获取元素
document.getElementById(id)

// 通过 CSS 选择器获取第一个匹配元素
document.querySelector(selector)

// 通过 CSS 选择器获取所有匹配元素
document.querySelectorAll(selector)

// 在指定父元素内查找
parent.querySelector / querySelectorAll

// 通过 class 获取
getElementsByClassName()

// 通过标签名获取
getElementsByTagName()
```

```js [创建]
// 创建元素节点
document.createElement(tag)

// 创建文本节点
document.createTextNode(text)

// 创建文档片段（性能优化）
document.createDocumentFragment()

```

```js [插入]
// 在末尾插入子节点
parent.appendChild(child)

// 在指定节点前插入
parent.insertBefore(newNode, referenceNode)

// ES2018 新增，可插入多个节点
parent.append(...nodes)

// 在开头插入多个节点
parent.prepend(...nodes)

```

```js [删除]
// 推荐（现代写法）
node.remove()
// 经典写法
parent.removeChild(child)

```
:::

## attribute 和 property 的区别




![LOGO](/public/image/base/ScreenShot_2026-04-05_143957_151.png)

- property: 修改对象属性，不会体现在html结构中
- attribute: 修改html属性，会改变html结构
- 读取/设置用户自定义数据 → 用 dataset（data-*）
- 操作表单元素的状态（checked、value、selected）→ 用 Property
- 操作标准 HTML 属性（id、class、src、href）→ 两者都可以，但推荐用 Property
- 自定义属性 → 用 setAttribute / getAttribute 或 dataset

```html

<input id="myInput" type="checkbox" checked value="hello" data-id="123">


<script>

  const input = document.getElementById('myInput')

  // Attribute（特性）
  input.getAttribute('checked')     // "checked" （字符串）
  input.getAttribute('value')       // "hello"
  input.getAttribute('data-id')     // "123"

  // Property（属性）
  input.checked                     // true （布尔值！）
  input.value                       // "hello"
  input.dataset.id                  // "123" （推荐方式）

  // 修改示例
  input.setAttribute('value', '新值')   // 修改 Attribute
  input.value = '新值2'                 // 修改 Property（推荐）
</script>


```

## DOM性能

### DOM 性能差的的本质

JS 引擎 和 浏览器渲染引擎 是两个独立模块，相互通信有巨大桥接开销；

几乎所有 DOM 修改都会触发重排（Reflow） 或 重绘（Repaint），重排极其昂贵。

操作 DOM ≈ 跨线程通信 + 页面重新布局 / 绘制，比纯 JS 计算慢 100~1000 倍。


操作中常见的性能问题：


![LOGO](/public/image/base/ScreenShot_2026-04-06_092513_362.png)


### 重排（reflow）

元素几何形状发生变化 → 浏览器重新计算位置大小 → 重构渲染树


触发重排的操作：

- 修改几何属性：width、height、margin、padding、border、display、position、top/left 等

- 查询布局信息（强制刷新）：offsetWidth、offsetHeight、clientWidth、scrollWidth、getBoundingClientRect() 等

- 修改 DOM 结构：appendChild、removeChild、innerHTML 等

- 读取/设置 scrollTop、scrollLeft

- 修改窗口大小（resize）

- 修改 display: none / block



### 重绘（repaint）

样式改变，但几何尺寸不变 → 只重新绘制像素，不重新布局

主要由颜色、阴影、背景等引起。

触发重绘：

- color/background-color/box-shadow
- visibility


### 性能优化策略

策略 1：减少 DOM 操作次数（最重要）

使用 DocumentFragment（文档片段），批量操作，先在内存中构建，再一次性插入

```js

const fragment = document.createDocumentFragment();

for(let i=0;i<100;i++){
  const li = document.createElement('li');
  li.textContent = i;
  fragment.appendChild(li); // 这里不触发重排！
}

ul.appendChild(fragment); // 仅1次重排

```

策略 2：避免布局抖动（Layout Thrashing）

```js

// 错误的写法（多次强制重排）
for (let i = 0; i < items.length; i++) {
  items[i].style.width = items[i].offsetWidth + 10 + 'px'   // 读 + 写
}

// 好的写法：先集中读，再集中写
const widths = []
items.forEach(item => {
  widths.push(item.offsetWidth)   // 集中读
})

items.forEach((item, i) => {
  item.style.width = widths[i] + 10 + 'px'   // 集中写
})

```

策略 3： 事件委托（Event Delegation）

利用事件冒泡，父元素代理所有子元素事件，大量减少事件绑定数量。

```js

// 差：给 1000 个 li 分别绑定事件
// 好：事件委托
ul.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    console.log('点击了', e.target.textContent)
  }
})

```


### 性能优化checklist

- 不要在循环中频繁读写布局属性

- 批量 DOM 操作尽量使用 DocumentFragment 或 append(...nodes)

- 优先使用 classList 操作类名，而不是 style

- 高频事件（scroll、resize、input）必须做防抖/节流

- 及时清理不再需要的事件监听器（removeEventListener）

- 大量数据渲染时使用虚拟列表（Virtual List）

- 避免使用 innerHTML 拼接大量字符串（安全 + 性能问题）

- 使用 will-change、transform、opacity 开启 GPU 加速（动画场景）


DOM 性能的核心问题 = 重排 + 重绘 + 过多 DOM 操作

优化的核心思路 = 减少 DOM 操作次数 + 批量处理 + 避免布局抖动 + 使用现代 API








