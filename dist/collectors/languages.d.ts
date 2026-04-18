import { FileVisitor } from '../utils/fs';
import { LanguageBreakdown } from '../types';
declare function createVisitor(): FileVisitor;
declare function finalize(): LanguageBreakdown[];
export declare const collectLanguages: {
    createVisitor: typeof createVisitor;
    finalize: typeof finalize;
};
export {};
//# sourceMappingURL=languages.d.ts.map