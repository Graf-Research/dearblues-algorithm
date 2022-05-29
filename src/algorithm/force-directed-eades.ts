import { CoordinatedVertex, Edge, Vertex } from "../graph.interface";
import { Point } from "../point";

export interface IForceDirectedEades {
  list_vertex: Vertex[]
  list_edge: Edge[]
  repulsion_constant?: number
  spring_constant?: number
  gravity_constant?: number
  cooling_factor?: number
  ideal_length?: number
  max_iteration?: number
  euclidean_threeshold?: number
}

export class ForceDirectedEades {
  public points: Point[] = [];
  public adjacency_matrix: boolean[][] = [];
  public list_vertex: Vertex[] = [];
  public list_edge: Edge[] = [];
  private repulsion_constant: number = 0;
  private spring_constant: number = 0;
  private gravity_constant: number = 0;
  private cooling_factor: number = 0;
  private ideal_length: number = 0;
  public iteration: number = 1;
  public latest_max_force = Point.maxSafeInt();
  public max_iteration: number
  public euclidean_threeshold: number

  public constructor(_: IForceDirectedEades) {
    this.repulsion_constant = _.repulsion_constant ?? 1050;
    this.spring_constant = _.spring_constant ?? 50;
    this.gravity_constant = _.gravity_constant ?? 0;
    this.cooling_factor = _.cooling_factor ?? 0.95;
    this.ideal_length = _.ideal_length ?? 250;
    this.list_vertex = _.list_vertex;
    this.list_edge = _.list_edge;
    this.max_iteration = _.max_iteration ?? 500;
    this.euclidean_threeshold = _.euclidean_threeshold ?? 0.001;
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
    if (n === 1) {
      this.iterate();
      return;
    }
    
    for (let i = 0; i < n; i++) {
      this.iterate();
    }
  }

  public reset() {
    this.initializePointsPosition();
    this.iteration = 0;
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
    this.points = this.list_vertex.map((v: Vertex, i) => new Point({ x: Math.random() * this.ideal_length / 10, y: Math.random() * this.ideal_length / 10 }));
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

  private baryCenter(): Point {
    if (this.list_vertex.length === 0) {
      return Point.zero();
    }
    return this.points.reduce<Point>((acc, curr) => acc.add(curr), Point.zero()).divide(this.list_vertex.length);
  }

  private repulsiveForce(index_u: number, index_v: number): Point {
    if (this.adjacency_matrix[index_u][index_v]) {
      return Point.zero();
    }

    const p_u: Point = this.points[index_u];
    const p_v: Point = this.points[index_v];
    return Point.unitVector(p_u, p_v).multiply(this.repulsion_constant / Math.pow(Point.euclideanDistance(p_v, p_u), 2));
  }

  private attractiveForce(index_u: number, index_v: number): Point {
    if (!this.adjacency_matrix[index_u][index_v]) {
      return Point.zero();
    }
    
    const p_u: Point = this.points[index_u];
    const p_v: Point = this.points[index_v];
    return Point.unitVector(p_v, p_u).multiply(this.spring_constant * Math.log(Point.euclideanDistance(p_v, p_u) / this.ideal_length));
  }
  
  private gravityForce(p_v: Point, p_bary: Point): Point {
    const index_pos = this.points.findIndex(p => p === p_v);
    const mass = 1 + this.adjacency_matrix[index_pos].reduce((acc, curr) => acc + (curr ? 1 : 0), 0) / 4;
    return Point.unitVector(p_v, p_bary).multiply(this.gravity_constant).multiply(mass);
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
      for (let u = 0; u < this.points.length; u++) {
        force_list[u] = Point.zero();
      }
      const p_bary = this.baryCenter();
      for (let u = 0; u < this.points.length; u++) {
        let temp_max = Point.zero();
        for (let v = 0; v < this.points.length; v++) {
          if (u === v) {
            continue;
          }
          force_list[v] = force_list[v]
            .add(this.repulsiveForce(u, v))
            .add(this.attractiveForce(u, v))
            .add(this.gravityForce(this.points[v], p_bary));
          
          temp_max = Point.max(temp_max, force_list[v]);
        }

        this.latest_max_force = temp_max;
      }

      for (let u = 0; u < this.points.length; u++) {
        this.points[u] = this.points[u].add(force_list[u].multiply(this.cooling_factor));
      }

      this.iteration++;
    }
    
    return this.points;
  }
}
