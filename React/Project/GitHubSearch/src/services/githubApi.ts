import type { GithubApiUser, GithubUser } from "../types/github";

function formatGithubUser(data: GithubApiUser): GithubUser {
  return {
    login: data.login,
    name: data.name,
    avatarUrl: data.avatar_url,
    bio: data.bio,
    publicRepos: data.public_repos,
    followers: data.followers,
  };
}

export async function getGithubUser(username: string, signal?: AbortSignal) {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    signal,
  });

  if (!response.ok) {
    throw new Error("没有找到这个 GitHub 用户");
  }

  const data: GithubApiUser = await response.json();
  return formatGithubUser(data);
}
