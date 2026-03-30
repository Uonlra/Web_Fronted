import express from "express";
import { config, startupIssues } from "./src/config.js";
import { getTaskList, getTaskConfig } from "./src/tasks.js";
import {
  buildSessionPayload,
  clearSession,
  ensureSession,
  getSession,
} from "./src/session-store.js";
import {
  createChatCompletion,
  createChatStream,
  isClientReady,
} from "./src/openai-service.js";
import {
  createAppError,
  getErrorStatus,
  serializeError,
} from "./src/errors.js";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(express.static("public"));

function parseBody(req) {
  const prompt = req.body?.message?.trim();
  const context = req.body?.context?.trim() || "";
  const task = req.body?.task?.trim() || "general";
  const sessionId = req.body?.sessionId?.trim();

  if (!sessionId) {
    throw createAppError(400, "validation_error", "sessionId is required.");
  }

  if (!prompt) {
    throw createAppError(400, "validation_error", "message is required.");
  }

  return {
    message: prompt,
    context,
    task,
    sessionId,
  };
}

function appendConversation(session, userMessage, assistantMessage) {
  session.messages.push(userMessage, assistantMessage);
  session.updatedAt = Date.now();
  return assistantMessage;
}

function sendJsonError(res, error) {
  const status = getErrorStatus(error);
  return res.status(status).json({
    error: serializeError(error),
  });
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    model: config.model,
    port: config.port,
    hasApiKey: Boolean(config.apiKey),
    ready: isClientReady(config),
    startupIssues,
  });
});

app.get("/api/tasks", (_req, res) => {
  res.json({
    tasks: getTaskList(),
  });
});

app.get("/api/session", (req, res) => {
  const requestedId = String(req.query.sessionId || "").trim();
  const session = requestedId ? getSession(requestedId) : null;
  const resolvedSession = session || ensureSession(requestedId || undefined);

  res.json(buildSessionPayload(resolvedSession));
});

app.delete("/api/session/:sessionId", (req, res) => {
  const sessionId = String(req.params.sessionId || "").trim();

  if (!sessionId) {
    return sendJsonError(
      res,
      createAppError(400, "validation_error", "sessionId is required."),
    );
  }

  clearSession(sessionId);
  const session = ensureSession();
  return res.json(buildSessionPayload(session));
});

app.post("/api/chat", async (req, res) => {
  let payload;

  try {
    payload = parseBody(req);
  } catch (error) {
    return sendJsonError(res, error);
  }

  const taskConfig = getTaskConfig(payload.task);
  const session = ensureSession(payload.sessionId);

  try {
    const result = await createChatCompletion({
      config,
      task: payload.task,
      taskConfig,
      history: session.messages,
      message: payload.message,
      context: payload.context,
    });

    const assistantMessage = appendConversation(
      session,
      result.userMessage,
      result.assistantMessage,
    );

    return res.json({
      reply: result.reply,
      id: result.responseId,
      task: payload.task,
      taskLabel: taskConfig.label,
      session: buildSessionPayload(session),
      message: assistantMessage,
    });
  } catch (error) {
    return sendJsonError(res, error);
  }
});

app.post("/api/chat/stream", async (req, res) => {
  let payload;

  try {
    payload = parseBody(req);
  } catch (error) {
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();
    res.write(`event: error\n`);
    res.write(`data: ${JSON.stringify(serializeError(error))}\n\n`);
    return res.end();
  }

  const taskConfig = getTaskConfig(payload.task);
  const session = ensureSession(payload.sessionId);
  let stream;
  let closeHandler = null;

  const writeEvent = (type, data) => {
    res.write(`event: ${type}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  try {
    stream = await createChatStream({
      config,
      task: payload.task,
      taskConfig,
      history: session.messages,
      message: payload.message,
      context: payload.context,
    });

    writeEvent("start", {
      sessionId: session.id,
      task: payload.task,
      taskLabel: taskConfig.label,
    });

    closeHandler = () => {
      stream?.abort();
    };
    req.on("close", closeHandler);

    for await (const event of stream) {
      if (event.type === "response.output_text.delta" && event.delta) {
        writeEvent("delta", { delta: event.delta });
      }

      if (event.type === "response.failed") {
        throw createAppError(
          502,
          "upstream_error",
          event.response?.error?.message || "OpenAI stream failed.",
        );
      }
    }

    const finalResponse = await stream.finalResponse();
    const reply = finalResponse.output_text || "";
    const assistantMessage = appendConversation(
      session,
      stream.userMessage,
      stream.buildAssistantMessage(reply),
    );

    if (closeHandler) {
      req.off("close", closeHandler);
    }

    writeEvent("done", {
      id: finalResponse.id,
      reply,
      task: payload.task,
      taskLabel: taskConfig.label,
      session: buildSessionPayload(session),
      message: assistantMessage,
    });

    return res.end();
  } catch (error) {
    if (closeHandler) {
      req.off("close", closeHandler);
    }
    writeEvent("error", serializeError(error));
    return res.end();
  }
});

app.use((error, _req, res, _next) => sendJsonError(res, error));

app.listen(config.port, () => {
  console.log(`OpenAI assistant server is running at http://localhost:${config.port}`);

  if (startupIssues.length > 0) {
    console.warn("Startup issues:");
    for (const issue of startupIssues) {
      console.warn(`- ${issue}`);
    }
  }
});
