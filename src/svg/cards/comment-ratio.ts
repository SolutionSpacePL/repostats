import { CollectedData, RepoStatsConfig, ThemeVars } from '../../types';
import { renderCard, escapeXml } from '../template';
import { gaugeArc } from '../charts';

export function renderCommentRatio(data: CollectedData, config: RepoStatsConfig, theme: ThemeVars): string | null {
  const ratio = data.commentRatio;
  if (!ratio) return null;

  const gaugeSize = 100;
  const gaugeX = (config.cardWidth - 40) / 2 - gaugeSize / 2;
  const percentage = Math.round(ratio.ratio * 100);

  const color = ratio.ratio >= 0.2 ? theme.barColors[1] : ratio.ratio >= 0.1 ? theme.barColors[2] : theme.barColors[3];
  const gauge = gaugeArc(ratio.ratio, gaugeSize, color, theme.border, 10);

  const body = `
    <g transform="translate(${gaugeX}, 0)">
      ${gauge}
      <text x="${gaugeSize / 2}" y="${gaugeSize / 2 + 5}" text-anchor="middle" font-family="'Segoe UI', Ubuntu, 'Helvetica Neue', sans-serif" font-size="22" font-weight="700" fill="${theme.text}">${percentage}%</text>
      <text x="${gaugeSize / 2}" y="${gaugeSize / 2 + 22}" text-anchor="middle" font-family="'Segoe UI', Ubuntu, 'Helvetica Neue', sans-serif" font-size="10" fill="${theme.textSecondary}">${escapeXml(ratio.label)}</text>
    </g>
    <g transform="translate(0, ${gaugeSize + 8})">
      <text class="card-text-secondary" x="${(config.cardWidth - 40) / 2}" y="0" text-anchor="middle">Code: ${formatNumber(ratio.totalCode)} \u2022 Comments: ${formatNumber(ratio.totalComments)}</text>
    </g>
  `;

  return renderCard({
    title: 'Comment Ratio',
    width: config.cardWidth,
    height: gaugeSize + 24,
    body,
    theme,
  });
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}
