import * as fs from 'fs';
import * as path from 'path';
import * as core from '@actions/core';

export interface FileInfo {
  path: string;
  relativePath: string;
  extension: string;
  lines: string[];
  lineCount: number;
}

export interface FileVisitor {
  visit(file: FileInfo): void;
}

const BINARY_EXTENSIONS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.ico', '.svg', '.webp', '.avif',
  '.mp3', '.mp4', '.avi', '.mov', '.mkv', '.flac', '.wav', '.ogg',
  '.zip', '.tar', '.gz', '.bz2', '.7z', '.rar', '.xz',
  '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
  '.exe', '.dll', '.so', '.dylib', '.bin', '.dat',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.pyc', '.pyo', '.class', '.o', '.obj',
  '.sqlite', '.db',
]);

interface CompiledExcludes {
  literals: Set<string>;
  globs: RegExp[];
}

function compileExcludes(patterns: string[]): CompiledExcludes {
  const literals = new Set<string>();
  const globs: RegExp[] = [];
  for (const p of patterns) {
    if (p.includes('*')) {
      globs.push(new RegExp('^' + p.replace(/\*/g, '.*') + '$'));
    } else {
      literals.add(p);
    }
  }
  return { literals, globs };
}

export async function walkFiles(
  rootDir: string,
  excludePatterns: string[],
  maxFiles: number,
  visitors: FileVisitor[]
): Promise<void> {
  let fileCount = 0;
  const excludes = compileExcludes(excludePatterns);

  async function walk(dir: string): Promise<void> {
    if (fileCount >= maxFiles) return;

    let entries: fs.Dirent[];
    try {
      entries = await fs.promises.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (fileCount >= maxFiles) return;

      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(rootDir, fullPath);

      if (shouldExclude(relativePath, entry.name, excludes)) continue;

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (BINARY_EXTENSIONS.has(ext)) continue;

        try {
          const content = await fs.promises.readFile(fullPath, 'utf-8');
          const lines = content.split('\n');
          const fileInfo: FileInfo = {
            path: fullPath,
            relativePath,
            extension: ext,
            lines,
            lineCount: lines.length,
          };

          for (const visitor of visitors) {
            visitor.visit(fileInfo);
          }

          fileCount++;
        } catch {
          // Skip unreadable files
        }
      }
    }
  }

  await walk(rootDir);
  core.info(`Walked ${fileCount} files.`);
}

function shouldExclude(relativePath: string, name: string, excludes: CompiledExcludes): boolean {
  if (excludes.literals.has(name)) return true;

  const segments = relativePath.split(path.sep);
  for (const seg of segments) {
    if (excludes.literals.has(seg)) return true;
  }

  for (const regex of excludes.globs) {
    if (regex.test(relativePath) || segments.some(s => regex.test(s))) return true;
  }

  return false;
}
