export default function TodoForm({
    todoText,
    onTodoTextChange,
    onTodoKeyDown,
    onAddTodo,
}) {
    return (
        <div className="todo-form">
            <input
                className="todo-input"
                type="text"
                placeholder="输入一个任务..."
                value={todoText}
                onChange={onTodoTextChange}
                onKeyDown={onTodoKeyDown}
            />
            <button className="todo-add-button" onClick={onAddTodo}>
                添加
            </button>
        </div>
    );
}