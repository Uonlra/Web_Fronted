import dotenv from "dotenv";

dotenv.config();

const startupIssues = [];

function readEnv(name, fallback = "") {
  const raw = process.env[name];

  if (!raw) {
    return fallback;
  }

  return raw
    .replace(/\s+#.*$/, "")
    .replace(/\s+##.*$/, "")
    .trim();
}

function readPort() {
  const rawPort = readEnv("PORT");

  if (!rawPort) {
    startupIssues.push("PORT is missing. Falling back to 3000.");
    return 3000;
  }

  const parsedPort = Number(rawPort);

  if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    startupIssues.push(`PORT "${rawPort}" is invalid. Falling back to 3000.`);
    return 3000;
  }

  return parsedPort;
}

const config = {
  apiKey: readEnv("OPENAI_API_KEY"),
  model: readEnv("OPENAI_MODEL", "gpt-5.2"),
  port: readPort(),
};

if (!readEnv("OPENAI_MODEL")) {
  startupIssues.push('OPENAI_MODEL is missing. Falling back to "gpt-5.2".');
}

if (!config.apiKey) {
  startupIssues.push("OPENAI_API_KEY is missing. Chat endpoints will stay unavailable.");
}

export { config, startupIssues };
