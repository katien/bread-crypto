import {FiniteFieldCurve, Point} from "../../src/elliptic-curve/finiteFieldCurve";
import {toBeAt} from "../extensions/toBeAt";
expect.extend({toBeAt});

const curve1 = new FiniteFieldCurve(-7n, 10n, 97n);
const curve2 = new FiniteFieldCurve(1n, 10n, 211n);

describe("addition on an elliptic curve over a finite field", () => {
  test('handles addition of unique points with different x coordinates', () => {
    expect(curve1.add(
      {x: 13n, y: 46n},
      {x: 2n, y: 95n}))
      .toBeAt({x: 81n, y: 10n});

    expect(curve1.add(
      {x: 96n, y: 4n},
      {x: 3n, y: 93n}))
      .toBeAt({x: 2n, y: 2n});

    expect(curve1.add(
      {x: 11n, y: 10n},
      {x: 40n, y: 96n}))
      .toBeAt({x: 21n, y: 54n});

    expect(curve2.add(
      {x: 16n, y: 18n},
      {x: 82n, y: 31n}))
      .toBeAt({x: 122n, y: 89n});
  });

  test('handles adding a point to itself', () => {
    expect(curve1.add(
      {x: 11n, y: 10n},
      {x: 11n, y: 10n}))
      .toBeAt({x: 31n, y: 22n});
  });

  test('handles additive inverse by returning point at infinity', () => {
    expect(curve1.add(
      {x: 9n, y: 26n},
      {x: 9n, y: 71n}))
      .toBeAt({x: null, y: null});
    expect(curve1.add(
      {x: 9n, y: 71n},
      {x: 9n, y: 26n}))
      .toBeAt({x: null, y: null});

    expect(curve2.add(
      {x: 14n, y: 5n},
      {x: 14n, y: 206n}))
      .toBeAt({x: null, y: null});
  });

  test('handles additive inverse where tangent line is vertical by returning point at infinity', () => {
    expect(curve1.add({x: 64n, y: 0n}, {
      x: 64n,
      y: 0n
    })).toBeAt({x: null, y: null});

    expect(curve2.add({x: 209n, y: 0n}, {
      x: 209n,
      y: 0n
    })).toBeAt({x: null, y: null});
  });

  test('handles additive identity ', () => {
    expect(curve1.add(
      {x: 13n, y: 46n},
      {x: null, y: null})).toBeAt(
      {x: 13n, y: 46n});
    expect(curve1.add(
      {x: 96n, y: 4n},
      {x: 3n, y: 93n},
      {x: null, y: null})).toBeAt(
      {x: 2n, y: 2n});

    expect(curve2.add(
      {x: 6n, y: 77n},
      {x: 17n, y: 64n},
      {x: null, y: null})).toBeAt(
      {x: 90n, y: 99n});
  });
});
describe("inversion on an elliptic curve over a finite field", () => {
  test('inversion of a point', () => {
    expect(curve1.invert({x: 9n, y: 26n}))
      .toBeAt({x: 9n, y: 71n});
    expect(curve1.invert({x: 9n, y: 71n}))
      .toBeAt({x: 9n, y: 26n});

    expect(curve2.invert({x: 14n, y: 5n}))
      .toBeAt({x: 14n, y: 206n});
    expect(curve2.invert({x: 14n, y: 206n}))
      .toBeAt({x: 14n, y: 5n});
  });
});

describe("scalar multiplication of a point on an elliptic curve over a finite field", () => {
  test('handles multiplication by regular scalars', () => {
    expect(curve1.mult(
      {x: 3n, y: 4n},
      2n))
      .toBeAt({x: 73n, y: 15n});
    expect(curve1.mult(
      {x: 19n, y: 25n},
      18n))
      .toBeAt({x: 55n, y: 79n});
    expect(curve1.mult(
      {x: 3n, y: 4n},
      0n))
      .toBeAt({x: null, y: null});

    expect(curve2.mult(
      {x: 14n, y: 5n},
      -5n))
      .toBeAt({x: 180n, y: 19n});
  });

  test('handles multiplication of root by even and off scalars', () => {
    expect(curve1.mult(
      {x: 64n, y: 0n},
      0n))
      .toBeAt({x: null, y: null});

    expect(curve1.mult(
      {x: 64n, y: 0n},
      1n))
      .toBeAt({x: 64n, y: 0n});

    expect(curve1.mult(
      {x: 64n, y: 0n},
      2n))
      .toBeAt({x: null, y: null});

    expect(curve2.mult(
      {x: 209n, y: 0n},
      0n))
      .toBeAt({x: null, y: null});

    expect(curve2.mult(
      {x: 209n, y: 0n},
      1n))
      .toBeAt({x: 209n, y: 0n});

    expect(curve2.mult(
      {x: 209n, y: 0n},
      2n))
      .toBeAt({x: null, y: null});
  });
});

describe("scalar multiplication of a point on an elliptic curve over a finite field of order 2", () => {
  const curve1 = new FiniteFieldCurve(-7n, 10n, 2n);

  test('handles multiplication by scalars', () => {
    expect(curve1.mult(
      {x: 1n, y: 0n}, 0n))
      .toBeAt({x: null, y: null});
    expect(curve1.mult(
      {x: 1n, y: 0n}, 1n))
      .toBeAt({x: 1n, y: 0n});
    expect(curve1.mult(
      {x: 1n, y: 0n}, 2n))
      .toBeAt({x: null, y: null});
  });
});

describe("curve and point validation", () => {
  test('errors on singular curve', () => {
    expect(() => {
      new FiniteFieldCurve(0n, 0n, 97n);
    }).toThrow();

    expect(() => curve1.validatePoint({x: 10n, y: 2n})).toThrow();
    expect(() => curve1.validatePoint({x: 1n, y: 2n})).not.toThrow();
    expect(() => curve1.validatePoint({x: null, y: 9n})).toThrow();
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
