# React 写 css 的方法
### style
```jsx
<div style={{backgroundColor:"red"}}>
```

这种方式优点：
- 内联样式, 样式之间不会有冲突
- 可以动态获取当前state中的状态
缺点：
- 写法上都需要使用**驼峰**标识

### 组件中引入css文件

```jsx
import './App.css';

<h2 className="title">我是App的标题</h2>
```

### 组件中引入 .module.css 文件

- 引用的类名，不能使用连接符(.xxx-xx)，在 JavaScript 中是不识别的
- 所有的 className 都必须使用 {style.className} 的形式来编写


### CSS in JS

此功能并不是 React 的一部分，而是由第三方库提供，例如：

- styled-components
- emotion
- glamorous