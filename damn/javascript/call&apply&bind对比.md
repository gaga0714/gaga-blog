# call & apply & bind 对比

| 方法名  | 参数形式                   | 是否立即调用 | 返回值类型 | 举例                                             |
| ------- | -------------------------- | ------------ | ---------- | ------------------------------------------------ |
| `call`  | 单个参数<br>不支持分批传参 | 是           | 执行结果   | `fn.call(obj, 1, 2)`                             |
| `apply` | 数组<br>不支持分批传参     | 是           | 执行结果   | `fn.apply(obj, [1, 2])`                          |
| `bind`  | 列表<br>支持分批传参       | **否**       | 新函数     | `const newFn = fn.bind(obj, 1);`<br> `newFn(2);` |

---

`bind()`可以更好实现[柯里化](./柯里化.md)
