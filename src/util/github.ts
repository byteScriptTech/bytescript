export function githubUrlToApiUrl(url: string): string | null {
  const match = url.match(
    /^https:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/[^/]+\/(.+)$/
  );
  if (!match) return null;
  const [, owner, repo, path] = match;
  return `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
}
