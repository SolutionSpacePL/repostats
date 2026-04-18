import * as core from '@actions/core';
import { CollectedData, RepoStatsConfig } from '../types';
import { collectLoc } from './loc';
import { collectLanguages } from './languages';
import { collectFileStats } from './files';
import { collectCommentRatio } from './comments';
import { collectTechStack } from './techstack';
import { collectCommitActivity } from './commits';
import { collectContributors } from './contributors';
import { collectCicdStatus } from './cicd';
import { collectLicense } from './license';
import { collectRepoMeta } from './repo-meta';
import { collectActiveFiles } from './activity';
import { walkFiles, FileVisitor } from '../utils/fs';

export async function collectAll(config: RepoStatsConfig): Promise<CollectedData> {
  const data: CollectedData = {};

  // File-based collectors share a single walk
  const needsFileWalk = config.cards.some(c =>
    ['loc-summary', 'language-breakdown', 'file-stats', 'comment-ratio'].includes(c)
  );

  if (needsFileWalk) {
    core.info('Walking file tree...');
    const visitors: FileVisitor[] = [];

    if (config.cards.includes('loc-summary')) {
      const v = collectLoc.createVisitor();
      visitors.push(v);
    }
    if (config.cards.includes('language-breakdown')) {
      const v = collectLanguages.createVisitor();
      visitors.push(v);
    }
    if (config.cards.includes('file-stats') || config.cards.includes('comment-ratio')) {
      const v = collectFileStats.createVisitor();
      visitors.push(v);
    }

    await walkFiles(process.cwd(), config.exclude, config.maxFiles, visitors);

    if (config.cards.includes('loc-summary')) {
      data.loc = collectLoc.finalize();
    }
    if (config.cards.includes('language-breakdown')) {
      data.languages = collectLanguages.finalize();
    }
    if (config.cards.includes('file-stats')) {
      data.fileStats = collectFileStats.finalizeFileStats();
    }
    if (config.cards.includes('comment-ratio')) {
      data.commentRatio = collectFileStats.finalizeCommentRatio();
    }
    core.info('File walk complete.');
  }

  // API-based collectors run in parallel
  const apiCollectors: Promise<void>[] = [];

  const wrapCollector = async (name: string, fn: () => Promise<void>): Promise<void> => {
    try {
      await fn();
    } catch (err) {
      core.warning(`Collector "${name}" failed: ${err}`);
    }
  };

  if (config.cards.includes('commit-activity')) {
    apiCollectors.push(wrapCollector('commit-activity', async () => {
      data.commitActivity = await collectCommitActivity(config);
    }));
  }
  if (config.cards.includes('contributors')) {
    apiCollectors.push(wrapCollector('contributors', async () => {
      data.contributors = await collectContributors(config);
    }));
  }
  if (config.cards.includes('cicd-status')) {
    apiCollectors.push(wrapCollector('cicd-status', async () => {
      data.cicdStatus = await collectCicdStatus(config);
    }));
  }
  if (config.cards.includes('license')) {
    apiCollectors.push(wrapCollector('license', async () => {
      data.license = await collectLicense(config);
    }));
  }
  if (config.cards.includes('repo-overview')) {
    apiCollectors.push(wrapCollector('repo-overview', async () => {
      data.repoMeta = await collectRepoMeta(config);
    }));
  }
  if (config.cards.includes('active-files')) {
    apiCollectors.push(wrapCollector('active-files', async () => {
      data.activeFiles = await collectActiveFiles();
    }));
  }

  // Tech stack doesn't need the file walker — it reads specific manifest files
  if (config.cards.includes('tech-stack')) {
    apiCollectors.push(wrapCollector('tech-stack', async () => {
      data.techStack = await collectTechStack();
    }));
  }

  await Promise.all(apiCollectors);

  return data;
}
