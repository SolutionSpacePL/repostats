import { escapeXml } from './template';

// Horizontal stacked bar chart
export function stackedBar(
  segments: { label: string; value: number; color: string }[],
  width: number,
  height: number = 12,
  borderRadius: number = 4
): string {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return '';

  let x = 0;
  const rects: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const w = (segments[i].value / total) * width;
    if (w < 0.5) continue;

    let rx = 0;
    if (i === 0 || i === segments.length - 1) rx = borderRadius;

    // For first and last segments, add rounded corners
    if (segments.length === 1) {
      rects.push(`<rect x="${x}" y="0" width="${w}" height="${height}" rx="${rx}" fill="${segments[i].color}" />`);
    } else if (i === 0) {
      rects.push(`<rect x="${x}" y="0" width="${w + rx}" height="${height}" rx="${rx}" fill="${segments[i].color}" />`);
      rects.push(`<rect x="${x + w - 1}" y="0" width="${rx + 1}" height="${height}" fill="${segments[i].color}" />`);
    } else if (i === segments.length - 1) {
      rects.push(`<rect x="${x - rx}" y="0" width="${w + rx}" height="${height}" rx="${rx}" fill="${segments[i].color}" />`);
      rects.push(`<rect x="${x}" y="0" width="${rx}" height="${height}" fill="${segments[i].color}" />`);
    } else {
      rects.push(`<rect x="${x}" y="0" width="${w}" height="${height}" fill="${segments[i].color}" />`);
    }
    x += w;
  }

  return `<g>${rects.join('\n')}</g>`;
}

// Simple bar chart (vertical bars)
export function barChart(
  values: number[],
  width: number,
  height: number,
  color: string,
  gap: number = 2
): string {
  if (values.length === 0) return '';
  const max = Math.max(...values, 1);
  const barWidth = Math.max(1, (width - gap * (values.length - 1)) / values.length);
  const bars: string[] = [];

  for (let i = 0; i < values.length; i++) {
    const barHeight = Math.max(1, (values[i] / max) * height);
    const x = i * (barWidth + gap);
    const y = height - barHeight;
    bars.push(`<rect x="${x}" y="${y}" width="${barWidth}" height="${barHeight}" rx="1" fill="${color}" opacity="${0.4 + 0.6 * (values[i] / max)}" />`);
  }

  return `<g>${bars.join('\n')}</g>`;
}

// Sparkline (polyline)
export function sparkline(
  values: number[],
  width: number,
  height: number,
  color: string,
  strokeWidth: number = 2
): string {
  if (values.length < 2) return '';
  const max = Math.max(...values, 1);
  const stepX = width / (values.length - 1);
  const points = values
    .map((v, i) => `${i * stepX},${height - (v / max) * height}`)
    .join(' ');

  return `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />`;
}

// Donut/arc chart
export function donutChart(
  segments: { label: string; value: number; color: string }[],
  size: number,
  thickness: number = 8
): string {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total === 0) return '';

  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - thickness) / 2;
  let startAngle = -90; // Start from top

  const paths: string[] = [];

  for (const seg of segments) {
    const angle = (seg.value / total) * 360;
    if (angle < 0.5) continue;

    const endAngle = startAngle + angle;
    const largeArc = angle > 180 ? 1 : 0;

    const x1 = cx + radius * Math.cos((startAngle * Math.PI) / 180);
    const y1 = cy + radius * Math.sin((startAngle * Math.PI) / 180);
    const x2 = cx + radius * Math.cos((endAngle * Math.PI) / 180);
    const y2 = cy + radius * Math.sin((endAngle * Math.PI) / 180);

    paths.push(
      `<path d="M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}" fill="none" stroke="${seg.color}" stroke-width="${thickness}" stroke-linecap="round" />`
    );

    startAngle = endAngle;
  }

  return `<g>${paths.join('\n')}</g>`;
}

// Gauge arc (for comment ratio)
export function gaugeArc(
  value: number, // 0-1
  size: number,
  color: string,
  bgColor: string,
  thickness: number = 10
): string {
  const cx = size / 2;
  const cy = size / 2;
  const radius = (size - thickness) / 2;

  // Arc from -135 to 135 degrees (270 degree sweep)
  const startAngle = -225;
  const totalSweep = 270;
  const valueAngle = startAngle + totalSweep * Math.min(1, Math.max(0, value));

  const toRad = (deg: number) => (deg * Math.PI) / 180;

  // Background arc
  const bgX1 = cx + radius * Math.cos(toRad(startAngle));
  const bgY1 = cy + radius * Math.sin(toRad(startAngle));
  const bgX2 = cx + radius * Math.cos(toRad(startAngle + totalSweep));
  const bgY2 = cy + radius * Math.sin(toRad(startAngle + totalSweep));

  // Value arc
  const vX1 = bgX1;
  const vY1 = bgY1;
  const vX2 = cx + radius * Math.cos(toRad(valueAngle));
  const vY2 = cy + radius * Math.sin(toRad(valueAngle));
  const valueSweep = totalSweep * value;
  const largeArc = valueSweep > 180 ? 1 : 0;

  return `<g>
    <path d="M ${bgX1} ${bgY1} A ${radius} ${radius} 0 1 1 ${bgX2} ${bgY2}" fill="none" stroke="${bgColor}" stroke-width="${thickness}" stroke-linecap="round" />
    <path d="M ${vX1} ${vY1} A ${radius} ${radius} 0 ${largeArc} 1 ${vX2} ${vY2}" fill="none" stroke="${color}" stroke-width="${thickness}" stroke-linecap="round" />
  </g>`;
}

// Legend with colored dots
export function legend(
  items: { label: string; value: string; color: string }[],
  textColor: string,
  secondaryColor: string,
  startY: number = 0,
  columns: number = 2,
  colWidth: number = 200
): string {
  const lineHeight = 20;
  const parts: string[] = [];

  for (let i = 0; i < items.length; i++) {
    const col = i % columns;
    const row = Math.floor(i / columns);
    const x = col * colWidth;
    const y = startY + row * lineHeight;

    parts.push(`<circle cx="${x + 5}" cy="${y + 5}" r="5" fill="${items[i].color}" />`);
    parts.push(`<text x="${x + 16}" y="${y + 9}" font-family="'Segoe UI', Ubuntu, 'Helvetica Neue', sans-serif" font-size="11" fill="${textColor}">${escapeXml(items[i].label)}</text>`);
    parts.push(`<text x="${x + 16}" y="${y + 9}" font-family="'Segoe UI', Ubuntu, 'Helvetica Neue', sans-serif" font-size="11" fill="${secondaryColor}" text-anchor="end" dx="${colWidth - 30}">${escapeXml(items[i].value)}</text>`);
  }

  return `<g>${parts.join('\n')}</g>`;
}

// Contribution heatmap grid (GitHub-style)
export function heatmapGrid(
  weeks: number[][], // 52 weeks x 7 days
  cellSize: number,
  gap: number,
  colors: string[], // gradient from low to high (5 levels)
  emptyColor: string
): string {
  const cells: string[] = [];
  const allValues = weeks.flat();
  const max = Math.max(...allValues, 1);

  for (let w = 0; w < weeks.length; w++) {
    for (let d = 0; d < weeks[w].length; d++) {
      const x = w * (cellSize + gap);
      const y = d * (cellSize + gap);
      const value = weeks[w][d];
      const level = value === 0 ? 0 : Math.min(colors.length - 1, Math.ceil((value / max) * (colors.length - 1)));
      const color = value === 0 ? emptyColor : colors[level];
      cells.push(`<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="2" fill="${color}" />`);
    }
  }

  return `<g>${cells.join('\n')}</g>`;
}
