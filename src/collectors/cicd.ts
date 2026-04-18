import * as github from '@actions/github';
import { RepoStatsConfig, WorkflowRun } from '../types';

const MAX_CICD_RUNS = 5;

export async function collectCicdStatus(config: RepoStatsConfig): Promise<WorkflowRun[]> {
  const octokit = github.getOctokit(config.githubToken);
  const { owner, repo } = github.context.repo;

  const { data } = await octokit.rest.actions.listWorkflowRunsForRepo({
    owner,
    repo,
    per_page: 10,
    status: 'completed',
  });

  // Get unique workflow names with their latest run
  const seen = new Set<string>();
  const runs: WorkflowRun[] = [];

  for (const run of data.workflow_runs) {
    if (seen.has(run.name ?? '')) continue;
    seen.add(run.name ?? '');

    runs.push({
      name: run.name ?? 'Unknown',
      status: run.status ?? 'unknown',
      conclusion: run.conclusion ?? null,
      updatedAt: run.updated_at,
      url: run.html_url,
    });

    if (runs.length >= MAX_CICD_RUNS) break;
  }

  return runs;
}
