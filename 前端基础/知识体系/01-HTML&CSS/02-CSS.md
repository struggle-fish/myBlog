# CSS

## 布局

### 盒子模型的宽度如何计算

```html
<!-- 请问div1的 offsetWidht 是多少 -->
<style>
  #div1 {
    width: 100px;
    padding: 10px;
    border: 1px solid #ccc;
    margin: 10px;
  }
</style>
<div id="div1"></div>

offsetWidth = 内容宽度 + 内边距 + 边框 （没有外边距）

标准盒模型：
offsetWidth 不包含 margin 是元素在页面上实际占据的可见宽度

offsetWidth = width +
padding-left + padding-right +
border-left + border-right

内容宽度width = 100px;

可见宽度offsetWidth = 122px(100 + 10*2 + 1*2)

总占用宽度：142px（122 + 10*2 的margin）
```

- 什么是盒模型

CSS盒模型（Box Model）是CSS布局的基础，它将每个HTML元素看作一个矩形的盒子。这个盒子由内到外包含四个区域：**内容（Content）、内边距（Padding）、边框（Border）、外边距（Margin）**。

```md
┌─────────────── margin ────────────────┐
│  ┌─────────── border ───────────────┐ │
│  │  ┌──────── padding ────────────┐ │ │
│  │  │                             │ │ │
│  │  │         Content             │ │ │
│  │  │         内容区               │ │ │
│  │  │                             │ │ │
│  │  └─────────────────────────────┘ │ │
│  └──────────────────────────────────┘ │
└───────────────────────────────────────┘
```

- Content(内容)： 显示文本，图片的内容区域
- Padding(内边距)：内容与边框之间的空白区域，背景色会延伸到这里
- Border(边框)：围绕在内边距外的边框线
- Margin(外边距)：盒子与其他元素之间的空白区域，是透明的


- **两种盒模型**

标准盒模型（W3C盒模型）：默认情况 `box-sizing: content-box`, 设置的`width`只包含内容区域（content）

怪异盒模型（IE盒模型）：`box-sizing: border-box`, 设置的 `width` 包含内容、内边距、边框

:::code-group

```css [标准盒模型宽度计算]
元素总宽度 = width 
+ padding-left + padding-right 
+ border-left + border-right 
+ margin-left + margin-right


元素可见宽度（offsetWidth） = width 
+ padding-left + padding-right 
+ border-left + border-right 
```

```css [怪异盒模型]
元素总宽度 = width + margin-left + margin-right


元素可见宽度（offsetWidth） = width

内容会自动压缩，而且平时`box-sizing: border-box`用的还挺多

```

```css [box-sizing]
/* 标准盒模型 */
.box1 {
  box-sizing: content-box;
  width: 100px;
  padding: 10px;
  border: 1px solide #ccc;
  /* 实际可见宽度 122px */
}
/* IE盒模型 */
.box2 {
  box-sizing: border-box;
  width: 100px;
  padding: 10px;
  border: 1px solid #ccc;
  /* 实际可见宽度 100px */
  /* 实际内容宽度： 78px (100 - 10*2 - 1*2) */
}
```
:::


### margin 纵向重叠的问题

```html
<!-- AAA 和 BBB之间的距离是多少 -->
<style>
p {
  font-size: 16px;
  line-height: 1;
  margin-top: 10px;
  margin-bottom: 15px;
}
</style>
<p>AAA</p>
<p></p>
<p></p>
<p></p>
<p>BBB</p>

相邻元素的 margin-top和margin-bottom会发生重叠

AAA 和 BBB 之间的距离是 15px （所有margin重叠，取最大值）

```

margin 纵向重叠（也叫 margin 合并、margin 折叠）是CSS中的一种规范行为：当两个或多个垂直方向的 margin 相邻时，它们会合并成一个 margin，`其大小取所有相邻 margin 中的最大值`

- 为什么会发生 margin 重叠

这是 CSS 规范的设计，主要目的是：
- 排版需求：在传统排版中，段落之间的距离应该是固定的，而不是累加的
- 避免过大的空白：防止相邻元素的 margin 累加造成过大的间距
- 提供更合理的默认行为： 使文档流中的元素间距更加自然


``` html
<!-- 如果不重叠，两个段落之间会有30px的间距 -->
<p style="margin-bottom: 15px;">第一段</p>
<p style="margin-top: 15px;">第二段</p>

<!-- 但由于重叠，实际间距只有15px，更加合理 -->

```

- **margin 重叠的三种情况**

:::code-group

```html [相邻兄弟]

<div style="margin-bottom: 30px;">元素A</div>
<div style="margin-top: 20px;">元素B</div>
<!-- A和B之间的距离是30px（取最大值），不是50px -->
```

```html [父子元素]
当父元素和第一个/最后一个子元素之间没有边界隔开时
（没有 border、padding、内容、clearfix 等）：
<div class="parent" style="margin-top: 20px;">
  <div class="child" style="margin-top: 30px;">子元素</div>
</div>
<!-- 父元素的实际 margin-top 是30px，不是50px -->
```


```html [空元素]

如果一个元素没有内容、没有 padding、没有 border，
它自己的 margin-top 和 margin-bottom 会重叠：

<div style="margin-top: 20px; margin-bottom: 30px;"></div>
<!-- 这个空元素只占30px的垂直空间 -->
```
:::


- **如何阻止margin重叠**

:::code-group

```css [使用padding]
使用padding代替margin
.ele {
  padding-top: 15px;
  padding-bottom: 15px;
}


```

```css [创建BFC]
块格式化上下文

.container {
  overflow: hidden;
  /* 或者 */
  display: flow-foot;
  /* 或者 */
  display: flex;

  /* 或者 */
  display: grid;
}

```

```css [添加边界]
/* 父子元素之间添加分隔 */

.parent {
  padding-top: 1px;
  /* 或者 */
  border-top: 1px solid transparent;
}

```

``` css [flexbox]
.container {
  display: flex;
  flex-direction: column;
  gap: 15px; 
  /* gap不会发生重叠 */
}
```

``` html [gap的使用]
<style>
.flex-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px 15px; /* 行间距20px，列间距15px；只写一个值则行列间距相同 */
  border: 2px solid blue;
  padding: 10px;
}

.flex-item {
  width: 100px;
  height: 100px;
  background: #42b983;
}
</style>

<div class="flex-container">
  <div class="flex-item">1</div>
  <div class="flex-item">2</div>
  <div class="flex-item">3</div>
  <div class="flex-item">4</div>
</div>

```
:::

- **✅ 会发生重叠的情况**

  - 普通流中的块级元素
  - 垂直方向（margin-top 和 margin-bottom）
  - 相邻 margin


- **❌不会发生重叠情况**

  - 水平方式margin
  - 浮动元素
  - 绝对定位（position:absolute）
  - inline-block元素
  - 创建BFC的元素
  - flex 容器的子元素
  - grid 容易的子元素


:::tip gap的使用

gap 是 CSS 弹性盒（Flex）、网格（Grid）布局中的间距属性，用来设置容器内子元素之间的间距（行间距 + 列间距），替代传统的 margin 间距（避免 margin 叠加 / 计算麻烦）。

核心特点：
- 只作用于子元素之间，不会给容器的边缘加间距；
- 可以拆分为 row-gap（行间距）和 column-gap（列间距），gap 是两者的简写。

:::





### margin 负值

对 margin 的top,left,right,bottom设置负值，有何效果

::: code-group

```html [top负值]

元素自身向上移动，同时下面的元素也会向上移动

<div class="box1">盒子1</div>
<div class="box2" style="margin-top: -20px;">盒子2</div>
<div class="box3">盒子3</div>
<!-- 结果：
- 盒子2 向上移动 20px，可能覆盖盒子1
- 盒子3 也会跟着向上移动 20px
-->

```

``` html [left负值]

元素自身向左移动

<div style="margin-left: -20px;">向左移动20px</div>
<!-- 结果：
- 元素向左偏移，可能超出父容器
- 可能覆盖左侧的元素
-->

```

```html [bottom负值]
元素自身不移动，但下面的元素会向上移动（减小与下方元素的距离）

<div class="box1" style="margin-bottom: -20px;">盒子1</div>
<div class="box2">盒子2</div>

<!-- 结果：
- 盒子1 位置不变
- 盒子2 向上移动 20px，靠近盒子1
- 盒子2 可能覆盖盒子1 的底部
-->

```

```html [right负值]
 元素自身不移动，但右侧的元素会向左移动（减小与右侧元素的距离）

<div style="display: inline-block; margin-right: -20px;">左边</div>
<div style="display: inline-block;">右边</div>

<!-- 结果：
- 左边元素位置不变
- 右边元素向左移动 20px，靠近左边元素
-->

```

```html [总结]
top 、left 负值 自己移动（向top、left方向）

bottom 和 right 负值 ：别人移动（让相邻的元素靠近自己）

```
:::

![LOGO](/public/image/base/ScreenShot_2026-02-10_215719_293.png)


- **应用场景**

:::code-group

```css [元素重叠效果]

/* 制作卡片堆叠效果 */
.card {
  width: 200px;
  height: 100px;
  margin-bottom: -30px; /* 下一个卡片向上覆盖 */
}
```

```css [圣杯布局/双飞翼]
/* 注意这里需要搭配对应结构，后面有具体例子 */
/* 经典的三栏布局 */
.left {
  float: left;
  width: 200px;
  margin-left: -100%; /* 向左移动到最左侧 */
}

.right {
  float: right;
  width: 200px;
  margin-right: -200px; /* 调整位置 */
}

```


```css [破坏容器限制]

/* 让元素突破父容器的边界 */
.container {
  width: 800px;
  padding: 0 20px;
}

.full-width {
  margin-left: -20px;
  margin-right: -20px;
  /* 元素宽度突破容器，占满整个宽度 */
}
```

``` css [网格布局去除多余边距]
/* 消除网格最后一行的底部间距 */
.grid-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: -20px; 
  /* 抵消最后一行元素的 margin-bottom */
}

.grid-item {
  margin-bottom: 20px;
}

```

``` css [元素微调]

/* 调整元素位置实现精确对齐 */
.icon {
  margin-top: -2px; /* 微调图标与文字的垂直对齐 */
}
```

```css [三角形]
/* 配合伪元素制作装饰效果 */
.badge::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  margin-top: -5px;
  margin-right: -5px;
  /* 创建角标效果 */
}

```
:::


**示例**

:::code-group

```html [卡片堆叠]
<style>
.card-stack .card {
  width: 300px;
  height: 150px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: -120px; /* 重叠显示 */
  transition: transform 0.3s;
}

.card-stack .card:hover {
  transform: translateY(-20px); /* 悬停时上移 */
  z-index: 1;
}
</style>

<div class="card-stack">
  <div class="card">卡片 1</div>
  <div class="card">卡片 2</div>
  <div class="card">卡片 3</div>
</div>
```

```html [圣杯三栏自适应]
<style>
.container {
  overflow: hidden;
}

.main {
  float: left;
  width: 100%;
}

.main-content {
  margin: 0 220px 0 220px; /* 为左右栏留空间 */
}

.left {
  float: left;
  width: 200px;
  margin-left: -100%; /* 负值移动到左侧 */
  background: #f0f0f0;
}

.right {
  float: left;
  width: 200px;
  margin-left: -200px; /* 负值移动到右侧 */
  background: #f0f0f0;
}
</style>

<div class="container">
  <div class="main">
    <div class="main-content">中间自适应内容</div>
  </div>
  <div class="left">左侧固定 200px</div>
  <div class="right">右侧固定 200px</div>
</div>
```
:::



**替代方案**

:::code-group

``` css [新方案]
/* 旧方法：使用负 margin */
.old {
  margin-top: -20px;
}

/* 新方法：使用 transform（不影响文档流） */
.new {
  transform: translateY(-20px);
}

/* 旧方法：双飞翼布局 */
/* 使用复杂的负 margin */

/* 新方法：Grid 布局 */
.container {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  gap: 20px;
}

```

:::


### BFC理解和应用

**什么是BFC**

BFC（Block Formatting Context）**块格式化上下文** 是Web页面CSS渲染的一部分，是一个独立的渲染区域，内部元素的布局不会影响外部元素，外部元素也不会影响内部元素。可以把它理解为一个 **"隔离的独立容器"**，`容器内部的元素按照特定规则进行布局。`

**BFC的特性**

- 内部的盒子会在垂直方向一个接一个的放置
- 垂直方向的距离由margin 决定，同一个BFC内相邻的盒子的margin会重叠
- BFC区域不会与float重叠（用于清除浮动）
- BFC 是一个独立的容器，内外元素互不影响
- 计算BFC高度时，浮动元素也参与计算


**如何触发BFC**

```css
/* float 不为 none */
.ele {
  float: left; /* 或 right */
}

/* position 为 absolute 或者 fixed */
.ele {
  position: absolute; /* fixed */
}

/* display为 inline-block */
.ele {
  display: inline-block;
}

/* display 为flex 或者 inline-flex */
.ele {
  display: flex;
}

/* display 为 grid 或者 inline-grid */
.ele {
  display: grid;
}

/* display 为table-cell ,talbe-caption */
.ele {
  display: table-cell;
}

/* overflow 不为 visible */
.ele {
  overflow: hidden; /* 或 auto, scroll */
}

/* display 为flow-root 推荐专门创建BFC */
.ele {
  display: flow-root;
}


```

::: tip flow-root
`flow-root` 是 CSS display 属性的一个值，核心作用是解决容器的 “高度塌陷” 问题（也叫浮动溢出问题）。
简单来说：当容器里的子元素设置了 float（浮动）时，容器本身会因为子元素脱离普通文档流而 “塌掉”，高度变成 0。而给容器加上 display: flow-root 后，容器会自动包裹住所有浮动的子元素，恢复正常的高度。
:::





### float布局问题，以及 clearfix

**float元素的特点**

- 脱离文档流，但不完全脱离（与absolute不同）
- 会导致父元素高度塌陷
- 文字会环绕浮动元素
- 浮动元素会尽可能的向左/右移动


**手写 clearfix**

::: code-group

```css [传统]
/* ✅ 经典 Clearfix 方法（兼容性最好） */
.clearfix::before,
.clearfix::after {
  content: "";
  display: table; /* 创建BFC，防止margin重叠 */
}
.clearfix::after {
  clear: both; /* 清除浮动 */
}
.clearfix {
  *zoom: 1 /* IE兼容 */ 
}
```

```css [简化版]

/* ✅ 简化版（现代浏览器） */
.clearfix::after {
  content: "";
  display: block;
  clear: both;
}

```

``` css [overflow]
/* ✅ 触发 BFC */
.clearfix {
  overflow: hidden; /* 或 auto */
}

```

```css [推荐]
/* ✅ 最现代的方式（IE 不支持） */
.clearfix {
  display: flow-root;
}

```
:::




**如何实现圣杯布局和双飞翼布局**

::: code-group

```html [圣杯]
<!DOCTYPE html>
<html>
<head>
<style>
body {
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* 圣杯布局容器 */
.holy-grail-container {
  padding: 0 220px 0 220px; /* 为左右栏留出空间 */
  min-height: 300px;
}

/* 中间栏（最重要，优先渲染） */
.holy-grail-center {
  float: left;
  width: 100%;
  background: #3498db;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  min-height: 300px;
}

/* 左侧栏 */
.holy-grail-left {
  float: left;
  width: 200px;
  margin-left: -100%; /* 关键：负 margin 回到左侧 */
  position: relative;
  right: 200px; /* 关键：相对定位移到左边 */
  background: #e74c3c;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  min-height: 300px;
}

/* 右侧栏 */
.holy-grail-right {
  float: left;
  width: 200px;
  margin-right: -200px; /* 关键：负 margin 到右侧 */
  background: #27ae60;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  min-height: 300px;
}

/* 清除浮动 */
.holy-grail-container::after {
  content: "";
  display: block;
  clear: both;
}

/* 头部和底部 */
.header, .footer {
  background: #34495e;
  color: white;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
}

.footer {
  margin-top: 20px;
  margin-bottom: 0;
}
</style>
</head>
<body>

<div class="header">
  <h2>圣杯布局示例</h2>
</div>

<div class="holy-grail-container">
  <!-- 注意：中间栏在 HTML 中排第一位，优先渲染 -->
  <div class="holy-grail-center">
    <h3>中间栏（主内容）</h3>
    <p>• width: 100%</p>
    <p>• float: left</p>
    <p>• 在 HTML 中排第一位，优先渲染</p>
    <p>• 宽度自适应</p>
    <br>
    <p><strong>圣杯布局的关键：</strong></p>
    <p>1. 容器设置左右 padding 留空间</p>
    <p>2. 中间栏 width: 100%</p>
    <p>3. 左栏 margin-left: -100% + relative right</p>
    <p>4. 右栏 margin-right: -200px</p>
  </div>
  
  <div class="holy-grail-left">
    <h3>左侧栏</h3>
    <p>• 固定宽度 200px</p>
    <p>• margin-left: -100%</p>
    <p>• position: relative</p>
    <p>• right: 200px</p>
  </div>
  
  <div class="holy-grail-right">
    <h3>右侧栏</h3>
    <p>• 固定宽度 200px</p>
    <p>• margin-right: -200px</p>
  </div>
</div>

<div class="footer">
  <p>页脚</p>
</div>

</body>
</html>

```



```html [双飞翼]
<!DOCTYPE html>
<html>
<head>
<style>
body {
  margin: 0;
  padding: 20px;
  font-family: Arial, sans-serif;
}

/* 双飞翼布局容器 */
.flying-swing-container {
  overflow: hidden; /* 清除浮动 */
}

/* 中间栏外层容器 */
.flying-swing-center-wrap {
  float: left;
  width: 100%;
  background: #3498db;
}

/* 中间栏内层（关键：用 margin 留出左右空间） */
.flying-swing-center {
  margin: 0 220px 0 220px; /* 为左右栏留空间 */
  padding: 20px;
  color: white;
  min-height: 300px;
}

/* 左侧栏 */
.flying-swing-left {
  float: left;
  width: 200px;
  margin-left: -100%; /* 关键：负 margin 回到最左侧 */
  background: #e74c3c;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  min-height: 300px;
}

/* 右侧栏 */
.flying-swing-right {
  float: left;
  width: 200px;
  margin-left: -200px; /* 关键：负 margin 到右侧 */
  background: #27ae60;
  color: white;
  padding: 20px;
  box-sizing: border-box;
  min-height: 300px;
}

.header, .footer {
  background: #34495e;
  color: white;
  padding: 20px;
  text-align: center;
  margin-bottom: 20px;
}

.footer {
  margin-top: 20px;
  margin-bottom: 0;
}
</style>
</head>
<body>

<div class="header">
  <h2>双飞翼布局示例</h2>
</div>

<div class="flying-swing-container">
  <!-- 中间栏需要包裹一层 -->
  <div class="flying-swing-center-wrap">
    <div class="flying-swing-center">
      <h3>中间栏（主内容）</h3>
      <p>• 外层 width: 100%, float: left</p>
      <p>• 内层 margin: 0 220px</p>
      <p>• 在 HTML 中排第一位，优先渲染</p>
      <p>• 宽度自适应</p>
      <br>
      <p><strong>双飞翼布局的关键：</strong></p>
      <p>1. 中间栏需要两层结构</p>
      <p>2. 外层 width: 100%</p>
      <p>3. 内层用 margin 留出空间</p>
      <p>4. 左栏 margin-left: -100%</p>
      <p>5. 右栏 margin-left: -200px</p>
      <br>
      <p><strong>优势：</strong>不需要 relative 定位，更简单</p>
    </div>
  </div>
  
  <div class="flying-swing-left">
    <h3>左侧栏</h3>
    <p>• 固定宽度 200px</p>
    <p>• float: left</p>
    <p>• margin-left: -100%</p>
  </div>
  
  <div class="flying-swing-right">
    <h3>右侧栏</h3>
    <p>• 固定宽度 200px</p>
    <p>• float: left</p>
    <p>• margin-left: -200px</p>
  </div>
</div>

<div class="footer">
  <p>页脚</p>
</div>

</body>
</html>

```

:::


**圣杯布局特点**

三栏布局，中间内容优先渲染，左右固定宽度，中间自适应

```md

HTML 结构顺序（中间优先）：
<container>
  <center>中间</center>  ← 1. 优先渲染
  <left>左侧</left>      ← 2. 其次
  <right>右侧</right>    ← 3. 最后
</container>

布局步骤：

Step 1: 容器设置左右 padding
┌────────────────────────────────────┐
│ padding-left: 220px | padding-right: 220px
│ [空白]     |   [主内容区]   | [空白]
└────────────────────────────────────┘

Step 2: 中间栏 width: 100%, float: left
┌────────────────────────────────────┐
│       [========中间栏========]      │ 100% 宽度
└────────────────────────────────────┘

Step 3: 左侧栏 margin-left: -100%
       向左移动整个容器宽度，到达最左侧
┌────────────────────────────────────┐
│ [左]   [========中间栏========]     │
└────────────────────────────────────┘


Step 4: 左侧栏 position: relative; right: 200px
       再向左移动自身宽度
┌────────────────────────────────────┐
│[左] [========中间栏========]        │
└────────────────────────────────────┘

Step 5: 右侧栏 margin-right: -200px
 右侧没有元素，设置负值 那其实就相当于 右侧没有宽度了
┌────────────────────────────────────┐
│[左] [========中间栏========]   [右]  │
└────────────────────────────────────┘

```

**双飞翼布局特点**

特点： 与圣杯布局类似，但实现方式更简单，不需要 relative 定位


```md

HTML 结构（中间栏有两层）：
<container>
  <center-wrap>          ← 外层容器
    <center>中间</center> ← 内层内容
  </center-wrap>
  <left>左侧</left>
  <right>右侧</right>
</container>

布局步骤：

Step 1: 外层容器 width: 100%, float: left
┌────────────────────────────────────┐
│    [========中间外层========]       │ 100% 宽度
└────────────────────────────────────┘
Step 2: 内层设置 margin 留空间
┌────────────────────────────────────┐
│  [空白] [==中间内层==] [空白]         │
│   220px              220px         │
└────────────────────────────────────┘

Step 3: 左侧栏 margin-left: -100%
┌────────────────────────────────────┐
│[左][空白][==中间内层==][空白]         │
└────────────────────────────────────┘
Step 4: 右侧栏 margin-left: -200px
┌────────────────────────────────────┐
│[左][空白][==中间内层==][空白][右]     │
└────────────────────────────────────┘

最终效果：
┌────────────────────────────────────┐
│[左] [=====中间自适应=====] [右]      │
└────────────────────────────────────┘
```


![LOGO](/public/image/base/ScreenShot_2026-02-11_163537_101.png)

**总结**

- 使用 float 布局
- 两侧使用margin 负值，以便和中间内容横向重叠
- 防止中间内容被两侧覆盖，一个用paidding,一个用margin





**替代方案**

:::code-group

```css [flexbox推荐]
/* 更简单的 Flexbox 实现 */
.flex-layout {
  display: flex;
}

.flex-center {
  flex: 1; /* 自适应 */
  order: 2; /* HTML 可以任意顺序 */
}

.flex-left {
  width: 200px;
  order: 1;
}

.flex-right {
  width: 200px;
  order: 3;
}

/* 响应式 */
@media (max-width: 768px) {
  .flex-layout {
    flex-direction: column;
  }
  
  .flex-left,
  .flex-right {
    width: 100%;
  }
}

```


```css [grid最推荐]
/* Grid 布局：最简洁 */
.grid-layout {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
  /* 左右200px 剩余的1等份 */
  gap: 20px; /* 子元素间距 */
}

/* 响应式 */
@media (max-width: 768px) {
  .grid-layout {
    grid-template-columns: 1fr;
  }
}

```

:::



### flex 画色子

flex 实现一个三点的色子

#### flex的基础概念

```md
主轴方向（flex-direction）：
┌─────────────────────────┐
│ → → → → → → → → → → → │  row（默认，从左到右）
│ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ ↓ │  column（从上到下）
└─────────────────────────┘

交叉轴（垂直于主轴）：
row 时：交叉轴是垂直方向
column 时：交叉轴是水平方向
```

#### 容器属性

::: code-group

```css [flex-direction]
主轴方向
.flex-container {
  flex-direction: row; /* 默认，从左到右 */
  flex-direction: row-reverse; /* 右到左 */
  flex-direction: column; /* 上到下 */
  flex-direction: column-reverse; /* 下到上 */
}

```

```css [flex-wrap]
换行
.flex-container {
  flex-wrap: nowrap; /* 默认 不换行，可能溢出 */
  flex-wrap: wrap; /* 换行 */
  flex-wrap: wrap-reverse; /* 反向换行 */
}

```

```css [flex-flow]
简写
.flex-container {
  flex-flow: row wrap; /* flex-direction + flex-wrap */
}

```

```css [justify-content]
主轴对齐

.flex-container {
  justify-content: flex-start; /* 默认左对齐 */
  justify-content: flex-end; /* 右对齐 */
  justify-content: center; /* 居中 */
  justify-content: space-between; /* 两端对齐 中间等距 */
  justify-content: space-around; /* 每个项目两侧等距 */
  justify-content: space-evenly; /* 所有间距相等 */
}



```

```css [align-item]
交叉轴对齐

.flex-container {
  align-items: stretch; /* 默认拉伸填满 */
  align-items: flex-start; /* 顶部对齐 */
  align-items: flex-end; /* 底部对齐 */
  align-items: center; /* 居中对齐 */
  align-items: baseline; /* 基线对齐 */
}

```

```css [align-content]
多行对齐
.flex-container {
  align-content: stretch; /* 默认 */
  align-content: flex-start; /* 顶部对齐 */
  align-content: flex-end; /* 底部对齐 */
  align-content: center;/* 居中对齐 */
  align-content: space-between; /* 两端对齐 */
  align-content: space-around;/* 等距 */
}

```

:::

#### 项目属性

::: code-group

```css [flex-grow]
放大比例
.flex-item {
  flex-grow: 0; /* 默认不放大 */
  flex-grow: 1; /* 放大，占据剩余空间 */
  flex-grow: 2; /* 放大比例是1 的两倍 */
}

```

```css [flex-shrink]
缩小比例

.flex-item {
  flex-shrink: 1; /* 默认 可以缩小 */
  flex-shrink: 0; /* 不缩小 */
  flex-shrink: 2; /* 缩小比例是1 的2倍  */
}

```

```css [flex-basis]
初试大小

.flex-item {
  flex-basis: auto; /* 默认，基于内容 */
  flex-basis: 200px; /* 初始宽度 200px */
  flex-basis: 0; /* 不考虑内容，完全由flex-grow分配 */
  
}

```

```css [flex]
简写
/* grow shrink basis */
.flex-item {
  flex: 1; /* flex: 1 1 0 */
  flex: 0 1 auto; /* 默认值 不放大，可缩小，基于内容*/
  flex: 1 1  200px; /* grow shrink basis */
  flex: none; /* flex: 0 0 auto 不放大 不缩小 基于内容 */
  flex: auto; /* flex: 1 1 auto  放大 可以缩小，基于内容*/

}


```

```css [align-self]
单个项目对齐

.flex-item {
  /* 继承父容器的 align-items */
  align-self: auto; 
  align-self: flex-start;
  align-self: flex-end;
  align-self: center;
  align-self: stretch;

}

```

```css [order]
排序

.flex-item {
  order: 0; /* 默认 按照html顺序 */
  order: 1; /* 数字越大越靠后 */
  order: -1; /* 负值靠前 */
}

```

:::


#### Flexbox 常见易错点

1. **flex: 1 不等于 width: 100%**
   ```css
   /* ❌ 错误 */
   .item {
     flex: 1;/* 不等于 width: 100% */
     width: 100%; /* 会溢出！ */
   }
   
   /* ✅ 正确 */
   .item {
     flex: 1; /* 自动占据剩余空间 */
      /* 不需要设置 width */
   }
   ```

2. **flex-basis和width的区别**
  ```html
    <style>
      /* flex-basis 是 flex 方向的尺寸 */
      .container {
        display: flex;
        flex-direction: row; /* 主轴是水平 */
      }

      .item {
        flex-basis: 200px; /* 水平方向 200px */
        width: 200px;      /* 也是水平方向 200px，效果相同 */
      }

      /* 但如果改变方向 */
      .container-column {
        display: flex;
        flex-direction: column; /* 主轴是垂直 */
      }

      .item-column {
        flex-basis: 200px; /* 垂直方向 200px（高度） */
        width: 200px;      /* 水平方向 200px（宽度），不同！ */
      }
    </style>
  ```

3. **justify-content 和 align-items 混淆**
   ```css
   /* justify-content：控制主轴对齐（水平方向） */
   .container {
     display: flex;
     justify-content: center; /* 水平居中 */
   }
   
   /* align-items：控制交叉轴对齐（垂直方向） */
   .container {
     display: flex;
     align-items: center; /* 垂直居中 */
     justify-content: center; /* 水平居中 */
   }
   ```

4. **flex: 1 vs flex: 1 1 auto**
   ```css
   /* flex: 1 等同于 flex: 1 1 0% */
   .item1 {
     flex: 1; /* 初始大小为0，完全平分空间 */
     /* 可以放大，可以缩小，初始大小为 0 */
    /* 所有项目平分空间，不考虑内容 所有项目大小相同 */
   }
   
   /* flex: 1 1 auto */
   .item2 {
     flex: 1 1 auto; /* 初始大小基于内容，然后平分剩余空间 */
     /* 可以放大，可以缩小，初始大小基于内容 */
     /*  初始基于内容，然后平分剩余空间 如果内容不同，最终大小可能不同  */
   }
   ```

5. **文本溢出问题**
   ```css
   /* ❌ 文本不会自动换行 */
   .item {
     flex: 1;
   }
   
   /* ✅ 需要设置 min-width: 0 */
   .item {
     flex: 1;
     min-width: 0; /* 允许缩小，文本才能换行 */
     word-wrap: break-word;
   }
   ```

6. **flex-direction 改变主轴方向**
   ```css
   /* row 时：主轴是水平，justify-content 控制水平 */
   .container-row {
     display: flex;
     flex-direction: row;
     justify-content: center; /* 水平居中 */
   }
   
   /* column 时：主轴是垂直，justify-content 控制垂直 */
   .container-column {
     display: flex;
     flex-direction: column;
     justify-content: center; /* 垂直居中 */
   }
   ```

#### 三点色子实现

**核心思路：**
- 使用 `flex-direction: column` 创建垂直布局
- 使用 `justify-content: space-between` 让三行均匀分布
- 每行使用不同的 `justify-content` 值控制点的位置

```html
<!DOCTYPE html>
<html>
<head>
<style>
/* 色子容器 */
.dice {
  width: 200px;
  height: 200px;
  background: white;
  border: 3px solid #333;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  
  /* 关键：flex 布局，垂直方向 */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* 垂直方向：上中下分布 */
}

/* 第一行：左上角 */
.dice-row-1 {
  display: flex;
  justify-content: flex-start; /* 左对齐 */
}

/* 第二行：中间 */
.dice-row-2 {
  display: flex;
  justify-content: center; /* 居中 */
}

/* 第三行：右下角 */
.dice-row-3 {
  display: flex;
  justify-content: flex-end; /* 右对齐 */
}

/* 点（圆） */
.dice-dot {
  width: 40px;
  height: 40px;
  background: #333;
  border-radius: 50%;
}
</style>
</head>
<body>

<div class="dice">
  <div class="dice-row-1">
    <div class="dice-dot"></div>
  </div>
  <div class="dice-row-2">
    <div class="dice-dot"></div>
  </div>
  <div class="dice-row-3">
    <div class="dice-dot"></div>
  </div>
</div>

</body>
</html>
```

**方法2：使用 align-self（更简洁）**

```html
<style>
.dice-v2 {
  width: 200px;
  height: 200px;
  background: white;
  border: 3px solid #333;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dice-dot {
  width: 40px;
  height: 40px;
  background: #333;
  border-radius: 50%;
}

.dice-dot:nth-child(1) {
  align-self: flex-start; /* 左上 */
}

.dice-dot:nth-child(2) {
  align-self: center; /* 中间 */
}

.dice-dot:nth-child(3) {
  align-self: flex-end; /* 右下 */
}
</style>

<div class="dice-v2">
  <div class="dice-dot"></div>
  <div class="dice-dot"></div>
  <div class="dice-dot"></div>
</div>
```

**完整示例：所有点数（1-6点）**

```html
<!DOCTYPE html>
<html>
<head>
<style>
body {
  padding: 40px;
  background: #f0f0f0;
  font-family: Arial, sans-serif;
}

.dice-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
  max-width: 800px;
  margin: 0 auto;
}

.dice-item {
  text-align: center;
}

.dice-item h3 {
  margin-top: 20px;
  color: #333;
}

/* 通用色子样式 */
.dice {
  width: 200px;
  height: 200px;
  background: white;
  border: 3px solid #333;
  border-radius: 20px;
  padding: 20px;
  box-sizing: border-box;
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  margin: 0 auto;
}

.dice-dot {
  width: 40px;
  height: 40px;
  background: #333;
  border-radius: 50%;
}

/* 一点 */
.dice-1 {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 两点 */
.dice-2 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dice-2-row {
  display: flex;
  justify-content: space-between;
}

/* 三点（题目要求） */
.dice-3 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dice-3-row-1 {
  display: flex;
  justify-content: flex-start;
}

.dice-3-row-2 {
  display: flex;
  justify-content: center;
}

.dice-3-row-3 {
  display: flex;
  justify-content: flex-end;
}

/* 四点 */
.dice-4 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dice-4-row {
  display: flex;
  justify-content: space-between;
}

/* 五点 */
.dice-5 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dice-5-row {
  display: flex;
  justify-content: space-between;
}

.dice-5-center {
  display: flex;
  justify-content: center;
}

/* 六点 */
.dice-6 {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.dice-6-row {
  display: flex;
  justify-content: space-between;
}
</style>
</head>
<body>

<h1 style="text-align: center; color: #333;">Flexbox 色子示例</h1>

<div class="dice-container">
  <!-- 一点 -->
  <div class="dice-item">
    <div class="dice dice-1">
      <div class="dice-dot"></div>
    </div>
    <h3>一点</h3>
  </div>

  <!-- 两点 -->
  <div class="dice-item">
    <div class="dice dice-2">
      <div class="dice-2-row">
        <div class="dice-dot"></div>
        <div class="dice-dot"></div>
      </div>
    </div>
    <h3>两点</h3>
  </div>

  <!-- 三点（题目要求） -->
  <div class="dice-item">
    <div class="dice dice-3">
      <div class="dice-3-row-1">
        <div class="dice-dot"></div>
      </div>
      <div class="dice-3-row-2">
        <div class="dice-dot"></div>
      </div>
      <div class="dice-3-row-3">
        <div class="dice-dot"></div>
      </div>
    </div>
    <h3>三点（对角线）</h3>
  </div>

  <!-- 四点 -->
  <div class="dice-item">
    <div class="dice dice-4">
      <div class="dice-4-row">
        <div class="dice-dot"></div>
        <div class="dice-dot"></div>
      </div>
      <div class="dice-4-row">
        <div class="dice-dot"></div>
        <div class="dice-dot"></div>
      </div>
    </div>
    <h3>四点</h3>
  </div>

  <!-- 五点 -->
  <div class="dice-item">
    <div class="dice dice-5">
      <div class="dice-5-row">
        <div class="dice-dot"></div>
        <div class="dice-dot"></div>
      </div>
      <div class="dice-5-center">
        <div class="dice-dot"></div>
      </div>
      <div class="dice-5-row">
        <div class="dice-dot"></div>
        <div class="dice-dot"></div>
      </div>
    </div>
    <h3>五点</h3>
  </div>

  <!-- 六点 -->
  <div class="dice-item">
    <div class="dice dice-6">
      <div class="dice-6-row">
        <div class="dice-dot"></div>
        <div class="dice-dot"></div>
      </div>
      <div class="dice-6-row">
        <div class="dice-dot"></div>
        <div class="dice-dot"></div>
      </div>
      <div class="dice-6-row">
        <div class="dice-dot"></div>
        <div class="dice-dot"></div>
      </div>
    </div>
    <h3>六点</h3>
  </div>
</div>

</body>
</html>
```

**三点色子实现要点：**

1. **外层容器**：`flex-direction: column` + `justify-content: space-between` 让三行垂直均匀分布
2. **第一行**：`justify-content: flex-start` 让点靠左（左上角）
3. **第二行**：`justify-content: center` 让点居中（中间）
4. **第三行**：`justify-content: flex-end` 让点靠右（右下角）

这样就形成了对角线的三点布局！






## 定位

### 什么是定位（Position）

CSS 定位（Position）用于控制元素在文档流中的位置。通过 `position` 属性，可以让元素脱离正常的文档流，或者相对于某个参考点进行定位。

### 定位类型总览

CSS 提供了 5 种定位类型：

```css
.element {
  position: static;    /* 默认值：静态定位 */
  position: relative;  /* 相对定位 */
  position: absolute; /* 绝对定位 */
  position: fixed;    /* 固定定位 */
  position: sticky;   /* 粘性定位 */         
}
```

### 1. static（静态定位）- 默认值

**特点：**
- 元素按照正常的文档流排列
- `top`、`right`、`bottom`、`left`、`z-index` 属性无效
- 这是所有元素的默认定位方式
 
```html
<style>
.static-box {
  position: static; /* 默认值，可以不写 */
  /* top、left 等属性无效 */
}
</style>
```

### 2. relative（相对定位）

**定位依据：相对于元素自身原来的位置进行偏移**

**特点：**
- 元素仍然占据原来的空间（不会脱离文档流）
- 可以通过 `top`、`right`、`bottom`、`left` 相对于**自身原来的位置**进行偏移
- 偏移后，原来的位置会留下空白（其他元素不会填补）
- 常用于作为 `absolute` 定位的参考点（定位上下文）

```html
<!DOCTYPE html>
<html>
<head>
<style>
.container {
  width: 500px;
  border: 2px solid #3498db;
  padding: 20px;
  margin: 20px;
}

.normal-box {
  width: 100px;
  height: 100px;
  background: #e74c3c;
  color: white;
  text-align: center;
  line-height: 100px;
}

/* 相对定位：相对于自身原来的位置 */
.relative-box {
  position: relative;
  top: 20px;    /* 向下移动 20px */
  left: 30px;  /* 向右移动 30px */
  background: #27ae60;
  /* 注意：原来的位置仍然占据空间 */
}
</style>
</head>
<body>

<div class="container">
  <div class="normal-box">普通盒子</div>
  <div class="relative-box">相对定位</div>
  <div class="normal-box">普通盒子</div>
</div>

</body>
</html>
```

**relative 定位依据总结：**
- ✅ 相对于**元素自身原来的位置**
- ✅ 不脱离文档流，原位置保留
- ✅ 常用于微调元素位置
- ✅ 作为 absolute 子元素的定位参考点

### 3. absolute（绝对定位）

**定位依据：相对于最近的已定位（非 static）的祖先元素，如果没有则相对于 `<html>` 或初始包含块**

**特点：**
- 元素脱离文档流（不占据空间）
- 可以通过 `top`、`right`、`bottom`、`left` 进行定位
- 定位参考点：**最近的已定位祖先元素**（position 不为 static）
- 如果没有已定位的祖先，则相对于 `<html>` 或初始包含块

```html
<!DOCTYPE html>
<html>
<head>
<style>
/* 示例1：相对于最近的已定位祖先 */
.relative-parent {
  position: relative; /* 关键：创建定位上下文 */
  width: 400px;
  height: 300px;
  border: 3px solid #3498db;
  margin: 20px;
  background: #ecf0f1;
}

.absolute-child {
  position: absolute;
  top: 20px;    /* 相对于 relative-parent 的顶部 */
  right: 30px;  /* 相对于 relative-parent 的右侧 */
  width: 100px;
  height: 100px;
  background: #e74c3c;
  color: white;
  text-align: center;
  line-height: 100px;
}

/* 示例2：没有已定位祖先，相对于 html */
.absolute-no-parent {
  position: absolute;
  top: 0;       /* 相对于 html 的顶部 */
  left: 0;      /* 相对于 html 的左侧 */
  width: 150px;
  height: 150px;
  background: #27ae60;
  color: white;
  text-align: center;
  line-height: 150px;
}

/* 示例3：父元素未定位 */
.static-parent {
  position: static; /* 默认值，未定位 */
  width: 400px;
  height: 300px;
  border: 3px solid #f39c12;
  margin: 20px;
  background: #fef5e7;
}

.absolute-no-context {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 100px;
  height: 100px;
  background: #9b59b6;
  color: white;
  text-align: center;
  line-height: 100px;
}
</style>
</head>
<body>

<h3>示例1：相对于已定位的父元素</h3>
<div class="relative-parent">
  <div class="absolute-child">绝对定位</div>
  <p>这个绝对定位元素相对于红色边框的父容器定位</p>
</div>

<h3>示例2：没有已定位祖先，相对于 html</h3>
<div class="absolute-no-parent">
  相对于 html
</div>

<h3>示例3：父元素未定位（static）</h3>
<div class="static-parent">
  <div class="absolute-no-context">绝对定位</div>
  <p>父元素是 static，所以这个元素相对于 html 定位，而不是父元素</p>
</div>

</body>
</html>
```

**absolute 定位依据总结：**
- ✅ 相对于**最近的已定位祖先元素**（position 不为 static）
- ✅ 如果没有已定位祖先，则相对于 `<html>` 或初始包含块
- ✅ 脱离文档流，不占据空间
- ✅ 常用于创建悬浮层、下拉菜单、工具提示等

**定位上下文（Containing Block）查找规则：**
```
1. 查找父元素
2. 如果父元素 position 不是 static → 使用父元素作为参考
3. 如果父元素是 static → 继续向上查找
4. 如果所有祖先都是 static → 使用 html 作为参考
```

### 4. fixed（固定定位）

**定位依据：相对于浏览器视口（viewport）进行定位**

**特点：**
- 元素脱离文档流
- 相对于**浏览器窗口**进行定位
- 滚动页面时，元素位置固定不变
- 常用于导航栏、返回顶部按钮、广告等

```html
<!DOCTYPE html>
<html>
<head>
<style>
.fixed-header {
  position: fixed;
  top: 0;        /* 相对于视口顶部 */
  left: 0;       /* 相对于视口左侧 */
  width: 100%;   /* 占满整个宽度 */
  height: 60px;
  background: #34495e;
  color: white;
  text-align: center;
  line-height: 60px;
  z-index: 1000; /* 确保在其他元素之上 */
}

.fixed-button {
  position: fixed;
  bottom: 30px;  /* 相对于视口底部 */
  right: 30px;   /* 相对于视口右侧 */
  width: 60px;
  height: 60px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  text-align: center;
  line-height: 60px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0,0,0,0.3);
}

.content {
  margin-top: 80px; /* 为固定头部留出空间 */
  padding: 20px;
  height: 2000px; /* 模拟长页面 */
}
</style>
</head>
<body>

<div class="fixed-header">固定头部导航栏</div>

<div class="content">
  <h2>页面内容</h2>
  <p>滚动页面时，头部和按钮位置保持不变</p>
  <p>...</p>
</div>

<div class="fixed-button">↑</div>

</body>
</html>
```

**fixed 定位依据总结：**
- ✅ 相对于**浏览器视口（viewport）**
- ✅ 滚动页面时位置不变
- ✅ 脱离文档流

### 5. sticky（粘性定位）

**定位依据：在滚动容器中，当元素到达指定位置时"粘住"**

**特点：**
- 结合了 `relative` 和 `fixed` 的特点
- 在滚动到阈值之前，表现为 `relative`
- 滚动到阈值之后，表现为 `fixed`
- 需要指定 `top`、`right`、`bottom` 或 `left` 之一

```html
<!DOCTYPE html>
<html>
<head>
<style>
.sticky-header {
  position: sticky;
  top: 0;        /* 当滚动到顶部时，粘住 */
  background: #3498db;
  color: white;
  padding: 15px;
  z-index: 100;
}

.content-section {
  height: 500px;
  padding: 20px;
  background: #ecf0f1;
  margin-bottom: 20px;
}
</style>
</head>
<body>

<div class="content-section">
  <h2>第一部分</h2>
  <p>滚动页面...</p>
</div>

<div class="sticky-header">
  <h2>粘性头部（滚动到这里会粘住）</h2>
</div>

<div class="content-section">
  <h2>第二部分</h2>
  <p>继续滚动...</p>
</div>

<div class="content-section">
  <h2>第三部分</h2>
  <p>更多内容...</p>
</div>

</body>
</html>
```

**sticky 定位依据总结：**
- ✅ 在滚动容器内，相对于**最近的滚动祖先**
- ✅ 到达阈值前：表现为 `relative`
- ✅ 到达阈值后：表现为 `fixed`

### 定位类型对比表

| 定位类型  | 定位依据 | 是否脱离文档流 | 原位置保留 | 常用场景 |
|---------|---------|--------------|-----------|---------|
| **static**   | 正常文档流      | ❌ | ✅ | 默认布局 |
| **relative** | 自身原位置      | ❌ | ✅ | 微调位置、作为定位上下文 |
| **absolute** | 最近的已定位祖先 | ✅ | ❌ | 悬浮层、下拉菜单 |
| **fixed**    | 浏览器视口      | ✅ | ❌ | 固定导航、返回顶部 |
| **sticky**   | 滚动容器 | 到达阈值后脱离 | ✅ | 粘性导航、表头固定 |

### absolute 和 relative 详细对比

#### relative 定位依据

```css
.relative-box {
  position: relative;
  top: 20px;
  left: 30px;
}
```

**定位依据：**
- ✅ 相对于**元素自身原来的位置**
- ✅ 偏移后，原位置仍然占据空间
- ✅ 其他元素不会填补原位置

**可视化：**
```
原位置：[元素]
        ↓ top: 20px, left: 30px
新位置：      [元素]
原位置仍然占据空间，形成"空白"
```

#### absolute 定位依据

```css
.parent {
  position: relative; /* 创建定位上下文 */
}

.child {
  position: absolute;
  top: 20px;
  left: 30px;
}
```

**定位依据：**
- ✅ 相对于**最近的已定位祖先元素**（position 不为 static）
- ✅ 如果没有已定位祖先，相对于 `<html>`
- ✅ 脱离文档流，不占据空间

**可视化：**
```
父元素（relative）：
┌─────────────────────┐
│                     │
│    [子元素]          │ ← 相对于父元素定位
│                     │
└─────────────────────┘

如果没有已定位父元素：
<html>
└─ [元素] ← 相对于 html 定位
```

### 实际应用场景

#### 场景1：relative 作为定位上下文

```html
<style>
/* 父元素创建定位上下文 */
.dropdown {
  position: relative; /* 关键 */
  display: inline-block;
}

.dropdown-menu {
  position: absolute; /* 相对于 dropdown 定位 */
  top: 100%;
  left: 0;
  display: none;
  background: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.dropdown:hover .dropdown-menu {
  display: block;
}
</style>

<div class="dropdown">
  <button>菜单</button>
  <div class="dropdown-menu">
    <a href="#">选项1</a>
    <a href="#">选项2</a>
  </div>
</div>
```

#### 场景2：absolute 实现居中

```css
/* 方法1：已知宽高 */
.center-box {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 200px;
  height: 200px;
  margin-top: -100px;  /* 负值：向上移动自身高度的一半 */
  margin-left: -100px; /* 负值：向左移动自身宽度的一半 */
}

/* 方法2：未知宽高（推荐） */
.center-box-v2 {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* 使用 transform */
}
```

#### 场景3：fixed 固定导航

```css
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  background: white;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
}

/* 内容需要留出导航栏空间 */
.content {
  margin-top: 60px;
}
```

### 重要知识点总结

1. **relative**：相对于自身原位置，不脱离文档流
2. **absolute**：相对于最近的已定位祖先，脱离文档流
3. **fixed**：相对于视口，脱离文档流
4. **sticky**：滚动时粘住，结合 relative 和 fixed
5. **定位上下文**：absolute 元素会向上查找已定位的祖先
6. **z-index**：只有定位元素（非 static）才能使用 z-index



### 居中对齐有哪些常见方式

CSS 实现水平垂直居中有多种方法，不同场景适用不同方案。

#### 方法1：Flexbox（最推荐）

**优点：** 简单、灵活、现代浏览器支持好

**适用场景：** 现代浏览器，最常用

```html
<!DOCTYPE html>
<html>
<head>
<style>
/* 方法1.1：父容器使用 flex */
.flex-center {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center;     /* 垂直居中 */
  width: 400px;
  height: 300px;
  background: #ecf0f1;
  border: 2px solid #3498db;
}

.flex-center .child {
  width: 100px;
  height: 100px;
  background: #e74c3c;
  color: white;
  text-align: center;
  line-height: 100px;
}
</style>
</head>
<body>

<div class="flex-center">
  <div class="child">Flexbox 居中</div>
</div>

</body>
</html>
```


#### 方法2：Grid（推荐）

**优点：** 代码简洁，一行搞定
**适用场景：** 现代浏览器，代码最简洁

```html
<style>
.grid-center {
  display: grid;
  place-items: center; /* 水平垂直居中 */
  width: 400px;
  height: 300px;
  background: #ecf0f1;
  border: 2px solid #27ae60;
}

.grid-center .child {
  width: 100px;
  height: 100px;
  background: #27ae60;
  color: white;
  text-align: center;
  line-height: 100px;
}
</style>

<div class="grid-center">
  <div class="child">Grid 居中</div>
</div>
```



#### 方法3：Absolute + Transform（经典方法）

**优点：** 兼容性好，不需要知道元素宽高

**适用场景：** 需要兼容旧浏览器，元素宽高未知

```html
<style>
.absolute-center {
  position: relative; /* 父元素相对定位 */
  width: 400px;
  height: 300px;
  background: #ecf0f1;
  border: 2px solid #f39c12;
}

.absolute-center .child {
  position: absolute;
  top: 50%;           /* 向下移动 50% */
  left: 50%;          /* 向右移动 50% */
  transform: translate(-50%, -50%); /* 向上向左各移动自身 50% */
  width: 100px;
  height: 100px;
  background: #f39c12;
  color: white;
  text-align: center;
  line-height: 100px;
}
</style>

<div class="absolute-center">
  <div class="child">Absolute + Transform</div>
</div>
```



#### 方法4：Absolute + Margin（已知宽高）

**优点：** 兼容性好，性能好（不需要 transform）

**适用场景：** 元素宽高已知，需要兼容旧浏览器

```html
<style>
.absolute-margin {
  position: relative;
  width: 400px;
  height: 300px;
  background: #ecf0f1;
  border: 2px solid #9b59b6;
}

.absolute-margin .child {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100px;
  height: 100px;
  margin-top: -50px;  /* 负值：向上移动自身高度的一半 */
  margin-left: -50px; /* 负值：向左移动自身宽度的一半 */
  background: #9b59b6;
  color: white;
  text-align: center;
  line-height: 100px;
}
</style>

<div class="absolute-margin">
  <div class="child">Absolute + Margin</div>
</div>
```



#### 方法5：Table-Cell（传统方法）

**优点：** 兼容性极好，支持 IE8+

**适用场景：** 需要兼容 IE8 等旧浏览器

```html
<style>
.table-center {
  display: table-cell;
  vertical-align: middle; /* 垂直居中 */
  text-align: center;     /* 水平居中 */
  width: 400px;
  height: 300px;
  background: #ecf0f1;
  border: 2px solid #34495e;
}

.table-center .child {
  display: inline-block; /* 必须设置为 inline-block */
  width: 100px;
  height: 100px;
  background: #34495e;
  color: white;
  text-align: center;
  line-height: 100px;
}
</style>

<div class="table-center">
  <div class="child">Table-Cell 居中</div>
</div>
```



#### 方法6：Line-Height（仅适用于单行文本）

**优点：** 简单，适合单行文本

**适用场景：** 单行文本垂直居中

```html
<style>
.line-height-center {
  width: 400px;
  height: 300px;
  line-height: 300px; /* 等于容器高度 */
  text-align: center;  /* 水平居中 */
  background: #ecf0f1;
  border: 2px solid #e67e22;
}

.line-height-center .child {
  display: inline-block;
  vertical-align: middle; /* 垂直对齐 */
  line-height: normal;     /* 恢复正常的行高 */
}
</style>

<div class="line-height-center">
  <span class="child">单行文本居中</span>
</div>
```



#### 方法7：Flexbox + Margin Auto

**优点：** 灵活，子元素可以单独控制

```html
<style>
.flex-margin {
  display: flex;
  width: 400px;
  height: 300px;
  background: #ecf0f1;
  border: 2px solid #16a085;
}

.flex-margin .child {
  margin: auto; /* 自动外边距，实现居中 */
  width: 100px;
  height: 100px;
  background: #16a085;
  color: white;
  text-align: center;
  line-height: 100px;
}
</style>

<div class="flex-margin">
  <div class="child">Flex + Margin Auto</div>
</div>
```

#### 方法8：Grid + Margin Auto

**优点：** 简洁，类似 Flexbox

```html
<style>
.grid-margin {
  display: grid;
  width: 400px;
  height: 300px;
  background: #ecf0f1;
  border: 2px solid #d35400;
}

.grid-margin .child {
  margin: auto;
  width: 100px;
  height: 100px;
  background: #d35400;
  color: white;
  text-align: center;
  line-height: 100px;
}
</style>

<div class="grid-margin">
  <div class="child">Grid + Margin Auto</div>
</div>
```

### 完整对比示例

```html
<!DOCTYPE html>
<html>
<head>
<style>
body {
  padding: 20px;
  font-family: Arial, sans-serif;
}

.methods-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

.method-item {
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
}

.method-item h3 {
  margin-top: 0;
  color: #2c3e50;
}

.demo-box {
  width: 300px;
  height: 200px;
  background: #ecf0f1;
  border: 2px solid #3498db;
  margin: 10px 0;
}

.demo-child {
  width: 80px;
  height: 80px;
  background: #e74c3c;
  color: white;
  text-align: center;
  line-height: 80px;
  font-size: 12px;
}

/* 方法1：Flexbox */
.method1 {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 方法2：Grid */
.method2 {
  display: grid;
  place-items: center;
}

/* 方法3：Absolute + Transform */
.method3 {
  position: relative;
}

.method3 .demo-child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* 方法4：Absolute + Margin */
.method4 {
  position: relative;
}

.method4 .demo-child {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -40px;
  margin-left: -40px;
}

/* 方法5：Table-Cell */
.method5 {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

.method5 .demo-child {
  display: inline-block;
}

/* 方法6：Line-Height */
.method6 {
  line-height: 200px;
  text-align: center;
}

.method6 .demo-child {
  display: inline-block;
  vertical-align: middle;
  line-height: normal;
}

/* 方法7：Flex + Margin Auto */
.method7 {
  display: flex;
}

.method7 .demo-child {
  margin: auto;
}

/* 方法8：Grid + Margin Auto */
.method8 {
  display: grid;
}

.method8 .demo-child {
  margin: auto;
}
</style>
</head>
<body>

<h1 style="text-align: center;">CSS 水平垂直居中方法对比</h1>

<div class="methods-container">
  <div class="method-item">
    <h3>方法1：Flexbox</h3>
    <div class="demo-box method1">
      <div class="demo-child">Flex</div>
    </div>
    <p><strong>优点：</strong>简单、灵活</p>
    <p><strong>兼容性：</strong>IE10+</p>
  </div>

  <div class="method-item">
    <h3>方法2：Grid</h3>
    <div class="demo-box method2">
      <div class="demo-child">Grid</div>
    </div>
    <p><strong>优点：</strong>代码最简洁</p>
    <p><strong>兼容性：</strong>现代浏览器</p>
  </div>

  <div class="method-item">
    <h3>方法3：Absolute + Transform</h3>
    <div class="demo-box method3">
      <div class="demo-child">Transform</div>
    </div>
    <p><strong>优点：</strong>不需要知道宽高</p>
    <p><strong>兼容性：</strong>IE9+</p>
  </div>

  <div class="method-item">
    <h3>方法4：Absolute + Margin</h3>
    <div class="demo-box method4">
      <div class="demo-child">Margin</div>
    </div>
    <p><strong>优点：</strong>性能好</p>
    <p><strong>缺点：</strong>需要知道宽高</p>
  </div>

  <div class="method-item">
    <h3>方法5：Table-Cell</h3>
    <div class="demo-box method5">
      <div class="demo-child">Table</div>
    </div>
    <p><strong>优点：</strong>兼容性最好</p>
    <p><strong>兼容性：</strong>IE8+</p>
  </div>

  <div class="method-item">
    <h3>方法6：Line-Height</h3>
    <div class="demo-box method6">
      <div class="demo-child">Line</div>
    </div>
    <p><strong>优点：</strong>简单</p>
    <p><strong>缺点：</strong>仅单行文本</p>
  </div>

  <div class="method-item">
    <h3>方法7：Flex + Margin Auto</h3>
    <div class="demo-box method7">
      <div class="demo-child">Flex+</div>
    </div>
    <p><strong>优点：</strong>灵活</p>
    <p><strong>兼容性：</strong>IE10+</p>
  </div>

  <div class="method-item">
    <h3>方法8：Grid + Margin Auto</h3>
    <div class="demo-box method8">
      <div class="demo-child">Grid+</div>
    </div>
    <p><strong>优点：</strong>简洁</p>
    <p><strong>兼容性：</strong>现代浏览器</p>
  </div>
</div>

</body>
</html>
```

### 方法选择指南

| 场景 | 推荐方法 | 原因 |
|------|---------|------|
| **现代浏览器** | Flexbox 或 Grid | 简单、灵活 |
| **需要兼容 IE8** | Table-Cell | 兼容性最好 |
| **元素宽高未知** | Absolute + Transform | 不需要计算 |
| **元素宽高已知** | Absolute + Margin | 性能更好 |
| **单行文本** | Line-Height | 最简单 |
| **代码最简洁** | Grid + place-items | 一行搞定 |

### 最佳实践推荐

**现代项目（推荐）：**
```css
/* 首选：Flexbox */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 或 Grid */
.container {
  display: grid;
  place-items: center;
}
```

**需要兼容旧浏览器：**
```css
/* 使用 Absolute + Transform */
.container {
  position: relative;
}

.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

**需要兼容 IE8：**
```css
/* 使用 Table-Cell */
.container {
  display: table-cell;
  vertical-align: middle;
  text-align: center;
}

.child {
  display: inline-block;
}
```

### 总结

**最常用的三种方法：**

1. **Flexbox** - 现代项目首选
   ```css
   display: flex;
   justify-content: center;
   align-items: center;
   ```

2. **Grid** - 代码最简洁
   ```css
   display: grid;
   place-items: center;
   ```

3. **Absolute + Transform** - 兼容性好，不需要知道宽高
   ```css
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   ```




## 图文样式

### line-height 的继承问题

#### 什么是 line-height

`line-height` 用于设置行高，控制文本行与行之间的垂直间距。

**语法：**
```css
.element {
  line-height: normal;      /* 默认值，通常为 1.2 */
  line-height: 1.5;          /* 无单位数字：相对值 */
  line-height: 24px;         /* 固定像素值 */
  line-height: 150%;        /* 百分比：相对值 */
  line-height: 1.5em;        /* em 单位：相对值 */
}
```

#### line-height 的值类型

1. **无单位数字（推荐）**
   ```css
   line-height: 1.5; /* 相对于当前元素的 font-size */
   ```

2. **百分比**
   ```css
   line-height: 150%; /* 相对于当前元素的 font-size */
   ```

3. **em 单位**
   ```css
   line-height: 1.5em; /* 相对于当前元素的 font-size */
   ```

4. **固定像素值**
   ```css
   line-height: 24px; /* 固定值，不随 font-size 变化 */
   ```

#### 继承机制和问题

**关键问题：** 不同单位在继承时的计算方式不同！

##### 问题1：百分比和 em 的继承问题

```html
<!DOCTYPE html>
<html>
<head>
<style>
/* 父元素 */
.parent {
  font-size: 20px;
  line-height: 150%; /* 计算后 = 20px × 1.5 = 30px */
}

/* 子元素 */
.child {
  font-size: 12px; /* 更小的字体 */
  /* 继承的是计算后的值：30px（而不是 150%） */
  /* 问题：30px 对于 12px 的字体来说太大了！ */
}
</style>
</head>
<body>

<div class="parent">
  <p>父元素：font-size: 20px, line-height: 150% = 30px</p>
  <div class="child">
    子元素：font-size: 12px，但继承的 line-height 是 30px
    <br>
    问题：行高 30px 对于 12px 的字体来说太大了！
  </div>
</div>

</body>
</html>
```

**问题分析：**
- 父元素：`font-size: 20px`，`line-height: 150%` → 计算后 = **30px**
- 子元素继承的是**计算后的值 30px**，而不是百分比 150%
- 子元素：`font-size: 12px`，但 `line-height: 30px` → 行高比例 = 30/12 = **2.5倍**（太大了！）

##### 问题2：无单位数字的继承（正确方式）

```html
<!DOCTYPE html>
<html>
<head>
<style>
/* 父元素 */
.parent-correct {
  font-size: 20px;
  line-height: 1.5; /* 无单位数字 */
}

/* 子元素 */
.child-correct {
  font-size: 12px;
  /* 继承的是 1.5（倍数），不是计算后的值 */
  /* 实际 line-height = 12px × 1.5 = 18px ✅ */
}
</style>
</head>
<body>

<div class="parent-correct">
  <p>父元素：font-size: 20px, line-height: 1.5</p>
  <div class="child-correct">
    子元素：font-size: 12px，继承 line-height: 1.5
    <br>
    实际行高 = 12px × 1.5 = 18px ✅ 比例正确！
  </div>
</div>

</body>
</html>
```

**正确分析：**
- 父元素：`font-size: 20px`，`line-height: 1.5` → 实际行高 = 30px
- 子元素继承的是**倍数 1.5**，而不是计算后的值
- 子元素：`font-size: 12px`，`line-height: 1.5` → 实际行高 = **18px** ✅

#### 完整对比示例

```html
<!DOCTYPE html>
<html>
<head>
<style>
body {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.demo-section {
  margin-bottom: 40px;
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
}

.demo-section h3 {
  margin-top: 0;
  color: #2c3e50;
}

/* 问题示例：百分比 */
.parent-percent {
  font-size: 20px;
  line-height: 150%; /* 计算后 = 30px */
  background: #fee;
}

.child-percent {
  font-size: 12px;
  /* 继承 30px，对于 12px 字体来说太大 */
  background: #fdd;
  padding: 5px;
}

/* 问题示例：em */
.parent-em {
  font-size: 20px;
  line-height: 1.5em; /* 计算后 = 30px */
  background: #efe;
}

.child-em {
  font-size: 12px;
  /* 继承 30px，对于 12px 字体来说太大 */
  background: #dfd;
  padding: 5px;
}

/* 正确示例：无单位数字 */
.parent-number {
  font-size: 20px;
  line-height: 1.5; /* 继承倍数 */
  background: #eef;
}

.child-number {
  font-size: 12px;
  /* 继承 1.5，实际 = 12px × 1.5 = 18px ✅ */
  background: #ddf;
  padding: 5px;
}

/* 固定像素值的问题 */
.parent-px {
  font-size: 20px;
  line-height: 30px; /* 固定值 */
  background: #ffe;
}

.child-px {
  font-size: 12px;
  /* 继承 30px，对于 12px 字体来说太大 */
  background: #ffd;
  padding: 5px;
}

.info {
  margin-top: 10px;
  padding: 10px;
  background: #f5f5f5;
  border-left: 4px solid #3498db;
  font-size: 14px;
}
</style>
</head>
<body>

<h1>line-height 继承问题对比</h1>

<div class="demo-section">
  <h3>❌ 问题1：百分比继承（150%）</h3>
  <div class="parent-percent">
    <p>父元素：font-size: 20px, line-height: 150% = 30px</p>
    <div class="child-percent">
      子元素：font-size: 12px<br>
      继承的 line-height: 30px（计算后的值）<br>
      行高比例：30px ÷ 12px = 2.5倍（太大了！）
    </div>
  </div>
  <div class="info">
    <strong>问题：</strong>子元素继承的是计算后的像素值（30px），而不是百分比。
    对于 12px 的字体，30px 的行高比例过大。
  </div>
</div>

<div class="demo-section">
  <h3>❌ 问题2：em 单位继承（1.5em）</h3>
  <div class="parent-em">
    <p>父元素：font-size: 20px, line-height: 1.5em = 30px</p>
    <div class="child-em">
      子元素：font-size: 12px<br>
      继承的 line-height: 30px（计算后的值）<br>
      行高比例：30px ÷ 12px = 2.5倍（太大了！）
    </div>
  </div>
  <div class="info">
    <strong>问题：</strong>em 单位在继承时也会传递计算后的值，导致子元素行高比例不正确。
  </div>
</div>

<div class="demo-section">
  <h3>✅ 正确：无单位数字继承（1.5）</h3>
  <div class="parent-number">
    <p>父元素：font-size: 20px, line-height: 1.5</p>
    <div class="child-number">
      子元素：font-size: 12px<br>
      继承的 line-height: 1.5（倍数）<br>
      实际行高：12px × 1.5 = 18px ✅<br>
      行高比例：1.5倍（正确！）
    </div>
  </div>
  <div class="info">
    <strong>正确：</strong>无单位数字在继承时传递的是倍数，子元素会根据自己的 font-size 重新计算。
  </div>
</div>

<div class="demo-section">
  <h3>❌ 问题3：固定像素值（30px）</h3>
  <div class="parent-px">
    <p>父元素：font-size: 20px, line-height: 30px</p>
    <div class="child-px">
      子元素：font-size: 12px<br>
      继承的 line-height: 30px（固定值）<br>
      行高比例：30px ÷ 12px = 2.5倍（太大了！）
    </div>
  </div>
  <div class="info">
    <strong>问题：</strong>固定像素值不会根据子元素的字体大小调整，导致比例失调。
  </div>
</div>

</body>
</html>
```

#### 继承规则总结

| 值类型 | 继承方式 | 子元素计算 | 是否推荐 |
|--------|---------|-----------|---------|
| **无单位数字** | 继承倍数 | `子font-size × 倍数` | ✅ 推荐 |
| **百分比** | 继承计算后的值 | 直接使用继承的值 | ❌ 不推荐 |
| **em** | 继承计算后的值 | 直接使用继承的值 | ❌ 不推荐 |
| **px** | 继承固定值 | 直接使用继承的值 | ❌ 不推荐 |


:::tip

写具体值，如30px, 则继承改值

写比例 如 2 / 1.5 ，则继承该比例

写百分比，如200% 则继承计算出来的值

:::

#### 解决方案

##### 方案1：使用无单位数字（最佳实践）

```css
/* ✅ 推荐：无单位数字 */
body {
  font-size: 16px;
  line-height: 1.5; /* 子元素会继承 1.5，而不是计算后的值 */
}

.child {
  font-size: 12px;
  /* 实际 line-height = 12px × 1.5 = 18px ✅ */
}
```

##### 方案2：在子元素中重新设置

```css
/* 如果父元素使用了百分比或 em */
.parent {
  font-size: 20px;
  line-height: 150%; /* 不推荐，但已使用 */
}

.child {
  font-size: 12px;
  line-height: 1.5; /* 重新设置为无单位数字 */
  /* 或 */
  line-height: 18px; /* 直接设置合适的值 */
}
```

##### 方案3：使用 CSS 变量

```css
:root {
  --line-height-ratio: 1.5;
}

.parent {
  font-size: 20px;
  line-height: calc(20px * var(--line-height-ratio));
}

.child {
  font-size: 12px;
  line-height: calc(12px * var(--line-height-ratio)); /* 使用变量重新计算 */
}
```

#### 实际应用示例

```html
<!DOCTYPE html>
<html>
<head>
<style>
/* ✅ 正确的全局设置 */
body {
  font-size: 16px;
  line-height: 1.5; /* 无单位数字，推荐 */
}

/* 标题 */
h1 {
  font-size: 32px;
  /* 继承 line-height: 1.5 */
  /* 实际行高 = 32px × 1.5 = 48px ✅ */
}

h2 {
  font-size: 24px;
  /* 继承 line-height: 1.5 */
  /* 实际行高 = 24px × 1.5 = 36px ✅ */
}

/* 小字体 */
.small-text {
  font-size: 12px;
  /* 继承 line-height: 1.5 */
  /* 实际行高 = 12px × 1.5 = 18px ✅ */
}

/* 大字体 */
.large-text {
  font-size: 20px;
  /* 继承 line-height: 1.5 */
  /* 实际行高 = 20px × 1.5 = 30px ✅ */
}

/* ❌ 错误示例：使用百分比 */
.wrong-parent {
  font-size: 16px;
  line-height: 150%; /* 计算后 = 24px */
}

.wrong-child {
  font-size: 12px;
  /* 继承 24px，对于 12px 字体来说太大 */
  /* 行高比例 = 24px ÷ 12px = 2倍 ❌ */
}
</style>
</head>
<body>

<h1>这是标题（32px，行高 48px）</h1>
<h2>这是副标题（24px，行高 36px）</h2>
<p>这是正文（16px，行高 24px）</p>
<p class="small-text">这是小字体（12px，行高 18px）✅</p>
<p class="large-text">这是大字体（20px，行高 30px）✅</p>

<div class="wrong-parent">
  <p>父元素使用百分比</p>
  <p class="wrong-child">子元素继承后行高比例失调 ❌</p>
</div>

</body>
</html>
```

#### 最佳实践总结

1. **优先使用无单位数字**
   ```css
   line-height: 1.5; /* 推荐 */
   ```

2. **避免使用百分比和 em（在需要继承的场景）**
   ```css
   line-height: 150%; /* 不推荐，继承时有问题 */
   line-height: 1.5em; /* 不推荐，继承时有问题 */
   ```

3. **固定像素值仅用于特定场景**
   ```css
   line-height: 24px; /* 仅在确定不需要继承时使用 */
   ```

4. **全局设置建议**
   ```css
   body {
     font-size: 16px;
     line-height: 1.5; /* 无单位数字，所有子元素都会正确继承 */
   }
   ```

#### 常见问题 Q&A

**Q1: 为什么无单位数字更好？**

A: 因为无单位数字在继承时传递的是倍数，子元素会根据自己的 font-size 重新计算，保持正确的行高比例。

**Q2: 什么时候可以用百分比或 em？**

A: 当元素不会作为父元素被继承时可以使用，但为了代码一致性，建议统一使用无单位数字。

**Q3: 如何选择合适的 line-height 值？**

A: 通常 1.4-1.6 之间比较合适，1.5 是最常用的值。标题可以稍小（1.2-1.4），正文稍大（1.5-1.8）。
 


## 响应式

### 什么是响应式设计（Responsive Design）

**响应式设计**是一种网页设计方法，使网站能够在不同设备和屏幕尺寸上提供最佳的浏览体验。页面会根据屏幕宽度自动调整布局、字体大小和元素排列。

**核心特点：**
- 一套代码，适配多种设备（PC、平板、手机）
- 使用弹性布局（Flexbox、Grid）
- 使用相对单位（rem、vw、vh、%）
- 使用媒体查询（Media Queries）

**响应式 vs 自适应：**
- **响应式**：布局会"流动"，元素会重新排列
- **自适应**：固定几个断点，在不同断点显示不同布局

### CSS 单位详解

#### 1. px（像素）- 绝对单位

**定义：** 像素是屏幕上的一个点，是固定的物理单位。

**特点：**
- ✅ 精确控制，不会随其他因素变化
- ❌ 不响应式，在不同设备上显示大小固定
- ❌ 用户无法通过浏览器缩放调整

**使用场景：**
```css
/* 边框、阴影等需要精确控制的地方 */
.border {
  border: 1px solid #000;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

/* 固定尺寸的图标 */
.icon {
  width: 16px;
  height: 16px;
}
```

#### 2. rem（Root EM）- 相对单位

**定义：** 相对于**根元素（html）的 font-size** 计算的单位。

**计算公式：**
```
rem 值 = rem 数字 × 根元素 font-size
```

**特点：**
- ✅ 响应式，可以通过改变根元素 font-size 统一缩放
- ✅ 易于维护，只需修改根元素即可
- ✅ 相对单位，用户可以通过浏览器缩放调整

**使用示例：**
```html
<!DOCTYPE html>
<html>
<head>
<style>
/* 设置根元素 font-size */
html {
  font-size: 16px; /* 默认值，1rem = 16px */
}

/* 使用 rem */
.text {
  font-size: 1.5rem;    /* 1.5 × 16px = 24px */
  margin: 1rem;          /* 1 × 16px = 16px */
  padding: 0.5rem;       /* 0.5 × 16px = 8px */
}

/* 响应式：改变根元素 font-size */
@media (max-width: 768px) {
  html {
    font-size: 14px; /* 1rem = 14px，所有 rem 值自动缩小 */
  }
}
</style>
</head>
<body>

<div class="text">
  这段文字使用 rem 单位，会随根元素 font-size 变化
</div>

</body>
</html>
```

**rem 的优势：**
```css
/* 只需修改根元素，所有 rem 值都会自动调整 */
html {
  font-size: 16px; /* 桌面端 */
}

@media (max-width: 768px) {
  html {
    font-size: 14px; /* 移动端，所有 rem 自动缩小 */
  }
}

/* 所有使用 rem 的元素都会自动响应 */
.container {
  width: 20rem;    /* 桌面：320px，移动：280px */
  padding: 1rem;    /* 桌面：16px，移动：14px */
  font-size: 1.2rem; /* 桌面：19.2px，移动：16.8px */
}
```

#### 3. em - 相对单位

**定义：** 相对于**当前元素或父元素的 font-size** 计算的单位。

**特点：**
- ✅ 相对于父元素，适合局部缩放
- ❌ 继承问题，可能导致嵌套时计算复杂
- ⚠️ 如果父元素 font-size 改变，所有 em 值都会改变

**使用示例：**
```css
.parent {
  font-size: 16px;
}

.child {
  font-size: 1.5em;    /* 1.5 × 16px = 24px */
  margin: 2em;          /* 2 × 24px = 48px（相对于自己的 font-size）*/
  padding: 0.5em;       /* 0.5 × 24px = 12px */
}
```

**em vs rem：**
```css
/* em：相对于父元素 */
.parent {
  font-size: 20px;
}

.child {
  font-size: 1.5em;    /* 30px（相对于父元素 20px）*/
  margin: 1em;          /* 30px（相对于自己的 font-size）*/
}

/* rem：相对于根元素 */
html {
  font-size: 16px;
}

.element {
  font-size: 1.5rem;    /* 24px（相对于根元素 16px）*/
  margin: 1rem;          /* 16px（相对于根元素 16px）*/
}
```

#### 4. vw（Viewport Width）- 视口宽度单位

**定义：** 相对于**视口宽度**的单位，1vw = 视口宽度的 1%。

**特点：**
- ✅ 直接响应视口宽度变化
- ✅ 适合全屏布局
- ⚠️ 在小屏幕上可能太小，需要设置最小值

**使用示例：**
```css
/* 全屏宽度 */
.full-width {
  width: 100vw; /* 占满整个视口宽度 */
}

/* 响应式字体 */
.responsive-text {
  font-size: 5vw; /* 字体大小 = 视口宽度的 5% */
  /* 视口 1000px 时：50px */
  /* 视口 500px 时：25px */
}

/* 响应式容器 */
.container {
  width: 80vw;    /* 视口宽度的 80% */
  max-width: 1200px; /* 设置最大值，避免过大 */
  min-width: 320px;  /* 设置最小值，避免过小 */
}
```

#### 5. vh（Viewport Height）- 视口高度单位

**定义：** 相对于**视口高度**的单位，1vh = 视口高度的 1%。

**特点：**
- ✅ 适合全屏高度布局
- ✅ 响应视口高度变化
- ⚠️ 移动端浏览器地址栏会影响视口高度

**使用示例：**
```css
/* 全屏高度 */
.full-height {
  height: 100vh; /* 占满整个视口高度 */
}

/* 响应式高度 */
.section {
  height: 50vh; /* 视口高度的 50% */
}

/* 垂直居中容器 */
.center-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

#### 6. %（百分比）- 相对单位

**定义：** 相对于**父元素**的对应属性值。

**特点：**
- ✅ 相对于父元素，适合嵌套布局
- ⚠️ 不同属性参考的父元素属性不同
- ⚠️ 需要父元素有明确尺寸

**使用示例：**
```css
.parent {
  width: 500px;
  height: 300px;
}

.child {
  width: 50%;    /* 相对于父元素 width：250px */
  height: 50%;   /* 相对于父元素 height：150px */
  margin: 10%;   /* 相对于父元素 width：50px */
  padding: 5%;   /* 相对于父元素 width：25px */
}
```

**百分比参考规则：**
- `width`、`height`：相对于父元素的 width、height
- `margin`、`padding`：相对于父元素的 **width**（即使是垂直方向）
- `font-size`：相对于父元素的 font-size
- `line-height`：相对于当前元素的 font-size

### 单位对比表

| 单位 | 参考基准 | 响应式 | 适用场景 | 示例 |
|------|---------|--------|---------|------|
| **px** | 屏幕像素 | ❌ | 边框、阴影、固定图标 | `16px` |
| **rem** | 根元素 font-size | ✅ | 字体、间距、布局（推荐） | `1.5rem` |
| **em** | 父元素 font-size | ✅ | 局部缩放、按钮内边距 | `1.2em` |
| **vw** | 视口宽度 | ✅ | 全屏宽度、响应式字体 | `50vw` |
| **vh** | 视口高度 | ✅ | 全屏高度、垂直布局 | `100vh` |
| **%** | 父元素对应属性 | ✅ | 嵌套布局、宽度高度 | `50%` |

### rem 是什么

**rem（Root EM）** 是相对于根元素（`<html>`）的 `font-size` 计算的相对单位。

**核心特点：**
1. **相对根元素**：1rem = 根元素 font-size 的值
2. **统一缩放**：修改根元素 font-size，所有 rem 值都会按比例变化
3. **易于维护**：只需控制根元素，就能控制整个页面的缩放

**计算方式：**
```css
html {
  font-size: 16px; /* 默认值 */
}

/* 1rem = 16px */
.element {
  font-size: 1rem;    /* 16px */
  width: 2rem;        /* 32px */
  margin: 0.5rem;     /* 8px */
}
```

**响应式应用：**
```css
/* 桌面端 */
html {
  font-size: 16px; /* 1rem = 16px */
}

/* 平板端 */
@media (max-width: 768px) {
  html {
    font-size: 14px; /* 1rem = 14px，所有 rem 自动缩小 */
  }
}

/* 移动端 */
@media (max-width: 480px) {
  html {
    font-size: 12px; /* 1rem = 12px，进一步缩小 */
  }
}
```

### 如何实现响应式设计

#### 方法1：使用 rem + 媒体查询（推荐）

**核心思路：** 通过媒体查询改变根元素 font-size，所有 rem 值自动响应。

```html
<!DOCTYPE html>
<html>
<head>
<style>
/* 基础设置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 桌面端：默认 */
html {
  font-size: 16px; /* 1rem = 16px */
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.5;
}

/* 容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem; /* 32px */
}

/* 标题 */
h1 {
  font-size: 2.5rem; /* 40px */
  margin-bottom: 1.5rem; /* 24px */
}

/* 文本 */
p {
  font-size: 1rem; /* 16px */
  margin-bottom: 1rem; /* 16px */
}

/* 按钮 */
.button {
  font-size: 1rem; /* 16px */
  padding: 0.75rem 1.5rem; /* 12px 24px */
  border-radius: 0.5rem; /* 8px */
}

/* 平板端 */
@media (max-width: 768px) {
  html {
    font-size: 14px; /* 1rem = 14px */
  }
  
  /* 所有 rem 值自动缩小 */
  /* h1: 2.5rem = 35px（原来是 40px）*/
  /* p: 1rem = 14px（原来是 16px）*/
}

/* 移动端 */
@media (max-width: 480px) {
  html {
    font-size: 12px; /* 1rem = 12px */
  }
  
  .container {
    padding: 1rem; /* 12px */
  }
  
  h1 {
    font-size: 2rem; /* 24px */
  }
}
</style>
</head>
<body>

<div class="container">
  <h1>响应式标题</h1>
  <p>这是一段使用 rem 单位的文本，会根据屏幕尺寸自动调整大小。</p>
  <button class="button">响应式按钮</button>
</div>

</body>
</html>
```

#### 方法2：使用 vw/vh 单位

**核心思路：** 直接使用视口单位，自动响应视口变化。

```css
/* 响应式字体 */
.responsive-heading {
  font-size: 5vw; /* 视口宽度的 5% */
  min-font-size: 24px; /* 设置最小值 */
  max-font-size: 48px; /* 设置最大值 */
}

/* 响应式容器 */
.responsive-container {
  width: 90vw;    /* 视口宽度的 90% */
  max-width: 1200px;
  min-width: 320px;
  margin: 0 auto;
}

/* 全屏布局 */
.fullscreen {
  width: 100vw;
  height: 100vh;
}
```

#### 方法3：使用 Flexbox/Grid + 媒体查询

**核心思路：** 使用弹性布局配合媒体查询改变布局结构。

```html
<!DOCTYPE html>
<html>
<head>
<style>
/* 桌面端：3列布局 */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 2rem;
}

.grid-item {
  background: #ecf0f1;
  padding: 1.5rem;
  border-radius: 8px;
}

/* 平板端：2列布局 */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    padding: 1.5rem;
  }
}

/* 移动端：1列布局 */
@media (max-width: 480px) {
  .grid-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
}
</style>
</head>
<body>

<div class="grid-container">
  <div class="grid-item">项目 1</div>
  <div class="grid-item">项目 2</div>
  <div class="grid-item">项目 3</div>
</div>

</body>
</html>
```

#### 方法4：使用 CSS 变量 + rem

**核心思路：** 结合 CSS 变量，更灵活地控制响应式。

```css
:root {
  --base-font-size: 16px;
  --spacing-unit: 1rem;
}

/* 桌面端 */
html {
  font-size: var(--base-font-size);
}

.container {
  padding: calc(var(--spacing-unit) * 2);
  font-size: var(--base-font-size);
}

/* 移动端 */
@media (max-width: 480px) {
  :root {
    --base-font-size: 14px;
  }
  
  html {
    font-size: var(--base-font-size);
  }
}
```

#### 完整响应式示例

```html
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 关键：设置 viewport meta 标签 */
/* <meta name="viewport" content="width=device-width, initial-scale=1.0"> */

/* 根元素 font-size */
html {
  font-size: 16px; /* 桌面端 */
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
}

/* 响应式容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 响应式导航 */
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #34495e;
  color: white;
}

.nav-links {
  display: flex;
  gap: 2rem;
  list-style: none;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
}

/* 响应式标题 */
h1 {
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

/* 响应式网格 */
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-top: 2rem;
}

.card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.card p {
  font-size: 1rem;
  line-height: 1.6;
}

/* 平板端 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
  
  .nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
  
  h1 {
    font-size: 2rem;
  }
}

/* 移动端 */
@media (max-width: 480px) {
  html {
    font-size: 12px;
  }
  
  .container {
    padding: 1rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  h1 {
    font-size: 1.75rem;
  }
  
  .card {
    padding: 1rem;
  }
}
</style>
</head>
<body>

<nav class="nav">
  <div class="logo">Logo</div>
  <ul class="nav-links">
    <li><a href="#">首页</a></li>
    <li><a href="#">关于</a></li>
    <li><a href="#">联系</a></li>
  </ul>
</nav>

<div class="container">
  <h1>响应式设计示例</h1>
  <p>这个页面使用 rem 单位和媒体查询实现响应式布局。</p>
  
  <div class="grid">
    <div class="card">
      <h3>卡片 1</h3>
      <p>使用 rem 单位，会根据屏幕尺寸自动调整。</p>
    </div>
    <div class="card">
      <h3>卡片 2</h3>
      <p>在不同设备上提供最佳浏览体验。</p>
    </div>
    <div class="card">
      <h3>卡片 3</h3>
      <p>一套代码，适配多种设备。</p>
    </div>
  </div>
</div>

</body>
</html>
```

### 响应式设计最佳实践

1. **设置 viewport meta 标签**
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. **使用相对单位**
   - 优先使用 `rem` 用于字体和间距
   - 使用 `%` 用于宽度
   - 使用 `vw/vh` 用于全屏布局

3. **设置断点**
   ```css
   /* 移动端 */
   @media (max-width: 480px) { }
   
   /* 平板端 */
   @media (max-width: 768px) { }
   
   /* 桌面端 */
   @media (min-width: 1024px) { }
   ```

4. **移动优先（Mobile First）**
   ```css
   /* 先写移动端样式 */
   .element {
     font-size: 14px;
   }
   
   /* 再写桌面端样式 */
   @media (min-width: 768px) {
     .element {
       font-size: 16px;
     }
   }
   ```

5. **使用弹性布局**
   - Flexbox 和 Grid 自动适应容器大小
   - 减少媒体查询的使用

### 单位选择指南

| 场景 | 推荐单位 | 原因 |
|------|---------|------|
| **字体大小** | rem | 统一缩放，易于维护 |
| **间距（margin/padding）** | rem | 与字体大小协调 |
| **容器宽度** | % 或 vw | 响应式，适应父容器 |
| **全屏布局** | vw/vh | 直接响应视口 |
| **边框、阴影** | px | 需要精确控制 |
| **固定图标** | px | 固定尺寸 |
| **局部缩放** | em | 相对于父元素 |

### 总结

**响应式设计核心：**
1. 使用相对单位（rem、vw、vh、%）
2. 使用媒体查询设置断点
3. 使用弹性布局（Flexbox、Grid）
4. 设置 viewport meta 标签

**单位选择建议：**
- **rem**：字体、间距（推荐）
- **vw/vh**：全屏布局、响应式字体
- **%**：宽度、高度
- **px**：边框、阴影、固定图标


### 网页视口高度

```javascript

window.screen.height // 屏幕高度

window.innerHeight // 网页视口高度

document.body.clientHeight // body高度



```









