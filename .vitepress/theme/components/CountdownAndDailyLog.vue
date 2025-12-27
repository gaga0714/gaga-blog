<template>
  <div class="countdown-daily-log">
    <div class="container">
      <!-- 左侧倒计时 -->
      <div class="countdown-section">
        <h2>倒计时</h2>
        <div class="countdown-display">
          <div class="time-unit">
            <div class="time-value">{{ countdown.days }}</div>
            <div class="time-label">天</div>
          </div>
          <div class="time-unit">
            <div class="time-value">{{ countdown.hours }}</div>
            <div class="time-label">时</div>
          </div>
          <div class="time-unit">
            <div class="time-value">{{ countdown.minutes }}</div>
            <div class="time-label">分</div>
          </div>
          <div class="time-unit">
            <div class="time-value">{{ countdown.seconds }}</div>
            <div class="time-label">秒</div>
          </div>
        </div>
        <div class="target-date">目标日期：2026年1月27日</div>
      </div>

      <!-- 右侧每日记录 -->
      <div class="daily-log-section">
        <h2>冲冲冲</h2>
        <div class="daily-log-content" v-html="formattedLog"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const targetDate = new Date('2026-01-27T00:00:00').getTime()
const countdown = ref({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})

const dailyLogContent = ref('')
const formattedLog = ref('')

// 更新倒计时
const updateCountdown = () => {
  const now = Date.now()
  const distance = targetDate - now

  if (distance < 0) {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }

  countdown.value.days = Math.floor(distance / (1000 * 60 * 60 * 24))
  countdown.value.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  countdown.value.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
  countdown.value.seconds = Math.floor((distance % (1000 * 60)) / 1000)
}

// 加载每日记录
const loadDailyLog = async () => {
  try {
    // 尝试多个可能的路径
    const paths = ['/daily-log.md', './daily-log.md']
    let text = ''
    let success = false
    
    for (const path of paths) {
      try {
        const response = await fetch(path, { cache: 'no-cache' })
        if (response.ok) {
          text = await response.text()
          success = true
          break
        }
      } catch (e) {
        continue
      }
    }
    
    if (success && text) {
      dailyLogContent.value = text
      formattedLog.value = formatMarkdown(text)
    } else {
      formattedLog.value = '<p>暂无记录</p>'
    }
  } catch (error) {
    console.error('加载每日记录失败:', error)
    formattedLog.value = '<p>加载失败，请稍后重试</p>'
  }
}

// 改进的 markdown 格式化
const formatMarkdown = (text) => {
  if (!text) return '<p>暂无内容</p>'
  
  // 先处理代码块，避免被其他规则影响
  const codeBlocks = []
  let codeIndex = 0
  text = text.replace(/```([\s\S]*?)```/g, (match, code) => {
    const placeholder = `__CODE_BLOCK_${codeIndex}__`
    codeBlocks[codeIndex] = `<pre><code>${code.trim()}</code></pre>`
    codeIndex++
    return placeholder
  })
  
  // 处理行内代码
  const inlineCodes = []
  let inlineIndex = 0
  text = text.replace(/`([^`\n]+)`/g, (match, code) => {
    const placeholder = `__INLINE_CODE_${inlineIndex}__`
    inlineCodes[inlineIndex] = `<code>${code}</code>`
    inlineIndex++
    return placeholder
  })
  
  // 按行处理
  const lines = text.split('\n')
  let html = ''
  let inList = false
  let inBlockquote = false
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    const trimmed = line.trim()
    
    // 跳过空行（但保留用于段落分隔）
    if (!trimmed) {
      if (inList) {
        html += '</ul>'
        inList = false
      }
      if (inBlockquote) {
        html += '</blockquote>'
        inBlockquote = false
      }
      continue
    }
    
    // 标题
    if (trimmed.startsWith('#### ')) {
      if (inList) { html += '</ul>'; inList = false }
      if (inBlockquote) { html += '</blockquote>'; inBlockquote = false }
      html += `<h4>${trimmed.substring(5)}</h4>`
      continue
    }
    if (trimmed.startsWith('### ')) {
      if (inList) { html += '</ul>'; inList = false }
      if (inBlockquote) { html += '</blockquote>'; inBlockquote = false }
      html += `<h3>${trimmed.substring(4)}</h3>`
      continue
    }
    if (trimmed.startsWith('## ')) {
      if (inList) { html += '</ul>'; inList = false }
      if (inBlockquote) { html += '</blockquote>'; inBlockquote = false }
      html += `<h2>${trimmed.substring(3)}</h2>`
      continue
    }
    if (trimmed.startsWith('# ')) {
      if (inList) { html += '</ul>'; inList = false }
      if (inBlockquote) { html += '</blockquote>'; inBlockquote = false }
      html += `<h1>${trimmed.substring(2)}</h1>`
      continue
    }
    
    // 引用
    if (trimmed.startsWith('> ')) {
      if (inList) { html += '</ul>'; inList = false }
      if (!inBlockquote) {
        html += '<blockquote>'
        inBlockquote = true
      }
      html += `<p>${processInlineMarkdown(trimmed.substring(2))}</p>`
      continue
    }
    
    // 列表
    if (trimmed.match(/^[-*+] /)) {
      if (inBlockquote) { html += '</blockquote>'; inBlockquote = false }
      if (!inList) {
        html += '<ul>'
        inList = true
      }
      const content = trimmed.replace(/^[-*+] /, '')
      html += `<li>${processInlineMarkdown(content)}</li>`
      continue
    }
    
    // 普通段落
    if (inList) {
      html += '</ul>'
      inList = false
    }
    if (inBlockquote) {
      html += '</blockquote>'
      inBlockquote = false
    }
    html += `<p>${processInlineMarkdown(trimmed)}</p>`
  }
  
  // 关闭未闭合的标签
  if (inList) html += '</ul>'
  if (inBlockquote) html += '</blockquote>'
  
  // 恢复代码块
  codeBlocks.forEach((code, index) => {
    html = html.replace(`__CODE_BLOCK_${index}__`, code)
  })
  inlineCodes.forEach((code, index) => {
    html = html.replace(`__INLINE_CODE_${index}__`, code)
  })
  
  return html || '<p>暂无内容</p>'
}

// 处理行内 markdown
const processInlineMarkdown = (text) => {
  return text
    // 粗体和斜体
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
}

let timer = null

onMounted(() => {
  updateCountdown()
  loadDailyLog()
  timer = setInterval(() => {
    updateCountdown()
    // 每分钟刷新一次每日记录
    if (new Date().getSeconds() === 0) {
      loadDailyLog()
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.countdown-daily-log {
  margin: 60px 0;
  padding: 40px 20px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 40px;
  align-items: start;
}

.countdown-section,
.daily-log-section {
  background: var(--vp-c-bg-soft);
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.countdown-section h2,
.daily-log-section h2 {
  margin-top: 0;
  margin-bottom: 24px;
  font-size: 24px;
  color: var(--vp-c-text-1);
  border-bottom: 2px solid var(--vp-c-brand);
  padding-bottom: 10px;
}

.countdown-display {
  display: flex;
  justify-content: space-around;
  gap: 20px;
  margin: 30px 0;
}

.time-unit {
  text-align: center;
  flex: 1;
}

.time-value {
  font-size: 48px;
  font-weight: bold;
  color: var(--vp-c-brand);
  line-height: 1.2;
  margin-bottom: 8px;
}

.time-label {
  font-size: 16px;
  color: var(--vp-c-text-2);
}

.target-date {
  text-align: center;
  margin-top: 20px;
  font-size: 16px;
  color: var(--vp-c-text-2);
}

.daily-log-content {
  color: var(--vp-c-text-1);
  line-height: 1.8;
  max-height: 500px;
  overflow-y: auto;
}

.daily-log-content h1,
.daily-log-content h2,
.daily-log-content h3 {
  margin-top: 20px;
  margin-bottom: 12px;
  color: var(--vp-c-text-1);
}

.daily-log-content h1 {
  font-size: 24px;
}

.daily-log-content h2 {
  font-size: 20px;
}

.daily-log-content h3 {
  font-size: 18px;
}

.daily-log-content p {
  margin: 12px 0;
}

.daily-log-content ul {
  margin: 12px 0;
  padding-left: 24px;
}

.daily-log-content li {
  margin: 8px 0;
}

.daily-log-content code {
  background: var(--vp-c-bg-alt);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.daily-log-content pre {
  background: var(--vp-c-bg-alt);
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
}

.daily-log-content pre code {
  background: transparent;
  padding: 0;
}

.daily-log-content blockquote {
  border-left: 4px solid var(--vp-c-brand);
  padding-left: 16px;
  margin: 16px 0;
  color: var(--vp-c-text-2);
  font-style: italic;
}

.daily-log-content a {
  color: var(--vp-c-brand);
  text-decoration: none;
}

.daily-log-content a:hover {
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    gap: 30px;
  }

  .countdown-display {
    gap: 10px;
  }

  .time-value {
    font-size: 36px;
  }
}
</style>

