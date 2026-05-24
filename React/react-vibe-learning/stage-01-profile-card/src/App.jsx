import { useState } from "react";

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
  isFollowed = false,
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

      <button
        className={`profile-button ${isFollowed ? "followed" : ""}`}
        onClick={() => onFollow(name)}
      >
        {isFollowed ? "已关注" : buttonText}
      </button>
    </article>
  );
}

export default function App() { //export default function App() 定义了一个名为 App 的 React 组件，并将其导出为默认导出，使其可以在其他文件中被导入和使用。
  const [followedNames, setFollowedNames] = useState([]); // followedNames 是一个数组，存储已关注的名字；setFollowedNames 是一个函数，用于更新这个数组。
  const [searchText, setSearchText] = useState(""); // searchText 是一个字符串，存储搜索输入的文本；setSearchText 是一个函数，用于更新这个字符串。

  function handleSearchChange(event) {
    setSearchText(event.target.value); // event.target.value 获取输入框的当前值，并通过 setSearchText 更新 searchText 状态。
  }

  function handleFollow(name) {
    if (followedNames.includes(name)) {
      setFollowedNames(
        followedNames.filter((followedName) => followedName !== name)
      );
    } else {
      setFollowedNames([...followedNames, name]); // [...followedNames, name ] 创建一个新的数组，包含之前的名字和新关注的名字 
    }
  }

  const filteredProfiles = profiles.filter((profile) => {
    const keyword = searchText.trim().toLowerCase(); // trim() 去除输入文本的前后空格，toLowerCase() 将输入文本转换为小写，以实现不区分大小写的搜索。

    return (
      profile.name.toLowerCase().includes(keyword) || // includes() 方法检查 profile.name 是否包含搜索关键词。
      profile.role.includes(keyword)
    );
  }
  );


  return (
    <main className="page">
      <header className="profile-summary">
        <h2>推荐关注</h2>
        <p>已关注 {followedNames.length} 人</p>
        <input
          className="profile-search"
          type="search"
          placeholder="搜索名字或职业..."
          value={searchText}
          onChange={handleSearchChange}
        />
      </header>

      <section className="profile-grid">
        {filteredProfiles.map((profile) => {
          const isFollowed = followedNames.includes(profile.name);

          return ( //return 语句返回一个 ProfileCard 组件实例，传递了 profile 对象的属性、handleFollow 函数和 isFollowed 状态作为 props。每个 ProfileCard 都有一个唯一的 key 属性，使用 profile.id 来确保列表渲染的性能和正确性。
            <ProfileCard
              key={profile.id}
              {...profile}
              onFollow={handleFollow}
              isFollowed={isFollowed}
            />
          );
        })}
      </section>
    </main>
  );
}
