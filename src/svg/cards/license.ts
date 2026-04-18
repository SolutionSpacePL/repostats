import { CollectedData, RepoStatsConfig, ThemeVars } from '../../types';
import { renderCard, escapeXml } from '../template';

export function renderLicense(data: CollectedData, config: RepoStatsConfig, theme: ThemeVars): string | null {
  const license = data.license;
  if (!license) return null;

  const body = `
    <text class="card-text" x="0" y="8" font-size="16" font-weight="600" fill="${theme.accent}">${escapeXml(license.spdxId)}</text>
    <text class="card-text-secondary" x="0" y="28">${escapeXml(license.name)}</text>
  `;

  return renderCard({
    title: 'License',
    width: config.cardWidth,
    height: 50,
    body,
    theme,
  });
}
