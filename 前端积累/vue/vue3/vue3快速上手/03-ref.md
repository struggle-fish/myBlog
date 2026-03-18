# ref

定义响应式变量



## 基本类型的响应式数据

```js

let xxx = ref(初始值)。

```


**返回值：** 一个RefImpl的实例对象，简称ref对象或ref，ref对象的value属性是响应式的。

JS中操作数据需要：`xxx.value`，但模板中不需要`.value`，直接使用即可。

对于`let name = ref('张三')`来说，name不是响应式的，`name.value`是响应式的。



```js

<script lang="ts" setup name="Person">
  import { ref } from 'vue'

  // name和age是一个RefImpl的实例对象，简称ref对象，它们的value属性是响应式的。
  let name = ref('张三11')
  let age = ref(18)
  let tel = '13888888888'

  function changeName(){
    name.value = 'zhang-san' 
    console.log(name)
  }
  function changeAge(){
    // JS中操作ref对象时候需要.value
    age.value += 1 
    console.log(age)
  }
  function showTel(){
    alert(tel)
  }

</script>

```





## 对象类型的响应式数据


其实ref接收的数据可以是：基本类型、对象类型。

若ref接收的是对象类型，内部其实也是调用了reactive函数。



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
import { ref } from 'vue'

// 数据
let car = ref({ brand: '奔驰', price: 100 })
let games = ref([
  { id: 'ahsgdyfa01', name: '英雄联盟' },
  { id: 'ahsgdyfa02', name: '王者荣耀' },
  { id: 'ahsgdyfa03', name: '原神' }
])
let obj = ref({
  a:{
    b:{
      c:{
        d:666
      }
    }
  }
})

console.log(car)

function changeCarPrice() {
  car.value.price += 10
}
function changeFirstGame() {
  games.value[0].name = '流星蝴蝶剑'
}
function test(){
  obj.value.a.b.c.d = 999
}
</script>


```







## ref 对比 reactive


ref用来定义：基本类型数据、对象类型数据；

reactive用来定义：对象类型数据。


ref创建的变量必须使用`.value`（可以使用volar插件自动添加`.value`）。


reactive重新分配一个新对象，会失去响应式（可以使用Object.assign去整体替换）。


使用原则：

- 若需要一个基本类型的响应式数据，必须使用ref。
- 若需要一个响应式对象，层级不深，ref、reactive都可以。
- 若需要一个响应式对象，且层级较深，推荐使用reactive。



```vue

<script lang="ts" setup name="Person">

let car = reactive({ brand: '奔驰', price: 100 })

function changeCar () {
  // 以下两种写法页面不更新
  // car = { brand: '宝马', price: 1 }

  // car = reactive({ brand: '奔驰', price: 1 })

  Object.assign(car, { brand: '宝马', price: 1 })

  // 但是如果是ref的对象 .value 本身就是响应式的
  // car.value = { brand: '奔驰', price: 1 } 是响应式的
}
</script>

```