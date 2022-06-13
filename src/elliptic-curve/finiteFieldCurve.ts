import BN from "bn.js";

export interface Point {
  x: BN | null;
  y: BN | null;
}

/**
 * An elliptic curve defined over a finite field
 * */
export class FiniteFieldCurve {

  /**
   * Order of field
   * */
  order: BN;

  /**
   * Curve parameter a for formula y^2 = x^3 + ax + b
   * */
  a: BN;

  /**
   * Curve parameter b for formula y^2 = x^3 + ax + b
   * */
  b: BN;

  /**
   * Instantiate a curve with the supplied curve parameters a and b and field order
   * Validates that the curve is non-singular
   * */
  constructor(a: BN, b: BN, order: BN) {
    if (!order.umod(new BN(1)).eq(new BN(0)) || order.lt(new BN(2)))
      throw Error(`Invalid order ${order}, must be a prime power integer`);

    if (a.pow(new BN(3)).mul(new BN(4))
      .add(new BN(27))
      .mul(b.pow(new BN(2)))
      .eq(new BN(0)))
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
      y: point.y.mul(new BN(-1)).umod(this.order)
    };
  }

  /**
   * multiplies a point by a scalar
   * */
  naiveMultiply(point: Point, n: BN): Point {
    this.validatePoint(point);
    const scalar = n.umod(this.order);
    let sum: Point = {x: null, y: null};
    // todo: this could be optimized with binary expansion
    for (let i = new BN(new BN(0)); i.lt(scalar); i = i.add(new BN(1))) {
      sum = this.addPoints(sum, point);
    }
    return sum;
  }

  /**
   * Efficient implementation of scalar multiplication of a point using binary expansion of scalar
   * */
  mult(point: Point, n: BN): Point {
    this.validatePoint(point);

    const digits = n.umod(this.order).toString(2).split("").reverse();
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
  private div(a: BN, b: BN): BN {
    if (b.eq(new BN(0))) throw Error(`Can't divide ${a} by 0`);

    // Fermat's little theorem - obtain the multiplicative inverse of a number on a prime order field by multiplying by order-2
    const inverse = b.pow(this.order.sub(new BN(2)));
    return a.mul(inverse).umod(this.order);
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
      const m = this.div((b.y.sub(a.y)), (b.x.sub(a.x)));
      const x = (m.pow(new BN(2))).sub(a.x).sub(b.x).umod(this.order);
      const y = m.mul(a.x.sub(x)).sub(a.y).umod(this.order);

      return {x, y};
    }
    // adding root to itself (vertical tangent line over real numbers, will always have y=0)
    else if (a.x.eq(b.x) && a.y.eq(new BN(0))) {
      return {x: null, y: null};
    }
    // adding a point to itself
    else {
      const m = this.div(a.x.pow(new BN(2)).mul(new BN(3)).add(this.a), a.y.mul(new BN(2)));
      const x = m.pow(new BN(2)).sub(a.x.mul(new BN(2))).umod(this.order);
      const y = m.mul(a.x.sub(x)).sub(a.y).umod(this.order);
      return {x, y};
    }
  }

  /**
   * Validates the point by verifying that it exists on the curve
   * */
  validatePoint(p: Point) {
    if ((p.x === null || p.y === null) && (p.x != p.y))
      throw Error(`Only point at infinity can have null x or y: (${p.x}, ${p.y})`);

    if (p.x?.gte(this.order) || p.x?.lt(new BN(0)) || p.y?.gte(this.order) || p.y?.lt(new BN(0)))
      throw Error(`Point (${p.x}, ${p.y}) out of range for field of order ${this.order}`);

    if ((p.x !== null && p.y !== null) &&
      !p.y.pow(new BN(2)).umod(this.order).eq(p.x?.pow(new BN(3)).add(this.a.mul(p.x)).add(this.b).umod(this.order)))
      throw Error(`Point (${p.x}, ${p.y}) not on curve y^2 = x^3 + ${this.a}x + ${this.b} umod ${this.order}`);
  }
}



