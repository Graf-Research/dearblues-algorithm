import { Edge, Vertex } from "../graph.interface";
declare type StringNumberKeyValue = {
    [key: string]: number;
};
export interface FloodFillTree {
    list_vertex: Vertex[];
    list_edge: Edge[];
}
export declare class FloodFill {
    private list_vertex;
    private list_edge;
    total_tree: number;
    list_vertices_marker: StringNumberKeyValue;
    private dfs;
    constructor(list_vertex: Vertex[], list_edge: Edge[]);
    fill(tree_marker?: number): void;
    getAllSubtree(): FloodFillTree[];
    getMaxSubtree(): FloodFillTree;
}
export {};
