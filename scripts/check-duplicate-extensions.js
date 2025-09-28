#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const scriptsDir = path.resolve(process.cwd(), 'scripts');
const entries = fs.readdirSync(scriptsDir, { withFileTypes: true });

const exts = ['.js', '.cjs', '.mjs'];
const map = new Map();

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

if (collisions.length > 0) {
  console.error('[check-duplicate-extensions] Found script basename collisions:');
  for (const c of collisions) {
    console.error(` - ${c.base}: ${c.exts.join(', ')}`);
  }
  console.error('\nPlease keep only one module format per script (prefer ESM .js for this repo).');
  process.exit(2);
}

console.log('[check-duplicate-extensions] No duplicate script extensions found.');
process.exit(0);
