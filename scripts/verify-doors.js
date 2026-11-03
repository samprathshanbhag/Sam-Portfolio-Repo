const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.join(__dirname, '..', 'screenshots');
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
  console.log('=== Starting Door 01 Verification (1280px & 1920px) ===');

  // Launch Next.js server
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

  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-door-'));
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
  await client.send('DOM.enable');

  const resolutions = [
    { name: '1280px', width: 1280, height: 900 },
    { name: '1920px', width: 1920, height: 1080 },
  ];

  const verificationResults = [];

  for (const res of resolutions) {
    console.log(`\n============================================`);
    console.log(`Testing Door 01 at Viewport: ${res.name} (${res.width}x${res.height})`);
    console.log(`============================================`);

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: res.width,
      height: res.height,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await client.send('Page.navigate', { url: 'http://127.0.0.1:3000' });
    await wait(1800);

    // Bypass intro loader
    await client.send('Runtime.evaluate', {
      expression: `
        sessionStorage.setItem('samprath_portfolio_visited', 'true');
        location.reload();
      `,
    });
    await wait(2000);

    // Ensure mouse starts far away
    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 0,
      y: 0,
    });

    // Scroll door 01 into view and get its page and viewport coordinates
    const boxRes = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('door-dashboards-bi');
          if (!el) return null;
          el.scrollIntoView({ behavior: 'instant', block: 'center' });
          const rect = el.getBoundingClientRect();
          const scrollX = window.scrollX || window.pageXOffset;
          const scrollY = window.scrollY || window.pageYOffset;
          return {
            pageLeft: Math.round(rect.left + scrollX),
            pageTop: Math.round(rect.top + scrollY),
            viewportLeft: Math.round(rect.left),
            viewportTop: Math.round(rect.top),
            width: Math.round(rect.width),
            height: Math.round(rect.height)
          };
        })()
      `,
      returnByValue: true,
    });
    await wait(500);

    const box = boxRes.result.value;
    console.log(`Door 01 coordinates:`, box);

    const pad = 12;
    const clip = {
      x: Math.max(0, box.pageLeft - pad),
      y: Math.max(0, box.pageTop - pad),
      width: box.width + pad * 2,
      height: box.height + pad * 2,
      scale: 1,
    };

    // --- POINT 1: CLOSED ---
    console.log(`[Point 1] Capturing Door 01: CLOSED...`);
    const shot1 = await client.send('Page.captureScreenshot', {
      format: 'png',
      clip,
    });
    const path1 = path.join(OUTPUT_DIR, `door01-${res.name}-closed.png`);
    fs.writeFileSync(path1, Buffer.from(shot1.data, 'base64'));
    console.log(`Saved: ${path1}`);

    // --- TRIGGER OPENING via MOUSE HOVER ---
    const targetX = box.viewportLeft + Math.round(box.width / 2);
    const targetY = box.viewportTop + Math.round(box.height / 2);
    console.log(`Triggering hover on Door 01 at viewport (${targetX}, ${targetY})...`);

    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: targetX,
      y: targetY,
    });

    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('door-dashboards-bi');
          if (el) {
            el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, clientX: ${targetX}, clientY: ${targetY} }));
          }
        })()
      `,
    });

    // --- POINT 2: 300ms INTO OPENING ---
    await wait(300);
    console.log(`[Point 2] Capturing Door 01: 300ms INTO OPENING...`);
    const shot2 = await client.send('Page.captureScreenshot', {
      format: 'png',
      clip,
    });
    const path2 = path.join(OUTPUT_DIR, `door01-${res.name}-opening-300ms.png`);
    fs.writeFileSync(path2, Buffer.from(shot2.data, 'base64'));
    console.log(`Saved: ${path2}`);

    // --- POINT 3: 2 SECONDS AFTER OPENING ---
    await wait(1700); // 300ms + 1700ms = 2000ms
    console.log(`[Point 3] Capturing Door 01: 2 SECONDS AFTER OPENING (Fully open)...`);
    const shot3 = await client.send('Page.captureScreenshot', {
      format: 'png',
      clip,
    });
    const path3 = path.join(OUTPUT_DIR, `door01-${res.name}-open-2s.png`);
    fs.writeFileSync(path3, Buffer.from(shot3.data, 'base64'));
    console.log(`Saved: ${path3}`);

    // Also capture full viewport around the doors wall
    const fullShot = await client.send('Page.captureScreenshot', {
      format: 'png',
    });
    const pathFull = path.join(OUTPUT_DIR, `wall-${res.name}-open-2s.png`);
    fs.writeFileSync(pathFull, Buffer.from(fullShot.data, 'base64'));

    // Check inspection metrics
    const inspectRes = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('door-dashboards-bi');
          const leaf = el.querySelector('.door-leaf');
          const leafStyle = window.getComputedStyle(leaf);
          const room = el.querySelector('.door-container > div:first-child');
          const title = room.querySelector('h4');
          const desc = room.querySelector('p');
          const cta = room.querySelector('a');
          
          return {
            leafOpacity: parseFloat(leafStyle.opacity),
            leafPointerEvents: leafStyle.pointerEvents,
            leafTransform: leafStyle.transform,
            titleText: title ? title.innerText : null,
            descText: desc ? desc.innerText : null,
            ctaText: cta ? cta.innerText : null,
            roomVisible: room ? room.offsetHeight > 0 : false
          };
        })()
      `,
      returnByValue: true,
    });

    const info = inspectRes.result.value;
    console.log(`Inspection at ${res.name} (2s open):`, info);

    const isDoorFullyClear = info.leafOpacity === 0 && info.leafPointerEvents === 'none';
    console.log(`Is door panel completely out of the way & non-overlapping?`, isDoorFullyClear);

    verificationResults.push({
      resolution: res.name,
      doorClear: isDoorFullyClear,
      inspection: info,
      files: {
        closed: path1,
        opening300ms: path2,
        open2s: path3,
        fullView: pathFull,
      },
    });

    // Reset mouse
    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 0,
      y: 0,
    });
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('door-dashboards-bi');
          if (el) {
            el.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true, clientX: 0, clientY: 0 }));
          }
        })()
      `,
    });
    await wait(800);
  }

  client.close();
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
    fs.rmSync(tempProfileDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n=== All Verification Screenshots Completed Successfully! ===');
  console.log(JSON.stringify(verificationResults, null, 2));

  // Copy all files to artifact directory
  const artifactDir = "C:\\Users\\samprath shanbhag\\.gemini\\antigravity\\brain\\6ee9500a-56b6-4f22-8e25-6afc43662079";
  const allImages = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith('.png'));
  for (const img of allImages) {
    fs.copyFileSync(path.join(OUTPUT_DIR, img), path.join(artifactDir, img));
  }
  console.log('Copied all screenshots to artifact directory!');
}

run().catch((err) => {
  console.error('Fatal error during door verification:', err);
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
  } catch (e) {}
  process.exit(1);
});
