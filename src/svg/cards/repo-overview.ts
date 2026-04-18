import { CollectedData, RepoStatsConfig, ThemeVars } from '../../types';
import { renderCard, escapeXml } from '../template';
import { formatNumber, formatAge } from '../../utils/format';

export function renderRepoOverview(data: CollectedData, config: RepoStatsConfig, theme: ThemeVars): string | null {
  const meta = data.repoMeta;
  if (!meta) return null;

  const metrics = [
    { icon: '\u{1F4C5}', label: 'Age', value: formatAge(meta.ageInDays) },
    { icon: '\u{1F4DD}', label: 'Commits', value: formatNumber(meta.totalCommits) },
    { icon: '\u2B50', label: 'Stars', value: formatNumber(meta.stars) },
    { icon: '\u{1F500}', label: 'Forks', value: formatNumber(meta.forks) },
    { icon: '\u{1F7E2}', label: 'Issues', value: formatNumber(meta.openIssues) },
    { icon: '\u{1F504}', label: 'PRs', value: formatNumber(meta.openPRs) },
  ];

  const colWidth = (config.cardWidth - 40) / 3;
  const rowHeight = 50;
  const parts: string[] = [];

  for (let i = 0; i < metrics.length; i++) {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const x = col * colWidth;
    const y = row * rowHeight;
    const m = metrics[i];

    parts.push(`
      <g transform="translate(${x}, ${y})">
        <text class="card-text-secondary" x="0" y="0">${m.icon} ${escapeXml(m.label)}</text>
        <text class="card-text" x="0" y="20" font-size="18" font-weight="700" fill="${theme.text}">${escapeXml(m.value)}</text>
      </g>
    `);
  }

  return renderCard({
    title: 'Repository Overview',
    width: config.cardWidth,
    height: 110,
    body: parts.join(''),
    theme,
  });
}
