import { Edge, Vertex } from "../graph.interface";
declare type DFSCallback = (vertex: Vertex) => void;
export declare class DFS {
    private list_edge;
    private visited_vertices;
    constructor(list_vertex: Vertex[], list_edge: Edge[]);
    visitTree(start_vertex: Vertex, cb: DFSCallback): void;
}
export {};
