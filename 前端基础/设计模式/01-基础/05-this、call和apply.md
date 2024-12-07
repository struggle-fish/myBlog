# this 、call 和 apply



## this


跟别的语言大相径庭的是，JavaScript的this总是指向一个对象，<sapn class="marker-text">而具体指向哪个对象是在运行时基于函数的执行环境动态绑定的，而非函数被声明时的环境。</sapn>


### 作为对象的方法调用

<sapn class="marker-text">当函数作为对象的方法被调用时，this指向该对象：</sapn>

```js

var obj = {
  a: 1,
  getA: function(){
    alert ( this === obj );// 输出：true
    alert ( this.a ); // 输出： 1
  }
};

obj.getA();


```


### 作为普通函数调用

当函数不作为对象的属性被调用时，也就是我们常说的普通函数方式，此时的this总是指向全局对象。在浏览器的JavaScript里，这个全局对象是window对象。


```js

window.name = 'globalName';

var getName = function(){
    return this.name;
};
// 输出：globalName
console.log( getName() );

```

```js
window.name = 'globalName';

var myObject = {
    name: 'sven',
    getName: function(){
      return this.name;
    }
};

var getName = myObject.getName;
// globalName
console.log( getName() );    

```


### 构造器调用

JavaScript中没有类，但是可以从构造器中创建对象，同时也提供了new运算符，使得构造器看起来更像一个类。

<sapn class="marker-text">
除了宿主提供的一些内置函数，大部分JavaScript函数都可以当作构造器使用。构造器的外表跟普通函数一模一样，它们的区别在于被调用的方式。当用new运算符调用函数时，该函数总会返回一个对象，通常情况下，构造器里的this就指向返回的这个对象，见如下代码：</sapn>


```js

var MyClass = function(){
  this.name = 'sven';
};

var obj = new MyClass();
alert ( obj.name ); // 输出：sven

```

但用new调用构造器时，还要注意一个问题，如果构造器显式地返回了一个object类型的对象，那么此次运算结果最终会返回这个对象，而不是我们之前期待的this：


```js

var MyClass = function(){
    this.name = 'sven';
    return { // 显式地返回一个对象
      name: 'anne'
    }
};

var obj = new MyClass();
alert ( obj.name ); // 输出：anne
```

如果构造器不显式地返回任何数据，或者是返回一个非对象类型的数据，就不会造成上述问题：

```js

var MyClass = function(){
  this.name = 'sven'
  return 'anne';    // 返回string类型
};

var obj = new MyClass();
alert ( obj.name );     // 输出：sven

```

### call 和 apply


> Function.prototype.call或Function.prototype.apply调用



跟普通的函数调用相比，用Function.prototype.call或Function.prototype.apply可以动态地改变传入函数的this：

```js
var obj1 = {
    name: 'sven',
    getName: function(){
      return this.name;
    }
};

var obj2 = {
    name: 'anne'
};
// 输出： sven
console.log( obj1.getName() ); 


call 呼叫了 obj2 那么 this 就指向了他
// 输出：anne
console.log( obj1.getName.call( obj2 ) ); 


```

## 丢失的 this


```js
var obj = {
    myName: 'sven',
    getName: function(){
      return this.myName;
    }
};
当调用obj.getName时，getName方法是作为obj对象的属性被调用的，
此时的this指向obj对象，所以obj.getName()输出sven
 // 输出：'sven'
console.log( obj.getName() );   


当用另外一个变量getName2来引用obj.getName，并且调用getName2时，
此时是普通函数调用方式，this是指向全局window的，
所以程序的执行结果是undefined。
var getName2 = obj.getName;
console.log( getName2() );   
// 输出：undefined
```




```js

这是因为许多引擎的document.getElementById方法的内部实现中需要用到this。
这个this本来被期望指向document，
当getElementById方法作为document对象的属性被调用时，
方法内部的this确实是指向document的。
var getId = function( id ){
  return document.getElementById( id );
};

getId( 'div1' );



// 这么做会报错 TypeError: Illegal invocation
在Chrome、Firefox、IE10中执行过后就会发现，这段代码抛出了一个异常。
但当用getId来引用document.getElementById之后，再调用getId，
此时就成了普通函数调用，函数内部的this指向了window，而不是原来的document。
var getId = document.getElementById;
getId( 'div1' );

修改一下：
document.getElementById = (function( func ){
    return function(){
      return func.apply( document, arguments );
    }
})( document.getElementById );

var getId = document.getElementById;
var div = getId( 'div1' );

alert (div.id);    // 输出： div1
```

## call 和 apply 的区别

Function.prototype.call和Function.prototype.apply都是非常常用的方法。它们的作用一模一样，区别仅在于传入参数形式的不同。



apply接受两个参数，第一个参数指定了函数体内this对象的指向，第二个参数为一个带下标的集合，这个集合可以为数组，也可以为类数组，apply方法把这个集合中的元素作为参数传递给被调用的函数：

```js
当使用call或者apply的时候，如果我们传入的第一个参数为null，
函数体内的this会指向默认的宿主对象，在浏览器中则是window：
var func = function( a, b, c ){
  alert ( [ a, b, c ] );// 输出 [ 1, 2, 3 ]
};

func.apply( null, [ 1, 2, 3 ] );

```


call传入的参数数量不固定，跟apply相同的是，第一个参数也是代表函数体内的this指向，从第二个参数开始往后，每个参数被依次传入函数：

```js

var func = function( a, b, c ){
    alert ( [ a, b, c ] );    // 输出 [ 1, 2, 3 ]
};

func.call( null, 1, 2, 3 );

```


如果是在严格模式下，函数体内的this还是为null：

```js

var func = function( a, b, c ){
  "use strict";
  // 输出true
  alert ( this === null );     
}

func.apply( null, [ 1, 2, 3 ] );

```


<sapn class="marker-text">
有时候我们使用call或者apply的目的不在于指定this指向，而是另有用途，比如借用其他对象的方法。那么我们可以传入null来代替某个具体的对象：</sapn>


```js
 // 输出：5
Math.max.apply( null, [ 1, 2, 5, 3, 4 ] )

```


## call 和 apply的用途

### 改变 this 的指向



```js

var obj1 = {
    name: 'sven'
};

var obj2 = {
    name: 'anne'
};

window.name = 'window';

var getName = function(){
    alert ( this.name );
};

getName();    // 输出： window
getName.call( obj1 ); // 输出： sven
getName.call( obj2 ); // 输出： anne

```

当执行getName.call( obj1 )这句代码时，getName函数体内的this就指向obj1对象，所以此处的


```js

var getName = function(){
    alert ( this.name );
};
实际上相当于：
var getName = function(){
    alert ( obj1.name ); // 输出： sven
};


```


在实际开发中，经常会遇到this指向被不经意改变的场景，比如有一个div节点，div节点的onclick事件中的this本来是指向这个div的：

```js

document.getElementById( 'div1' ).onclick = function(){
  // 输出：div1
  alert( this.id );        
};


document.getElementById( 'div1' ).onclick = function(){
  alert( this.id ); // 输出：div1
  var func = function(){
    alert ( this.id ); // 输出：undefined
  }
  func();
};

这时候我们用call来修正func函数内的this，使其依然指向div：
document.getElementById( 'div1' ).onclick = function(){
  var func = function(){
    alert ( this.id ); // 输出：div1
  }
  func.call( this );
};

```


### bind

`Function.prototype.bind`


```js

Function.prototype.bind = function( context ){
  var self = this;        // 保存原函数
  return function(){// 返回一个新的函数
    // 执行新的函数的时候，会把之前传入的context
    return self.apply( context, arguments ); 
    // 当作新函数体内的this
  }
};

var obj = {
    name: 'sven'
};

var func = function(){
    alert ( this.name ); // 输出：sven
}.bind( obj);

func();

```

我们通过Function.prototype.bind来“包装”func函数，并且传入一个对象context当作参数，这个context对象就是我们想修正的this对象。

在Function.prototype.bind的内部实现中，我们先把func函数的引用保存起来，然后返回一个新的函数。<sapn class="marker-text">当我们在将来执行func函数时，实际上先执行的是这个刚刚返回的新函数。在新函数内部，self.apply(context, arguments )这句代码才是执行原来的func函数，并且指定context对象为func函数体内的this。</sapn>









```js

1、创建一个新函数：bind() 方法会创建一个新的函数。

2、设置 this 值：新函数在调用时，其 this 值被绑定到 bind() 方法的第一个参数。

3、预置参数：bind() 方法的其余参数将作为预置参数，当新函数被调用时，
这些参数会被添加到新函数的参数列表的前面。

4、返回新函数：bind() 方法返回这个新创建的函数。

Function.prototype.myBind = function(context) {
  // 保存原函数的引用
  const originalFunction = this;
  
  // 预置参数
  const args = Array.prototype.slice.call(arguments, 1);
  
  // 返回一个新函数
  return function() {
    // 将新函数的参数与预置参数合并
    const innerArgs = Array.prototype.slice.call(arguments);
    const finalArgs = args.concat(innerArgs);
    
    // 判断是否需要在构造函数中调用
    if (this instanceof originalFunction) {
      // 如果是作为构造函数调用，返回新实例
      return new originalFunction(...finalArgs);
    } else {
      // 否则，调用原函数，并将 context 作为 this
      return originalFunction.apply(context, finalArgs);
    }
  };
};

// 使用自定义的 myBind 方法
const obj = { name: "Kimi" };
function sayName() {
  console.log(this.name);
}

const boundSayName = sayName.myBind(obj);
boundSayName(); // 输出：Kimi

```


