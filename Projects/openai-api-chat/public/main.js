const form = document.querySelector("#chat-form");
const taskInput = document.querySelector("#task");
const messageInput = document.querySelector("#message");
const contextInput = document.querySelector("#context");
const result = document.querySelector("#result");
const resultMeta = document.querySelector("#result-meta");
const submitButton = document.querySelector("#submit-button");
const helperButtons = document.querySelectorAll("[data-template]");

const templates = {
  general:
    "请帮我拆解这个开发任务，给我实现步骤、风险点和建议的目录结构。",
  explain:
    "请解释这段代码的作用、执行流程，以及有哪些容易忽略的地方。",
  refactor:
    "请帮我评估这段实现如何重构，要求先指出问题，再给低风险改法。",
  docs:
    "请把下面的信息整理成一份项目文档，包含用途、参数、返回结果和示例。",
  json:
    "请输出一个用于后台管理系统的表单 JSON 配置，包含字段名、类型、校验规则和默认值。",
};

for (const button of helperButtons) {
  button.addEventListener("click", () => {
    const task = button.dataset.template;
    taskInput.value = task;
    messageInput.value = templates[task] || "";
    messageInput.focus();
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const task = taskInput.value;
  const message = messageInput.value.trim();
  const context = contextInput.value.trim();
  if (!message) {
    result.textContent = "请输入内容。";
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = "请求中...";
  resultMeta.textContent = "正在准备请求...";
  result.textContent = "正在向 OpenAI 发送请求...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task, message, context }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "请求失败");
    }

    resultMeta.textContent = `任务模式：${data.taskLabel}`;
    result.textContent = data.reply || "模型没有返回文本。";
  } catch (error) {
    resultMeta.textContent = "请求失败";
    result.textContent = `出错了：${error.message}`;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "生成结果";
  }
});
