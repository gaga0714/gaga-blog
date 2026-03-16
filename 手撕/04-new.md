```js
function mynew(Func,...args){
    let obj={};
    obj.__proto__=Func.prototype;
    let result=Func.apply(obj,args);
    return result instanceof Object ? result:obj;
}
```
