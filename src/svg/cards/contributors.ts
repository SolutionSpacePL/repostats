import { CollectedData, RepoStatsConfig, ThemeVars } from '../../types';
import { renderCard, escapeXml } from '../template';

export function renderContributors(data: CollectedData, config: RepoStatsConfig, theme: ThemeVars): string | null {
  const contributors = data.contributors;
  if (!contributors || contributors.length === 0) return null;

  const rowHeight = 32;
  const maxShow = Math.min(contributors.length, 8);
  const parts: string[] = [];

  for (let i = 0; i < maxShow; i++) {
    const c = contributors[i];
    const y = i * rowHeight;

    // Avatar as clipped circle
    const clipId = `avatar-clip-${i}`;
    parts.push(`
      <defs>
        <clipPath id="${clipId}">
          <circle cx="12" cy="${y + 12}" r="12" />
        </clipPath>
      </defs>
      <image href="${escapeXml(c.avatarUrl)}&s=48" x="0" y="${y}" width="24" height="24" clip-path="url(#${clipId})" />
      <text class="card-text" x="32" y="${y + 16}">${escapeXml(c.login)}</text>
      <text class="card-text-secondary" x="${config.cardWidth - 50}" y="${y + 16}" text-anchor="end">${c.contributions} commits</text>
    `);
  }

  return renderCard({
    title: 'Top Contributors',
    width: config.cardWidth,
    height: maxShow * rowHeight + 4,
    body: parts.join(''),
    theme,
  });
}
