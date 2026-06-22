import { useCallback, useEffect, useRef, useState } from "react";
import { getGithubUser } from "../services/githubApi";
import type { GithubUser } from "../types/github";

function isAbortError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

export default function useGithubUser(initialUsername = "octocat") {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchGithubUser = useCallback(async (rawUsername: string) => {
    const nextUsername = rawUsername.trim();

    if (nextUsername === "") {
      abortControllerRef.current?.abort();
      setError("请输入 GitHub 用户名");
      setUser(null);
      setLoading(false);
      return;
    }

    abortControllerRef.current?.abort();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError("");
    setUser(null);

    try {
      const nextUser = await getGithubUser(nextUsername, controller.signal);
      setUser(nextUser);
    } catch (error) {
      if (isAbortError(error)) {
        return;
      }

      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("请求失败，请稍后再试");
      }
    } finally {
      if (!controller.signal.aborted && abortControllerRef.current === controller) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    fetchGithubUser(initialUsername);

    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    };
  }, [fetchGithubUser, initialUsername]);

  return {
    user,
    loading,
    error,
    fetchGithubUser,
  };
}
