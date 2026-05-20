function ProfileCard() {
  const name = "Kasen";
  const role = "前端开发者";
  const skills = ["React", "JavaScript", "CSS", "Vite"];
  const bio = "正在学习组件、JSX 和前端交互。";
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

      {/* 技能标签 */}
      <div className="profile-skills">
        {skills.map((skill) => (
          <span className="skill-tag" key={skill}> {/* 使用 skill 作为 key，因为技能名称是唯一的 */}
            {skill} 
          </span>
        ))}
      </div>
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
