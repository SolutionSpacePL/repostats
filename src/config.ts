import * as core from '@actions/core';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { CardType, CARD_TYPES, RepoStatsConfig, ThemeVars } from './types';

const DEFAULTS: RepoStatsConfig = {
  cards: [...CARD_TYPES],
  theme: 'dark',
  outputDir: '.repostats',
  readmePath: 'README.md',
  exclude: ['node_modules', 'vendor', '.git', 'dist', 'build', 'package-lock.json', '.repostats'],
  maxFiles: 50000,
  cardWidth: 495,
  columns: 2,
  commitName: 'repostats[bot]',
  commitEmail: 'repostats[bot]@users.noreply.github.com',
  commitMessage: 'docs: update repository statistics [skip ci]',
  githubToken: '',
};

interface YamlConfig {
  cards?: string[] | string;
  theme?: string;
  custom_theme?: Partial<ThemeVars>;
  output_dir?: string;
  readme_path?: string;
  exclude?: string[];
  max_files?: number;
  card_width?: number;
  columns?: number;
  commit_name?: string;
  commit_email?: string;
  commit_message?: string;
}

export function loadConfig(): RepoStatsConfig {
  const config = { ...DEFAULTS };

  // Read action inputs
  config.githubToken = core.getInput('github_token');
  const cardsInput = core.getInput('cards');
  const themeInput = core.getInput('theme');
  const outputDir = core.getInput('output_dir');
  const readmePath = core.getInput('readme_path');
  const excludeInput = core.getInput('exclude');
  const maxFiles = core.getInput('max_files');
  const columns = core.getInput('columns');
  const configFile = core.getInput('config_file') || '.repostats.yml';

  // Read YAML config if it exists
  if (fs.existsSync(configFile)) {
    try {
      const yamlContent = fs.readFileSync(configFile, 'utf-8');
      const yamlConfig = yaml.load(yamlContent) as YamlConfig | null;
      if (yamlConfig) {
        applyYamlConfig(config, yamlConfig);
      }
    } catch (err) {
      core.warning(`Failed to parse ${configFile}: ${err}`);
    }
  }

  // Action inputs override YAML config
  if (cardsInput && cardsInput !== 'all') {
    config.cards = parseCards(cardsInput);
  }
  if (themeInput) config.theme = themeInput;
  if (outputDir) config.outputDir = outputDir;
  if (readmePath) config.readmePath = readmePath;
  if (excludeInput) config.exclude = excludeInput.split(',').map(s => s.trim());
  if (maxFiles) config.maxFiles = parseInt(maxFiles, 10) || DEFAULTS.maxFiles;
  if (columns) config.columns = (parseInt(columns, 10) === 1 ? 1 : 2);

  return config;
}

function applyYamlConfig(config: RepoStatsConfig, yml: YamlConfig): void {
  if (yml.cards) {
    const cardsStr = Array.isArray(yml.cards) ? yml.cards.join(',') : yml.cards;
    config.cards = parseCards(cardsStr);
  }
  if (yml.theme) config.theme = yml.theme;
  if (yml.custom_theme) config.customTheme = yml.custom_theme;
  if (yml.output_dir) config.outputDir = yml.output_dir;
  if (yml.readme_path) config.readmePath = yml.readme_path;
  if (yml.exclude) config.exclude = yml.exclude;
  if (yml.max_files) config.maxFiles = yml.max_files;
  if (yml.card_width) config.cardWidth = yml.card_width;
  if (yml.columns) config.columns = yml.columns === 1 ? 1 : 2;
  if (yml.commit_name) config.commitName = yml.commit_name;
  if (yml.commit_email) config.commitEmail = yml.commit_email;
  if (yml.commit_message) config.commitMessage = yml.commit_message;
}

function parseCards(input: string): CardType[] {
  if (input === 'all') return [...CARD_TYPES];
  return input
    .split(',')
    .map(s => s.trim() as CardType)
    .filter(c => CARD_TYPES.includes(c));
}
