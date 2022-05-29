import { Edge, Vertex } from "../graph.interface";
import { DFS } from "./dfs";

type StringNumberKeyValue = {[key:string]: number};
export interface FloodFillTree {
  list_vertex: Vertex[]
  list_edge: Edge[]
}

export class FloodFill {
  private list_vertex: Vertex[];
  private list_edge: Edge[];
  public total_tree: number;
  public list_vertices_marker: StringNumberKeyValue;
  private dfs: DFS;;

  constructor(list_vertex: Vertex[], list_edge: Edge[]) {
    this.list_vertex = list_vertex;
    this.list_edge = list_edge;
    this.total_tree = 0;
    this.list_vertices_marker = list_vertex.reduce((acc: StringNumberKeyValue, v: Vertex) => {
      acc[v.label] = -1;
      return acc;
    }, {});
    this.dfs = new DFS(this.list_vertex, this.list_edge);
  }

  fill(tree_marker: number = 0) {
    const unfilled_vertex_index = this.list_vertex.findIndex((v: Vertex) => this.list_vertices_marker[v.label] === -1);
    if (unfilled_vertex_index === -1) {
      return;
    }
    this.dfs.visitTree(this.list_vertex[unfilled_vertex_index], (v: Vertex) => this.list_vertices_marker[v.label] = tree_marker);
    this.total_tree++;
    this.fill(tree_marker + 1);
  }

  getAllSubtree(): FloodFillTree[] {
    if (this.list_vertex.length === 0) {
      return [];
    }
    this.fill();
    const all_tree: FloodFillTree[] = [];
    for (let i = 0; i < this.total_tree; i++) {
      const tree_marker_keys: string[] = Object.keys(this.list_vertices_marker)
        .filter((label: string) => this.list_vertices_marker[label] === i);
      const list_vertex: Vertex[] = this.list_vertex.filter((v: Vertex) => tree_marker_keys.includes(v.label));
      const list_edge: Edge[] = this.list_edge.filter((e: Edge) => tree_marker_keys.includes(e.v1.label) || tree_marker_keys.includes(e.v2.label));
      const tree: FloodFillTree = {
        list_vertex,
        list_edge
      };
      all_tree.push(tree);
    }

    return all_tree;
  }

  getMaxSubtree(): FloodFillTree {
    const all_subtree: FloodFillTree[] = this.getAllSubtree();
    if (all_subtree.length === 0) {
      return { list_vertex: [], list_edge: [] };
    }
    if (all_subtree.length === 1) {
      return all_subtree[0];
    }
    let max_index = 0;
    for (let i = 1; i < all_subtree.length; i++) {
      if (all_subtree[i].list_vertex.length > all_subtree[max_index].list_vertex.length) {
        max_index = i;
      }
    }
    
    return all_subtree[max_index];
  }
}

// function createVertex(label: string): Vertex {
//   return { label };
// }

// function createEdge(v1: Vertex, v2: Vertex): Edge {
//   return { v1, v2 };
// }

// const A = createVertex('A');
// const B = createVertex('B');
// const C = createVertex('C');
// const D = createVertex('D');
// const E = createVertex('E');
// const F = createVertex('F');
// const G = createVertex('G');
// const H = createVertex('H');
// const I = createVertex('I');
// const J = createVertex('J');
// const list_vertex: Vertex[] = [
//   A, B, C, D, E, F, G, H, I, J
// ];
// const list_edge: Edge[] = [
//   createEdge(A, B),
//   createEdge(A, C),
//   createEdge(B, C),
//   createEdge(B, E),
//   createEdge(B, G),
//   createEdge(C, E),
//   createEdge(C, F),
//   createEdge(D, F),
//   createEdge(F, G),
//   createEdge(H, I),
//   createEdge(H, J),
// ];

// const ff = new FloodFill(list_vertex, list_edge);
// console.log(JSON.stringify(ff.getMaxSubtree(), null, 2));
