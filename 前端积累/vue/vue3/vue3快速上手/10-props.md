# props




::: code-group

```ts [定义一个接口]
// 定义一个接口，限制每个Person对象的格式
export interface PersonInter {
  id:string,
  name:string,
  age:number
}
   
// 定义一个自定义类型Persons
// export type Persons = Array<PersonInter>
export type Persons = PersonInter[]

```

```vue [接口使用]
<!--
App.vue中代码：
-->
<template>
	<Person :list="persons"/>
</template>
  
<script lang="ts" setup name="App">
  import Person from './components/Person.vue'
  import {reactive} from 'vue'
  import {type Persons} from './types'
  
  let persons = reactive<Persons>([
    {id:'e98219e12',name:'张三',age:18},
    {id:'e98219e13',name:'李四',age:19},
    {id:'e98219e14',name:'王五',age:20}
  ])
</script>
  


```

:::


```vue

<template>
<div class="person">
  <ul>
    <li v-for="item in list" :key="item.id">
      {{item.name}}--{{item.age}}
    </li>
  </ul>
</div>
</template>
  
<script lang="ts" setup name="Person">
  import {defineProps} from 'vue'
  import {type PersonInter} from '@/types'
  
  // 第一种写法：仅接收
  // const props = defineProps(['list'])
  const props = defineProps({
    list: {
      type: Array,
      default: () => [],
    },
  });
  // props.list

  
  // 第二种写法：接收+限制类型
  // defineProps<{list:Persons}>()
  
  // 第三种写法：接收+限制类型+指定默认值+限制必要性
  let props = withDefaults(defineProps<{list?:Persons}>(),{
     list:()=>[{id:'asdasg01',name:'小猪佩奇',age:18}]
  })
  console.log(props)
</script>


```


