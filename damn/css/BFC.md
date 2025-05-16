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
- **优先使用display:flow-root**（CSS3专为BFC设计的属性，无副作用）

### 应用场景

- 清除内部浮动，父元素高度塌陷（子元素是float导致父元素被遮挡）
- 阻止外边距合并（*margin collapse*）/ kəˈlæps /
- 多栏布局

**两栏布局**
```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style>
        .container{
            display:flex;
        }
        .column{
            flex:1;
            padding: 20px;
        }
        .column1{
            background-color: #f1f1f1;
        }
        .column2{
            background-color: #e1e1e1;
        }

    </style>
</head>
<body>
    <div class="container">
        <div class="column column1">Column1</div>
        <div class="column column2">Column2</div>
    </div>
</body>
</html>
```

**三栏布局**

**圣杯布局**

https://www.cnblogs.com/hl-520/p/5753075.html