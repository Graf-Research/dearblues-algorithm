import { Vertex, CoordinatedVertex, Edge } from "./src/graph.interface";
import { FloodFill, FloodFillTree } from "./src/algorithm/flood-fill";
import { DFS } from './src/algorithm/dfs';
import { FloydWarshall } from './src/algorithm/floyd-warshall';
import { ForceDirectedEades } from './src/algorithm/force-directed-eades';
import { ForceDirectedFruchtermanReingold } from './src/algorithm/force-directed-fruchterman-reingold';
import { ForceDirectedKamadaKawai } from './src/algorithm/force-directed-kamada-kawai';

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
