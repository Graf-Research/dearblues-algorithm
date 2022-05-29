interface IPoint {
    x: number;
    y: number;
}
export declare class Point {
    x: number | undefined;
    y: number | undefined;
    constructor(_?: IPoint);
    isNotSet(): boolean;
    static zero(): Point;
    static maxSafeInt(): Point;
    static euclideanDistance(p1: Point, p2: Point): number;
    add(p: Point): Point;
    subtract(p: Point): Point;
    divide(c: number): Point;
    multiply(c: number): Point;
    static unitVector(p1: Point, p2: Point): Point;
    static max(p1: Point, p2: Point): Point;
    static min(p1: Point, p2: Point): Point;
}
export {};
