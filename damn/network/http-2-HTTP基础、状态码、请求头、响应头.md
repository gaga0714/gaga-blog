# HTTP 基础、状态码、请求头、响应头

HTTP 超文本传输协议 是一个在计算机世界里专门在「两点」之间「传输」文字、图片、音频、视频等「超文本」数据的「约定和规范」

不一定是浏览器与服务器，服务器和服务器也可以

格式：（换行解决 tcp 粘包问题，不知道边界）（消息头里一般含有消息体的长度，通过这个长度可以去截取真正的消息体得到边界）

![alt text](image.png)

## 常用状态码：

- 1xx 类状态码属于**提示信息**
	- 100 Continue ：这个临时响应表明，迄今为止的所有内容都是可行的，客户端应该继续请求，如果已经完成，则忽略它。
	- 101 Switching Protocols：协议交换 指明服务器即将切换的协议

- 2xx 类状态码表示服务器**成功**处理了客户端的请求

	- 「**200 OK**」是最常见的成功状态码，表示一切正常。如果是非 HEAD 请求，服务器返回的响应头都会有 body 数据。
	- 「**204 No Content**」也是常见的成功状态码，与 200 OK 基本相同，但响应头没有 body 数据。
	- 「**206 Partial Content**」是应用于 HTTP 分块下载或断点续传，表示响应返回的 body 数据并不是资源的全部，从客户端发送 Range 范围标头以只请求资源的一部分，也是服务器处理成功的状态。

- 3xx 类状态码表示客户端请求的资源发生了变动，需要客户端用新的 URL 重新发送请求获取资源，也就是**重定向**。

	- 「**301 Moved Permanently**」表示永久重定向，说明请求的资源已经不存在了，需改用新的 URL 再次访问 (对应 307，不可修改请求方法重定向)
	- 「**302 Found**」表示临时重定向，说明请求的资源还在，但暂时需要用另一个 URL 来访问（对应 308，不可修改请求方法重定向）
	- 「**304 Not Modified**」 这是用于缓存的目的。它告诉客户端响应还没有被修改，因此客户端可以继续使用相同的缓存版本的响应。

> 301 和 302 都会在响应头里使用字段 Location，指明后续要跳转的 URL，浏览器会自动重定向新的 URL。

- 4xx 类状态码表示**客户端**发送的**报文有误**，服务器无法处理，也就是错误码的含义。

	- 「**400 Bad Request**」表示客户端请求的报文有错误，但只是个笼统的错误。由于被认为是客户端错误（例如，错误的请求语法、无效的请求消息帧或欺骗性的请求路由），服务器无法或不会处理请求。
	- 「**401 Unauthorized**」表示请求没有被认证或者认证失败，例如：token 失效。
	- 「**403 Forbidden**」表示服务器禁止访问资源（授权失败），并不是客户端的请求出错。未经授权的，因此服务器拒绝提供请求的资源。服务器知道客户端的身份但你权限不够不给看。
	- 「**404 Not Found**」表示请求的资源在服务器上不存在或未找到，所以无法提供给客户端。服务器找不到请求的资源。
	- 「**405  Method Not Allowed**」：客户端请求中的方法被禁止。服务器知道请求方法，但目标资源不支持该方法。
	- 「422 Unprocessable Entity」 ： 数据验证失败：当服务器接收到的数据字段不符合预期的格式或值（例如，缺失必要字段、字段数据类型错误、或字段值不在允许的范围内）时，可以返回这个状态码。
	- 「**429 Too Many Requests**」 用户在给定的时间内发送了太多请求（"限制请求速率"）

- 5xx 类状态码表示客户端请求报文正确，但是**服务器处理时内部发生了错误**，属于服务器端的错误码。

	- 「**500 Internal Server Error**」与 400 类型，是个笼统通用的错误码，服务器发生了什么错误，我们并不知道。
	- 「**501 Not Implemented**」表示客户端请求的功能还不支持，类似“即将开业，敬请期待”的意思。服务器不支持请求方法，因此无法处理。
	- 「**502 Bad Gateway**」通常是服务器作为网关或代理时返回的错误码，表示服务器自身工作正常，访问后端服务器发生了错误。作为网关或代理的服务器，从上游服务器中接收到的响应是无效的。
	- 「**503 Service Unavailable**」表示服务器当前很忙，暂时无法响应客户端，类似“网络服务正忙，请稍后重试”的意思。
	- 「**504 Gateway Timeout**」当服务器充当网关且无法及时获得响应时，会给出此错误响应。
	- 「**505 HTTP Version Not Supported**」：服务器不支持请求的HTTP协议的版本，无法完成处理


# **常见的请求头：**

### **一、基础请求头**

|请求头字段|作用描述|示例值|
|---|---|---|
|**`Host`**|指定请求的服务器域名和端口号（HTTP/1.1 必需字段）。|`Host: www.example.com:443`|
|**`User-Agent`**|标识客户端类型（浏览器、操作系统、设备等信息）。|`User-Agent: Mozilla/5.0 ... Chrome/90`|
|**`Accept`**|声明客户端可接受的内容类型（MIME 类型），服务器可据此返回不同格式。|`Accept: text/html, application/json`|
|**`Content-Type`**|指定请求体（Body）的格式类型（用于 POST/PUT 等携带数据的请求）。|`Content-Type: application/json`|
|**`Content-Length`**|指定请求体的大小（字节数）。|`Content-Length: 2048`|
### **二、缓存控制类**

|请求头字段|作用描述|示例值|
|---|---|---|
|**`Cache-Control`**|控制缓存行为（如`max-age`、`no-cache`、`no-store`）。|`Cache-Control: max-age=3600`|
|**`If-Modified-Since`**|提供资源修改时间，若服务器资源未修改则返回 304 状态码（省流量）。|`If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT`|
|**`If-None-Match`**|提供资源 ETag 标识符，若内容未变更则返回 304（与`ETag`配合）。|`If-None-Match: "deadbeef"`|
### **三、认证与安全类**

|请求头字段|作用描述|示例值|
|---|---|---|
|**`Authorization`**|用于客户端身份认证，通常携带 Token 或 OAuth2 凭证。|`Authorization: Bearer eyJhbGciOi...`|
|**`Cookie`**|包含客户端存储的 Cookie 信息（会话管理、个性化设置等）。|`Cookie: name=value; token=abc123`|
|**`Referer`**|表示请求来源的 URL（用于反爬、统计等，但可能被屏蔽或篡改）。|`Referer: https://www.google.com/`|
|**`Origin`**|标明请求来源的域名（用于 CORS 跨域资源共享检查）。|`Origin: https://www.example.com`|
|**`Sec-Fetch-*`**|提供请求的上下文（如`Sec-Fetch-Dest`、`Sec-Fetch-Mode`），增强安全性。|`Sec-Fetch-Mode: cors`|

### **四、连接与性能优化类**

|请求头字段|作用描述|示例值|
|---|---|---|
|**`Connection`**|控制连接是否保持活动（如`keep-alive`复用 TCP 连接）。|`Connection: keep-alive`|
|**`Accept-Encoding`**|声明客户端支持的压缩算法（如 gzip、br）。|`Accept-Encoding: gzip, deflate, br`|
|**`Accept-Language`**|声明客户端首选语言（服务器可返回对应语言的内容）。|`Accept-Language: en-US, zh-CN;q=0.9`|
|**`User-Agent`**|（重复但重要）：用于服务器适配不同设备（如返回移动端/PC 版页面）。|`User-Agent: Mozilla/5.0 (iPhone; ...)`|
### **五、分块传输与范围请求**

|请求头字段|作用描述|示例值|
|---|---|---|
|**`Transfer-Encoding`**|指示请求体使用分块传输编码（常用于流式数据上传）。|`Transfer-Encoding: chunked`|
|**`Range`**|请求部分内容（如大文件断点续传）。|`Range: bytes=0-1023`|

### **六、其他重要请求头**

|请求头字段|作用描述|示例值|
|---|---|---|
|**`Upgrade-Insecure-Requests`**|表示客户端支持升级到 HTTPS（用于混合内容页面的安全迁移）。|`Upgrade-Insecure-Requests: 1`|
|**`DNT`**|用户禁止跟踪请求（`Do Not Track`）。|`DNT: 1`|


# **常见的响应头：**

### **一、基础响应头**

| 响应头字段                | 作用描述                                 | 示例值                                      |
| -------------------- | ------------------------------------ | ---------------------------------------- |
| **`Content-Type`**   | 声明响应体的格式类型（MIME 类型）及编码，通知客户端如何解析内容。  | `Content-Type: text/html; charset=UTF-8` |
| **`Content-Length`** | 响应体的字节数（需与实际传输的 Body 大小一致）。          | `Content-Length: 2048`                   |
| **`Date`**           | 响应生成的时间（GMT 格式）。                     | `Date: Wed, 21 Oct 2023 08:30:00 GMT`    |
| **`Server`**         | 标识服务器软件信息（如 Apache、Nginx）。出于安全，常被隐藏。 | `Server: nginx/1.18.0`                   |

### **二、缓存控制类**

|响应头字段|作用描述|示例值|
|---|---|---|
|**`Cache-Control`**|控制客户端的缓存行为（优先级高于`Expires`）。|`Cache-Control: max-age=3600, public`|
|**`Expires`**|指定响应过期时间（GMT 时间）。若与`Cache-Control`冲突，后者优先。|`Expires: Wed, 21 Oct 2023 09:30:00 GMT`|
|**`ETag`**|资源唯一标识符（哈希值），用于缓存验证（对比`If-None-Match`）。|`ETag: "deadbeef"`|
|**`Last-Modified`**|资源的最后修改时间，用于缓存验证（对比`If-Modified-Since`）。|`Last-Modified: Wed, 21 Oct 2023 07:00:00 GMT`|

### **三、安全与跨域控制类**

|响应头字段|作用描述|示例值|
|---|---|---|
|**`Access-Control-Allow-Origin`**|指定允许跨域的源（CORS），`*`表示允许任何源。|`Access-Control-Allow-Origin: https://example.com`|
|**`Content-Security-Policy`**|定义内容安全策略，防止 XSS、数据注入等攻击。|`Content-Security-Policy: default-src 'self'`|
|**`Strict-Transport-Security`**|强制客户端使用 HTTPS 连接（HSTS）。|`Strict-Transport-Security: max-age=31536000`|
|**`X-Content-Type-Options`**|禁止浏览器 MIME 嗅探，要求严格遵循`Content-Type`。|`X-Content-Type-Options: nosniff`|
|**`X-Frame-Options`**|控制页面是否允许被嵌入`<frame>`、`<iframe>`（防点击劫持）。|`X-Frame-Options: SAMEORIGIN`|
|**`Set-Cookie`**|服务器向客户端设置 Cookie（可指定域、路径、过期时间、安全策略等）。|`Set-Cookie: token=abc123; Path=/; Secure; HttpOnly`|
### **四、性能优化类**

|响应头字段|作用描述|示例值|
|---|---|---|
|**`Content-Encoding`**|声明响应体的压缩算法（如`gzip`、`br`）。|`Content-Encoding: gzip`|
|**`Vary`**|指示缓存系统根据特定头字段（如`User-Agent`）返回不同版本内容。|`Vary: User-Agent, Accept-Encoding`|

### **五、重定向与状态类**

|响应头字段|作用描述|示例值|
|---|---|---|
|**`Location`**|在 3xx 重定向响应中，指定客户端应跳转的 URL。|`Location: /new-page`|
|**`Refresh`**|指定页面自动重定向或刷新（较少用，通常由`Location`代替）。|


# HTTP 请求方法

HTTP 定义了一组**请求方法**，以表明要对给定资源执行的操作。指示针对给定资源要执行的期望动作。虽然它们也可以是名词，但这些请求方法有时被称为 _HTTP 动词_。每一个请求方法都实现了不同的语义，但一些共同的特征由一组共享：例如一个请求方法可以是[安全的](https://developer.mozilla.org/zh-CN/docs/Glossary/Safe)、[幂等的](https://developer.mozilla.org/zh-CN/docs/Glossary/Idempotent)或[可缓存的](https://developer.mozilla.org/zh-CN/docs/Glossary/Cacheable)。

[`GET`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/GET)：`GET` 方法请求一个指定资源的表示形式，使用 `GET` 的请求应该只被用于获取数据。

[`HEAD`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/HEAD)：`HEAD` 方法请求一个与 `GET` 请求的响应相同的响应，但没有响应体。

[`POST`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST)：`POST` 方法用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用。

[`PUT`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/PUT)：`PUT` 方法用有效载荷请求替换目标资源的所有当前表示。

[`DELETE`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/DELETE)：`DELETE` 方法删除指定的资源。

[`CONNECT`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/CONNECT)：`CONNECT` 方法建立一个到由目标资源标识的服务器的隧道。

[`OPTIONS`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/OPTIONS)：`OPTIONS` 方法用于描述目标资源的通信选项。

[`TRACE`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/TRACE)：`TRACE` 方法沿着到目标资源的路径执行一个消息环回测试。

[`PATCH`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/PATCH)：`PATCH` 方法用于对资源应用**部分修改**。

## GET 和 POST 有什么区别

GET 的语义是从服务器获取指定的资源：

- 参数一般写在 URL里，只能支持 ASCII，浏览器对长度有限制
- **幂等（多次请求结果都一样）**
- 可以缓存，当书签

POST 的语义是根据请求负荷对指定的资源做出处理：

- body 中的数据可以是任意格式的数据，对大小无限制
- 不是幂等
- 一般不可缓存，不能当书签

Cookie是一种对无状态的HTTP进行状态化的技术

WebSocket 使用了 TCP全双工能力，想建立 WebSocket 连接，就会在 HTTP 请求里带上一些特殊的header 头：

```http
Connection: Upgrade
Upgrade: WebSocket
Sec-WebSocket-Key: T2a6wZlAwhgQNqruZ2YUyg==\r\n
```


**Content-Security-Policy** 补充

```http
Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com
```

在这里，各种内容默认仅允许从文档所在的源获取，但存在如下例外：

- 图片可以从任何地方加载 (注意“*”通配符)。
- 多媒体文件仅允许从 media1.com 和 media2.com 加载（不允许从这些站点的子域名）。
- 可运行脚本仅允许来自于 userscripts.example.com。


可以指定 report-uri 来向特定地址发送违规报告 