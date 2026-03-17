# FastGPT 本地开发

## 前置环境

- Git
- Docker
- Node.js `v20.14.0`
- pnpm `9.4.0`
- 建议在 `Linux`、`macOS` 或 `WSL` 环境开发

## fork 与初始化

先在 GitHub 上 fork 这两个仓库：

- `labring/fastgpt-pro`
- `labring/FastGPT`

假设本地目录为：

- `fastgpt-pro`：`/Users/sealos/fastgpt-pro`
- `FastGPT` 子模块：`/Users/sealos/fastgpt-pro/FastGPT`

假设自己的 fork 为：

- `git@github.com:gaga0714/fastgpt-pro.git`
- `git@github.com:gaga0714/FastGPT.git`

初始化子模块：

```bash
cd /Users/sealos/fastgpt-pro
git submodule update --init --recursive
```

## remote 配置

`fastgpt-pro`：

```bash
cd /Users/sealos/fastgpt-pro
git remote add upstream git@github.com:labring/fastgpt-pro.git
```

如果 `upstream` 已存在：

```bash
git remote set-url upstream git@github.com:labring/fastgpt-pro.git
```

`FastGPT` 子模块：

```bash
cd /Users/sealos/fastgpt-pro/FastGPT
git remote set-url origin git@github.com:gaga0714/FastGPT.git
git remote add upstream git@github.com:labring/FastGPT.git
```

如果 `upstream` 已存在：

```bash
git remote set-url upstream git@github.com:labring/FastGPT.git
```

检查结果：

```bash
cd /Users/sealos/fastgpt-pro
git remote -v

cd /Users/sealos/fastgpt-pro/FastGPT
git remote -v
```

预期：

- `fastgpt-pro`：`origin` 指向自己的 fork，`upstream` 指向 `labring/fastgpt-pro`
- `FastGPT`：`origin` 指向自己的 fork，`upstream` 指向 `labring/FastGPT`

## 本地启动

`FastGPT`：

1. 在 `FastGPT/projects/app` 下创建 `.env.local`
2. 增加 `PRO_URL=http://localhost:3001`

`fastgpt-pro`：

1. 在 `projects/app` 下创建 `.env.local`

安装并启动：

```bash
pwd # 确认在项目根目录
pnpm i
cd projects/app
pnpm dev
```

默认访问地址：

- `FastGPT`：`http://localhost:3000`

## Docker 打包

无代理：

```bash
docker build -f ./projects/app/Dockerfile -t fastgpt . --build-arg name=app
```

使用淘宝代理：

```bash
docker build -f ./projects/app/Dockerfile -t fastgpt . --build-arg name=app --build-arg proxy=taobao
```