```js
function mycall(context,...args){
    context=context||window;
    context.fn=this;
    let res=context.fn(...args);
    delete context;
    return res;
}
```