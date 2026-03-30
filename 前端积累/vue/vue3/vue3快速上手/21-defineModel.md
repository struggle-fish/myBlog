# defineModel


## 介绍

defineModel 是 `Vue 3.4+` 新增的编译器宏，核心作用是简化自定义组件的 `v-model` 双向绑定，
自动帮你完成 `props 声明、emit 触发和响应式同步`，一行代码替代原来的 `defineProps + defineEmits + computed` 样板代码。



自动创建一个可读写的 ref，内部绑定 `modelValue prop `和 `update:modelValue `事件，
子组件直接修改这个 ref 就能同步父组件数据，无需手动写 emit



::: code-group

```vue [CustomInput]

<script setup>
// 1. 直接调用 defineModel()，返回一个 ref
const model = defineModel()
</script>

<template>
  <!-- 2. 直接用 v-model 绑定，和普通 ref 一样 -->
  <input v-model="model" placeholder="输入内容" />
</template>

```


```vue [父组件]

<script setup>
import { ref } from 'vue'
import CustomInput from './CustomInput.vue'
const text = ref('')
</script>

<template>
  <!-- 3. 父组件照常使用 v-model 绑定 -->
  <CustomInput v-model="text" />
  <p>父组件值：{{ text }}</p>
</template>

```

:::


## 进阶

### 1.自定义模型名（多 v-model）

支持一个组件绑定多个 `v-model`，适合表单多字段场景

```vue
<template>
<!-- 父组件 -->
<CustomForm
  v-model:username="user.name"
  v-model:age="user.age"
/>
</template>

<!-- 子组件 -->
<script setup>
// 绑定 v-model:username
const username = defineModel('username')
// 绑定 v-model:age
const age = defineModel('age', { type: Number })
</script>
```

### 2.配置 prop 选项（校验 / 默认值）

和 defineProps 一样支持 type、required、default 等配置

```js
const model = defineModel({
  type: String,
  required: true,
  default: '默认值'
})

```

### 3. 数据转换（get/set）

在双向绑定时自动处理数据格式（如去空格、转数字）：

```js

const model = defineModel({
  // 父 → 子：自动去空格
  get: (val) => val?.trim() || '',
  // 子 → 父：自动去空格
  set: (val) => val.trim()
})

```


### 4. 处理修饰符（trim/number/lazy）


自动支持 `v-model` 内置修饰符，也可自定义：

```vue
<script setup>
// 接收修饰符（如 .trim）
const [model, modifiers] = defineModel()
</script>

<template>
  <!-- 父组件：<CustomInput v-model.trim="text" /> -->
  <input
    :value="model"
    @input="e => {
      let val = e.target.value
      if (modifiers.trim) val = val.trim()
      model = val
    }"
  />
</template>

```


## 原理

defineModel 编译后等价于以下代码：

```vue

<script setup>
// 1. 声明 prop
const props = defineProps({ modelValue: String })
// 2. 声明 emit
const emit = defineEmits(['update:modelValue'])
// 3. 计算属性做双向绑定
const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
</script>

```












