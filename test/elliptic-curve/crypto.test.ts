import {FiniteFieldCurve, Point} from "../../src/elliptic-curve/finiteFieldCurve";
import BN from "BN.js";

import {toBeAt} from "../extensions/toBeAt";
expect.extend({toBeAt});

const p = new BN('115792089237316195423570985008687907853269984665640564039457584007908834671663');
const G = {
  x: new BN('79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798', 16),
  y: new BN('483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8', 16)
};
// const n = new BN('fffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141', 16);
const secp256k1 = new FiniteFieldCurve(new BN(0), new BN(7), new BN(p));

describe("elliptic curve arithmetic over a finite field", () => {
  test('handles secp256k1', () => {
    expect(() => secp256k1.validatePoint(G)).not.toThrow();
    expect(() => secp256k1.validatePoint({x: null, y: null})).not.toThrow();

    expect(secp256k1.mult(G, new BN(1))).toBeAt(G);

    // // todo: fails due to range limit on BN.js
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


