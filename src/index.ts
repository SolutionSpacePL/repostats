import * as core from '@actions/core';
import * as exec from '@actions/exec';
import * as fs from 'fs';
import { loadConfig } from './config';
import { resolveTheme } from './svg/themes';
import { updateReadme } from './readme/updater';
import { collectAll } from './collectors';
import { renderAllCards } from './svg';
import { CardType, RepoStatsConfig } from './types';

async function run(): Promise<void> {
  try {
    // 1. Load config
    const config = loadConfig();
    const theme = resolveTheme(config.theme, config.customTheme);
    core.info(`RepoStats starting with theme "${config.theme}" and ${config.cards.length} cards`);

    // 2. Collect data
    core.startGroup('Collecting repository data');
    const data = await collectAll(config);
    core.endGroup();

    // 3. Render SVG cards
    core.startGroup('Rendering SVG cards');
    const rendered = renderAllCards(data, config, theme);
    core.endGroup();

    // 4. Write SVGs to output directory
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }

    const generatedCards: CardType[] = [];
    for (const [cardType, svg] of rendered) {
      const filePath = `${config.outputDir}/${cardType}.svg`;
      fs.writeFileSync(filePath, svg, 'utf-8');
      core.info(`  Written ${filePath}`);
      generatedCards.push(cardType);
    }

    if (generatedCards.length === 0) {
      core.warning('No cards were generated. Check your configuration.');
      return;
    }

    // 5. Update README
    core.startGroup('Updating README');
    updateReadme(config, generatedCards);
    core.endGroup();

    // 6. Commit and push
    core.startGroup('Committing changes');
    await commitAndPush(config);
    core.endGroup();

    core.info(`RepoStats completed: ${generatedCards.length} cards generated.`);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    } else {
      core.setFailed('An unexpected error occurred');
    }
  }
}

async function commitAndPush(config: RepoStatsConfig): Promise<void> {
  await exec.exec('git', ['config', 'user.name', config.commitName]);
  await exec.exec('git', ['config', 'user.email', config.commitEmail]);
  await exec.exec('git', ['add', config.outputDir, config.readmePath]);

  const exitCode = await exec.exec('git', ['diff', '--cached', '--quiet'], {
    ignoreReturnCode: true,
  });

  if (exitCode !== 0) {
    await exec.exec('git', ['commit', '-m', config.commitMessage]);
    await exec.exec('git', ['push']);
    core.info('Changes committed and pushed.');
  } else {
    core.info('No changes to commit.');
  }
}

run();
