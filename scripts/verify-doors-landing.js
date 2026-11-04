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
  console.log('=== Verifying Scroll Landing, Door Alignment & Graphics ===\n');

  try { execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' }); } catch (e) {}
  await wait(500);

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-doors-verify-'));
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
  for (let i = 0; i < 20; i++) {
    await wait(600);
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

  const results = [];

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
    await wait(1000);

    // Bypass intro loader
    await client.send('Runtime.evaluate', {
      expression: `sessionStorage.setItem('samprath_portfolio_visited', 'true'); location.reload();`,
    });

    // Wait for page to finish reloading and hydrate #stats
    let hydrated = false;
    for (let r = 0; r < 20; r++) {
      await wait(500);
      const readyRes = await client.send('Runtime.evaluate', {
        expression: `Boolean(document.querySelector('#stats') && document.querySelector('#work'))`,
        returnByValue: true,
      });
      if (readyRes.result && readyRes.result.value) {
        hydrated = true;
        break;
      }
    }
    console.log(`Page hydrated for ${vp.name}: ${hydrated}`);

    // Trigger click on scroll indicator (or scrollToNext)
    const clickRes = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('.hero-scroll-indicator');
          if (btn) {
            btn.click();
            return { found: true, method: 'indicator-click' };
          }
          const stats = document.querySelector('#stats');
          if (stats) {
            stats.scrollIntoView({ behavior: 'smooth' });
            return { found: true, method: 'scrollIntoView' };
          }
          return { found: false, readyState: document.readyState };
        })()
      `,
      returnByValue: true,
    });

    console.log('Click result:', clickRes.result.value);

    // Wait for smooth scroll settling
    await wait(1500);

    // Measure positions and alignments
    const metrics = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const header = document.querySelector('header');
          const stats = document.querySelector('#stats');
          const workHeading = document.querySelector('#work h2');
          const workChip = document.querySelector('#work .inline-flex');
          const scrollTrack = document.querySelector('.doors-scroll-track') || document.querySelector('#work .overflow-x-auto');
          const firstDoor = document.querySelector('#door-dashboards-bi') || document.querySelector('.snap-start') || document.querySelector('.snap-center');
          
          const headerRect = header ? header.getBoundingClientRect() : null;
          const statsRect = stats ? stats.getBoundingClientRect() : null;
          const headingRect = workHeading ? workHeading.getBoundingClientRect() : null;
          const chipRect = workChip ? workChip.getBoundingClientRect() : null;
          const trackRect = scrollTrack ? scrollTrack.getBoundingClientRect() : null;
          const doorRect = firstDoor ? firstDoor.getBoundingClientRect() : null;

          const deadGapUnderHeader = (statsRect && headerRect) ? Math.round(statsRect.top - headerRect.bottom) : null;
          const headingLeft = headingRect ? Math.round(headingRect.left) : null;
          const doorLeft = doorRect ? Math.round(doorRect.left) : null;
          const doorAlignmentDelta = (headingLeft !== null && doorLeft !== null) ? Math.abs(doorLeft - headingLeft) : null;
          
          // Visibility calculation of the first door card
          let doorVisiblePercent = 0;
          if (doorRect) {
            const visibleHeight = Math.max(0, Math.min(doorRect.bottom, window.innerHeight) - Math.max(doorRect.top, 0));
            doorVisiblePercent = Math.round((visibleHeight / doorRect.height) * 100);
          }

          const gapStatsToChip = (chipRect && statsRect) ? Math.round(chipRect.top - statsRect.bottom) : null;

          return {
            scrollY: window.scrollY,
            headerBottom: headerRect ? Math.round(headerRect.bottom) : null,
            statsTop: statsRect ? Math.round(statsRect.top) : null,
            deadGapUnderHeader,
            gapStatsToChip,
            headingLeft,
            doorLeft,
            doorAlignmentDelta,
            doorRect: doorRect ? {
              top: Math.round(doorRect.top),
              bottom: Math.round(doorRect.bottom),
              height: Math.round(doorRect.height),
            } : null,
            viewportHeight: window.innerHeight,
            doorVisiblePercent,
          };
        })()
      `,
      returnByValue: true,
    });

    const m = metrics.result.value;
    console.log('Landing Metrics:', JSON.stringify(m, null, 2));
    results.push({ viewport: vp.name, ...m });

    // Capture screenshot after landing
    const shot = await client.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(shot.data, 'base64');
    const filename = `doors-landing-${vp.name}.png`;
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), buffer);
    fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buffer);
    console.log(`Saved screenshot: ${filename}`);
  }

  // Also capture zoomed view of the 4 door preview cards at 1440px
  console.log('\n--- Capturing Doors Visual Detail (1440px) ---');
  await client.send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await client.send('Runtime.evaluate', {
    expression: `
      const work = document.querySelector('#work');
      if (work) work.scrollIntoView();
    `,
  });
  await wait(600);

  const doorDetailShot = await client.send('Page.captureScreenshot', { format: 'png' });
  const doorBuffer = Buffer.from(doorDetailShot.data, 'base64');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'doors-visual-detail-1440px.png'), doorBuffer);
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'doors-visual-detail-1440px.png'), doorBuffer);
  console.log('Saved doors-visual-detail-1440px.png');

  client.close();
  try { chromeProc.kill(); } catch (e) {}

  console.log('\n=== Summary of Results ===');
  console.table(results);
}

run().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
