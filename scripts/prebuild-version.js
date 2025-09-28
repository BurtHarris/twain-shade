import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pkgPath = path.resolve(__dirname, '../package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

function getBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (e) {
    return 'unknown';
  }
}

function bumpPatch(version) {
  const parts = version.split('-')[0].split('.');
  parts[2] = (parseInt(parts[2], 10) + 1).toString();
  return parts.join('.');
}

const branch = getBranch();
const isMain = branch === 'main' || branch === 'master';
let newVersion = pkg.version;

if (!isMain) {
  // Remove any existing suffix
  newVersion = newVersion.split('-')[0];
  // Bump patch for reload
  newVersion = bumpPatch(newVersion);
  // Add branch suffix
  newVersion += `-${branch}`;
}

if (pkg.version !== newVersion) {
  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  console.log(`[prebuild-version] Updated version to ${newVersion}`);
} else {
  console.log(`[prebuild-version] Version unchanged: ${newVersion}`);
}
