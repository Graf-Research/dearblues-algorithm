export interface Vertex {
  label: string
  weight: number
}

export interface CoordinatedVertex extends Vertex {
  x: number
  y: number
}

export interface Edge {
  v1: Vertex
  v2: Vertex
}
