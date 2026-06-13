import { memo } from "react";
import { Link } from "react-router-dom";

function TodoItem({
    todo,
    isEditing,
    editingText,
    editInputRef,
    onToggleTodo,
    onDeleteTodo,
    onStartEditing,
    onEditingTextChange,
    onSaveEditing,
    onCancelEditing,
    onEditKeyDown,
}) {
    return (
        <li className={`todo-item ${todo.completed ? "completed" : ""}`}>
            {isEditing ? (
                <>
                    <input
                        ref={editInputRef}
                        className="todo-edit-input"
                        type="text"
                        value={editingText}
                        onChange={onEditingTextChange}
                        onKeyDown={(event) => onEditKeyDown(event, todo.id)}
                    />

                    <div className="todo-actions">
                        <button
                            className="todo-save-button"
                            onClick={() => onSaveEditing(todo.id)}
                        >
                            保存
                        </button>

                        <button className="todo-cancel-button" onClick={onCancelEditing}>
                            取消
                        </button>
                    </div>
                </>
            ) : (
                <>
                    <span>{todo.text}</span>

                    <div className="todo-actions">
                        <Link className="todo-detail-link" to={`/todos/${todo.id}`}>
                            详情
                        </Link>

                        <button
                            className="todo-toggle-button"
                            onClick={() => onToggleTodo(todo.id)}
                        >
                            {todo.completed ? "未完成" : "已完成"}
                        </button>

                        <button
                            className="todo-edit-button"
                            onClick={() => onStartEditing(todo)}
                        >
                            编辑
                        </button>

                        <button
                            className="todo-delete-button"
                            onClick={() => onDeleteTodo(todo.id)}
                        >
                            X
                        </button>
                    </div>
                </>
            )}
        </li>
    );
}

export default memo(TodoItem);
