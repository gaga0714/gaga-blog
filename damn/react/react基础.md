# 基本语法

react组件是返回标签的js函数

```tsx
function MyComp(){
    return (
        <button>我是按钮</button>
    )
}
```
react组件必须用开头大写来区分，html标签则一定是小写
```tsx
export default function MyApp(){
    return(
        <MyComp />//如果没有中间嵌套标签就用自闭合，在后面
    )
}
```

只能返回一个共享的父级，使用`<div></div>`或者`<></>`包裹

css: `<img className="avatar"/>`

js写在`{xxx}`

内联样式 `style={{}}`，就是`{}`里的一个普通 `{}` 对象

# 条件渲染
```jsx
let content;
if(isLogin){
    content=<AdminPanel/>;
}else{
    content=<Login/>;
}
return (
    {content}
)
```
# 渲染列表
```jsx
const listItems = products.map(()=>{
    <li key={product.id}>
        {product.title}
    </li>
});

return (
    <ul>{listItems}</ul>
)
```
# 响应事件

# 更新界面
多次渲染同一个组件
```jsx
import {useState} from 'react';
function MyButton(){
    const [cnt,setCnt]=usrState(0);
}
```



快速切换 Tab 时，useEffect 滞后于用户的操作，导致 that.sqlQuery (快速更新) 和 sqlQuery (慢速更新，依赖 useEffect) 之间的数据不一致，从而造成混乱。