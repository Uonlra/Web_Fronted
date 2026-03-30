const sessions = new Map();

function createSession(id = crypto.randomUUID()) {
  const now = Date.now();
  const session = {
    id,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };

  sessions.set(id, session);
  return session;
}

export function getSession(sessionId) {
  return sessions.get(sessionId) || null;
}

export function ensureSession(sessionId) {
  if (sessionId) {
    const existing = getSession(sessionId);
    if (existing) {
      existing.updatedAt = Date.now();
      return existing;
    }
    return createSession(sessionId);
  }

  return createSession();
}

export function clearSession(sessionId) {
  sessions.delete(sessionId);
}

export function buildSessionPayload(session) {
  return {
    sessionId: session.id,
    messages: session.messages.map((message) => ({
      id: message.id,
      role: message.role,
      task: message.task,
      taskLabel: message.taskLabel,
      message: message.message,
      context: message.context,
      createdAt: message.createdAt,
    })),
    createdAt: new Date(session.createdAt).toISOString(),
    updatedAt: new Date(session.updatedAt).toISOString(),
  };
}
