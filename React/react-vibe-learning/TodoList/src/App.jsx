import { useState } from "react";

function TodoPractice() {
  const [todoText, setTodoText] = useState("");
  const [todos, setTodos] = useState([]);

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
    };

    setTodos([...todos, newTodo]);
    setTodoText(""); // 添加完后清空输入框
  }

  function handleDeleteTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <section className="todo-practice">
      <header className="todo-header">
        <h1>Todo 输入练习</h1>
        <p>练习受控输入框、useState、添加任务和列表渲染。</p>
      </header>

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

      {todos.length > 0 ? (
        <ul className="todo-list">
          {todos.map((todo) => (
            <li className="todo-item" key={todo.id}>
              <span>{todo.text}</span>
              <button
                className="todo-delete-button"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                x
              </button>
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
