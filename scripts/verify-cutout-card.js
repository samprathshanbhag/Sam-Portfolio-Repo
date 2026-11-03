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
  console.log('=== Verifying Ability Card with Cutout (1280px & 375px) ===');

  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-cutout-'));
  const chrome = spawn(
    CHROME_PATH,
    [
      '--headless=new',
      '--remote-debugging-port=9222',
      `--user-data-dir=${tempProfileDir}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      'about:blank',
    ],
    { stdio: 'ignore' }
  );

  let targets = null;
  for (let i = 0; i < 20; i++) {
    try {
      targets = await fetchJson('http://127.0.0.1:9222/json');
      if (targets && targets.length > 0) break;
    } catch (e) {
      await wait(500);
    }
  }

  const target = targets.find((t) => t.type === 'page') || targets[0];
  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.ready;

  await client.send('Page.enable');
  await client.send('Runtime.enable');

  // --- 1. DESKTOP (1280px) ---
  console.log('\nTesting 1280px Desktop Viewport...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 800,
    deviceScaleFactor: 1,
    mobile: false,
  });

  await client.send('Page.navigate', { url: 'http://127.0.0.1:3000' });
  await wait(1200);

  // Bypass loader
  await client.send('Runtime.evaluate', {
    expression: `
      sessionStorage.setItem('samprath_portfolio_visited', 'true');
      location.reload();
    `,
  });
  await wait(1800);

  // Measure card and badge clearance
  const desktopMetrics = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const card = document.querySelector('.perspective-card');
        const badge = card ? card.querySelector('.bg-\\\\[\\\\#141313\\\\\\\\]\\\\/90') : null;
        const img = card ? card.querySelector('img[src*=\"portrait-cutout\"]') : null;
        
        const cardRect = card ? card.getBoundingClientRect() : null;
        const badgeRect = badge ? badge.getBoundingClientRect() : null;
        const imgRect = img ? img.getBoundingClientRect() : null;
        
        return {
          cardWidth: cardRect ? Math.round(cardRect.width) : null,
          cardHeight: cardRect ? Math.round(cardRect.height) : null,
          badgeLeft: badgeRect ? Math.round(badgeRect.left - cardRect.left) : null,
          badgeTop: badgeRect ? Math.round(badgeRect.top - cardRect.top) : null,
          imgSrc: img ? img.src : null,
          imgLoaded: img ? img.complete && img.naturalWidth > 0 : false,
          imgNaturalSize: img ? \`\${img.naturalWidth}x\${img.naturalHeight}\` : null,
        };
      })()
    `,
    returnByValue: true,
  });

  console.log('Desktop 1280px Metrics:', desktopMetrics.result.value);

  // Capture full hero at 1280px
  const shotDesktopHero = await client.send('Page.captureScreenshot', { format: 'png' });
  const dHeroPath = path.join(OUTPUT_DIR, 'hero-cutout-1280px.png');
  fs.writeFileSync(dHeroPath, Buffer.from(shotDesktopHero.data, 'base64'));
  fs.copyFileSync(dHeroPath, path.join(ARTIFACT_DIR, 'hero-cutout-1280px.png'));
  console.log('Saved: hero-cutout-1280px.png');

  // Clip directly around ability card for high-detail inspection
  const cardBox = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const card = document.querySelector('.perspective-card');
        const r = card.getBoundingClientRect();
        return { x: r.left - 10, y: r.top - 10, width: r.width + 20, height: r.height + 20, scale: 1 };
      })()
    `,
    returnByValue: true,
  });

  const shotDesktopCard = await client.send('Page.captureScreenshot', {
    format: 'png',
    clip: cardBox.result.value,
  });
  const dCardPath = path.join(OUTPUT_DIR, 'ability-card-cutout-1280px.png');
  fs.writeFileSync(dCardPath, Buffer.from(shotDesktopCard.data, 'base64'));
  fs.copyFileSync(dCardPath, path.join(ARTIFACT_DIR, 'ability-card-cutout-1280px.png'));
  console.log('Saved: ability-card-cutout-1280px.png');

  // --- 2. MOBILE (375px) ---
  console.log('\nTesting 375px Mobile Viewport...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true,
  });

  await client.send('Page.navigate', { url: 'http://127.0.0.1:3000' });
  await wait(1200);

  // Bypass loader
  await client.send('Runtime.evaluate', {
    expression: `
      sessionStorage.setItem('samprath_portfolio_visited', 'true');
      location.reload();
    `,
  });
  await wait(1800);

  // Scroll to card
  await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const card = document.querySelector('.perspective-card');
        if (card) card.scrollIntoView({ behavior: 'instant', block: 'center' });
      })()
    `,
  });
  await wait(600);

  const mCardBox = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const card = document.querySelector('.perspective-card');
        const r = card.getBoundingClientRect();
        return { x: r.left - 8, y: r.top - 8, width: r.width + 16, height: r.height + 16, scale: 2 };
      })()
    `,
    returnByValue: true,
  });

  const shotMobileCard = await client.send('Page.captureScreenshot', {
    format: 'png',
    clip: mCardBox.result.value,
  });
  const mCardPath = path.join(OUTPUT_DIR, 'ability-card-cutout-375px.png');
  fs.writeFileSync(mCardPath, Buffer.from(shotMobileCard.data, 'base64'));
  fs.copyFileSync(mCardPath, path.join(ARTIFACT_DIR, 'ability-card-cutout-375px.png'));
  console.log('Saved: ability-card-cutout-375px.png');

  // Also capture mobile viewport with hero & card
  const shotMobileViewport = await client.send('Page.captureScreenshot', { format: 'png' });
  const mViewportPath = path.join(OUTPUT_DIR, 'hero-cutout-375px.png');
  fs.writeFileSync(mViewportPath, Buffer.from(shotMobileViewport.data, 'base64'));
  fs.copyFileSync(mViewportPath, path.join(ARTIFACT_DIR, 'hero-cutout-375px.png'));
  console.log('Saved: hero-cutout-375px.png');

  client.close();
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    fs.rmSync(tempProfileDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n=== All Ability Card Cutout Screenshots Captured Successfully! ===');
}

run().catch((err) => {
  console.error(err);
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
  } catch (e) {}
  process.exit(1);
});

