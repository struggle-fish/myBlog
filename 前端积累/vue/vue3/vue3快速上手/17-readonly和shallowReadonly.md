# readonly 与 shallowReadonly


## readonly

作用：用于创建一个对象的深只读副本。


```js

const original = reactive({ ... });
const readOnlyCopy = readonly(original);

```

特点：

对象的所有嵌套属性都将变为只读。

任何尝试修改这个对象的操作都会被阻止（在开发模式下，还会在控制台中发出警告）。



应用场景：

创建不可变的状态快照。

保护全局状态或配置不被修改。



## shallowReadonly


作用：与 readonly 类似，但只作用于对象的顶层属性。


```js

const original = reactive({ ... });

const shallowReadOnlyCopy = shallowReadonly(original);

```


特点：

只将对象的顶层属性设置为只读，对象内部的嵌套属性仍然是可变的。

适用于只需保护对象顶层属性的场景。






