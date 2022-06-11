export interface Vertex {
  label: string
  weight: number
}

export interface SimplePoint {
  x: number
  y: number
}

export interface CoordinatedVertex extends Vertex, SimplePoint {}

export interface Edge {
  v1: Vertex
  v2: Vertex
}
