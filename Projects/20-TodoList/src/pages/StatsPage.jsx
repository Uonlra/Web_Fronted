import useTodos from "../hooks/useTodos.js";

export default function StatsPage() {
  const { totalCount, completedCount, activeCount } = useTodos();

  return (
    <section className="route-page">
      <h1>任务统计</h1>
      <div className="stats-grid">
        <article className="stats-card">
          <span>全部任务</span>
          <strong>{totalCount}</strong>
        </article>
        <article className="stats-card">
          <span>已完成</span>
          <strong>{completedCount}</strong>
        </article>
        <article className="stats-card">
          <span>未完成</span>
          <strong>{activeCount}</strong>
        </article>
      </div>
    </section>
  );
}
