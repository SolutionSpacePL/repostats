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

export async function walkFiles(
  rootDir: string,
  excludePatterns: string[],
  maxFiles: number,
  visitors: FileVisitor[]
): Promise<void> {
  let fileCount = 0;

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

      // Check exclude patterns
      if (shouldExclude(relativePath, entry.name, excludePatterns)) {
        continue;
      }

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();

        // Skip binary files
        if (BINARY_EXTENSIONS.has(ext)) continue;

        // Read file content
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
          // Skip files that can't be read (e.g., binary detected as text)
        }
      }
    }
  }

  await walk(rootDir);
  core.info(`Walked ${fileCount} files.`);
}

function shouldExclude(relativePath: string, name: string, patterns: string[]): boolean {
  // Check if any path segment matches an exclude pattern
  const segments = relativePath.split(path.sep);
  for (const pattern of patterns) {
    if (name === pattern) return true;
    if (segments.includes(pattern)) return true;
    // Simple glob: if pattern has *, do basic wildcard matching
    if (pattern.includes('*')) {
      const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
      if (regex.test(relativePath) || segments.some(s => regex.test(s))) return true;
    }
  }
  return false;
}
