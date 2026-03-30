import OpenAI from "openai";
import { createAppError } from "./errors.js";
import {
  buildAssistantHistoryMessage,
  buildInput,
  buildUserHistoryMessage,
} from "./prompt-builder.js";

let client = null;

export function isClientReady(config) {
  return Boolean(config?.apiKey);
}

function getClient(config) {
  if (!config.apiKey) {
    throw createAppError(
      500,
      "config_error",
      "OPENAI_API_KEY is missing. Add it to your .env file first.",
    );
  }

  if (!client) {
    client = new OpenAI({
      apiKey: config.apiKey,
      timeout: 60000,
    });
  }

  return client;
}

function buildRequestParams({ config, task, taskConfig, history, message, context }) {
  const params = {
    model: config.model,
    reasoning: { effort: task === "refactor" ? "medium" : "low" },
    input: buildInput({ task, taskConfig, history, message, context }),
  };

  if (taskConfig.jsonMode) {
    params.text = {
      format: {
        type: "json_object",
      },
    };
  }

  return params;
}

function normalizeUpstreamError(error) {
  if (error?.name === "APIConnectionTimeoutError" || /timed out/i.test(error?.message || "")) {
    return createAppError(
      504,
      "timeout_error",
      "OpenAI request timed out. Please retry, shorten the prompt, or switch to a faster model.",
    );
  }

  if (error?.status) {
    return createAppError(
      Number(error.status),
      "upstream_error",
      error?.message || "OpenAI request failed.",
    );
  }

  return createAppError(
    500,
    "upstream_error",
    error?.message || "OpenAI request failed. Check your key and billing status.",
  );
}

export async function createChatCompletion({
  config,
  task,
  taskConfig,
  history,
  message,
  context,
}) {
  try {
    const client = getClient(config);
    const response = await client.responses.create(
      buildRequestParams({
        config,
        task,
        taskConfig,
        history,
        message,
        context,
      }),
    );

    const reply = response.output_text || "";

    return {
      reply,
      responseId: response.id,
      userMessage: buildUserHistoryMessage({
        task,
        taskConfig,
        message,
        context,
      }),
      assistantMessage: buildAssistantHistoryMessage({
        task,
        taskConfig,
        reply,
      }),
    };
  } catch (error) {
    throw normalizeUpstreamError(error);
  }
}

export async function createChatStream({
  config,
  task,
  taskConfig,
  history,
  message,
  context,
}) {
  try {
    const client = getClient(config);
    const stream = client.responses.stream(
      buildRequestParams({
        config,
        task,
        taskConfig,
        history,
        message,
        context,
      }),
    );

    stream.userMessage = buildUserHistoryMessage({
      task,
      taskConfig,
      message,
      context,
    });
    stream.buildAssistantMessage = (reply) =>
      buildAssistantHistoryMessage({
        task,
        taskConfig,
        reply,
      });

    return stream;
  } catch (error) {
    throw normalizeUpstreamError(error);
  }
}
