# extends



extends 的原理 是 JavaScript 中实现类继承的核心机制，它本质上是 寄生组合式继承（Parasitic Combination Inheritance） 的语法糖，ES6 只是把这个模式用更优雅、更符合直觉的方式包装起来了。


## 核心原理

```js

class Child extends Parent {
  constructor(...args) {
    super(...args)
  }
}
```

JavaScript 引擎内部实际上执行了下面这些步骤：

- 定义父类构造函数（Parent 本身）

- 设置静态方法继承（`Child.proto = Parent` 即 `Child.__proto__ = Parent`）

- 创建子类的 prototype，并让它继承父类的 prototype

    - `Child.prototype = Object.create(Parent.prototype)`
    - `Child.prototype.constructor = Child`

- 子类 constructor 内部必须先调用 super()
    - super() 相当于 Parent.call(this, ...args)

- 处理 super() 后面的代码，绑定正确的 this


关键连接线：

- `Child.__proto__ === Parent`（静态方法继承）

- `Child.prototype.__proto__ === Parent.prototype`（实例方法继承） 即 `Child.prototype = Object.create(Parent.prototype)`

- `child.__proto__ === Child.prototype` 注意 这个实例和构造函数

- `Child.prototype.constructor === Child`





## extends 实现


下面是最经典、最符合规范的寄生组合式继承写法，几乎就是 Babel 转译 class extends 后的样子：

```js

// 辅助函数：实现寄生组合式继承
function inherits(Child, Parent) {
  // 1. 静态属性/方法继承（Child.__proto__ = Parent）
  if (Object.setPrototypeOf) {
    Object.setPrototypeOf(Child, Parent)
  } else {
    Child.__proto__ = Parent
  }

  // 2. 原型链继承（最核心部分）
  // 使用 Object.create 实现干净的原型链
  // 实现实例方法继承：Child.prototype.__proto__ -> Parent.prototype
  // 用 Object.create 替代直接修改 __proto__（更规范）
  const proto = Object.create(Parent.prototype)
  proto.constructor = Child   // 修复 constructor 指回自己
  Child.prototype = proto
}


// 使用示例
function Parent(name) {
  this.name = name
}

Parent.prototype.say = function () {
  console.log("我是父类", this.name)
}

Parent.staticMethod = function () {
  console.log("我是父类的静态方法")
}

// 定义子类
function Child(name, age) {
  // 模拟 super(name)
  Parent.call(this, name)
  this.age = age
}

// 实现继承
inherits(Child, Parent)

// 子类添加自己的方法
Child.prototype.run = function () {
  console.log("我是子类", this.name, "今年", this.age, "岁")
}

// 测试
const c = new Child("小明", 18)
c.say()     // 我是父类 小明
c.run()     // 我是子类 小明 今年 18 岁
console.log(c instanceof Parent)   // true
console.log(c instanceof Child)    // true

Child.staticMethod()   // 我是父类的静态方法

```

## 关键细节

1. 为什么要分「原型链继承」和「静态继承」？

实例方法存在于 `类.prototype `上，所以需要让` Child.prototype.__proto__ `指向 `Parent.prototype`；


静态方法 / 属性直接挂在类本身（如 Parent.staticProp），所以需要让 `Child.__proto__` 指向 `Parent`，才能访问到父类的静态成员。


2. super () 的本质？

在子类构造函数中，super() 就是调用父类的构造函数，并且会把子类实例的 this 绑定到父类构造函数中；

注意：ES6 中如果子类写了 constructor，必须先调用 super() 才能用 this，否则报错（因为子类实例的 this 要先由父类初始化）。


3. Object.create 替代 `__proto__` 的原因？

直接修改` __proto__` 性能差且不规范，Object.create(Parent.prototype) 会创建一个新对象，新对象的prototype的 `__proto__` 指向 Parent.prototype，再赋值给 Child.prototype，是更标准的写法。



现代 class extends 的内部等价写法（Babel 转译后大致样子）

```js

// 转译后简化版
let Child = (function (_Parent) {
  // 继承静态属性/方法
  if (typeof _Parent === "function") {
    Child.__proto__ = _Parent
  }

  // 创建干净的原型链
  function Child() {
    // 调用父类 constructor
    _Parent.apply(this, arguments)
  }

  // 核心：寄生继承
  Child.prototype = Object.create(_Parent && _Parent.prototype, {
    constructor: {
      value: Child,
      enumerable: false,
      writable: true,
      configurable: true
    }
  })

  return Child
})(Parent)

```

## 如何理解 `Child.__proto__ = Parent`


1. 先明确两个身份

Child 在 JavaScript 中同时拥有两个身份：

- 它是一个构造函数（constructor function / class）→ 当你写 new Child() 时，它会被当作构造函数来调用

- 它本身也是一个普通对象（因为所有函数都是对象）→ 作为对象，它也有自己的 `__proto__`



当我们说 Child.prototype 时 → 指的是“作为构造函数”的那个 prototype（给 new 出来的实例用）

当我们说 `Child.__proto__` 时 → 指的是“作为普通对象”的原型链（Child 自己是从谁继承来的）


2. 谁创建了 Child 这个函数对象？

在 JavaScript 中，所有函数（包括 class 声明的函数）都是由 Function 构造函数创建的。

```js
class Child extends Parent { ... }
// 等价于
const Child = function() { ... }  // 只是语法糖

```

所以真正创建 Student 这个函数对象的是 Function 而不是 Parent

```js

Child.__proto__ === Function.prototype

```


3. 那 `Child.__proto__ = Parent` 是怎么回事？

在 class Child extends Parent 这一行，JavaScript 引擎做了两件非常重要的事：

- 给 Child 构造函数本身设置继承关系（静态成员继承）

```js

Child.__proto__ = Parent

```

这让 Student 这个函数对象可以直接访问 Parent 上的静态方法和静态属性。

```js
class Parent {
  static create() { return new Parent("默认") }
}

class Child extends Parent {}
console.log(Child.create)  // 可以直接用父类的静态方法

```

- 给 Child 的实例方法设置继承关系（原型链继承）

```js

Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor = Child

```

所以完整的关系是：

::: code-group

```text [原型继承]

Child (函数对象)
   ↓ __proto__
Parent (父类构造函数)
   ↓ __proto__
Function.prototype
   ↓ __proto__
Object.prototype
   ↓ __proto__
null

```

```text [实例]

child实例
   ↓ __proto__
Child.prototype
   ↓ __proto__
Parent.prototype
   ↓ __proto__
Object.prototype
   ↓ __proto__
null

```
:::

**Child 的 `__proto__`指向的不是“谁生成了它”，而是它作为对象从谁那里继承属性和方法。**

Child 这个函数对象是由 Function 创建的，所以它的 `__proto__` 本来应该是 Function.prototype。

但是 extends 故意把 `Child.__proto__ `修改成了 Parent，目的是让 Child 能继承 Parent 的静态成员（static 方法、static 属性）。


换句话说：

`Child.prototype.__proto__` 指向 `Parent.prototype` → 为了让 new Child() 的实例能继承实例方法

`Child.__proto__` 指向 `Parent` → 为了让 Child.静态方法() 能用



![LOGO](/public/image/base/ScreenShot_2026-03-10_081313_909.png)






## 总结


JavaScript 中 extends 的核心实现逻辑可以归纳为 3 点：

- 实例继承：通过原型链（`Child.prototype.__proto__ = Parent.prototype`）继承父类实例方法 即 `Child.prototype = Object.create(Parent.prototype)`；

- 静态继承：通过修改类的原型（`Child.__proto__ = Parent`）继承父类静态成员；

- 构造继承：通过调用父类构造函数（`super() / Parent.call(this)`）继承实例属性。



extends 让子类“站在父类的肩膀上”：静态方法直接继承，原型方法干净链接，实例属性通过 call 绑定，语法上却写得像传统面向对象语言。


`class extends` 做了两件事：

- `子类.prototype.__proto__ = 父类.prototype` → 子类实例继承父类实例方法

- `子类.__proto__ = 父类 `→ 子类构造函数继承父类构造函数的静态成员




所以 `Child.__proto__ = Parent` 不是说“Child 是 Parent new 出来的”，而是说“Child 这个构造函数对象要继承 Parent 这个构造函数对象身上的静态属性和方法”。








