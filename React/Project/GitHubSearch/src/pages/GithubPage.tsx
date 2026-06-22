import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import GithubUserCard from "../components/GithubUserCard";
import useGithubUser from "../hooks/useGithubUser";

export default function GithubPage() {
  const [username, setUsername] = useState<string>("octocat");
  const { user, loading, error, fetchGithubUser } = useGithubUser("octocat");

  function handleUsernameChange(event: ChangeEvent<HTMLInputElement>) {
    setUsername(event.target.value);
  }

  function handleSearchKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSearch();
    }
  }

  function handleSearch() {
    fetchGithubUser(username);
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
        />

        <button className="search-button" onClick={handleSearch}>
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

      {user && <GithubUserCard user={user} />}
    </section>
  );
}
