# CSS 上下文

### BFC
BFC（ `Block Formatting Context`， 名为 "块级格式化上下文"）个人理解指的是一个独立的布局环境，BFC 内部的元素布局与外部互不影响。

触发 BFC 的方式常见的有：

- float设置为 left、right
- overflow 设置为非 visiable
- positon 设置为 absolute、fixed
- display: inline-block
- display: table-cell
- display: flex
- display: table-caption
- **优先使用 `display: flow-root`**  CSS3 专为 BFC 设计的属性，无副作用

常见的 BFC 应用有：

- 解决浮动元素令父元素高度坍塌的问题（计算 BFC 的高度时，浮动子元素也参与计算）
- 解决非浮动元素被浮动元素覆盖问题
- 解决同一个 BFC 外边距垂直方向重合的问题
- 阻止外边距合并（Margin Collapse）
- 包含内部浮动元素（清除浮动）
- 隔离外部浮动影响


解决margin塌陷问题 

为了解决此问题可以使用`BFC`规则（为元素包裹一个盒子形成一个完全独立的空间，做到里面元素不受外面布局影响
（可以给其中一个盒子套一个p标签、套一个displayflex、一个overflowhidden）



### IFC
内联格式化上下文（IFC）
**定义** ：内联元素（如文本、`span`）的排列环境，元素水平排列，直到占满一行后换行。  
**触发条件** ：元素为 `display: inline/inline-block` 或默认内联元素。

 style="vertical-align: middle;"

**特性** ：

- 元素水平排列，基线（baseline）对齐
- 行框（Line Box）高度由行内最高元素决定

### FFC
 弹性格式化上下文（FFC）
 **定义** ：弹性容器（Flex Container）通过弹性布局控制子元素排列。  
**触发条件** ：`display: flex/inline-flex`

**特性** ：

- 子元素按主轴（main axis）排列，可伸缩尺寸
- 支持 `flex-grow`、`flex-shrink`、`flex-basis` 控制空间分配

### GFC
网格格式化上下文（GFC）

**定义** ：网格容器（Grid Container）实现二维布局。  
**触发条件** ：`display: grid/inline-grid`

**特性** ：

- 通过行和列定义布局结构
- 支持 `grid-template-rows/columns` 定义网格轨道

### TFC
表格格式化上下文（TFC

**定义** ：表格及其单元格的布局规则。  
**触发条件** ：`display: table/table-cell`

**特性** ：

- 模拟传统表格布局
- 支持 `border-collapse` 控制边框合并