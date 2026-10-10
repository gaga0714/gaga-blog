<script setup>
import { computed } from 'vue'
import { withBase } from 'vitepress'
import ArticleMeta from './ArticleMeta.vue'
import DepthSurface from './DepthSurface.vue'
import SiteIcon from './SiteIcon.vue'

const props = defineProps({
  article: { type: Object, required: true },
  compact: { type: Boolean, default: false }
})
const articleHref = computed(() => withBase(props.article.url || `/diary/${encodeURIComponent(props.article.slug)}.html`))
const summary = computed(() => !props.article.encrypted && typeof props.article.summary === 'string' ? props.article.summary.trim() : '')
const excerpt = computed(() => props.article.encrypted ? '文章已加密' : props.article.excerpt)
</script>

<template>
  <DepthSurface :surface-class="compact ? 'gm-recent-post' : 'gm-post'" :data-slug="article.slug" role="article">
    <ArticleMeta :article="article" />
    <component :is="compact ? 'h3' : 'h2'">
      <a :href="articleHref" class="gm-card-title-link" data-depth-control>{{ article.title }}</a>
    </component>
    <p v-if="summary" class="gm-card-summary">{{ summary }}</p>
    <p v-if="excerpt" class="gm-excerpt">{{ excerpt }}</p>
    <span class="gm-action-space" aria-hidden="true"></span>
    <template #actions>
      <a :href="articleHref" class="gm-read gm-fixed-read" :aria-label="`阅读 ${article.title}`" title="阅读全文"><SiteIcon name="arrow-up-right" /></a>
    </template>
  </DepthSurface>
</template>
