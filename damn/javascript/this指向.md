# this

在对象内部的方法中使用对象内部的属性，这是作用域链机制做不到的，故引入 this 概念

- this 在执行上下文中是动态绑定的
- **一般来说谁调用这个函数，this 就指向谁**
- 使用 new 方法调用构造函数时，构造函数内的 this 会被绑定到新创建的对象上
- 可以通过 call， apply， bind 动态绑定函数的 this 指向
- 箭头函数没有自己的 this，它的 this 使用的是它外部作用域的 this

```js
const obj = {
  name: 'Alice',
  greet: function() {
    console.log(this.name);
  }
};

obj.greet(); // 输出 'Alice'

```

```js
function show() {
  console.log(this);
}

show(); // 非严格模式下输出全局对象（window），严格模式下输出 undefined

```

```js
function Person(name) {
  this.name = name;
}

const person = new Person('Bob');
console.log(person.name); // 输出 'Bob'

```

```js
const person1 = {
  name: 'Charlie',
  greet: function() {
    console.log(this.name);
  }
};

const person2 = {
  name: 'Dave'
};

person1.greet.call(person2); // 输出 'Dave'
person1.greet.apply(person2); // 输出 'Dave'

const boundGreet = person1.greet.bind(person2);
boundGreet(); // 输出 'Dave'

```

```js

const obj = {
  name: 'Eve',
  greet: function() {
    const innerFunc = () => {
      console.log(this.name);
    };
    innerFunc();
  }
};

obj.greet(); // 输出 'Eve'，innerFunc的外部作用域是greet，greet的this指向是obj

```