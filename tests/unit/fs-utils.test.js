import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { ensureDir, readJsonSafe, atomicWriteFileSync, backupFile, readStore, writeStore } from '../../src/utils/fs-utils.js';

const TMP = path.join(process.cwd(), 'tmp-fs-test');

describe('fs-utils', () => {
  beforeEach(() => {
    if (fs.existsSync(TMP)) fs.rmSync(TMP, { recursive: true, force: true });
    fs.mkdirSync(TMP, { recursive: true });
  });
  afterEach(() => {
    if (fs.existsSync(TMP)) fs.rmSync(TMP, { recursive: true, force: true });
  });

  it('ensureDir creates nested dirs', () => {
    const d = path.join(TMP, 'a', 'b', 'c');
    ensureDir(d);
    expect(fs.existsSync(d)).toBe(true);
  });

  it('readJsonSafe returns null for missing or invalid json', () => {
    expect(readJsonSafe(path.join(TMP, 'nope.json'))).toBeNull();
    fs.writeFileSync(path.join(TMP, 'bad.json'), '{ not: json');
    expect(readJsonSafe(path.join(TMP, 'bad.json'))).toBeNull();
  });

  it('atomicWriteFileSync writes file atomically', () => {
    const p = path.join(TMP, 'file.txt');
    atomicWriteFileSync(p, 'hello');
    expect(fs.readFileSync(p, 'utf8')).toBe('hello');
  });

  it('backupFile creates a timestamped backup', () => {
    const p = path.join(TMP, 'orig.txt');
    fs.writeFileSync(p, 'orig');
    const bdir = path.join(TMP, 'backups');
    const bak = backupFile(p, bdir);
    expect(typeof bak === 'string').toBe(true);
    expect(fs.existsSync(bak)).toBe(true);
  });

  it('readStore/writeStore roundtrip and normalize shape', () => {
    const sp = path.join(TMP, '.version-stamp', 'store.json');
    const store = readStore(sp);
    expect(store).toBeTruthy();
    expect(Array.isArray(store.stamps)).toBe(true);
    store.stamps.push({ stampedVersion: '1.2.3-test' });
    writeStore(sp, store);
    const loaded = readStore(sp);
    expect(Array.isArray(loaded.stamps)).toBe(true);
    expect(loaded.stamps.length).toBeGreaterThan(0);
  });
});
