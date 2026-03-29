import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = Number(process.env.PORT || 3000);
const model = process.env.OPENAI_MODEL || "gpt-5.2";
const apiKey = process.env.OPENAI_API_KEY;
const client = apiKey ? new OpenAI({ apiKey }) : null;

const TASK_CONFIG = {
  general: {
    label: "通用开发问答",
    developerPrompt: `
你是一个可靠的项目开发助手。
你的职责是帮助开发者完成日常构建、调试、设计接口、拆解任务和整理文档。

回答要求：
1. 优先给出可执行建议，而不是空泛概念。
2. 如果信息不足，明确写出你的假设。
3. 输出尽量结构化，便于直接复制到项目里使用。
4. 不要捏造文件、接口、库能力或未提供的代码细节。
    `.trim(),
  },
  explain: {
    label: "代码解释",
    developerPrompt: `
你是一个擅长讲解代码的高级工程师。
请把复杂内容讲清楚，帮助开发者快速理解现有实现。

回答要求：
1. 先用几句话概括这段代码在做什么。
2. 再说明关键流程、输入输出、潜在风险。
3. 如果适合，给出可以进一步重构或补测试的建议。
4. 默认使用中文回答。
    `.trim(),
  },
  refactor: {
    label: "重构建议",
    developerPrompt: `
你是一个偏实战的重构顾问。
请基于用户给出的代码或需求，提供低风险、可落地的重构建议。

回答要求：
1. 先指出主要问题。
2. 再给出推荐改法和原因。
3. 如果会影响行为、性能或兼容性，要明确提醒。
4. 如果适合，给出分步迁移建议。
    `.trim(),
  },
  docs: {
    label: "文档生成",
    developerPrompt: `
你是一个技术文档助手。
请把用户给出的需求、接口或代码信息整理成清晰、专业、可直接使用的项目文档。

回答要求：
1. 使用清晰标题和短段落。
2. 尽量补全使用场景、参数、返回值、错误情况和示例。
3. 对不确定的内容标注“待确认”。
4. 默认使用中文回答。
    `.trim(),
  },
  json: {
    label: "结构化输出",
    developerPrompt: `
你是一个结构化数据生成助手。
请严格根据用户需求输出 JSON，适合用于页面配置、表单定义、测试数据或任务清单。

回答要求：
1. 只返回合法 JSON。
2. 不要使用 Markdown 代码块。
3. 如果字段含义不明确，请基于常见工程实践做最小假设，并让字段命名自解释。
4. 除 JSON 外不要输出任何额外说明。
    `.trim(),
  },
};

function buildUserPrompt(task, message, context) {
  if (!context) {
    return message;
  }

  if (task === "json") {
    return `
用户目标：
${message}

补充上下文：
${context}
    `.trim();
  }

  return `
任务：
${message}

上下文：
${context}
  `.trim();
}

app.use(express.json());
app.use(express.static("public"));

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    model,
    hasApiKey: Boolean(apiKey),
  });
});

app.get("/api/tasks", (_req, res) => {
  res.json({
    tasks: Object.entries(TASK_CONFIG).map(([key, value]) => ({
      key,
      label: value.label,
    })),
  });
});

app.post("/api/chat", async (req, res) => {
  const prompt = req.body?.message?.trim();
  const context = req.body?.context?.trim() || "";
  const task = req.body?.task?.trim() || "general";
  const taskConfig = TASK_CONFIG[task] || TASK_CONFIG.general;

  if (!apiKey) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is missing. Add it to your .env file first.",
    });
  }

  if (!prompt) {
    return res.status(400).json({
      error: "message is required.",
    });
  }

  try {
    const response = await client.responses.create({
      model,
      reasoning: { effort: task === "refactor" ? "medium" : "low" },
      input: [
        {
          role: "developer",
          content: taskConfig.developerPrompt,
        },
        {
          role: "user",
          content: buildUserPrompt(task, prompt, context),
        },
      ],
    });

    return res.json({
      reply: response.output_text,
      id: response.id,
      task,
      taskLabel: taskConfig.label,
    });
  } catch (error) {
    const status = error?.status || 500;
    const message =
      error?.message || "OpenAI request failed. Check your key and billing status.";

    return res.status(status).json({ error: message });
  }
});

app.listen(port, () => {
  console.log(`OpenAI demo server is running at http://localhost:${port}`);
});
