import { useEffect, useRef, useState } from "react";

function TodoForm({
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

function TodoHeader({ totalCount, completedCount, activeCount }) {
  return (
    <header className="todo-header">
      <h1>Todo 输入练习</h1>
      <p>练习受控输入框、useState、添加任务和列表渲染。</p>
      <p className="todo-stats">
        全部 {totalCount} 项 · 已完成 {completedCount} 项 · 未完成{" "}
        {activeCount} 项
      </p>
    </header>
  );
}

function TodoFilters({
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

function TodoEmpty({ message }) {
  return <p className="todo-empty">{message}</p>;
}

function TodoList({
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
  );
}

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

function TodoPractice() {
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");

    if (!savedTodos) {
      return [];
    }

    try {
      return JSON.parse(savedTodos);
    } catch {
      return [];
    }
  });
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const editInputRef = useRef(null);

  useEffect(() => {
    if (editingId !== null && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [editingId]);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function handleTodoTextChange(event) {
    setTodoText(event.target.value);
  }

  function handleAddTodo() {
    const nextTodo = todoText.trim();

    if (nextTodo === "") {
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: nextTodo,
      completed: false,
    };

    setTodos([...todos, newTodo]);
    setTodoText(""); // 添加完后清空输入框
  }

  function handleTodoKeyDown(event) {
    if (event.key === "Enter") {
      handleAddTodo();
    }
  }

  function handleToggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }

  function handleDeleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function handleClearCompleted() {
    setTodos(todos.filter((todo) => !todo.completed));
  }

  function handleClearAllTodos() {
    const shouldClear = window.confirm("确定要清空全部任务吗？");

    if (!shouldClear) {
      return;
    }

    setTodos([]);
  }

  function handleStartEditing(todo) {
    setEditingId(todo.id);
    setEditingText(todo.text);
  }

  function handleEditingTextChange(event) {
    setEditingText(event.target.value);
  }

  function handleSaveEditing(id) {
    const nextText = editingText.trim();

    if (nextText === "") {
      return;
    }
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text: nextText } : todo
      )
    );
    setEditingId(null);
    setEditingText("");
  }

  function handleCancelEditing() {
    setEditingId(null);
    setEditingText("");
  }

  function handleEditKeyDown(event, id) {
    if (event.key === "Enter") {
      handleSaveEditing(id);
    }

    if (event.key === "Escape") {
      handleCancelEditing();
    }
  }

  const totalCount = todos.length;
  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = totalCount - completedCount;
  const visibleTodos = todos.filter((todo) => {
    if (filter === "active") {
      return !todo.completed;
    }

    if (filter === "completed") {
      return todo.completed;
    }

    return true;
  });

  let emptyMessage = "还没有任务，先添加一条吧。";
  if (todos.length > 0 && filter === "active" && activeCount === 0) {
    emptyMessage = "没有未完成任务。";
  }
  if (todos.length > 0 && filter === "completed" && completedCount === 0) {
    emptyMessage = "没有已完成任务。";
  }

  const hasCompletedTodos = completedCount > 0;

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

export default function App() {
  return (
    <main className="page">
      <TodoPractice />
    </main>
  );
}
