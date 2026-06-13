import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <section className="route-page">
      <h1>页面不存在</h1>
      <p>当前地址没有匹配到任何页面。</p>
      <Link className="primary-link" to="/">
        回到首页
      </Link>
    </section>
  );
}
