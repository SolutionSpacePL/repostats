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
export declare function walkFiles(rootDir: string, excludePatterns: string[], maxFiles: number, visitors: FileVisitor[]): Promise<void>;
//# sourceMappingURL=fs.d.ts.map