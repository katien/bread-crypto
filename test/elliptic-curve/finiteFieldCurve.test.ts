import {FiniteFieldCurve, Point} from "../../src/elliptic-curve/finiteFieldCurve";
import BigNumber from "BigNumber.js";

const curve1 = new FiniteFieldCurve(new BigNumber(-7), new BigNumber(10), new BigNumber(97));
const curve2 = new FiniteFieldCurve(new BigNumber(1), new BigNumber(10), new BigNumber(211));

describe("addition on an elliptic curve over a finite field", () => {
  test('handles addition of unique points with different x coordinates', () => {
    expect(curve1.add(
      {x: new BigNumber(13), y: new BigNumber(46)},
      {x: new BigNumber(2), y: new BigNumber(95)}))
      .toBeAt({x: new BigNumber(81), y: new BigNumber(10)});

    expect(curve1.add(
      {x: new BigNumber(96), y: new BigNumber(4)},
      {x: new BigNumber(3), y: new BigNumber(93)}))
      .toBeAt({x: new BigNumber(2), y: new BigNumber(2)});

    expect(curve1.add(
      {x: new BigNumber(11), y: new BigNumber(10)},
      {x: new BigNumber(40), y: new BigNumber(96)}))
      .toBeAt({x: new BigNumber(21), y: new BigNumber(54)});

    expect(curve2.add(
      {x: new BigNumber(16), y: new BigNumber(18)},
      {x: new BigNumber(82), y: new BigNumber(31)}))
      .toBeAt({x: new BigNumber(122), y: new BigNumber(89)});
  });

  test('handles adding a point to itself', () => {
    expect(curve1.add(
      {x: new BigNumber(11), y: new BigNumber(10)},
      {x: new BigNumber(11), y: new BigNumber(10)}))
      .toBeAt({x: new BigNumber(31), y: new BigNumber(22)});
  });

  test('handles additive inverse by returning point at infinity', () => {
    expect(curve1.add(
      {x: new BigNumber(9), y: new BigNumber(26)},
      {x: new BigNumber(9), y: new BigNumber(71)}))
      .toBeAt({x: null, y: null});
    expect(curve1.add(
      {x: new BigNumber(9), y: new BigNumber(71)},
      {x: new BigNumber(9), y: new BigNumber(26)}))
      .toBeAt({x: null, y: null});

    expect(curve2.add(
      {x: new BigNumber(14), y: new BigNumber(5)},
      {x: new BigNumber(14), y: new BigNumber(206)}))
      .toBeAt({x: null, y: null});
  });

  test('handles additive inverse where tangent line is vertical by returning point at infinity', () => {
    expect(curve1.add({x: new BigNumber(64), y: new BigNumber(0)}, {
      x: new BigNumber(64),
      y: new BigNumber(0)
    })).toBeAt({x: null, y: null});

    expect(curve2.add({x: new BigNumber(209), y: new BigNumber(0)}, {
      x: new BigNumber(209),
      y: new BigNumber(0)
    })).toBeAt({x: null, y: null});
  });

  test('handles additive identity ', () => {
    expect(curve1.add(
      {x: new BigNumber(13), y: new BigNumber(46)},
      {x: null, y: null})).toBeAt(
      {x: new BigNumber(13), y: new BigNumber(46)});
    expect(curve1.add(
      {x: new BigNumber(96), y: new BigNumber(4)},
      {x: new BigNumber(3), y: new BigNumber(93)},
      {x: null, y: null})).toBeAt(
      {x: new BigNumber(2), y: new BigNumber(2)});

    expect(curve2.add(
      {x: new BigNumber(6), y: new BigNumber(77)},
      {x: new BigNumber(17), y: new BigNumber(64)},
      {x: null, y: null})).toBeAt(
      {x: new BigNumber(90), y: new BigNumber(99)});
  });
});
describe("inversion on an elliptic curve over a finite field", () => {
  test('inversion of a point', () => {
    expect(curve1.invert({x: new BigNumber(9), y: new BigNumber(26)}))
      .toBeAt({x: new BigNumber(9), y: new BigNumber(71)});
    expect(curve1.invert({x: new BigNumber(9), y: new BigNumber(71)}))
      .toBeAt({x: new BigNumber(9), y: new BigNumber(26)});

    expect(curve2.invert({x: new BigNumber(14), y: new BigNumber(5)}))
      .toBeAt({x: new BigNumber(14), y: new BigNumber(206)});
    expect(curve2.invert({x: new BigNumber(14), y: new BigNumber(206)}))
      .toBeAt({x: new BigNumber(14), y: new BigNumber(5)});
  });
});

describe("scalar multiplication of a point on an elliptic curve over a finite field", () => {
  test('handles multiplication by regular scalars', () => {
    expect(curve1.mult(
      {x: new BigNumber(3), y: new BigNumber(4)},
      new BigNumber(2)))
      .toBeAt({x: new BigNumber(73), y: new BigNumber(15)});
    expect(curve1.mult(
      {x: new BigNumber(19), y: new BigNumber(25)},
      new BigNumber(18)))
      .toBeAt({x: new BigNumber(55), y: new BigNumber(79)});
    expect(curve1.mult(
      {x: new BigNumber(3), y: new BigNumber(4)},
      new BigNumber(0)))
      .toBeAt({x: null, y: null});

    expect(curve2.mult(
      {x: new BigNumber(14), y: new BigNumber(5)},
      new BigNumber(-5)))
      .toBeAt({x: new BigNumber(180), y: new BigNumber(19)});
  });

  test('handles multiplication of root by even and off scalars', () => {
    expect(curve1.mult(
      {x: new BigNumber(64), y: new BigNumber(0)},
      new BigNumber(0)))
      .toBeAt({x: null, y: null});

    expect(curve1.mult(
      {x: new BigNumber(64), y: new BigNumber(0)},
      new BigNumber(1)))
      .toBeAt({x: new BigNumber(64), y: new BigNumber(0)});

    expect(curve1.mult(
      {x: new BigNumber(64), y: new BigNumber(0)},
      new BigNumber(2)))
      .toBeAt({x: null, y: null});

    expect(curve2.mult(
      {x: new BigNumber(209), y: new BigNumber(0)},
      new BigNumber(0)))
      .toBeAt({x: null, y: null});

    expect(curve2.mult(
      {x: new BigNumber(209), y: new BigNumber(0)},
      new BigNumber(1)))
      .toBeAt({x: new BigNumber(209), y: new BigNumber(0)});

    expect(curve2.mult(
      {x: new BigNumber(209), y: new BigNumber(0)},
      new BigNumber(2)))
      .toBeAt({x: null, y: null});
  });
});

describe("scalar multiplication of a point on an elliptic curve over a finite field of order 2", () => {
  const curve1 = new FiniteFieldCurve(new BigNumber(-7), new BigNumber(10), new BigNumber(2));

  test('handles multiplication by scalars', () => {
    expect(curve1.mult(
      {x: new BigNumber(1), y: new BigNumber(0)}, new BigNumber(0)))
      .toBeAt({x: null, y: null});
    expect(curve1.mult(
      {x: new BigNumber(1), y: new BigNumber(0)}, new BigNumber(1)))
      .toBeAt({x: new BigNumber(1), y: new BigNumber(0)});
    expect(curve1.mult(
      {x: new BigNumber(1), y: new BigNumber(0)}, new BigNumber(2)))
      .toBeAt({x: null, y: null});
  });
});

describe("curve and point validation", () => {
  test('errors on singular curve', () => {
    expect(() => {
      new FiniteFieldCurve(new BigNumber(0), new BigNumber(0), new BigNumber(97));
    }).toThrow();

    expect(() => curve1.validatePoint({x: new BigNumber(10), y: new BigNumber(2)})).toThrow();
    expect(() => curve1.validatePoint({x: new BigNumber(1), y: new BigNumber(2)})).not.toThrow();
    expect(() => curve1.validatePoint({x: null, y: new BigNumber(9)})).toThrow();
    expect(() => curve1.validatePoint({x: null, y: null})).not.toThrow();
  });
});


// todo: move into d.ts
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeAt(expected: Point): R
    }
  }
}

export {};


expect.extend({
  toBeAt(received: Point, expected: Point) {
    const fail = {
      message: () => `Received point (${received.x}, ${received.y}) but expected point within 0.001 of (${expected.x}, ${expected.y})`,
      pass: false
    };
    const pass = {
      message: () => `Received point (${received.x}, ${received.y}), close enough to (${expected.x}, ${expected.y})`,
      pass: true
    };
    // point at infinity is equal to point at infinity
    if (received.x === null && received.y === null && expected.x === null && expected.y === null)
      return pass;

    // no points are equal to or "near" the point at infinity
    if (received.x === null || received.y === null || expected.x === null || expected.y === null)
      return fail;

    // accept points within 0.001 of each other as being equivalent
    if (received.x.minus(expected.x).abs().gt(0.001) ||
      received.y.minus(expected.y).abs().gt(0.001)) {
      return fail;
    }

    return pass;
  },
});
