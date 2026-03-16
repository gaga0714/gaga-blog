# xcode
```
xcode-select --install
```
# homebrew
使用魔法+代理开tun加速
```
/bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"
```
# orbstack
面向 macOS 的本地虚拟化与容器运行环境，主要用来替代/补充 Docker Desktop、Multipass 等工具，让你在 Mac 上更轻量地运行 Docker 容器 和 Linux 环境
```
brew install orbstack
```
# 获取配置文件-使用交互式脚本部署
```
bash <(curl -fsSL https://doc.fastgpt.cn/deploy/install.sh)
```
# 打开运行orbstack,启动容器
```
docker-compose up -d
```
# 访问fastgpt
http://localhost:3000/
每次重启容器，都会自动初始化 root 用户，密码为 1234






ps：
1. WSL：WSL 环境指 Windows Subsystem for Linux（适用于 Linux 的 Windows 子系统） 提供的 Linux 运行环境：它是 Windows 的一项功能，让你可以在 Windows 电脑上直接运行 Linux 环境，而无需单独安装传统虚拟机或做双系统。
2. S3 地址：文件/对象存储的“网盘入口”（存文件、取文件）
3. MCP 地址：AI 工具/数据源接入的“统一网关入口”（让 AI 调用外部能力/读取外部数据）