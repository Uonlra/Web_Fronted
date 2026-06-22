import type { ChangeEvent, KeyboardEvent } from "react";

type GithubSearchFormProps = {
  username: string;
  loading: boolean;
  onUsernameChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSearchKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onSearch: () => void;
};

export default function GithubSearchForm({
  username,
  loading,
  onUsernameChange,
  onSearchKeyDown,
  onSearch,
}: GithubSearchFormProps) {
  return (
    <div className="search-form">
      <input
        className="search-input"
        type="text"
        value={username}
        onChange={onUsernameChange}
        onKeyDown={onSearchKeyDown}
        placeholder="例如：octocat"
      />

      <button className="search-button" onClick={onSearch}>
        {loading ? "搜索中..." : "搜索"}
      </button>
    </div>
  );
}
