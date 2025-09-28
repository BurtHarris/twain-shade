import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function rmRecursiveSafe(p) {
  // On Windows tests can encounter EBUSY for a short time; retry a few times.
  for (let i = 0; i < 5; i++) {
    try {
      if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
      return;
    } catch (e) {
      // small delay then retry
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 50);
    }
  }
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}


function setupRepo(tmp) {
  rmRecursiveSafe(tmp);
  fs.mkdirSync(tmp, { recursive: true });
  const pkg = { name: 'tmp-test', version: '0.1.0' };
  fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify(pkg, null, 2));
  execSync('git init', { cwd: tmp });
  execSync('git config user.email "test@example.com"', { cwd: tmp });
  execSync('git config user.name "Test User"', { cwd: tmp });
  fs.writeFileSync(path.join(tmp, 'README.md'), '# tmp');
  execSync('git add .', { cwd: tmp });
  execSync('git commit -m init', { cwd: tmp });
  execSync('git checkout -b feature/test-branch', { cwd: tmp });
}

// ...rmRecursiveSafe already defined above

describe('stamp variants integration', () => {
  it('accepts --token override for deterministic ID', () => {
    const tmp = path.join(process.cwd(), 'tmp-variant-token');
    try {
      setupRepo(tmp);
  execSync(`node "${path.join(process.cwd(), 'scripts', 'version-stamp.js')}" --origin=launch --apply --ci-token=CI_TOKEN_123`, { cwd: tmp, stdio: 'inherit' });
      const store = JSON.parse(fs.readFileSync(path.join(tmp, 'dist', 'version-stamp.json'), 'utf8'));
      expect(store.stamps.some(s => s.identifier === 'CI_TOKEN_123')).toBe(true);
    } finally {
      rmRecursiveSafe(tmp);
    }
  }, 20000);

  it('appends .dirty when --dirty and worktree has changes', () => {
    const tmp = path.join(process.cwd(), 'tmp-variant-dirty');
    try {
      setupRepo(tmp);
      // make uncommitted change
      fs.writeFileSync(path.join(tmp, 'UNCOMMITTED.md'), 'work');
      execSync('git add UNCOMMITTED.md', { cwd: tmp }); // stage to show dirty state
      execSync(`node "${path.join(process.cwd(), 'scripts', 'version-stamp.js')}" --origin=launch --apply --dirty`, { cwd: tmp, stdio: 'inherit' });
      const store = JSON.parse(fs.readFileSync(path.join(tmp, 'dist', 'version-stamp.json'), 'utf8'));
      const found = store.stamps.find(s => s.stampedVersion.includes('.dirty') || (s.identifier && String(s.identifier).includes('.dirty')));
      expect(Boolean(found)).toBe(true);
    } finally {
      rmRecursiveSafe(tmp);
    }
  }, 20000);

  it('increments counter when --use-counter on launch and apply', () => {
    const tmp = path.join(process.cwd(), 'tmp-variant-counter');
    try {
      setupRepo(tmp);
      // first apply with counter
      execSync(`node "${path.join(process.cwd(), 'scripts', 'version-stamp.js')}" --origin=launch --apply --use-counter`, { cwd: tmp, stdio: 'inherit' });
      const store1 = JSON.parse(fs.readFileSync(path.join(tmp, 'dist', 'version-stamp.json'), 'utf8'));
  // find the latest stamp for our feature branch
      const last1 = store1.stamps.slice().reverse().find(s => s.sanitizedBranch && s.sanitizedBranch.startsWith('feature'));
      if (!last1) {
        throw new Error('No stamp found after first apply. store1=' + JSON.stringify(store1, null, 2));
      }

      // second apply should increment counter for same base/sanitized
      execSync(`node "${path.join(process.cwd(), 'scripts', 'version-stamp.js')}" --origin=launch --apply --use-counter`, { cwd: tmp, stdio: 'inherit' });
      const store2 = JSON.parse(fs.readFileSync(path.join(tmp, 'dist', 'version-stamp.json'), 'utf8'));
      const last2 = store2.stamps.slice().reverse().find(s => s.sanitizedBranch && s.sanitizedBranch.startsWith('feature'));
      if (!last2) {
        throw new Error('No stamp found after second apply. store2=' + JSON.stringify(store2, null, 2));
      }

      function parseCounter(s) {
        if (s === undefined || s === null) return NaN;
        // if it's a number already
        if (typeof s === 'number') return s;
        const str = String(s).replace(/\.dirty$/, '');
        const asNum = Number(str);
        if (!Number.isNaN(asNum)) return asNum;
        // try to extract from stampedVersion build metadata: e.g., 1.2.3-feature+counter.3
        return NaN;
      }

      let id1 = parseCounter(last1.identifier);
      let id2 = parseCounter(last2.identifier);
      // fallback: try to parse from stampedVersion build metadata
      if (Number.isNaN(id1) && last1 && last1.stampedVersion) {
        const m = String(last1.stampedVersion).split('+')[1];
        if (m) {
          const maybe = m.replace(/^counter\./, '').replace(/\.dirty$/, '');
          const n = Number(maybe);
          if (!Number.isNaN(n)) id1 = n;
        }
      }
      if (Number.isNaN(id2) && last2 && last2.stampedVersion) {
        const m = String(last2.stampedVersion).split('+')[1];
        if (m) {
          const maybe = m.replace(/^counter\./, '').replace(/\.dirty$/, '');
          const n = Number(maybe);
          if (!Number.isNaN(n)) id2 = n;
        }
      }

      if (Number.isNaN(id1) || Number.isNaN(id2)) {
        throw new Error('Failed to parse counter ids: id1=' + id1 + ' id2=' + id2 + ' store1=' + JSON.stringify(store1, null, 2) + ' store2=' + JSON.stringify(store2, null, 2));
      }
      expect(id2).toBeGreaterThan(id1);
    } finally {
      rmRecursiveSafe(tmp);
    }
  }, 20000);
});
