import {mod} from '../../src/util/util';

test('handles modular arithmetic on positive numbers', () => {
  expect(mod(1747n, 241n)).toBe(60n);
  expect(mod(482n, 241n)).toBe(0n);
});


test('handles modular arithmetic on negative numbers', () => {
  expect(mod(-496n, 23n)).toBe(10n);
  expect(mod(243n, -23n)).toBe(-10n);
});
