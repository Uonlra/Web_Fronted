import TodoFilters from "../components/TodoFilters.jsx";
import TodoForm from "../components/TodoForm.jsx";
import TodoHeader from "../components/TodoHeader.jsx";
import TodoList from "../components/TodoList.jsx";
import useTodos from "../hooks/useTodos.js";

export default function TodosPage() {
  const {
    todoText,
    filter,
    editingId,
    editingText,
    editInputRef,
    totalCount,
    completedCount,
    activeCount,
    visibleTodos,
    emptyMessage,
    hasCompletedTodos,
    setFilter,
    handleTodoTextChange,
    handleAddTodo,
    handleTodoKeyDown,
    handleToggleTodo,
    handleDeleteTodo,
    handleClearCompleted,
    handleClearAllTodos,
    handleStartEditing,
    handleEditingTextChange,
    handleSaveEditing,
    handleCancelEditing,
    handleEditKeyDown,
  } = useTodos();

  return (
    <section className="todo-practice">
      <TodoHeader
        totalCount={totalCount}
        completedCount={completedCount}
        activeCount={activeCount}
      />

      <TodoFilters
        filter={filter}
        hasCompletedTodos={hasCompletedTodos}
        hasTodos={totalCount > 0}
        onFilterChange={setFilter}
        onClearCompleted={handleClearCompleted}
        onClearAllTodos={handleClearAllTodos}
      />

      <TodoForm
        todoText={todoText}
        onTodoTextChange={handleTodoTextChange}
        onTodoKeyDown={handleTodoKeyDown}
        onAddTodo={handleAddTodo}
      />

      <TodoList
        todos={visibleTodos}
        emptyMessage={emptyMessage}
        editingId={editingId}
        editingText={editingText}
        editInputRef={editInputRef}
        onToggleTodo={handleToggleTodo}
        onDeleteTodo={handleDeleteTodo}
        onStartEditing={handleStartEditing}
        onEditingTextChange={handleEditingTextChange}
        onSaveEditing={handleSaveEditing}
        onCancelEditing={handleCancelEditing}
        onEditKeyDown={handleEditKeyDown}
      />
    </section>
  );
}
