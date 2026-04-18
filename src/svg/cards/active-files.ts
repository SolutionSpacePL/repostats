import { CollectedData, RepoStatsConfig, ThemeVars } from '../../types';
import { renderCard, escapeXml } from '../template';

export function renderActiveFiles(data: CollectedData, config: RepoStatsConfig, theme: ThemeVars): string | null {
  const files = data.activeFiles;
  if (!files || files.length === 0) return null;

  const maxChanges = Math.max(...files.map(f => f.changes));
  const barMaxWidth = 120;
  const rowHeight = 22;
  const parts: string[] = [];

  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const y = i * rowHeight;
    const barWidth = (f.changes / maxChanges) * barMaxWidth;

    // Truncate long file paths
    const displayPath = f.path.length > 40
      ? '...' + f.path.slice(f.path.length - 37)
      : f.path;

    parts.push(`
      <g transform="translate(0, ${y})">
        <text class="card-text-secondary" x="0" y="12" font-size="11">${escapeXml(displayPath)}</text>
        <rect x="${config.cardWidth - 40 - barMaxWidth - 40}" y="2" width="${barWidth}" height="14" rx="3" fill="${theme.accent}" opacity="0.6" />
        <text class="card-text-secondary" x="${config.cardWidth - 45}" y="13" text-anchor="end" font-size="11">${f.changes}</text>
      </g>
    `);
  }

  return renderCard({
    title: 'Most Active Files',
    width: config.cardWidth,
    height: files.length * rowHeight + 4,
    body: parts.join(''),
    theme,
  });
}
