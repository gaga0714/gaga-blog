# login 样式笔记

确保背景图片覆盖整个页面并保持其比例。

```
background-size: cover;
```

flexbox 布局，居中对齐。

```
display: flex;
justify-content: center;
align-items: center;
```

使用 flexbox 布局，并将子元素垂直排列。

```
display: flex;
flex-direction: column;
```

元素本身的背景会被模糊掉，但该元素的内容（如文本、图片等）会保持清晰。这种效果可以用来让元素的前景内容更加突出，同时将背景进行模糊，使得用户更容易关注到前景内容。

参数 10px 表示模糊的程度，数字越大，模糊效果越强。

```
backdrop-filter: blur(10px);
```

占父容器宽度的 90%

```
.input-wrap {
    width: 90%;
}
```

设置输入框背景透明

```
input {
    background-color: transparent;
}
```

提示文字样式

```
input::placeholder：{

}
```

```
button {
    font-size: 1.2rem;      /* 字体大小 */
    height: 60px;           /* 按钮高度 */
    width: 90%;             /* 宽度为容器90% */
    border-radius: 50px;    /* 圆角大，形成 pill 按钮 */
    font-weight: 600;       /* 字体加粗 */
    letter-spacing: 1px;    /* 字母间距增加 */
    margin-bottom: 25px;    /* 与下方间隔 25px */
    cursor: pointer;        /* 鼠标悬停变手型 */
    transition: 0.3s;       /* 添加平滑过渡动画 */
    animation: reloadA 2s ease-out forwards; /* 动画延迟后出现 */
    opacity: 0;
    animation-delay: 1s;
}

```

```
@keyframes reloadA {
    from {
        transform: translateY(250px); /* 从页面下方250px开始移动 */
    }
    to {
        transform: translateY(0);     /* 回到原位 */
        opacity: 1;                   /* 变为完全可见 */
    }
}
```
