```js
let obj = {valueOf:function(){return 1}}
let result1 = (obj == 1); // true
```

obj 是一个 普通对象，但它重写了 `valueOf()` 方法。通过重写 `valueOf()` 方法，`obj` 对象可以返回一个原始值，使得在进行比较时，`obj` 会与该原始值进行比较。