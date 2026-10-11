---
summary: "整理移除中转配置、清理环境变量和重新登录的步骤，恢复官方账号的连接方式。"
---
# codex中转站切换至官方

![alt text](/assets/diary_image-40.png)

1. 删除config.toml内中转站配置路由和模型信息

```t
[model_providers]
[model_providers.custom]
name = "custom"
wire_api = "responses"
requires_openai_auth = true
base_url = "https://4router.net/v1"
```

```t
model = "gpt-6-astra"
model_reasoning_effort = "high"
```

留官方的provider即可：

```t
model_provider = "openai"
```

2. 终端退出codex登录重登

```sh
codex login status # 大概率还是api登录
codex logout #官方说明 codex logout 会清掉当前保存的认证信息
env | cut -d= -f1 | grep -E '^(OPENAI_API_KEY|OPENAI_BASE_URL|CODEX_ACCESS_TOKEN)$' # 检查是否有残留的旧key
```

若出现OPENAI_API_KEY、OPENAI_BASE_URL，执行`unset OPENAI_API_KEY`、`unset OPENAI_BASE_URL`

再检查是否写进mac的shell配置

```sh
grep -nE 'OPENAI_API_KEY|OPENAI_BASE_URL|4router|CODEX_ACCESS_TOKEN' \
~/.zshrc ~/.zprofile ~/.bash_profile ~/.bashrc 2>/dev/null
```

若看到类似：

```sh
export OPENAI_API_KEY="sk-RBkQ9..."
export OPENAI_BASE_URL="https://4router.net/v1"
```

删掉，执行：

```sh
source ~/.zshrc
```

然后重新登录
`codex login`

缓存位置：`~/.codex/auth.json`
