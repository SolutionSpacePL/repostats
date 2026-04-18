import * as github from '@actions/github';
import { RepoStatsConfig, WeeklyCommits } from '../types';

export async function collectCommitActivity(config: RepoStatsConfig): Promise<WeeklyCommits[]> {
  const octokit = github.getOctokit(config.githubToken);
  const { owner, repo } = github.context.repo;

  const { data } = await octokit.rest.repos.getCommitActivityStats({ owner, repo });

  if (!data || !Array.isArray(data)) {
    // GitHub may return 202 while computing stats — retry once
    await new Promise(r => setTimeout(r, 3000));
    const retry = await octokit.rest.repos.getCommitActivityStats({ owner, repo });
    if (!retry.data || !Array.isArray(retry.data)) return [];
    return retry.data.map(w => ({
      week: w.week,
      days: w.days,
      total: w.total,
    }));
  }

  return data.map(w => ({
    week: w.week,
    days: w.days,
    total: w.total,
  }));
}
