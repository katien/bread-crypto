import {FiniteField} from '../../src/elliptic-curve/finiteField';

test('addition on a finite field returns the expected result', () => {
  const f293 = new FiniteField(293n);

  expect(f293.add(0n, 0n)).toBe(0n);
  expect(f293.add(10n, 10n)).toBe(20n);
  expect(f293.add(140n, 270n)).toBe(117n);

  expect(() => {
    f293.add(3n, -4n);
  }).toThrow();
});

test('subtraction on a finite field returns the expected result', () => {
  const f97 = new FiniteField(97n);

  expect(f97.sub(30n, 60n)).toBe(67n);
  expect(f97.sub(10n, 30n)).toBe(77n);
  expect(f97.sub(14n, 20n, 60n, 30n)).toBe(1n);
  expect(f97.sub(0n, 0n)).toBe(0n);
  expect(f97.sub(10n, 0n)).toBe(10n);

  expect(() => {
    f97.sub(30n, -4n);
  }).toThrow();
});

test('multiplication on a finite field returns the expected result', () => {
  const f41 = new FiniteField(41n);

  expect(f41.mult(4n, 9n)).toBe(36n);
  expect(f41.mult(1n, 1n)).toBe(1n);
  expect(f41.mult(1n, 0n)).toBe(0n);
  expect(f41.mult(0n, 0n)).toBe(0n);
  expect(f41.mult(0n, 1n)).toBe(0n);
  expect(f41.mult(40n, 40n)).toBe(1n);

  expect(() => {
    f41.mult(-3n, 4n);
  }).toThrow();
});

test('exponentiation on a finite field returns the expected result', () => {
  const f229 = new FiniteField(229n);

  // fermat's little theorem
  expect(f229.pow(1n, 228n)).toBe(1n);
  expect(f229.pow(10n, 228n)).toBe(1n);
  expect(f229.pow(227n, 228n)).toBe(1n);


  expect(f229.pow(5n, 0n)).toBe(1n);
  expect(f229.pow(5n, 900n)).toBe(214n);
  expect(f229.pow(1n, 923n)).toBe(1n);
  expect(f229.pow(10n, -4n)).toBe(3n);

  expect(() => {
    f229.pow(-3n, -4n);
  }).toThrow();
});

test('inversion on a finite field returns the expected result', () => {
  const f229 = new FiniteField(229n);

  expect(f229.pow(3n, -4n)).toBe(82n);
  expect(f229.pow(140n, -1n)).toBe(18n);
  expect(f229.pow(27n, -3n)).toBe(104n);

  expect(() => {
    f229.pow(-32n, -4n);
  }).toThrow();
});


test('division on a finite field returns the expected result', () => {
  const f211 = new FiniteField(211n);

  expect(f211.div(3n, 1n)).toBe(3n);
  expect(() => {
    f211.div(3n, 0n);
  }).toThrow();

  expect(f211.div(30n, 100n)).toBe(148n);
  expect(f211.div(47n, 190n)).toBe(48n);
  expect(f211.div(0n, 23n)).toBe(0n);

  expect(() => {
    f211.div(-32n, -4n);
  }).toThrow();
});
