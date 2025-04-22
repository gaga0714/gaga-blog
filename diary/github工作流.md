# github 工作流

GitHub Actions 是一种持续集成和持续交付 (CI/CD) 平台，可用于自动执行生成、测试和部署管道。 你可以创建工作流，以便在推送更改到存储库时运行测试，或将合并的拉取请求部署到生产环境。

# CI/CD

缩写 | 全称 | 中文含义 | 功能
CI | Continuous Integration | 持续集成 | 开发者提交代码后，自动进行编译、测试、构建等流程，确保代码质量
CD | Continuous Delivery | 持续交付 | 代码在通过 CI 后，自动准备部署流程，但需人工确认发布
CD | Continuous Deployment | 持续部署 | 代码在通过 CI 后，自动部署到服务器或生产环境，全自动
