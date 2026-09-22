import { cpSync, mkdirSync, rmSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Copy Vite dist → repo seo-system-300/ for FTP/CI publish.
 *
 * NOTE: The workspace volume may be exFAT (no Unix modes). Local chmod will
 * not stick; production deploys MUST run scripts/deploy-seo-system-300.sh
 * (or scripts/ftp-chmod-tree.py) so remote dirs/files/.htaccess are 755/644.
 * If .htaccess stays 700, Apache 403s the entire /seo-system-300/ tree.
 */

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const dest = path.resolve(root, '../../seo-system-300');

function stripJunk(dir) {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      stripJunk(full);
      continue;
    }
    if (name.startsWith('._') || name === '.DS_Store') {
      unlinkSync(full);
    }
  }
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
cpSync(dist, dest, {
  recursive: true,
  filter: (src) => {
    const base = path.basename(src);
    return !(base.startsWith('._') || base === '.DS_Store');
  },
});
stripJunk(dest);
console.log(`Copied ${dist} → ${dest}`);
console.log(
  '[copy-dist] Reminder: exFAT cannot store Unix modes. Deploy with scripts/deploy-seo-system-300.sh so remote CHMOD 755/644 (incl. .htaccess) is applied.'
);
