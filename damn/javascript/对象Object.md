# 对象 Object

属性名表达式如果是一个对象，默认情况下会自动将对象转为字符串

```js
const keyA = {a: 1};
const keyB = {b: 2};

const myObject = {
  [keyA]: 'valueA',
  [keyB]: 'valueB'
};

myObject // Object {[object Object]: "valueB"}
```


`this`关键字总是指向函数所在的当前对象，ES6 又新增了另一个类似的关键字`super`，指向当前对象的原型对象

```js
const proto = {
  foo: 'hello'
};

const obj = {
  foo: 'world',
  find() {
    return super.foo;
  }
};

Object.setPrototypeOf(obj, proto); // 为obj设置原型对象
obj.find() // "hello"
```


在解构赋值中，未被读取的可遍历的属性，分配到指定的对象上面 解构赋值是浅拷贝
```js
let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
x // 1
y // 2
z // { a: 3, b: 4 }
```

`Object.assign()`方法用于对象的合并，将源对象`source`的所有可枚举属性，复制到目标对象`target` `Object.assign()`方法是浅拷贝，遇到同名属性会进行替换