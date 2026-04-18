import { FileInfo, FileVisitor } from '../utils/fs';
import { FileStatsResult, CommentRatioResult } from '../types';
import { getLangInfo } from '../utils/lang-map';

const fileLengths: number[] = [];
const extensionCounts = new Map<string, number>();
const largestFiles: { path: string; lines: number }[] = [];
let totalDirs = 0;
let totalCode = 0;
let totalComments = 0;
const seenDirs = new Set<string>();

function createVisitor(): FileVisitor {
  fileLengths.length = 0;
  extensionCounts.clear();
  largestFiles.length = 0;
  totalDirs = 0;
  totalCode = 0;
  totalComments = 0;
  seenDirs.clear();

  return {
    visit(file: FileInfo): void {
      fileLengths.push(file.lineCount);

      // Track extensions
      const ext = file.extension || '(no ext)';
      extensionCounts.set(ext, (extensionCounts.get(ext) ?? 0) + 1);

      // Track largest files (keep top 10)
      largestFiles.push({ path: file.relativePath, lines: file.lineCount });
      if (largestFiles.length > 20) {
        largestFiles.sort((a, b) => b.lines - a.lines);
        largestFiles.length = 10;
      }

      // Track directories
      const dir = file.relativePath.split('/').slice(0, -1).join('/');
      if (dir && !seenDirs.has(dir)) {
        seenDirs.add(dir);
      }

      // Count code vs comments for ratio
      const lang = getLangInfo(file.extension);
      const lineComment = lang?.lineComment;
      const blockStart = lang?.blockCommentStart;
      const blockEnd = lang?.blockCommentEnd;
      let inBlock = false;

      for (const line of file.lines) {
        const trimmed = line.trim();
        if (trimmed === '') continue;

        if (inBlock) {
          totalComments++;
          if (blockEnd && trimmed.includes(blockEnd)) inBlock = false;
          continue;
        }
        if (blockStart && trimmed.startsWith(blockStart)) {
          totalComments++;
          if (blockEnd && !trimmed.includes(blockEnd)) inBlock = true;
          continue;
        }
        if (lineComment && trimmed.startsWith(lineComment)) {
          totalComments++;
          continue;
        }
        totalCode++;
      }
    },
  };
}

function finalizeFileStats(): FileStatsResult {
  fileLengths.sort((a, b) => a - b);
  largestFiles.sort((a, b) => b.lines - a.lines);
  largestFiles.length = Math.min(largestFiles.length, 10);

  const totalFiles = fileLengths.length;
  const avgFileLength = totalFiles > 0
    ? Math.round(fileLengths.reduce((a, b) => a + b, 0) / totalFiles)
    : 0;
  const medianFileLength = totalFiles > 0
    ? fileLengths[Math.floor(totalFiles / 2)]
    : 0;

  const byExtension: Record<string, number> = {};
  for (const [ext, count] of extensionCounts) {
    byExtension[ext] = count;
  }

  return {
    totalFiles,
    totalDirs: seenDirs.size,
    avgFileLength,
    medianFileLength,
    byExtension,
    largestFiles,
  };
}

function finalizeCommentRatio(): CommentRatioResult {
  const total = totalCode + totalComments;
  const ratio = total > 0 ? totalComments / total : 0;
  let label: string;
  if (ratio >= 0.20) label = 'Well Documented';
  else if (ratio >= 0.10) label = 'Moderate';
  else label = 'Sparse';

  return {
    ratio,
    totalCode,
    totalComments,
    label,
  };
}

export const collectFileStats = { createVisitor, finalizeFileStats, finalizeCommentRatio };
