# Object 与 Map 对比
#### **1. 键的类型**
| **分类**     | **Map**                                  | **Object**                     |
|--------------|------------------------------------------|--------------------------------|
| **允许的键类型** | 任意类型（对象、函数、原始值等）。         | 仅限字符串或 Symbol。            |
| **示例**     | `map.set({}, '对象键')`（有效）           | `obj[{a:1}] = '值'`（键被转成字符串 `'[object Object]'`） |

---

#### **2. 键的有序性**
| **特性**     | **Map**                                  | **Object**                     |
|--------------|------------------------------------------|--------------------------------|
| **键的顺序** | 严格按照键插入顺序存储（ES6+）。          | **传统对象**：无序（ES6 后部分实现有序，但依赖实现细节）。<br>**纯对象 ({}）**：不保证顺序。 |

---

#### **3. 性能比较**
| **操作**     | **Map 优势**                             | **Object 适合场景**             |
|--------------|------------------------------------------|--------------------------------|
| **频繁增删键** | 优化更好（哈希表专为动态数据设计）。       | 静态键结构，一次性初始化。      |
| **查找速度**  | 相似（哈希表实现，时间复杂度 O(1)）       | 相似（但可能受原型链影响）。    |

---

#### **4. 内存与扩展性**
| **指标**     | **Map**                                  | **Object**                     |
|--------------|------------------------------------------|--------------------------------|
| **内存占用** | 在频繁添加/删除大量键时更高效。           | 内存占用稍高（原型链影响）。   |
| **大小获取** | 直接通过 `.size` 属性。                   | 需手动计算：`Object.keys(obj).length`。 |

---

#### **5. 原型与继承**
| **特性**       | **Map**                                  | **Object**                     |
|----------------|------------------------------------------|--------------------------------|
| **原型污染风险** | 无。键与原型无关。                        | 有风险（如覆盖默认方法）。      |
| **示例**       | `map.get('toString')` → `undefined`        | `obj.toString` 可能指向 `Object.prototype.toString`。 |

---

#### **6. 迭代与工具方法**
| **功能**     | **Map**                                  | **Object**                     |
|--------------|------------------------------------------|--------------------------------|
| **内置迭代** | 原生支持 `forEach`、`keys()`、`values()`。 | 需转换为数组：`Object.keys()`/`entries()`。 |
| **序列化**   | 不能直接 `JSON.stringify`。               | 可直接转为 JSON。              |

keys():返回键组成的数组

entries():
```js
const obj = { a: 1, b: 2, c: 3 };
const entries = Object.entries(obj);
console.log(entries); // [['a', 1], ['b', 2], ['c', 3]]
```

---

### **二、使用场景对比**
#### **选择 Map 的情况**
1. **键类型多样**：需要 `对象`、`函数`等作为键。  
   ```javascript
   const listeners = new Map();
   const button = document.querySelector('button');
   listeners.set(button, () => console.log('点击！')); 
   ```
2. **需要有序遍历**：按插入顺序处理键值对。  
   ```javascript
   const taskQueue = new Map();
   taskQueue.set(1, '任务A').set(2, '任务B');
   taskQueue.forEach((val, key) => executeInOrder(key, val));
   ```
3. **频繁增删键**：如缓存或动态映射数据。  
   ```javascript
   const cache = new Map();
   function getData(key) {
     if (cache.has(key)) return cache.get(key);
     const data = fetchData(key);
     cache.set(key, data);
     return data;
   }
   ```

#### **选择 Object 的情况**
1. **简单键值存储**：键为字符串，且无需复杂操作。  
   ```javascript
   const config = { apiUrl: 'https://api.example.com', maxRetries: 3 };
   ```
2. **JSON 兼容性**：需要与 JSON 互相转换。  
   ```javascript
   const user = JSON.parse('{"name": "Alice", "age": 30}');
   ```
3. **方法访问**：依赖对象方法，如 `obj.hasOwnProperty()`.  
   ```javascript
   if (user.hasOwnProperty('email')) validateEmail(user.email);
   ```
   
obj.hasOwnProperty() 是 JavaScript 中 对象 的一个方法，用于判断对象是否具有某个 自身的属性（即该属性是否存在于对象本身，而不是从原型链继承来的）。
```js
const obj = {
  name: 'Alice',
  age: 25
};

console.log(obj.hasOwnProperty('name')); // true
console.log(obj.hasOwnProperty('age'));  // true
console.log(obj.hasOwnProperty('gender')); // false
```
**obj.hasOwnProperty() 只会检查对象自身的属性，不会检查原型链。**

in 运算符会检查对象自身的属性以及原型链上的属性。

```js
const obj = { name: 'Alice' };

console.log('name' in obj);          // true
console.log(obj.hasOwnProperty('name')); // true

console.log('toString' in obj);     // true，toString 在原型链上
console.log(obj.hasOwnProperty('toString')); // false，toString 是继承自原型链的
```

| 方法                          | 说明                      |
| --------------------------- | ----------------------- |
| `obj.hasOwnProperty('key')` | 检查对象是否有自己的 `key` 属性     |
| `in` 运算符                    | 检查对象是否有 `key` 属性（包括原型链） |

---

### **三、最佳实践建议**
- **优先使用 Map**：当需要动态键、键类型复杂或有序访问时。  
- **沿用 Object**：当结构静态、需 JSON 序列化或简单键值对时。  
- **避免滥用**：清晰区分数据和对象方法（如不应将业务数据存储在 `Object.prototype` 上）。


map转object：
```js
const mapObject = Object.fromEntries(map);
console.log(JSON.stringify(mapObject)); 
```