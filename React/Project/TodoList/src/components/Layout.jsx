import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <main className="page">
      <section className="app-shell">
        <nav className="app-nav" aria-label="主导航">
          <NavLink to="/" end>
            首页
          </NavLink>
          <NavLink to="/todos">任务</NavLink>
          <NavLink to="/stats">统计</NavLink>
          <NavLink to="/about">关于</NavLink>
        </nav>

        <Outlet/>
      </section>
    </main>
  );
}
