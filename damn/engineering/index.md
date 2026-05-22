# 工程化

用工程的思维和工具链来管理前端项目的开发、构建、部署、维护全流程。

其实就是回答一个问题：**当项目从一个人写几个 HTML 文件，变成几十人维护几十万行代码时，怎么办？**

围绕这个问题，工程化要解决：

- **模块化**：ESM、CJS、UMD —— 让代码可以被组织、复用、按需加载
- **构建/打包**：Webpack、Vite、Rollup、esbuild —— 让源码变成浏览器能跑的产物
- **包管理**：npm、yarn、pnpm —— 让依赖可控
- **代码质量**：ESLint、Prettier、TypeScript —— 让多人协作不互相伤害
- **测试**：Vitest、Jest、Playwright —— 让重构不心慌
- **CI/CD**：让从提交到上线变成一条流水线
- **性能与体验**：Tree shaking、Code splitting、懒加载、SSR/SSG —— 让用户更快看到页面
- **架构**：Monorepo、微前端 —— 让大组织能在一个仓库里高效协作

工具一直在变（Webpack → Vite，Babel → SWC，Jest → Vitest），但问题没变：**让正确的代码以最低成本被写出、被构建、被部署**。

跨端方案：
https://github.com/camera-2018/frontend-interview/blob/main/%E5%B8%B8%E8%A7%81%E6%B8%B2%E6%9F%93%E6%A8%A1%E5%BC%8F%E3%80%81nodejs%E5%92%8C%E8%B7%A8%E7%AB%AF/%E8%B7%A8%E7%AB%AF%E6%96%B9%E6%A1%88.md

## 目录

- [01 - vite 插件](./01-vite插件.md)
- [02 - vite](./02-vite.md)
- [03 - treeshaking](./03-treeshaking.md)
- [04 - webpack](./04-webpack.md)
- [05 - 前沿前端现状看法](./05-前沿前端现状看法.md)
- [06 - 微前端](./06-微前端.md)