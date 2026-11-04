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
        try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
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
        if (msg.error) reject(msg.error); else resolve(msg.result);
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
  close() { this.ws.close(); }
}

async function navigateAndReady(client, url) {
  await client.send('Page.navigate', { url });
  await wait(1500);
  await client.send('Runtime.evaluate', {
    expression: `sessionStorage.setItem('samprath_portfolio_visited', 'true'); location.reload();`,
  });
  await wait(2200);
}

async function captureViewport(client, name, vp, artifactDir, outputDir) {
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: vp.w,
    height: vp.h,
    deviceScaleFactor: vp.dpr || 1,
    mobile: false,
  });
  await navigateAndReady(client, 'http://127.0.0.1:3000');

  // Measure indicator
  const metrics = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const ind = document.querySelector('.scroll-indicator-btn');
        const section = document.querySelector('#home');
        if (!ind || !section) return { found: false };
        const indR = ind.getBoundingClientRect();
        const secR = section.getBoundingClientRect();
        const style = window.getComputedStyle(ind);
        return {
          found: true,
          display: style.display,
          visible: style.display !== 'none',
          indBottom: Math.round(indR.bottom),
          indTop: Math.round(indR.top),
          indLeft: Math.round(indR.left),
          indRight: Math.round(indR.right),
          indCenterX: Math.round(indR.left + indR.width / 2),
          viewportWidth: window.innerWidth,
          viewportHeight: window.innerHeight,
          distFromViewportBottom: Math.round(window.innerHeight - indR.bottom),
          sectionHeight: Math.round(secR.height),
          sectionMinHeight: style.minHeight,
        };
      })()
    `,
    returnByValue: true,
  });
  console.log(`\n${name} (${vp.w}x${vp.h}) indicator metrics:`, metrics.result.value);

  // Full-page screenshot of hero only
  const heroBox = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const s = document.querySelector('#home');
        const r = s.getBoundingClientRect();
        return { x: 0, y: 0, width: window.innerWidth, height: Math.min(window.innerHeight, Math.round(r.height)), scale: 1 };
      })()
    `,
    returnByValue: true,
  });
  const shot = await client.send('Page.captureScreenshot', {
    format: 'png',
    clip: heroBox.result.value,
  });
  const filename = `scroll-indicator-${name}.png`;
  const fPath = path.join(outputDir, filename);
  fs.writeFileSync(fPath, Buffer.from(shot.data, 'base64'));
  fs.copyFileSync(fPath, path.join(artifactDir, filename));
  console.log(`Saved: ${filename}`);
}

async function run() {
  console.log('=== Verifying Scroll Indicator Position Across Viewports ===\n');

  try { execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' }); } catch (e) {}
  await wait(500);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-scroll-ind-'));
  const port = 9222;

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tempDir}`,
    'about:blank',
  ]);

  let targets = null;
  for (let i = 0; i < 12; i++) {
    await wait(800);
    try {
      targets = await fetchJson(`http://127.0.0.1:${port}/json`);
      if (targets && targets.length > 0) break;
    } catch (e) {}
  }

  if (!targets) throw new Error('Chrome did not start in time');

  const pageTarget = targets.find((t) => t.type === 'page');
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.ready;
  await client.send('Page.enable');
  await client.send('DOM.enable');

  const viewports = [
    { name: '1920x812', w: 1920, h: 812 },
    { name: '1440x800', w: 1440, h: 800 },
    { name: '1280x720', w: 1280, h: 720 },
    { name: '375x667',  w: 375,  h: 667, dpr: 2 },
  ];

  for (const vp of viewports) {
    await captureViewport(client, vp.name, vp, ARTIFACT_DIR, OUTPUT_DIR);
  }

  client.close();
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n=== All Scroll Indicator Verification Screenshots Captured! ===');
}

run().catch((err) => {
  console.error(err);
  try { execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' }); } catch (e) {}
  process.exit(1);
});

