"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FloodFill = void 0;
var dfs_1 = require("./dfs");
var FloodFill = /** @class */ (function () {
    function FloodFill(list_vertex, list_edge) {
        this.list_vertex = list_vertex;
        this.list_edge = list_edge;
        this.total_tree = 0;
        this.list_vertices_marker = list_vertex.reduce(function (acc, v) {
            acc[v.label] = -1;
            return acc;
        }, {});
        this.dfs = new dfs_1.DFS(this.list_vertex, this.list_edge);
    }
    ;
    FloodFill.prototype.fill = function (tree_marker) {
        var _this = this;
        if (tree_marker === void 0) { tree_marker = 0; }
        var unfilled_vertex_index = this.list_vertex.findIndex(function (v) { return _this.list_vertices_marker[v.label] === -1; });
        if (unfilled_vertex_index === -1) {
            return;
        }
        this.dfs.visitTree(this.list_vertex[unfilled_vertex_index], function (v) { return _this.list_vertices_marker[v.label] = tree_marker; });
        this.total_tree++;
        this.fill(tree_marker + 1);
    };
    FloodFill.prototype.getAllSubtree = function () {
        var _this = this;
        if (this.list_vertex.length === 0) {
            return [];
        }
        this.fill();
        var all_tree = [];
        var _loop_1 = function (i) {
            var tree_marker_keys = Object.keys(this_1.list_vertices_marker)
                .filter(function (label) { return _this.list_vertices_marker[label] === i; });
            var list_vertex = this_1.list_vertex.filter(function (v) { return tree_marker_keys.includes(v.label); });
            var list_edge = this_1.list_edge.filter(function (e) { return tree_marker_keys.includes(e.v1.label) || tree_marker_keys.includes(e.v2.label); });
            var tree = {
                list_vertex: list_vertex,
                list_edge: list_edge
            };
            all_tree.push(tree);
        };
        var this_1 = this;
        for (var i = 0; i < this.total_tree; i++) {
            _loop_1(i);
        }
        return all_tree;
    };
    FloodFill.prototype.getMaxSubtree = function () {
        var all_subtree = this.getAllSubtree();
        if (all_subtree.length === 0) {
            return { list_vertex: [], list_edge: [] };
        }
        if (all_subtree.length === 1) {
            return all_subtree[0];
        }
        var max_index = 0;
        for (var i = 1; i < all_subtree.length; i++) {
            if (all_subtree[i].list_vertex.length > all_subtree[max_index].list_vertex.length) {
                max_index = i;
            }
        }
        return all_subtree[max_index];
    };
    return FloodFill;
}());
exports.FloodFill = FloodFill;
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
