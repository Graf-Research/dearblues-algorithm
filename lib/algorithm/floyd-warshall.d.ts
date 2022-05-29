import { Vertex } from "../graph.interface";
import { Point } from "../point";
export declare class FloydWarshall {
    list_vertex: Vertex[];
    list_point: Point[];
    adjacency_matrix: boolean[][];
    distance_matrix: number[][];
    constructor(list_vertex: Vertex[], list_point: Point[], adjacency_matrix: boolean[][]);
    printDistanceMatrix(): void;
    getDistanceMatrix(): number[][];
}
