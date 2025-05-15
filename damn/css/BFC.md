# BFC 
### BFC是什么？

*Block Formatting Context*，块级格式化上下文

**可以理解为是一个独立的布局环境**，BFC内部的元素布局和外部互不影响

### 触发情况（常见的）

**`position,overflow,display,float`**

- position:fix/absolute
- float设置为left或right
- overflow为非visible时
- display:inline-block
- display:table-cell
- display:flex
- display:table-caption
- 优先使用display:flow-root CSS3专为BFC设计的属性，无副作用

### 应用场景