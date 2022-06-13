import {FiniteFieldCurve, Point} from "../../src/elliptic-curve/finiteFieldCurve";
import BN from "BN.js";
import {toBeAt} from "../extensions/toBeAt";
expect.extend({toBeAt});

const curve1 = new FiniteFieldCurve(new BN(-7), new BN(10), new BN(97));
const curve2 = new FiniteFieldCurve(new BN(1), new BN(10), new BN(211));

describe("addition on an elliptic curve over a finite field", () => {
  test('handles addition of unique points with different x coordinates', () => {
    // expect(curve1.add(
    //   {x: new BN(13), y: new BN(46)},
    //   {x: new BN(2), y: new BN(95)}))
    //   .toBeAt({x: new BN(81), y: new BN(10)});

    expect(curve1.add(
      {x: new BN(96), y: new BN(4)},
      {x: new BN(3), y: new BN(93)}))
      .toBeAt({x: new BN(2), y: new BN(2)});

    expect(curve1.add(
      {x: new BN(11), y: new BN(10)},
      {x: new BN(40), y: new BN(96)}))
      .toBeAt({x: new BN(21), y: new BN(54)});

    expect(curve2.add(
      {x: new BN(16), y: new BN(18)},
      {x: new BN(82), y: new BN(31)}))
      .toBeAt({x: new BN(122), y: new BN(89)});
  });

  test('handles adding a point to itself', () => {
    expect(curve1.add(
      {x: new BN(11), y: new BN(10)},
      {x: new BN(11), y: new BN(10)}))
      .toBeAt({x: new BN(31), y: new BN(22)});
  });

  test('handles additive inverse by returning point at infinity', () => {
    expect(curve1.add(
      {x: new BN(9), y: new BN(26)},
      {x: new BN(9), y: new BN(71)}))
      .toBeAt({x: null, y: null});
    expect(curve1.add(
      {x: new BN(9), y: new BN(71)},
      {x: new BN(9), y: new BN(26)}))
      .toBeAt({x: null, y: null});

    expect(curve2.add(
      {x: new BN(14), y: new BN(5)},
      {x: new BN(14), y: new BN(206)}))
      .toBeAt({x: null, y: null});
  });

  test('handles additive inverse where tangent line is vertical by returning point at infinity', () => {
    expect(curve1.add({x: new BN(64), y: new BN(0)}, {
      x: new BN(64),
      y: new BN(0)
    })).toBeAt({x: null, y: null});

    expect(curve2.add({x: new BN(209), y: new BN(0)}, {
      x: new BN(209),
      y: new BN(0)
    })).toBeAt({x: null, y: null});
  });

  test('handles additive identity ', () => {
    expect(curve1.add(
      {x: new BN(13), y: new BN(46)},
      {x: null, y: null})).toBeAt(
      {x: new BN(13), y: new BN(46)});
    expect(curve1.add(
      {x: new BN(96), y: new BN(4)},
      {x: new BN(3), y: new BN(93)},
      {x: null, y: null})).toBeAt(
      {x: new BN(2), y: new BN(2)});

    expect(curve2.add(
      {x: new BN(6), y: new BN(77)},
      {x: new BN(17), y: new BN(64)},
      {x: null, y: null})).toBeAt(
      {x: new BN(90), y: new BN(99)});
  });
});
describe("inversion on an elliptic curve over a finite field", () => {
  test('inversion of a point', () => {
    expect(curve1.invert({x: new BN(9), y: new BN(26)}))
      .toBeAt({x: new BN(9), y: new BN(71)});
    expect(curve1.invert({x: new BN(9), y: new BN(71)}))
      .toBeAt({x: new BN(9), y: new BN(26)});

    expect(curve2.invert({x: new BN(14), y: new BN(5)}))
      .toBeAt({x: new BN(14), y: new BN(206)});
    expect(curve2.invert({x: new BN(14), y: new BN(206)}))
      .toBeAt({x: new BN(14), y: new BN(5)});
  });
});

describe("scalar multiplication of a point on an elliptic curve over a finite field", () => {
  test('handles multiplication by regular scalars', () => {
    expect(curve1.mult(
      {x: new BN(3), y: new BN(4)},
      new BN(2)))
      .toBeAt({x: new BN(73), y: new BN(15)});
    expect(curve1.mult(
      {x: new BN(19), y: new BN(25)},
      new BN(18)))
      .toBeAt({x: new BN(55), y: new BN(79)});
    expect(curve1.mult(
      {x: new BN(3), y: new BN(4)},
      new BN(0)))
      .toBeAt({x: null, y: null});

    expect(curve2.mult(
      {x: new BN(14), y: new BN(5)},
      new BN(-5)))
      .toBeAt({x: new BN(180), y: new BN(19)});
  });

  test('handles multiplication of root by even and off scalars', () => {
    expect(curve1.mult(
      {x: new BN(64), y: new BN(0)},
      new BN(0)))
      .toBeAt({x: null, y: null});

    expect(curve1.mult(
      {x: new BN(64), y: new BN(0)},
      new BN(1)))
      .toBeAt({x: new BN(64), y: new BN(0)});

    expect(curve1.mult(
      {x: new BN(64), y: new BN(0)},
      new BN(2)))
      .toBeAt({x: null, y: null});

    expect(curve2.mult(
      {x: new BN(209), y: new BN(0)},
      new BN(0)))
      .toBeAt({x: null, y: null});

    expect(curve2.mult(
      {x: new BN(209), y: new BN(0)},
      new BN(1)))
      .toBeAt({x: new BN(209), y: new BN(0)});

    expect(curve2.mult(
      {x: new BN(209), y: new BN(0)},
      new BN(2)))
      .toBeAt({x: null, y: null});
  });
});

describe("scalar multiplication of a point on an elliptic curve over a finite field of order 2", () => {
  const curve1 = new FiniteFieldCurve(new BN(-7), new BN(10), new BN(2));

  test('handles multiplication by scalars', () => {
    expect(curve1.mult(
      {x: new BN(1), y: new BN(0)}, new BN(0)))
      .toBeAt({x: null, y: null});
    expect(curve1.mult(
      {x: new BN(1), y: new BN(0)}, new BN(1)))
      .toBeAt({x: new BN(1), y: new BN(0)});
    expect(curve1.mult(
      {x: new BN(1), y: new BN(0)}, new BN(2)))
      .toBeAt({x: null, y: null});
  });
});

describe("curve and point validation", () => {
  test('errors on singular curve', () => {
    expect(() => {
      new FiniteFieldCurve(new BN(0), new BN(0), new BN(97));
    }).toThrow();

    expect(() => curve1.validatePoint({x: new BN(10), y: new BN(2)})).toThrow();
    expect(() => curve1.validatePoint({x: new BN(1), y: new BN(2)})).not.toThrow();
    expect(() => curve1.validatePoint({x: null, y: new BN(9)})).toThrow();
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
