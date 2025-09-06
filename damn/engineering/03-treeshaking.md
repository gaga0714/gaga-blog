# Tree Shaking（摇树优化）

是一种用于消除 JavaScript 项目中未使用代码（Dead Code）的优化技术，通常应用于前端构建流程（如 Webpack、Rollup 等工具）。它的核心目标是减少最终打包文件的体积，提升应用性能。

---

### **Tree Shaking 的原理**
1. **静态分析**  
   构建工具（如 Webpack）在打包时，会通过 **静态分析** 代码的模块依赖关系，判断哪些导出的代码（如函数、变量、类）被实际引用，哪些是未被引用的“死代码”。
   
2. **依赖 ES Module（ES6 模块化语法）**  
   Tree Shaking 依赖于 ES6 的 `import`/`export` 语法，因为 ES Module 是 **静态的**（代码结构在编译阶段可解析），而动态的 CommonJS（如 `require()`）无法被静态分析。

---

### **典型流程**
1. 开发者编写多个 ES6 模块，导出多个函数或变量。  
   ```javascript
   // math.js
   export const add = (a, b) => a + b;
   export const multiply = (a, b) => a * b; // 未被使用
   ```

2. 项目中使用其中一个函数：  
   ```javascript
   // app.js
   import { add } from './math.js';
   console.log(add(1, 2));
   ```

3. 构建工具识别出 `multiply` 未被引用，将其从最终代码中剔除。

---

### **生效条件**
4. **使用 ES Module 语法**  
   模块必须通过 `import`/`export` 定义依赖关系。CommonJS 语法（如 `require()`）无法被 Tree Shaking 处理。

5. **工具支持**  
   构建工具需启用 Tree Shaking 功能（如 Webpack 从 v2+ 默认支持，需配置生产模式 `mode: 'production'`）。

6. **标记无副作用代码**  
   在 `package.json` 中配置 `sideEffects: false`，向工具声明模块没有副作用（如全局变量修改），允许安全删除未用代码。例如：
   ```json
   {
     "name": "your-package",
     "sideEffects": false
   }
   ```

---

### **常见问题与解决**
- **为什么 Tree Shaking 不生效？**  
  - 代码中使用了 CommonJS 语法。
  - Babel 配置将 ES Module 转为 CommonJS（需在 Babel 中保留 ES Module，设置 `modules: false`）。
  - 模块存在副作用（如立即执行函数），导致工具无法安全移除代码。

- **如何处理副作用？**  
  在 `package.json` 的 `sideEffects` 中指定有副作用的文件：
  ```json
  {
    "sideEffects": ["./src/polyfill.js"]
  }
  ```


要提升 **Tree Shaking（摇树优化）** 的效果，关键在于编写 **静态可分析** 且 **无副作用** 的模块化代码。以下是具体的代码优化技巧和实践方法：

---

### **1. 使用 ES Module 语法**
Tree Shaking **依赖 ES Module 的静态结构**，确保模块导入导出使用 `import/export`，而非 `require/module.exports`（CommonJS）。

```javascript
// ❌ CommonJS 难以被分析（避免）
const utils = require('./utils');
module.exports = utils;

// ✅ ES Module 代码（推荐）
import { add } from './math';
export { multiply } from './math';
```

---

### **2. 按需导出与导入**
将代码拆分为更小颗粒的模块，按需导出函数、变量或类，避免导出大对象或命名空间，便于工具识别未使用的代码。

```javascript
// ❌ 导出大对象（不推荐）
export default {
  add: (a, b) => a + b,
  multiply: (a, b) => a * b,
  log: (msg) => console.log(msg)
};

// ✅ 按需导出（推荐，未被导入的会被删除）
export const add = (a, b) => a + b;
export const multiply = (a, b) => a * b;
export const log = (msg) => console.log(msg);
```

---

### **3. 避免模块副作用**
构建工具会标记“副作用代码”（如全局变量修改、立即执行函数），导致无法删除未引用的代码。**减少副作用**或显式声明副作用文件。

```javascript
// ❌ 模块顶层副作用代码（立即执行函数、全局操作）
window.globalConfig = { version: '1.0' }; // 副作用

// ✅ 将副作用移至函数内（调用时才执行）
export const initConfig = () => {
  window.globalConfig = { version: '1.0' };
};

// 在 package.json 中声明无副作用或标记副作用文件
{
  "sideEffects": false,    // 如果模块均无副作用
  "sideEffects": ["*.css"] // 声明需要保留的副作用文件（如 CSS）
}
```

---

### **4. 谨慎使用 Babel/TypeScript 转换**
**Babel 或 TypeScript 默认会将 ES Module 转译为 CommonJS**，破坏静态结构。通过配置保留 ES Module：

#### **Babel 配置（`.babelrc`）**
```json
{
  "presets": [
    ["@babel/preset-env", { "modules": false }], // 保留 ES Module
    "@babel/preset-react",
    "@babel/preset-typescript"
  ]
}
```

#### **TypeScript 配置（`tsconfig.json`）**
```json
{
  "compilerOptions": {
    "module": "ESNext" // 输出 ES Module 格式
  }
}
```

---

### **5. 选择支持 Tree Shaking 的第三方库**
优先选择以 ES Module 格式发布的库，并在使用时按需导入。例如：
- Lodash → `lodash-es`（ES Module 版本）
- Antd → 使用 [`babel-plugin-import`](https://github.com/ant-design/babel-plugin-import) 按需导入组件

```javascript
// ❌ 全部导入（增加体积）
import _ from 'lodash';
_.add(1, 2);

// ✅ 按需导入（推荐）
import { add } from 'lodash-es';
add(1, 2);
```

---

### **6. 移除无效代码逻辑**
明确删除未使用的代码分支或变量：
```javascript
// ❌ 条件判断中包含不可达代码
if (false) {
  未使用的代码(); // 工具可能无法删除
}

// ✅ 直接删除无效代码
```

---

### **7. 生产环境构建优化**
在 Webpack 等工具中，启用生产模式优化：
```javascript
// webpack.config.js
module.exports = {
  mode: 'production', // 启用生产模式（自动压缩和 Tree Shaking）
  optimization: {
    usedExports: true,  // 标记未使用代码
    minimize: true,     // 启用压缩（删除未使用代码）
  },
};
```

---

### **8. 使用纯函数（Pure Function）**
工具可通过 `/*#__PURE__*/` 注释标记无副作用的函数调用：
```javascript
// 标记后的函数调用可被安全删除
const result = /*#__PURE__*/ calculateValue();
```


下面是一个简单的手写Tree Shaking算法实现，用于消除未使用的ES模块导出：

```javascript
/**
 * Tree Shaking算法实现
 * @param {Object} modules 模块集合，以模块ID为key
 * @param {string} entryModuleId 入口模块ID
 * @returns {Object} 各模块最终保留的导出名称
 */
function treeShake(modules, entryModuleId) {
  const usedExports = {};

  // 标记使用状态的递归函数
  function markUsed(moduleId, exportName) {
    const module = modules[moduleId];
    if (!module || !module.exports) return;

    // 初始化模块的使用记录
    if (!usedExports[moduleId]) {
      usedExports[moduleId] = new Set();
    }

    // 避免重复处理
    if (usedExports[moduleId].has(exportName)) return;
    usedExports[moduleId].add(exportName);

    // 查找对应的导出项
    const exportInfo = module.exports.find(e => e.name === exportName);
    if (!exportInfo) return;

    // 处理重新导出（递归标记依赖）
    if (exportInfo.importedFrom) {
      markUsed(exportInfo.importedFrom, exportInfo.importName);
    }
  }

  // 标记入口模块的导出
  if (modules[entryModuleId]) {
    modules[entryModuleId].exports.forEach(exp => {
      markUsed(entryModuleId, exp.name);
    });
  }

  // 遍历所有模块的导入
  Object.values(modules).forEach(module => {
    module.imports.forEach(imp => {
      markUsed(imp.source, imp.imported);
    });
  });

  // 生成最终结果
  const result = {};
  Object.keys(modules).forEach(moduleId => {
    const keptExports = modules[moduleId].exports
      .filter(exp => usedExports[moduleId]?.has(exp.name))
      .map(exp => exp.name);
    
    result[moduleId] = keptExports;
  });

  return result;
}

// 示例模块定义
const modules = {
  entry: {
    exports: [
      { name: 'main', importedFrom: 'moduleA', importName: 'foo' }
    ],
    imports: [
      { source: 'moduleA', imported: 'foo', local: 'foo' }
    ]
  },
  moduleA: {
    exports: [
      { name: 'foo', importedFrom: 'moduleB', importName: 'bar' },
      { name: 'unused' }
    ],
    imports: [
      { source: 'moduleB', imported: 'bar', local: 'bar' }
    ]
  },
  moduleB: {
    exports: [
      { name: 'bar', localName: 'bar' },
      { name: 'baz', localName: 'baz' }
    ],
    imports: []
  }
};

// 执行Tree Shaking
const result = treeShake(modules, 'entry');
console.log(result);
/* 输出:
{
  entry: ["main"],
  moduleA: ["foo"],
  moduleB: ["bar"]
}
*/
```

### 算法说明：
1. **数据结构**：
   - 每个模块包含`exports`和`imports`数组
   - 导出项支持两种类型：
     - 本地导出：`{name: 'foo', localName: 'foo'}`
     - 重新导出：`{name: 'foo', importedFrom: 'moduleB', importName: 'bar'}`

2. **核心流程**：
   1. **标记入口导出**：从入口模块开始标记所有导出
   2. **遍历导入项**：递归标记所有被导入的导出
   3. **处理重新导出**：递归追踪跨模块的导出依赖
   4. **生成结果**：过滤未使用的导出

3. **关键函数**：
   - `markUsed()`：递归标记导出使用状态，处理重新导出链
   - `treeShake()`：主流程控制，协调各处理步骤