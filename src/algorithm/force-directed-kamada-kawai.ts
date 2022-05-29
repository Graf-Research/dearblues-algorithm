import { CoordinatedVertex, Edge, Vertex } from "../graph.interface";
import { Point } from "../point";
import { FloydWarshall } from "./floyd-warshall";

export interface IForceDirectedKamadaKawai {
  list_vertex: Vertex[]
  list_edge: Edge[]
  K?: number
  L0?: number
  max_vertex_iteration?: number
  max_iteration?: number
  energy_threshold?: number
}

export interface LengthSpring {
  length: number
  strength: number
}

export interface VertexEnergyAndIndex {
  energy: number
  index: number
}

export interface VertexEnergy {
  x: number
  y: number
}

export class ForceDirectedKamadaKawai {
  public points: Point[] = [];
  public adjacency_matrix: boolean[][] = [];
  public spring_mat: LengthSpring[][] = [];
  public current_max_vertex_energy = { energy: -1, index: -1 };
  public iteration: number = 1;
  
  public list_vertex: Vertex[] = [];
  public list_edge: Edge[] = [];
  public K: number;
  public L0: number;
  public max_vertex_iteration: number;
  public max_iteration: number;
  public energy_threshold: number;

  public constructor(_: IForceDirectedKamadaKawai) {
    this.list_vertex = _.list_vertex;
    this.list_edge = _.list_edge;
    this.K = _.K ?? 5;
    this.L0 = _.L0 ?? 100;
    this.max_vertex_iteration = _.max_vertex_iteration ?? 500;
    this.max_iteration = _.max_iteration ?? 4000;
    this.energy_threshold = _.energy_threshold ?? 0.01;
    this.initialize();
  }

  public printAdjacencyMatrix() {
    let output = "\n\t";
    for (let i = 0; i < this.list_vertex.length; i++) {
      output += this.list_vertex[i].label.slice(0, 2) + "\t";
    }
    output += "\n";
    for (let i = 0; i < this.list_vertex.length; i++) {
      output += this.list_vertex[i].label.slice(0, 2) + "\t";
      for (let j = 0; j < this.list_vertex.length; j++) {
        output += (this.adjacency_matrix[i][j] ? "1" : "0") + "\t";
      }
      output += "\n";
    }
  }

  public printPositions() {
    for (let i = 0; i < this.points.length; i++) {
      const point: Point = this.points[i];
      console.log(`${this.list_vertex[i].label}(${point.x!.toFixed(2)}, ${point.y!.toFixed(2)})`);
    }
  }

  public reset() {
    this.initialize();
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

  private initialize() {
    this.points = this.list_vertex.map(() => new Point({ x: Math.random() * this.L0, y: Math.random() * this.L0 }));
    this.defineAdjacencyMatrix();
    this.initializeSpringMatrix();
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

  private initializeSpringMatrix() {
    // define vertex distance
    let fm = new FloydWarshall(this.list_vertex, this.points, this.adjacency_matrix);
    let distance_mat: number[][] = fm.getDistanceMatrix();

    // define biggest length
    let biggest_distance = 0;
    for (let i = 0; i < this.list_vertex.length; i++) {
      for (let j = 0; j < this.list_vertex.length; j++) {
        if (distance_mat[i][j] > biggest_distance) {
          biggest_distance = distance_mat[i][j];
        }
      }
    }

    // define spring strength and length
    const Length = this.L0 / biggest_distance;
    for (let i = 0; i < this.list_vertex.length; i++) {
      this.spring_mat[i] = [];
      for (let j = 0; j < this.list_vertex.length; j++) {
        if (i === j) {
          this.spring_mat[i][j] = {
            length: 0,
            strength: 0
          }
          continue;
        }

        this.spring_mat[i][j] = {
          length: Length * distance_mat[i][j],
          strength: this.K / distance_mat[i][j]**2
        }
      }
    }
  }

  private vertexEnergy(m: number): VertexEnergy {
    let x_energy: number = 0;
    let y_energy: number = 0;

    for (let i = 0; i < this.list_vertex.length; i++) {
      if (i === m) {
        continue;
      }

      const delta_x: number = this.points[m].x! - this.points[i].x!;
      const delta_y: number = this.points[m].y! - this.points[i].y!;
      const denominator1_2 = 1 / Math.sqrt(delta_x ** 2 + delta_y ** 2);
      const spring: LengthSpring = this.spring_mat[m][i];
      x_energy += spring.strength * delta_x * (1 - spring.length * denominator1_2);
      y_energy += spring.strength * delta_y * (1 - spring.length * denominator1_2);
    }

    return {
      x: x_energy, 
      y: y_energy
    };
  }

  private maxVertexEnergy(): VertexEnergyAndIndex {
    let max_energy: VertexEnergyAndIndex = {
      energy: -1,
      index: -1
    };

    for (let i = 0; i < this.list_vertex.length; i++) {
      const ve = this.vertexEnergy(i);
      const vertext_energy_i = Math.sqrt(ve.x**2 + ve.y**2);
      if (vertext_energy_i > max_energy.energy) {
        max_energy.energy = vertext_energy_i;
        max_energy.index = i;
      }
    }

    if (max_energy.index === -1) {
      throw new Error(`Vertex energy index error: current max energy = ${this.current_max_vertex_energy.energy}`)
    }

    return max_energy;
  }

  private solveDxDyMovement(m: number, energy_x: number, energy_y: number): Point {
    let x_e = energy_x, y_e = energy_y, xx_e = 0, xy_e = 0, yx_e = 0, yy_e = 0;

    for (let i = 0; i < this.list_vertex.length; i++) {
      if (i === m) {
        continue;
      }

      const delta_x: number = this.points[m].x! - this.points[i].x!;
      const delta_y: number = this.points[m].y! - this.points[i].y!;
      const spring: LengthSpring = this.spring_mat[m][i];
      const denominator3_2 = 1 / (delta_x ** 2 + delta_y ** 2) ** 1.5;

      xy_e += spring.strength * spring.length * delta_x * delta_y * denominator3_2;
      xx_e += spring.strength * (1 - spring.length * delta_y**2 * denominator3_2);
      yy_e += spring.strength * (1 - spring.length * delta_x**2 * denominator3_2);
    }

    yx_e = xy_e;
    const denominator = 1 / (xy_e * yx_e - xx_e * yy_e);
    return new Point({
      x: (yy_e * x_e - xy_e * y_e) * denominator,
      y: (xx_e * y_e - yx_e * x_e) * denominator
    });
  }

  private iterate(): Point[] {
    this.current_max_vertex_energy = this.maxVertexEnergy();
    while (this.current_max_vertex_energy.energy > this.energy_threshold && this.iteration < this.max_iteration) {
      let vertex_count = 0;
      let ve: VertexEnergy = this.vertexEnergy(this.current_max_vertex_energy.index);
      let vertext_energy_i: number = Math.sqrt(ve.x**2 + ve.y**2);
      while (vertext_energy_i > this.energy_threshold && vertex_count < this.max_vertex_iteration) {
        const movement: Point = this.solveDxDyMovement(this.current_max_vertex_energy.index, ve.x, ve.y);
        this.points[this.current_max_vertex_energy.index] = this.points[this.current_max_vertex_energy.index].add(movement);
        ve = this.vertexEnergy(this.current_max_vertex_energy.index);
        vertext_energy_i = Math.sqrt(ve.x**2 + ve.y**2);
        vertex_count++;
      }
      
      this.current_max_vertex_energy = this.maxVertexEnergy();
      this.iteration++;
    }

    return this.points;
  }
}
