# HTML 


## 如何理解HTML语义化

**HTML语义化**是指使用恰当的HTML标签来描述页面的内容结构，让标签本身就能传达其包含内容的含义。

### 核心概念

1. **用正确的标签做正确的事**
   - 使用 `<header>` 表示页眉，而不是 `<div class="header">`
   - 使用 `<nav>` 表示导航，而不是 `<div class="nav">`
   - 使用 `<article>` 表示文章内容
   - 使用 `<h1>`-`<h6>` 表示标题层级

2. **常用的语义化标签**
   - 结构标签：`<header>`、`<nav>`、`<main>`、`<aside>`、`<footer>`、`<section>`、`<article>`
   - 文本标签：`<h1>`-`<h6>`、`<p>`、`<strong>`、`<em>`、`<mark>`
   - 列表标签：`<ul>`、`<ol>`、`<li>`
   - 表格标签：`<table>`、`<thead>`、`<tbody>`、`<th>`、`<td>`

### 为什么要使用语义化

1. **提高可读性和可维护性**
   - 代码结构清晰，开发者更容易理解页面结构
   - 团队协作时降低沟通成本

2. **利于SEO优化**
   - 搜索引擎爬虫能更好地理解页面内容
   - 提高页面在搜索结果中的排名

3. **提升无障碍性（Accessibility）**
   - 屏幕阅读器能更准确地解析内容
   - 帮助视障用户更好地浏览网页

4. **便于其他设备解析**
   - 移动设备、智能设备能更好地适配内容
   - 提高跨平台兼容性

### 示例对比

::: code-group
```html [非语义化]
<!-- ❌ 非语义化写法 -->
<div class="header">
  <div class="nav">
    <div class="menu-item">首页</div>
  </div>
</div>
<div class="content">
  <div class="title">文章标题</div>
  <div class="text">文章内容...</div>
</div>


```

```html [语义化]
<!-- ✅ 语义化写法 -->
<header>
  <nav>
    <ul>
      <li>首页</li>
    </ul>
  </nav>
</header>
<main>
  <article>
    <h1>文章标题</h1>
    <p>文章内容...</p>
  </article>
</main>
```

:::





## 默认情况下，哪些HTML 标签是块级元素，那些是内联元素































