# FastGPT Docker Compose 部署教程

基于 FastGPT 官方 [`Docker-compose 部署`][fastgpt-docker-doc] 和 [`通过 AI Proxy 接入模型`][fastgpt-ai-proxy-doc] 两篇文档整理，适合在 macOS 上从零搭建一套本地可用的 FastGPT 环境。

如果你只是想先把服务跑起来，再慢慢研究细节，可以直接按本文顺序一步一步操作。

## 一、准备基础环境

先安装 Xcode Command Line Tools，避免后续安装 Homebrew 或执行其他命令时缺少基础工具。

```bash
xcode-select --install
```

## 二、安装 Homebrew

Homebrew 是 macOS 上最常用的包管理器，后面安装 OrbStack 会用到。
如果网络较慢，可以先开启代理再执行：

```bash
/bin/bash -c "$(curl -fsSL https://gitee.com/ineo6/homebrew-install/raw/master/install.sh)"
```

## 三、安装 OrbStack

OrbStack 是 macOS 上比较轻量的容器运行环境，可以理解为 Docker Desktop 的替代方案。安装后会提供 Docker / Docker Compose 运行能力。

```bash
brew install orbstack
```

安装完成后，手动打开 OrbStack，确认它已经成功启动。只有在 OrbStack 正常运行的情况下，后面的容器命令才能执行。

## 四、获取 FastGPT 部署配置

官方推荐使用交互式脚本生成部署文件。脚本会引导你选择部署环境、向量库类型、服务访问地址等参数，并自动生成 `docker-compose.yml` 等配置文件。

```bash
bash <(curl -fsSL https://doc.fastgpt.cn/deploy/install.sh)
```

这里补充两点：

- 这一步通常需要在 `Linux / macOS / Windows WSL` 环境中执行。
- 如果当前环境无法访问外网，也可以改用“手动下载 `docker-compose.yml` 和 `config.json`”的方式部署。

## 五、启动容器服务

进入 `docker-compose.yml` 所在目录后，执行下面命令启动服务：

```bash
docker-compose up -d
```

这个命令的含义很简单：

- `-d` 表示后台运行。
- 首次启动时会拉取镜像，时间可能稍长。
- 如果后续修改了 `docker-compose.yml` 或 `config.json`，通常需要重新执行启动命令；某些配置变更建议先 `docker-compose down` 再 `docker-compose up -d`。

## 六、访问 FastGPT

启动完成后，默认可以通过下面地址访问：

`http://localhost:3000/`

首次登录时使用 `root` 账号。密码以 `docker-compose.yml` 中的 `DEFAULT_ROOT_PSW` 为准，常见默认值是 `1234`。

这里再补充两个常见情况：

- 官方文档提到，容器每次重启时会自动初始化 `root` 用户，密码会同步为当前配置的 `DEFAULT_ROOT_PSW`。
- 如果页面第一次打开后浏览器标签页卡死或无响应，直接关闭该标签页再重新打开一次即可。

## 七、配置模型提供商

FastGPT 至少要配置两类模型后才能正常使用：

- 语言模型
- 索引模型

如果首次登录后系统没有自动跳转到模型配置页，也可以手动进入：

`账号 -> 模型提供商`

### 1. 创建模型渠道

FastGPT 新版本默认推荐通过 `AI Proxy` 管理模型渠道。它的作用可以理解为“统一的模型转发层”，负责保存不同厂商的 API Key、模型名称和请求地址，再把这些能力统一提供给 FastGPT 使用。

操作路径：

`账号 -> 模型提供商 -> 模型渠道 -> 新增渠道`

新增渠道时，一般需要填写这些信息：

- 渠道名：只是方便自己识别
- 厂商：如 OpenAI、阿里云等
- 模型：当前渠道可用的具体模型
- 代理地址：通常可使用默认值，特殊情况再改
- API 密钥：模型厂商提供的调用凭证

如果 FastGPT 内部使用的模型名和上游厂商的实际模型名不同，还可以通过“模型映射”做一层对应转换。

### 2. 测试模型渠道

渠道创建完成后，建议先在“模型测试”里执行一次测试，确认接口可用、密钥填写正确、模型能够正常返回结果。

这一步很重要，因为很多“模型不能用”“调用报错”“页面异常”之类的问题，本质上都来自模型渠道配置错误。

### 3. 启用模型

测试通过后，还需要进入“模型配置”页面，把对应模型真正启用。只有启用后的模型，FastGPT 才能在应用、工作流、知识库等功能中正常调用。

## 八、安装系统插件

从较新的版本开始，FastGPT 插件镜像通常只提供运行环境，系统插件需要手动安装。

操作路径：

`管理员 -> 添加插件 -> 插件市场`

如果当前环境无法访问插件市场，也可以先下载插件包，再通过文件导入方式安装。

## 九、常见端口说明

官方文档中常见的几个端口：

- `3000`：FastGPT 主服务
- `9000`：S3 对象存储服务
- `3005`：FastGPT 的 SSE MCP Server 服务

如果只是本机自用，访问 `localhost` 即可；如果还要给局域网或公网访问，就需要额外处理端口开放、域名和反向代理等问题。

## 十、名词解释

`WSL`
Windows Subsystem for Linux，Windows 提供的 Linux 运行环境。可以理解成“在 Windows 里直接跑 Linux 命令行”。

`Docker Compose`
一种用配置文件统一管理多个容器的方式。你把服务写进 `docker-compose.yml`，然后用一条命令就能一起启动。

`OrbStack`
macOS 上的轻量容器与虚拟化工具，可以替代 Docker Desktop 来运行容器。

`AI Proxy`
FastGPT 内置的模型代理层。它把不同模型厂商的 API 接入方式统一起来，便于集中管理渠道、测试模型和查看调用日志。

`模型渠道`
一条具体的模型接入配置，里面通常包含厂商、模型、API 地址和密钥。

`语言模型`
负责聊天、生成文本、推理等能力的模型。

`索引模型`
通常指用于向量化的 embedding 模型，主要给知识库检索使用。

`向量库`
用于存储和检索向量数据的数据库，知识库召回通常会依赖它。

`S3 地址`
对象存储服务地址，可以理解成“文件上传和访问的统一入口”。

`MCP 地址`
MCP 服务入口地址，可以理解成“让 AI 连接外部工具和数据源的统一网关”。

[fastgpt-docker-doc]: https://doc.fastgpt.io/zh-CN/docs/self-host/deploy/docker
[fastgpt-ai-proxy-doc]: https://doc.fastgpt.io/zh-CN/docs/self-host/config/model/ai-proxy