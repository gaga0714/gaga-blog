# 手写new
```js
function mynew(Func,...args){
    //1.创建一个新对象
    let obj={};
    //2.新对象原型指向构造函数原型对象
    obj.__proto__=Func.prototype;
    //3.将构建函数的this指向新对象
    let result=Func.apply(obj,args);
    //4.根据返回值判断
    return result instanceof Object ?result:obj;
}
```
