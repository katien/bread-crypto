import {Point} from "../../src/elliptic-curve/finiteFieldCurve";

export function toBeAt(received: Point, expected: Point) {
  const fail = {
    message: () => `Received point (${received.x}, ${received.y}) but expected point at (${expected.x}, ${expected.y})`,
    pass: false
  };
  const pass = {
    message: () => `Received point (${received.x}, ${received.y}))`,
    pass: true
  };
  // point at infinity is equal to point at infinity
  if (received.x === null && received.y === null && expected.x === null && expected.y === null)
    return pass;

  // no points are equal to or "near" the point at infinity
  if (received.x === null || received.y === null || expected.x === null || expected.y === null)
    return fail;

  if (received.x !== expected.x || received.y !== expected.y) {
    return fail;
  }

  return pass;
}
