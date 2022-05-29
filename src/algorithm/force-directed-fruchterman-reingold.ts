import { CoordinatedVertex, Edge, Vertex } from "../graph.interface";
import { Point } from "../point";

export interface IForceDirectedFruchtermanReingold {
  list_vertex: Vertex[]
  list_edge: Edge[]
  max_iteration?: number
  euclidean_threeshold?: number
  cooling_factor?: number
  ideal_length?: number
}

export class ForceDirectedFruchtermanReingold {
  public points: Point[] = [];
  public adjacency_matrix: boolean[][] = [];
  public list_vertex: Vertex[] = [];
  public list_edge: Edge[] = [];
  private cooling_factor: number = 0;
  private ideal_length: number = 0;
  public iteration: number = 1;
  public latest_max_force = Point.maxSafeInt();
  public max_iteration: number
  public euclidean_threeshold: number

  public constructor(_: IForceDirectedFruchtermanReingold) {
    this.cooling_factor = _.cooling_factor ?? 0.05;
    this.ideal_length = _.ideal_length ?? 100;
    this.max_iteration = _.max_iteration ?? 1500;
    this.euclidean_threeshold = _.euclidean_threeshold ?? 0.001;
    this.list_vertex = _.list_vertex;
    this.list_edge = _.list_edge;
    this.initializePointsPosition();
  }

  public printAdjacencyMatrix() {
    let output = "\t";
    for (let i = 0; i < this.list_vertex.length; i++) {
      output += this.list_vertex[i].label + "\t";
    }
    output += "\n";
    for (let i = 0; i < this.list_vertex.length; i++) {
      output += this.list_vertex[i].label + "\t";
      for (let j = 0; j < this.list_vertex.length; j++) {
        output += (this.adjacency_matrix[i][j] ? "1" : "0") + "\t";
      }
      output += "\n";
    }
    console.log(output);
  }

  public printPositions() {
    for (let i = 0; i < this.points.length; i++) {
      const point: Point = this.points[i];
      console.log(`${this.list_vertex[i].label}(${point.x!.toFixed(2)}, ${point.y!.toFixed(2)})`);
    }
  }

  public runIteration(n: number = 1) {
    for (let i = 0; i < n; i++) {
      this.iterate();
    }
  }

  public reset() {
    this.initializePointsPosition();
    this.iteration = 1;
    this.latest_max_force = Point.maxSafeInt();
  }

  public addVertex(v: Vertex) {
    this.list_vertex.push(v);
    this.points.push(new Point({ x: Math.random() * this.ideal_length, y: Math.random() * this.ideal_length }));
    this.defineAdjacencyMatrix();
  }

  public addEdge(e: Edge) {
    this.list_edge.push({
      v1: this.list_vertex.find(v => v.label === e.v1.label)!,
      v2: this.list_vertex.find(v => v.label === e.v2.label)!
    });
    this.defineAdjacencyMatrix();
  }

  private initializePointsPosition() {
    this.points = this.list_vertex.map(() => new Point({ x: Math.random() * this.ideal_length, y: Math.random() * this.ideal_length }));
    // const angle = 2 * Math.PI / this.list_vertex.length;
    // this.points = this.list_vertex.map((v: Vertex, i) => new Point({
    //   x: this.ideal_length * Math.cos(angle * i) + 0,
    //   y: this.ideal_length * Math.sin(angle * i) + 0,
    // }));
    this.defineAdjacencyMatrix();
  }

  private defineAdjacencyMatrix() {
    this.adjacency_matrix = this.list_vertex.map((u: Vertex) => this.list_vertex.map((v: Vertex) => false));
    for (const edge of this.list_edge) {
      const index_pos_v1 = this.list_vertex.findIndex((v: Vertex) => v.label === edge.v1.label);
      const index_pos_v2 = this.list_vertex.findIndex((v: Vertex) => v.label === edge.v2.label);
      this.adjacency_matrix[index_pos_v1][index_pos_v2] = true;
      this.adjacency_matrix[index_pos_v2][index_pos_v1] = true;
    }
  }

  private repulsiveForce(index_u: number, index_v: number): Point {
    const p_u: Point = this.points[index_u];
    const p_v: Point = this.points[index_v];
    return Point.unitVector(p_u, p_v).multiply(Math.pow(this.ideal_length, 2) / Point.euclideanDistance(p_v, p_u));
  }

  private attractiveForce(index_u: number, index_v: number): Point {
    const p_u: Point = this.points[index_u];
    const p_v: Point = this.points[index_v];
    return Point.unitVector(p_v, p_u).multiply(Math.pow(Point.euclideanDistance(p_u, p_v), 2) / this.ideal_length);
  }

  public calculateVerticesPosition(): CoordinatedVertex[] {
    return this.iterate().map((p: Point, i: number) => {
      const cv: CoordinatedVertex = {
        ...this.list_vertex[i],
        x: p.x!,
        y: p.y!
      };
      return cv;
    });
  }

  private iterate(): Point[] {
    while (Point.euclideanDistance(Point.zero(), this.latest_max_force) > this.euclidean_threeshold && this.iteration < this.max_iteration) {
      const force_list = [];
      for (let i = 0; i < this.points.length; i++) {
        force_list[i] = Point.zero();
      }
      for (let u = 0; u < this.points.length; u++) {
        let temp_max = Point.zero();
        for (let v = 0; v < this.points.length; v++) {
          if (u === v) {
            continue;
          }
          
          if (this.adjacency_matrix[u][v]) {
            force_list[v] = force_list[v].add(this.attractiveForce(u, v))
          } else {
            force_list[v] = force_list[v].add(this.repulsiveForce(u, v));
          }

          temp_max = Point.max(temp_max, force_list[v]);
        }

        this.latest_max_force = temp_max;
      }

      for (let i = 0; i < this.points.length; i++) {
        this.points[i] = this.points[i].add(force_list[i].multiply(this.cooling_factor));
      }

      this.iteration++;
    }

    return this.points;
  }
}
