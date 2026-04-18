import * as exec from '@actions/exec';

export async function gitExec(args: string[]): Promise<string> {
  let output = '';
  await exec.exec('git', args, {
    listeners: {
      stdout: (data: Buffer) => {
        output += data.toString();
      },
    },
    silent: true,
  });
  return output.trim();
}

export async function getFirstCommitDate(): Promise<Date> {
  const output = await gitExec(['log', '--reverse', '--format=%aI', '--max-count=1']);
  return new Date(output);
}

export async function getTotalCommitCount(): Promise<number> {
  const output = await gitExec(['rev-list', '--count', 'HEAD']);
  return parseInt(output, 10) || 0;
}

export async function getMostChangedFiles(limit: number = 10): Promise<{ path: string; changes: number }[]> {
  // Get files sorted by number of commits that changed them
  const output = await gitExec([
    'log',
    '--pretty=format:',
    '--name-only',
    '--diff-filter=ACMR',
    '-n', '500',
  ]);

  const IGNORED_PREFIXES = ['dist/', 'build/', 'node_modules/', '.repostats/'];

  const counts = new Map<string, number>();
  for (const line of output.split('\n')) {
    const file = line.trim();
    if (!file) continue;
    if (IGNORED_PREFIXES.some(p => file.startsWith(p))) continue;
    if (file === 'package-lock.json') continue;
    counts.set(file, (counts.get(file) || 0) + 1);
  }

  return Array.from(counts.entries())
    .map(([path, changes]) => ({ path, changes }))
    .sort((a, b) => b.changes - a.changes)
    .slice(0, limit);
}
