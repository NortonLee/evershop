# EverShop Agents 配置状态

## ✅ 配置验证完成

所有agent文件和配置已经**正确创建**并且**格式验证通过**！

## 📊 当前状态

### Agent 文件（7个）
- ✅ evershop-api.agent.md - GraphQL API开发
- ✅ evershop-database.agent.md - 数据库操作
- ✅ evershop-debug.agent.md - 调试专家
- ✅ evershop-extension.agent.md - 扩展开发
- ✅ evershop-feature.agent.md - 功能开发
- ✅ evershop-orchestrator.agent.md - **任务分析和调度（推荐起点）**
- ✅ evershop-theme.agent.md - 主题开发

### 配置文件
- ✅ `.github/.agents/` 目录 - 包含所有agent文件
- ✅ `AGENTS.md` - 备份配置文件（根目录）
- ✅ `.vscode/settings.json` - MCP和Agents已启用
- ✅ 所有YAML frontmatter格式正确

### 文档
- ✅ AGENT_TROUBLESHOOTING.md - 故障排查指南
- ✅ ORCHESTRATOR_GUIDE.md - Orchestrator使用指南
- ✅ MCP_SETUP.md - MCP服务器配置
- ✅ QUICKSTART.md - 快速入门

## 🔍 为什么VS Code可能无法识别Agents？

即使配置文件都正确，agents可能仍然无法识别。原因如下：

### 1. GitHub Copilot版本要求

**重要：** VS Code中的自定义agents是一个**相对较新的功能**。

**检查方法：**
1. 在VS Code中按 `Ctrl+Shift+X`
2. 搜索 "GitHub Copilot"
3. 查看版本号

**要求：**
- GitHub Copilot 扩展版本 >= v1.150.0（推荐v1.160+）
- GitHub Copilot Chat 扩展也需要最新版本

**如果版本过低：**
- 更新扩展到最新版本
- 重启VS Code

### 2. 功能可用性

自定义agents可能是：
- **预览功能** - 可能需要加入GitHub Copilot Preview
- **企业功能** - 可能需要GitHub Copilot Business/Enterprise订阅
- **逐步推出** - 可能尚未在所有账户上可用

### 3. VS Code没有重启

**必须完全重启VS Code才能识别新的agent文件！**

**正确的重启方式：**
1. 保存所有文件
2. **完全关闭所有VS Code窗口**（不是重新加载窗口）
3. 重新打开VS Code
4. 等待5-10秒让Copilot初始化

### 4. 工作区配置

确保VS Code打开的是正确的工作区：
- 当前目录应该是：`c:\AI Testing\evershop`
- 左下角应该显示 "evershop"

## 🎯 立即测试步骤

### 第一步：完全重启VS Code
```
1. 关闭所有VS Code窗口
2. 重新打开项目
3. 等待Copilot初始化（10秒）
```

### 第二步：打开Copilot Chat
```
快捷键：Ctrl+Alt+I (Windows)
或者：点击侧边栏的Copilot图标
```

### 第三步：检查可用agents
```
在Chat中输入：@

应该看到：
- @workspace (系统默认)
- @vscode (系统默认)
- @terminal (系统默认)
- @evershop-orchestrator (如果识别了自定义agents)
- @evershop-feature
- ... 其他自定义agents
```

### 第四步：测试orchestrator
```
输入：@evershop-orchestrator 你好

如果识别成功，orchestrator会响应并介绍可用的agents
```

## 🔄 如果仍然无法识别

### 方案A：使用 @workspace + 指令

即使自定义agents无法识别，你仍然可以通过明确的指令来获得相同的效果：

**代替：**
```
@evershop-feature 添加愿望清单功能
```

**使用：**
```
@workspace 作为EverShop功能开发专家，请帮我添加产品愿望清单功能。

要求：
- 使用GraphQL API开发
- 创建React组件（支持SSR）
- 遵循EverShop的模块化架构
- 参考packages/evershop/src/modules/中的现有模块
- 创建必要的数据库迁移
- 使用postgres-query-builder进行数据库操作

请按照以下模块结构组织代码：
- api/ - GraphQL resolvers
- pages/ - React页面组件
- services/ - 业务逻辑
- migration/ - 数据库迁移
- graphql/ - GraphQL schema定义
```

### 方案B：直接参考agent指令

所有agent的详细指令都在文件中，你可以：

1. 打开 `.github/.agents/evershop-feature.agent.md`
2. 复制相关的指令部分
3. 在@workspace对话中使用这些指令

### 方案C：使用AGENTS.md格式

如果.agent.md文件不被识别，可能AGENTS.md格式更好：

**当前状态：** 根目录已经有`AGENTS.md`文件（包含所有agents的YAML定义）

某些VS Code版本可能只识别AGENTS.md格式。

## 📚 Agent使用指南

### Orchestrator Agent（推荐起点）

**用途：** 分析任务并推荐使用哪个专业agent

**使用方式：**
```
@evershop-orchestrator 我想添加一个产品评论系统
```

**响应：** Orchestrator会分析任务，并推荐使用：
- @evershop-feature（创建功能模块）
- @evershop-database（数据库设计）
- @evershop-api（GraphQL API）

### 专业Agents

1. **evershop-feature** - 功能开发（catalog, checkout, customer）
2. **evershop-debug** - 调试问题（GraphQL错误，React SSR问题）
3. **evershop-theme** - 主题开发（UI定制，SCSS样式）
4. **evershop-extension** - 扩展开发（hooks, events）
5. **evershop-database** - 数据库操作（migrations, queries）
6. **evershop-api** - GraphQL API开发（schema, resolvers）

## 🎓 推荐学习路径

### 第一次使用
```
@evershop-orchestrator 介绍一下你自己和其他可用的agents
```

### 开发新功能
```
@evershop-orchestrator 我想添加[功能描述]
→ 按照推荐使用具体的agent
```

### 调试问题
```
@evershop-debug [错误描述]
```

### 数据库操作
```
@evershop-database 创建一个migration来[操作描述]
```

## ⚙️ VS Code配置详情

### 当前配置（.vscode/settings.json）
```json
{
  "github.copilot.chat.mcp.enabled": true,
  "github.copilot.chat.agents.enabled": true,
  "github.copilot.chat.mcp.servers": {
    "github": { ... },
    "azure-devops": { ... }
  }
}
```

### MCP服务器
- ✅ GitHub MCP Server - 用于GitHub集成
- ✅ Azure DevOps MCP Server - 用于ADO集成

## 🆘 获取帮助

1. **验证配置：** 运行 `.\verify-agents.ps1`
2. **故障排查：** 查看 `AGENT_TROUBLESHOOTING.md`
3. **Orchestrator指南：** 查看 `ORCHESTRATOR_GUIDE.md`
4. **快速入门：** 查看 `QUICKSTART.md`
5. **MCP设置：** 查看 `MCP_SETUP.md`

## 📌 关键要点

1. ✅ **所有文件已正确配置** - YAML格式验证通过
2. ⚠️ **需要最新版Copilot** - 自定义agents是新功能
3. 🔄 **必须重启VS Code** - 添加agents后需要完全重启
4. 💡 **@workspace替代方案** - 如果agents无法识别，使用详细指令
5. 📖 **文档齐全** - 所有使用指南都已创建

---

**下一步：完全重启VS Code，然后在Copilot Chat中输入 `@` 查看agents是否可用！**
