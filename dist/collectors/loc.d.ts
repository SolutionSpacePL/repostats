import { FileVisitor } from '../utils/fs';
import { LocResult } from '../types';
declare function createVisitor(): FileVisitor;
declare function finalize(): LocResult;
export declare const collectLoc: {
    createVisitor: typeof createVisitor;
    finalize: typeof finalize;
};
export {};
//# sourceMappingURL=loc.d.ts.map