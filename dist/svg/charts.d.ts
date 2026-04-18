export declare function stackedBar(segments: {
    label: string;
    value: number;
    color: string;
}[], width: number, height?: number, borderRadius?: number): string;
export declare function barChart(values: number[], width: number, height: number, color: string, gap?: number): string;
export declare function sparkline(values: number[], width: number, height: number, color: string, strokeWidth?: number): string;
export declare function donutChart(segments: {
    label: string;
    value: number;
    color: string;
}[], size: number, thickness?: number): string;
export declare function gaugeArc(value: number, // 0-1
size: number, color: string, bgColor: string, thickness?: number): string;
export declare function legend(items: {
    label: string;
    value: string;
    color: string;
}[], textColor: string, secondaryColor: string, startY?: number, columns?: number, colWidth?: number): string;
export declare function heatmapGrid(weeks: number[][], // 52 weeks x 7 days
cellSize: number, gap: number, colors: string[], // gradient from low to high (5 levels)
emptyColor: string): string;
//# sourceMappingURL=charts.d.ts.map