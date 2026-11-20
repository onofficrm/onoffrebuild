#!/usr/bin/env node
/**
 * Sync Vite dist → Bridge import for ONOFF Builder official website.
 *
 * Default target: plugin/onoff-builder-bridge/imports/onoff-builder-official/
 * Staging target:  …/onoff-builder-official-staging/  (--staging)
 *
 * Does NOT:
 * - touch imports/onoffmarketing/ (production renewal)
 * - FTP upload
 * - change home_builder_bridge_id
 *
 * Usage:
 *   node scripts/sync-builder-official-import.mjs
 *   node scripts/sync-builder-official-import.mjs --staging
 *   node scripts/sync-builder-official-import.mjs --dry-run
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const spaRoot = path.resolve(__dirname, '..');
const repoRoot = path.resolve(spaRoot, '../..');
const distDir = path.join(spaRoot, 'dist');
const dryRun = process.argv.includes('--dry-run');
const staging = process.argv.includes('--staging');
const importId = staging ? 'onoff-builder-official-staging' : 'onoff-builder-official';
const targetDir = path.join(repoRoot, 'plugin/onoff-builder-bridge/imports', importId);

function rmrf(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      if (name === '.' || name === '..' || name.startsWith('._')) continue;
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function main() {
  if (!fs.existsSync(path.join(distDir, 'index.html'))) {
    console.error('[sync:official] dist/ missing. Run: npm run build');
    process.exit(1);
  }

  console.log('[sync:official] source:', distDir);
  console.log('[sync:official] target:', targetDir);
  console.log('[sync:official] importId:', importId);
  console.log('[sync:official] dryRun:', dryRun);
  console.log('[sync:official] imports/onoffmarketing/ will NOT be modified');

  if (dryRun) {
    const walk = (dir, prefix = '') => {
      for (const name of fs.readdirSync(dir)) {
        if (name.startsWith('._')) continue;
        const full = path.join(dir, name);
        const rel = prefix + name;
        if (fs.statSync(full).isDirectory()) walk(full, rel + '/');
        else console.log('  would copy', rel);
      }
    };
    walk(distDir);
    return;
  }

  rmrf(targetDir);
  fs.mkdirSync(targetDir, { recursive: true });
  copyRecursive(distDir, targetDir);

  fs.writeFileSync(
    path.join(targetDir, staging ? 'STAGING.txt' : 'OFFICIAL.txt'),
    [
      staging
        ? 'ONOFF Builder official website STAGING build'
        : 'ONOFF Builder official website import',
      `syncedAt=${new Date().toISOString()}`,
      'Production home_builder_bridge_id change requires canary approval',
      'imports/onoffmarketing untouched',
      '',
    ].join('\n'),
    'utf8'
  );

  console.log('[sync:official] done');
}

main();
