# github 工作流

GitHub Actions 是一种持续集成和持续交付 (CI/CD) 平台，可用于自动执行生成、测试和部署管道。 你可以创建工作流，以便在推送更改到存储库时运行测试，或将合并的拉取请求部署到生产环境。

## CI/CD

缩写 | 全称 | 中文含义 | 功能
|-|-|-|-|
CI | Continuous Integration | 持续集成 | 开发者提交代码后，自动进行编译、测试、构建等流程，确保代码质量
CD | Continuous Delivery | 持续交付 | 代码在通过 CI 后，自动准备部署流程，但需人工确认发布
CD | Continuous Deployment | 持续部署 | 代码在通过 CI 后，自动部署到服务器或生产环境，全自动

## 部署流程
### 生成密钥对
ssh-keygen -t rsa -b 4096 -C "github@actions"

### 密钥对

公钥存服务器里：
```
~/.ssh/github-deploy
```

私钥加到github项目里的
```
Settings -> Secrets and variables -> Actions -> New repository secret
```
然后添加三个 Secrets：
```
SSH_HOST:服务器ip
SSH_USER:root
SSH_KEY:私钥
```
### 配置文件
```
name: gaga-blog

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
    - name: 📥 拉取代码
      uses: actions/checkout@v3

    - name: 📦 安装依赖
      run: npm ci

    - name: 🔧 构建 VitePress
      run: npm run docs:build

    - name: 🗂️ 拷贝构建内容到 deploy 文件夹
      run: |
        mkdir deploy
        cp -r .vitepress/dist/* deploy/

    - name: 🔥 清空服务器旧内容
      uses: appleboy/ssh-action@v0.1.7
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USER }}
        key: ${{ secrets.SSH_KEY }}
        script: rm -rf /home/html/gaga-blog/*

    - name: 📤 上传构建文件到服务器
      uses: appleboy/scp-action@v0.1.7
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USER }}
        key: ${{ secrets.SSH_KEY }}
        source: "./deploy/**"                 # 使用双星号递归上传
        target: "/home/html/gaga-blog/"
        strip_components: 1                   # ✅ 关键：去掉 deploy 目录结构

    - name: ♻️ 重启 Nginx
      uses: appleboy/ssh-action@v0.1.7
      with:
        host: ${{ secrets.SSH_HOST }}
        username: ${{ secrets.SSH_USER }}
        key: ${{ secrets.SSH_KEY }}
        script: sudo systemctl restart nginx

```

ok，结束！

主要是目录的问题，

```
  source: "./deploy/**"                 # 使用双星号递归上传
  target: "/home/html/gaga-blog/"
  strip_components: 1                   # ✅ 关键：去掉 deploy 目录结构
```