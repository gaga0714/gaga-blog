https://juejin.cn/post/7448462026944757771?searchId=20250909224920B0466060F41803C1FD57

- 类型抽出
  - 选择指定属性Pick
  - 排除指定属性Omit
- 类型合并
  - 交叉类型&
  - 接口继承extends
- interface 接口，可继承，可重复定义
- type
- 泛型
- 交叉类型&
- 联合类型|
- 可选链?.
  - 不存在方法不执行
  - 不存在值（是null或undefined）返回undefined
- 空值合并？？ 左侧为null或undefined时返回右侧值
  - 对比|| 会对所有假值生效（false,null,undefined,"",0,NaN）
- 非空断言! **跳过ts的类型检查(可空性保障)**，强制认为值存在。如果实际不存在，抛出typeError错误=>用处：提高开发效率，简化代码结构，还有别的吗？？？
- 双非断言!! 转布尔值，Boolean(value)


ts的严格模式，在`tsconfig.json`里，
```json
    "compilerOptions": {
        "skipLibCheck": true,//开启严格模式
    }
```

ts类型检查三件事：
- 结构验证（如果您声明一个变量是 Person 接口，TS 就会检查该变量是否具有 Person 接口定义的所有属性和方法。）
- 可访问性保障（防止您访问一个对象上可能不存在的属性）
- 约束流控制（主动检查一个变量在被使用时，是否可能是 null 或 undefined）
```ts
// item 的类型是 HTMLElement | null
const item = document.getElementById('my-id');

// ❌ TS 类型检查会在这里报错：
// TS 认为 item 可能是 null，对 null 调用 .click() 会导致运行时 TypeError。
// item.click(); 

// ✅ TS 强制你先进行检查（收窄类型）
if (item) {
    item.click(); // 只有在这里才允许调用，因为 item 已经被确定非 null
}
```
