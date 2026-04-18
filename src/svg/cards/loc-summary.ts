import { CollectedData, RepoStatsConfig, ThemeVars } from '../../types';
import { renderCard } from '../template';
import { stackedBar } from '../charts';
import { formatNumber } from '../../utils/format';

function pct(part: number, total: number): string {
  if (total === 0) return '0%';
  return `${Math.round((part / total) * 100)}%`;
}

export function renderLocSummary(data: CollectedData, config: RepoStatsConfig, theme: ThemeVars): string | null {
  const loc = data.loc;
  if (!loc) return null;

  const chartWidth = config.cardWidth - 40;
  const segments = [
    { label: 'Code', value: loc.code, color: theme.barColors[0] },
    { label: 'Comments', value: loc.comments, color: theme.barColors[1] },
    { label: 'Blank', value: loc.blanks, color: theme.barColors[2] },
  ];

  const bar = stackedBar(segments, chartWidth);

  const body = `
    <text class="card-text" x="0" y="4" font-size="20" font-weight="700" fill="${theme.text}">${formatNumber(loc.total)}</text>
    <text class="card-text-secondary" x="0" y="22">total lines</text>
    <g transform="translate(0, 36)">
      ${bar}
    </g>
    <g transform="translate(0, 60)">
      <circle cx="5" cy="5" r="4" fill="${theme.barColors[0]}" />
      <text class="card-text-secondary" x="14" y="9">Code ${formatNumber(loc.code)} (${pct(loc.code, loc.total)})</text>
      <circle cx="${chartWidth / 3 + 5}" cy="5" r="4" fill="${theme.barColors[1]}" />
      <text class="card-text-secondary" x="${chartWidth / 3 + 14}" y="9">Comments ${formatNumber(loc.comments)} (${pct(loc.comments, loc.total)})</text>
      <circle cx="${(chartWidth / 3) * 2 + 5}" cy="5" r="4" fill="${theme.barColors[2]}" />
      <text class="card-text-secondary" x="${(chartWidth / 3) * 2 + 14}" y="9">Blank ${formatNumber(loc.blanks)} (${pct(loc.blanks, loc.total)})</text>
    </g>
  `;

  return renderCard({
    title: 'Lines of Code',
    width: config.cardWidth,
    height: 85,
    body,
    theme,
  });
}
