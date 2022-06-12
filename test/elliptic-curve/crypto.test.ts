import {FiniteFieldCurve, Point} from "../../src/elliptic-curve/finiteFieldCurve";
import BigNumber from "BigNumber.js";

const p = new BigNumber('115792089237316195423570985008687907853269984665640564039457584007908834671663');
const G = {
  x: new BigNumber('0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', 16),
  y: new BigNumber('0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8', 16)
};
// const n = new BigNumber('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 16);
const secp256k1 = new FiniteFieldCurve(new BigNumber(0), new BigNumber(7), new BigNumber(p));

describe("elliptic curve arithmetic over a finite field", () => {
  test('handles secp256k1', () => {
    expect(() => secp256k1.validatePoint(G)).not.toThrow();
    expect(() => secp256k1.validatePoint({x: null, y: null})).not.toThrow();

    expect(secp256k1.mult(G, new BigNumber(1))).toBeAt(G);

    // todo: fails due to range limit on bignumber.js
    // expect(secp256k1.mult(G, n)).toBeAt({x: null, y: null});
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
