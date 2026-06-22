import { useEffect, useState, type ChangeEvent, type KeyboardEvent } from "react";

type GithubApiUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  public_repos: number;
  followers: number;
};

type GithubUser = {
  login: string;
  name: string | null;
  avatarUrl: string;
  bio: string | null;
  publicRepos: number;
  followers: number;
};

function formatGithubUser(data: GithubApiUser): GithubUser {
  return {
    login: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    publicRepos: data.public_repos,
    followers: data.followers,
  };
}

export default function GithubPage() {
  const [username, setUsername] = useState<string>("octocat");
  const [user, setUser] = useState<GithubUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  async function fetchGithubUser(nextUsername: string) {
    setLoading(true);
    setError("");
    setUser(null);

    try {
      const response = await fetch(`https://api.github.com/users/${nextUsername}`);

      if (!response.ok) {
        throw new Error("没有找到这个 GitHub 用户");
      }

      const data: GithubApiUser = await response.json();
      setUser(formatGithubUser(data));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("请求失败，请稍后再试");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchGithubUser("octocat");
  }, []);

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  function handleSearch() {
    const nextUsername = username.trim();

    if (loading) {
      return;
    }

    if (nextUsername === "") {
      setError("请输入 GitHub 用户名");
      setUser(null);
      setLoading(false);
      return;
    }

    fetchGithubUser(nextUsername);
  }

  return (
    <section className="github-page">
      <h1>GitHub 用户搜索</h1>
      <p>页面打开时会自动加载 octocat，也可以输入 GitHub 用户名手动搜索。</p>

      <div className="search-form">
        <input
          className="search-input"
          type="text"
          value={username}
          onChange={handleUsernameChange}
          onKeyDown={handleSearchKeyDown}
          placeholder="例如：octocat"
          disabled={loading}
        />

        <button
          className="search-button"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "搜索中..." : "搜索"}
        </button>
      </div>

      <div className="state-panel">
        <h2>当前状态</h2>
        <p>username: {username || "空字符串"}</p>
        <p>user: {user ? user.login : "null"}</p>
        <p>loading: {loading ? "true" : "false"}</p>
        <p>error: {error || "空字符串"}</p>
      </div>

      {error && <p className="error-message">{error}</p>}

      {loading && <p className="loading-message">正在请求 GitHub API...</p>}

      {user && (
        <article className="user-card">
          <img src={user.avatarUrl} alt={`${user.login} 的头像`} />
          <div>
            <h2>{user.name ?? user.login}</h2>
            <p>{user.bio ?? "这个用户暂时没有简介。"}</p>
            <p>
              仓库: {user.publicRepos} / 粉丝: {user.followers}
            </p>
          </div>
        </article>
      )}
    </section>
  );
}
