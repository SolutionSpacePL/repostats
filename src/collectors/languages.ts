import { FileInfo, FileVisitor } from '../utils/fs';
import { getLanguageName, getLanguageColor } from '../utils/lang-map';
import { LanguageBreakdown } from '../types';

const langData = new Map<string, { files: number; lines: number; color: string }>();

function createVisitor(): FileVisitor {
  langData.clear();

  return {
    visit(file: FileInfo): void {
      if (!file.extension) return;
      const name = getLanguageName(file.extension);
      const color = getLanguageColor(file.extension);

      const existing = langData.get(name) ?? { files: 0, lines: 0, color };
      existing.files++;
      existing.lines += file.lineCount;
      langData.set(name, existing);
    },
  };
}

function finalize(): LanguageBreakdown[] {
  const totalLines = Array.from(langData.values()).reduce((sum, d) => sum + d.lines, 0);
  if (totalLines === 0) return [];

  const languages = Array.from(langData.entries())
    .map(([language, data]) => ({
      language,
      files: data.files,
      lines: data.lines,
      percentage: (data.lines / totalLines) * 100,
      color: data.color,
    }))
    .sort((a, b) => b.lines - a.lines);

  // Group languages below 1% into "Other"
  const threshold = 1;
  const major = languages.filter(l => l.percentage >= threshold);
  const minor = languages.filter(l => l.percentage < threshold);

  if (minor.length > 0) {
    const otherLines = minor.reduce((sum, l) => sum + l.lines, 0);
    const otherFiles = minor.reduce((sum, l) => sum + l.files, 0);
    major.push({
      language: 'Other',
      files: otherFiles,
      lines: otherLines,
      percentage: (otherLines / totalLines) * 100,
      color: '#8b8b8b',
    });
  }

  return major;
}

export const collectLanguages = { createVisitor, finalize };
