# Spa 实现 和 hash、history路由

Hash 路由由于通过监听 hash 变化实现，所以有以下优势和不足：

它在内部传递的实际 URL 之前使用了一个哈希字符（`#`）。由于这部分 URL 从未被发送到服务器，所以它不需要在服务器层面上进行任何特殊处理。

**优点**

1. 兼容性最佳。
2. 无需服务端配置。

**缺点**

1. 服务端无法获取 hash 部分内容。
2. 可能和锚点功能冲突。
3. SEO 不友好。
---

|           | 单页面应用（SPA）     | 多页面应用（MPA）                   |
| --------- | -------------- | ---------------------------- |
| 组成        | 一个主页面和多个页面片段   | 多个主页面                        |
| 刷新方式      | 局部刷新           | 整页刷新                         |
| url模式     | 哈希模式           | 历史模式                         |
| SEO搜索引擎优化 | 难实现，可使用SSR方式改善 | 容易实现                         |
| 数据传递      | 容易             | 通过url、cookie、localStorage等传递 |
| 页面切换      | 速度快，用户体验良好     | 切换加载资源，速度慢，用户体验差             |
| 维护成本      | 相对容易           | 相对复杂                         |




---

History 路由核心主要依赖 History API 里的两个方法和一个事件，其中两个方法用于操作浏览器的历史记录，事件用于监听历史记录的切换：

当使用这种历史模式时，URL 会看起来很 "正常"，例如 `https://example.com/user/id`。漂亮!

不过，问题来了。由于我们的应用是一个单页的客户端应用，如果没有适当的服务器配置，用户在浏览器中直接访问 `https://example.com/user/id`，就会得到一个 404 错误。这就尴尬了。

不用担心：要解决这个问题，你需要做的就是在你的服务器上添加一个简单的回退路由。如果 URL 不匹配任何静态资源，它应提供与你的应用程序中的 `index.html` 相同的页面。

nginx解决方法如下

```json
location / {
  try_files $uri $uri/ /index.html;
}
```

caddy v2 

```json
try_files {path} /
```

vercel

```json
{
  "rewrites": [{ "source": "/:path*", "destination": "/index.html" }]
}
```

netlify

```json
/* /index.html 200
```

你的服务器将不再报告 404 错误，此时vue解决方法为

```js
const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/:pathMatch(.*)', component: NotFoundComponent }],
})
```


**方法**

- history.pushState：将给定的 Data 添加到当前标签页的历史记录栈中。
- history.replaceState：将给定的 Data 更新到历史记录栈中最新的一条记录中。

**事件**

- popstate：监听历史记录的变化。

**优点**

1. 服务端可获取完整的链接和参数。
2. 前端监控友好。
3. SEO 相对 Hash 路由友好。

**缺点**

1. 兼容性稍弱。
2. 需要服务端额外配置（各 path 均指向同一个 HTML）。