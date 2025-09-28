export function sanitizeBranch(branch) {
  if (!branch) return 'feature';
  let s = branch.toLowerCase();
  s = s.replace(/^refs\/heads\//, '');
  s = s.replace(/[^a-z0-9.-]+/g, '-');
  s = s.replace(/-+/g, '-');
  s = s.replace(/^[-.]+|[-.]+$/g, '');
  if (!s) return 'feature';
  if (s.length > 40) s = s.slice(0, 40);
  return s;
}

export function bumpPatch(version) {
  const [main] = version.split('-');
  const parts = main.split('.').map(p => parseInt(p, 10) || 0);
  while (parts.length < 3) parts.push(0);
  parts[2] = parts[2] + 1;
  return parts.join('.');
}
