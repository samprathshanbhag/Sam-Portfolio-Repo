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
  console.log('=== Verifying Ability Card with B&W Low-Key Duotone Treatment ===');

  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-bw-'));
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

  // --- 1. DESKTOP (1440x800) ---
  console.log('\nTesting 1440x800 Viewport...');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
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

  // Measure card metrics at 1440x800
  const metrics1440 = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const card = document.querySelector('.perspective-card');
        const cardRect = card ? card.getBoundingClientRect() : null;
        const img = card ? card.querySelector('img[src*=\"portrait-bw\"]') : null;
        const badge = card ? card.querySelector('.bg-\\\\[\\\\#141313\\\\\\\\]\\\\/90') : null;
        const badgeRect = badge ? badge.getBoundingClientRect() : null;
        
        return {
          windowHeight: window.innerHeight,
          cardTop: cardRect ? Math.round(cardRect.top) : null,
          cardBottom: cardRect ? Math.round(cardRect.bottom) : null,
          cardHeight: cardRect ? Math.round(cardRect.height) : null,
          cardFitsAboveFold: cardRect ? cardRect.bottom <= window.innerHeight : null,
          spaceRemainingBelowCard: cardRect ? Math.round(window.innerHeight - cardRect.bottom) : null,
          imgSrc: img ? img.src : null,
          imgComplete: img ? img.complete : null,
          imgNaturalSize: img ? \`\${img.naturalWidth}x\${img.naturalHeight}\` : null,
          badgeLeft: badgeRect ? Math.round(badgeRect.left - cardRect.left) : null,
          badgeTop: badgeRect ? Math.round(badgeRect.top - cardRect.top) : null,
        };
      })()
    `,
    returnByValue: true,
  });

  console.log('1440x800 Metrics:', metrics1440.result.value);

  // Capture un-scrolled 1440x800 hero screenshot
  const shot1440Hero = await client.send('Page.captureScreenshot', { format: 'png' });
  const h1440Path = path.join(OUTPUT_DIR, 'hero-bw-panel-1440x800.png');
  fs.writeFileSync(h1440Path, Buffer.from(shot1440Hero.data, 'base64'));
  fs.copyFileSync(h1440Path, path.join(ARTIFACT_DIR, 'hero-bw-panel-1440x800.png'));
  console.log('Saved: hero-bw-panel-1440x800.png');

  // Clip directly around the card at 1440px
  const cardBox1440 = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const card = document.querySelector('.perspective-card');
        const r = card.getBoundingClientRect();
        return { x: r.left - 10, y: r.top - 10, width: r.width + 20, height: r.height + 20, scale: 1 };
      })()
    `,
    returnByValue: true,
  });

  const shotCard1440 = await client.send('Page.captureScreenshot', {
    format: 'png',
    clip: cardBox1440.result.value,
  });
  const c1440Path = path.join(OUTPUT_DIR, 'ability-card-bw-1440x800.png');
  fs.writeFileSync(c1440Path, Buffer.from(shotCard1440.data, 'base64'));
  fs.copyFileSync(c1440Path, path.join(ARTIFACT_DIR, 'ability-card-bw-1440x800.png'));
  console.log('Saved: ability-card-bw-1440x800.png');

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

  const cardBox375 = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const card = document.querySelector('.perspective-card');
        const r = card.getBoundingClientRect();
        return { x: r.left - 8, y: r.top - 8, width: r.width + 16, height: r.height + 16, scale: 2 };
      })()
    `,
    returnByValue: true,
  });

  const shotCard375 = await client.send('Page.captureScreenshot', {
    format: 'png',
    clip: cardBox375.result.value,
  });
  const c375Path = path.join(OUTPUT_DIR, 'ability-card-bw-375px.png');
  fs.writeFileSync(c375Path, Buffer.from(shotCard375.data, 'base64'));
  fs.copyFileSync(c375Path, path.join(ARTIFACT_DIR, 'ability-card-bw-375px.png'));
  console.log('Saved: ability-card-bw-375px.png');

  client.close();
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    fs.rmSync(tempProfileDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n=== All Ability Card B&W Screenshots Captured Successfully! ===');
}

run().catch((err) => {
  console.error(err);
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
  } catch (e) {}
  process.exit(1);
});

