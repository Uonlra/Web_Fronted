import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import StatsPage from "./pages/StatsPage.jsx";
import TodoDetailPage from "./pages/TodoDetailPage.jsx";
import TodosPage from "./pages/TodosPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="todos" element={<TodosPage />} />
        <Route path="todos/:todoId" element={<TodoDetailPage />} />
        <Route path="stats" element={<StatsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
