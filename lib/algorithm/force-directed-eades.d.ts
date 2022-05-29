import { CoordinatedVertex, Edge, Vertex } from "../graph.interface";
import { Point } from "../point";
export interface IForceDirectedEades {
    list_vertex: Vertex[];
    list_edge: Edge[];
    repulsion_constant?: number;
    spring_constant?: number;
    gravity_constant?: number;
    cooling_factor?: number;
    ideal_length?: number;
    max_iteration?: number;
    euclidean_threeshold?: number;
}
export declare class ForceDirectedEades {
    points: Point[];
    adjacency_matrix: boolean[][];
    list_vertex: Vertex[];
    list_edge: Edge[];
    private repulsion_constant;
    private spring_constant;
    private gravity_constant;
    private cooling_factor;
    private ideal_length;
    iteration: number;
    latest_max_force: Point;
    max_iteration: number;
    euclidean_threeshold: number;
    constructor(_: IForceDirectedEades);
    printAdjacencyMatrix(): void;
    printPositions(): void;
    runIteration(n?: number): void;
    reset(): void;
    addVertex(v: Vertex): void;
    addEdge(e: Edge): void;
    private initializePointsPosition;
    private defineAdjacencyMatrix;
    private baryCenter;
    private repulsiveForce;
    private attractiveForce;
    private gravityForce;
    calculateVerticesPosition(): CoordinatedVertex[];
    private iterate;
}
