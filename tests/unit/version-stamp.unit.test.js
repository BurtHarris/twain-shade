import {describe, it, expect} from 'vitest';
import {sanitizeBranch, bumpPatch} from '../../scripts/version-stamp-utils.js';

describe('version-stamp-utils', () => {
  it('sanitizes branch names', () => {
    expect(sanitizeBranch('refs/heads/feature/My-Feature_branch')).toBe('feature-my-feature-branch');
    expect(sanitizeBranch('FOO/BAR')).toBe('foo-bar');
    expect(sanitizeBranch('')).toBe('feature');
  });

  it('bumps patch correctly', () => {
    expect(bumpPatch('1.2.3')).toBe('1.2.4');
    expect(bumpPatch('0.0.9-alpha.1')).toBe('0.0.10');
    expect(bumpPatch('2.1')).toBe('2.1.1');
  });
});
