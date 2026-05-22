import { inBrowser } from 'vitepress'

function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text)
  }
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '-9999px'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  try {
    document.execCommand('copy')
  } catch (e) {
    // ignore
  }
  document.body.removeChild(textarea)
  return Promise.resolve()
}

export function useCopyCodeFix() {
  if (!inBrowser) return
  const timeoutIdMap = new WeakMap()
  window.addEventListener('click', (e) => {
    const el = e.target
    if (el.matches('div[class*="language-"] > button.copy')) {
      const parent = el.parentElement
      const sibling = el.nextElementSibling?.nextElementSibling
      if (!parent || !sibling) return

      const isShell = /language-(shellscript|shell|bash|sh|zsh)/.test(parent.className)
      const clone = sibling.cloneNode(true)
      clone.querySelectorAll('.vp-copy-ignore, .diff.remove').forEach((node) => node.remove())
      let text = clone.textContent || ''
      if (isShell) {
        text = text.replace(/^ *(\$|>) /gm, '').trim()
      }

      copyToClipboard(text).then(() => {
        el.classList.add('copied')
        clearTimeout(timeoutIdMap.get(el))
        const timeoutId = setTimeout(() => {
          el.classList.remove('copied')
          el.blur()
          timeoutIdMap.delete(el)
        }, 2000)
        timeoutIdMap.set(el, timeoutId)
      })
    }
  })
}
