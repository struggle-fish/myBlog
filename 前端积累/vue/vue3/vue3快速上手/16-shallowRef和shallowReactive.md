# shallowRef 与 shallowReactive 


浅层次的 Ref 和 Reactive


## shallowRef

### 作用

创建一个响应式数据，但只对顶层属性进行响应式处理。

只对「基本类型值（数字、字符串、布尔等）」或「对象的引用地址」做响应式，不会递归处理对象内部的属性；

```js

let myVar = shallowRef(initialValue);


import { ref, shallowRef } from 'vue';

// 1. ref：深层响应式
const refObj = ref({ name: '张三', age: 18 });
refObj.value.age = 20; // 修改对象内部属性 → 触发视图更新

// 2. shallowRef：浅层响应式
const shallowObj = shallowRef({ name: '张三', age: 18 });
shallowObj.value.age = 20; // 修改对象内部属性 → 不触发视图更新
shallowObj.value = { name: '李四', age: 22 }; // 修改引用地址 → 触发视图更新

```



特点：只跟踪引用值的变化，不关心值内部的属性变化。


### 使用场景

1. 处理超大对象（如后端返回的海量数据）

如果后端返回一个包含上千条数据的大对象 / 数组，且你只需要展示，不需要修改内部属性，用 shallowRef 替代 ref：

- ref 会递归遍历整个大对象，给每个属性加响应式监听，耗时且占内存；
- shallowRef 只监听对象的引用地址，无需遍历内部，性能大幅提升。

2. 处理第三方库的实例（如 `Chart.js/Echarts` 实例）

第三方库的实例对象（如 Echarts 图表实例）通常不需要 Vue 做响应式处理，且内部属性极多：

- 用 ref 包裹会导致响应式系统过度监听，甚至和第三方库的内部逻辑冲突；
- 用 shallowRef 仅监听实例的引用变化，既满足 “实例替换时更新视图”，又避免性能损耗。

```js

import { shallowRef, onMounted } from 'vue';
import * as echarts from 'echarts';

// 用 shallowRef 包裹 Echarts 实例
const chartInstance = shallowRef(null);

onMounted(() => {
  // 初始化实例（修改引用地址，触发响应式）
  chartInstance.value = echarts.init(document.getElementById('chart'));
  // 修改实例内部属性（不触发响应式，不影响性能）
  chartInstance.value.setOption({ /* 配置项 */ });
});

```

3. 不可变数据（仅整体替换，不修改内部）

如果你的业务逻辑中，某个对象只会整体替换，不会修改内部属性，用 shallowRef 更高效：

```js

// 仅整体替换的场景：比如分页切换，直接替换整个列表
const pageData = shallowRef({ list: [], page: 1 });

// 分页切换：修改引用地址，触发更新（符合 shallowRef 设计）
const changePage = (newPage) => {
  pageData.value = { list: getNewList(newPage), page: newPage };
};

```

4. 临时缓存非响应式数据

如果某个数据只是 “临时存储”，不需要响应式，仅在 “替换时更新视图”，用 shallowRef：

```js

// 缓存图片预览的临时数据，仅替换时更新
const previewImg = shallowRef({ url: '', alt: '' });

// 点击图片：整体替换，触发预览视图更新
const showPreview = (img) => {
  previewImg.value = img;
};

```


## shallowReactive


### 作用
创建一个浅层响应式对象，只会使对象的最顶层属性变成响应式的，对象内部的嵌套属性则不会变成响应式的

简单来说，shallowReactive 就是 “只管对象第一层，不管嵌套里面的” 响应式 API，专门用来处理那些 “只操作顶层属性、嵌套属性仅展示” 的场景。


核心特点：只对对象的第一层属性做响应式处理，不会递归处理嵌套对象的内部属性；

对比 reactive：reactive 是 “深层响应式”—— 对象中所有层级的属性都会被监听；
而 shallowReactive 是 “浅层响应式”—— 仅监听对象第一层属性的「引用变化」，嵌套对象内部的修改不会触发视图更新。


```js

import { reactive, shallowReactive } from 'vue';

// 1. reactive：深层响应式
const deepObj = reactive({
  name: '张三',
  info: { age: 18 } // 嵌套对象
});
deepObj.info.age = 20; // 修改嵌套属性 → 触发视图更新

// 2. shallowReactive：浅层响应式
const shallowObj = shallowReactive({
  name: '张三',
  info: { age: 18 } // 嵌套对象
});
shallowObj.name = '李四'; // 修改第一层属性 → 触发视图更新
shallowObj.info.age = 20; // 修改嵌套属性 → 不触发视图更新
shallowObj.info = { age: 22 }; // 替换嵌套对象的引用 → 触发视图更新（因为第一层 info 引用变了）

```


### 使用场景

1. 处理 “第一层属性常变、嵌套属性只读” 的大对象

比如后端返回的复杂表单数据，表单仅需修改第一层字段（如 status），嵌套的详情数据仅用于展示：

```js

// 后端返回的大对象：嵌套层级深，仅第一层 status 需修改
const formData = shallowReactive({
  status: 'draft', // 第一层属性：需监听修改
  detail: { // 嵌套对象：仅展示，不修改
    name: '订单1',
    items: [{ id: 1, price: 100 }, /* 海量嵌套数据 */]
  }
});

// 修改第一层属性 → 触发更新（符合业务需求）
formData.status = 'submit'; 
// 修改嵌套属性 → 不触发更新（无需监听，节省性能）
formData.detail.items[0].price = 200;

```


2. 封装第三方库的配置对象

第三方库（如地图、编辑器）的配置对象通常层级深、内部属性无需 Vue 监听，仅需监听顶层配置的替换：

```js

import { shallowReactive, onMounted } from 'vue';
import mapLib from '第三方地图库';

// 地图配置：仅需监听第一层的 center/zoom，嵌套的 style 无需响应式
const mapConfig = shallowReactive({
  center: [116, 39],
  zoom: 10,
  style: { // 嵌套配置：仅初始化时设置，不修改
    color: 'red',
    size: 10
  }
});

onMounted(() => {
  mapLib.init(mapConfig);
  // 修改第一层属性 → 触发地图重新渲染
  mapConfig.zoom = 12;
  // 修改嵌套属性 → 无响应式，不触发更新（符合预期）
  mapConfig.style.color = 'blue';
});

```

3. 临时存储 “仅整体替换嵌套对象” 的业务数据

比如分页列表数据，列表的 pageNum（第一层）需监听，list（嵌套数组）仅整体替换，无需监听内部元素：


```js

const pageData = shallowReactive({
  pageNum: 1,
  list: [{ id: 1, name: '张三' }, /* 列表数据 */]
});

// 翻页：替换整个 list 引用 → 触发更新（符合需求）
const changePage = (newPage) => {
  pageData.pageNum = newPage;
  pageData.list = getListByPage(newPage); // 整体替换嵌套数组
};

// 修改列表内部元素 → 不触发更新（无需监听，节省性能）
pageData.list[0].name = '李四';


```




![LOGO](/public/image/base/ScreenShot_2026-03-22_204747_701.png)






