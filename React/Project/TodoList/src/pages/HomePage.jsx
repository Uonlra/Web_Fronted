import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <section className="route-page">
      <h1>Todo Dashboard</h1>
      <p>
        这是你的 React 学习项目首页。现在项目已经从单页面 Todo
        练习升级成了多页面应用。
      </p>
      <Link className="primary-link" to="/todos">
        进入任务页
      </Link>
    </section>
  );
}
