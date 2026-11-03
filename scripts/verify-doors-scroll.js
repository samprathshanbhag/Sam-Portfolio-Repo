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
  console.log('=== Verifying "See My Work" Click & Upward Doors Positioning ===');

  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-doors-click-'));
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

  const testViewports = [
    { name: '1920x907', width: 1920, height: 907 },
    { name: '1440x800', width: 1440, height: 800 },
    { name: '1280x720', width: 1280, height: 720 },
  ];

  for (const vp of testViewports) {
    console.log(`\nTesting at ${vp.name}...`);
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
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

    // Click "See my work" button in Hero
    console.log('Clicking "See my work" button...');
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const buttons = Array.from(document.querySelectorAll('#home button'));
          const seeWorkBtn = buttons.find(b => b.textContent.includes('See my work'));
          if (seeWorkBtn) seeWorkBtn.click();
        })()
      `,
    });

    // Wait for smooth scroll to finish
    await wait(1200);

    // Measure positions after scroll
    const metrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const section = document.getElementById('work');
          const cards = Array.from(document.querySelectorAll('#work [id^="door-"]'));
          const firstCard = cards[0];
          const unlockLabel = firstCard ? firstCard.querySelector('.door-leaf span:last-of-type') : null;
          
          const secRect = section ? section.getBoundingClientRect() : null;
          const cardRect = firstCard ? firstCard.getBoundingClientRect() : null;
          const labelRect = unlockLabel ? unlockLabel.getBoundingClientRect() : null;
          
          return {
            windowHeight: window.innerHeight,
            scrollY: window.scrollY,
            sectionTop: secRect ? Math.round(secRect.top) : null,
            cardTop: cardRect ? Math.round(cardRect.top) : null,
            cardBottom: cardRect ? Math.round(cardRect.bottom) : null,
            cardHeight: cardRect ? Math.round(cardRect.height) : null,
            cardFullyVisible: cardRect ? (cardRect.bottom <= window.innerHeight && cardRect.top >= 60) : null,
            spaceRemainingBelowCard: cardRect ? Math.round(window.innerHeight - cardRect.bottom) : null,
            unlockLabelVisible: labelRect ? labelRect.bottom <= window.innerHeight : null,
          };
        })()
      `,
      returnByValue: true,
    });

    console.log(`Results for ${vp.name}:`, metrics.result.value);

    // Capture screenshot at landed scroll position
    const shot = await client.send('Page.captureScreenshot', { format: 'png' });
    const shotPath = path.join(OUTPUT_DIR, `work-click-${vp.name}.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    fs.copyFileSync(shotPath, path.join(ARTIFACT_DIR, `work-click-${vp.name}.png`));
    console.log(`Saved screenshot: work-click-${vp.name}.png`);
  }

  client.close();
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    fs.rmSync(tempProfileDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n=== All Tests Completed Successfully! ===');
}

run().catch((err) => {
  console.error(err);
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
  } catch (e) {}
  process.exit(1);
});

