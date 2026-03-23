# customRef


`自定义 ref`

## 基础

customRef 是 Vue3 提供的自定义 ref 实现 API，
核心作用是让你手动控制 ref 的「依赖收集」和「触发更新」逻辑，从而创建符合自定义业务规则的响应式数据


默认的 ref 是 Vue 封装好的 “开箱即用” 响应式，但 customRef 允许你突破默认逻辑，比如：

- 控制数据更新的时机（如防抖、节流）；
- 自定义数据的读取 / 修改规则（如数据校验、格式化）；
- 对接非 Vue 原生的响应式数据源（如 localStorage、第三方状态库）。


```js

import { customRef } from 'vue';

// 创建自定义 ref
function myCustomRef(value) {
  return customRef((track, trigger) => {
    return {
      // 读取数据时触发：必须调用 track() 收集依赖
      get() {
        track(); // 告诉 Vue：这个数据被使用了，需要收集依赖
        return value;
      },
      // 修改数据时触发：必须调用 trigger() 触发更新
      set(newValue) {
        // 自定义修改逻辑（如防抖、校验、格式化）
        value = newValue;
        trigger(); // 告诉 Vue：数据变了，需要更新视图
      }
    };
  });
}

```

## 使用场景


1. 防抖输入（最经典场景）

实现输入框输入后延迟更新数据（避免频繁触发响应式），比如搜索框防抖：


```vue

<!-- 
输入框快速打字时，keyword 不会立即更新，停止输入 500ms 后才更新视图，减少不必要的渲染。
 -->
<template>
  <input v-model="keyword" placeholder="请输入搜索关键词" />
  <p>防抖后的关键词：{{ keyword }}</p>
</template>

<script setup>
import { customRef } from 'vue';

// 封装防抖 customRef
function debouncedRef(value, delay = 300) {
  let timer; // 防抖定时器
  return customRef((track, trigger) => {
    return {
      get() {
        track(); // 收集依赖
        return value;
      },
      set(newValue) {
        // 防抖逻辑：清空旧定时器，新建定时器
        clearTimeout(timer);
        timer = setTimeout(() => {
          value = newValue;
          trigger(); // 延迟触发更新
        }, delay);
      }
    };
  });
}

// 使用自定义防抖 ref
const keyword = debouncedRef('', 500); // 500ms 防抖
</script>

```

2. 持久化存储（localStorage 同步）

让数据修改时自动同步到 localStorage，刷新页面后数据不丢失：

```vue
<!-- 

修改输入框内容时，数据自动同步到 localStorage，
刷新页面后 username 会从 localStorage 读取，保持数据持久化。
 -->

<template>
  <input v-model="username" placeholder="请输入用户名" />
  <p>本地存储的用户名：{{ username }}</p>
</template>

<script setup>
import { customRef } from 'vue';

// 封装持久化 customRef
function storageRef(key, defaultValue = '') {
  // 初始化时从 localStorage 读取数据
  let value = localStorage.getItem(key) || defaultValue;
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        value = newValue;
        // 同步到 localStorage
        localStorage.setItem(key, newValue);
        trigger(); // 触发视图更新
      }
    };
  });
}

// 使用：绑定 localStorage 的 "username" 键
const username = storageRef('username');
</script>

```

3. 数据校验 / 格式化

自定义数据修改规则，比如限制输入为数字、自动去除空格：


```vue
<!-- 

输入非数字内容会被自动过滤，输入负数会转为 0，保证 age 始终是合法的非负数字。
 -->
<template>
  <input v-model="age" placeholder="请输入年龄" />
  <p>格式化后的年龄：{{ age }}</p>
</template>

<script setup>
import { customRef } from 'vue';

// 封装带校验的 customRef
function validatedRef(value) {
  return customRef((track, trigger) => {
    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        // 校验规则：仅保留数字，空值设为 0
        const num = Number(newValue.replace(/\D/g, '')) || 0;
        // 额外限制：年龄不能小于 0
        value = num < 0 ? 0 : num;
        trigger();
      }
    };
  });
}

// 使用：初始值为空
const age = validatedRef('');
</script>

```

4. 对接第三方数据源

比如对接 RxJS 数据流、WebSocket 推送数据，手动控制响应式更新：


```js


import { customRef } from 'vue';
import { fromEvent } from 'rxjs';

// 对接 RxJS 事件流的 customRef
function rxRef(initialValue) {
  let value = initialValue;
  return customRef((track, trigger) => {
    // 订阅 RxJS 数据流
    const subscription = fromEvent(window, 'resize').subscribe(() => {
      value = window.innerWidth;
      trigger(); // 窗口大小变化时触发更新
    });

    return {
      get() {
        track();
        return value;
      },
      set(newValue) {
        value = newValue;
        trigger();
      },
      // 可选：清理副作用（如取消订阅）
      // 需配合 onUnmounted 使用
      cleanup() {
        subscription.unsubscribe();
      }
    };
  });
}

// 使用：监听窗口宽度
const windowWidth = rxRef(window.innerWidth);


```




