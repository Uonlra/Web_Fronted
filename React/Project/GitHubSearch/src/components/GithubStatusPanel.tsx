type GithubStatusPanelProps = {
  username: string;
  userLogin: string | null;
  loading: boolean;
  error: string;
};

export default function GithubStatusPanel({
  username,
  userLogin,
  loading,
  error,
}: GithubStatusPanelProps) {
  return (
    <div className="state-panel">
      <h2>当前状态</h2>
      <p>username: {username || "空字符串"}</p>
      <p>user: {userLogin ?? "null"}</p>
      <p>loading: {loading ? "true" : "false"}</p>
      <p>error: {error || "空字符串"}</p>
    </div>
  );
}
