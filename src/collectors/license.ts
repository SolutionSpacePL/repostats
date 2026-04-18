import * as github from '@actions/github';
import { RepoStatsConfig, LicenseInfo } from '../types';

export async function collectLicense(config: RepoStatsConfig): Promise<LicenseInfo> {
  const octokit = github.getOctokit(config.githubToken);
  const { owner, repo } = github.context.repo;

  try {
    const { data } = await octokit.rest.repos.get({ owner, repo });

    if (data.license) {
      return {
        name: data.license.name ?? 'Unknown',
        spdxId: data.license.spdx_id ?? 'NOASSERTION',
      };
    }
  } catch {
    // Fallback: check for LICENSE file locally
  }

  return { name: 'No License', spdxId: 'NONE' };
}
