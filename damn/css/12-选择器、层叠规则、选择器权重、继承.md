# 选择器、层叠规则、选择器权重、继承
通用选择器： `*` 将匹配文档的所有元素
元素选择器：input 匹配任何 input 元素。
类选择器：`.index` 匹配任何 `class` 属性中含有 "index" 类的元素。
ID 选择器：`#toc` 匹配 ID 为 "toc" 的元素。
属性选择器： `[autoplay]` 选择所有具有 `autoplay` 属性的元素（不论这个属性的值是什么）


选择器列表：`div, span` 会同时匹配 [`<span>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/span) 元素和 [`<div>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/div) 元素。
后代组合器：`div span` 匹配所有位于任意 [`<div>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/div) 元素之内的 [`<span>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/span) 元素。
直接子代组合器：`ul > li` 匹配直接嵌套在 [`<ul>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/ul) 元素内的所有 [`<li>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/li) 元素。
一般兄弟组合器：`p ~ span` 匹配同一父元素下，[`<p>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/p) 元素后的所有 [`<span>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/span) 元素
紧邻兄弟组合器：`h2 + p` 会匹配_紧_邻在 [h2](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/Heading_Elements) 元素后的第一个 [`<p>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/p) 元素。

伪类：`a:visited` 匹配所有曾被访问过的 [`<a>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/a) 元素。
	:nth-child()
	:hover
伪元素：`p::first-line` 匹配所有 [`<p>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/p) 元素的第一行。
	::after 会创建一个伪元素，作为所选元素的最后一个子元素
	::before 创建一个伪元素，其将成为匹配选中的元素的第一个子元素

---

当元素没有声明样式规则时候，会从最近的父元素继承样式

- 一般和字体相关的属性都可以继承，比如颜色、字体大小等
- 不可继承属性也可以使用 inherit 显式一个属性继承父类元素属性

层叠规则是为了解决多个样式声明规则同时作用一个元素时产生冲突的问题。

- 首先是是样式表的来源，开发者自己写的样式表的大于浏览器默认的代理样式表
- 其次是选择器的优先级: 一般是内联 > id > class、属性、伪类 > 标签类型、伪元素。当一个元素被作用于多个选择器时，会采取权重计算的方式，一般用向量表来表示第一位如果是内联样式就是 1，第二位是 id 选择器出现次数，第三位是 class、属性、伪类出现的总次数，第四位是标签和伪元素出现总次数。通过从第一位到第四位依次进行比较，较大者优先，相等则比较下一位

	- 还有一个！important 可以设置权重为无穷大，提升优先级

- 如果上面的比较规则结果都相等，就按照源码出现位置后面声明的覆盖前面声明的样式

| **等级**      | **示例**                          | **权重值**       |
| ----------- | ------------------------------- | ------------- |
| **内联样式**    | `style="color: red;"`           | `1-0-0-0`(最高) |
| **ID 选择器**  | `#header`                       | `0-1-0-0`     |
| **类/伪类/属性** | `.btn`,`:hover`,`[type="text"]` | `0-0-1-0`     |
| **元素/伪元素**  | `div`,`::before`                | `0-0-0-1`(最低) |
多个选择器在一行内会叠加权重值、无进位谁大就是谁权重高


### 继承
#### **一、可继承属性分类**

CSS 中**可继承属性**的特性：子元素默认继承父元素的属性值（除非子元素显式设置其他值）。

##### **1. 文本与字体**
| **属性**               | **说明**                      | **示例**                          |
|------------------------|-------------------------------|-----------------------------------|
| `font-family`          | 字体类型                      | `font-family: Arial, sans-serif;` |
| `font-size`            | 字体大小                      | `font-size: 16px;`                |
| `font-weight`          | 字体粗细                      | `font-weight: bold;`              |
| `font-style`           | 字体样式（斜体等）            | `font-style: italic;`             |
| `line-height`          | 行高                          | `line-height: 1.5;`               |
| `color`                | 文本颜色                      | `color: #333;`                    |
| `text-align`           | 文本对齐方式                  | `text-align: center;`             |
| `text-indent`          | 首行缩进                      | `text-indent: 2em;`               |
| `letter-spacing`       | 字符间距                      | `letter-spacing: 2px;`            |
| `word-spacing`         | 单词间距                      | `word-spacing: 0.5rem;`           |
| `text-transform`       | 文本大小写转换                | `text-transform: uppercase;`      |

---

##### **2. 列表相关**
| **属性**               | **说明**                      | **示例**                          |
|------------------------|-------------------------------|-----------------------------------|
| `list-style-type`      | 列表项标记类型                | `list-style-type: circle;`        |
| `list-style-position`  | 列表项标记位置                | `list-style-position: inside;`    |
| `list-style-image`     | 列表项图像标记                | `list-style-image: url(...);`     |

---

##### **3. 表格相关**
| **属性**               | **说明**                      | **示例**                          |
|------------------------|-------------------------------|-----------------------------------|
| `border-collapse`      | 表格边框合并模式              | `border-collapse: collapse;`      |
| `border-spacing`       | 表格单元格间距                | `border-spacing: 5px;`            |

---

##### **4. 其他**
| **属性**               | **说明**                      | **示例**                          |
|------------------------|-------------------------------|-----------------------------------|
| `visibility`           | 元素可见性                    | `visibility: hidden;`             |
| `cursor`               | 鼠标指针样式                  | `cursor: pointer;`                |
| `direction`            | 文本方向                      | `direction: rtl;`                 |
| `quotes`               | 引号样式                      | `quotes: '“' '”';`                |

---

#### **二、不可继承的常见属性**
以下属性**默认不可继承**，需显式设置或使用 `inherit` 强制继承：
```css
/* 盒模型相关 */
width, height, margin, padding, border
/* 定位布局 */
position, top, right, bottom, left
/* 背景与显示 */
background, display, float, overflow
/* 其他 */
z-index, opacity, transform
```

---

#### **三、继承机制控制**
1. **强制继承**  
   使用 `inherit` 强制继承父元素的值（即使原属性不可继承）：
   ```css
   .child {
     border: inherit;  /* 继承父元素的 border */
   }
   ```

2. **重置继承**  
   使用 `initial` 恢复默认值，或 `unset` 根据属性特性自动处理：
   ```css
   .child {
     color: initial;  /* 重置为浏览器默认颜色 */
     font-size: unset; /* 自动处理为继承或初始值 */
   }
   ```

---

#### **四、典型应用场景**
1. **全局字体设置**  
   ```css
   body {
     font-family: system-ui;
     line-height: 1.6;
     color: #333;
   }
   /* 所有子元素自动继承字体样式 */
   ```

2. **列表样式统一**  
   ```css
   ul {
     list-style-type: square;
     padding-left: 2em;
   }
   /* 所有 <li> 继承列表标记样式 */
   ```

3. **主题颜色继承**  
   ```html
   <div class="theme-dark">
     <p>自动继承深色主题文本颜色</p>
   </div>
   ```
   ```css
   .theme-dark { color: white; }
   ```

---

#### **五、注意事项**
4. **表单元素例外**  
   输入框 (`<input>`)、下拉框 (`<select>`) 等表单元素默认不继承字体相关属性，需手动设置：
   ```css
   input, select, button {
     font-family: inherit;
     font-size: inherit;
   }
   ```

5. **性能优化**  
   避免在根元素设置过多可继承属性，可能引发不必要的样式计算。

6. **框架组件影响**  
   React/Vue 组件可能因 Shadow DOM 或样式隔离导致继承失效，需特殊处理。

---

### **总结**
- **优先利用继承**：通过父元素设置全局文本、字体等样式，减少重复代码。  
- **谨慎强制继承**：对不可继承属性使用 `inherit` 时需评估必要性。  
- **注意特殊元素**：表单控件、框架组件等可能需要额外处理继承逻辑。