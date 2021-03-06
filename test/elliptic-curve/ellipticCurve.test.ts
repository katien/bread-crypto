import {EllipticCurve, Point} from '../../src/elliptic-curve/ellipticCurve';
import {toBeNear} from "../extensions/toBeNear";
expect.extend({toBeNear});

const curve1 = new EllipticCurve(-7, 10);
const curve2 = new EllipticCurve(1, 10);

describe("addition on an elliptic curve", () => {
  test('handles addition of unique points with different x coordinates', () => {
    expect(curve1.add({x: 1, y: 2}, {x: 3, y: 4})).toBeNear({x: -3, y: 2});
    expect(curve1.add({x: 5, y: 10}, {x: 1, y: 2})).toBeNear({x: -2, y: 4});
    expect(curve1.add({x: 2, y: 2}, {x: 9, y: 26})).toBeNear({x: 0.7551, y: 2.26822});
    expect(curve1.add({x: 2, y: 2}, {x: 9, y: 26}, {x: null, y: null})).toBeNear({x: 0.7551, y: 2.26822});
  });

  test('handles adding a point to itself', () => {
    expect(curve1.add({x: 1, y: 2}, {x: 1, y: 2})).toBeNear({x: -1, y: -4});
  });

  test('handles additive inverse by returning point at infinity', () => {
    expect(curve1.add({x: 1, y: 2}, {x: 1, y: -2})).toBeNear({x: null, y: null});
    expect(curve1.add({x: 2, y: 2}, {x: 2, y: -2})).toBeNear({x: null, y: null});
  });

  test('handles adding root to itself where tangent line is vertical by returning point at infinity', () => {
    expect(curve2.add({x: -2, y: 0}, {x: -2, y: 0})).toBeNear({x: null, y: null});
  });
  test('handles additive identity ', () => {
    expect(curve1.add({x: 1, y: 2}, {x: null, y: null})).toBeNear({x: 1, y: 2});
    expect(curve2.add({x: -2, y: 0}, {x: null, y: null})).toBeNear({x: -2, y: 0});
  });
});
describe("scalar multiplication of a point on an elliptic curve", () => {
  test('handles multiplication by even and odd scalars', () => {
    expect(curve1.mult({x: 1, y: 2}, 1)).toBeNear({x: 1, y: 2});
    expect(curve1.mult({x: 1, y: 2}, 2)).toBeNear({x: -1, y: -4});
    expect(curve1.mult({x: 1, y: 2}, 3)).toBeNear({x: 9, y: -26});
    expect(curve1.mult({x: 1, y: 2}, 0)).toBeNear({x: null, y: null});

    expect(curve1.mult({x: null, y: null}, 10)).toBeNear({x: null, y: null});

    expect(curve2.mult({x: -2, y: 0}, 0)).toBeNear({x: null, y: null});
    expect(curve2.mult({x: -2, y: 0}, 1)).toBeNear({x: -2, y: 0});
    expect(curve2.mult({x: -2, y: 0}, 2)).toBeNear({x: null, y: null});
    expect(curve2.mult({x: -2, y: 0}, 3)).toBeNear({x: -2, y: 0});
    expect(curve2.mult({x: -2, y: 0}, 4)).toBeNear({x: null, y: null});
    expect(curve2.mult({x: -2, y: 0}, 5)).toBeNear({x: -2, y: 0});
  });
});

describe("curve and point validation", () => {
  test('errors on singular curve', () => {
    expect(() => {
      new EllipticCurve(0, 0);
    }).toThrow();

    expect(() => curve1.validatePoint({x: 10, y: 2})).toThrow();
    expect(() => curve1.validatePoint({x: 1, y: 2})).not.toThrow();
    expect(() => curve1.validatePoint({x: null, y: 9})).toThrow();
    expect(() => curve1.validatePoint({x: null, y: null})).not.toThrow();
  });
});

// todo: move into d.ts
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeNear(expected: Point): R
    }
  }
}
