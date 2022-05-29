import { ForceDirectedEades } from "./algorithm/force-directed-eades";
import { ForceDirectedFruchtermanReingold } from "./algorithm/force-directed-fruchterman-reingold";
import { ForceDirectedKamadaKawai } from "./algorithm/force-directed-kamada-kawai";
import { Edge, Vertex } from "./graph.interface";

const A: Vertex = { label: 'A', weight: 1 };
const B: Vertex = { label: 'B', weight: 1 };
const C: Vertex = { label: 'C', weight: 1 };
const D: Vertex = { label: 'D', weight: 1 };
const E: Vertex = { label: 'E', weight: 1 };
const F: Vertex = { label: 'F', weight: 1 };
const G: Vertex = { label: 'G', weight: 1 };

const list_vertex: Vertex[] = [
  A, B, C
];
const list_edge: Edge[] = [
  { v1: A, v2: B },
  { v1: B, v2: C },
];

const layout_kamada_kawai = new ForceDirectedKamadaKawai({
  list_edge,
  list_vertex
});
const layout_fruchterman_reingold = new ForceDirectedFruchtermanReingold({
  list_edge,
  list_vertex
});
const layout_eades = new ForceDirectedEades({
  list_edge,
  list_vertex
});

console.log(layout_kamada_kawai.calculateVerticesPosition());
