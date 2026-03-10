# 🚀 快速开始：EverShop AI Agents 和 MCP Servers

## 📋 已完成的配置

✅ **6个专业AI Agents**
- evershop-feature（功能开发）
- evershop-debug（调试）
- evershop-theme（主题）
- evershop-extension（扩展）
- evershop-database（数据库）
- evershop-api（API）

✅ **2个MCP Servers**
- GitHub MCP Server
- Azure DevOps MCP Server

## 🎯 推荐：从Orchestrator开始

**不确定用哪个agent？** 先问Orchestrator：

```
@evershop-orchestrator [描述你的需求]
```

Orchestrator会分析并推荐最合适的agent！详见 [ORCHESTRATOR_GUIDE.md](./ORCHESTRATOR_GUIDE.md)

## ⚡ 5分钟快速设置

### 步骤1：设置GitHub Token（必需）

1. 访问：https://github.com/settings/tokens
2. 创建token，选择权限：`repo`, `workflow`, `read:org`, `user`
3. 设置环境变量（Windows PowerShell）：
   ```powershell
   [Environment]::SetEnvironmentVariable("GITHUB_TOKEN", "your_token_here", "User")
   ```

### 步骤2：设置Azure DevOps Token（可选）

1. 访问：https://dev.azure.com/{org}/_usersSettings/tokens
2. 创建token，选择权限：Code, Work Items, Build, Release, Test
3. 设置环境变量（Windows PowerShell）：
   ```powershell
   [Environment]::SetEnvironmentVariable("AZURE_DEVOPS_TOKEN", "your_token_here", "User")
   [Environment]::SetEnvironmentVariable("AZURE_DEVOPS_ORG_URL", "https://dev.azure.com/your-org", "User")
   ```

### 步骤3：重启VS Code

**完全关闭并重新打开VS Code**（必须！）

### 步骤4：测试

在GitHub Copilot Chat中输入：
```
@evershop-feature 你好，介绍一下你的功能
```

## 📚 文档说明

| 文件 | 说明 |
|------|------|
| [.github/.agents/](file:///.github/.agents/) | 6个专业Agent配置文件 |
| [AGENTS.md](./AGENTS.md) | Agent配置备份（技术细节） |
| [AGENTS_GUIDE.md](./AGENTS_GUIDE.md) | Agent使用指南（带示例） |
| [MCP_SETUP.md](./MCP_SETUP.md) | MCP Server详细设置 |
| [.vscode/settings.json](./.vscode/settings.json) | VS Code MCP配置 |

## 💡 快速示例

### 不确定用哪个？问Orchestrator
```
@evershop-orchestrator 我想让用户可以保存购物车供以后购买
```

### 创建新功能
```
@evershop-feature 添加产品愿望清单功能
```

### 调试问题
```
@evershop-debug GraphQL查询返回null
```

### 开发主题
```
@evershop-theme 创建深色主题
```

### 数据库迁移
```
@evershop-database 为products表添加库存字段
```

### API开发
```
@evershop-api 创建获取热销产品的查询
```

### 创建扩展
```
@evershop-extension 创建Stripe支付扩展
```

## 🔧 故障排除

### MCP Server未连接？
1. 检查环境变量是否设置
2. 确保VS Code完全重启（不是重新加载）
3. 查看VS Code输出面板的错误信息

### Agent没有响应？
1. 确认使用 `@agent-name` 格式
2. 检查agent名称拼写是否正确
3. 确保AGENTS.md文件存在

## 📞 获取帮助

- 查看 [AGENTS_GUIDE.md](./AGENTS_GUIDE.md) 了解详细使用方法
- 查看 [MCP_SETUP.md](./MCP_SETUP.md) 解决MCP问题
- 访问 [EverShop文档](https://evershop.io/docs)

---

**开始使用：** 在GitHub Copilot Chat中尝试 `@evershop-feature` 🚀
