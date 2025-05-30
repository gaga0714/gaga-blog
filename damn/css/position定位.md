# position定位
## 概述
可以设置top，bottom，left，right对其进行定位
## 类别
- static 静态
- fixed 固定
- relative 相对
- absolute 绝对
- sticky 粘性

## 详细
### static
默认值，不需要定位
### fixed
固定定位，相对于浏览器窗口进行定位
### sticky
相对于最先滚动的祖先元素（overflow属性值非visibable的元素）滚动到设定的阈值前表现为相对定位，到达阈值后的滚动表现为固定定位
### relative
相对本身移动，不脱离文档流，原来的位置空间还保留
### absolute
相对于**相对于最近的非static祖先元素**进行定位，**不止relative**，除了static其他都可以

根元素是html，不是body

如果寻至根元素也没有定位，则相对于浏览器窗口左上角

**如果没有指定top和left**，不会默认为0，而是待在原来的位置

## 使用场景
一般来说像遮罩，弹窗等可以使用固定定位固定在屏幕的固定位置，弹窗里面的按钮比如右上角关闭按钮就可以使用绝对定位。