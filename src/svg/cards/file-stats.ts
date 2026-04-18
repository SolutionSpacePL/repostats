import { CollectedData, RepoStatsConfig, ThemeVars } from '../../types';
import { renderCard, escapeXml } from '../template';

export function renderFileStats(data: CollectedData, config: RepoStatsConfig, theme: ThemeVars): string | null {
  const stats = data.fileStats;
  if (!stats) return null;

  // Top metrics
  const metrics = [
    { label: 'Total Files', value: formatNumber(stats.totalFiles) },
    { label: 'Directories', value: formatNumber(stats.totalDirs) },
    { label: 'Avg Length', value: `${stats.avgFileLength} lines` },
    { label: 'Median Length', value: `${stats.medianFileLength} lines` },
  ];

  const colWidth = (config.cardWidth - 40) / 2;
  const parts: string[] = [];

  // Metrics grid (2x2)
  for (let i = 0; i < metrics.length; i++) {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = col * colWidth;
    const y = row * 38;
    const m = metrics[i];

    parts.push(`
      <g transform="translate(${x}, ${y})">
        <text class="card-text-secondary" x="0" y="0">${escapeXml(m.label)}</text>
        <text class="card-text" x="0" y="18" font-size="16" font-weight="700" fill="${theme.text}">${escapeXml(m.value)}</text>
      </g>
    `);
  }

  // Top file types (up to 6)
  const topExtensions = Object.entries(stats.byExtension)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6);

  if (topExtensions.length > 0) {
    const typeY = 90;
    parts.push(`<text class="card-text-secondary" x="0" y="${typeY}" font-weight="600">Top File Types</text>`);

    for (let i = 0; i < topExtensions.length; i++) {
      const [ext, count] = topExtensions[i];
      const col = i % 3;
      const row = Math.floor(i / 3);
      const x = col * (colWidth * 2 / 3);
      const y = typeY + 16 + row * 18;

      parts.push(`<text class="card-text-secondary" x="${x}" y="${y}">${escapeXml(ext)} <tspan fill="${theme.text}">${count}</tspan></text>`);
    }
  }

  const extensionRows = Math.ceil(topExtensions.length / 3);
  const totalHeight = 90 + 16 + extensionRows * 18 + 8;

  return renderCard({
    title: 'File Statistics',
    width: config.cardWidth,
    height: totalHeight,
    body: parts.join(''),
    theme,
  });
}

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}
