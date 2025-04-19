# 安装
## pnpm
### 全局安装
 `npm install pnpm -g`
### 配置镜像源
```
// 查看源
pnpm config get registry
// 切换淘宝源
pnpm config set registry https://registry.npmmirror.com/
```
### 使用
```
pnpm install 包名称
pnpm i 包名称
pnpm add 包名称    // -S  默认写入dependencies
pnpm add -D    // -D devDependencies
pnpm add -g    // 全局安装
```
### 移除
```
pnpm remove 包名称  // 移除包
pnpm remove 包名称 --global  // 移除全局包
```
### 更新
```
pnpm up  // 更新所有依赖项
pnpm upgrade 包  // 更新包
pnpm upgrade 包 --global  // 更新全局包
```
### 设置存储路径（还没看懂，先记着
`pnpm config set store-dir /path/to/.pnpm-store`

## npm

## cnpm
国内的npm镜像？

# 区别
下次再说...