export function createAppError(status, type, message, details) {
  const error = new Error(message);
  error.status = status;
  error.type = type;
  error.details = details;
  return error;
}

export function getErrorStatus(error) {
  return Number(error?.status) || 500;
}

export function serializeError(error) {
  return {
    type: error?.type || "server_error",
    message: error?.message || "Unexpected server error.",
    details: error?.details,
  };
}
