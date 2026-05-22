前端部分：
项目亮点总结
1. 技术架构与工程化
大型企业级 MaaS（Model as a Service）平台前端，采用 React 17 + TypeScript 
使用 Redux Toolkit 进行状态管理，模块化设计
Webpack 4 构建，支持 DLL、代码分割、ESBuild 压缩等优化
完善的代码规范：ESLint + Prettier + Stylelint，集成 Husky + lint-staged
TypeScript 严格模式，类型覆盖完整
2. 核心功能模块
工作流可视化编辑器：集成 ComfyUI，支持 iframe 通信、工作流保存与验证
多语言代码编辑器：基于 CodeMirror 6，支持 JSON、SQL、CSV、Shell 等语法高亮
数据平台：数据采集、转换、数据仓库管理、字段映射编辑器
模型平台：布局测试、CAD 评分、AI 搜索评估等
Agent 管理：支持多 Agent 配置、版本对比、函数调用等
3. 技术实现亮点
拖拽排序：使用 React DnD 实现表格行拖拽、策略排序等
自定义 Hooks：封装 useSearch、useQuery、useNavigator 等复用逻辑
HTTP 请求封装：统一拦截器，支持 SSO 认证、场景隔离、错误处理
响应式编程：集成 RxJS 处理异步数据流
数据可视化：使用 ECharts 进行图表展示
4. 业务复杂度
权限系统：多角色权限管理、场景隔离、权限树配置
多场景支持：支持不同业务场景切换，动态菜单配置
复杂表单：参数编辑器、字段映射、JSON 编辑器等
文件处理：支持图片上传预览、CSV 导入导出、文件下载等
5. 性能优化
使用 useMemo、useCallback 优化渲染（代码中大量使用）
防抖节流：参数保存使用防抖，减少请求频率
代码分割：按路由和模块进行拆分
缓存策略：使用 cache-loader 提升构建速度
6. UI/UX 设计
使用 Styled Components 实现 CSS-in-JS
集成企业级 UI 组件库（@qunhe/muya-ui）
响应式布局设计
统一的错误提示和加载状态处理
7. 项目规模
代码量：超过 200 个组件和页面文件
业务模块：工作流管理、数据平台、模型平台、Agent 管理、权限管理等
API 接口：完善的接口类型定义和封装，支持批量操作



MaaS 平台前端开发
负责大型企业级 MaaS 平台前端开发，使用 React + TypeScript + Redux Toolkit
实现工作流可视化编辑器，集成 ComfyUI，支持复杂工作流的编辑、保存与验证
基于 CodeMirror 6 封装多语言代码编辑器（JSON/SQL/CSV/Shell），支持语法高亮和自定义扩展
使用 React DnD 实现拖拽排序功能，提升用户体验
封装通用 Hooks（useSearch、useQuery 等）和 HTTP 请求库，统一错误处理和认证逻辑
实现权限管理系统，支持多角色、多场景的权限隔离
优化性能：使用 useMemo/useCallback 优化渲染，实现防抖节流，代码分割等
建立完善的工程化规范：ESLint + Prettier + TypeScript 严格模式，提升代码质量