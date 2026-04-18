import { FileVisitor } from '../utils/fs';
import { FileStatsResult, CommentRatioResult } from '../types';
declare function createVisitor(): FileVisitor;
declare function finalizeFileStats(): FileStatsResult;
declare function finalizeCommentRatio(): CommentRatioResult;
export declare const collectFileStats: {
    createVisitor: typeof createVisitor;
    finalizeFileStats: typeof finalizeFileStats;
    finalizeCommentRatio: typeof finalizeCommentRatio;
};
export {};
//# sourceMappingURL=files.d.ts.map