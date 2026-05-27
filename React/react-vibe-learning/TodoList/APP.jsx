import { useState } from "react";

function TodoList() {
    const [todos, setTodos] = useState([]);
    const [todoText, setTodoText] = useState("");

    function handleTodoTextChange(event) { // handleTodoTextChange 是 Todo 输入框的 onChange 事件处理函数
        setTodoText(event.target.value);
    }

    function handleAddTodo() {
        if (todoText.trim() !== "") {
            return;
    }
    setTodos([...todos, todoText.trim()]);
    setTodoText("");
    }

    return (
        <section className="todo-practice">
            <h2>To-Do List</h2>

            <div className="todo-form">
                <input
                    className="todo-input"
                    type="text"
                    placeholder="输入待办事项..."
                    value={todoText}
                    onChange={handleTodoTextChange}
                />
            
            <button className="add-todo-button" onClick={handleAddTodo}>
                添加
            </button>
            </div>

            <ul className="todo-items">
                {todos.map((todo) => (
                    <li key={todo} className="todo-item">
                        {todo}
                    </li>
                ))}
            </ul>
        </section>
    );
}

export default function App() {
    return (
        <main className="page">
            <TodoList />
        </main>
    );
}