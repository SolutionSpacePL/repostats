import { CardType, CollectedData, RepoStatsConfig, ThemeVars } from '../types';
import { renderRepoOverview } from './cards/repo-overview';
import { renderCommitActivity } from './cards/commit-activity';
import { renderContributors } from './cards/contributors';
import { renderCicdStatus } from './cards/cicd-status';
import { renderLicense } from './cards/license';
import { renderLocSummary } from './cards/loc-summary';
import { renderLanguageBreakdown } from './cards/language-breakdown';
import { renderTechStack } from './cards/tech-stack';
import { renderFileStats } from './cards/file-stats';
import { renderCommentRatio } from './cards/comment-ratio';
import { renderActiveFiles } from './cards/active-files';

type RenderFn = (data: CollectedData, config: RepoStatsConfig, theme: ThemeVars) => string | null;

const renderers: Record<CardType, RenderFn> = {
  'repo-overview': renderRepoOverview,
  'commit-activity': renderCommitActivity,
  'contributors': renderContributors,
  'cicd-status': renderCicdStatus,
  'license': renderLicense,
  'loc-summary': renderLocSummary,
  'language-breakdown': renderLanguageBreakdown,
  'tech-stack': renderTechStack,
  'file-stats': renderFileStats,
  'comment-ratio': renderCommentRatio,
  'active-files': renderActiveFiles,
};

export function renderAllCards(
  data: CollectedData,
  config: RepoStatsConfig,
  theme: ThemeVars
): Map<CardType, string> {
  const results = new Map<CardType, string>();

  for (const cardType of config.cards) {
    const render = renderers[cardType];
    if (!render) continue;

    const svg = render(data, config, theme);
    if (svg) {
      results.set(cardType, svg);
    }
  }

  return results;
}
