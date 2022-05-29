import { CoordinatedVertex, Edge, Vertex } from "../graph.interface";
import { Point } from "../point";
export interface IForceDirectedKamadaKawai {
    list_vertex: Vertex[];
    list_edge: Edge[];
    K?: number;
    L0?: number;
    max_vertex_iteration?: number;
    max_iteration?: number;
    energy_threshold?: number;
}
export interface LengthSpring {
    length: number;
    strength: number;
}
export interface VertexEnergyAndIndex {
    energy: number;
    index: number;
}
export interface VertexEnergy {
    x: number;
    y: number;
}
export declare class ForceDirectedKamadaKawai {
    points: Point[];
    adjacency_matrix: boolean[][];
    spring_mat: LengthSpring[][];
    current_max_vertex_energy: {
        energy: number;
        index: number;
    };
    iteration: number;
    list_vertex: Vertex[];
    list_edge: Edge[];
    K: number;
    L0: number;
    max_vertex_iteration: number;
    max_iteration: number;
    energy_threshold: number;
    constructor(_: IForceDirectedKamadaKawai);
    printAdjacencyMatrix(): void;
    printPositions(): void;
    reset(): void;
    calculateVerticesPosition(): CoordinatedVertex[];
    private initialize;
    private defineAdjacencyMatrix;
    private initializeSpringMatrix;
    private vertexEnergy;
    private maxVertexEnergy;
    private solveDxDyMovement;
    private iterate;
}
