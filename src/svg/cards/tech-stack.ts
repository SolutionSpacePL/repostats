import { CollectedData, RepoStatsConfig, ThemeVars } from '../../types';
import { renderCard, escapeXml } from '../template';

const categoryLabels: Record<string, string> = {
  language: 'Languages',
  framework: 'Frameworks',
  database: 'Databases',
  infrastructure: 'Infrastructure',
  ci: 'CI/CD',
  testing: 'Testing',
  tool: 'Tools',
};

const categoryOrder = ['framework', 'language', 'database', 'infrastructure', 'ci', 'testing', 'tool'];

export function renderTechStack(data: CollectedData, config: RepoStatsConfig, theme: ThemeVars): string | null {
  const techs = data.techStack;
  if (!techs || techs.length === 0) return null;

  // Group by category
  const groups = new Map<string, string[]>();
  for (const tech of techs) {
    const list = groups.get(tech.category) ?? [];
    list.push(tech.name);
    groups.set(tech.category, list);
  }

  const parts: string[] = [];
  let y = 0;

  for (const cat of categoryOrder) {
    const items = groups.get(cat);
    if (!items) continue;

    // Category header
    parts.push(`<text class="card-text-secondary" x="0" y="${y + 10}" font-weight="600">${escapeXml(categoryLabels[cat] ?? cat)}</text>`);
    y += 22;

    // Tech badges
    let x = 0;
    const badgeHeight = 24;
    const badgePadding = 8;
    const badgeGap = 6;
    const maxWidth = config.cardWidth - 40;

    for (const name of items) {
      const textWidth = name.length * 7 + badgePadding * 2;

      if (x + textWidth > maxWidth) {
        x = 0;
        y += badgeHeight + badgeGap;
      }

      parts.push(`
        <rect x="${x}" y="${y}" width="${textWidth}" height="${badgeHeight}" rx="4" fill="${theme.border}" />
        <text x="${x + badgePadding}" y="${y + 16}" font-family="'Segoe UI', Ubuntu, 'Helvetica Neue', sans-serif" font-size="11" fill="${theme.text}">${escapeXml(name)}</text>
      `);

      x += textWidth + badgeGap;
    }

    y += badgeHeight + 12;
  }

  return renderCard({
    title: 'Tech Stack',
    width: config.cardWidth,
    height: y + 4,
    body: parts.join(''),
    theme,
  });
}
