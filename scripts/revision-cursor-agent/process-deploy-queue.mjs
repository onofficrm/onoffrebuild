#!/usr/bin/env node
/**
 * Drain CRM deployPlan.status=queued tickets via deploy-site.mjs on this Mac.
 *
 * Live upload only when local FTP credentials exist AND
 * SEOSYS300_REVISION_AUTO_DEPLOY=1. Otherwise runs --dry-run so staff can
 * see readiness without uploading.
 *
 * Usage:
 *   ONOFF_CRM_CONTRACT_API_TOKEN=... \
 *     node scripts/revision-cursor-agent/process-deploy-queue.mjs
 *   ... --limit=3 --dry-run
 */
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

function arg(name, fallback = '') {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}
function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

const apiBase =
  arg('api', process.env.ONOFF_REVISIONS_API_URL || 'https://onoff.icrm.co.kr/api/crm/revisions.php');
const token = process.env.ONOFF_CRM_CONTRACT_API_TOKEN || '';
const limit = Math.max(1, Number(arg('limit', '3')) || 3);
const forceDry = hasFlag('dry-run') || process.env.SEOSYS300_REVISION_AUTO_DEPLOY !== '1';
const here = dirname(fileURLToPath(import.meta.url));
const deployer = resolve(here, 'deploy-site.mjs');
const root = resolve(here, '../..');

if (!token) {
  console.error('ONOFF_CRM_CONTRACT_API_TOKEN required');
  process.exit(1);
}

function normalizeHost(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '');
}

function hasLocalFtp(cwd, domain) {
  const candidates = [
    join(cwd || '', 'ops', 'ftp.env'),
    join(homedir(), '.config/onoffmarketing/sites', `${normalizeHost(domain)}.ftp.env`),
  ];
  for (const path of candidates) {
    if (!path || !existsSync(path)) continue;
    let raw = '';
    try {
      raw = readFileSync(path, 'utf8');
    } catch {
      continue;
    }
    const env = {};
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;
      const eq = trimmed.indexOf('=');
      env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    }
    if (env.FTP_SERVER && env.FTP_USERNAME && env.FTP_PASSWORD) return path;
  }
  return '';
}

async function listQueued() {
  const res = await fetch(`${apiBase}?status=open&limit=50`, {
    headers: {
      Accept: 'application/json',
      'X-ONOFF-Contract-Token': token,
    },
  });
  const json = await res.json();
  const items = Array.isArray(json.items) ? json.items : [];
  return items
    .filter((t) => (t.deployPlan?.status || '') === 'queued')
    .slice(0, limit);
}

const queued = await listQueued();
if (!queued.length) {
  console.log('deploy_queue empty');
  process.exit(0);
}

for (const ticket of queued) {
  const tid = Number(ticket.id) || 0;
  const plan = ticket.deployPlan || {};
  const cwd = plan.cwd || ticket.suggestedCwd || '';
  const domain = plan.domain || ticket.orderDomain || '';
  const ftpPath = hasLocalFtp(cwd, domain);
  const dry = forceDry || !ftpPath;
  console.log(
    `ticket=#${tid} domain=${domain || '-'} ftp=${ftpPath || '(none)'} dryRun=${dry ? 1 : 0}`
  );
  const args = [deployer, `--ticketId=${tid}`];
  if (dry) args.push('--dry-run');
  const run = spawnSync(process.execPath, args, {
    cwd: root,
    env: process.env,
    encoding: 'utf8',
    timeout: 200000,
  });
  const out = ((run.stdout || '') + (run.stderr || '')).trim().slice(0, 600);
  if (run.status !== 0) {
    console.error(`deploy failed #${tid}: ${out || run.status}`);
    continue;
  }
  console.log(`deploy ok #${tid}: ${out.split('\n').slice(-3).join(' | ')}`);
}
