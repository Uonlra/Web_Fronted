function ProfileCard() {
  return (
    <article className="profile-card">
      <img
        className="profile-avatar"
        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80"
        alt="个人头像"
      />
      <h1>Alex Chen</h1>
      <p className="profile-role">React 学习者</p>
      <p className="profile-bio">
        正在用 vibe coding 的方式学习组件、JSX 和前端交互。
      </p>
    </article>
  );
}

export default function App() {
  return (
    <main className="page">
      <ProfileCard />
    </main>
  );
}
