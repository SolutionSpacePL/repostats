export declare function gitExec(args: string[]): Promise<string>;
export declare function getFirstCommitDate(): Promise<Date>;
export declare function getTotalCommitCount(): Promise<number>;
export declare function getMostChangedFiles(limit?: number): Promise<{
    path: string;
    changes: number;
}[]>;
//# sourceMappingURL=git.d.ts.map