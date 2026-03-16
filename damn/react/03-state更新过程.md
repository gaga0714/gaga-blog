# state 更新过程

更新前置设计：

- 批量更新-减少更新次数
- 更新时间分片调度（开启相关 api 才会进入）
- 更新优先级标识 Lane 和 ExpirationTime（老版本）同时更新，父级 fiber 链childLanes（方便调和阶段快速找到要更新的 fiber）

更新后置设计：

协调阶段

- 通过对比 childLanes 来找到更新的组件
- 给 fiber 打 flags 标记和 subtreeFlags 标记

commit

- 执行生命周期，和更新回调，更新 DOM