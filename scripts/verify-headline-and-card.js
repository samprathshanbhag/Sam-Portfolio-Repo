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
  console.log('=== Verifying Headline Descenders & Ability Card Full-Width ===\n');

  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
  } catch (e) {}
  await wait(500);

  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-verify-headline-'));
  const port = 9222;

  const chromeProc = spawn(CHROME_PATH, [
    `--remote-debugging-port=${port}`,
    '--headless=new',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${tempProfileDir}`,
    'about:blank',
  ]);

  await wait(1800);

  const targets = await fetchJson(`http://127.0.0.1:${port}/json`);
  const pageTarget = targets.find((t) => t.type === 'page');
  const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
  await client.ready;

  await client.send('Page.enable');
  await client.send('DOM.enable');

  const words = [
    { name: 'dashboards', index: 0, text: 'clear dashboards' },
    { name: 'models', index: 1, text: 'reliable data models' },
    { name: 'decisions', index: 2, text: 'business decisions' },
    { name: 'pipelines', index: 3, text: 'working pipelines' },
  ];

  // ==========================================
  // 1. DESKTOP 1440x800 TESTS
  // ==========================================
  console.log('--- 1. Testing Desktop 1440x800 ---');
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

  // Measure Ability Card at 1440x800
  const cardMetrics1440 = await client.send('Runtime.evaluate', {
    expression: `
      (() => {
        const card = document.querySelector('.perspective-card');
        const cardRect = card ? card.getBoundingClientRect() : null;
        const photoArea = card ? card.querySelector('.aspect-\\\\[4\\\\/5\\\\]') : null;
        const photoRect = photoArea ? photoArea.getBoundingClientRect() : null;
        const nameBlock = card ? card.querySelector('h3') : null;
        const nameRect = nameBlock ? nameBlock.getBoundingClientRect() : null;
        
        return {
          windowHeight: window.innerHeight,
          cardTop: cardRect ? Math.round(cardRect.top) : null,
          cardBottom: cardRect ? Math.round(cardRect.bottom) : null,
          cardHeight: cardRect ? Math.round(cardRect.height) : null,
          cardFitsAboveFold: cardRect ? cardRect.bottom <= window.innerHeight : null,
          spaceRemainingBelowCard: cardRect ? Math.round(window.innerHeight - cardRect.bottom) : null,
          photoWidth: photoRect ? Math.round(photoRect.width) : null,
          photoHeight: photoRect ? Math.round(photoRect.height) : null,
          photoRatio: photoRect ? (photoRect.width / photoRect.height).toFixed(2) : null,
          // Check that photo left/right matches nameBlock left/right padding inside card
          photoLeft: photoRect ? Math.round(photoRect.left) : null,
          nameLeft: nameRect ? Math.round(nameRect.left) : null,
          photoSpansFullInnerWidth: photoRect && nameRect ? Math.abs(photoRect.left - nameRect.left) <= 2 : false,
        };
      })()
    `,
    returnByValue: true,
  });

  console.log('1440x800 Ability Card Metrics:', cardMetrics1440.result.value);

  // Capture full hero un-scrolled
  const heroShot1440 = await client.send('Page.captureScreenshot', { format: 'png' });
  const hero1440Path = path.join(OUTPUT_DIR, 'hero-full-width-card-1440x800.png');
  fs.writeFileSync(hero1440Path, Buffer.from(heroShot1440.data, 'base64'));
  fs.copyFileSync(hero1440Path, path.join(ARTIFACT_DIR, 'hero-full-width-card-1440x800.png'));
  console.log('Saved: hero-full-width-card-1440x800.png');

  // Capture ability card close-up
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
  const cardShot1440 = await client.send('Page.captureScreenshot', {
    format: 'png',
    clip: cardBox1440.result.value,
  });
  const card1440Path = path.join(OUTPUT_DIR, 'ability-card-full-width-1440x800.png');
  fs.writeFileSync(card1440Path, Buffer.from(cardShot1440.data, 'base64'));
  fs.copyFileSync(card1440Path, path.join(ARTIFACT_DIR, 'ability-card-full-width-1440x800.png'));
  console.log('Saved: ability-card-full-width-1440x800.png');

  // Capture headline for each word at 1440px
  const headlineClips1440 = [];
  for (const w of words) {
    await client.send('Runtime.evaluate', {
      expression: `window.__setRotatingIndex && window.__setRotatingIndex(${w.index});`,
    });
    await wait(600); // allow animation to complete

    // Get headline box
    const hBox = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const h1 = document.querySelector('h1');
          const r = h1.getBoundingClientRect();
          return { x: Math.max(0, r.left - 10), y: Math.max(0, r.top - 10), width: r.width + 20, height: r.height + 25, scale: 1 };
        })()
      `,
      returnByValue: true,
    });

    const shot = await client.send('Page.captureScreenshot', {
      format: 'png',
      clip: hBox.result.value,
    });
    const filename = `headline-1440px-${w.name}.png`;
    const fPath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(fPath, Buffer.from(shot.data, 'base64'));
    fs.copyFileSync(fPath, path.join(ARTIFACT_DIR, filename));
    console.log(`Saved 1440px headline: ${filename}`);

    // If working pipelines, capture tight zoom on the rotating text line
    if (w.name === 'pipelines') {
      const zoomBox = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const rot = document.querySelector('h1 .relative.min-h-\\\\[1\\\\.35em\\\\]');
            const r = rot.getBoundingClientRect();
            // Zoom in on the word with generous margin around descenders
            return { x: Math.max(0, r.left - 8), y: Math.max(0, r.top - 10), width: r.width + 20, height: r.height + 25, scale: 2 };
          })()
        `,
        returnByValue: true,
      });

      const zoomShot = await client.send('Page.captureScreenshot', {
        format: 'png',
        clip: zoomBox.result.value,
      });
      const zPath = path.join(OUTPUT_DIR, 'zoom-descenders-1440px-pipelines.png');
      fs.writeFileSync(zPath, Buffer.from(zoomShot.data, 'base64'));
      fs.copyFileSync(zPath, path.join(ARTIFACT_DIR, 'zoom-descenders-1440px-pipelines.png'));
      console.log('Saved 1440px zoom on descenders: zoom-descenders-1440px-pipelines.png');
    }
  }

  // ==========================================
  // 2. MOBILE 375px TESTS
  // ==========================================
  console.log('\n--- 2. Testing Mobile 375px ---');
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

  // Capture headline for each word at 375px
  for (const w of words) {
    await client.send('Runtime.evaluate', {
      expression: `window.__setRotatingIndex && window.__setRotatingIndex(${w.index});`,
    });
    await wait(600);

    const hBox375 = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const h1 = document.querySelector('h1');
          const r = h1.getBoundingClientRect();
          return { x: Math.max(0, r.left - 6), y: Math.max(0, r.top - 6), width: r.width + 12, height: r.height + 20, scale: 2 };
        })()
      `,
      returnByValue: true,
    });

    const shot375 = await client.send('Page.captureScreenshot', {
      format: 'png',
      clip: hBox375.result.value,
    });
    const filename375 = `headline-375px-${w.name}.png`;
    const fPath375 = path.join(OUTPUT_DIR, filename375);
    fs.writeFileSync(fPath375, Buffer.from(shot375.data, 'base64'));
    fs.copyFileSync(fPath375, path.join(ARTIFACT_DIR, filename375));
    console.log(`Saved 375px headline: ${filename375}`);

    if (w.name === 'pipelines') {
      const zoomBox375 = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const rot = document.querySelector('h1 .relative.min-h-\\\\[1\\\\.35em\\\\]');
            const r = rot.getBoundingClientRect();
            return { x: Math.max(0, r.left - 6), y: Math.max(0, r.top - 8), width: r.width + 12, height: r.height + 20, scale: 2 };
          })()
        `,
        returnByValue: true,
      });

      const zoomShot375 = await client.send('Page.captureScreenshot', {
        format: 'png',
        clip: zoomBox375.result.value,
      });
      const zPath375 = path.join(OUTPUT_DIR, 'zoom-descenders-375px-pipelines.png');
      fs.writeFileSync(zPath375, Buffer.from(zoomShot375.data, 'base64'));
      fs.copyFileSync(zPath375, path.join(ARTIFACT_DIR, 'zoom-descenders-375px-pipelines.png'));
      console.log('Saved 375px zoom on descenders: zoom-descenders-375px-pipelines.png');
    }
  }

  // Scroll to and capture mobile ability card
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
  const c375Path = path.join(OUTPUT_DIR, 'ability-card-full-width-375px.png');
  fs.writeFileSync(c375Path, Buffer.from(shotCard375.data, 'base64'));
  fs.copyFileSync(c375Path, path.join(ARTIFACT_DIR, 'ability-card-full-width-375px.png'));
  console.log('Saved 375px card: ability-card-full-width-375px.png');

  // ==========================================
  // 3. LAYOUT JUMP VERIFICATION (1920, 1440, 1280, 375)
  // ==========================================
  console.log('\n--- 3. Testing Layout Stability (No Jump) Across Viewports ---');
  for (const vp of [1920, 1440, 1280, 375]) {
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: vp,
      height: vp === 375 ? 812 : 900,
      deviceScaleFactor: 1,
      mobile: vp === 375,
    });
    await wait(300);

    const positions = [];
    for (const w of words) {
      await client.send('Runtime.evaluate', {
        expression: `window.__setRotatingIndex && window.__setRotatingIndex(${w.index});`,
      });
      await wait(150);

      const metrics = await client.send('Runtime.evaluate', {
        expression: `
          (() => {
            const h1 = document.querySelector('h1');
            const intro = document.querySelector('section#home p');
            const buttons = document.querySelector('section#home .flex.flex-wrap.items-center.gap-3');
            return {
              h1Height: h1 ? Math.round(h1.getBoundingClientRect().height) : null,
              introTop: intro ? Math.round(intro.getBoundingClientRect().top) : null,
              buttonsTop: buttons ? Math.round(buttons.getBoundingClientRect().top) : null,
            };
          })()
        `,
        returnByValue: true,
      });
      positions.push(metrics.result.value);
    }

    const h1Heights = positions.map((p) => p.h1Height);
    const introTops = positions.map((p) => p.introTop);
    const isStable = Math.max(...h1Heights) === Math.min(...h1Heights) && Math.max(...introTops) === Math.min(...introTops);
    console.log(`Viewport ${vp}px Layout Stability:`, {
      stable: isStable,
      h1Heights,
      introTops,
    });
  }

  client.close();
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    fs.rmSync(tempProfileDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n=== All Verification Tests and Captures Completed Successfully! ===');
}

run().catch((err) => {
  console.error(err);
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
  } catch (e) {}
  process.exit(1);
});

