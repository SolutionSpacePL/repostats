import { LangInfo } from './lang-map';

export interface LineCounts {
  code: number;
  comments: number;
  blanks: number;
}

export function countLines(lines: string[], lang: LangInfo | undefined): LineCounts {
  const result: LineCounts = { code: 0, comments: 0, blanks: 0 };
  const lineComment = lang?.lineComment;
  const blockStart = lang?.blockCommentStart;
  const blockEnd = lang?.blockCommentEnd;
  let inBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed === '') {
      result.blanks++;
      continue;
    }

    if (inBlock) {
      result.comments++;
      if (blockEnd && trimmed.includes(blockEnd)) inBlock = false;
      continue;
    }

    if (blockStart && trimmed.startsWith(blockStart)) {
      result.comments++;
      if (blockEnd && !trimmed.includes(blockEnd)) inBlock = true;
      continue;
    }

    if (lineComment && trimmed.startsWith(lineComment)) {
      result.comments++;
      continue;
    }

    result.code++;
  }

  return result;
}
