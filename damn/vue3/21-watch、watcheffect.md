# Vue 3 watch、watchEffect 对比

在 Vue 3 的响应式系统中，`watchEffect` 和 `watch` 都是用于 **观察响应式数据变化** 的 API，但它们在设计目的和使用场景上有显著区别。以下是它们的核心差异和详细对比：

---

### 一、核心差异总结
| 特性                | `watchEffect`                          | `watch`                                 |
|---------------------|----------------------------------------|----------------------------------------|
| **依赖收集**         | 自动追踪依赖                           | 需显式指定侦听的数据源                  |
| **立即执行**         | 是                                     | 默认否（可通过 `immediate: true` 开启） |
| **新旧值获取**       | 无                                     | 可获取旧值和新值                        |
| **适用场景**         | 副作用逻辑（无需关心具体哪个值变化）    | 精确监听特定值的变化                    |
| **性能优化**         | 无法跳过初始执行                       | 可通过条件判断避免不必要执行            |

---

### 二、详细解析

#### 1. 依赖收集方式
- **`watchEffect`**  
  自动追踪函数内部用到的响应式依赖（类似计算属性）。  
  ```javascript
  const count = ref(0)
  const name = ref('Alice')
  
  watchEffect(() => {
    // 自动追踪 count.value 和 name.value
    console.log(`Count: ${count.value}, Name: ${name.value}`)
  })
  ```

- **`watch`**  
  需显式指定侦听的响应式数据源（支持单个、多个或 getter 函数）。  
  ```javascript
  watch(count, (newVal, oldVal) => {
    // 仅侦听 count 的变化
  })
  
  // 监听多个值
  watch([count, name], ([newCount, newName], [oldCount, oldName]) => {
    // 显式指定依赖
  })
  ```

---

#### 2. 执行时机
- **`watchEffect`**  
  **立即执行一次**，并在依赖变化时重新执行。  
  ```javascript
  // 立即输出：Count: 0, Name: Alice
  watchEffect(() => {
    console.log(`Count: ${count.value}`)
  })
  ```

- **`watch`**  
  默认 **不会立即执行**，仅在侦听的数据源变化时触发（除非设置 `immediate: true`）。  
  ```javascript
  // 不会立即执行，只有 count 变化时触发
  watch(count, (newVal) => {
    console.log('Count changed:', newVal)
  })
  
  // 立即执行一次
  watch(count, (newVal) => {
    console.log('Count changed:', newVal)
  }, { immediate: true })
  ```

---

#### 3. 新旧值获取
- **`watchEffect`**  
  无法直接获取旧值，适合不关心旧值的场景（如发送请求、操作 DOM）。  
  ```javascript
  watchEffect(() => {
    // 只能拿到当前最新值
    fetch(`/api/data?id=${id.value}`)
  })
  ```

- **`watch`**  
  回调函数可接收 `(newValue, oldValue)`，适合需要对比新旧值的场景。  
  ```javascript
  watch(count, (newVal, oldVal) => {
    console.log(`从 ${oldVal} 变为 ${newVal}`)
  })
  ```

---

#### 4. 停止侦听
两者都返回一个 **停止函数**，用于手动取消侦听。  
```javascript
// watchEffect
const stopEffect = watchEffect(() => { /* ... */ })
stopEffect()

// watch
const stopWatch = watch(source, callback)
stopWatch()
```

---

### 三、使用场景对比

#### 适合 `watchEffect` 的情况：
1. **副作用逻辑**  
   例如：根据多个响应式状态自动提交表单、操作 DOM。
   ```javascript
   // 自动更新页面标题
   watchEffect(() => {
     document.title = `${user.value.name} - ${unreadMessages.value}`
   })
   ```

2. **依赖关系动态变化**  
   函数内部的依赖会在每次执行时重新收集。
   ```javascript
   watchEffect(() => {
     // 动态依赖：当 flag.value 为 true 时，才依赖 data.value
     if (flag.value) {
       console.log(data.value)
     }
   })
   ```

---

#### 适合 `watch` 的情况：
1. **需要精确监听特定值**  
   ```javascript
   watch(
     () => user.value.id,
     (newId, oldId) => {
       // ID 变化时重新加载数据
       fetchUserDetails(newId)
     }
   )
   ```

2. **需要对比旧值**  
   ```javascript
   watch(
     score,
     (newVal, oldVal) => {
       if (newVal > oldVal) {
         playSound('score_up')
       }
     }
   )
   ```

3. **需要延迟执行**  
   ```javascript
   // 只在用户停止输入 500ms 后执行搜索
   watch(searchQuery, debounce((newQuery) => {
     searchAPI(newQuery)
   }, 500))
   ```

---

### 四、性能注意事项
1. **`watchEffect` 的初始执行**  
   无法跳过首次执行，若副作用包含高成本操作（如网络请求），需自行添加条件判断：
   ```javascript
   let isFirstRun = true
   watchEffect(() => {
     if (isFirstRun) {
       isFirstRun = false
       return
     }
     // 后续逻辑...
   })
   ```

2. **`watch` 的深度监听**  
   监听对象/数组时，默认是浅层侦听，需用 `deep: true` 强制深度侦听：
   ```javascript
   watch(
     () => state.someObject,
     (newVal) => {
       // 深度监听对象内部变化
     },
     { deep: true }
   )
   ```

---

### 五、总结
- **选择 `watchEffect` 当**：  
  - 你需要 **立即执行一次** 副作用逻辑
  - 副作用依赖 **多个响应式值**，且无需关心具体哪个值变化
  - 依赖关系可能 **动态变化**

- **选择 `watch` 当**：  
  - 需要 **精确控制侦听的数据源**
  - 需要获取 **旧值和新值**
  - 需要 **延迟执行** 或 **条件性触发**（如防抖）