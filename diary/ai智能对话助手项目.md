### SSE怎么实现具体代码
```js
// —— 发送请求
const handleRequest = async () => {
  if (!queryKeys.value) return
  if (!sessionList.value.length) await handleAddSession()

  // 1) 追加用户消息（移除 name 字段，兼容性更好）
  queryInfos.value.messages.push({ role: 'user', content: queryKeys.value })
  queryKeys.value = null
  messageRef.value?.scrollBottom()

  try {
    loading.value = true
    // 2) 预置 assistant 空消息
    queryInfos.value.messages.push({ role: 'assistant', content: '' })

    // 3) 流式追加
    await streamDeepseek({
      model: queryInfos.value.model || 'deepseek-chat',
      messages: queryInfos.value.messages.slice(0, -1), // 不把占位这条传上去
      onDelta: (chunk) => {
        queryInfos.value.messages[queryInfos.value.messages.length - 1].content += chunk
        messageRef.value?.scrollBottom()
      }
    })

    // 4) 持久化会话
    sessionList.value[activeIndex.value].messages = queryInfos.value.messages
  } catch (error) {
    queryInfos.value.messages[queryInfos.value.messages.length - 1].content = String(error?.message || error)
  } finally {
    loading.value = false
  }
}
```

```js
// —— 核心：SSE 流式读取（代理到后端 /api/chat）
async function streamDeepseek({ model, messages, onDelta }) {
  const resp = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'text/event-stream' },
    body: JSON.stringify({ model, messages, stream: true })
  })
  if (!resp.ok || !resp.body) throw new Error(`HTTP ${resp.status}`)

  const reader = resp.body.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })

    let idx
    while ((idx = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, idx).trim()
      buffer = buffer.slice(idx + 1)

      if (!line || line.startsWith(':')) continue
      if (!line.startsWith('data:')) continue

      const payload = line.slice(5).trim()
      if (payload === '[DONE]') return

      try {
        const json = JSON.parse(payload)
        const delta = json?.choices?.[0]?.delta?.content || ''
        if (delta) onDelta(delta)
      } catch {
        onDelta(payload) // 非 JSON 情况
      }
    }
  }
}
```
每次后端 SSE 推来一小段文本 chunk，就追加到最后一条 assistant 的 content

因为 messages 是响应式数组，Vue 会自动触发视图更新，


### 封装markdown组件


### docker cicd

