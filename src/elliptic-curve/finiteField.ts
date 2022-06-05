import {mod} from "../util/util";

export class FiniteField {
  order: bigint;

  constructor(order: bigint) {
    this.order = order;
  }

  /**
   * adds the elements together over a finite field
   * */
  add(...elements: bigint[]): bigint {
    if (elements.length < 2) throw Error("At least two numbers are required.");
    elements.forEach(n => this.verifyFieldMembership(n));

    return elements.reduce((acc, n) =>
      mod(n + acc, this.order),
    0n);
  }

  /**
   * Subtracts the elements from the first element over a finite field
   * */
  sub(...elements: bigint[]): bigint {
    if (elements.length < 2) throw Error("At least two numbers are required.");
    elements.forEach(n => this.verifyFieldMembership(n));

    const head: bigint = elements.shift() || 0n;
    return elements.reduce((acc, n) =>
      mod(acc - n, this.order),
    head);
  }

  /**
   * Multiplies the elements together over a finite field
   * */
  mult(...elements: bigint[]): bigint {
    if (elements.length < 2) throw Error("At least two numbers are required.");
    elements.forEach(n => this.verifyFieldMembership(n));

    return elements.reduce((acc, n) =>
      mod(n * acc, this.order),
    1n);
  }

  /**
   * Divides the element a by the element b over a finite field
   * */
  div(a: bigint, b: bigint): bigint {
    this.verifyFieldMembership(a);
    this.verifyFieldMembership(b);
    if (b === 0n) throw Error("Cannot divide by zero");

    return this.mult(a, this.pow(b, -1n));
  }

  /**
   * Raises the element n to a power e over a finite field
   * */
  pow(n: bigint, e: bigint): bigint {
    this.verifyFieldMembership(n);

    const exponent = mod(e, this.order - 1n);
    return mod(n ** exponent, this.order);
  }

  private verifyFieldMembership(n: bigint) {
    if (n >= this.order || n < 0) throw Error(`Element ${n} not in field of order ${this.order}`);
  }
}



