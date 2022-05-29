import { Edge, Vertex } from "../graph.interface";
import { Point } from "../point";

export class FloydWarshall {
  public list_vertex: Vertex[] = [];
  public list_point: Point[] = [];
  public adjacency_matrix: boolean[][] = [];
  public distance_matrix: number[][] = [];

  public constructor(list_vertex: Vertex[], list_point: Point[], adjacency_matrix: boolean[][]) {
    this.list_vertex = list_vertex;
    this.list_point = list_point;
    this.adjacency_matrix = adjacency_matrix;
  }

  public printDistanceMatrix() {
    let output = "\n\t";
    for (let i = 0; i < this.list_vertex.length; i++) {
      output += this.list_vertex[i].label.slice(0, 2) + "\t";
    }
    output += "\n";
    for (let i = 0; i < this.list_vertex.length; i++) {
      output += this.list_vertex[i].label.slice(0, 2) + "\t";
      for (let j = 0; j < this.list_vertex.length; j++) {
        output += this.distance_matrix[i][j] + "\t";
      }
      output += "\n";
    }
  }

  public getDistanceMatrix(): number[][] {
    const distance_mat: number[][] = [];
    for (let i = 0; i < this.list_point.length; i++) {
      distance_mat[i] = [];
      for (let j = 0; j < this.list_point.length; j++) {
        if (i === j) {
          distance_mat[i][j] = 0;
          continue;
        }

        if (this.adjacency_matrix[i][j]) {
          distance_mat[i][j] = this.list_vertex[i].weight + this.list_vertex[j].weight;
          continue;
        }

        distance_mat[i][j] = Infinity;
      }
    }

    for (let k = 0; k < this.list_point.length; k++) {
      for (let i = 0; i < this.list_point.length; i++) {
        for (let j = 0; j < this.list_point.length; j++) {
          distance_mat[i][j] = Math.min(distance_mat[i][j], distance_mat[i][k] + distance_mat[k][j]);
        }
      }
    }

    this.distance_matrix = distance_mat;

    return distance_mat;
  }
}
