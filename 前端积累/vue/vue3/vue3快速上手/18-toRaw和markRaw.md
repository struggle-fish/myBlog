# toRaw 和 markRaw

两者都是 Vue3 提供的脱离响应式系统的 API，核心作用是 “绕过 Vue 的响应式代理”，但方向相反


## toRaw

获取「响应式对象」的原始对象（即被代理前的原数据），从响应式代理中还原原始数据

处理的是“已经变成响应式的对象”，目的是“拿回原对象” 即**已经代理了，拿原始值**

```js

import { reactive, toRaw, markRaw } from 'vue';

// 1. toRaw 示例：获取响应式对象的原始对象
const original = { name: '张三' };
const reactiveObj = reactive(original); // 创建响应式代理
const rawObj = toRaw(reactiveObj);     // 还原原始对象

console.log(rawObj === original); // ✅ true（rawObj 是原数据）
reactiveObj.name = '李四';        // 响应式修改 → 视图更新
rawObj.name = '王五';              // 修改原始对象 → 不触发视图更新

```

核心细节

- 仅对 Vue 创建的响应式代理有效：toRaw 只能还原 `reactive/ref/shallowReactive/shallowRef` 创建的响应式对象，普通对象调用 toRaw 会返回自身；
- 原始对象无响应式：修改原始对象不会触发依赖收集和视图更新；
- 引用关系：原始对象和响应式代理指向不同的内存地址，但内容是同步的（代理是对原始对象的劫持）。
 
 
## 使用场景

1. 修改数据但不想触发视图更新

比如批量修改大量数据时，先获取原始对象修改，再赋值回响应式对象，减少多次触发视图更新的性能损耗：

```js

import { reactive, toRaw } from 'vue';

const bigList = reactive([/* 1000条数据的大列表 */]);

// 优化前：每次修改都触发更新，性能差
bigList.forEach(item => item.age += 1);

// 优化后：先改原始对象，再赋值，仅触发一次更新
const rawList = toRaw(bigList);
rawList.forEach(item => item.age += 1);
// 重新赋值（触发一次更新）
bigList = reactive(rawList); // 或直接修改后无需赋值，仅需手动触发更新（若需视图同步）

```


2. 传递数据给第三方库，避免代理冲突

第三方库（如 Echarts、Lodash）可能不兼容 Vue 的响应式代理，传递原始对象可避免异常：


```js

import { reactive, toRaw } from 'vue';
import * as echarts from 'echarts';

const chartData = reactive({ /* 图表数据 */ });
// 传递原始对象给 Echarts，避免代理导致的异常
echarts.init(document.getElementById('chart')).setOption({
  series: [{ data: toRaw(chartData) }]
});

```

3. 调试 / 日志输出

打印响应式对象时，控制台会显示 Vue 代理的包装层，用 toRaw 可输出纯净的原始数据，方便调试：

```js
const user = reactive({ name: '张三', age: 18 });
console.log(user); // 输出 Proxy 包装对象，不易读
console.log(toRaw(user)); // 输出 { name: '张三', age: 18 }，纯净易读

```




## markRaw

处理的是“还没被响应式化的对象”，目的是“以后都不要让它变成响应式”即 **提前标记，别代理它**


```js
import { reactive, toRaw, markRaw } from 'vue';

// 2. markRaw 示例：标记对象为非响应式
const markedObj = markRaw({ age: 18 });
const reactiveMarked = reactive(markedObj); // 尝试创建响应式

console.log(reactiveMarked === markedObj); // ✅ true（未被代理，还是原对象）
reactiveMarked.age = 20;                   // 修改 → 不触发视图更新

```

核心细节

- 标记后不可逆：一旦对象被 markRaw 标记，任何方式（`reactive/ref/readonly` 等）都无法将其转为响应式；
- 仅标记对象本身：嵌套对象不会被自动标记，若需嵌套对象也非响应式，需单独标记；
- 返回原对象：markRaw 不会创建新对象，仅给原对象添加一个 “非响应式” 标记。


## 使用场景

1. 第三方库实例（如 Echarts、地图实例）

第三方库的实例对象内部属性极多，无需也不应该被 Vue 做响应式处理，标记后可避免性能损耗和冲突：

```js

import { reactive, markRaw } from 'vue';
import * as echarts from 'echarts';

// 初始化 Echarts 实例并标记为非响应式
const chartInstance = markRaw(echarts.init(document.getElementById('chart')));

// 即使放入 reactive，也不会被代理
const state = reactive({
  chart: chartInstance
});
console.log(state.chart === chartInstance); // ✅ true（未被代理）


```

2. 不可变的常量数据（如字典、配置表）

项目中的静态字典、配置表等数据，仅用于展示，无需响应式，标记后减少 Vue 响应式系统的开销：


```js
import { markRaw } from 'vue';

// 静态字典：无需响应式，标记后避免被意外转为响应式
const dict = markRaw({
  gender: ['男', '女'],
  status: ['草稿', '已发布', '已删除']
});

// 即使尝试用 reactive 包裹，也无效
const reactiveDict = reactive(dict);
reactiveDict.gender.push('未知'); // 修改 → 不触发视图更新

```

3. 避免响应式代理的性能损耗（超大对象）

对于包含上千条数据的超大对象，若仅用于展示，标记为非响应式可避免 Vue 递归创建代理，大幅提升初始化性能：

```js

import { markRaw } from 'vue';

// 超大对象：标记为非响应式，减少响应式开销
const bigData = markRaw({ /* 包含10000条数据的超大对象 */ });

// 放入组件状态，不会被转为响应式
const state = reactive({
  data: bigData
});

```





