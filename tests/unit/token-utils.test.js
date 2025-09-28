import { describe, it, expect } from 'vitest';
import { validateCiToken } from '../../src/utils/token-utils.js';

describe('token-utils', () => {
  it('accepts valid tokens', () => {
    expect(validateCiToken('CI_TOKEN_123')).toBe(true);
    expect(validateCiToken('build-2025.09.28')).toBe(true);
    expect(validateCiToken('a')).toBe(true);
  });

  it('rejects invalid tokens', () => {
    expect(() => validateCiToken('')).toThrow();
    expect(() => validateCiToken('contains space')).toThrow();
    expect(() => validateCiToken('semi;colon')).toThrow();
    expect(() => validateCiToken('weird$char')).toThrow();
    const long = 'x'.repeat(65);
    expect(() => validateCiToken(long)).toThrow();
  });
});
