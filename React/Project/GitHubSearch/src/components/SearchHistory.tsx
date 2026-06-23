import { useSearchHistory } from "../context/SearchHistoryContext";

export default function SearchHistory() {
  const { history, clearHistory } = useSearchHistory();

  if (history.length === 0) {
    return null;
  }

  return (
    <div className="state-panel">
      <div className="history-header">
        <h2>搜索历史</h2>
        <button className="theme-button" type="button" onClick={clearHistory}>
          清空历史
        </button>
      </div>

      <ul className="history-list">
        {history.map((username, index) => (
          <li key={`${username}-${index}`}>{username}</li>
        ))}
      </ul>
    </div>
  );
}
