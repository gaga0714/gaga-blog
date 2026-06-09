# 修复记录

## 问题1

编辑用户分群时，「数仓标签」卡片里的操作符（op）和值（value）没有回填，只有字段（field）能正常显示。

### 原因

DimTagRowsForm.vue 中有两个 watcher：

- field watcher：监听字段变化，会清空 op 和 value（防止字段类型变了之后 op/value 不匹配）
- op watcher：监听 op 在 in / 非 in 之间切换时，清空 value（避免格式残留）

这两个 watcher 设计用于用户手动编辑的场景。 给所有行赋值 {field, op, value} 时，field从空变成有值会触发 field watcher，立即把刚填进去的 op 和 value 全部清空。

### 解决方案

引入 isBackfilling 标志位区分「程序回填」和「用户操作」：

1. 新增 const isBackfilling = ref(false)
2. 两个 watcher 开头加 if (isBackfilling.value) return 直接跳过
3. setRows() 中赋值前置 isBackfilling.value = true，再用 nextTick 等 watcher 跑完后恢复为 false
4. 补充 nextTick 的 import

这样回填时 watcher 不再误清数据，用户手动改。

## 问题2

编辑条件分群时，数仓标签里日期字段提交的 value 末尾出现两个 Z（如 "2026-06-01T00:00:00ZZ"），后端无法识别该格式。

触发链路（接口竞态）：

编辑页 onMounted 并发请求两个接口：

- GET /user/user_segments/{id} —— 拿详情，喂给 setRows 回填
- GET /user/user_segments/query_enums —— 拿字段类型，构建 fieldTypeMap

当详情先回、枚举后回时：

1. setRows() 跑时 fieldTypeMap 还是空 Map
2. serializeValue 查不到字段类型 → categoryOf('') 返回 'string' → 走 return String(value) 把后端原值 "2026-06-01T00:00:00Z" 原样塞进 row.value（Z 没被切掉）3. 几百毫秒后枚举接口返回，fieldTypeMap 填好，widget 从 text 切到 datetime-picker
3. 用户点保存，parseValue 这次识别为 cat === 'date'，长度 ≠ 16，走 return ${withSeconds}Z → 在已有的 Z 后又追加一个 → ZZ

### 修改方案

DimTagRowsForm.vue 两处改动，让序列化/反序列化对 ISO 字符串幂等：

1. parseValue（提交时）：先剥离已有 Z
   const trimmed = v.endsWith('Z') ? v.slice(0, -1) : v;
   const withSeconds = trimmed.length === 16 ? `${trimmed}:00` : trimmed;
   return `${withSeconds}Z`;
   DATE-only 类型也额外加 ISO 检测：已是完整 ISO 则直接复用，避免被包成 "...ZT00:00:00Z"。

2. serializeValue（回填时）：按值形状兜底裁剪

当 fieldTypeMap 还没就绪（t === ''）时，用正则识别 ISO 8601 字符串，照样裁到 picker 期望格式：
const isISODateTime = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(value);
const isISODate = /^\d{4}-\d{2}-\d{2}$/.test(value);
if (cat === 'date' || (!t && (isISODateTime || isISODate))) {
if (isDateOnlyType(t) || (!t && isISODate && !isISODateTime)) {
return value.slice(0, 10);
}
return value.slice(0, 16);
}

### 双重保险设计

- 修改 1（parseValue）：兜底——无论 row.value 怎么来的，提交结果都恰好一个 Z
- 修改 2（serializeValue）：根治——回填时直接把 Z 切掉，row.value 从一开始就是 "2026-06-01T00:00"，picker 也能正确显示（带 Z 的字符串会被 datetime-local 拒绝渲染为空）
