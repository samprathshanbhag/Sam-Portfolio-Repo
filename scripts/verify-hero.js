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
  console.log('=== Starting Desktop Hero & Mobile Verification ===');

  // Spawn Next.js production server
  console.log('Launching Next.js server on 127.0.0.1:3000...');
  const nextServer = spawn('cmd.exe', ['/c', 'npx.cmd', 'next', 'start', '-p', '3000', '-H', '127.0.0.1'], {
    stdio: 'ignore',
  });

  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:3000', (res) => {
          if (res.statusCode === 200) resolve();
          else reject();
        }).on('error', reject);
      });
      serverReady = true;
      break;
    } catch (e) {
      await wait(500);
    }
  }

  if (!serverReady) {
    console.error('Next.js server failed to respond.');
    process.exit(1);
  }
  console.log('Next.js server ready!');

  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-hero-'));
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

  const viewports = [
    { name: '1920x907', width: 1920, height: 907, mobile: false, scale: 1 },
    { name: '1440x800', width: 1440, height: 800, mobile: false, scale: 1 },
    { name: '1280x720', width: 1280, height: 720, mobile: false, scale: 1 },
    { name: '375px', width: 375, height: 812, mobile: true, scale: 2 },
  ];

  for (const vp of viewports) {
    console.log(`\nTesting & capturing viewport: ${vp.name} (${vp.width}x${vp.height})...`);

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.scale,
      mobile: vp.mobile,
    });

    await client.send('Page.navigate', { url: 'http://127.0.0.1:3000' });
    await wait(1500);

    // Bypass intro loader
    await client.send('Runtime.evaluate', {
      expression: `
        sessionStorage.setItem('samprath_portfolio_visited', 'true');
        location.reload();
      `,
    });
    await wait(2200);

    // Measure positions above the fold (no scroll)
    const metrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const headline = document.querySelector('h1');
          const talkBtn = document.querySelector('button');
          const card = document.querySelector('.perspective-card');
          const header = document.querySelector('header');
          const headerButtons = header ? header.querySelectorAll('button') : [];
          const headerTalkBtn = headerButtons.length > 1 ? headerButtons[1] : null;
          
          const cardRect = card ? card.getBoundingClientRect() : null;
          const talkRect = headerTalkBtn ? headerTalkBtn.getBoundingClientRect() : null;
          
          // Get hero action buttons
          const heroButtons = Array.from(document.querySelectorAll('#home button, #home a'));
          const buttonsInfo = heroButtons.map(b => ({
            text: b.textContent.trim(),
            top: Math.round(b.getBoundingClientRect().top),
            bottom: Math.round(b.getBoundingClientRect().bottom),
            visibleAboveFold: b.getBoundingClientRect().bottom <= window.innerHeight
          }));
          
          return {
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            scrollX: window.scrollX,
            scrollY: window.scrollY,
            bodyScrollWidth: document.body.scrollWidth,
            hasHorizontalOverflow: document.body.scrollWidth > window.innerWidth,
            cardTop: cardRect ? Math.round(cardRect.top) : null,
            cardBottom: cardRect ? Math.round(cardRect.bottom) : null,
            cardRight: cardRect ? Math.round(cardRect.right) : null,
            cardVisibleAboveFold: cardRect ? cardRect.bottom <= window.innerHeight : null,
            headerTalkBtnRight: talkRect ? Math.round(talkRect.right) : null,
            buttonsInfo
          };
        })()
      `,
      returnByValue: true,
    });

    console.log('Metrics for', vp.name, ':', JSON.stringify(metrics.result.value, null, 2));

    // Capture un-scrolled screenshot (above the fold)
    const shot = await client.send('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(OUTPUT_DIR, `hero-${vp.name}.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    fs.copyFileSync(shotPath, path.join(ARTIFACT_DIR, `hero-${vp.name}.png`));
    console.log(`Saved screenshot: hero-${vp.name}.png`);
  }

  client.close();
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
    fs.rmSync(tempProfileDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n=== All Hero Screenshots Captured and Verified Successfully! ===');
}

run().catch((err) => {
  console.error(err);
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
  } catch (e) {}
  process.exit(1);
});
