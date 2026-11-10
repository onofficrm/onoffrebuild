#!/usr/bin/env node
/**
 * Poll CRM for queued homepage-revision dispatches and run them via run.mjs.
 *
 * Usage:
 *   CURSOR_API_KEY=... ONOFF_CRM_CONTRACT_API_TOKEN=... \
 *     node scripts/revision-cursor-agent/worker.mjs
 *
 * Optional:
 *   --once                 process current queue then exit
 *   --interval=30          poll seconds (default 30)
 *   --status=open          list filter (default open)
 *   --limit=3              max tickets per poll
 */
import { spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  writeFileSync,
  readFileSync,
  unlinkSync,
  appendFileSync,
} from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { homedir } from 'node:os';

function arg(name, fallback = '') {
  const hit = process.argv.find((a) => a.startsWith(`--${name}=`));
  return hit ? hit.slice(name.length + 3) : fallback;
}

function hasFlag(name) {
  return process.argv.includes(`--${name}`);
}

const once = hasFlag('once');
const intervalSec = Math.max(5, Number(arg('interval', '30')) || 30);
const status = arg('status', 'open');
const limit = Math.max(1, Number(arg('limit', '3')) || 3);
const apiBase = arg('api', process.env.ONOFF_REVISIONS_API_URL || 'https://onoff.icrm.co.kr/api/crm/revisions.php');
const token = process.env.ONOFF_CRM_CONTRACT_API_TOKEN || '';
const here = dirname(fileURLToPath(import.meta.url));
// LaunchAgent may hang reading ESM from /Volumes; prefer ONOFF_PLATFORM_ROOT
// when the worker script itself is mirrored onto the internal home disk.
const root = resolve(process.env.ONOFF_PLATFORM_ROOT || resolve(here, '../..'));
const runner = resolve(here, 'run.mjs');
const volLockDir = resolve(root, 'data/revision_agent_worker');
// LaunchAgent often cannot write to /Volumes (macOS TCC → Operation not permitted).
// Keep runtime state + logs on the internal home disk.
const homeLockDir = resolve(
  homedir(),
  'Library/Application Support/onoff-revision-worker/state'
);
const lockDir = process.env.SEOSYS300_REVISION_WORKER_STATE_DIR
  ? resolve(process.env.SEOSYS300_REVISION_WORKER_STATE_DIR)
  : homeLockDir;
const lockPath = resolve(lockDir, 'worker.pid');
const retryStatePath = resolve(lockDir, 'auto-retry.json');
const workerLogPath = process.env.SEOSYS300_REVISION_WORKER_LOG
  ? resolve(process.env.SEOSYS300_REVISION_WORKER_LOG)
  : resolve(homedir(), 'Library/Application Support/onoff-revision-worker/logs/worker.log');
const inFlight = new Set();
const autoRetryMax = Math.max(0, Number(process.env.SEOSYS300_REVISION_AUTO_RETRY_MAX || '2') || 2);
const autoRetryAfterSec = Math.max(
  60,
  Number(process.env.SEOSYS300_REVISION_AUTO_RETRY_AFTER_SEC || '300') || 300
);

// Never mkdir/write /Volumes during module init — LaunchAgent can hang on TCC.
try {
  mkdirSync(lockDir, { recursive: true });
  mkdirSync(dirname(workerLogPath), { recursive: true });
} catch {
  // ignore
}
try {
  if (process.stdout?.isTTY === false && process.stdout._handle?.setBlocking) {
    process.stdout._handle.setBlocking(true);
  }
  if (process.stderr?.isTTY === false && process.stderr._handle?.setBlocking) {
    process.stderr._handle.setBlocking(true);
  }
} catch {
  // ignore
}
function mirrorLog(args, stream) {
  const line = args.map((a) => (typeof a === 'string' ? a : String(a))).join(' ') + '\n';
  try {
    if (typeof stream.fd === 'number' && stream.fd >= 0) {
      writeFileSync(stream.fd, line);
    } else {
      stream.write(line);
    }
  } catch {
    try {
      stream.write(line);
    } catch {
      // ignore
    }
  }
  try {
    appendFileSync(workerLogPath, line);
  } catch {
    // ignore
  }
}
console.log = (...args) => mirrorLog(args, process.stdout);
console.error = (...args) => mirrorLog(args, process.stderr);
try {
  const boot = `${new Date().toISOString()} boot pid=${process.pid} root=${root}\n`;
  appendFileSync(workerLogPath, boot);
  if (typeof process.stdout.fd === 'number') writeFileSync(process.stdout.fd, boot);
} catch {
  // ignore
}

if (!token) {
  console.error('ONOFF_CRM_CONTRACT_API_TOKEN required');
  process.exit(1);
}

function loadRetryState() {
  try {
    if (!existsSync(retryStatePath)) return {};
    const raw = JSON.parse(readFileSync(retryStatePath, 'utf8'));
    return raw && typeof raw === 'object' ? raw : {};
  } catch {
    return {};
  }
}

function saveRetryState(state) {
  mkdirSync(lockDir, { recursive: true });
  writeFileSync(retryStatePath, JSON.stringify(state, null, 2) + '\n', 'utf8');
}

function acquireLock() {
  if (once) return;
  mkdirSync(lockDir, { recursive: true });
  if (existsSync(lockPath)) {
    const prev = Number(String(readFileSync(lockPath, 'utf8')).trim()) || 0;
    if (prev > 0 && prev !== process.pid) {
      try {
        process.kill(prev, 0);
        // Another healthy worker owns the lock — exit quietly so supervisors
        // / accidental double-starts do not look like hard failures.
        console.error(`revision worker already running pid=${prev}`);
        process.exit(0);
      } catch {
        // stale lock
      }
    }
  }
  writeFileSync(lockPath, String(process.pid), 'utf8');
  const release = () => {
    try {
      if (existsSync(lockPath) && String(readFileSync(lockPath, 'utf8')).trim() === String(process.pid)) {
        unlinkSync(lockPath);
      }
    } catch {
      // ignore
    }
  };
  process.on('exit', release);
  process.on('SIGINT', () => {
    release();
    process.exit(130);
  });
  process.on('SIGTERM', () => {
    release();
    process.exit(143);
  });
}

async function postDispatchStatus(ticketId, dispatchStatus, note = '', agentRunId = '') {
  const body = {
    action: 'dispatch_status',
    ticketId,
    dispatchStatus,
    author: 'revision-worker',
  };
  if (note) body.note = String(note).slice(0, 1000);
  if (note && dispatchStatus === 'failed') body.dispatchError = String(note).slice(0, 500);
  if (agentRunId) body.agentRunId = String(agentRunId).slice(0, 120);
  const res = await fetch(apiBase, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-ONOFF-Contract-Token': token,
      'X-ONOFF-CRM-Actor': 'revision-worker',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`dispatch_status ${dispatchStatus} failed ${res.status}: ${text.slice(0, 200)}`);
  }
  return text;
}

async function listOpen() {
  const url = `${apiBase}?status=${encodeURIComponent(status)}`;
  const res = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'X-ONOFF-Contract-Token': token,
    },
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`list failed ${res.status}: ${text.slice(0, 200)}`);
  }
  const body = JSON.parse(text);
  return Array.isArray(body.items) ? body.items : [];
}

async function postRetry(ticketId) {
  const res = await fetch(apiBase, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-ONOFF-Contract-Token': token,
      'X-ONOFF-CRM-Actor': 'revision-worker',
    },
    body: JSON.stringify({
      action: 'retry',
      ticketId,
      readyForAgent: true,
      author: 'revision-worker-auto-retry',
    }),
  });
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`retry failed ${res.status}: ${text.slice(0, 200)}`);
  }
  return text;
}

async function listQueued() {
  const items = await listOpen();
  const retryState = loadRetryState();
  const now = Date.now();
  const queued = [];
  for (const row of items) {
    const id = Number(row.id || row.ticketId || 0);
    if (id < 1) continue;
    const dispatch = row?.cursorPackage?.dispatchStatus || row?.agentDispatch?.status || '';
    if (dispatch === 'queued') {
      queued.push(row);
      continue;
    }
    if (dispatch !== 'failed' || autoRetryMax < 1) continue;
    const key = String(id);
    const prev = retryState[key] && typeof retryState[key] === 'object' ? retryState[key] : {};
    const count = Number(prev.count || 0) || 0;
    if (count >= autoRetryMax) continue;
    const updatedAt = Date.parse(String(row.updatedAt || row.updated_at || '')) || 0;
    const lastAt = Number(prev.at || 0) || updatedAt || 0;
    if (lastAt > 0 && now - lastAt < autoRetryAfterSec * 1000) continue;
    try {
      console.log(new Date().toISOString(), `auto-retry #${id} attempt=${count + 1}/${autoRetryMax}`);
      await postRetry(id);
      retryState[key] = { count: count + 1, at: now };
      saveRetryState(retryState);
      queued.push({ ...row, cursorPackage: { ...(row.cursorPackage || {}), dispatchStatus: 'queued' } });
    } catch (err) {
      console.error(
        new Date().toISOString(),
        `auto-retry failed #${id}`,
        err instanceof Error ? err.message : err
      );
      retryState[key] = { count: count + 1, at: now, error: String(err instanceof Error ? err.message : err).slice(0, 200) };
      saveRetryState(retryState);
    }
  }
  return queued.slice(0, limit);
}

function runTicket(ticketId) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(
      process.execPath,
      [runner, `--ticketId=${ticketId}`],
      {
        cwd: root,
        env: process.env,
        stdio: ['ignore', 'pipe', 'pipe'],
      }
    );
    let out = '';
    child.stdout.on('data', (buf) => {
      const s = buf.toString();
      out += s;
      process.stdout.write(`[#${ticketId}] ${s}`);
    });
    child.stderr.on('data', (buf) => {
      const s = buf.toString();
      out += s;
      process.stderr.write(`[#${ticketId}] ${s}`);
    });
    child.on('error', reject);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise(out);
      else reject(new Error(`run.mjs exit ${code}`));
    });
  });
}

async function tick() {
  const queued = await listQueued();
  if (!queued.length) {
    console.log(new Date().toISOString(), 'queue empty');
    return 0;
  }
  let ran = 0;
  for (const row of queued) {
    const id = Number(row.id || row.ticketId || 0);
    if (id < 1 || inFlight.has(id)) continue;
    inFlight.add(id);
    console.log(new Date().toISOString(), `start #${id} ${row.title || ''}`);
    try {
      try {
        await postDispatchStatus(id, 'running');
      } catch (err) {
        console.error(new Date().toISOString(), `warn #${id} mark running`, err instanceof Error ? err.message : err);
      }
      await runTicket(id);
      ran += 1;
      // Clear auto-retry budget after a successful run.
      const retryState = loadRetryState();
      if (retryState[String(id)]) {
        delete retryState[String(id)];
        saveRetryState(retryState);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(new Date().toISOString(), `fail #${id}`, msg);
      try {
        await postDispatchStatus(id, 'failed', msg);
      } catch (markErr) {
        console.error(
          new Date().toISOString(),
          `warn #${id} mark failed`,
          markErr instanceof Error ? markErr.message : markErr
        );
      }
    } finally {
      inFlight.delete(id);
    }
  }
  return ran;
}

acquireLock();
console.log(
  `revision worker once=${once} interval=${intervalSec}s status=${status} limit=${limit} pid=${process.pid}`
);

if (once) {
  const n = await tick();
  process.exit(n >= 0 ? 0 : 1);
}

for (;;) {
  try {
    await tick();
  } catch (err) {
    console.error(new Date().toISOString(), 'poll error', err instanceof Error ? err.message : err);
  }
  await new Promise((r) => setTimeout(r, intervalSec * 1000));
}
