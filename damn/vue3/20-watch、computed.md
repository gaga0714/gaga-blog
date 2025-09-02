# Vue 中 watch 与 computed 核心区别详解

#### **一、核心差异对比表**
| **特性**          | **computed**                          | **watch**                              |
|--------------------|---------------------------------------|----------------------------------------|
| **本质**           | 计算属性（派生值）                    | 监听器（观察变化）                     |
| **缓存机制**       | 有缓存，依赖不变不重新计算            | 无缓存，每次变化都触发回调             |
| **异步支持**       | 同步计算（无法处理异步操作）          | 支持异步操作                           |
| **适用场景**       | 模板中依赖多个数据的动态计算值        | 数据变化时执行副作用（如请求、DOM操作）|
| **返回值**         | 必须返回计算结果                      | 无返回值，执行操作                     |
| **语法结构**       | 函数形式（可设置 getter/setter）      | 对象形式（包含 handler、deep 等配置）  |

---

#### **二、使用场景示例**

##### **1. computed 典型场景：动态计算属性**
```javascript
// 计算总价（依赖多个数据）
computed: {
  totalPrice() {
    return this.quantity * this.unitPrice + this.shippingFee;
  }
}

// 模板中使用
<template>
  <div>{{ totalPrice }}</div>
</template>
```
**优势**：自动缓存，`quantity` 或 `unitPrice` 未变化时直接返回缓存值。

---

##### **2. watch 典型场景：数据变化响应**
```javascript
// 监听搜索关键词变化发起请求
watch: {
  searchKeyword(newVal, oldVal) {
    this.fetchResults(newVal); // 异步操作
  }
}

// 深度监听对象属性变化
userInfo: {
  handler(newVal) {
    console.log('用户信息变更:', newVal);
  },
  deep: true // 深度监听
}
```
**优势**：处理异步操作、复杂逻辑，支持深度监听和立即执行（`immediate: true`）。

---

#### **三、实现原理对比**
| **机制**         | **computed**                              | **watch**                              |
|------------------|-------------------------------------------|----------------------------------------|
| **依赖追踪**     | 通过 getter 自动收集依赖                  | 手动指定监听目标                       |
| **更新触发**     | 依赖数据变化时触发重新计算                | 监听的目标数据变化时触发回调           |
| **执行时机**     | 在模板渲染前自动执行                      | 数据变化后异步执行（默认）             |

---

#### **四、高级用法扩展**
##### **1. computed 设置 setter**
```javascript
computed: {
  fullName: {
    get() {
      return this.firstName + ' ' + this.lastName;
    },
    set(newValue) {
      const names = newValue.split(' ');
      this.firstName = names[0];
      this.lastName = names[1];
    }
  }
}
```

##### **2. watch 性能优化配置**
```javascript
watch: {
  dataKey: {
    handler: 'methodName',
    immediate: true,  // 立即执行一次
    deep: true,       // 深度监听
    flush: 'post'     // DOM更新后触发（Vue3）
  }
}
```

---

#### **五、选型决策树**
1. **是否需要基于多个数据生成新值？**  
   → 是 → **computed**  
   → 否 → 进入下一问题  

2. **是否需要执行异步操作或复杂逻辑？**  
   → 是 → **watch**  
   → 否 → 进入下一问题  

3. **是否需要在数据变化时更新视图？**  
   → 是 → **computed**  
   → 否 → 可能不需要响应式系统

---

### **总结**
- **优先使用 computed**：处理数据到视图的映射（90% 的模板计算需求）  
- **必要时使用 watch**：响应数据变化执行操作（如接口请求、路由跳转）  
- **性能关键点**：  
  - 避免在 computed 中执行高耗计算  
  - 对大数据集使用 `deep: true` 时注意性能损耗  
  - Vue3 中优先使用 `computed` + `watchEffect` 组合