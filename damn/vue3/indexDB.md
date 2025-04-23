# indexDB 使用
## 打开数据库
```
const request = indexedDB.open("MyDatabase", 1); // 参数：数据库名、版本号
```

## 数据库初始化（监听事件）
- **结构变更只能在这里面进行**
- **触发情况：**
  - 第一次创建open
  - open时传入版本号变化

```
request.onupgradeneeded = function(event) {
  const db = event.target.result;
  // 创建对象仓库（类似于表）
  const store = db.createObjectStore("users", { keyPath: "id" }); // 主键为 id
  // 可选：创建索引
  store.createIndex("nameIndex", "name", { unique: false });
};
```

## 连接成功
```
request.onsuccess = function(event) {
  const db = event.target.result;
  console.log("数据库打开成功");

  // 可以进行增删改查等操作
  const transaction = db.transaction("users", "readwrite");
  const store = transaction.objectStore("users");
  store.add({ id: 1, name: "Alice", age: 25 });
};
```

## 连接失败
```
request.onerror = function(event) {
  console.error("数据库打开失败", event.target.error);
};
```

## 基本操作
操作 | 示例代码
|------|----------|
添加数据 | store.add({ id: 1, name: "Tom" })
获取数据 | store.get(1)
更新数据 | store.put({ id: 1, name: "Tom Updated" })
删除数据 | store.delete(1)
遍历数据 | store.openCursor().onsuccess = function(event) { ... }
清空仓库 | store.clear()