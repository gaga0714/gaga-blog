# FastGPT 本地开发

## 前置环境

- Git
- Docker
- Node.js `v20.14.0`
- pnpm `9.4.0`

## 仓库拉取

### fork这两个仓库再clone
- https://github.com/labring/FastGPT
- https://github.com/labring/fastgpt-pro

### 初始化子模块：

```bash
cd /Users/sealos/fastgpt-pro
git submodule update --init --recursive
```

### remote 配置

`fastgpt-pro`：

```bash
cd /Users/sealos/fastgpt-pro
git remote add upstream git@github.com:labring/fastgpt-pro.git
```

若 `upstream` 已存在：

```bash
git remote set-url upstream git@github.com:labring/fastgpt-pro.git
```

`FastGPT` 子模块：

```bash
cd /Users/sealos/fastgpt-pro/FastGPT
git remote set-url origin git@github.com:gaga0714/FastGPT.git
git remote add upstream git@github.com:labring/FastGPT.git
```

## 本地启动

### infra

本地开发至少要先准备这些基础服务：

- MongoDB
- Redis
- PGVector（PostgreSQL）
- MinIO
- Sandbox
- Plugin
- AI Proxy

直接使用 `FastGPT` 仓库自带的开发版 compose：

- `5432`：PG
- `27017`：MongoDB
- `6379`：Redis
- `9000`：MinIO API
- `9001`：MinIO Console
- `3002`：Sandbox
- `3003`：Plugin
- `3010`：AI Proxy

文件位置：
```bash
fastgpt-pro/FastGPT/deploy/dev/docker-compose.yml
```

启动 infra：

```bash
cd fastgpt-pro/FastGPT/deploy/dev
docker compose up -d
```

查看状态：

```bash
docker compose ps
```

### 环境变量
分别把`fastgpt`和`fastgpt-pro`的`projects/app`下`.env.template`复制一份到`.env.local`

`fastgpt-pro/projects/app/.env.local` 至少确认这些值：

```bash
PLUGIN_BASE_URL=http://localhost:3003
PLUGIN_TOKEN=token

AIPROXY_API_ENDPOINT=http://localhost:3010
AIPROXY_API_TOKEN=aiproxy

CODE_SANDBOX_URL=http://localhost:3002

REDIS_URL=redis://default:mypassword@localhost:6379
MONGODB_URI="mongodb://myusername:mypassword@localhost:27017/fastgpt?authSource=admin&directConnection=true"
PG_URL=postgresql://username:password@localhost:5432/postgres

```

### 装依赖、启动（两个都要开！）
- 启动fast-pro
- 启动fast

```bash
pnpm i
# 去app下
pnpm dev
```

访问地址：
`http://localhost:3000`

账号root，密码去环境变量里找

## Docker 打包

无代理：

```bash
docker build -f ./projects/app/Dockerfile -t fastgpt . --build-arg name=app
```

使用淘宝代理：

```bash
docker build -f ./projects/app/Dockerfile -t fastgpt . --build-arg name=app --build-arg proxy=taobao
```