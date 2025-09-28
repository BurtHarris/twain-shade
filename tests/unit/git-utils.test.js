import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// We'll stub child_process.execSync by mocking the module via vi.mock.
// Vitest expects a default export shape when the tested module does a
// named import (import { execSync } from 'child_process'). To satisfy
// both ESM import patterns, provide a default object with execSync and
// also named export via the returned object.
vi.mock('child_process', () => {
  const execMock = vi.fn(() => 'abcde\n');
  return {
    default: { execSync: execMock },
    execSync: execMock,
  };
});

import { gitBranch, gitShortSha, isFeatureBranch, isWorktreeDirty } from '../../src/utils/git-utils.js';
import { execSync } from 'child_process';

describe('git-utils (mocked)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gitBranch returns branch name', () => {
    // our mock returns 'abcde\n' trimmed
    expect(gitBranch()).toBe('abcde');
    expect(execSync).toHaveBeenCalled();
  });

  it('gitShortSha returns short sha or local', () => {
    expect(gitShortSha()).toBe('abcde');
  });

  it('isFeatureBranch heuristic', () => {
    expect(isFeatureBranch('main')).toBe(false);
    expect(isFeatureBranch('feature/new-thing')).toBe(true);
    expect(isFeatureBranch('user/branch-name')).toBe(true);
  });

  it('isWorktreeDirty reads git status', () => {
    // adjust mock to return non-empty string
    execSync.mockImplementationOnce(() => ' M file.js\n');
    expect(isWorktreeDirty()).toBe(true);
  });
});
