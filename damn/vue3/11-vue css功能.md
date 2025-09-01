# vue css 功能

## scoped 通过postcss实现

```vue
<style scoped>
.example {
  color: red;
}
</style>

<template>
  <div class="example">hi</div>
</template>
```

```vue
<style>
.example[data-v-f3f3eg9] {
  color: red;
}
</style>

<template>
  <div class="example" data-v-f3f3eg9>hi</div>
</template>
```

## 深度选择器

:deep()

```vue
<style scoped>
.a :deep(.b) {
  /* ... */
}
</style>

.a[data-v-f3f3eg9] .b {
  /* ... */
}
```

## 插槽选择器

:slotted(div)


## 全局选择器

scoped里的透传给全局
```vue
<style scoped>
:global(.red) {
  color: red;
}
</style>
```

## css modules

```vue
<template>
  <p :class="$style.red">This should be red</p>
</template>

<style module>
.red {
  color: red;
}
</style>
```

或者写 module="class"自定义导出的类名字

```vue
// 在 setup() 作用域中...
// 默认情况下，返回 <style module> 的 class
useCssModule()

// 具名情况下，返回 <style module="classes"> 的 class
useCssModule('classes')
```



## css里的v-bind

自定义属性会通过内联样式的方式应用到组件的根元素上，并且在源值变更的时候响应式地更新。

```vue
<script setup>
import { ref } from 'vue'
const theme = ref({
    color: 'red',
})
</script>

<template>
  <p>hello</p>
</template>

<style scoped>
p {
  color: v-bind('theme.color');
}
</style>
```