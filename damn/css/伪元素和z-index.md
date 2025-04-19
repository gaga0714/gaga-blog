# 伪元素和z-index
## 伪元素
### 怎么解释伪元素是什么？
伪元素是虚拟dom元素，在html中看不到，但是页面渲染存在。

不是写的真实标签，通常用来**附加内容**或**装饰元素**

### 最常见的伪元素有两个：
> ::before - 在元素内容前面插入东西

> ::after - 在元素内容后面插入东西

### 和伪类的区别
伪类是选中**已有元素**的状态或位置
> ::hover - 鼠标悬浮

> ::selected - 鼠标选中

### 一般使用方法
`content:""`一定要有，**如果不写，元素不会出现在页面上**

`position: absolute`一般用**绝对定位**来实现脱离文档流，让其可以自由定位，**使用的时候其父元素一定要加属性** `position:relative`

### 举个例子
```
body{
    //写在background-image里的图片无法在这下面加东西，不是单独一层而是body的属性
    //如果想在背景图下面加一层，可以把背景写成一个image
    background-image: url("https://www.pixelstalk.net/wp-content/uploads/images6/Purple-Aesthetic-Wallpaper.jpg");
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

body::after{
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: -1;
}
```

## z-index
就是上面这个例子想到的，写在background-image里的图片无法在这下面加东西

不是单独一层而是body的属性

如果想在背景图下面加一层，可以把背景写成一个image

然后body的z-index没定义应该是默认auto，近似于是0

总体概括这个结构就是：

- 背景图（最底）
- 遮罩（-1，中间）
- body（最顶）