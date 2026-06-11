import { NavLink, Route, Routes } from "react-router-dom";
import AboutPage from "./pages/AboutPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import TodosPage from "./pages/TodosPage.jsx";

export default function App() {
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

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/todos" element={<TodosPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </section>
    </main>
  );
}
