import * as github from '@actions/github';
import { RepoStatsConfig, RepoMetaResult } from '../types';
import { getFirstCommitDate, getTotalCommitCount } from '../utils/git';

export async function collectRepoMeta(config: RepoStatsConfig): Promise<RepoMetaResult> {
  const octokit = github.getOctokit(config.githubToken);
  const { owner, repo } = github.context.repo;

  const [repoData, totalCommits, firstCommitDate] = await Promise.all([
    octokit.rest.repos.get({ owner, repo }),
    getTotalCommitCount(),
    getFirstCommitDate(),
  ]);

  const { data } = repoData;
  const now = new Date();
  const ageInDays = Math.floor((now.getTime() - firstCommitDate.getTime()) / (1000 * 60 * 60 * 24));

  // GitHub's open_issues_count includes PRs. Subtract actual issues to estimate PR count.
  let openPRs = 0;
  try {
    const { data: pulls } = await octokit.rest.pulls.list({
      owner, repo, state: 'open', per_page: 1,
    });
    openPRs = pulls.length > 0 ? Math.max(0, data.open_issues_count - (data.open_issues_count - 1)) : 0;
  } catch {
    // PR count unavailable
  }

  return {
    ageInDays,
    totalCommits,
    stars: data.stargazers_count,
    forks: data.forks_count,
    openIssues: data.open_issues_count,
    openPRs,
    defaultBranch: data.default_branch,
    createdAt: data.created_at ?? firstCommitDate.toISOString(),
  };
}
