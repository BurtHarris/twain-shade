#!/usr/bin/env node
import fs from 'fs';
import {execSync} from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import lockfile from 'proper-lockfile';
import { sanitizeBranch as _sanitizeBranch } from '../src/utils/sanitize-branch.js';
import { validateCiToken as _validateCiToken } from '../src/utils/token-utils.js';
import { bumpPatch as _bumpPatch, makeStampedVersion as _makeStampedVersion } from '../src/utils/version-utils.js';
import { gitBranch as _gitBranch, gitShortSha as _gitShortSha, isFeatureBranch as _isFeatureBranch, isWorktreeDirty as _isWorktreeDirty } from '../src/utils/git-utils.js';
import { ensureDir as _ensureDir, readJsonSafe as _readJsonSafe, atomicWriteFileSync as _atomicWriteFileSync, backupFile as _backupFile, readStore as _readStore, writeStore as _writeStore } from '../src/utils/fs-utils.js';

/**
 * Enhanced version-stamp script
 * - Sanitizes branch names for semver prerelease identifiers
 * - Uses a configurable persisted store (default: .version-stamp/store.json)
 * - For "launch" origin can use per-branch counters (opt-in) or commit SHA (default)
 * - For "build" origin prefers commit-short-SHA for reproducible artifacts
 * - Supports CI-provided deterministic identifiers via `--ci-token` (alias `--token` kept for compatibility)
 * - Backs up package.json and uses atomic writes
 */

const cwd = process.cwd();
const pkgPath = path.join(cwd, 'package.json');
const distDir = path.join(cwd, 'dist');
const defaultStore = path.join(cwd, '.version-stamp', 'store.json');
const defaultBackupDir = path.join(cwd, '.version-stamp', 'backups');
const lockPath = path.join(cwd, '.version-stamp', 'lock');

// ...existing code...

// We'll use proper-lockfile for robust cross-platform locking

async function lockStore(storePath, fn) {
  _ensureDir(path.dirname(storePath));
  // Ensure the store file exists with a default shape so proper-lockfile
  // can operate on a concrete path (it lstat's the path during locking).
  try {
    if (!fs.existsSync(storePath)) {
      // write an initialized store so the lockfile can be created
      const init = { counters: {}, stamps: [] };
      writeStore(storePath, init);
    }
  } catch (e) {
    // best effort; proceed to lock and let lockfile surface any errors
  }

  let release;
  try {
    release = await lockfile.lock(storePath, { retries: 3, stale: 20000 });
  } catch (err) {
    throw new Error('Failed to acquire store lock: ' + (err && err.message ? err.message : err));
  }
  try {
    return await fn();
  } finally {
    try { await release(); } catch (e) { /* best-effort */ }
  }
}

const backupFile = (filePath, backupDir = defaultBackupDir) => _backupFile(filePath, backupDir);

const gitBranch = () => _gitBranch();
const gitShortSha = () => _gitShortSha();
const isFeatureBranch = (b) => _isFeatureBranch(b);

const sanitizeBranch = (b) => _sanitizeBranch(b);

const bumpPatch = (v) => _bumpPatch(v);

const ensureDist = () => _ensureDir(distDir);

const readStore = (p) => _readStore(p);
const writeStore = (p, obj) => _writeStore(p, obj);

const atomicWriteFileSync = (filePath, data) => _atomicWriteFileSync(filePath, data);

const makeStampedVersion = (b, s, o, id, useBuildMeta) => _makeStampedVersion(b, s, o, id, useBuildMeta);

function readPkg() { return JSON.parse(fs.readFileSync(pkgPath, 'utf8')); }

function writePkgAtomic(pkg) { const data = JSON.stringify(pkg, null, 2) + '\n'; _atomicWriteFileSync(pkgPath, data); }

function getOriginFromEnvOrArgs() {
  // CLI arg --origin=launch|build or env VERSION_STAMP_ORIGIN or detect npm lifecycle
  const arg = process.argv.find(a => a.startsWith('--origin='));
  if (arg) return arg.split('=')[1];
  if (process.env.VERSION_STAMP_ORIGIN) return process.env.VERSION_STAMP_ORIGIN;
  const life = process.env.npm_lifecycle_event || '';
  if (life.toLowerCase().includes('build') || process.env.CI === 'true') return 'build';
  return 'launch';
}

async function stamp(options = {}) {
  // options: { dryRun = true, apply = false, force = false, token, origin, storePath }
  const dryRun = options.dryRun !== undefined ? options.dryRun : true;
  const apply = options.apply === true;
  const force = options.force === true;
  // accept either options.ciToken (preferred) or legacy options.token
  const tokenOverride = options.ciToken || options.token;

  // validate token early
  if (tokenOverride) {
    try { _validateCiToken(tokenOverride); } catch (e) { throw new Error('Invalid CI token: ' + e.message); }
  }
  const useCounter = options.useCounter === true;
  const useBuildMeta = options.useBuildMeta !== undefined ? options.useBuildMeta : true;
  const includeDirty = options.dirty === true || options.includeWorktree === true;
  const origin = options.origin || getOriginFromEnvOrArgs();
  const branch = options.branch || gitBranch();
  const sanitized = sanitizeBranch(branch);
  const isFeature = isFeatureBranch(branch);
  const storePath = options.storePath || process.env.VERSION_STAMP_STORE || defaultStore;

  /**
   * Stamp programmatic API
   * @param {object} options - stamp options
   * @param {boolean} [options.dryRun=true]
   * @param {boolean} [options.apply=false]
   * @param {boolean} [options.force=false]
   * @param {string} [options.token] - override identifier
   * @param {boolean} [options.useCounter] - force numeric counters
   * @param {boolean} [options.useBuildMeta=true] - use semver build metadata
   * @param {boolean} [options.dirty] - append .dirty when worktree has uncommitted changes
   */
  const pkg = readPkg();
  const base = bumpPatch(pkg.version);

  const store = readStore(storePath);

  let identifier;
  let deferredCounter = false;
  if (isFeature) {
    // Prevent accidental use of counters in CI or build contexts where concurrency may occur
    const inCI = process.env.CI === 'true' || origin === 'build';
    if (useCounter && inCI && !force) {
      throw new Error('Use of counters is disabled in CI/build contexts to avoid races. Pass --force to override.');
    }
    if (tokenOverride) {
      identifier = tokenOverride;
    } else if (origin === 'build' || !useCounter) {
      // prefer commit SHA by default for build and for launch (unless useCounter requested)
      identifier = gitShortSha();
    } else {
      // launch with explicit useCounter: increment per-branch counter.
      // When applying, defer increment into the locked section to avoid races
      // (we must read/update the on-disk store under the same lock).
      const key = `${sanitized}||${base}`;
      if (!apply) {
        const cur = Number(store.counters[key] || 0) + 1;
        identifier = cur || 1;
      } else {
        deferredCounter = true;
        // identifier will be computed inside the lock
        identifier = null;
      }
    }

    let stamped = identifier ? makeStampedVersion(base, sanitized, origin, identifier, useBuildMeta) : null;

    const commitShort = gitShortSha();
    // NOTE: commitShort is a short SHA used for artifact uniqueness and
    // stamping. It is intentionally compact and convenient for semver
    // metadata, but may not provide the level of fidelity required by some
    // debugger/symbol mapping setups which expect a full commit id or
    // richer debug metadata. Use `--token` or CI-provided identifiers when
    // reproducible, debuggable artifacts are required.

    // Build the stampEntry only once we have a final identifier/stampedVersion.
    let stampEntry = null;

    const buildStampEntry = (id, stampedVer) => ({
      stampedVersion: stampedVer,
      baseVersion: base,
      branch: branch,
      sanitizedBranch: sanitized,
      origin: origin,
      identifier: id,
      commitShortSha: commitShort,
      timestamp: new Date().toISOString()
    });

    // If not deferring the counter, we already have stamped/identifier
    if (!deferredCounter) {
      stampEntry = buildStampEntry(identifier, stamped);

      // append dirty marker for local worktree if requested
      if (includeDirty) {
        try {
          const dirty = _isWorktreeDirty();
          if (dirty) {
            stampEntry.identifier = `${stampEntry.identifier}.dirty`;
            stampEntry.stampedVersion = makeStampedVersion(base, sanitized, origin, `${identifier}.dirty`, useBuildMeta);
          }
        } catch (e) {
          // non-fatal
        }
      }

      if (dryRun && !apply) {
        // preview only
        return { action: 'dry-run', stamp: stampEntry };
      }
    }

    // apply path: use proper-lockfile to guard store updates
    return await lockStore(storePath, async () => {
      const curStore = readStore(storePath);

      // If counter increment was deferred, compute it now against the locked store
      if (deferredCounter) {
        const key = `${sanitized}||${base}`;
        const cur = Number(curStore.counters[key] || 0) + 1;
        curStore.counters[key] = cur;
        identifier = cur;
        stamped = makeStampedVersion(base, sanitized, origin, identifier, useBuildMeta);

        // build the stampEntry now that we have the identifier/stamped
        stampEntry = buildStampEntry(identifier, stamped);

        // apply dirty marker if requested
        if (includeDirty) {
          try {
            const dirty = _isWorktreeDirty();
            if (dirty) {
              stampEntry.identifier = `${stampEntry.identifier}.dirty`;
              stampEntry.stampedVersion = makeStampedVersion(base, sanitized, origin, `${identifier}.dirty`, useBuildMeta);
            }
          } catch (e) {
            // non-fatal
          }
        }
      }

      const existing = curStore.stamps.find(s => s.stampedVersion === stampEntry.stampedVersion);
      if (existing && !force) {
        throw new Error(`Stamped version ${stampEntry.stampedVersion} already exists in store. Use --force to override.`);
      }

      // backup and write package.json atomically
      const backupPath = backupFile(pkgPath, options.backupDir || defaultBackupDir);
      pkg.version = stampEntry.stampedVersion;
      try {
        writePkgAtomic(pkg);
      } catch (e) {
        throw new Error('Failed to write package.json atomically: ' + (e && e.message ? e.message : e));
      }

      // persist store and write dist manifest
      curStore.stamps.push(stampEntry);
      if (apply) writeStore(storePath, curStore);
      ensureDist();
      // Write the canonical store (or at least the stamps array) to dist for CI/consumers
      atomicWriteFileSync(path.join(distDir, 'version-stamp.json'), JSON.stringify(curStore, null, 2));

      return { action: 'applied', stamp: stampEntry, backup: backupPath };
    });
  } else {
    // not a feature branch: produce a non-mutating stamp record
    const stampEntry = {
      stampedVersion: pkg.version,
      baseVersion: base,
      branch: branch,
      sanitizedBranch: sanitized,
      origin: origin,
      identifier: tokenOverride || gitShortSha(),
      commitShortSha: gitShortSha(),
      timestamp: new Date().toISOString()
    };

    if (!apply) {
      return { action: 'no-op', stamp: stampEntry };
    }

    // if apply requested for non-feature, persist the record but do not mutate package.json
    store.stamps.push(stampEntry);
    writeStore(storePath, store);
    ensureDist();
    atomicWriteFileSync(path.join(distDir, 'version-stamp.json'), JSON.stringify(stampEntry, null, 2));
    return { action: 'recorded', stamp: stampEntry };
  }
}

async function mainCLI() {
  const args = process.argv.slice(2);
  const flags = {
    dryRun: true,
    apply: false,
    force: false,
    token: undefined,
    json: false,
    useBuildMeta: true
  };
  for (const a of args) {
    if (a === '--apply') { flags.apply = true; flags.dryRun = false; }
    else if (a === '--dry-run') { flags.dryRun = true; flags.apply = false; }
    else if (a === '--force' || a === '-f') flags.force = true;
  else if (a.startsWith('--ci-token=')) flags.ciToken = a.split('=')[1];
  else if (a.startsWith('--token=')) flags.token = a.split('=')[1]; // alias for backward compatibility
    else if (a === '--use-counter') flags.useCounter = true;
  else if (a === '--dirty') flags.dirty = true;
    else if (a === '--use-build-meta') flags.useBuildMeta = true;
    else if (a === '--no-build-meta') flags.useBuildMeta = false;
    else if (a === '--json') flags.json = true;
    else if (a.startsWith('--origin=')) flags.origin = a.split('=')[1];
  }

  try {
  const res = await stamp(flags);
    if (flags.json) console.log(JSON.stringify(res, null, 2));
    else console.log(res.action + (res.stamp ? `: ${res.stamp.stampedVersion || res.stamp.baseVersion}` : ''));
    process.exit(0);
  } catch (err) {
    console.error('version-stamp error:', err && err.message ? err.message : err);
    process.exit(2);
  }
}

const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  mainCLI();
}

export { stamp };
