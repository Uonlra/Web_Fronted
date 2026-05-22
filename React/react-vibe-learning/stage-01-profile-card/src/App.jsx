const profiles = [
  {
    id: 1,
    name: "Kasen",
    role: "前端开发者",
    skills: ["React", "JavaScript", "CSS", "Vite"],
    bio: "正在学习组件、JSX 和前端交互。",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=240&q=80",
    buttonText: "关注我",
    isAvailable: true,
  },
  {
    id: 2,
    name: "Mia",
    role: "UI 设计师",
    skills: ["Figma", "Design", "CSS"],
    bio: "喜欢把复杂的信息设计成清晰、舒服的界面。",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=240&q=80",
    buttonText: "查看作品",
    isAvailable: false,
  },
  {
    id: 3,
    name: "Leo",
    role: "后端开发者",
    skills: ["Node.js", "API", "Database"],
    bio: "专注 API、数据库和系统稳定性。",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&q=80",
    buttonText: "关注他",
    isAvailable: true,
  },
];

function ProfileCard({
  name = "匿名用户",
  role = "未填写职业",
  skills = [],
  bio = "这个人还没有填写简介。",
  avatarUrl = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=240&q=80",
  buttonText = "查看资料",
  isAvailable = false,
  onFollow,
}) {
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
          <span className="skill-tag" key={skill}>
            {skill}
          </span>
        ))}
      </div>

      <p className={`profile-status ${isAvailable ? "online" : "offline"}`}>
        {isAvailable ? "在线" : "离线"}
      </p>

      <button className="profile-button" onClick={() => onFollow(name)}>
        {buttonText}
      </button>
    </article>
  );
}

export default function App() {
  function handleFollow(name) {
    alert(`你关注了 ${name}！`);
  }
  
  return (
    <main className="page">
      <section className="profile-grid">
        {profiles.map((profile) => (
          <ProfileCard key={profile.id} {...profile} onFollow={handleFollow} />
        ))}
      </section>
    </main>
  );
}
