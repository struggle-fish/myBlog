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

### 块元素特点

- 独占一行，默认宽度是父容器的100%
- 可以设置宽度、高度、内外边距
- 块级元素内可以包含块级元素和内联元素


### 常见块元素

::: code-group

```html [布局结构]
<div>、<header>、<footer>、<nav>、
<section>、<article>、<aside>、<main>
```
```html [标题]
<h1> ~ <h6>
```

```html [段落和文本]
<p>、<blockquote>、<pre>
```

```html [列表]
<ul>、<ol>、<li>、<dl>、<dt>、<dd>
```

```html [表格和表单]
<table>、<thead>、<tbody>、<tfoot>、<tr>
<form>
```
:::


### 内联元素特点

- 不会独占一行，与其他内联元素同一行显示
- 高度和宽度由内容决定，无法设置 `width` 和 `height`
- 只能设置左右外边距，上下边距无效（padding 上下视觉有效但不占空间）
- 内联元素只能包含文本和其他内联元素

### 常见内联元素

```html
<span>、<a>、<strong>、<b>、<em>、
<i>、<small>、<mark>、<del>、
<ins>、<sub>、<sup>、<label>

```


### 内联块元素

- 结合了块元素和内联元素的特点
- 不独占一行，可以设置宽高和所有边距


### 常见内联块元素

```html
<img>
<input>
<button>
<select>
<textarea>
<iframe>

```

### display 属性转化

```css
/*内联转块*/
display: block/table 

/*块转内联*/
display: inline

/*内联转内联块*/
display: inline-block
```





























