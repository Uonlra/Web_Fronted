import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import GithubFeedback from "../components/GithubFeedback";
import GithubSearchForm from "../components/GithubSearchForm";
import GithubStatusPanel from "../components/GithubStatusPanel";
import GithubUserCard from "../components/GithubUserCard";
import SearchHistory from "../components/SearchHistory";
import ThemeToggleButton from "../components/ThemeToggleButton";
import { useSearchHistory } from "../context/SearchHistoryContext";
import { useTheme } from "../context/ThemeContext";
import useGithubUser from "../hooks/useGithubUser";

export default function GithubPage() {
  const [username, setUsername] = useState<string>("octocat");
  const { user, loading, error, fetchGithubUser } = useGithubUser("octocat");
  const { addHistory } = useSearchHistory();
  const { theme } = useTheme();

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
    addHistory(username);
  }

  return (
    <section className="github-page" data-theme={theme}>
      <div className="page-header">
        <div>
          <h1>GitHub 用户搜索</h1>
          <p>页面打开时会自动加载 octocat，也可以输入 GitHub 用户名手动搜索。</p>
        </div>

        <ThemeToggleButton />
      </div>

      <GithubSearchForm
        username={username}
        loading={loading}
        onUsernameChange={handleUsernameChange}
        onSearchKeyDown={handleSearchKeyDown}
        onSearch={handleSearch}
      />

      <GithubStatusPanel
        username={username}
        userLogin={user?.login ?? null}
        loading={loading}
        error={error}
      />

      <SearchHistory />

      <GithubFeedback loading={loading} error={error} />

      {user && <GithubUserCard user={user} />}
    </section>
  );
}
