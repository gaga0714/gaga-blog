# Vite 前端代理跨域

```js
import vue from '@vitejs/plugin-vue';

export default {
  plugins: [vue()],
  server: {
    proxy: {
      // 将 '/api' 的请求代理到另一个服务器
      '/api': {
        target: 'http://backend-server.com',
        changeOrigin: true, // 将主机头的来源更改为目标 URL
        rewrite: (path) => path.replace(/^\/api/, ''), // 可选：重写路径
      },
    },
  },
};

```