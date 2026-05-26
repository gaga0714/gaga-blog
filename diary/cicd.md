---
title: cicd
created: '2025-10-12T14:44:04+08:00'
updated: '2026-05-22T15:37:04+08:00'
---
Docker CI/CD

1.  触发
你把工作流绑在 main 分支上：一推代码，流水线就开始跑。

2.  登陆镜像仓库
CI 先用 GHCR_USERNAME/TOKEN 登录 GHCR，后面才能把镜像推上去。

3.  Docker 打包（两份）

Web 镜像：在构建容器里安装依赖、打包前端，然后做成一个只含运行时的镜像（通常是 Nginx 或静态服务器）。

API 镜像：把后端代码和运行时（Node）一起装进镜像。
两者都打上 latest 标签并推到 GHCR。

4.  缓存加速
cache-from/to: gha 让 Docker 构建层缓存存到 GitHub 的缓存里，下次构建更快。

5.  进入部署阶段
构建成功后，跑第二个 job，通过 SSH 上你的服务器。

6.  服务器上的准备

登录 GHCR（即便现在是 public，将来变私有也不需要改脚本）。

确保有部署目录。

如果是第一次，会在服务器里“写入”一份 docker-compose.yml 和 .env（里面放 API Key 等环境变量）。

7.  拉取并发布

- docker compose pull 把 GHCR 最新的 web 和 api 镜像拉下来。

- docker compose up -d --pull always 启动/更新容器：

    - api 有健康检查：只有返回 200 才算健康；

    - web 依赖 api，端口把容器 80 映射到宿主 10004，浏览器访问 http://服务器IP:10004 就是前端站点；

    - restart: unless-stopped 确保重启机器也会自动拉起。

- 清掉悬空旧镜像节省磁盘。

- 打印当前容器状态表，方便确认上线是否成功。

8.  运行时配置

.env 里放 DEEPSEEK_API_KEY 等敏感信息，容器启动时注入到 api。

web 如果是纯静态站点，配置通常在构建期就固化了；如果要运行时可配，需要改成读外部 config.js 或 SSR 模式。

---

小优化建议（面试常被问）：

用 :sha-提交号 这种不可变标签同时推一份，部署用固定 latest，回滚用具体 sha；

docker compose 文件尽量放仓库而不是运行时生成，便于审计和回滚；

GHCR 推荐用内置 GITHUB_TOKEN（权限开到 packages:write）简化凭证；

给 api 增加 /health 之外的启动探针或延迟，避免冷启动时被负载提前切流；

生产域名/HTTPS 交给外层反代（Nginx/Traefik/Caddy），CI 只负责容器版本切换。
