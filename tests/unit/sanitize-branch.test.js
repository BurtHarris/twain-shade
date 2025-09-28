import { describe, it, expect } from 'vitest';
import { sanitizeBranch } from '../../src/utils/sanitize-branch.js';

describe('sanitizeBranch', () => {
  it('lowercases and replaces invalid chars', () => {
    const input = 'Feature/My_Awesome--Thing!!!';
    const out = sanitizeBranch(input);
    expect(out).toBe('feature-my-awesome-thing');
  });

  it('trims leading and trailing dashes and limits length', () => {
    const long = 'feature/' + 'a'.repeat(100);
    const out = sanitizeBranch(long);
    expect(out.length).toBeLessThanOrEqual(40);
    expect(out[0]).not.toBe('-');
    expect(out[out.length - 1]).not.toBe('-');
  });

  it('handles null/undefined gracefully', () => {
    expect(sanitizeBranch(null)).toBe('unknown');
    expect(sanitizeBranch(undefined)).toBe('unknown');
  });
});
