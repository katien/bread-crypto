import {FiniteFieldCurve, Point} from "../../src/elliptic-curve/finiteFieldCurve";
import bignumber from "bignumber.js";
import {toBeAt} from "../extensions/toBeAt";
expect.extend({toBeAt});

const curve1 = new FiniteFieldCurve(new bignumber(-7), new bignumber(10), new bignumber(97));
const curve2 = new FiniteFieldCurve(new bignumber(1), new bignumber(10), new bignumber(211));

describe("addition on an elliptic curve over a finite field", () => {
  test('handles addition of unique points with different x coordinates', () => {
    expect(curve1.add(
      {x: new bignumber(13), y: new bignumber(46)},
      {x: new bignumber(2), y: new bignumber(95)}))
      .toBeAt({x: new bignumber(81), y: new bignumber(10)});

    expect(curve1.add(
      {x: new bignumber(96), y: new bignumber(4)},
      {x: new bignumber(3), y: new bignumber(93)}))
      .toBeAt({x: new bignumber(2), y: new bignumber(2)});

    expect(curve1.add(
      {x: new bignumber(11), y: new bignumber(10)},
      {x: new bignumber(40), y: new bignumber(96)}))
      .toBeAt({x: new bignumber(21), y: new bignumber(54)});

    expect(curve2.add(
      {x: new bignumber(16), y: new bignumber(18)},
      {x: new bignumber(82), y: new bignumber(31)}))
      .toBeAt({x: new bignumber(122), y: new bignumber(89)});
  });

  test('handles adding a point to itself', () => {
    expect(curve1.add(
      {x: new bignumber(11), y: new bignumber(10)},
      {x: new bignumber(11), y: new bignumber(10)}))
      .toBeAt({x: new bignumber(31), y: new bignumber(22)});
  });

  test('handles additive inverse by returning point at infinity', () => {
    expect(curve1.add(
      {x: new bignumber(9), y: new bignumber(26)},
      {x: new bignumber(9), y: new bignumber(71)}))
      .toBeAt({x: null, y: null});
    expect(curve1.add(
      {x: new bignumber(9), y: new bignumber(71)},
      {x: new bignumber(9), y: new bignumber(26)}))
      .toBeAt({x: null, y: null});

    expect(curve2.add(
      {x: new bignumber(14), y: new bignumber(5)},
      {x: new bignumber(14), y: new bignumber(206)}))
      .toBeAt({x: null, y: null});
  });

  test('handles additive inverse where tangent line is vertical by returning point at infinity', () => {
    expect(curve1.add({x: new bignumber(64), y: new bignumber(0)}, {
      x: new bignumber(64),
      y: new bignumber(0)
    })).toBeAt({x: null, y: null});

    expect(curve2.add({x: new bignumber(209), y: new bignumber(0)}, {
      x: new bignumber(209),
      y: new bignumber(0)
    })).toBeAt({x: null, y: null});
  });

  test('handles additive identity ', () => {
    expect(curve1.add(
      {x: new bignumber(13), y: new bignumber(46)},
      {x: null, y: null})).toBeAt(
      {x: new bignumber(13), y: new bignumber(46)});
    expect(curve1.add(
      {x: new bignumber(96), y: new bignumber(4)},
      {x: new bignumber(3), y: new bignumber(93)},
      {x: null, y: null})).toBeAt(
      {x: new bignumber(2), y: new bignumber(2)});

    expect(curve2.add(
      {x: new bignumber(6), y: new bignumber(77)},
      {x: new bignumber(17), y: new bignumber(64)},
      {x: null, y: null})).toBeAt(
      {x: new bignumber(90), y: new bignumber(99)});
  });
});
describe("inversion on an elliptic curve over a finite field", () => {
  test('inversion of a point', () => {
    expect(curve1.invert({x: new bignumber(9), y: new bignumber(26)}))
      .toBeAt({x: new bignumber(9), y: new bignumber(71)});
    expect(curve1.invert({x: new bignumber(9), y: new bignumber(71)}))
      .toBeAt({x: new bignumber(9), y: new bignumber(26)});

    expect(curve2.invert({x: new bignumber(14), y: new bignumber(5)}))
      .toBeAt({x: new bignumber(14), y: new bignumber(206)});
    expect(curve2.invert({x: new bignumber(14), y: new bignumber(206)}))
      .toBeAt({x: new bignumber(14), y: new bignumber(5)});
  });
});

describe("scalar multiplication of a point on an elliptic curve over a finite field", () => {
  test('handles multiplication by regular scalars', () => {
    expect(curve1.mult(
      {x: new bignumber(3), y: new bignumber(4)},
      new bignumber(2)))
      .toBeAt({x: new bignumber(73), y: new bignumber(15)});
    expect(curve1.mult(
      {x: new bignumber(19), y: new bignumber(25)},
      new bignumber(18)))
      .toBeAt({x: new bignumber(55), y: new bignumber(79)});
    expect(curve1.mult(
      {x: new bignumber(3), y: new bignumber(4)},
      new bignumber(0)))
      .toBeAt({x: null, y: null});

    expect(curve2.mult(
      {x: new bignumber(14), y: new bignumber(5)},
      new bignumber(-5)))
      .toBeAt({x: new bignumber(180), y: new bignumber(19)});
  });

  test('handles multiplication of root by even and off scalars', () => {
    expect(curve1.mult(
      {x: new bignumber(64), y: new bignumber(0)},
      new bignumber(0)))
      .toBeAt({x: null, y: null});

    expect(curve1.mult(
      {x: new bignumber(64), y: new bignumber(0)},
      new bignumber(1)))
      .toBeAt({x: new bignumber(64), y: new bignumber(0)});

    expect(curve1.mult(
      {x: new bignumber(64), y: new bignumber(0)},
      new bignumber(2)))
      .toBeAt({x: null, y: null});

    expect(curve2.mult(
      {x: new bignumber(209), y: new bignumber(0)},
      new bignumber(0)))
      .toBeAt({x: null, y: null});

    expect(curve2.mult(
      {x: new bignumber(209), y: new bignumber(0)},
      new bignumber(1)))
      .toBeAt({x: new bignumber(209), y: new bignumber(0)});

    expect(curve2.mult(
      {x: new bignumber(209), y: new bignumber(0)},
      new bignumber(2)))
      .toBeAt({x: null, y: null});
  });
});

describe("scalar multiplication of a point on an elliptic curve over a finite field of order 2", () => {
  const curve1 = new FiniteFieldCurve(new bignumber(-7), new bignumber(10), new bignumber(2));

  test('handles multiplication by scalars', () => {
    expect(curve1.mult(
      {x: new bignumber(1), y: new bignumber(0)}, new bignumber(0)))
      .toBeAt({x: null, y: null});
    expect(curve1.mult(
      {x: new bignumber(1), y: new bignumber(0)}, new bignumber(1)))
      .toBeAt({x: new bignumber(1), y: new bignumber(0)});
    expect(curve1.mult(
      {x: new bignumber(1), y: new bignumber(0)}, new bignumber(2)))
      .toBeAt({x: null, y: null});
  });
});

describe("curve and point validation", () => {
  test('errors on singular curve', () => {
    expect(() => {
      new FiniteFieldCurve(new bignumber(0), new bignumber(0), new bignumber(97));
    }).toThrow();

    expect(() => curve1.validatePoint({x: new bignumber(10), y: new bignumber(2)})).toThrow();
    expect(() => curve1.validatePoint({x: new bignumber(1), y: new bignumber(2)})).not.toThrow();
    expect(() => curve1.validatePoint({x: null, y: new bignumber(9)})).toThrow();
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
