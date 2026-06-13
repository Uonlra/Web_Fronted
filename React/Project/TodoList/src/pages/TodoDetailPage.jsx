import { Link, useNavigate, useParams } from "react-router-dom";
import useTodos from "../hooks/useTodos.js";

export default function TodoDetailPage() {
  const { todoId } = useParams();
  const navigate = useNavigate();

  const { todos, handleToggleTodo, handleDeleteTodo } = useTodos();

  const todo = todos.find((item) => String(item.id) === todoId);

  function handleToggleCurrentTodo() {
    handleToggleTodo(todo.id);
  }

  function handleDeleteCurrentTodo() {
    const shouldDelete = window.confirm("确定要删除这个任务吗？");

    if (!shouldDelete) {
      return;
    }

    handleDeleteTodo(todo.id);
    navigate("/todos");
  }

  if (!todo) {
    return (
      <section className="route-page">
        <h1>没有找到这个任务</h1>
        <p>这个任务可能已经被删除，或者当前地址里的任务 ID 不存在。</p>
        <Link className="primary-link" to="/todos">
          返回任务列表
        </Link>
      </section>
    );
  }
  

  return (
    <section className="route-page">
      <p className="detail-label">任务详情</p>
      <h1>{todo.text}</h1>
      <dl className="todo-detail-list">
        <div>
          <dt>任务 ID</dt>
          <dd>{todo.id}</dd>
        </div>
        <div>
          <dt>完成状态</dt>
          <dd>{todo.completed ? "已完成" : "未完成"}</dd>
        </div>
      </dl>
      <div className="todo-detail-actions">
        <button className="todo-toggle-button" onClick={handleToggleCurrentTodo}>
          {todo.completed ? "标记为未完成" : "标记为已完成"}
        </button>
        <button className="todo-delete-button" onClick={handleDeleteCurrentTodo}>
          删除任务
        </button>
      </div>
      <Link className="primary-link" to="/todos">
        返回任务列表
      </Link>
    </section>
  );
}
