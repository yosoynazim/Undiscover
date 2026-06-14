#!/usr/bin/env node
/**
 * Wrapper de desarrollo para Strapi con TypeScript.
 *
 * Problema: `strapi develop` limpia dist/, compila TS (solo .ts→.js),
 * pero NO copia los schema.json de content-types. Strapi los busca en
 * dist/src/api/ y no los encuentra → content types indefinidos.
 *
 * Solución: compilar TS + copiar JSON + arrancar con `strapi start --watch-admin`.
 */

const { execSync, spawn } = require('child_process');
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
  console.log('[dev] schema.json → dist/ copiados');
}

// 1. Limpiar dist (excepto build/) + caché incremental
if (fs.existsSync(path.join(root, 'dist'))) {
  for (const entry of fs.readdirSync(path.join(root, 'dist'))) {
    if (entry !== 'build') {
      fs.rmSync(path.join(root, 'dist', entry), { recursive: true, force: true });
    }
  }
  console.log('[dev] dist/ limpiado');
}
// Eliminar caché incremental para forzar recompilación completa
const tsBuildInfo = path.join(root, '.tsbuildinfo');
if (fs.existsSync(tsBuildInfo)) fs.rmSync(tsBuildInfo);

// 2. Compilar TypeScript
console.log('[dev] Compilando TypeScript...');
execSync('node_modules/.bin/tsc --skipLibCheck', { cwd: root, stdio: 'inherit' });

// 3. Copiar schema.json al dist
copyJsonFiles();

// 4. Arrancar Strapi (modo sin re-clean del dist)
console.log('[dev] Iniciando Strapi...');
const strapi = spawn('node_modules/.bin/strapi', ['start'], {
  cwd: root,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' },
});

strapi.on('close', (code) => process.exit(code));
