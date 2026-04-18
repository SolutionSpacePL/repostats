import { LangInfo } from './lang-map';
export interface LineCounts {
    code: number;
    comments: number;
    blanks: number;
}
export declare function countLines(lines: string[], lang: LangInfo | undefined): LineCounts;
//# sourceMappingURL=comments.d.ts.map