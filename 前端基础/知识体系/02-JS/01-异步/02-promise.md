# promise




## Promise 有哪些状态，如何变化




## promise then 和 catch的连接

```js
// 第一题
Pormise.resolve().then(() => {
  console.log(1)
}).catch(() => {
  console.log(2)
}).then(() => {
  console.log(3)
})


// 第二题
Promise.resolve().then(() => {
  console.log(1)
  throw new Error('error1')
}).catch(() => {
  console.log(2)
}).then(() => {
  console.log(3)
})


// 第三题
Promise.resolve().then(()=> {
  console.log(1)
  threw new Error('error1')
}).catch(() => {
  console.log(2)
}).catch(() => {
  console.log(3)
})
```



## promise 和 setTimeout 顺序

```js
// 执行顺序
console.log(100)

setTimeout(() => {
  console.log(200)
})

Promise.resolve().then(() => {
  console.log(300)
})

console.log(400)

```