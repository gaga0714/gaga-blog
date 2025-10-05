# overflow

用来控制当内容超出容器尺寸时的呈现方式

- hidden 溢出内容被裁剪，不显示滚动条，无法滚动查看
- scroll 不管有没有溢出，都显示滚动条
- auto 只有在内容确实溢出的时候才显示滚动条
- clip ？Overflow Level 4，类似于hidden，但裁剪更精确到像素边界
- visible（**默认**） 允许溢出，内容不会被裁剪，也不会出现滚动条
  
如何实现溢出内容呈现三个点的省略号：

```css
.text-ellipsis{
    overflow:hidden; /* 隐藏超出容器的文本 */
    white-space:nowrap; /* 确保文本不会换行 */
    text-overflow:ellipsis; /* 当文本超出容器时显示省略号 */
    width:200px; /* 设置最大宽度 */
}
```