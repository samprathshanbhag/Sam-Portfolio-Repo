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

async function run() {
  console.log('=== Verifying Hero Scroll Indicator & Card Bottom Spacing ===\n');

  try { execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' }); } catch (e) {}
  await wait(500);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-hero-scroll-'));
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
  if (!targets) throw new Error('Chrome did not launch in time');

  const pageTarget = targets.find((t) => t.type === 'page');
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.ready;
  await client.send('Page.enable');
  await client.send('DOM.enable');

  const viewports = [
    { name: '1920x910', w: 1920, h: 910 },
    { name: '1440x800', w: 1440, h: 800 },
    { name: '1280x720', w: 1280, h: 720 },
  ];

  const scrollOffsets = [
    { label: 'top', y: 0 },
    { label: 'scroll100px', y: 100 },
    { label: 'scroll400px', y: 400 },
  ];

  for (const vp of viewports) {
    console.log(`\n--------------------------------------------`);
    console.log(`Testing Viewport: ${vp.name} (${vp.w}x${vp.h})`);
    console.log(`--------------------------------------------`);

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.w,
      height: vp.h,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await client.send('Page.navigate', { url: 'http://127.0.0.1:3000' });
    await wait(1200);

    // Bypass loader
    await client.send('Runtime.evaluate', {
      expression: `sessionStorage.setItem('samprath_portfolio_visited', 'true'); location.reload();`,
    });
    await wait(2000);

    for (const s of scrollOffsets) {
      // Perform scroll
      await client.send('Runtime.evaluate', {
        expression: `window.scrollTo(0, ${s.y});`,
      });
      await wait(500);

      const metrics = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const ind = document.querySelector('.hero-scroll-indicator');
            const card = document.querySelector('.perspective-card');
            const hero = document.querySelector('#home');
            
            const cardRect = card ? card.getBoundingClientRect() : null;
            const heroRect = hero ? hero.getBoundingClientRect() : null;
            const indRect = ind ? ind.getBoundingClientRect() : null;
            const indStyle = ind ? window.getComputedStyle(ind) : null;
            
            return {
              scrollY: window.pageYOffset || document.documentElement.scrollTop,
              viewportW: window.innerWidth,
              viewportH: window.innerHeight,
              // Card metrics
              cardBottom: cardRect ? Math.round(cardRect.bottom) : null,
              cardDistFromVpBottom: cardRect ? Math.round(window.innerHeight - cardRect.bottom) : null,
              // Indicator metrics
              indFound: !!ind,
              indDisplay: indStyle ? indStyle.display : null,
              indOpacity: indStyle ? parseFloat(indStyle.opacity).toFixed(2) : null,
              indCenterX: indRect ? Math.round(indRect.left + indRect.width / 2) : null,
              expectedCenterX: Math.round(document.documentElement.clientWidth / 2),
              isHorizontallyCentered: indRect ? Math.abs((indRect.left + indRect.width / 2) - (document.documentElement.clientWidth / 2)) <= 1.0 : false,
              indBottomInVp: indRect ? Math.round(indRect.bottom) : null,
              indDistFromVpBottom: indRect ? Math.round(window.innerHeight - indRect.bottom) : null,
              heroHeight: heroRect ? Math.round(heroRect.height) : null,
            };
          })()
        `,
        returnByValue: true,
      });

      console.log(`[${vp.name} @ ${s.label} (${s.y}px scroll)] Metrics:`, metrics.result.value);

      // Capture screenshot
      const shot = await client.send('Page.captureScreenshot', { format: 'png' });
      const filename = `hero-${vp.name}-${s.label}.png`;
      const fPath = path.join(OUTPUT_DIR, filename);
      fs.writeFileSync(fPath, Buffer.from(shot.data, 'base64'));
      fs.copyFileSync(fPath, path.join(ARTIFACT_DIR, filename));
      console.log(`Saved screenshot: ${filename}`);
    }
  }

  client.close();
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    fs.rmSync(tempDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n=== All Verification Screenshots & Measurements Completed! ===');
}

run().catch((err) => {
  console.error(err);
  try { execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' }); } catch (e) {}
  process.exit(1);
});
