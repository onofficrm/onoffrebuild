import { cpSync, mkdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const dest = path.resolve(root, '../../edu');

rmSync(path.join(dest, 'assets'), { recursive: true, force: true });
mkdirSync(dest, { recursive: true });
cpSync(path.join(dist, 'assets'), path.join(dest, 'assets'), { recursive: true });
cpSync(path.join(dist, 'index.html'), path.join(dest, 'index.html'));
console.log(`Copied edu SPA → ${dest}`);
