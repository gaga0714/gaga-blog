# 原型链 constructor 重写的影响

```js
Child.prototype = new Parent();
```
默认情况下，每个函数都有一个 .prototype.constructor，且它指回该函数本身

相当于把 Child.prototype 换成了一个 Parent 的实例，这个新原型对象的 .constructor 属性自然指向 Parent，而 不 是 Child

正确：
```js
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;
```