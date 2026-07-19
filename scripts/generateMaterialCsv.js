// scripts/generateMaterialCsv.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseDir = path.resolve(__dirname, '..', 'public', 'dataset', 'material');
const outFile = path.join(baseDir, 'material.csv');
let lines = ['image_path,material'];
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (entry.isFile()) {
      const rel = path.relative(baseDir, full).replace(/\\/g, '/');
      const material = path.basename(path.dirname(full)); // folder name = material
      lines.push(`${rel},${material}`);
    }
  }
}
walk(baseDir);
fs.writeFileSync(outFile, lines.join('\n'));
console.log('Generated', outFile, 'with', lines.length - 1, 'entries');
