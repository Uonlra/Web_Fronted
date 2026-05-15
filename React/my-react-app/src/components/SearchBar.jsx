// ============================================
// SearchBar.jsx —— 搜索栏组件
// ============================================
// 学习点：
// - 组件是一个函数，接收 props 参数
// - props 是父组件传下来的数据和函数
// - 解构 props 让代码更清晰

// 函数参数解构：直接从 props 中取出需要的值
function SearchBar({ city, setCity, onSearch, loading }) {

  // 处理键盘事件：按回车触发搜索
  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      onSearch()
    }
  }

  return (
    <div className="search-bar">
      {/*
        受控组件：
        - value={city} 让 React 控制输入框的值
        - onChange 每次输入都更新 state
        这样 React 的 state 和输入框始终同步
      */}
      <input
        type="text"
        className="search-input"
        placeholder="输入城市名（英文），如 Beijing, Tokyo..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
      />
      <button
        className="search-btn"
        onClick={onSearch}
        disabled={loading || !city.trim()}
      >
        {/* 条件渲染：加载中显示不同文字 */}
        {loading ? '查询中...' : '查询'}
      </button>
    </div>
  )
}

export default SearchBar
