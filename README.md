# 🤖 AI RAG 知识库聊天应用

基于 Vercel AI SDK 构建的检索增强生成（RAG）聊天应用，支持知识库管理和智能对话。

## ✨ 功能特性

- 🧠 **智能知识库管理** - 添加、存储和检索自定义知识
- 🔍 **语义搜索** - 基于向量相似度的智能内容检索
- 💬 **流式对话** - 实时流式响应，提升用户体验
- 🎯 **精准回答** - 仅基于知识库内容回答问题
- 🚀 **高性能** - 使用 HNSW 索引优化向量检索
- 🌐 **中文优化** - 使用 BAAI/bge-large-zh-v1.5 中文嵌入模型

## 🛠️ 技术栈

- **框架**: [Next.js 14](https://nextjs.org) (App Router)
- **AI SDK**: [Vercel AI SDK](https://sdk.vercel.ai/docs)
- **AI 平台**: [SiliconFlow](https://cloud.siliconflow.cn/) (兼容 OpenAI API)
- **数据库**: [PostgreSQL](https://www.postgresql.org/) + [pgvector](https://github.com/pgvector/pgvector)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team)
- **UI 组件**: [shadcn/ui](https://ui.shadcn.com) + [TailwindCSS](https://tailwindcss.com)
- **向量模型**: BAAI/bge-large-zh-v1.5 (1024维)

## 📦 快速开始

### 1. 环境要求

- Node.js 18+
- PostgreSQL 14+ (需安装 pgvector 扩展)
- pnpm / npm / yarn

### 2. 安装依赖

```bash
# 使用 pnpm（推荐）
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 环境配置

复制环境变量模板并配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库配置
DATABASE_URL=postgres://postgres:postgres@localhost:5432/your_database

# AI 配置 (获取 API Key: https://cloud.siliconflow.cn/)
SILICONFLOW_API_KEY=sk-your-siliconflow-api-key-here
```

### 4. 数据库设置

```bash
# 创建数据库并启用 pgvector 扩展
createdb your_database
psql -d your_database -c "CREATE EXTENSION IF NOT EXISTS vector;"

# 推送数据库架构
pnpm run db:push

# 或使用迁移（推荐）
pnpm run db:generate
pnpm run db:migrate
```

### 5. 启动开发服务器

```bash
pnpm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 开始使用！

## 📂 项目结构

```
ai-sdk-rag-starter/
├── app/                      # Next.js App Router
│   ├── api/
│   │   └── chat/            # 聊天 API 路由
│   │       └── route.ts     # 流式聊天处理
│   └── page.tsx             # 主页面
├── components/              # React 组件
│   └── ui/                  # shadcn/ui 组件
├── lib/
│   ├── actions/             # Server Actions
│   │   └── resources.ts     # 知识库操作
│   ├── ai/                  # AI 相关工具
│   │   └── embedding.ts     # 向量嵌入工具
│   ├── db/                  # 数据库
│   │   ├── schema/          # 数据表结构
│   │   │   ├── embeddings.ts   # 向量表
│   │   │   └── resources.ts    # 资源表
│   │   ├── migrations/      # 数据库迁移文件
│   │   └── index.ts         # 数据库连接
│   └── utils.ts             # 工具函数
└── public/                  # 静态资源
```

## 🎯 核心功能说明

### 知识库管理

通过聊天界面添加知识：

```
用户: 请记住：TypeScript 是 JavaScript 的超集
AI: Resource successfully created.
```

### 智能检索

基于余弦相似度的语义搜索：

- 自动将用户问题转换为向量
- 在知识库中查找最相关的内容（相似度 > 0.5）
- 返回最相关的 4 条结果

### 向量嵌入

- **模型**: BAAI/bge-large-zh-v1.5
- **维度**: 1024
- **索引**: HNSW (快速近似最近邻搜索)
- **相似度算法**: 余弦相似度

## 🔧 开发命令

```bash
# 开发
pnpm run dev              # 启动开发服务器
pnpm run build            # 构建生产版本
pnpm run start            # 启动生产服务器

# 代码质量
pnpm run lint             # ESLint 检查
pnpm run format           # Prettier 格式化
pnpm run format:check     # 检查代码格式

# 数据库
pnpm run db:generate      # 生成迁移文件
pnpm run db:migrate       # 应用迁移
pnpm run db:push          # 直接推送 schema（开发用）
pnpm run db:studio        # 打开 Drizzle Studio
pnpm run db:drop          # 删除迁移
pnpm run db:pull          # 从数据库拉取 schema
pnpm run db:check         # 检查迁移一致性
```

## 🚀 部署

### Vercel 部署（推荐）

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量：
   - `DATABASE_URL`
   - `SILICONFLOW_API_KEY`
4. 部署！

### Docker 部署

```bash
# 构建镜像
docker build -t ai-rag-app .

# 运行容器
docker run -p 3000:3000 \
  -e DATABASE_URL="your_database_url" \
  -e SILICONFLOW_API_KEY="your_api_key" \
  ai-rag-app
```

## 🔑 获取 API Key

访问 [SiliconFlow](https://cloud.siliconflow.cn/) 注册并获取免费 API Key。

SiliconFlow 提供：
- ✅ 免费额度
- ✅ 兼容 OpenAI API
- ✅ 多种中文优化模型
- ✅ 稳定的国内访问

## 🎨 自定义配置

### 更换聊天模型

编辑 `app/api/chat/route.ts`：

```typescript
const result = streamText({
  model: model.chat("Qwen/Qwen2.5-7B-Instruct"), // 更换模型
  // ...
});
```

### 更换嵌入模型

编辑 `lib/ai/embedding.ts`：

```typescript
const embeddingModel = model.embedding('BAAI/bge-large-zh-v1.5');
```

⚠️ **注意**: 更换嵌入模型需要：
1. 确认新模型的向量维度
2. 更新 `lib/db/schema/embeddings.ts` 中的 `dimensions`
3. 重新生成数据库迁移

## 🐛 常见问题

### pgvector 扩展未安装

```bash
# macOS (使用 Homebrew)
brew install pgvector

# Ubuntu/Debian
sudo apt-get install postgresql-14-pgvector

# 然后在数据库中启用
psql -d your_database -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### HNSW 索引维度限制

pgvector 的 HNSW 索引最多支持 2000 维。如需使用更高维度的模型：

1. 使用 IVFFlat 索引（性能略低但支持任意维度）
2. 使用降维技术

## 📝 许可证

MIT License - 查看 [LICENSE](LICENSE) 文件了解详情

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📚 相关资源

- [Vercel AI SDK 文档](https://sdk.vercel.ai/docs)
- [Drizzle ORM 文档](https://orm.drizzle.team)
- [pgvector 文档](https://github.com/pgvector/pgvector)
- [SiliconFlow 文档](https://docs.siliconflow.cn/)

---

**如果这个项目对你有帮助，请给个 ⭐️ Star！**
