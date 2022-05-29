import { Edge, Vertex } from "../graph.interface";

type DFSCallback = (vertex: Vertex) => void;
type StringBoolKeyValue = {[key:string]: boolean};

export class DFS {
  private list_edge: Edge[];
  private visited_vertices: StringBoolKeyValue;

  constructor(list_vertex: Vertex[], list_edge: Edge[]) {
    this.list_edge = list_edge;
    this.visited_vertices = list_vertex.reduce((acc: StringBoolKeyValue, v: Vertex) => {
      acc[v.label] = false;
      return acc;
    }, {});
  }

  public visitTree(start_vertex: Vertex, cb: DFSCallback) {
    this.visited_vertices[start_vertex.label] = true;
    cb(start_vertex);

    const list_adjacent_vertex = [];
    for (const edge of this.list_edge) {
      if (start_vertex === edge.v1) {
        list_adjacent_vertex.push(edge.v2);
      }
      if (start_vertex === edge.v2) {
        list_adjacent_vertex.push(edge.v1);
      }
    }

    for (const vertex of list_adjacent_vertex) {
      if (!this.visited_vertices[vertex.label]) {
        this.visitTree(vertex, cb);
      }
    }
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
// const list_vertex: Vertex[] = [
//   A, B, C, D, E, F, G
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
// ];

// new DFS(list_vertex, list_edge).visitTree(A, v => console.log(`visited ${v.label}`));