type GithubFeedbackProps = {
  loading: boolean;
  error: string;
};

export default function GithubFeedback({ loading, error }: GithubFeedbackProps) {
  return (
    <>
      {error && <p className="error-message">{error}</p>}
      {loading && <p className="loading-message">正在请求 GitHub API...</p>}
    </>
  );
}
