import { useState } from "react";

function TodoPractice() {
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");


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
      <header className="todo-header">
        <h1>Todo 输入练习</h1>
        <p>练习受控输入框、useState、添加任务和列表渲染。</p>
        <p className="todo-stats">
          全部 {totalCount} 项 · 已完成 {completedCount} 项 · 未完成{" "}
          {activeCount} 项
        </p>
      </header>

      <div className="todo-filters">
        <button
          className={`filter-button ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          全部
        </button>

        <button
          className={`filter-button ${filter === "active" ? "active" : ""}`}
          onClick={() => setFilter("active")}
        >
          未完成
        </button>

        <button
          className={`filter-button ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          已完成
        </button>

        {hasCompletedTodos && (
          <button
            className="clear-completed-button"
            onClick={handleClearCompleted}
          >
            清空已完成
          </button>
        )}
      </div>

      <div className="todo-form">
        <input
          className="todo-input"
          type="text"
          placeholder="输入一个任务..."
          value={todoText}
          onChange={handleTodoTextChange}
          onKeyDown={handleTodoKeyDown}
        />

        <button className="todo-add-button" onClick={handleAddTodo}>
          添加
        </button>
      </div>

      {visibleTodos.length > 0 ? (
        <ul className="todo-list">
          {visibleTodos.map((todo) => {
            const isEditing = editingId === todo.id;

            return (
              <li
                className={`todo-item ${todo.completed ? "completed" : ""}`}
                key={todo.id}
              >
                {isEditing ? (
                  <>
                    <input
                      className="todo-edit-input"
                      value={editingText}
                      onChange={handleEditingTextChange}
                    />

                    <div className="todo-actions">
                      <button
                        className="todo-save-button"
                        onClick={() => handleSaveEditing(todo.id)}
                      >
                        保存
                      </button>

                      <button
                        className="todo-cancel-button"
                        onClick={handleCancelEditing}
                      >
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
                        onClick={() => handleToggleTodo(todo.id)}
                      >
                        {todo.completed ? "未完成" : "已完成"}
                      </button>

                      <button
                        className="todo-edit-button"
                        onClick={() => handleStartEditing(todo)}
                      >
                        编辑
                      </button>

                      <button
                        className="todo-delete-button"
                        onClick={() => handleDeleteTodo(todo.id)}
                      >
                        X
                      </button>
                    </div>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="todo-empty">{emptyMessage}</p>
      )}
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
