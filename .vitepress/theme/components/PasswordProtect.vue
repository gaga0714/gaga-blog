<template>
  <div v-if="!isAuthenticated" class="password-protect">
    <div class="password-box">
      <h2>🔒 请输入密码访问</h2>
      <input 
        v-model="password" 
        type="password" 
        placeholder="请输入密码"
        @keyup.enter="checkPassword"
        class="password-input"
      />
      <button @click="checkPassword" class="password-button">
        确认
      </button>
      <p v-if="showError" class="error-message">密码错误，请重试</p>
    </div>
  </div>
  <div v-else class="content">
    <slot />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const password = ref('')
const isAuthenticated = ref(false)
const showError = ref(false)

// 设置密码，你可以修改这里的值
const CORRECT_PASSWORD = 'mmjbgsn'

const checkPassword = () => {
  if (password.value === CORRECT_PASSWORD) {
    isAuthenticated.value = true
    showError.value = false
    // 将认证状态保存到 sessionStorage
    sessionStorage.setItem('todo_authenticated', 'true')
  } else {
    showError.value = true
    password.value = ''
  }
}

onMounted(() => {
  // 检查是否已经在本次会话中认证过
  const auth = sessionStorage.getItem('todo_authenticated')
  if (auth === 'true') {
    isAuthenticated.value = true
  }
})
</script>

<style scoped>
.password-protect {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.password-box {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  padding: 2rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.password-box h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
}

.password-input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  margin-bottom: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.password-input:focus {
  border-color: var(--vp-c-brand-1);
}

.password-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  background: var(--vp-c-brand-1);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.password-button:hover {
  background: var(--vp-c-brand-2);
}

.error-message {
  color: var(--vp-c-error);
  margin-top: 1rem;
  font-size: 0.875rem;
}

.content {
  width: 100%;
}
</style>

