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








## 定位

### absolute 和 relative 分别依据什么定位

### 居中对齐有哪些常见方式




## 图文样式

### line-height 的继承问题



## 响应式

### rem是什么


### 如何实现响应式




 

## CSS3

### CSS3动画






