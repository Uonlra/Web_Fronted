import TodoEmpty from "./TodoEmpty.jsx";
import TodoItem from "./TodoItem.jsx";

export default function TodoList({
    todos,
    emptyMessage,
    editingId,
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
    if (todos.length === 0) {
        return <TodoEmpty message={emptyMessage} />;
    }
    return (
        <ul className="todo-list">
            {todos.map((todo) => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    isEditing={editingId === todo.id}
                    editingText={editingText}
                    editInputRef={editInputRef}
                    onToggleTodo={onToggleTodo}
                    onDeleteTodo={onDeleteTodo}
                    onStartEditing={onStartEditing}
                    onEditingTextChange={onEditingTextChange}
                    onSaveEditing={onSaveEditing}
                    onCancelEditing={onCancelEditing}
                    onEditKeyDown={onEditKeyDown}
                />
            ))}
        </ul>
    )
}
