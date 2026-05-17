function ProfileCard() {
  const name = "Alex Chen";
  const role = "React 学习者";
  const bio = "正在用 vibe coding 的方式学习组件、JSX 和前端交互。";
  const avatarUrl =
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80";

  return (
    <article className="profile-card">
      <img
        className="profile-avatar"
        src={avatarUrl}
        alt={`${name} 的头像`}
      />
      <h1>{name}</h1>
      <p className="profile-role">{role}</p>
      <p className="profile-bio">{bio}</p>
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
