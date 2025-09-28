import fs from 'fs';
import path from 'path';

/** Ensure a directory exists (recursive). */
export function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/** Read JSON from a path, returning null on parse/read errors. */
export function readJsonSafe(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return null;
  }
}

/** Atomic write to a path using a temp file and rename. */
export function atomicWriteFileSync(filePath, data) {
  const tmp = `${filePath}.${Date.now()}.tmp`;
  fs.writeFileSync(tmp, data, {encoding: 'utf8'});
  fs.renameSync(tmp, filePath);
}

/**
 * Create a timestamped backup of a file in backupDir. Returns backup path or null.
 * @returns {string|null}
 */
export function backupFile(filePath, backupDir) {
  try {
    if (!fs.existsSync(filePath)) return null;
    ensureDir(backupDir);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const base = path.basename(filePath);
    const bak = path.join(backupDir, `${base}.bak.${timestamp}`);
    fs.copyFileSync(filePath, bak, fs.constants.COPYFILE_EXCL);
    return bak;
  } catch (e) {
    console.warn('Warning: failed to create backup for', filePath, e && e.message ? e.message : e);
    return null;
  }
}

/** Read canonical store and normalize shape. */
export function readStore(storePath) {
  const s = readJsonSafe(storePath);
  if (!s || typeof s !== 'object') return {counters: {}, stamps: []};
  if (!s.counters) s.counters = {};
  if (!s.stamps) s.stamps = [];
  return s;
}

/** Write canonical store atomically. */
export function writeStore(storePath, obj) {
  ensureDir(path.dirname(storePath));
  atomicWriteFileSync(storePath, JSON.stringify(obj, null, 2));
}
