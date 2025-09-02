# ES6 核心新特性一览

#### **1. 变量声明：`let` 与 `const`**
- **作用域**：块级作用域（替代 `var` 的函数作用域）。  
- **`const`**：声明常量，不可重新赋值（对象属性可修改）。  
```javascript
let name = 'Alice';
const PI = 3.14;
```

#### **2. 箭头函数**
- **简洁语法**：省略 `function` 和 `return`。  
- **`this` 绑定**：继承外层上下文（解决传统函数 `this` 指向问题）。  
```javascript
const add = (a, b) => a + b;
arr.map(item => item * 2);
```


#### **3. 模板字符串**
- 反引号（**支持多行文本和变量嵌入**`${}`）。  
```javascript
const msg = `Hello, ${name}! 
Your score is ${score}.`;
```

#### **4. 解构赋值**
- **数组/对象解构**：快速提取值并赋值。  
```javascript
const [a, b] = [1, 2];          // a=1, b=2
const { name, age } = user;     // 提取 user 的属性
```

#### **5. 函数参数增强**
- **默认参数**：参数默认值设置。  
- **Rest 参数**：将剩余参数转为数组。  
```javascript
function greet(name = 'Guest', ...args) {
  console.log(`Hello, ${name}!`, args);
}
```

#### **6. 扩展运算符（`...`）**
- **拆分数组/对象**：用于合并、复制或传参。  
```javascript
const arr = [...oldArr, newItem];
const objCopy = { ...original };
```

#### **7. 类（`class`）**
- **语法糖**：简化原型继承，支持构造函数和静态方法。  
```javascript
class Person {
  constructor(name) { this.name = name; }
  sayHi() { console.log(`Hi, I'm ${this.name}`); }
}
```

#### **8. 模块化（`import/export`）**
- **模块拆分**：支持代码组织和复用。  
```javascript
// math.js
export const add = (a, b) => a + b;

// app.js
import { add } from './math.js';
```

#### **9. Promise**
- **异步处理**：解决回调地狱，支持链式调用。  
```javascript
fetch(url)
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error(error));
```

#### **10. 新数据结构**
- **`Set`**：唯一值集合。  
- **`Map`**：键值对集合（键可为任意类型）。  
```javascript
const set = new Set([1, 2, 2, 3]); // {1, 2, 3}
const map = new Map();
map.set('key', 'value');
```

#### **11. 迭代器与生成器**
- **`for...of`**：遍历可迭代对象（数组、字符串、Map等）。  
- **生成器函数**：`function*` 和 `yield` 控制执行流程。  
```javascript
function* gen() {
  yield 1;
  yield 2;
}
const iterator = gen();
iterator.next(); // { value: 1, done: false }
```

#### **12. Symbol 类型**
- **唯一值**：创建独一无二的标识符。  
```javascript
const id = Symbol('id');
const obj = { [id]: 123 };
```

---

### **其他重要特性**
- **对象字面量增强**：简写属性和方法。  
  原写法：
  ```javascript
  const name = 'Alice';
    const obj = {
    name: name,
    sayHi: function() {
            console.log('Hi');
        }
    };
  ```
    增强写法：
  ```javascript
  const name = 'Alice';
  const obj = { name, sayHi() { /* ... */ } };
  ```

- **二进制/八进制字面量**：`0b1010`（二进制）、`0o12`（八进制）。  
- **`Array.prototype.includes`**：判断数组是否包含某元素。  