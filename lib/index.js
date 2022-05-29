"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var force_directed_eades_1 = require("./algorithm/force-directed-eades");
var force_directed_fruchterman_reingold_1 = require("./algorithm/force-directed-fruchterman-reingold");
var force_directed_kamada_kawai_1 = require("./algorithm/force-directed-kamada-kawai");
var A = { label: 'A', weight: 1 };
var B = { label: 'B', weight: 1 };
var C = { label: 'C', weight: 1 };
var D = { label: 'D', weight: 1 };
var E = { label: 'E', weight: 1 };
var F = { label: 'F', weight: 1 };
var G = { label: 'G', weight: 1 };
var list_vertex = [
    A, B, C
];
var list_edge = [
    { v1: A, v2: B },
    { v1: B, v2: C },
];
var layout_kamada_kawai = new force_directed_kamada_kawai_1.ForceDirectedKamadaKawai({
    list_edge: list_edge,
    list_vertex: list_vertex
});
var layout_fruchterman_reingold = new force_directed_fruchterman_reingold_1.ForceDirectedFruchtermanReingold({
    list_edge: list_edge,
    list_vertex: list_vertex
});
var layout_eades = new force_directed_eades_1.ForceDirectedEades({
    list_edge: list_edge,
    list_vertex: list_vertex
});
console.log(layout_kamada_kawai.calculateVerticesPosition());
