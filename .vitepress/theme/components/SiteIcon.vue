<script setup>
defineProps({ name: { type: String, required: true } })
const paths = {
  'arrow-up-right': ['M7 17 17 7', 'M7 7h10v10'],
  'arrow-right': ['M5 12h14', 'm12 5 7 7-7 7'],
  'arrow-left': ['M19 12H5', 'm12 19-7-7 7-7'],
  'chevron-left': ['m15 18-6-6 6-6'],
  'chevron-right': ['m9 18 6-6-6-6'],
  'notebook-pen': ['M5 4h8M5 8H3m2 4H3m2 4H3', 'M5 3v18h14v-8', 'm12 12 1-4 6-6 3 3-6 6-4 1'],
  library: ['M4 6v14', 'M8 4v16', 'M12 7v13', 'm16 4 4 16'],
  'code-2': ['m8 7-5 5 5 5', 'm16 7 5 5-5 5', 'm14 4-4 16'],
  workflow: ['M4 3h6v6H4z', 'M14 15h6v6h-6z', 'M7 9v8h7', 'M14 5h4v6'],
  compass: ['m16 8-3 5-5 3 3-5 5-3'],
  moon: ['M20.9 13A9 9 0 0 1 11 3.1 9 9 0 1 0 20.9 13Z'],
  sun: ['M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4'],
  search: ['m21 21-4.4-4.4'],
}
</script>

<template>
  <svg class="gm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">
    <path v-for="(path, index) in paths[name] || paths['arrow-right']" :key="index" :d="path" />
    <circle v-if="name === 'sun'" cx="12" cy="12" r="4" />
    <circle v-if="name === 'compass'" cx="12" cy="12" r="9" />
    <circle v-if="name === 'search'" cx="10.5" cy="10.5" r="6.5" />
  </svg>
</template>
