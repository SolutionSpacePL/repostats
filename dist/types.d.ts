export declare const CARD_TYPES: readonly ["repo-overview", "commit-activity", "contributors", "cicd-status", "license", "loc-summary", "language-breakdown", "tech-stack", "file-stats", "comment-ratio", "active-files"];
export type CardType = (typeof CARD_TYPES)[number];
export interface ThemeVars {
    bg: string;
    text: string;
    textSecondary: string;
    accent: string;
    border: string;
    barColors: string[];
}
export interface RepoStatsConfig {
    cards: CardType[];
    theme: string;
    customTheme?: Partial<ThemeVars>;
    outputDir: string;
    readmePath: string;
    exclude: string[];
    maxFiles: number;
    cardWidth: number;
    columns: 1 | 2;
    commitName: string;
    commitEmail: string;
    commitMessage: string;
    githubToken: string;
}
export interface WeeklyCommits {
    week: number;
    days: number[];
    total: number;
}
export interface ContributorInfo {
    login: string;
    avatarUrl: string;
    contributions: number;
}
export interface WorkflowRun {
    name: string;
    status: string;
    conclusion: string | null;
    updatedAt: string;
    url: string;
}
export interface LicenseInfo {
    name: string;
    spdxId: string;
}
export interface LanguageBreakdown {
    language: string;
    files: number;
    lines: number;
    percentage: number;
    color: string;
}
export interface LocResult {
    total: number;
    code: number;
    comments: number;
    blanks: number;
    byLanguage: Record<string, {
        code: number;
        comments: number;
        blanks: number;
    }>;
}
export interface DetectedTech {
    name: string;
    category: 'language' | 'framework' | 'database' | 'infrastructure' | 'ci' | 'tool' | 'testing';
    icon?: string;
}
export interface FileStatsResult {
    totalFiles: number;
    totalDirs: number;
    avgFileLength: number;
    medianFileLength: number;
    byExtension: Record<string, number>;
    largestFiles: {
        path: string;
        lines: number;
    }[];
}
export interface RepoMetaResult {
    ageInDays: number;
    totalCommits: number;
    stars: number;
    forks: number;
    openIssues: number;
    openPRs: number;
    defaultBranch: string;
    createdAt: string;
}
export interface CommentRatioResult {
    ratio: number;
    totalCode: number;
    totalComments: number;
    label: string;
}
export interface ActiveFileResult {
    path: string;
    changes: number;
}
export interface CollectedData {
    commitActivity?: WeeklyCommits[];
    contributors?: ContributorInfo[];
    cicdStatus?: WorkflowRun[];
    license?: LicenseInfo;
    loc?: LocResult;
    languages?: LanguageBreakdown[];
    techStack?: DetectedTech[];
    fileStats?: FileStatsResult;
    repoMeta?: RepoMetaResult;
    commentRatio?: CommentRatioResult;
    activeFiles?: ActiveFileResult[];
}
export interface CardRenderer {
    type: CardType;
    render(data: CollectedData, config: RepoStatsConfig, theme: ThemeVars): string;
}
