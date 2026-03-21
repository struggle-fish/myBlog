# pinia

集中式状态数据管理


## 基础

存储 + 读取数据

`Store` 是一个保存：状态、业务逻辑 的实体，每个组件都可以读取、写入它。


它有三个概念：`state、getter、action`，相当于组件中的： `data、 computed 和 methods`。


::: code-group

```js [一个例子]


// 引入defineStore用于创建store
import {defineStore} from 'pinia'

// 定义并暴露一个store
export const useCountStore = defineStore('count',{
  // 动作
  actions: {},
  // 状态 是个函数
  state(){
    return {
      sum: 6
    }
  },
  // 计算
  getters: {}
})


```


```vue [使用pinia]
<template>
  <h2>当前求和为：{{ countStore.sum }}</h2>
</template>

<script setup lang="ts" name="Count">
  // 引入对应的useXxxxxStore	
  import {useCountStore} from '@/store/count'
  
  // 调用useXxxxxStore得到对应的store
  const countStore = useCountStore()
</script>

```

:::




## 修改数据

第一种修改方式，直接修改

```js

countStore.sum = 666

```

第二种修改方式：批量修改

```js
// 提供一个碎片，批量的变更
countStore.$patch({
  sum:999,
  school:'小学'
})


```

第三种修改方式：借助action修改（action中可以编写一些业务逻辑）

```js

import { defineStore } from 'pinia'

export const useCountStore = defineStore('count', {
  state() {
    return {
      sum: 1
    }
  }
  /*************/
  actions: {
    //加
    increment(value:number) {
      if (this.sum < 10) {
        //操作countStore中的sum
        this.sum += value
      }
    },
    //减
    decrement(value:number){
      if(this.sum > 1){
        this.sum -= value
      }
    }
  },
  /*************/
})


// 使用countStore
const countStore = useCountStore()
// 调用对应action
countStore.increment(n.value)
```



## storeToRefs

借助 storeToRefs 将store中的数据转为ref对象，方便在模板中使用。

注意：pinia提供的`storeToRefs`只会将数据做转换，而Vue的`toRefs`会转换store中数据。


```vue

<template>
	<div class="count">
		<h2>当前求和为：{{sum}}</h2>
	</div>
</template>

<script setup lang="ts" name="Count">
  import { useCountStore } from '@/store/count'
  /* 引入storeToRefs */
  import { storeToRefs } from 'pinia'

	/* 得到countStore */
  const countStore = useCountStore()
  /* 使用storeToRefs转换countStore，随后解构 */
  const {sum} = storeToRefs(countStore)
</script>

```

## getters

当 state 中的数据，需要经过处理后再使用时，可以使用getters配置。



```js


// 引入defineStore用于创建store
import {defineStore} from 'pinia'

// 定义并暴露一个store
export const useCountStore = defineStore('count',{
  // 动作
  actions:{
    /************/
  },
  // 状态
  state(){
    return {
      sum:1,
      school:'xiaoxue'
    }
  },
  // 计算
  getters:{
    // state是默认传递的
    bigSum:(state):number => state.sum *10,

    upperSchool():string {
      return this.school.toUpperCase()
    }
  }
})



// 组件中使用
const {increment, decrement} = countStore
let {sum, school, bigSum, upperSchool} = storeToRefs(countStore)

```

## $subscribe


通过 store 的 $subscribe() 方法侦听 state 及其变化


```js
// 有点儿像 watch
talkStore.$subscribe((mutate, state)=>{
  console.log('LoveTalk',mutate, state)
  localStorage.setItem('talk', JSON.stringify(talkList.value))
})

```

## store组合式写法


```js

import {defineStore} from 'pinia'
import axios from 'axios'
import {nanoid} from 'nanoid'
import {reactive} from 'vue'
// defineStore 第二个是函数，不是对象了
export const useTalkStore = defineStore('talk',()=>{
  // talkList就是state
  const talkList = reactive(
    JSON.parse(localStorage.getItem('talkList') as string) || []
  )

  // getATalk函数相当于action
  async function getATalk(){
    // 发请求，下面这行的写法是：连续解构赋值+重命名
    let {data:{content:title}} = await axios
    .get('https://api.uomg.com/api/rand.qinghua?format=json')
    // 把请求回来的字符串，包装成一个对象
    let obj = {id:nanoid(),title}
    // 放到数组中
    talkList.unshift(obj)
  }

  // 注意要有返回
  return {talkList,getATalk}
})



```