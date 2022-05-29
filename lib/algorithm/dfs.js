"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DFS = void 0;
var DFS = /** @class */ (function () {
    function DFS(list_vertex, list_edge) {
        this.list_edge = list_edge;
        this.visited_vertices = list_vertex.reduce(function (acc, v) {
            acc[v.label] = false;
            return acc;
        }, {});
    }
    DFS.prototype.visitTree = function (start_vertex, cb) {
        this.visited_vertices[start_vertex.label] = true;
        cb(start_vertex);
        var list_adjacent_vertex = [];
        for (var _i = 0, _a = this.list_edge; _i < _a.length; _i++) {
            var edge = _a[_i];
            if (start_vertex === edge.v1) {
                list_adjacent_vertex.push(edge.v2);
            }
            if (start_vertex === edge.v2) {
                list_adjacent_vertex.push(edge.v1);
            }
        }
        for (var _b = 0, list_adjacent_vertex_1 = list_adjacent_vertex; _b < list_adjacent_vertex_1.length; _b++) {
            var vertex = list_adjacent_vertex_1[_b];
            if (!this.visited_vertices[vertex.label]) {
                this.visitTree(vertex, cb);
            }
        }
    };
    return DFS;
}());
exports.DFS = DFS;
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
