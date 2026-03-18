# reactive




## 对象类型的响应式数据


- 作用：定义一个响应式对象（基本类型不要用它，要用ref，否则报错）
- 语法：`let 响应式对象= reactive(源对象)`。
- **返回值：** 一个Proxy的实例对象，简称：响应式对象。
- 注意点：reactive定义的响应式数据是“深层次”的。



```vue

<template>
  <div class="person">
    <h2>汽车信息：一台{{ car.brand }}汽车，价值{{ car.price }}万</h2>
    <h2>游戏列表：</h2>
    <ul>
      <li v-for="g in games" :key="g.id">{{ g.name }}</li>
    </ul>
    <h2>测试：{{obj.a.b.c.d}}</h2>
    <button @click="changeCarPrice">修改汽车价格</button>
    <button @click="changeFirstGame">修改第一游戏</button>
    <button @click="test">测试</button>
  </div>
</template>

<script lang="ts" setup name="Person">
import { reactive } from 'vue'

// 数据
let car = reactive({ brand: '奔驰', price: 100 })
let games = reactive([
  { id: 'ahsgdyfa01', name: '英雄联盟' },
  { id: 'ahsgdyfa02', name: '王者荣耀' },
  { id: 'ahsgdyfa03', name: '原神' }
])
let obj = reactive({
  a:{
    b:{
      c:{
        d:666
      }
    }
  }
})

function changeCarPrice() {
  car.price += 10
}
function changeFirstGame() {
  games[0]!.name = '流星蝴蝶剑'
}
function test(){
  obj.a.b.c.d = 999
}
</script>



```







