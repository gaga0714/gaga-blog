# Vue 3 Composition API vs Options API

### 一、Options API 的局限性
在 Vue 2 中，Options API（通过 `data`、`methods`、`computed` 等选项组织代码）存在以下问题：

1. **逻辑分散**  
   同一功能的代码被拆分到不同选项中（如 `data` 定义变量，`methods` 定义方法，`watch` 监听变化），导致代码阅读和维护困难。

   ```javascript
   // Options API 示例：一个计数器逻辑被分散到多个选项中
   export default {
     data() {
       return { count: 0 }
     },
     methods: {
       increment() { this.count++ }
     },
     watch: {
       count(newVal) { console.log('Count changed:', newVal) }
     }
   }
   ```

2. **逻辑复用困难**  
   通过 `mixins` 或高阶组件复用逻辑时，存在 **命名冲突**、**来源不透明** 等问题。

3. **类型支持薄弱**  
   Vue 2 的 `this` 上下文导致 TypeScript 类型推断困难，难以实现严格的类型检查。

4. **大型组件臃肿**  
   复杂组件的代码量增加后，功能逻辑难以拆分和复用。

---

### 二、Composition API 的核心优势

#### 1. **逻辑聚合与自由组织**
Composition API 允许将 **同一功能的代码集中在一起**（按逻辑功能组织），而不是分散在不同选项中。

```vue
<script setup>
import { ref, watch } from 'vue'

// 计数器逻辑集中在一个区域
const count = ref(0)
const increment = () => { count.value++ }
watch(count, (newVal) => {
  console.log('Count changed:', newVal)
})
</script>
```

#### 2. **更灵活的逻辑复用**
通过 **组合式函数（`useXxx`）** 封装逻辑，实现类似 React Hooks 的复用方式，避免 Mixin 的缺陷。

```javascript
// 复用逻辑：封装计数器功能
export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const increment = () => { count.value++ }
  return { count, increment }
}

// 在组件中使用
const { count, increment } = useCounter(10)
```

#### 3. **更好的 TypeScript 支持**
- 变量和函数类型可显式声明，无需依赖 `this` 上下文。
- 组合式函数天然支持类型推导。

```typescript
import { ref } from 'vue'

// 明确的类型声明
const count = ref<number>(0)
const increment = (): void => { count.value++ }
```

#### 4. **更细粒度的响应式控制**
- 使用 `ref` 和 `reactive` 显式声明响应式数据。
- 通过 `computed` 和 `watch` 精确管理依赖关系。

```javascript
const state = reactive({ user: null, loading: false })
const fullName = computed(() => state.user ? `${state.user.first} ${state.user.last}` : '')
```

#### 5. **更灵活的代码结构**
- 支持在函数作用域内声明生命周期钩子。
- 逻辑块可自由拆分和组合。

```javascript
// 异步获取数据的逻辑
const fetchData = async () => {
  const data = await api.get('/data')
  state.data = data
}
onMounted(fetchData) // 在 mounted 时执行
```

---

### 三、Composition API vs Options API 对比

| 特性                     | Options API                          | Composition API                      |
|--------------------------|--------------------------------------|--------------------------------------|
| **代码组织**              | 按选项类型（data/methods 等）分割    | 按逻辑功能聚合                       |
| **逻辑复用**              | Mixins（易冲突）                     | 组合式函数（无命名冲突）              |
| **响应式控制**            | 隐式声明（data 返回对象）            | 显式声明（ref/reactive）             |
| **TypeScript 支持**       | 弱（依赖 `this` 上下文）             | 强（函数作用域 + 类型推断）           |
| **生命周期管理**          | 分散在选项（created/mounted 等）     | 集中通过函数调用（onMounted 等）      |
| **代码可读性（复杂组件）**| 低（逻辑分散）                       | 高（功能模块化）                     |
| **灵活性**                | 低（固定结构）                       | 高（自由组合）                       |

---

### 四、Composition API 解决的问题场景

#### 1. **跨组件逻辑复用**
- **Options API**：通过 Mixins 复用，但可能引发命名冲突，且来源不透明。
- **Composition API**：通过函数组合，明确依赖关系，避免冲突。

#### 2. **复杂组件维护**
- **Options API**：随着功能增加，代码分散到多个选项，难以追踪。
- **Composition API**：将同一功能的变量、方法、监听集中管理。

```javascript
// 示例：用户认证逻辑集中管理
const { user, login, logout } = useAuth()
const { orders, loadOrders } = useUserOrders(user)
```

#### 3. **TypeScript 项目开发**
- **Options API**：类型推导困难，需要额外类型声明。
- **Composition API**：天然支持类型推断，减少类型错误。

#### 4. **动态逻辑组合**
- **Options API**：逻辑在选项中固定，难以动态调整。
- **Composition API**：可根据条件动态组合不同逻辑。

```javascript
if (needsTracking) {
  useAnalytics() // 按需加入统计逻辑
}
```

---

### 五、实际应用示例：封装数据请求逻辑

#### 使用 Composition API 封装：
```javascript
// utils/useFetch.js
import { ref, onMounted } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchData = async () => {
    try {
      loading.value = true
      const response = await fetch(url)
      data.value = await response.json()
    } catch (err) {
      error.value = err
    } finally {
      loading.value = false
    }
  }

  onMounted(fetchData) // 自动在组件挂载时执行

  return { data, loading, error, retry: fetchData }
}

// 在组件中使用
const { data, loading } = useFetch('/api/user')
```

---

### 六、总结

**Composition API 的核心价值**在于：
1. **逻辑自由聚合**：告别代码碎片化，按功能组织代码。
2. **复用性革命**：通过函数组合替代 Mixins，实现无副作用的逻辑复用。
3. **类型友好**：与 TypeScript 深度协同，提升代码健壮性。
4. **响应式控制**：显式管理依赖关系，优化性能。

尽管 Options API 仍适用于简单场景，但在 **中大型项目** 或 **需要高复用性** 的场景下，Composition API 提供了更现代的解决方案，代表了 Vue 生态的未来方向。