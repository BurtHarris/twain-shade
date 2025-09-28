/**
 * Sanitize a git branch name for use in semver prerelease identifiers.
 * - lowercases
 * - removes refs/heads/
 * - replaces invalid chars with '-'
 * - collapses repeated dashes
 * - trims leading/trailing separators
 * - truncates to 40 chars
 *
 * @param {string} branch - original branch name
 * @returns {string} sanitized branch name safe for use in semver prerelease
 */
export function sanitizeBranch(branch) {
  if (!branch) return 'unknown';
  let s = branch.toLowerCase();
  s = s.replace(/^refs\/heads\//, '');
  s = s.replace(/[^a-z0-9.-]+/g, '-');
  s = s.replace(/-+/g, '-');
  s = s.replace(/^[-.]+|[-.]+$/g, '');
  if (!s) return 'unknown';
  if (s.length > 40) s = s.slice(0, 40);
  return s;
}
