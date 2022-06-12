import BigNumber from "BigNumber.js";

BigNumber.config({MODULO_MODE: BigNumber.EUCLID});

export interface Point {
  x: BigNumber | null;
  y: BigNumber | null;
}

/**
 * An elliptic curve defined over a finite field
 * */
export class FiniteFieldCurve {

  /**
   * Order of field
   * */
  order: BigNumber;

  /**
   * Curve parameter a for formula y^2 = x^3 + ax + b
   * */
  a: BigNumber;

  /**
   * Curve parameter b for formula y^2 = x^3 + ax + b
   * */
  b: BigNumber;

  /**
   * Instantiate a curve with the supplied curve parameters a and b and field order
   * Validates that the curve is non-singular
   * */
  constructor(a: BigNumber, b: BigNumber, order: BigNumber) {
    if (!order.mod(1).eq(0) || order.lt(2))
      throw Error(`Invalid order ${order}, must be a prime power integer`);

    if (a.exponentiatedBy(3).multipliedBy(4)
      .plus(27)
      .multipliedBy(b.exponentiatedBy(2))
      .eq(0))
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
      y: point.y.times(-1).mod(this.order)
    };
  }

  /**
   * multiplies a point by a scalar
   * */
  mult(point: Point, n: BigNumber): Point {
    this.validatePoint(point);
    const scalar = n.mod(this.order);
    let sum: Point = {x: null, y: null};
    // todo: this could be optimized with binary expansion
    for (let i = new BigNumber(0); i.lt(scalar); i = i.plus(1)) {
      sum = this.addPoints(sum, point);
    }
    return sum;
  }

  /**
   * Divides a number by another number using finite field division rules
   * */
  private div(a: BigNumber, b: BigNumber): BigNumber {
    if (b.eq(0)) throw Error(`Can't divide ${a} by 0`);

    // Fermat's little theorem - obtain the multiplicative inverse of a number on a prime order field by multiplying by order-2
    const inverse = b.pow(this.order.minus(2));
    return a.times(inverse).mod(this.order);
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
    else if (a.x.eq(b.x) && !a.y.eq(b.y)) {
      return {x: null, y: null};
    }
    // unique points with different x values
    else if (!a.x.eq(b.x)) {
      const m = this.div((b.y.minus(a.y)), (b.x.minus(a.x)));
      const x = (m.pow(2)).minus(a.x).minus(b.x).mod(this.order);
      const y = m.times(a.x.minus(x)).minus(a.y).mod(this.order);

      return {x, y};
    }
    // adding root to itself (vertical tangent line over real numbers, will always have y=0)
    else if (a.x.eq(b.x) && a.y.eq(0)) {
      return {x: null, y: null};
    }
    // adding a point to itself
    else {
      const m = this.div(a.x.pow(2).times(3).plus(this.a), a.y.times(2));
      const x = m.pow(2).minus(a.x.times(2)).mod(this.order);
      const y = m.times(a.x.minus(x)).minus(a.y).mod(this.order);
      return {x, y};
    }
  }

  /**
   * Validates the point by verifying that it exists on the curve
   * */
  validatePoint(p: Point) {
    if ((p.x === null || p.y === null) && (p.x != p.y))
      throw Error(`Only point at infinity can have null x or y: (${p.x}, ${p.y})`);

    if (p.x?.gte(this.order) || p.x?.lt(0) || p.y?.gte(this.order) || p.y?.lt(0) )
      throw Error(`Point (${p.x}, ${p.y}) out of range for field of order ${this.order}`);

    if ((p.x !== null && p.y !== null) &&
      !p.y.pow(2).mod(this.order).isEqualTo(p.x?.pow(3).plus(this.a.times(p.x)).plus(this.b).mod(this.order)))
      throw Error(`Point (${p.x}, ${p.y}) not on curve y^2 = x^3 + ${this.a}x + ${this.b} mod ${this.order}`);
  }
}



