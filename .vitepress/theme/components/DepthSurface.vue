<script setup>
import { ref, watch } from 'vue'
import { useDepth } from '../composables/useDepth.js'

const props = defineProps({ surfaceClass: { type: String, default: '' }, level: { type: String, default: 'card' } })
const zone = ref(null)
const surface = ref(null)
const { coordinates, reducedMotion } = useDepth()

function reset() {
  const element = surface.value
  if (!element) return
  element.classList.remove('is-tracking')
  for (const name of ['transform', 'transition', '--gm-x', '--gm-y', '--gm-lift']) element.style.removeProperty(name)
}
function move(event) {
  const point = coordinates(event, zone.value)
  if (!point) return
  const element = surface.value
  // Freeze the visual plane while a title link is being targeted.
  if (props.level !== 'category' && event.target.closest('a, button')) {
    if (!element.style.transform) {
      element.style.transform = getComputedStyle(element).transform
      element.style.transition = 'none'
    }
    return
  }
  element.style.removeProperty('transform')
  element.style.removeProperty('transition')
  element.style.setProperty('--gm-x', `${(-point.y * 10).toFixed(2)}deg`)
  element.style.setProperty('--gm-y', `${(point.x * 10).toFixed(2)}deg`)
  element.style.setProperty('--gm-lift', '-8px')
  element.classList.add('is-tracking')
}
watch(reducedMotion, reset)
</script>

<template>
  <div ref="zone" class="gm-tilt-zone" @pointermove="move" @pointerleave="reset" @pointercancel="reset">
    <div ref="surface" :class="['gm-depth', surfaceClass]"><slot /></div>
    <slot name="actions" />
  </div>
</template>
