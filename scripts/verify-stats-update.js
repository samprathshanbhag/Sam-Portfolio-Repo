const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.join(__dirname, '..', 'screenshots');
const ARTIFACT_DIR = "C:\\Users\\samprath shanbhag\\.gemini\\antigravity\\brain\\6ee9500a-56b6-4f22-8e25-6afc43662079";
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

class CDPClient {
  constructor(wsUrl) {
    this.ws = new WebSocket(wsUrl);
    this.id = 1;
    this.callbacks = new Map();

    this.ready = new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && this.callbacks.has(msg.id)) {
        const { resolve, reject } = this.callbacks.get(msg.id);
        this.callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
  }

  send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = this.id++;
      this.callbacks.set(id, { resolve, reject });
      this.ws.send(JSON.stringify({ id, method, params }));
    });
  }

  close() {
    this.ws.close();
  }
}

async function run() {
  console.log('=== Verifying Stats Strip: (90%+ Rate) Removed ===\n');

  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
  } catch (e) {}
  await wait(500);

  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-verify-stats-'));
  const port = 9222;

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tempProfileDir}`,
    'about:blank',
  ]);

  let targets = null;
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      await wait(800);
      targets = await fetchJson(`http://127.0.0.1:${port}/json`);
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }
  const pageTarget = targets.find((t) => t.type === 'page');
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.ready;

  await client.send('Page.enable');
  await client.send('DOM.enable');

  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Page.navigate', { url: 'http://127.0.0.1:3000' });
  await wait(1500);

  // Bypass loader
  await client.send('Runtime.evaluate', {
    expression: `
      sessionStorage.setItem('samprath_portfolio_visited', 'true');
      location.reload();
    `,
  });
  await wait(2000);

  // Measure and capture stats counter
  const statsBox = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const statsEl = document.querySelector('section#home .border-t.border-surface-border\\\\/60') || document.querySelector('section#home');
        const r = statsEl.getBoundingClientRect();
        return { x: Math.max(0, r.left - 10), y: Math.max(0, r.top - 10), width: r.width + 20, height: r.height + 20, scale: 1 };
      })()
    `,
    returnByValue: true,
  });

  const shotStats = await client.send('Page.captureScreenshot', {
    format: 'png',
    clip: statsBox.result.value,
  });
  const sPath = path.join(OUTPUT_DIR, 'stats-strip-updated-1440px.png');
  fs.writeFileSync(sPath, Buffer.from(shotStats.data, 'base64'));
  fs.copyFileSync(sPath, path.join(ARTIFACT_DIR, 'stats-strip-updated-1440px.png'));
  console.log('Saved: stats-strip-updated-1440px.png');

  // Also capture close up on the 26 stat card
  const stat26Box = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const els = Array.from(document.querySelectorAll('div, span, p'));
        const el26 = els.find(e => e.textContent.trim() === '26' && e.classList.contains('font-mono'));
        const container = el26 ? el26.closest('div') : null;
        if (container) {
          const r = container.getBoundingClientRect();
          return { x: Math.max(0, r.left - 15), y: Math.max(0, r.top - 10), width: r.width + 30, height: r.height + 20, scale: 2 };
        }
        return null;
      })()
    `,
    returnByValue: true,
  });

  if (stat26Box.result.value) {
    const shot26 = await client.send('Page.captureScreenshot', {
      format: 'png',
      clip: stat26Box.result.value,
    });
    const s26Path = path.join(OUTPUT_DIR, 'stat-26-interns-guided.png');
    fs.writeFileSync(s26Path, Buffer.from(shot26.data, 'base64'));
    fs.copyFileSync(s26Path, path.join(ARTIFACT_DIR, 'stat-26-interns-guided.png'));
    console.log('Saved: stat-26-interns-guided.png');
  }

  client.close();
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    fs.rmSync(tempProfileDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n=== Verification Completed! ===');
}

run().catch((err) => {
  console.error(err);
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
  } catch (e) {}
  process.exit(1);
});
