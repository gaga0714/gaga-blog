# React 渲染机制

在`render`过程中，`React` 将新调用的 `render`函数返回的树与旧版本的树进行比较，这一步是决定如何更新 `DOM` 的必要步骤，然后进行 `diff` 比较，更新 `DOM`树

`render`的执行时机主要分成了两部分：

- 类组件调用 setState 修改状态
- 函数组件通过`useState hook`修改状态
- 类组件重新渲染
- 函数组件重新渲染

### shouldComponentUpdate

通过`shouldComponentUpdate`生命周期函数来比对 `state`和 `props`，确定是否要重新渲染

默认情况下返回`true`表示重新渲染，如果不希望组件重新渲染，返回 `false` 即可

### PureComponent

### memo
`React.memo`用来缓存组件的渲染，避免不必要的更新，其实也是一个高阶组件，与 `PureComponent` 十分类似。但不同的是， `React.memo` 只能用于函数组件