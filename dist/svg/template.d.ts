import { ThemeVars } from '../types';
export interface CardOptions {
    title: string;
    width: number;
    height: number;
    body: string;
    theme: ThemeVars;
    icon?: string;
}
export declare function renderCard({ title, width, height, body, theme, icon }: CardOptions): string;
export declare function escapeXml(str: string): string;
//# sourceMappingURL=template.d.ts.map