/**
 * Replacement for JS's native modulo operator which handles negatives incorrectly
 * */
export function mod(n: bigint, modulus: bigint) {
  return (n % modulus + modulus) % modulus;
}
