import {describe, it, expect} from 'vitest';
import fs from 'fs';
import path from 'path';
import {execSync} from 'child_process';

describe('launch stamping integration', () => {
  it('increments counter and mutates package.json in a temp repo', () => {
    const tmp = path.join(process.cwd(), 'tmp-test-repo');
    try {
      if (fs.existsSync(tmp)) fs.rmSync(tmp, {recursive: true, force: true});
      fs.mkdirSync(tmp, {recursive: true});
      // init minimal package
      const pkg = {name: 'tmp-test', version: '0.1.0'};
      fs.writeFileSync(path.join(tmp, 'package.json'), JSON.stringify(pkg, null, 2));
      execSync('git init', {cwd: tmp});
      execSync('git config user.email "test@example.com"', {cwd: tmp});
      execSync('git config user.name "Test User"', {cwd: tmp});
      fs.writeFileSync(path.join(tmp, 'README.md'), '# tmp');
      execSync('git add .', {cwd: tmp});
      execSync('git commit -m init', {cwd: tmp});
      execSync('git checkout -b feature/test-branch', {cwd: tmp});

  // run the version-stamp script in tmp (apply the change)
  execSync(`node "${path.join(process.cwd(), 'scripts', 'version-stamp.js')}" --origin=launch --apply`, {cwd: tmp, stdio: 'inherit'});

      const writtenPkg = JSON.parse(fs.readFileSync(path.join(tmp, 'package.json'), 'utf8'));
      expect(writtenPkg.version).not.toBe('0.1.0');
      const store = JSON.parse(fs.readFileSync(path.join(tmp, 'dist', 'version-stamp.json'), 'utf8'));
      expect(store).toBeTruthy();
      expect(Array.isArray(store.stamps)).toBe(true);
      expect(store.stamps.length).toBeGreaterThan(0);
    } finally {
      // cleanup
      if (fs.existsSync(tmp)) fs.rmSync(tmp, {recursive: true, force: true});
    }
  }, 20000);
});
