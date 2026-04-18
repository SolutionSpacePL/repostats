export interface LangInfo {
    name: string;
    color: string;
    type: 'code' | 'markup' | 'data' | 'config';
    lineComment?: string;
    blockCommentStart?: string;
    blockCommentEnd?: string;
}
export declare function getLangInfo(ext: string): LangInfo | undefined;
export declare function getLanguageName(ext: string): string;
export declare function getLanguageColor(ext: string): string;
export declare function isCodeFile(ext: string): boolean;
//# sourceMappingURL=lang-map.d.ts.map