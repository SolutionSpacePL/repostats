import { CollectedData, RepoStatsConfig, ThemeVars } from '../../types';
import { renderCard, escapeXml } from '../template';
import { stackedBar, legend } from '../charts';

export function renderLanguageBreakdown(data: CollectedData, config: RepoStatsConfig, theme: ThemeVars): string | null {
  const languages = data.languages;
  if (!languages || languages.length === 0) return null;

  const chartWidth = config.cardWidth - 40;

  // Stacked bar
  const barSegments = languages.map(l => ({
    label: l.language,
    value: l.lines,
    color: l.color,
  }));
  const bar = stackedBar(barSegments, chartWidth);

  // Legend items
  const legendItems = languages.map(l => ({
    label: l.language,
    value: `${l.percentage.toFixed(1)}%`,
    color: l.color,
  }));

  const legendRows = Math.ceil(legendItems.length / 2);
  const legendHeight = legendRows * 20;

  const legendSvg = legend(legendItems, theme.text, theme.textSecondary, 0, 2, chartWidth / 2);

  const body = `
    <g transform="translate(0, 0)">
      ${bar}
    </g>
    <g transform="translate(0, 24)">
      ${legendSvg}
    </g>
  `;

  return renderCard({
    title: 'Languages',
    width: config.cardWidth,
    height: 24 + legendHeight + 10,
    body,
    theme,
  });
}
