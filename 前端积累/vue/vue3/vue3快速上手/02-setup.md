# setup

## 基础使用

setup是Vue3中一个新的配置项，值是一个函数，它是 Composition API “表演的舞台”，组件中所用到的：数据、方法、计算属性、监视…等等，均配置在setup中。



::: tip

特点如下：

- setup 函数返回的对象中的内容，可直接在模板中使用。
- setup 中访问this是undefined。
- setup 函数会在beforeCreate之前调用，它是“领先”所有钩子执行的。

:::


对比示例

::: code-group

```vue [vue2]
<template>
  <div class="person">
    <h2>姓名：{{name}}</h2>
    <h2>年龄：{{age}}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">年龄+1</button>
    <button @click="showTel">点我查看联系方式</button>
  </div>
</template>

<script lang="ts">
  export default {
    name:'App',
    data() {
      return {
        name:'张三',
        age:18,
        tel:'13888888888'
      }
    },
    methods:{
      changeName(){
        this.name = 'zhang-san'
      },
      changeAge(){
        this.age += 1
      },
      showTel(){
        alert(this.tel)
      }
    },
  }
</script>


```

```vue [vue3]
<template>
  <div class="person">
    <h2>姓名：{{name}}</h2>
    <h2>年龄：{{age}}</h2>
    <button @click="changeName">修改名字</button>
    <button @click="changeAge">年龄+1</button>
    <button @click="showTel">点我查看联系方式</button>
  </div>
</template>

<script lang="ts">
  export default {
    name:'Person',
    setup(){
      // 数据，原来写在data中（注意：此时的name、age、tel数据都不是响应式数据）
      let name = '张三11'
      let age = 18
      let tel = '13888888888'

      // 方法，原来写在methods中
      function changeName(){
        name = 'zhang-san' //注意：此时这么修改name页面是不变化的
        console.log(name)
      }
      function changeAge(){
        age += 1 //注意：此时这么修改age页面是不变化的
        console.log(age)
      }
      function showTel(){
        alert(tel)
      }

      // 返回一个对象，对象中的内容，模板中可以直接使用
      return {name,age,tel,changeName,changeAge,showTel}
    }
  }
</script>


```
:::



## setup 的返回值


若返回一个对象：则对象中的：属性、方法等，在模板中均可以直接使用 **（重点）**


若返回一个函数：则可以自定义渲染内容，代码如下：

```js

setup(){
  return ()=> '你好啊！'
}

```




## setup 与 Options API 的关系

- Vue2 的配置`（data、methos…）`中可以访问到 `setup` 中的属性、方法。
- 在setup中不能访问到Vue2的配置`（data、methos…）`。 📢
- 如果与Vue2冲突，则setup优先。



## setup 语法糖

setup函数有一个语法糖，这个语法糖，可以让我们把setup独立出去，代码如下：


```js

<script lang="ts">
  export default {
    name:'Person',
  }
</script>

<!-- 下面的写法是setup语法糖 -->
<script setup lang="ts">
  console.log(this) //undefined
  
  // 数据（注意：此时的name、age、tel都不是响应式数据）
  let name = '张三'
  let age = 18
  let tel = '13888888888'

  // 方法
  function changName(){
    name = '李四'//注意：此时这么修改name页面是不变化的
  }
  function changAge(){
    console.log(age)
    age += 1 //注意：此时这么修改age页面是不变化的
  }
  function showTel(){
    alert(tel)
  }
</script>


```


扩展：上述代码，还需要编写一个不写setup的script标签，`去指定组件名字`，比较麻烦，我们可以借助vite中的插件简化


第一步：`npm i vite-plugin-vue-setup-extend -D`

第二步：`vite.config.ts`


```js

import { defineConfig } from 'vite'
import VueSetupExtend from 'vite-plugin-vue-setup-extend'

export default defineConfig({
  plugins: [ VueSetupExtend() ]
})


// 使用如下
<script lang="ts" setup name="Person"></script>
```














