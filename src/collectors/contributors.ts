import * as github from '@actions/github';
import { RepoStatsConfig, ContributorInfo } from '../types';

export async function collectContributors(config: RepoStatsConfig): Promise<ContributorInfo[]> {
  const octokit = github.getOctokit(config.githubToken);
  const { owner, repo } = github.context.repo;

  const { data } = await octokit.rest.repos.getContributorsStats({ owner, repo });

  if (!data || !Array.isArray(data)) {
    await new Promise(r => setTimeout(r, 3000));
    const retry = await octokit.rest.repos.getContributorsStats({ owner, repo });
    if (!retry.data || !Array.isArray(retry.data)) return [];
    return mapContributors(retry.data);
  }

  return mapContributors(data);
}

function mapContributors(data: any[]): ContributorInfo[] {
  return data
    .filter(c => c.author)
    .map(c => ({
      login: c.author.login,
      avatarUrl: c.author.avatar_url,
      contributions: c.total,
    }))
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 8);
}
