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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.35);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  z-index: 9999;
}

.dark .password-protect {
  background: rgba(0, 0, 0, 0.4);
}

.password-box {
  background: rgba(255, 255, 255, 0.85);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  backdrop-filter: saturate(180%) blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow:
    0 8px 32px rgba(196, 90, 90, 0.12),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  animation: fadeInScale 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

.dark .password-box {
  background: rgba(30, 32, 36, 0.85);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.password-box h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.5rem;
  background: linear-gradient(120deg, #c45a5a 30%, #e8a87c);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.password-input {
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.6);
  border: 1.5px solid rgba(196, 90, 90, 0.2);
  border-radius: 12px;
  margin-bottom: 1rem;
  outline: none;
  transition: all 0.25s ease;
  box-sizing: border-box;
}

.dark .password-input {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.15);
  color: var(--vp-c-text-1);
}

.password-input:focus {
  border-color: var(--vp-c-brand-1);
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 0 0 3px var(--vp-c-brand-soft);
}

.dark .password-input:focus {
  background: rgba(255, 255, 255, 0.12);
}

.password-button {
  width: 100%;
  padding: 0.875rem;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(120deg, #c45a5a 0%, #e8a87c 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
  box-shadow: 0 4px 12px rgba(196, 90, 90, 0.25);
}

.password-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(196, 90, 90, 0.35);
}

.password-button:active {
  transform: translateY(0);
}

.error-message {
  color: #e74c3c;
  margin-top: 1rem;
  font-size: 0.875rem;
  animation: shake 0.4s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-8px); }
  75% { transform: translateX(8px); }
}

.content {
  width: 100%;
}
</style>

