import { spawn } from 'node:child_process';
import process from 'node:process';
import open from 'open';

const nextCli = 'node_modules/next/dist/bin/next';
const nextArgs = [nextCli, 'dev', '--webpack', '-p', '5555'];

const child = spawn(process.execPath, nextArgs, {
  stdio: ['inherit', 'pipe', 'pipe'],
  env: { ...process.env, PORT: '5555' },
});

let didOpen = false;

async function waitForHttpReady(url) {
  const start = Date.now();
  const timeoutMs = 45_000;
  const intervalMs = 250;
  const requestTimeoutMs = 1_500;

  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, {
        method: 'GET',
        signal: AbortSignal.timeout(requestTimeoutMs),
      });
      if (res) return true;
    } catch {
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }

  return false;
}

function maybeOpenUrl(text) {
  if (didOpen) return;

  const match = text.match(/https?:\/\/(?:\[::1\]|localhost|0\.0\.0\.0):5555/i);
  if (!match) return;

  const raw = match[0];
  const url = raw.replace('0.0.0.0', 'localhost');
  didOpen = true;
  void (async () => {
    await waitForHttpReady(url);
    await open(url);
  })();
}

child.stdout.on('data', (chunk) => {
  const text = chunk.toString('utf8');
  process.stdout.write(text);
  maybeOpenUrl(text);
});

child.stderr.on('data', (chunk) => {
  const text = chunk.toString('utf8');
  process.stderr.write(text);
  maybeOpenUrl(text);
});

function shutdown(code) {
  if (!child.killed) child.kill('SIGINT');
  process.exit(code);
}

process.on('SIGINT', () => shutdown(0));
process.on('SIGTERM', () => shutdown(0));

child.on('exit', (code) => {
  process.exit(code ?? 0);
});
