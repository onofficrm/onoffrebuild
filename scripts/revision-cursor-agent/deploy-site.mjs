#!/usr/bin/env node
/**
 * Deploy changed files for a homepage-revision ticket.
 *
 * Usage:
 *   ONOFF_CRM_CONTRACT_API_TOKEN=... \
 *     node scripts/revision-cursor-agent/deploy-site.mjs --ticketId=5
 *
 * Optional:
 *   --dry-run
 *   --cwd=/path/to/site
 *
 * FTP credentials (first match wins):
 *   1) $cwd/ops/ftp.env
 *   2) ~/.config/onoffmarketing/sites/<domain>.ftp.env
 *
 * Do not reuse the shared ~/.config/onoffmarketing/ftp.env (platform host).
 */
import { readFileSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

function arg(name, fallback = '') {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}
function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function loadEnvFile(path) {
  if (!path || !existsSync(path)) return {};
  const out = {};
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function normalizeHost(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '');
}

const ticketId = Number(arg('ticketId', '0'));
const dryRun = hasFlag('dry-run');
const cliCwd = arg('cwd', '');
const apiBase =
  arg('api', process.env.ONOFF_REVISIONS_API_URL || 'https://onoff.icrm.co.kr/api/crm/revisions.php');
const token = process.env.ONOFF_CRM_CONTRACT_API_TOKEN || '';
const here = dirname(fileURLToPath(import.meta.url));

if (ticketId < 1) {
  console.error('--ticketId required');
  process.exit(1);
}
if (!token) {
  console.error('ONOFF_CRM_CONTRACT_API_TOKEN required');
  process.exit(1);
}

async function api(method, body) {
  const res = await fetch(apiBase, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-ONOFF-Contract-Token': token,
      'X-ONOFF-CRM-Actor': 'deploy-site',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let json = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    json = { message: text };
  }
  if (!res.ok || json.ok === false) {
    throw new Error(json.message || json.error || `HTTP ${res.status}`);
  }
  return json;
}

async function loadTicket() {
  const res = await fetch(`${apiBase}?ticketId=${ticketId}`, {
    headers: {
      Accept: 'application/json',
      'X-ONOFF-Contract-Token': token,
    },
  });
  const json = await res.json();
  const item = json.item || json.ticket || json;
  if (!item?.id) throw new Error('ticket not found');
  return item;
}

function resolveFtpEnv(cwd, domain) {
  const candidates = [
    join(cwd, 'ops', 'ftp.env'),
    join(homedir(), '.config/onoffmarketing/sites', `${normalizeHost(domain)}.ftp.env`),
  ];
  for (const path of candidates) {
    const env = loadEnvFile(path);
    if (env.FTP_SERVER && env.FTP_USERNAME && env.FTP_PASSWORD) {
      return { ...env, _source: path };
    }
  }
  return null;
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
}

const ticket = await loadTicket();
const plan = ticket.deployPlan || {};
const checklist = ticket.deployChecklist || {};
const cwd = resolve(cliCwd || plan.cwd || ticket.workPackage?.cwd || ticket.suggestedCwd || '');
const files = Array.isArray(plan.changedFiles)
  ? plan.changedFiles
  : Array.isArray(checklist.changedFiles)
    ? checklist.changedFiles
    : [];
const domain = plan.domain || ticket.orderDomain || '';

console.log(
  `ticket=#${ticketId} domain=${domain || '-'} cwd=${cwd} files=${files.length} dryRun=${dryRun ? 1 : 0}`
);

if (!plan.ready && !checklist.ready) {
  console.error('deploy checklist not ready');
  process.exit(2);
}
if (!cwd || !existsSync(cwd)) {
  console.error(`cwd missing or not found: ${cwd}`);
  process.exit(2);
}
if (!files.length) {
  console.error('no changedFiles on ticket');
  process.exit(2);
}

const missing = files.filter((rel) => !existsSync(join(cwd, rel)));
if (missing.length) {
  console.error('missing local files:\n' + missing.join('\n'));
  process.exit(2);
}

if (dryRun) {
  console.log('--- dry-run files ---');
  for (const rel of files) console.log(rel);
  const ftp = resolveFtpEnv(cwd, domain);
  console.log(ftp ? `ftp credentials: ${ftp._source}` : 'ftp credentials: (none found)');
  await api('POST', {
    action: 'deploy_status',
    ticketId,
    deployStatus: 'preview',
    note: `dry-run ${files.length} file(s)` + (ftp ? `; ftp ok` : '; ftp missing'),
    ftpConfigured: Boolean(ftp),
  });
  process.exit(0);
}

const ftp = resolveFtpEnv(cwd, domain);
if (!ftp) {
  console.error(
    'FTP credentials not found. Put ops/ftp.env under the site cwd, or ~/.config/onoffmarketing/sites/<domain>.ftp.env'
  );
  await api('POST', {
    action: 'deploy_status',
    ticketId,
    deployStatus: 'failed',
    deployError: 'FTP credentials missing',
  });
  process.exit(3);
}

await api('POST', {
  action: 'deploy_status',
  ticketId,
  deployStatus: 'running',
});

const remoteRoot = ftp.FTP_REMOTE_ROOT || ftp.REMOTE_ROOT || '/public_html';
const port = ftp.FTP_PORT || '21';
const script = [
  'set ftp:ssl-allow no',
  'set net:max-retries 2',
  'set net:timeout 90',
  `open -u ${ftp.FTP_USERNAME},${ftp.FTP_PASSWORD} -p ${port} ftp://${ftp.FTP_SERVER}`,
  `cd ${remoteRoot}`,
  `lcd ${cwd}`,
];
for (const rel of files) {
  const dir = dirname(rel).replace(/\\/g, '/');
  if (dir && dir !== '.') {
    script.push(`mkdir -p ${dir}`);
    script.push(`put -O ${dir} ${rel}`);
  } else {
    script.push(`put ${rel}`);
  }
}
script.push('bye');

const lftp = spawnSync('lftp', ['-c', script.join('; ')], {
  encoding: 'utf8',
  timeout: 180000,
});
if (lftp.status !== 0) {
  const err = (lftp.stderr || lftp.stdout || 'lftp failed').slice(0, 400);
  console.error(err);
  await api('POST', {
    action: 'deploy_status',
    ticketId,
    deployStatus: 'failed',
    deployError: err,
  });
  process.exit(lftp.status || 1);
}

await api('POST', {
  action: 'deploy_status',
  ticketId,
  deployStatus: 'completed',
  note: `deployed ${files.length} file(s) via ${ftp._source}`,
});
console.log(`deployed ${files.length} file(s) ok`);
