// ============================================
// SearchHistory.jsx —— 搜索历史组件
// ============================================
// 学习点：
// - 列表渲染：用 .map() 把数组变成 JSX 元素
// - key 属性：React 用它追踪列表项的变化（必须唯一）
// - 事件处理：点击历史项触发搜索

function SearchHistory({ history, onHistoryClick }) {
  return (
    <div className="search-history">
      <span className="history-label">最近搜索：</span>
      <div className="history-list">
        {/*
          列表渲染核心语法：
          array.map(item => <元素 key={唯一值}>{内容}</元素>)

          key 的作用：
          - 帮助 React 识别哪些元素变了、添加了、删除了
          - 必须在兄弟元素中唯一
          - 不要用数组下标 index 作为 key（除非列表不会变化）
        */}
        {history.map((item) => (
          <button
            key={item}
            className="history-item"
            onClick={() => onHistoryClick(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  )
}

export default SearchHistory
