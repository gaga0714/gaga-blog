# 模块化、esm、cjs

模块化是为了解决变量全局污染和依赖管理混乱的问题

commonjs

- 所有代码都运行于模块作用域，不会污染全局。
- 使用同步的方式加载，也就是说，只有加载完成才能执行后面的操作。
- CommonJS 支持动态导入的方式，比如：require(`./${path}.js`)
- 模块可以多次加载，但是只会在第一次加载时运行一次，然后加载结果会被缓存，后面再次加载会直接读取缓存结果，如果想让模块重新执行，就必须清除缓存。
- CommonJS 模块输出的是一个值的**拷贝**
- 模块的加载顺序，按照其在代码中出现的顺序。

esmodule：

- ES6 的模块自动采用严格模式，不管你有没有在模块头部加上"use strict";
- ESModule 导出的模块是只读的，不能变更，否则报错
- ESModule 输出的是值的**引用**
- 模块只会加载一次


严格模式：
严格模式（Strict Mode）是 ES5 引入的一种**代码执行模式** ，通过添加 `"use strict";` 指令启用。它强制 JavaScript 引擎以更严格的语法和错误检查规则运行代码，旨在：

- **消除静默错误** → 转为显式抛出错误
- **阻止危险代码** → 禁用不安全的语法
- **优化执行效率** → 帮助引擎更好优化代码



---


ESM输出的是`值的引用`，而CJS输出的是`值的拷贝`；

CJS的输出是`运行时加载`，而ESM是`编译时`输出接口；

CJS是`同步加载`，ESM是`异步加载`；


```ts
// 导出：export命令
export const obj = {name: 'E1e'}；

// 默认导出 export default命令
export default {name: 'E1e'};


// 引入接口：import命令

// 引入普通导出
import { obj } from './test.js';

// 引入默认导出
import obj from './test.js';

```

```ts
// 导出
const obj = {a: 1};
module.exports = obj;

// 引入
const obj = require('./test.js');

```