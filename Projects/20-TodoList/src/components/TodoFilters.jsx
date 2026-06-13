export default function TodoFilters({
    filter,
    hasCompletedTodos,
    hasTodos,
    onFilterChange,
    onClearCompleted,
    onClearAllTodos,
}) {
    return (
        <div className="todo-filters">
            <button
                className={`filter-button ${filter === "all" ? "active" : ""}`}
                onClick={() => onFilterChange("all")}
            >
                全部
            </button>

            <button
                className={`filter-button ${filter === "active" ? "active" : ""}`}
                onClick={() => onFilterChange("active")}
            >
                未完成
            </button>

            <button
                className={`filter-button ${filter === "completed" ? "active" : ""}`}
                onClick={() => onFilterChange("completed")}
            >
                已完成
            </button>

            {hasCompletedTodos && (
                <button className="clear-completed-button" onClick={onClearCompleted}>
                    清空已完成
                </button>
            )}

            {hasTodos && (
                <button className="clear-all-button" onClick={onClearAllTodos}>
                    清空全部
                </button>
            )}
        </div>
    );
}