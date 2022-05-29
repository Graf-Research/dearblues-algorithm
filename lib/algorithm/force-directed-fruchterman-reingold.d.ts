import { CoordinatedVertex, Edge, Vertex } from "../graph.interface";
import { Point } from "../point";
export interface IForceDirectedFruchtermanReingold {
    list_vertex: Vertex[];
    list_edge: Edge[];
    max_iteration?: number;
    euclidean_threeshold?: number;
    cooling_factor?: number;
    ideal_length?: number;
}
export declare class ForceDirectedFruchtermanReingold {
    points: Point[];
    adjacency_matrix: boolean[][];
    list_vertex: Vertex[];
    list_edge: Edge[];
    private cooling_factor;
    private ideal_length;
    iteration: number;
    latest_max_force: Point;
    max_iteration: number;
    euclidean_threeshold: number;
    constructor(_: IForceDirectedFruchtermanReingold);
    printAdjacencyMatrix(): void;
    printPositions(): void;
    runIteration(n?: number): void;
    reset(): void;
    addVertex(v: Vertex): void;
    addEdge(e: Edge): void;
    private initializePointsPosition;
    private defineAdjacencyMatrix;
    private repulsiveForce;
    private attractiveForce;
    calculateVerticesPosition(): CoordinatedVertex[];
    private iterate;
}
