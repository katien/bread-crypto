import {mod} from "../util/util";

export interface Point {
  x: bigint | null;
  y: bigint | null;
}

/**
 * An elliptic curve defined over a finite field
 * */
export class FiniteFieldCurve {

  /**
   * Order of field
   * */
  order: bigint;

  /**
   * Curve parameter a for formula y^2 = x^3 + ax + b
   * */
  a: bigint;

  /**
   * Curve parameter b for formula y^2 = x^3 + ax + b
   * */
  b: bigint;

  /**
   * Instantiate a curve with the supplied curve parameters a and b and field order
   * Validates that the curve is non-singular
   * */
  constructor(a: bigint, b: bigint, order: bigint) {
    if (mod(order, 1n) != 0n || order < 2n)
      throw Error(`Invalid order ${order}, must be a prime power integer`);

    if (4n * (a ** 3n) + (27n * b ** 2n) === 0n)
      throw Error(`Parameters a = ${a} and b = ${b} create a singular curve`);

    this.a = a;
    this.b = b;

    this.order = order;
  }

  /**
   * adds the points together
   * */
  add(...points: Point[]): Point {
    if (points.length < 2) throw Error("At least two points are required.");
    points.forEach(n => this.validatePoint(n));

    return points.reduce((acc: Point, p: Point) => this.addPoints(acc, p),
      {x: null, y: null});
  }

  /**
   * returns the additive inverse of a point
   * */
  invert(point: Point): Point {
    this.validatePoint(point);

    if (point.x === null || point.y === null)
      return {x: null, y: null};

    return {
      x: point.x,
      y: mod(-point.y, this.order)
    };
  }

  /**
   * multiplies a point by a scalar
   * */
  naiveMultiply(point: Point, n: bigint): Point {
    this.validatePoint(point);
    const scalar = mod(n, this.order);
    let sum: Point = {x: null, y: null};
    // todo: this could be optimized with binary expansion
    for (let i = 0n; i < scalar; i++) {
      sum = this.addPoints(sum, point);
    }
    return sum;
  }

  /**
   * Efficient implementation of scalar multiplication of a point using binary expansion of scalar
   * */
  mult(point: Point, n: bigint): Point {
    this.validatePoint(point);

    const digits = mod(n, this.order).toString(2).split("").reverse();
    let sum: Point = {x: null, y: null};
    // double counter for each binary digit traversed
    let counter = point;

    digits.forEach((digit: string) => {
      // add counter to sum for all 1's in binary representation of scalar
      if (digit === '1') sum = this.add(sum, counter);
      counter = this.addPoints(counter, counter);
    });

    return sum;
  }

  /**
   * Divides a number by another number using finite field division rules
   * */
  private div(a: bigint, b: bigint): bigint {
    if (b === 0n) throw Error(`Can't divide ${a} by 0`);

    // Fermat's little theorem - obtain the multiplicative inverse of a number on a prime order field by multiplying by order-2
    const inverse = b ** (this.order - 2n);
    return mod(a * inverse, this.order);
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
    else if (a.x === b.x && a.y !== b.y) {
      return {x: null, y: null};
    }
    // unique points with different x values
    else if (a.x !== b.x) {
      const m = this.div(b.y - a.y, b.x - a.x);
      const x = mod((m ** 2n) - a.x - b.x, this.order);
      const y = mod(m * (a.x - x) - a.y, this.order);

      return {x, y};
    }
    // adding root to itself (vertical tangent line over real numbers, will always have y=0)
    else if (a.x === b.x && a.y === 0n) {
      return {x: null, y: null};
    }
    // adding a point to itself
    else {
      const m = this.div(3n * (a.x ** 2n) + this.a, 2n * a.y);
      const x = mod((m ** 2n) - (2n * a.x), this.order);
      const y = mod(m * (a.x - x) - a.y, this.order);
      return {x, y};
    }
  }

  /**
   * Validates the point by verifying that it exists on the curve
   * */
  validatePoint(p: Point) {
    if ((p.x === null || p.y === null) && (p.x != p.y))
      throw Error(`Only point at infinity can have null x or y: (${p.x}, ${p.y})`);

    if (p.x === null || p.y === null) return;

    if (p.x >= this.order || p.x < 0n ||
      p.y >= this.order || p.y < 0n)
      throw Error(`Point (${p.x}, ${p.y}) out of range for field of order ${this.order}`);

    if (mod(p.y ** 2n, this.order) !== mod((p.x ** 3n) + (this.a * p.x) + this.b, this.order))
      throw Error(`Point (${p.x}, ${p.y}) not on curve y^2 = x^3 + ${this.a}x + ${this.b} mod ${this.order}`);
  }
}



