import { ThemeVars } from '../types';

export const themes: Record<string, ThemeVars> = {
  dark: {
    bg: '#0d1117',
    text: '#c9d1d9',
    textSecondary: '#8b949e',
    accent: '#58a6ff',
    border: '#30363d',
    barColors: ['#58a6ff', '#3fb950', '#d29922', '#f85149', '#bc8cff', '#f778ba', '#79c0ff', '#56d364'],
  },
  light: {
    bg: '#ffffff',
    text: '#24292f',
    textSecondary: '#57606a',
    accent: '#0969da',
    border: '#d0d7de',
    barColors: ['#0969da', '#1a7f37', '#9a6700', '#cf222e', '#8250df', '#bf3989', '#0550ae', '#116329'],
  },
  dimmed: {
    bg: '#22272e',
    text: '#adbac7',
    textSecondary: '#768390',
    accent: '#539bf5',
    border: '#444c56',
    barColors: ['#539bf5', '#57ab5a', '#c69026', '#e5534b', '#b083f0', '#e275ad', '#6cb6ff', '#6bc46d'],
  },
  'high-contrast': {
    bg: '#010409',
    text: '#f0f3f6',
    textSecondary: '#9ea7b3',
    accent: '#71b7ff',
    border: '#7a828e',
    barColors: ['#71b7ff', '#26a148', '#e09b13', '#ff6a69', '#cb7eff', '#ff80c8', '#91cbff', '#2ea043'],
  },
};

export function resolveTheme(name: string, custom?: Partial<ThemeVars>): ThemeVars {
  const base = themes[name] ?? themes.dark;
  if (!custom) return base;
  return {
    ...base,
    ...custom,
    barColors: custom.barColors ?? base.barColors,
  };
}
