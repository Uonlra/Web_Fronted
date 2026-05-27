import { useState } from "react";

function TodoPractice() {
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

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
          className={`filter-button ${
            filter === "completed" ? "active" : ""
          }`}
          onClick={() => setFilter("completed")}
        >
          已完成
        </button>
      </div>

      <div className="todo-form">
        <input
          className="todo-input"
          type="text"
          placeholder="输入一个任务..."
          value={todoText}
          onChange={handleTodoTextChange}
        />

        <button className="todo-add-button" onClick={handleAddTodo}>
          添加
        </button>
      </div>

      {visibleTodos.length > 0 ? (
        <ul className="todo-list">
          {visibleTodos.map((todo) => (
            <li
              className={`todo-item ${todo.completed ? "completed" : ""}`}
              key={todo.id}
            >
              <span>{todo.text}</span>
              <div className="todo-actions">
                <button
                  className="todo-toggle-button"
                  onClick={() => handleToggleTodo(todo.id)}
                >
                  {todo.completed ? "未完成" : "已完成"}
                </button>

                <button
                  className="todo-delete-button"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  X
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="todo-empty">还没有任务，先添加一条吧。</p>
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
