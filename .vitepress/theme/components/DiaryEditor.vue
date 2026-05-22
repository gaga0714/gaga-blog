<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, withBase } from 'vitepress'
import MarkdownIt from 'markdown-it'
import { useDiaryAuth } from '../composables/diaryAuth.js'

const router = useRouter()
const { isLoggedIn, login, logout, authedFetch } = useDiaryAuth()

const md = new MarkdownIt({ html: true, linkify: true, breaks: true })

const pwd = ref('')
const loggingIn = ref(false)
const loginError = ref('')

const slug = ref('')
const title = ref('')
const content = ref('')
const loading = ref(false)
const saving = ref(false)
const uploading = ref(false)
const errorMsg = ref('')
const okMsg = ref('')

const textareaRef = ref(null)
const fileInputRef = ref(null)

const isEdit = computed(() => !!slug.value)
const previewHtml = computed(() => md.render(content.value || ''))

function readSlugFromUrl() {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('slug') || ''
}

async function doLogin() {
  if (!pwd.value) return
  loggingIn.value = true
  loginError.value = ''
  try {
    await login(pwd.value)
    pwd.value = ''
    if (slug.value) await loadArticle()
  } catch (e) {
    loginError.value = e.message || '登录失败'
  } finally {
    loggingIn.value = false
  }
}

async function loadArticle() {
  if (!slug.value || !isLoggedIn()) return
  loading.value = true
  errorMsg.value = ''
  try {
    const r = await authedFetch(`/api/articles/${encodeURIComponent(slug.value)}`)
    if (!r.ok) {
      const j = await r.json().catch(() => ({}))
      throw new Error(j.error || `load failed (${r.status})`)
    }
    const j = await r.json()
    title.value = j.title || ''
    content.value = j.content || ''
  } catch (e) {
    errorMsg.value = e.message || 'load failed'
  } finally {
    loading.value = false
  }
}

function insertAtCursor(text) {
  const ta = textareaRef.value
  if (!ta) {
    content.value += text
    return
  }
  const start = ta.selectionStart
  const end = ta.selectionEnd
  const before = content.value.slice(0, start)
  const after = content.value.slice(end)
  content.value = before + text + after
  nextTick(() => {
    ta.focus()
    const pos = start + text.length
    ta.setSelectionRange(pos, pos)
  })
}

function pickImage() {
  fileInputRef.value?.click()
}

async function onPickImage(ev) {
  const f = ev.target.files?.[0]
  ev.target.value = ''
  if (!f) return
  if (f.size > 8 * 1024 * 1024) {
    errorMsg.value = '图片不能超过 8MB'
    return
  }
  uploading.value = true
  errorMsg.value = ''
  try {
    const fd = new FormData()
    fd.append('image', f)
    const r = await authedFetch('/api/upload', { method: 'POST', body: fd })
    if (!r.ok) {
      const j = await r.json().catch(() => ({}))
      throw new Error(j.error || `upload failed (${r.status})`)
    }
    const j = await r.json()
    insertAtCursor(`\n![](${j.url})\n`)
  } catch (e) {
    errorMsg.value = e.message || 'upload failed'
  } finally {
    uploading.value = false
  }
}

async function doSave() {
  errorMsg.value = ''
  okMsg.value = ''
  if (!title.value.trim()) {
    errorMsg.value = '标题不能为空'
    return
  }
  saving.value = true
  try {
    const url = isEdit.value
      ? `/api/articles/${encodeURIComponent(slug.value)}`
      : '/api/articles'
    const method = isEdit.value ? 'PUT' : 'POST'
    const r = await authedFetch(url, {
      method,
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: title.value.trim(), content: content.value })
    })
    if (!r.ok) {
      const j = await r.json().catch(() => ({}))
      throw new Error(j.error || `save failed (${r.status})`)
    }
    const j = await r.json()
    okMsg.value = isEdit.value
      ? '已提交修改,等 CI 重新部署后列表会刷新。'
      : `已发布「${j.title}」,等 CI 重新部署后会出现在列表里。`
    if (!isEdit.value) {
      title.value = ''
      content.value = ''
    }
  } catch (e) {
    errorMsg.value = e.message || 'save failed'
  } finally {
    saving.value = false
  }
}

async function doDelete() {
  if (!isEdit.value) return
  if (!confirm(`确认删除「${title.value || slug.value}」?\n删除后会 git push,等 CI 重新部署。`)) return
  saving.value = true
  errorMsg.value = ''
  try {
    const r = await authedFetch(`/api/articles/${encodeURIComponent(slug.value)}`, { method: 'DELETE' })
    if (!r.ok) {
      const j = await r.json().catch(() => ({}))
      throw new Error(j.error || `delete failed (${r.status})`)
    }
    okMsg.value = '已提交删除,等 CI 重新部署后列表会刷新。'
    setTimeout(() => router.go(withBase('/diary/')), 1200)
  } catch (e) {
    errorMsg.value = e.message || 'delete failed'
  } finally {
    saving.value = false
  }
}

function goBack() {
  router.go(withBase('/diary/'))
}

onMounted(() => {
  slug.value = readSlugFromUrl()
  if (slug.value && isLoggedIn()) loadArticle()
})
</script>

<template>
  <div class="editor-page">
    <header class="editor-header">
      <div class="left">
        <button class="link-btn" @click="goBack">← 返回列表</button>
        <h2>{{ isEdit ? '编辑随记' : '写一篇随记' }}</h2>
      </div>
      <div class="right" v-if="isLoggedIn()">
        <button class="btn btn-ghost" @click="logout()">退出登录</button>
      </div>
    </header>

    <!-- 未登录:密码门 -->
    <div v-if="!isLoggedIn()" class="login-box">
      <h3>请先输入密码</h3>
      <form @submit.prevent="doLogin">
        <input
          v-model="pwd"
          type="password"
          autocomplete="current-password"
          placeholder="博客密码"
          :disabled="loggingIn"
        />
        <button type="submit" class="btn btn-primary" :disabled="loggingIn || !pwd">
          {{ loggingIn ? '登录中…' : '登录' }}
        </button>
      </form>
      <p v-if="loginError" class="err">{{ loginError }}</p>
    </div>

    <!-- 已登录:编辑器 -->
    <div v-else>
      <div v-if="loading" class="hint">加载中…</div>
      <template v-else>
        <input
          v-model="title"
          class="title-input"
          placeholder="标题"
          :disabled="saving"
        />

        <div class="toolbar">
          <button class="tool-btn" :disabled="uploading" @click="pickImage">
            {{ uploading ? '上传中…' : '🖼 插入图片' }}
          </button>
          <input
            ref="fileInputRef"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
            style="display:none"
            @change="onPickImage"
          />
          <div class="spacer"></div>
          <button
            v-if="isEdit"
            class="btn btn-danger"
            :disabled="saving"
            @click="doDelete"
          >删除</button>
          <button
            class="btn btn-primary"
            :disabled="saving || !title.trim()"
            @click="doSave"
          >{{ saving ? '保存中…' : (isEdit ? '保存修改' : '发布') }}</button>
        </div>

        <div v-if="errorMsg" class="err">{{ errorMsg }}</div>
        <div v-if="okMsg" class="ok">{{ okMsg }}</div>

        <div class="dual">
          <textarea
            ref="textareaRef"
            v-model="content"
            class="md-input"
            placeholder="用 Markdown 写正文…"
            spellcheck="false"
          ></textarea>
          <div class="md-preview" v-html="previewHtml"></div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.editor-page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px 80px;
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--vp-c-divider);
}
.editor-header .left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.editor-header h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
}
.link-btn {
  align-self: flex-start;
  background: none;
  border: none;
  color: var(--vp-c-text-2);
  font-size: 13px;
  padding: 0;
  cursor: pointer;
}
.link-btn:hover { color: var(--vp-c-brand-1); }

.btn {
  padding: 6px 14px;
  font-size: 13px;
  border-radius: 999px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-1);
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }
.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-primary {
  background: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: #fff;
}
.btn-primary:hover:not(:disabled) {
  background: var(--vp-c-brand-dark);
  border-color: var(--vp-c-brand-dark);
  color: #fff;
}
.btn-danger {
  border-color: #c45a5a;
  color: #c45a5a;
}
.btn-danger:hover:not(:disabled) {
  background: #c45a5a;
  color: #fff;
}

.login-box {
  max-width: 360px;
  margin: 80px auto;
  padding: 28px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  text-align: center;
}
.login-box h3 { margin: 0 0 16px; font-size: 16px; font-weight: 600; }
.login-box form { display: flex; flex-direction: column; gap: 10px; }
.login-box input {
  padding: 8px 12px;
  font-size: 14px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.login-box input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.hint {
  text-align: center;
  color: var(--vp-c-text-2);
  padding: 40px 0;
  font-size: 14px;
}

.title-input {
  width: 100%;
  padding: 10px 14px;
  font-size: 18px;
  font-weight: 600;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  margin-bottom: 12px;
}
.title-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.spacer { flex: 1; }
.tool-btn {
  padding: 5px 12px;
  font-size: 13px;
  border: 1px solid var(--vp-c-divider);
  background: transparent;
  color: var(--vp-c-text-2);
  border-radius: 6px;
  cursor: pointer;
}
.tool-btn:hover:not(:disabled) {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}
.tool-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.err {
  margin: 8px 0;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 6px;
  background: rgba(196, 90, 90, 0.1);
  color: #c45a5a;
}
.ok {
  margin: 8px 0;
  padding: 8px 12px;
  font-size: 13px;
  border-radius: 6px;
  background: rgba(76, 175, 80, 0.12);
  color: #4caf50;
}

.dual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  height: 70vh;
  min-height: 480px;
}
.md-input {
  width: 100%;
  height: 100%;
  padding: 14px 16px;
  font-family: ui-monospace, Menlo, Consolas, monospace;
  font-size: 14px;
  line-height: 1.7;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  resize: none;
}
.md-input:focus {
  outline: none;
  border-color: var(--vp-c-brand-1);
}
.md-preview {
  height: 100%;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background: var(--vp-c-bg);
  overflow-y: auto;
  font-size: 14px;
  line-height: 1.7;
}
.md-preview :deep(h1) { font-size: 22px; margin: 12px 0 8px; }
.md-preview :deep(h2) { font-size: 18px; margin: 12px 0 8px; }
.md-preview :deep(h3) { font-size: 16px; margin: 10px 0 6px; }
.md-preview :deep(p) { margin: 6px 0; }
.md-preview :deep(img) { max-width: 100%; height: auto; border-radius: 6px; }
.md-preview :deep(pre) {
  background: var(--vp-c-bg-soft);
  padding: 10px;
  border-radius: 6px;
  overflow-x: auto;
  font-size: 12.5px;
}
.md-preview :deep(code) {
  background: var(--vp-c-bg-soft);
  padding: 1px 4px;
  border-radius: 3px;
  font-size: 12.5px;
}
.md-preview :deep(pre code) { background: none; padding: 0; }
.md-preview :deep(blockquote) {
  border-left: 3px solid var(--vp-c-brand-1);
  padding-left: 10px;
  color: var(--vp-c-text-2);
  margin: 6px 0;
}

@media (max-width: 800px) {
  .dual {
    grid-template-columns: 1fr;
    height: auto;
  }
  .md-input { min-height: 320px; }
  .md-preview { min-height: 280px; }
}
</style>
