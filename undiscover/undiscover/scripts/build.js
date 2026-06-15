#!/usr/bin/env node
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const root = path.resolve(__dirname, '..');
const srcApi = path.join(root, 'src', 'api');
const distApi = path.join(root, 'dist', 'src', 'api');

function copyJsonFiles() {
  if (!fs.existsSync(srcApi)) return;
  function walk(dir, destDir) {
    fs.mkdirSync(destDir, { recursive: true });
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const src = path.join(dir, entry.name);
      const dest = path.join(destDir, entry.name);
      if (entry.isDirectory()) {
        walk(src, dest);
      } else if (entry.name.endsWith('.json')) {
        fs.copyFileSync(src, dest);
      }
    }
  }
  walk(srcApi, distApi);
  console.log('[build] schema.json files copied to dist/');
}

// Clean dist (keep build/)
if (fs.existsSync(path.join(root, 'dist'))) {
  for (const entry of fs.readdirSync(path.join(root, 'dist'))) {
    if (entry !== 'build') {
      fs.rmSync(path.join(root, 'dist', entry), { recursive: true, force: true });
    }
  }
}

// Compile TypeScript
console.log('[build] Compiling TypeScript...');
execSync('node_modules/.bin/tsc --skipLibCheck', { cwd: root, stdio: 'inherit' });

// Copy schema.json
copyJsonFiles();

// Build Strapi admin panel
console.log('[build] Building Strapi admin panel...');
execSync('node_modules/.bin/strapi build', { cwd: root, stdio: 'inherit' });

console.log('[build] Build complete!');
