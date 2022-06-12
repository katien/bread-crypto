export interface Point {
  x: number | null;
  y: number | null;
}

/**
 * An elliptic curve defined over the real numbers
 * todo: update to use bignumber or similar lib
 * */
export class EllipticCurve {
  /**
   * Curve parameter a for formula y^2 = x^3 + ax + b
   * */
  a: number;

  /**
   * Curve parameter b for formula y^2 = x^3 + ax + b
   * */
  b: number;

  /**
   * Instantiate a curve with the supplied curve parameters a and b
   * Validates that the curve is non-singular
   * */
  constructor(a: number, b: number) {
    if (4 * (a ** 3) + 27 * (b ** 2) === 0)
      throw Error(`Parameters a = ${a} and b = ${b} create a singular curve`);
    this.a = a;
    this.b = b;
  }

  /**
   * adds the points together on an elliptic curve
   * */
  add(...points: Point[]): Point {
    if (points.length < 2) throw Error("At least two points are required.");
    points.forEach(n => this.validatePoint(n));

    return points.reduce((acc: Point, p: Point) => this.addPoints(acc, p),
      {x: null, y: null});
  }

  /**
   * multiplies the point by a scalar
   * */
  mult(point: Point, n: number): Point {
    this.validatePoint(point);
    let sum: Point = {x: null, y: null};
    for (let i = 0; i < n; i++) {
      sum = this.addPoints(sum, point);
    }
    return sum;
  }

  /**
   * Adds two points
   * */
  private addPoints(a: Point, b: Point): Point {
    // additive identity
    if (a.x === null || a.y === null) {
      return b;
    } else if (b.x === null || b.y === null) {
      return a;
    }
    // additive inverse (same x)
    else if (a.x === b.x && a.y === -b.y) {
      return {x: null, y: null};
    }
    // unique points with different x values
    else if (a.x != b.x) {
      const m = (b.y - a.y) / (b.x - a.x);
      const x = (m ** 2) - a.x - b.x;
      const y = m * (a.x - x) - a.y;
      return {x, y};
    }
    // adding a point to itself where the y coordinate is 0 (vertical tangent line)
    else if (a.x === b.x && a.y === b.y && a.y === 0) {
      return {x: null, y: null};
    }
    // adding a point to itself
    else {
      const m = (3 * (a.x ** 2) + this.a) / (2 * a.y);
      const x = (m ** 2) - 2 * a.x;
      const y = m * (a.x - x) - a.y;
      return {x, y};
    }
  }

  /**
   * Validates the point by verifying that it exists on the curve
   * */
  validatePoint(p: Point) {
    if ((p.x === null || p.y === null) && (p.x != p.y))
      throw Error(`Only point at infinity can have null x or y: (${p.x}, ${p.y})`);

    if ((p.x !== null && p.y !== null) &&
      (p.y ** 2 !== p.x ** 3 + this.a * p.x + this.b))
      throw Error(`Point (${p.x}, ${p.y}) not on curve y^2 = x^3 + ${this.a}x + ${this.b}`);
  }
}



