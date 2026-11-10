#!/usr/bin/env node
/**
 * Run a queued ONOFF homepage-revision Cursor package, then post feedback.
 *
 * Usage:
 *   CURSOR_API_KEY=... ONOFF_CRM_CONTRACT_API_TOKEN=... \
 *     node scripts/revision-cursor-agent/run.mjs --ticketId=4
 *
 * Optional:
 *   --cwd=/path/to/site/repo
 *   --dry-run          print prompt only
 *   --package=/path/to/ticket-4.json
 *
 * cwd resolution: --cwd > package.cwd > SEOSYS300_REVISION_SITE_CWD_MAP[orderDomain] > process.cwd()
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

function arg(name, fallback = '') {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

function loadDomainCwdMap() {
  const raw = process.env.SEOSYS300_REVISION_SITE_CWD_MAP || '';
  if (!raw.trim()) return {};
  try {
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function normalizeHost(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//i, '')
    .replace(/\/.*$/, '');
}

function isPlatformRepo(cwdPath) {
  const abs = resolve(cwdPath);
  // Never let a customer-domain ticket edit the ONOFF platform tree.
  return /\/platform\/onoff-home(?:\/|$)/.test(abs) || /\/onoff-home(?:\/|$)/.test(abs);
}

function cwdFromDomainMap(domain) {
  if (!domain) return '';
  const map = loadDomainCwdMap();
  for (const [host, path] of Object.entries(map)) {
    const key = normalizeHost(host);
    if (!key || !path) continue;
    if (key === domain || key === `www.${domain}` || `www.${key}` === domain) {
      return resolve(String(path));
    }
  }
  return '';
}

function resolveCwd(pkg, cliCwd) {
  const domain = normalizeHost(pkg.orderDomain || '');
  const mapped = cwdFromDomainMap(domain);
  const packageCwd = pkg.cwd && String(pkg.cwd).trim() ? resolve(String(pkg.cwd).trim()) : '';
  const candidates = [];
  if (cliCwd) candidates.push(resolve(cliCwd));
  // Prefer domain map over a stale package.cwd that still points at the platform repo.
  if (mapped) candidates.push(mapped);
  if (packageCwd) candidates.push(packageCwd);
  candidates.push(process.cwd());

  let chosen = '';
  for (const candidate of candidates) {
    if (!candidate) continue;
    if (domain && domain !== 'onoff.icrm.co.kr' && isPlatformRepo(candidate)) {
      continue;
    }
    chosen = candidate;
    break;
  }

  if (!chosen) {
    throw new Error(
      `No safe cwd for customer domain ${domain || '(none)'}. ` +
        `Set SEOSYS300_REVISION_SITE_CWD_MAP to /Volumes/onoff/cursor/sites/<customer>.`
    );
  }
  return chosen;
}

function extractConfirmUrl(text, pkg) {
  const blob = String(text || '');
  const urls = blob.match(/https?:\/\/[^\s)\]"'<>]+/g) || [];
  const clean = (u) => String(u || '').replace(/[.,;:*]+$/g, '').replace(/\*+$/g, '');
  const preferredHost = normalizeHost(pkg.orderDomain || pkg.siteUrl || '');
  if (preferredHost) {
    const hit = urls.find((u) => normalizeHost(u).includes(preferredHost.replace(/^www\./, '')));
    if (hit) return clean(hit);
  }
  if (urls[0]) return clean(urls[0]);
  if (pkg.pageUrl) return String(pkg.pageUrl);
  if (pkg.siteUrl) return String(pkg.siteUrl);
  return '';
}

function extractPathsFromText(text) {
  const blob = String(text || '');
  const hits = blob.match(/(?:^|\s)((?:[\w.-]+\/)+[\w.-]+\.[a-zA-Z0-9]{1,8})/gm) || [];
  const out = [];
  const seen = new Set();
  for (const raw of hits) {
    const path = String(raw).trim().replace(/^[`'"]+|[`'"]+$/g, '');
    if (!path || seen.has(path)) continue;
    seen.add(path);
    out.push(path);
    if (out.length >= 40) break;
  }
  return out;
}

function collectGitChangeSummary(cwd) {
  const empty = { changedFiles: [], diffStat: '' };
  if (!cwd || !existsSync(cwd)) return empty;
  try {
    const nameOnly = execFileSync(
      'git',
      ['-C', cwd, 'status', '--porcelain', '-uall'],
      { encoding: 'utf8', timeout: 8000 }
    );
    const files = [];
    const seen = new Set();
    for (const line of String(nameOnly || '').split('\n')) {
      if (!line.trim()) continue;
      const path = line.slice(3).trim().replace(/^"+|"+$/g, '').split(' -> ').pop();
      if (!path || seen.has(path)) continue;
      seen.add(path);
      files.push(path);
      if (files.length >= 40) break;
    }
    let diffStat = '';
    try {
      diffStat = execFileSync(
        'git',
        ['-C', cwd, 'diff', '--stat', 'HEAD'],
        { encoding: 'utf8', timeout: 8000 }
      ).trim().slice(0, 1800);
    } catch {
      /* untracked-only or no HEAD */
    }
    if (!diffStat && files.length) {
      diffStat = `${files.length} file(s) changed (working tree)`;
    }
    return { changedFiles: files, diffStat };
  } catch {
    return empty;
  }
}

const ticketId = Number(arg('ticketId', '0'));
const packagePath = arg('package', ticketId > 0 ? '' : '');
const cliCwd = arg('cwd', '');
const dryRun = hasFlag('dry-run');
const apiBase = arg('api', process.env.ONOFF_REVISIONS_API_URL || 'https://onoff.icrm.co.kr/api/crm/revisions.php');
const token = process.env.ONOFF_CRM_CONTRACT_API_TOKEN || '';

async function loadPackage() {
  if (packagePath) {
    return JSON.parse(readFileSync(resolve(packagePath), 'utf8'));
  }
  if (ticketId < 1) {
    throw new Error('--ticketId or --package required');
  }
  if (!token) {
    throw new Error('ONOFF_CRM_CONTRACT_API_TOKEN required to download package');
  }
  const url = `${apiBase}?ticketId=${ticketId}&package=json`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'X-ONOFF-Contract-Token': token,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`package download failed ${res.status}: ${text.slice(0, 200)}`);
  }
  return JSON.parse(text);
}

async function postFeedback(pkg, note, agentRunId = '', feedbackUrl = '', extra = {}) {
  if (!token) {
    throw new Error('ONOFF_CRM_CONTRACT_API_TOKEN required to post feedback');
  }
  const body = {
    action: 'feedback',
    ticketId: pkg.ticketId,
    note,
    feedbackNote: note,
    feedbackUrl: feedbackUrl || pkg.pageUrl || pkg.siteUrl || '',
    author: 'cursor-agent',
    dispatchStatus: 'completed',
    agentRunId,
    cwd: extra.cwd || '',
    changedFiles: Array.isArray(extra.changedFiles) ? extra.changedFiles.slice(0, 40) : [],
    diffStat: String(extra.diffStat || '').slice(0, 2000),
  };
  if (!body.feedbackUrl) {
    throw new Error('feedbackUrl required: set pageUrl/siteUrl on package or include a URL in the agent result');
  }
  const res = await fetch(apiBase, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-ONOFF-Contract-Token': token,
      'X-ONOFF-CRM-Actor': 'cursor-agent',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`feedback failed ${res.status}: ${text.slice(0, 200)}`);
  }
  return JSON.parse(text);
}

async function runAgent(prompt, cwd) {
  const apiKey = process.env.CURSOR_API_KEY || '';
  if (!apiKey) {
    return {
      skipped: true,
      result:
        'CURSOR_API_KEY missing. Package downloaded; run again with CURSOR_API_KEY to execute, or paste the prompt into Cursor manually.',
    };
  }
  const sdkPath = resolve(process.cwd(), 'node_modules/@cursor/sdk/dist/index.js');
  const alt = '@cursor/sdk';
  let Agent;
  try {
    ({ Agent } = await import(existsSync(sdkPath) ? sdkPath : alt));
  } catch (err) {
    throw new Error(
      `@cursor/sdk not installed. Run: npm i @cursor/sdk  (${err instanceof Error ? err.message : err})`
    );
  }
  const result = await Agent.prompt(prompt, {
    apiKey,
    model: { id: process.env.CURSOR_AGENT_MODEL || 'composer-2.5' },
    local: { cwd },
  });
  return {
    skipped: false,
    status: result.status,
    result: result.result || '',
    agentRunId: result.id || result.runId || '',
  };
}

const pkg = await loadPackage();
const prompt = String(pkg.prompt || '');
if (!prompt.trim()) {
  throw new Error('package.prompt empty');
}

const cwd = resolveCwd(pkg, cliCwd);
console.log(
  `ticket=#${pkg.ticketId} title=${pkg.title || ''} domain=${pkg.orderDomain || '-'} cwd=${cwd}`
);
if (dryRun) {
  console.log('--- prompt ---');
  console.log(prompt);
  process.exit(0);
}

const agent = await runAgent(prompt, cwd);
console.log('agent', agent.skipped ? 'skipped' : agent.status || 'done');

const note = [
  agent.skipped ? '커서 에이전트 자동 실행은 API 키 없이 대기열만 확인했습니다.' : '커서 에이전트가 작업을 마쳤습니다.',
  agent.result ? String(agent.result).slice(0, 1800) : '',
]
  .filter(Boolean)
  .join('\n\n');

const feedbackUrl = extractConfirmUrl(agent.result || '', pkg);
const gitSummary = collectGitChangeSummary(cwd);
const textPaths = extractPathsFromText(agent.result || '');
const changedFiles = gitSummary.changedFiles.length ? gitSummary.changedFiles : textPaths;
const diffStat = gitSummary.diffStat || (changedFiles.length ? `${changedFiles.length} path(s) from agent result` : '');
console.log(
  `changes files=${changedFiles.length}` +
    (diffStat ? ` stat=${diffStat.split('\n').slice(-1)[0]}` : '')
);
if (token) {
  const saved = await postFeedback(pkg, note, agent.agentRunId || '', feedbackUrl, {
    cwd,
    changedFiles,
    diffStat,
  });
  console.log('feedback ok', saved?.item?.status || saved?.ok || true, 'url', feedbackUrl || '(none)');
} else {
  console.log('skip feedback (no CRM token)');
}
