import { onBeforeUnmount, onMounted, ref } from 'vue'

export function useDepth() {
  const reducedMotion = ref(true)
  let media
  const sync = () => { reducedMotion.value = media.matches }
  onMounted(() => {
    media = window.matchMedia('(prefers-reduced-motion: reduce)')
    sync()
    media.addEventListener('change', sync)
  })
  onBeforeUnmount(() => media?.removeEventListener('change', sync))

  function coordinates(event, element) {
    if (reducedMotion.value || event.pointerType !== 'mouse' || event.buttons) return null
    const rect = element.getBoundingClientRect()
    if (!rect.width || !rect.height) return null
    return {
      x: Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)),
      y: Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1))
    }
  }
  return { reducedMotion, coordinates }
}
