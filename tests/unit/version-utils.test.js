import { describe, it, expect } from 'vitest';
import { bumpPatch, makeStampedVersion } from '../../src/utils/version-utils.js';

describe('version-utils', () => {
  it('bumpPatch increments patch', () => {
    expect(bumpPatch('1.2.3')).toBe('1.2.4');
    expect(bumpPatch('0.0.9')).toBe('0.0.10');
  });

  it('makeStampedVersion formats with build meta by default', () => {
    const v = makeStampedVersion('1.2.3', 'feature-x', 'launch', 'abc123', true);
    expect(v).toBe('1.2.3-feature-x+abc123');
  });

  it('makeStampedVersion falls back to prerelease when not using build meta', () => {
    const v = makeStampedVersion('1.2.3', 'feature-x', 'launch', 'abc123', false);
    expect(v).toBe('1.2.3-feature-x.abc123');
  });
});
