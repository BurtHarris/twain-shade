const fs = require('fs');
const path = require('path');

const iconPath = path.resolve(__dirname, '../src/extension/icon.svg');

if (!fs.existsSync(iconPath)) {
  console.error('[validate-icon] icon.svg not found in src/extension.');
  process.exit(1);
}

const content = fs.readFileSync(iconPath, 'utf8');
if (!content.trim().startsWith('<svg')) {
  console.error('[validate-icon] icon.svg is not a valid SVG file.');
  process.exit(1);
}

console.log('[validate-icon] icon.svg is valid.');
