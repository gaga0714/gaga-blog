<script setup>
import { withBase } from 'vitepress'
import DepthSurface from './DepthSurface.vue'
import SiteIcon from './SiteIcon.vue'

const groups = [
  {
    id: 'foundations', title: '前端基础', description: '从页面结构到语言本身',
    topics: [
      { title: 'HTML', href: '/damn/html/', symbol: '</>', description: '语义、元素与页面结构' },
      { title: 'CSS', href: '/damn/css/', symbol: '#', description: '布局、样式与渲染' },
      { title: 'JavaScript', href: '/damn/javascript/', symbol: 'JS', description: '语言机制与浏览器运行原理' },
      { title: 'TypeScript', href: '/damn/ts/', symbol: 'TS', description: '类型、泛型与工具类型' },
    ],
  },
  {
    id: 'frameworks', title: '框架与工程', description: '把知识放进实际项目里',
    topics: [
      { title: 'Vue 3', href: '/damn/vue3/', symbol: 'V', description: '响应式、组件与组合式 API' },
      { title: 'React', href: '/damn/react/', symbol: 'R', description: '组件、Hooks 与渲染机制' },
      { title: '工程化', href: '/damn/engineering/', symbol: '{ }', description: '构建、工具链与项目协作' },
    ],
  },
  {
    id: 'services', title: '网络与服务', description: '沿着请求，继续向后探索',
    topics: [
      { title: '网络', href: '/damn/network/', symbol: '↔', description: '协议、缓存与浏览器安全' },
      { title: '后端', href: '/damn/backend/', symbol: '/', description: '项目中的服务端知识记录' },
      { title: 'Agent', href: '/damn/agent/', symbol: '✳', description: '智能体与相关学习笔记' },
    ],
  },
]
</script>

<template>
  <main class="gm-knowledge-home">
    <header class="gm-knowledge-heading">
      <div>
        <p class="gm-knowledge-eyebrow">知识整理</p>
        <h1>八股</h1>
        <p class="gm-knowledge-intro">温故而知新。</p>
      </div>
      <span class="gm-knowledge-total"><SiteIcon name="library" /> 10 个主题</span>
    </header>

    <section v-for="group in groups" :key="group.id" class="gm-topic-section" :aria-labelledby="`topic-${group.id}`">
      <div class="gm-topic-section-heading">
        <h2 :id="`topic-${group.id}`">{{ group.title }}</h2>
        <p>{{ group.description }}</p>
      </div>
      <div class="gm-topic-grid" :style="{ '--gm-topic-columns': group.topics.length }">
        <DepthSurface v-for="topic in group.topics" :key="topic.href" surface-class="gm-topic-card" level="category">
          <span class="gm-topic-symbol" aria-hidden="true">{{ topic.symbol }}</span>
          <h3>{{ topic.title }}</h3>
          <p>{{ topic.description }}</p>
          <SiteIcon class="gm-topic-arrow" name="arrow-up-right" />
          <template #actions>
            <a class="gm-topic-link" :href="withBase(topic.href)" :aria-label="`${topic.title}：${topic.description}`"></a>
          </template>
        </DepthSurface>
      </div>
    </section>
  </main>
</template>
