# React Hook

- 每调用useHook一次都会生成一份独立的状态
    
- 通过自定义hook能够更好的封装我们的功能

![](./React%20Hook-20240729215246115.jpg)

最常见的`hooks`有如下：

- useState
- useEffect
- 其他

useState 使用起来更为简洁，减少了`this`指向不明确的情况

```jsx
import React, { useState } from 'react';

function Example() {
  // 声明一个叫 "count" 的 state 变量
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p >
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```


`useEffect`第一个参数接受一个回调函数，默认情况下，`useEffect`会在第一次渲染和更新之后都会执行，相当于在`componentDidMount`和`componentDidUpdate`两个生命周期函数中执行回调

你可以跳过对 effect 的调用，这时候只需要传入第二个参数，如下：

```jsx
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```

```jsx
import React, { useState, useEffect } from 'react';
function Example() {
  const [count, setCount] = useState(0);
 
  useEffect(() => {    document.title = `You clicked ${count} times`;  });
  return (
    <div>
      <p>You clicked {count} times</p >
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```


还有很多额外的`hooks`，如：

- useReducer
- useCallback
- useMemo
- useRef