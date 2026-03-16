```js
function myinstanceof(obj,Func){
    if(obj===null||typeof obj!=='object') return false;
    let proto=Object.getPrototypeOf(obj);
    while(true){
        if(proto===null) return false;
        if(proto===Func.prototype) return true;
        proto=Object.getPrototypeOf(proto);
    }
}
```