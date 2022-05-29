interface IPoint {
  x: number
  y: number
}

export class Point {
  public x: number | undefined;
  public y: number | undefined;
  
  public constructor(_?: IPoint) {
    if (!_) {
      return;
    }

    this.x = _!.x;
    this.y = _!.y;
  }

  public isNotSet(): boolean {
    return this.x === undefined || this.y === undefined;
  }

  public static zero(): Point {
    return new Point({ x: 0, y: 0 });
  }

  public static maxSafeInt(): Point {
    return new Point({ x: Number.MAX_SAFE_INTEGER, y: Number.MAX_SAFE_INTEGER });
  }

  public static euclideanDistance(p1: Point, p2: Point): number {
    if (p1.isNotSet()) {
      throw new Error(`p1 components (x, y) is not defined yet-1`);
    }

    if (p2.isNotSet()) {
      throw new Error(`p2 components (x, y) is not defined yet 0`);
    }

    return Math.sqrt(Math.pow(p2.x! - p1.x!, 2) + Math.pow(p2.y! - p1.y!, 2));
  }

  public add(p: Point): Point {
    if (this.isNotSet()) {
      throw new Error(`this components (x, y) is not defined yet 1`);
    }

    if (p.isNotSet()) {
      throw new Error(`p components (x, y) is not defined yet 2`);
    }

    return new Point({ x: this.x! + p.x!, y: this.y! + p.y! });
  }

  public subtract(p: Point): Point {
    if (this.isNotSet()) {
      throw new Error(`this components (x, y) is not defined yet 3`);
    }

    if (p.isNotSet()) {
      throw new Error(`p components (x, y) is not defined yet 4`);
    }

    return new Point({ x: this.x! - p.x!, y: this.y! - p.y! });
  }

  public divide(c: number): Point {
    if (this.isNotSet()) {
      throw new Error(`this components (x, y) is not defined yet 5`);
    }

    if (c === 0) {
      throw new Error(`Divider constance cannot be zero`);
    }

    return new Point({ x: this.x! / c, y: this.y! / c });
  }

  public multiply(c: number): Point {
    if (this.isNotSet()) {
      throw new Error(`this components (x, y) is not defined yet 6`);
    }

    return new Point({ x: this.x! * c, y: this.y! * c });
  }

  public static unitVector(p1: Point, p2: Point): Point {
    if (p1.isNotSet()) {
      throw new Error(`p1 components (x, y) is not defined yet 7`);
    }

    if (p2.isNotSet()) {
      throw new Error(`p2 components (x, y) is not defined yet 8`);
    }

    const euc_distance = this.euclideanDistance(p1, p2);
    if (euc_distance === 0) {
      // throw new Error(`Euclidean distance equals to zero`);
      return p2.subtract(p1);
    }

    return p2.subtract(p1).divide(euc_distance);
  }

  public static max(p1: Point, p2: Point): Point {
    const zero = Point.zero();
    return Point.euclideanDistance(zero, p1) > Point.euclideanDistance(zero, p2) ? p1 : p2;
  }

  public static min(p1: Point, p2: Point): Point {
    const zero = Point.zero();
    return Point.euclideanDistance(zero, p1) < Point.euclideanDistance(zero, p2) ? p1 : p2;
  }
}
