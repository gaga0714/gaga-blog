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
