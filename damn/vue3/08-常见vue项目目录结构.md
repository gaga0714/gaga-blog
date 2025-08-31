# 常见 Vue 项目目录结构

```bash
my-vue3-project/
├── public/                     # 公共静态文件
│   ├── favicon.ico             # 网站图标
│   └── ...                     # 其他静态资源
│ 
├── src/                        # 源代码目录
│   ├── assets/                 # 静态资源（图片、字体等）
│   │   └── ...                 
│   ├── components/             # 公共组件
│   │   ├── common/             # 通用组件
│   │   │   └── ...
│   │   ├── layout/             # 布局组件
│   │   │   └── ...
│   │   └── ...                 # 其他组件
│   ├── composables/            # 组合式 API（自定义钩子）
│   │   └── ...
│   ├── directives/             # 自定义指令
│   │   └── ...
│   ├── layouts/                # 页面布局
│   │   └── ...
│   ├── router/                 # 路由配置
│   │   ├── index.ts            # 路由入口文件
│   │   └── routes.ts           # 路由定义文件
│   ├── store/                  # 状态管理（例如 Pinia 或 Vuex）
│   │   ├── index.ts            # 状态管理入口文件
│   │   └── modules/            # 各模块状态
│   │       └── ...
│   ├── styles/                 # 全局样式
│   │   ├── index.scss          # 全局样式入口文件
│   │   └── ...                 # 其他样式文件
│   ├── utils/                  # 工具函数
│   │   └── ...
│   ├── views/                  # 页面组件
│   │   ├── Home.vue            # 首页
│   │   ├── About.vue           # 关于页面
│   │   └── ...                 # 其他页面
│   ├── App.vue                 # 根组件
│   ├── main.ts                 # 入口文件
│   └── shims-vue.d.ts          # TypeScript 声明文件
├── tests/                      # 测试
│   ├── unit/                   # 单元测试
│   │   └── ...
│   ├── e2e/                    # 端到端测试
│   │   └── ...
│   └── setup.ts                # 测试设置
├── .env                        # 环境变量
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
├── .eslintrc.js                # ESLint 配置
├── .prettierrc                 # Prettier 配置
├── index.html                  # HTML 模板
├── package.json                # 项目配置文件
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
└── README.md                   # 项目说明

```