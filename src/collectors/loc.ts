import { FileInfo, FileVisitor } from '../utils/fs';
import { getLangInfo } from '../utils/lang-map';
import { LocResult } from '../types';

let result: LocResult;

function createVisitor(): FileVisitor {
  result = { total: 0, code: 0, comments: 0, blanks: 0, byLanguage: {} };

  return {
    visit(file: FileInfo): void {
      const lang = getLangInfo(file.extension);
      const langName = lang?.name ?? 'Other';

      if (!result.byLanguage[langName]) {
        result.byLanguage[langName] = { code: 0, comments: 0, blanks: 0 };
      }

      let inBlockComment = false;
      const blockStart = lang?.blockCommentStart;
      const blockEnd = lang?.blockCommentEnd;
      const lineComment = lang?.lineComment;

      for (const line of file.lines) {
        const trimmed = line.trim();
        result.total++;

        if (trimmed === '') {
          result.blanks++;
          result.byLanguage[langName].blanks++;
          continue;
        }

        // Block comment handling
        if (inBlockComment) {
          result.comments++;
          result.byLanguage[langName].comments++;
          if (blockEnd && trimmed.includes(blockEnd)) {
            inBlockComment = false;
          }
          continue;
        }

        if (blockStart && trimmed.startsWith(blockStart)) {
          result.comments++;
          result.byLanguage[langName].comments++;
          if (blockEnd && !trimmed.includes(blockEnd)) {
            inBlockComment = true;
          }
          continue;
        }

        // Line comment
        if (lineComment && trimmed.startsWith(lineComment)) {
          result.comments++;
          result.byLanguage[langName].comments++;
          continue;
        }

        // Code line
        result.code++;
        result.byLanguage[langName].code++;
      }
    },
  };
}

function finalize(): LocResult {
  return result;
}

export const collectLoc = { createVisitor, finalize };
