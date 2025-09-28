import semver from 'semver';

/**
 * Bump the patch part of a semver string.
 * Uses semver.inc when possible to respect prerelease/build metadata.
 *
 * @param {string} version - semver string (may include prerelease/build)
 * @returns {string} bumped version (patch incremented)
 */
export function bumpPatch(version) {
  // use semver.inc for correctness when version contains prerelease/build
  const next = semver.inc(version, 'patch');
  if (!next) {
    // fallback to simple logic
    const [main] = version.split('-');
    const parts = main.split('.').map(p => parseInt(p, 10) || 0);
    while (parts.length < 3) parts.push(0);
    parts[2] = parts[2] + 1;
    return parts.join('.');
  }
  // semver.inc returns a string like 1.2.4
  return next;
}

/**
 * Build a stamped version string.
 * When useBuildMeta is true the identifier is appended as build metadata (+sha.x)
 * otherwise it is appended as a prerelease segment.
 *
 * @param {string} baseVersion - bumped base version (e.g., 1.2.3)
 * @param {string} sanitizedBranch - sanitized branch name
 * @param {string} origin - 'build' or 'launch' (unused in formatting, kept for context)
 * @param {string|number} counterOrId - identifier (sha string or numeric counter)
 * @param {boolean} [useBuildMeta=true] - whether to use build metadata (+)
 * @returns {string} formatted stamped version
 */
export function makeStampedVersion(baseVersion, sanitizedBranch, origin, counterOrId, useBuildMeta = true) {
  if (useBuildMeta) {
    const idPart = typeof counterOrId === 'number' ? `counter.${counterOrId}` : `${counterOrId}`;
    return `${baseVersion}-${sanitizedBranch}+${idPart}`;
  }
  return `${baseVersion}-${sanitizedBranch}.${counterOrId}`;
}
