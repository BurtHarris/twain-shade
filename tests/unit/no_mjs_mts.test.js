import fs from 'fs';
import path from 'path';

const IGNORED_DIRS = ['node_modules', '.git'];
const EXTENSIONS = ['.mjs', '.mts', '.jsx', '.tsx'];

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (IGNORED_DIRS.includes(file)) continue;
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(filePath));
    } else {
      if (EXTENSIONS.some(ext => file.endsWith(ext))) {
        results.push(filePath);
      }
    }
  }
  return results;
}

describe('No disallowed script extensions in project (except allowed config)', () => {
  it('should not find any .mjs, .mts, .jsx, or .tsx files outside ignored dirs and allowed config files', () => {
    const root = path.resolve(__dirname, '../../');
    const found = walk(root);
    // Allow some config files (e.g., eslint.config.mts), list any others explicitly here
    const allowed = [
      path.resolve(root, 'eslint.config.mts'),
    ];
    const unexpected = found.filter(f => !allowed.includes(f));
    expect(unexpected).toEqual([]);
  });
});
