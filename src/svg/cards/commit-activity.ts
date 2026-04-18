import { CollectedData, RepoStatsConfig, ThemeVars } from '../../types';
import { renderCard } from '../template';
import { barChart } from '../charts';

export function renderCommitActivity(data: CollectedData, config: RepoStatsConfig, theme: ThemeVars): string | null {
  const weeks = data.commitActivity;
  if (!weeks || weeks.length === 0) return null;

  const chartWidth = config.cardWidth - 40;
  const chartHeight = 80;
  const values = weeks.map(w => w.total);
  const totalCommits = values.reduce((a, b) => a + b, 0);
  const avgPerWeek = Math.round(totalCommits / values.length);

  const chart = barChart(values, chartWidth, chartHeight, theme.accent);

  const body = `
    <text class="card-text-secondary" x="0" y="0">Last ${values.length} weeks \u2022 ${totalCommits} commits \u2022 ~${avgPerWeek}/week</text>
    <g transform="translate(0, 16)">
      ${chart}
    </g>
  `;

  return renderCard({
    title: 'Commit Activity',
    width: config.cardWidth,
    height: chartHeight + 30,
    body,
    theme,
  });
}
