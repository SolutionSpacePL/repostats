import { CollectedData, RepoStatsConfig, ThemeVars } from '../../types';
import { renderCard, escapeXml } from '../template';

export function renderCicdStatus(data: CollectedData, config: RepoStatsConfig, theme: ThemeVars): string | null {
  const runs = data.cicdStatus;
  if (!runs || runs.length === 0) return null;

  const rowHeight = 28;
  const parts: string[] = [];

  for (let i = 0; i < runs.length; i++) {
    const run = runs[i];
    const y = i * rowHeight;
    const icon = getStatusIcon(run.conclusion);
    const color = getStatusColor(run.conclusion);
    const timeAgo = formatTimeAgo(run.updatedAt);

    parts.push(`
      <g transform="translate(0, ${y})">
        <circle cx="6" cy="8" r="5" fill="${color}" />
        <text class="card-text" x="18" y="12">${icon} ${escapeXml(run.name)}</text>
        <text class="card-text-secondary" x="${config.cardWidth - 50}" y="12" text-anchor="end">${timeAgo}</text>
      </g>
    `);
  }

  return renderCard({
    title: 'CI/CD Status',
    width: config.cardWidth,
    height: runs.length * rowHeight + 4,
    body: parts.join(''),
    theme,
  });
}

function getStatusIcon(conclusion: string | null): string {
  switch (conclusion) {
    case 'success': return '\u2713';
    case 'failure': return '\u2717';
    case 'cancelled': return '\u25CB';
    case 'skipped': return '\u2192';
    default: return '\u25CF';
  }
}

function getStatusColor(conclusion: string | null): string {
  switch (conclusion) {
    case 'success': return '#3fb950';
    case 'failure': return '#f85149';
    case 'cancelled': return '#8b949e';
    case 'skipped': return '#8b949e';
    default: return '#d29922';
  }
}

function formatTimeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 30)}mo ago`;
}
