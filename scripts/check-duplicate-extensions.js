#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const cwd = process.cwd();
const scriptsDir = path.resolve(cwd, 'scripts');
const entries = fs.readdirSync(scriptsDir, { withFileTypes: true });

const exts = ['.js', '.cjs', '.mjs', '.jsx', '.tsx'];
const map = new Map();

// Read package.json to inspect build script reference (only used when reporting collisions)
let pkg = null;
try {
  const pkgPath = path.resolve(cwd, 'package.json');
  pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
} catch (err) {
  // ignore — absence of package.json will only change the advice output when collisions occur
}

for (const e of entries) {
  if (!e.isFile()) continue;
  const ext = path.extname(e.name).toLowerCase();
  if (!exts.includes(ext)) continue;
  const base = path.basename(e.name, ext);
  if (!map.has(base)) map.set(base, new Set());
  map.get(base).add(ext);
}

const collisions = [];
for (const [base, set] of map.entries()) {
  if (set.size > 1) collisions.push({ base, exts: [...set] });
}

// (no-op) Previously had a helper to explain the build script; logic is now inline below.

if (collisions.length > 0) {
  console.error('[check-duplicate-extensions] Found script basename collisions:');
  for (const c of collisions) {
    console.error(` - ${c.base}: ${c.exts.join(', ')}`);
  }

  // If we have package.json, analyze the build script and give targeted advice
  if (pkg && pkg.scripts && pkg.scripts.build) {
    const build = pkg.scripts.build;
    console.error('\nBuild script analysis:');
    console.error(` - package.json "build" script: ${build}`);
    const m = build.match(/check-duplicate-extensions(\.(\w+))?/);
    if (m) {
      const referencedExt = m[2] || 'js';
      console.error(` - It references: check-duplicate-extensions.${referencedExt}`);
      if (referencedExt !== 'js') {
        console.error('\nAdvice: The repository standard is ESM .js scripts.');
        console.error(` - Update package.json to reference check-duplicate-extensions.js (instead of .${referencedExt}).`);
      } else {
        console.error('\nAdvice: The build script references the .js checker. Remove the duplicate files listed above to satisfy the check.');
      }
    } else {
      console.error(' - Advice: Consider referencing the ESM checker at scripts/check-duplicate-extensions.js before running builds.');
    }
  } else {
    console.error('\nNo build script found in package.json to analyze.');
    console.error('Advice: Ensure your build pipeline runs scripts/check-duplicate-extensions.js before prebuild and vite build.');
  }

  console.error('\nPlease keep only one module format per script (prefer ESM .js for this repo).');
  process.exit(2);
}

// Silent success: do not print anything when there are no collisions
process.exit(0);
