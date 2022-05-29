import { Vertex, CoordinatedVertex, Edge } from "./src/graph.interface";
import { FloodFill, FloodFillTree } from "./src/algorithm/flood-fill";
import { DFS } from './build/algorithm/dfs';
import { FloydWarshall } from './build/algorithm/floyd-warshall';
import { ForceDirectedEades } from './build/algorithm/force-directed-eades';
import { ForceDirectedFruchtermanReingold } from './build/algorithm/force-directed-fruchterman-reingold';
import { ForceDirectedKamadaKawai } from './build/algorithm/force-directed-kamada-kawai';

declare module 'dearblues-syntax' {
  export {
    Vertex, CoordinatedVertex, Edge,
    FloodFillTree
  }  
}

declare module 'dearblues-syntax/build/algorithm/dfs' {
  export {
    DFS
  }
}

declare module 'dearblues-syntax/build/algorithm/flood-fill' {
  export {
    FloodFill
  }
}

declare module 'dearblues-syntax/build/algorithm/floyd-warshall' {
  export {
    FloydWarshall
  }
}

declare module 'dearblues-syntax/build/algorithm/force-directed-eades' {
  export {
    FloydWarshall
  }
}

declare module 'dearblues-syntax/build/algorithm/force-directed-fruchterman-reingold' {
  export {
    ForceDirectedFruchtermanReingold
  }
}

declare module 'dearblues-syntax/build/algorithm/force-directed-kamada-kawai' {
  export {
    ForceDirectedKamadaKawai
  }
}
