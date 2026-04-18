export interface LangInfo {
  name: string;
  color: string;
  type: 'code' | 'markup' | 'data' | 'config';
  lineComment?: string;
  blockCommentStart?: string;
  blockCommentEnd?: string;
}

const langMap: Record<string, LangInfo> = {
  '.ts': { name: 'TypeScript', color: '#3178c6', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.tsx': { name: 'TypeScript', color: '#3178c6', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.js': { name: 'JavaScript', color: '#f1e05a', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.jsx': { name: 'JavaScript', color: '#f1e05a', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.mjs': { name: 'JavaScript', color: '#f1e05a', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.cjs': { name: 'JavaScript', color: '#f1e05a', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.py': { name: 'Python', color: '#3572A5', type: 'code', lineComment: '#', blockCommentStart: '"""', blockCommentEnd: '"""' },
  '.go': { name: 'Go', color: '#00ADD8', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.rs': { name: 'Rust', color: '#dea584', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.java': { name: 'Java', color: '#b07219', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.kt': { name: 'Kotlin', color: '#A97BFF', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.swift': { name: 'Swift', color: '#F05138', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.c': { name: 'C', color: '#555555', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.h': { name: 'C', color: '#555555', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.cpp': { name: 'C++', color: '#f34b7d', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.hpp': { name: 'C++', color: '#f34b7d', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.cc': { name: 'C++', color: '#f34b7d', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.cs': { name: 'C#', color: '#178600', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.rb': { name: 'Ruby', color: '#701516', type: 'code', lineComment: '#', blockCommentStart: '=begin', blockCommentEnd: '=end' },
  '.php': { name: 'PHP', color: '#4F5D95', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.scala': { name: 'Scala', color: '#c22d40', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.r': { name: 'R', color: '#198CE7', type: 'code', lineComment: '#' },
  '.R': { name: 'R', color: '#198CE7', type: 'code', lineComment: '#' },
  '.lua': { name: 'Lua', color: '#000080', type: 'code', lineComment: '--', blockCommentStart: '--[[', blockCommentEnd: ']]' },
  '.pl': { name: 'Perl', color: '#0298c3', type: 'code', lineComment: '#' },
  '.pm': { name: 'Perl', color: '#0298c3', type: 'code', lineComment: '#' },
  '.ex': { name: 'Elixir', color: '#6e4a7e', type: 'code', lineComment: '#' },
  '.exs': { name: 'Elixir', color: '#6e4a7e', type: 'code', lineComment: '#' },
  '.erl': { name: 'Erlang', color: '#B83998', type: 'code', lineComment: '%' },
  '.hs': { name: 'Haskell', color: '#5e5086', type: 'code', lineComment: '--', blockCommentStart: '{-', blockCommentEnd: '-}' },
  '.clj': { name: 'Clojure', color: '#db5855', type: 'code', lineComment: ';' },
  '.dart': { name: 'Dart', color: '#00B4AB', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.vue': { name: 'Vue', color: '#41b883', type: 'code', lineComment: '//', blockCommentStart: '<!--', blockCommentEnd: '-->' },
  '.svelte': { name: 'Svelte', color: '#ff3e00', type: 'code', lineComment: '//', blockCommentStart: '<!--', blockCommentEnd: '-->' },
  '.sh': { name: 'Shell', color: '#89e051', type: 'code', lineComment: '#' },
  '.bash': { name: 'Shell', color: '#89e051', type: 'code', lineComment: '#' },
  '.zsh': { name: 'Shell', color: '#89e051', type: 'code', lineComment: '#' },
  '.fish': { name: 'Fish', color: '#4aae47', type: 'code', lineComment: '#' },
  '.ps1': { name: 'PowerShell', color: '#012456', type: 'code', lineComment: '#', blockCommentStart: '<#', blockCommentEnd: '#>' },
  '.sql': { name: 'SQL', color: '#e38c00', type: 'code', lineComment: '--', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.html': { name: 'HTML', color: '#e34c26', type: 'markup', blockCommentStart: '<!--', blockCommentEnd: '-->' },
  '.htm': { name: 'HTML', color: '#e34c26', type: 'markup', blockCommentStart: '<!--', blockCommentEnd: '-->' },
  '.css': { name: 'CSS', color: '#563d7c', type: 'code', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.scss': { name: 'SCSS', color: '#c6538c', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.sass': { name: 'Sass', color: '#a53b70', type: 'code', lineComment: '//' },
  '.less': { name: 'Less', color: '#1d365d', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.md': { name: 'Markdown', color: '#083fa1', type: 'markup' },
  '.mdx': { name: 'MDX', color: '#083fa1', type: 'markup' },
  '.json': { name: 'JSON', color: '#292929', type: 'data' },
  '.yaml': { name: 'YAML', color: '#cb171e', type: 'data', lineComment: '#' },
  '.yml': { name: 'YAML', color: '#cb171e', type: 'data', lineComment: '#' },
  '.toml': { name: 'TOML', color: '#9c4221', type: 'config', lineComment: '#' },
  '.xml': { name: 'XML', color: '#0060ac', type: 'data', blockCommentStart: '<!--', blockCommentEnd: '-->' },
  '.graphql': { name: 'GraphQL', color: '#e10098', type: 'code', lineComment: '#' },
  '.gql': { name: 'GraphQL', color: '#e10098', type: 'code', lineComment: '#' },
  '.proto': { name: 'Protocol Buffers', color: '#74283c', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.tf': { name: 'Terraform', color: '#7B42BC', type: 'code', lineComment: '#', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.hcl': { name: 'HCL', color: '#844fba', type: 'code', lineComment: '#', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.dockerfile': { name: 'Dockerfile', color: '#384d54', type: 'config', lineComment: '#' },
  '.sol': { name: 'Solidity', color: '#AA6746', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.zig': { name: 'Zig', color: '#ec915c', type: 'code', lineComment: '//' },
  '.nim': { name: 'Nim', color: '#ffc200', type: 'code', lineComment: '#' },
  '.v': { name: 'V', color: '#5d87bf', type: 'code', lineComment: '//' },
  '.jl': { name: 'Julia', color: '#a270ba', type: 'code', lineComment: '#', blockCommentStart: '#=', blockCommentEnd: '=#' },
  '.m': { name: 'Objective-C', color: '#438eff', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
  '.mm': { name: 'Objective-C++', color: '#6866fb', type: 'code', lineComment: '//', blockCommentStart: '/*', blockCommentEnd: '*/' },
};

export function getLangInfo(ext: string): LangInfo | undefined {
  return langMap[ext.toLowerCase()];
}

export function getLanguageName(ext: string): string {
  return langMap[ext.toLowerCase()]?.name ?? 'Other';
}

export function getLanguageColor(ext: string): string {
  return langMap[ext.toLowerCase()]?.color ?? '#8b8b8b';
}

export function isCodeFile(ext: string): boolean {
  const info = langMap[ext.toLowerCase()];
  return info?.type === 'code';
}
