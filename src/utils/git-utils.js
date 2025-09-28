import { execSync } from 'child_process';

function runCmd(cmd) {
  try {
    return execSync(cmd, { encoding: 'utf8' }).trim();
  } catch (e) {
    return null;
  }
}

/**
 * Get current branch name (may return 'HEAD' or null in detached worktrees).
 * @returns {string|null}
 */
export function gitBranch() {
  return runCmd('git rev-parse --abbrev-ref HEAD');
}

/**
 * Get short commit SHA for HEAD.
 * Falls back to the string 'local' when git is not available.
 *
 * Note: the short SHA returned here is intended as a lightweight uniqueness
 * marker to include in stamped artifacts and manifests. It may not be
 * sufficient for some debugger or symbol-mapping scenarios (for example,
 * debuggers or symbol servers that expect a full commit id, precise source
 * mapping, or additional debug metadata). In those cases consider using a
 * full SHA, a content hash, or including richer debug metadata via the
 * `--token`/CI overrides.
 *
 * @returns {string}
 */
export function gitShortSha() {
  return runCmd('git rev-parse --short HEAD') || 'local';
}

/**
 * Decide whether a branch should be treated as a feature branch.
 * Default excludes main/master/develop and treats names with '/' or '-' as feature work.
 * @param {string} branch
 * @returns {boolean}
 */
export function isFeatureBranch(branch) {
  if (!branch) return false;
  const b = branch.toLowerCase();
  if (b === 'master' || b === 'main' || b === 'develop') return false;
  return b.includes('feature') || b.includes('/') || b.includes('-');
}

/**
 * Detect whether the working tree has uncommitted changes.
 * Uses `git status --porcelain` and returns true if any file is listed.
 * @returns {boolean}
 */
export function isWorktreeDirty() {
  try {
    const out = runCmd('git status --porcelain');
    return Boolean(out && out.length > 0);
  } catch (e) {
    return false;
  }
}
