const SESSION_STORAGE_KEY = "openai-api-chat-session-id";

const form = document.querySelector("#chat-form");
const taskInput = document.querySelector("#task");
const messageInput = document.querySelector("#message");
const contextInput = document.querySelector("#context");
const submitButton = document.querySelector("#submit-button");
const stopButton = document.querySelector("#stop-stream");
const clearSessionButton = document.querySelector("#clear-session");
const messagesContainer = document.querySelector("#messages");
const messageTemplate = document.querySelector("#message-template");
const chatMeta = document.querySelector("#chat-meta");
const sessionMeta = document.querySelector("#session-meta");
const composerStatus = document.querySelector("#composer-status");
const helperButtons = document.querySelectorAll("[data-template]");
const statusReady = document.querySelector("#status-ready");
const statusModel = document.querySelector("#status-model");
const statusKey = document.querySelector("#status-key");

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

const state = {
  sessionId: localStorage.getItem(SESSION_STORAGE_KEY) || "",
  tasks: [],
  controller: null,
};

for (const button of helperButtons) {
  button.addEventListener("click", () => {
    const task = button.dataset.template;
    taskInput.value = task;
    messageInput.value = templates[task] || "";
    messageInput.focus();
  });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  void submitMessage();
});

stopButton.addEventListener("click", () => {
  state.controller?.abort();
});

clearSessionButton.addEventListener("click", () => {
  void resetSession();
});

messagesContainer.addEventListener("click", async (event) => {
  const copyButton = event.target.closest("[data-copy]");
  if (!copyButton) {
    return;
  }

  const messageElement = copyButton.closest(".message");
  const body = messageElement?.querySelector(".message-body")?.textContent || "";

  try {
    await navigator.clipboard.writeText(body);
    copyButton.textContent = "已复制";
    window.setTimeout(() => {
      copyButton.textContent = "复制";
    }, 1200);
  } catch (_error) {
    composerStatus.textContent = "复制失败，请手动复制。";
  }
});

async function initialize() {
  composerStatus.textContent = "正在初始化助手...";
  await Promise.all([loadHealth(), loadTasks()]);
  await loadSession();
  composerStatus.textContent = "准备就绪。";
}

async function loadHealth() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();

    statusReady.textContent = data.ready ? "可用" : "缺少配置";
    statusModel.textContent = data.model || "-";
    statusKey.textContent = data.hasApiKey ? "已配置" : "未配置";

    if (Array.isArray(data.startupIssues) && data.startupIssues.length > 0) {
      composerStatus.textContent = data.startupIssues.join(" ");
    }
  } catch (_error) {
    statusReady.textContent = "不可达";
    statusModel.textContent = "-";
    statusKey.textContent = "-";
    composerStatus.textContent = "服务状态检查失败。";
  }
}

async function loadTasks() {
  const response = await fetch("/api/tasks");
  const data = await response.json();
  state.tasks = data.tasks || [];

  taskInput.innerHTML = "";

  for (const task of state.tasks) {
    const option = document.createElement("option");
    option.value = task.key;
    option.textContent = task.label;
    taskInput.append(option);
  }
}

async function loadSession() {
  const url = state.sessionId
    ? `/api/session?sessionId=${encodeURIComponent(state.sessionId)}`
    : "/api/session";

  const response = await fetch(url);
  const data = await response.json();

  state.sessionId = data.sessionId;
  localStorage.setItem(SESSION_STORAGE_KEY, state.sessionId);
  renderHistory(data.messages || []);
  updateSessionMeta(data.messages || []);
}

function renderHistory(messages) {
  messagesContainer.innerHTML = "";

  if (messages.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "会话已建立，发出你的第一条任务吧。";
    messagesContainer.append(empty);
    return;
  }

  for (const message of messages) {
    const node = createMessageNode(message);
    messagesContainer.append(node);
  }

  scrollMessagesToBottom();
}

function updateSessionMeta(messages) {
  sessionMeta.textContent = `会话 ID: ${state.sessionId.slice(0, 8)}... · 消息数 ${messages.length}`;
  chatMeta.textContent =
    messages.length > 0 ? `已加载 ${messages.length} 条历史消息。` : "当前会话暂无历史消息。";
}

function createMessageNode(message) {
  const fragment = messageTemplate.content.cloneNode(true);
  const article = fragment.querySelector(".message");
  const role = fragment.querySelector(".message-role");
  const task = fragment.querySelector(".message-task");
  const body = fragment.querySelector(".message-body");
  const context = fragment.querySelector(".message-context");

  article.dataset.role = message.role;
  role.textContent = message.role === "assistant" ? "Assistant" : "You";
  task.textContent = message.taskLabel || "";
  body.textContent = message.message || "";

  if (message.context) {
    context.textContent = `上下文：${message.context}`;
  } else {
    context.remove();
  }

  return article;
}

function createPendingAssistantMessage(taskLabel) {
  const node = createMessageNode({
    role: "assistant",
    taskLabel,
    message: "",
    context: "",
  });
  node.classList.add("is-streaming");
  messagesContainer.append(node);
  scrollMessagesToBottom();
  return node;
}

function scrollMessagesToBottom() {
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function setStreamingState(isStreaming) {
  submitButton.disabled = isStreaming;
  stopButton.disabled = !isStreaming;
  taskInput.disabled = isStreaming;
  clearSessionButton.disabled = isStreaming;
}

async function submitMessage() {
  const message = messageInput.value.trim();
  const context = contextInput.value.trim();
  const task = taskInput.value;
  const taskLabel = state.tasks.find((item) => item.key === task)?.label || "当前任务";

  if (!message) {
    composerStatus.textContent = "请输入你的目标。";
    return;
  }

  removeEmptyState();

  const userNode = createMessageNode({
    role: "user",
    taskLabel,
    message,
    context,
  });
  messagesContainer.append(userNode);

  const assistantNode = createPendingAssistantMessage(taskLabel);
  const assistantBody = assistantNode.querySelector(".message-body");

  state.controller = new AbortController();
  setStreamingState(true);
  composerStatus.textContent = "正在生成中...";
  chatMeta.textContent = `任务模式：${taskLabel}`;
  scrollMessagesToBottom();

  try {
    const response = await fetch("/api/chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId: state.sessionId,
        task,
        message,
        context,
      }),
      signal: state.controller.signal,
    });

    if (!response.ok || !response.body) {
      const data = await response.json().catch(() => null);
      throw new Error(data?.error?.message || "流式请求失败。");
    }

    messageInput.value = "";
    contextInput.value = "";

    await consumeEventStream(response.body, {
      onStart(data) {
        state.sessionId = data.sessionId || state.sessionId;
        localStorage.setItem(SESSION_STORAGE_KEY, state.sessionId);
      },
      onDelta(data) {
        assistantBody.textContent += data.delta || "";
        scrollMessagesToBottom();
      },
      onDone(data) {
        assistantNode.classList.remove("is-streaming");
        assistantBody.textContent = data.reply || assistantBody.textContent;
        updateSessionMeta(data.session?.messages || []);
        composerStatus.textContent = "已完成。";
      },
      onError(data) {
        assistantNode.classList.remove("is-streaming");
        assistantNode.classList.add("is-error");
        assistantBody.textContent =
          data?.message || "请求失败，请检查服务端日志和 API 配置。";
        composerStatus.textContent = "请求失败。";
      },
    });
  } catch (error) {
    assistantNode.classList.remove("is-streaming");
    assistantNode.classList.add("is-error");
    assistantBody.textContent =
      error.name === "AbortError" ? "本次生成已被手动停止。" : `出错了：${error.message}`;
    composerStatus.textContent =
      error.name === "AbortError" ? "已停止当前生成。" : "请求失败。";
  } finally {
    state.controller = null;
    setStreamingState(false);
  }
}

function removeEmptyState() {
  const emptyState = messagesContainer.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
  }
}

async function consumeEventStream(stream, handlers) {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const chunks = buffer.split("\n\n");
    buffer = chunks.pop() || "";

    for (const chunk of chunks) {
      const event = parseSseChunk(chunk);
      if (!event) {
        continue;
      }

      const data = event.data ? JSON.parse(event.data) : {};

      if (event.event === "start") {
        handlers.onStart?.(data);
      } else if (event.event === "delta") {
        handlers.onDelta?.(data);
      } else if (event.event === "done") {
        handlers.onDone?.(data);
      } else if (event.event === "error") {
        handlers.onError?.(data);
      }
    }
  }
}

function parseSseChunk(chunk) {
  const lines = chunk.split("\n");
  let eventName = "";
  let data = "";

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (line.startsWith("event:")) {
      eventName = line.slice(6).trim();
    } else if (line.startsWith("data:")) {
      data += line.slice(5).trim();
    }
  }

  if (!eventName) {
    return null;
  }

  return {
    event: eventName,
    data,
  };
}

async function resetSession() {
  if (!state.sessionId) {
    return;
  }

  composerStatus.textContent = "正在清空当前会话...";

  const response = await fetch(`/api/session/${encodeURIComponent(state.sessionId)}`, {
    method: "DELETE",
  });
  const data = await response.json();

  state.sessionId = data.sessionId;
  localStorage.setItem(SESSION_STORAGE_KEY, state.sessionId);
  renderHistory(data.messages || []);
  updateSessionMeta(data.messages || []);
  composerStatus.textContent = "会话已清空。";
}

void initialize();
