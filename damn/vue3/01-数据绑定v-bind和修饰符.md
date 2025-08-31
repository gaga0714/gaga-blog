# 数据绑定 v-bind 和修饰符

- `:` 或者 `.` (当使用 `.prop` 修饰符)
- 值可以省略 (当 attribute 和绑定的值同名时) Vue3.4+

```vue
<!-- 绑定 attribute -->
<img v-bind:src="imageSrc" />

<!-- 缩写 -->
<img :src="imageSrc" />

<!-- 缩写形式的动态 attribute 名 (vue3.4+)，扩展为 :src="src" -->
<img :src />

<!-- 动态 attribute 名的缩写 -->
<button :[key]="value"></button>

<!-- 绑定对象形式的 attribute -->
<div v-bind="{ id: someProp, 'other-attr': otherProp }"></div>

<!-- prop 绑定。“prop” 必须在子组件中已声明。 -->
<MyComponent :prop="someThing" />

<!-- 传递子父组件共有的 prop -->
<MyComponent v-bind="$props" />
```

**修饰符**

- `.camel` - 将短横线命名的 attribute 转变为驼峰式命名。
- `.prop` - 强制绑定为 DOM property。3.2+
	- 设置自定义标签属性，避免暴露数据，防止污染HTML结构
- `.attr` - 强制绑定为 DOM attribute。3.2+

```vue
<div :someProperty.prop="someObject"></div>

<!-- element.someProperty = someObject; -->


<!-- 等同于 -->
<div .someProperty="someObject"></div>

<!-- element.setAttribute('someProperty', someObject); -->
```