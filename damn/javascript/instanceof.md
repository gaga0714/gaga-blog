# JavaScript 中的 instanceof 运算符详解

`instanceof` 是 JavaScript 中检测对象与构造函数关系的核心操作符，其原理基于原型链（Prototype Chain）。以下是其详细工作原理和判断逻辑的逐层解析：

---

### **一、instanceof 的基本语法**
```javascript
object instanceof Constructor
```
- `object`：要检测的对象（或原始类型的自动装箱包装对象）。
- `Constructor`：构造函数（必须为 `Function` 类型）。
- **返回值**：布尔值，表示 `object` 的原型链上是否存在 `Constructor.prototype`。

---

### **二、instanceof 的判断逻辑**
判断步骤如下：

#### **步骤 1：验证 Constructor 是否为函数**
- 若 `Constructor` 不是函数（即无 `[[Call]]` 内部方法），直接抛出 `TypeError`。
  ```javascript
  123 instanceof null; // TypeError: Right-hand side of 'instanceof' is not callable
  ```

#### **步骤 2：处理原始类型**
- 若 `object` 为非对象（原始类型如 `number`、`string`）且未自动装箱，则直接返回 `false`。
  ```javascript
  'hello' instanceof String; // false（直接返回，无需查找原型链）
  new String('hello') instanceof String; // true
  ```

#### **步骤 3：原始对象的原型链遍历**
```javascript
// object 可能传入的示例
const obj = new Constructor();
obj instanceof Constructor;
```
1. **获取 Constructor 的原型**：`Constructor.prototype`。
2. **获取 object 的原型**：初始值为 `Object.getPrototypeOf(object)`。
3. **递归向上遍历原型链**：
   - **匹配成功**：若某层原型等于 `Constructor.prototype` → 返回 `true`。
   - **原型链尽头**：若原型为 `null` → 返回 `false`。

**示例代码**：手动实现类似 instanceof 的检查逻辑  
```javascript
function customInstanceof(obj, Constructor) {
  if (typeof Constructor !== 'function') throw new TypeError();
  if (obj === null || typeof obj !== 'object') return false;

  let proto = Object.getPrototypeOf(obj);
  const prototype = Constructor.prototype;

  while (proto !== null) {
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto); // 继续向上查找
  }
  return false;
}
```

---

### **三、原型链机制中的关键点**
#### **1. 构造函数原型与实例的 [[Prototype]]**
- **构造函数（Constructor.prototype）**：每个构造函数有一个 `prototype` 属性，其作用是作为新实例的[[Prototype]]。  
- **实例（object）的 [[Prototype]]**：即 `object.__proto__`（或 `Object.getPrototypeOf(object)`），指向构造函数的 `prototype`。
  
**示例**：构造函数与新实例的关系
```javascript
function Animal() {}
const cat = new Animal();

// 实例的 [[Prototype]] 指向 Animal.prototype
console.log(Object.getPrototypeOf(cat) === Animal.prototype); // true
```

#### **2. 原型链的终止条件**
原型链通过 `__proto__` 链接，直到 `Object.prototype.__proto__` 为 `null`，构成链式查询闭环：
```javascript
console.log(Object.prototype.__proto__); // null
```

#### **3. 动态修改原型的影响**
若在运行时修改构造函数的 `prototype`，已创建的实例的实例关系会发生变化：
```javascript
function Car() {}
const myCar = new Car();
console.log(myCar instanceof Car); // true

// 修改构造函数原型
Car.prototype = {};
console.log(myCar instanceof Car); // false（新原型不在实例的原型链上）
```

---

### **四、特殊场景分析**
#### **1. 原始类型的装箱与拆箱**
JavaScript 在某些场景会自动装箱原始值（如 `String`、`Number`），但原始值本身不属对象：
```javascript
console.log(5 instanceof Number);           // false（直接处理原始值）
console.log(new Number(5) instanceof Number); // true（已装箱为对象）
```

#### **2. Object.create 的特殊对象**
```javascript
const obj = Object.create(null); // 创建无原型的对象
console.log(obj instanceof Object); // false
```

#### **3. 多全局对象环境（如 iframe）**
不同窗口的构造函数引用不同，导致 instanceof 误判：
```javascript
// 父窗口和 iframe 对 Array 的引用不同
const frame = document.createElement('iframe');
document.body.appendChild(frame);
const FrameArray = frame.contentWindow.Array;

const arr = new Array();
console.log(arr instanceof Array);      // true
console.log(arr instanceof FrameArray); // false（不同 Array 构造函数）
```

原因：

每个全局环境（window、iframe）都有自己的全局对象和内置构造函数

所以 window.Array !== iframe.contentWindow.Array

instanceof 判断时，判断的是对象原型链上是否有该构造函数的 .prototype

arr 的原型链上是当前窗口的 Array.prototype，不包含 iframe 的 Array.prototype

解决方法：

用 Array.isArray() 或 Object.prototype.toString.call()

---

### **五、instanceof 与 typeof 的对比**
| **操作符** | **目的**                            | **示例**                        | **局限性**                        |
|------------|-------------------------------------|---------------------------------|----------------------------------|
| `instanceof` | 检测对象是否为某构造函数/类的实例    | `[] instanceof Array` → `true`   | 不适用于原始类型、默认检测原型链 |
| `typeof`     | 检测变量基本类型（返回类型字符串）    | `typeof 'ss'` → `'string'`       | 对对象细分无效（函数返回 `'function'`，其他对象返回 `'object'`） |

---

### **总结**  
- **逻辑核心**：`instanceof` 通过递归遍历对象的原型链，检查是否存在与构造函数 `prototype` 匹配的原型。  
- **关键依赖**：基于 JavaScript 的原型链继承机制，原型可随时被修改。  
- **适用性**：适用于检测对象与构造函数（或类）的实例关系，不适用于原始类型。  

通过理解原型链结构和单步调试代码，可以更深刻掌握其内部原理。