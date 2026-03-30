export function buildUserPrompt(task, message, context) {
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

export function buildInput({ task, taskConfig, history, message, context }) {
  const currentPrompt = buildUserPrompt(task, message, context);

  return [
    {
      role: "developer",
      content: taskConfig.developerPrompt,
    },
    ...history.map((item) => ({
      role: item.role,
      content: item.modelContent,
    })),
    {
      role: "user",
      content: currentPrompt,
    },
  ];
}

export function buildUserHistoryMessage({ task, taskConfig, message, context }) {
  return {
    id: crypto.randomUUID(),
    role: "user",
    task,
    taskLabel: taskConfig.label,
    message,
    context,
    modelContent: buildUserPrompt(task, message, context),
    createdAt: new Date().toISOString(),
  };
}

export function buildAssistantHistoryMessage({ task, taskConfig, reply }) {
  return {
    id: crypto.randomUUID(),
    role: "assistant",
    task,
    taskLabel: taskConfig.label,
    message: reply,
    context: "",
    modelContent: reply,
    createdAt: new Date().toISOString(),
  };
}
