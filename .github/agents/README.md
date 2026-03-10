# EverShop AI Agents

此目录包含7个AI agent配置文件，用于EverShop电商平台的开发工作。

## 🎯 从这里开始：Orchestrator

**不确定用哪个agent？** 先用 `@evershop-orchestrator`！

Orchestrator会分析你的需求并推荐最合适的agent。

## 📁 Agent文件列表

| Agent文件 | 用途 | 适用范围 |
|----------|------------|---------|
| **[evershop-orchestrator.agent.md](./evershop-orchestrator.agent.md)** | 🎯 **任务分析和Agent调度** | 所有文件 |
| **[evershop-feature.agent.md](./evershop-feature.agent.md)** | 功能开发、GraphQL API、React组件 | `packages/evershop/**`, `extensions/**`, `themes/**` |
| **[evershop-debug.agent.md](./evershop-debug.agent.md)** | 调试、错误诊断、性能优化 | `packages/evershop/**`, `extensions/**` |
| **[evershop-theme.agent.md](./evershop-theme.agent.md)** | 主题开发、UI定制、样式 | `themes/**`, `packages/evershop/src/components/**` |
| **[evershop-extension.agent.md](./evershop-extension.agent.md)** | 扩展开发、第三方集成、Hook系统 | `extensions/**` |
| **[evershop-database.agent.md](./evershop-database.agent.md)** | 数据库迁移、查询优化、Schema设计 | `**/migration/**`, `packages/postgres-query-builder/**` |
| **[evershop-api.agent.md](./evershop-api.agent.md)** | GraphQL Schema、Resolver、Mutation | `**/api/**`, `**/graphql/**` |

## 🚀 如何使用

### 在GitHub Copilot中调用

在VS Code的GitHub Copilot Chat中使用 `@agent-name` 格式调用：

#### 不确定用哪个？先问Orchestrator：
```
@evershop-orchestrator 我想添加产品比较功能，该用哪个agent？
@evershop-orchestrator 用户结账时报错，怎么处理？
```

#### 直接使用专业Agent：
```
@evershop-feature 添加产品愿望清单功能
@evershop-debug GraphQL查询返回null
@evershop-theme 创建深色主题
@evershop-extension 创建Stripe支付扩展
@evershop-database 为products表添加库存字段
@evershop-api 创建获取热销产品的查询
```

### Agent自动应用

当你编辑特定目录下的文件时，对应的agent会根据`applyTo`配置自动激活：

- 编辑 `extensions/` 下的文件 → `evershop-extension` agent
- 编辑 `themes/` 下的文件 → `evershop-theme` agent
- 编辑 `migration/` 下的文件 → `evershop-database` agent
- 编辑 `api/` 或 `graphql/` 下的文件 → `evershop-api` agent

## 📋 Agent详细说明

### 0. 🎯 evershop-orchestrator（推荐从这里开始）

**专长：** 任务分析、Agent推荐、工作流设计

**适用场景：**
- 不确定该用哪个agent
- 需要多个agent协作的复杂任务
- 想了解最佳实践和工作流
- 第一次使用这些agents

**特点：**
- ✅ 不直接实现功能，只提供指导
- ✅ 分析任务并推荐最合适的agent
- ✅ 为复杂任务设计多agent工作流
- ✅ 解释为什么某个agent最适合

**示例：**
```
@evershop-orchestrator 我需要集成微信支付，该怎么做？
@evershop-orchestrator 产品页面加载很慢，应该找哪个agent帮忙？
@evershop-orchestrator 创建一个完整的产品评论系统需要哪些步骤？
```

---

### 1. 🛍️ evershop-feature

**专长：** 电商功能开发、模块化架构

**适用场景：**
- 创建新的电商功能（购物车、愿望清单、评论系统）
- 开发完整的功能模块
- 实现业务逻辑
- React组件开发

**示例：**
```
@evershop-feature 实现产品比较功能，用户可以选择多个产品对比价格和规格
```

### 2. 🐛 evershop-debug

**专长：** 问题诊断、错误修复

**适用场景：**
- GraphQL错误排查
- 数据库查询问题
- React SSR水合错误
- 模块冲突解决
- 性能问题诊断

**示例：**
```
@evershop-debug checkout页面提交订单时出现500错误，日志显示"Cannot set headers..."
```

### 3. 🎨 evershop-theme

**专长：** UI设计、主题定制

**适用场景：**
- 创建自定义主题
- 修改页面布局和样式
- 响应式设计优化
- 品牌定制
- 移动端优化

**示例：**
```
@evershop-theme 将产品列表页改为瀑布流布局，支持图片懒加载
```

### 4. 🔌 evershop-extension

**专长：** 扩展开发、第三方集成

**适用场景：**
- 创建新扩展
- 集成支付网关（Stripe、PayPal等）
- 集成物流服务
- 营销工具集成
- 使用Hook和事件系统

**示例：**
```
@evershop-extension 创建一个自动邮件营销扩展，订单完成后发送感谢邮件
```

### 5. 💾 evershop-database

**专长：** 数据库操作、迁移管理

**适用场景：**
- 创建数据库迁移
- 修改表结构
- 数据迁移
- 查询性能优化
- 索引优化

**示例：**
```
@evershop-database 为product表添加库存预警阈值字段，并创建相应的索引
```

### 6. 🔧 evershop-api

**专长：** GraphQL API开发

**适用场景：**
- 定义GraphQL Schema
- 实现Resolver
- 创建Mutation
- API性能优化
- 使用DataLoader

**示例：**
```
@evershop-api 创建一个GraphQL查询，获取最近7天的畅销产品Top 10
```

## 💡 最佳实践

### 1. 选择正确的Agent

根据任务类型选择最合适的agent：
- **新功能** → `evershop-feature`
- **修复Bug** → `evershop-debug`
- **界面调整** → `evershop-theme`
- **创建插件** → `evershop-extension`
- **数据库变更** → `evershop-database`
- **API开发** → `evershop-api`

### 2. 提供详细上下文

描述需求时包含：
- 具体功能要求
- 相关文件或模块
- 预期行为
- 约束条件
- 错误信息（如果有）

### 3. 组合使用多个Agents

对于复杂功能，可以分步骤使用不同的agents：

```
1. @evershop-feature 设计产品评论功能的架构
2. @evershop-database 创建评论相关的数据表
3. @evershop-api 实现评论的GraphQL API
4. @evershop-theme 设计评论显示界面
```

### 4. 利用自动激活

编辑特定目录的文件时，相关agent会自动激活并提供帮助。

## 🔗 相关文档

- **[../AGENTS.md](../AGENTS.md)** - Agent原始配置（作为备份）
- **[../AGENTS_GUIDE.md](../AGENTS_GUIDE.md)** - Agent使用指南
- **[../QUICKSTART.md](../QUICKSTART.md)** - 快速开始指南
- **[../MCP_SETUP.md](../MCP_SETUP.md)** - MCP Server设置

## 📝 Agent配置格式

每个agent文件使用YAML frontmatter + Markdown格式：

```markdown
---
description: Agent描述
argumentHint: 参数提示
applyTo:
  - "适用路径/**"
---

# Agent标题

Agent的详细说明和指导...
```

## 🔄 更新Agent

如需修改agent行为：
1. 编辑对应的 `.agent.md` 文件
2. 修改 `instructions` 部分
3. 保存文件
4. 重启VS Code（可选，但推荐）

## ⚙️ 技术细节

- **格式：** Markdown + YAML frontmatter
- **编码：** UTF-8
- **位置：** `.agents/` 目录
- **命名规范：** `[agent-name].agent.md`
- **自动发现：** VS Code会自动识别 `.agent.md` 文件

## 🎯 快速开始

1. **直接使用**：在Copilot Chat中输入 `@evershop-feature` 等
2. **查看帮助**：输入 `@evershop-feature help` 查看agent能力
3. **尝试示例**：参考上面的示例开始你的第一个任务

---

**💡 提示：** Agent会根据你正在编辑的文件自动激活，无需手动指定！
