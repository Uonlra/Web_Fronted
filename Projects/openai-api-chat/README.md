# OpenAI Project Assistant

这是一个基于 Express + OpenAI Responses API 的轻量项目助手示例。它保留了任务模式的组织方式，同时补上了连续会话、流式输出和更接近真实使用的前后端结构。

当前版本支持：

- 5 种任务模式：通用开发问答、代码解释、重构建议、文档生成、结构化 JSON 输出
- 服务端内存会话历史
- 流式输出
- 清空当前会话
- 健康检查与启动配置提示
- 非流式接口回退

## 启动方式

1. 安装依赖

```bash
npm install
```

2. 创建环境变量文件

把 `.env.example` 复制为 `.env`，然后填入你的配置：

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-5.2
PORT=3000
```

默认行为：

- `OPENAI_MODEL` 未配置时默认使用 `gpt-5.2`
- `PORT` 未配置或非法时回退到 `3000`
- `OPENAI_API_KEY` 未配置时，页面仍可打开，但聊天接口不可用

3. 启动项目

```bash
npm run dev
```

或：

```bash
npm start
```

然后访问 `http://localhost:3000`

## 接口概览

### `GET /api/health`

返回服务状态、模型名、API Key 是否存在，以及启动期发现的问题。

### `GET /api/tasks`

返回当前支持的任务模式列表。

### `GET /api/session?sessionId=...`

读取指定会话；如果会话不存在，会自动创建一个新会话并返回：

```json
{
  "sessionId": "uuid",
  "messages": []
}
```

### `DELETE /api/session/:sessionId`

清空当前会话并返回一个全新的空会话。

### `POST /api/chat`

非流式回退接口，请求体：

```json
{
  "sessionId": "uuid",
  "task": "general",
  "message": "请帮我拆解这个需求",
  "context": "这里放补充代码和限制"
}
```

### `POST /api/chat/stream`

流式接口，返回 SSE 事件流，前端消费的事件包括：

- `start`
- `delta`
- `done`
- `error`

## 项目结构

- `server.js`：Express 入口和 API 路由
- `src/config.js`：环境变量读取与启动问题收集
- `src/tasks.js`：任务模式配置
- `src/session-store.js`：内存会话仓库
- `src/prompt-builder.js`：消息构建与上下文拼接
- `src/openai-service.js`：OpenAI 请求与流式调用封装
- `src/errors.js`：统一错误对象与响应序列化
- `public/`：前端页面、聊天 UI 和流式渲染逻辑

## 当前约束

- 历史记录只保存在 Node 进程内存里，服务重启后会丢失
- 没有用户系统和数据库，适合本地开发、个人演示或二次扩展
- JSON 模式通过 OpenAI JSON mode 与提示词共同约束输出

## 下一步可扩展

- 历史持久化到 SQLite / PostgreSQL
- 文件上传和代码片段管理
- 更细的任务模板配置页
- 请求日志、成本统计与限流
