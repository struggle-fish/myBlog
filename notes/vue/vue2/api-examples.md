---
outline: deep
---



# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题


* 这是第1句
+ 这是第2句
- 这是第3句



1. 我的天哪
1. 这么神奇
1. 小岳岳



* [ ] 吃饭
* [ ] 睡觉
* [x] 打豆豆


> 青玉案·元夕
>> 辛弃疾
>>>东风夜放花千树。更吹落、星如雨。宝马雕车香满路。凤箫声动，玉壶光转，一夜鱼龙舞。
>>>蛾儿雪柳黄金缕。笑语盈盈暗香去。众里寻他千百度。蓦然回首，那人却在，灯火阑珊处。


*斜体字*

**粗体字**

~~删除线~~

`高亮`

<u>下划线</u>

<span style="border-bottom:2px dashed yellow;">加下划线用的是html代码</span>



![小岳岳](https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20181204%2F86b842eb7b6648cca02e9254c751041d.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1644145498&t=5d9dfddd717d73b1b129cd0cec967f92)


[百度](http://www.baidu.com)

[百度](http://www.baidu.com "百度一下，你就知道")

<http://www.baidu.com/>




分隔线1*星号
***

分隔线2-+换行+横杠

---

分隔线3_下划线
___




`突出文字`


```sh
pnpm vuepress dev
```


````sh
```
pnpm vuepress build
```
````


```diff
- pnpm add -D vuepress@next
+ pnpm add -D vuepress@next @vuepress/client@next vue
```

:tada: :100:

> 更新时间：2024年

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::


::: danger STOP
危险区域，请勿继续
:::

::: details 点我查看代码
```js
console.log('Hello, VitePress!')
```
:::



::: code-group

```js [config.js]
/**
 * @type {import('vitepress').UserConfig}
 */
const config = {
  // ...
}

export default config
```

```ts [config.ts]
import type { UserConfig } from 'vitepress'

const config: UserConfig = {
  // ...
}

export default config
```

:::











# 2222Runtime API Examples

This page demonstrates usage of some of the runtime APIs provided by VitePress.

The main `useData()` API can be used to access site, theme, and page data for the current page. It works in both `.md` and `.vue` files:

```md
<script setup>
import { useData } from 'vitepress'

const { theme, page, frontmatter } = useData()
</script>

## Results

### Theme Data3
<pre>{{ theme }}</pre>

### Page Data
<pre>{{ page }}</pre>

### Page Frontmatter
<pre>{{ frontmatter }}</pre>
```


