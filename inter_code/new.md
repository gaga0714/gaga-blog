p56
```js
function mynew(Func,...args){
    const obj={};
    obj.__proto__=Func.prototype;
    let result=Func.apply(obj,args);
    return result instanceof Object?result:obj;
}

```