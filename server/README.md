# gaga-blog-server

随记发布的后端服务。接收前端的发布/编辑/删除/上传请求,操作服务器上 clone 的仓库,`git push` 到 GitHub,触发 CI 重新构建部署。

## 部署步骤(在你的服务器上)

### 1. clone 仓库

选个目录,比如 `/srv/blog-repo`:

```bash
sudo mkdir -p /srv && sudo chown $USER:$USER /srv
cd /srv
git clone git@github.com:gaga0714/<your-blog-repo>.git blog-repo
cd blog-repo
```

### 2. 配置 SSH key,让服务器能 git push

```bash
ssh-keygen -t ed25519 -C "gaga-blog-bot@server" -f ~/.ssh/blog_deploy
cat ~/.ssh/blog_deploy.pub
```

把公钥贴到 GitHub 仓库 → Settings → Deploy keys → Add deploy key,**勾上 "Allow write access"**。

服务器 `~/.ssh/config` 加上:

```
Host github.com-blog
  HostName github.com
  User git
  IdentityFile ~/.ssh/blog_deploy
  IdentitiesOnly yes
```

仓库 remote 改成这个 Host:

```bash
cd /srv/blog-repo
git remote set-url origin git@github.com-blog:gaga0714/<your-blog-repo>.git
git fetch && git status   # 确认能正常拉
```

### 3. 装 Node 和 PM2

```bash
# 用 nvm 或系统包管理器装 Node 18+
node -v   # 至少 v18
npm i -g pm2
```

### 4. 装后端依赖

```bash
cd /srv/blog-repo/server
npm install
cp .env.example .env
# 编辑 .env,改 BLOG_PASSWORD、JWT_SECRET(随机长串)、REPO_PATH=/srv/blog-repo
nano .env
```

生成随机 JWT_SECRET 的小命令:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

### 5. 启动后端

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup   # 跟提示走一遍,让 PM2 开机自启
```

确认起来了:

```bash
curl http://127.0.0.1:3001/api/health
# {"ok":true}
```

### 6. nginx 反代

找到博客的 server block(通常 `/etc/nginx/conf.d/gaga-blog.conf` 或 `sites-enabled` 里),加一段:

```nginx
location /api/ {
    proxy_pass http://127.0.0.1:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    client_max_body_size 10m;
}
```

测试 + reload:

```bash
sudo nginx -t && sudo systemctl reload nginx
```

### 7. 验证

浏览器打开 `https://你的域名/api/health` 应该返回 `{"ok":true}`。

去博客 `/diary/edit` 页,输入 `BLOG_PASSWORD`,登录,发一条试试。

## 排查

- `pm2 logs gaga-blog-server` 看后端日志
- `git push` 失败:多半是 SSH key / Deploy key 没配对,在 `/srv/blog-repo` 手动跑 `git push` 看报错
- nginx 502:后端没起,看 `pm2 status`
- nginx 413:`client_max_body_size` 没加(图片超 1M 会触发)

## 本地开发

如果想在 macOS 上本地起后端联调:

```bash
cp .env.example .env
# REPO_PATH 设成本地一份测试 clone(别用你的真仓库,免得误推)
REPO_PATH=/tmp/blog-test PORT=3001 npm run dev
```

前端 `npm run docs:dev` 会通过 vite 代理 `/api` → `http://localhost:3001`。
