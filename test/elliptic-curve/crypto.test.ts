import {FiniteFieldCurve, Point} from "../../src/elliptic-curve/finiteFieldCurve";

import {toBeAt} from "../extensions/toBeAt";
expect.extend({toBeAt});

const p = BigInt('115792089237316195423570985008687907853269984665640564039457584007908834671663');
const G = {
  x: BigInt('0x79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798'),
  y: BigInt('0x483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8')
};
// const n = BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141');
const secp256k1 = new FiniteFieldCurve(BigInt(0), BigInt(7), BigInt(p));

describe("elliptic curve arithmetic over a finite field", () => {
  test('handles secp256k1', () => {
    expect(() => secp256k1.validatePoint(G)).not.toThrow();
    expect(() => secp256k1.validatePoint({x: null, y: null})).not.toThrow();

    expect(secp256k1.mult(G, BigInt(1))).toBeAt(G);

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

