import type { GithubUser } from "../types/github";

type GithubUserCardProps = {
  user: GithubUser;
};

export default function GithubUserCard({ user }: GithubUserCardProps) {
  return (
    <article className="user-card">
      <img src={user.avatarUrl} alt={`${user.login} 的头像`} />
      <div>
        <h2>{user.name ?? user.login}</h2>
        <p>{user.bio ?? "这个用户暂时没有简介。"}</p>
        <p>
          仓库: {user.publicRepos} / 粉丝: {user.followers}
        </p>
      </div>
    </article>
  );
}
