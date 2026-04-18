import { FileInfo, FileVisitor } from '../utils/fs';
import { getLangInfo } from '../utils/lang-map';
import { countLines } from '../utils/comments';
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

      const counts = countLines(file.lines, lang);

      result.total += counts.code + counts.comments + counts.blanks;
      result.code += counts.code;
      result.comments += counts.comments;
      result.blanks += counts.blanks;
      result.byLanguage[langName].code += counts.code;
      result.byLanguage[langName].comments += counts.comments;
      result.byLanguage[langName].blanks += counts.blanks;
    },
  };
}

function finalize(): LocResult {
  return result;
}

export const collectLoc = { createVisitor, finalize };
