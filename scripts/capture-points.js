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
  console.log('=== Capturing 3 Points at 1280px & 1920px ===');

  // Launch Next.js server
  const nextServer = spawn('cmd.exe', ['/c', 'npx.cmd', 'next', 'start', '-p', '3000', '-H', '127.0.0.1'], {
    stdio: 'ignore',
  });

  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        http.get('http://127.0.0.1:3000', (res) => {
          if (res.statusCode === 200) resolve();
          else reject();
        }).on('error', reject);
      });
      break;
    } catch (e) {
      await wait(500);
    }
  }

  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-door-pts-'));
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

  const resolutions = [
    { name: '1280px', width: 1280, height: 900 },
    { name: '1920px', width: 1920, height: 1080 },
  ];

  for (const res of resolutions) {
    console.log(`\nCapturing for ${res.name}...`);

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: res.width,
      height: res.height,
      deviceScaleFactor: 1,
      mobile: false,
    });

    await client.send('Page.navigate', { url: 'http://127.0.0.1:3000' });
    await wait(1800);

    // Bypass intro
    await client.send('Runtime.evaluate', {
      expression: `
        sessionStorage.setItem('samprath_portfolio_visited', 'true');
        location.reload();
      `,
    });
    await wait(2000);

    // Position mouse far away
    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 0,
      y: 0,
    });

    // Scroll door into view
    const rectRes = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('door-dashboards-bi');
          el.scrollIntoView({ behavior: 'instant', block: 'center' });
          const r = el.getBoundingClientRect();
          return {
            x: Math.round(r.left),
            y: Math.round(r.top),
            width: Math.round(r.width),
            height: Math.round(r.height)
          };
        })()
      `,
      returnByValue: true,
    });
    await wait(600);

    const r = rectRes.result.value;
    console.log(`${res.name} Door 01 Rect:`, r);

    const targetX = r.x + Math.round(r.width / 2);
    const targetY = r.y + Math.round(r.height / 2);

    // 1. POINT 1: CLOSED
    console.log(`Capturing ${res.name} POINT 1: CLOSED...`);
    const shotClosed = await client.send('Page.captureScreenshot', { format: 'png' });
    const fileClosed = path.join(OUTPUT_DIR, `door01-${res.name}-closed.png`);
    fs.writeFileSync(fileClosed, Buffer.from(shotClosed.data, 'base64'));

    // 2. TRIGGER HOVER & POINT 2: 300ms INTO OPENING
    console.log(`Triggering hover and capturing ${res.name} POINT 2: 300ms INTO OPENING...`);
    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: targetX,
      y: targetY,
    });
    await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const el = document.getElementById('door-dashboards-bi');
          if (el) el.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, clientX: ${targetX}, clientY: ${targetY} }));
        })()
      `,
    });

    await wait(300);
    const shot300ms = await client.send('Page.captureScreenshot', { format: 'png' });
    const file300ms = path.join(OUTPUT_DIR, `door01-${res.name}-opening-300ms.png`);
    fs.writeFileSync(file300ms, Buffer.from(shot300ms.data, 'base64'));

    // 3. POINT 3: 2s AFTER OPENING
    console.log(`Waiting total 2000ms for ${res.name} POINT 3: 2s AFTER OPENING...`);
    await wait(1700);
    const shot2s = await client.send('Page.captureScreenshot', { format: 'png' });
    const file2s = path.join(OUTPUT_DIR, `door01-${res.name}-open-2s.png`);
    fs.writeFileSync(file2s, Buffer.from(shot2s.data, 'base64'));

    // Copy to artifact directory
    fs.copyFileSync(fileClosed, path.join(ARTIFACT_DIR, `door01-${res.name}-closed.png`));
    fs.copyFileSync(file300ms, path.join(ARTIFACT_DIR, `door01-${res.name}-opening-300ms.png`));
    fs.copyFileSync(file2s, path.join(ARTIFACT_DIR, `door01-${res.name}-open-2s.png`));

    // Reset mouse
    await client.send('Input.dispatchMouseEvent', {
      type: 'mouseMoved',
      x: 0,
      y: 0,
    });
    await wait(800);
  }

  client.close();
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
    fs.rmSync(tempProfileDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('All 6 screenshots captured and copied successfully!');
}

run().catch((e) => {
  console.error(e);
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
  } catch (err) {}
  process.exit(1);
});

