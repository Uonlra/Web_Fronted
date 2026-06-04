import { useEffect, useRef, useState } from "react";
import TodoForm from "./components/TodoForm";
import TodoHeader from "./components/TodoHeader";
import TodoList from "./components/TodoList";
import TodoFilters from "./components/TodoFilters";
import TodoEmpty from "./components/TodoEmpty";


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
