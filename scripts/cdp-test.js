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
    this.consoleErrors = [];

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
      } else if (msg.method) {
        if (msg.method === 'Runtime.consoleAPICalled') {
          if (msg.params.type === 'error') {
            this.consoleErrors.push(msg.params.args.map((a) => a.value || a.description).join(' '));
          }
        } else if (msg.method === 'Runtime.exceptionThrown') {
          this.consoleErrors.push(msg.params.exceptionDetails.text);
        }
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
  console.log('=== Starting Test & Validation ===');

  // Start Next.js server
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
  console.log('Next.js server is online!');

  // Launch Chrome with unique temp user-data-dir
  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-cdp-'));
  console.log('Launching Headless Chrome on port 9222 with profile:', tempProfileDir);
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

  // Poll for Chrome remote debugger
  let targets = null;
  for (let i = 0; i < 20; i++) {
    try {
      targets = await fetchJson('http://127.0.0.1:9222/json');
      if (targets && targets.length > 0) break;
    } catch (e) {
      await wait(500);
    }
  }

  if (!targets) {
    console.error('Chrome remote debugging did not respond.');
    process.exit(1);
  }

  const target = targets.find((t) => t.type === 'page') || targets[0];
  console.log(`Connected to CDP target: ${target.webSocketDebuggerUrl}`);

  const client = new CDPClient(target.webSocketDebuggerUrl);
  await client.ready;

  await client.send('Page.enable');
  await client.send('Runtime.enable');
  await client.send('DOM.enable');

  const breakpoints = [
    { name: 'desktop-1280px', width: 1280, height: 900, deviceScaleFactor: 1, mobile: false },
    { name: 'tablet-768px', width: 768, height: 1024, deviceScaleFactor: 1, mobile: true },
    { name: 'mobile-375px', width: 375, height: 812, deviceScaleFactor: 2, mobile: true },
  ];

  const results = [];

  for (const bp of breakpoints) {
    console.log(`\nTesting Breakpoint: ${bp.name} (${bp.width}x${bp.height})`);

    await client.send('Emulation.setDeviceMetricsOverride', {
      width: bp.width,
      height: bp.height,
      deviceScaleFactor: bp.deviceScaleFactor,
      mobile: bp.mobile,
    });

    await client.send('Page.navigate', { url: 'http://127.0.0.1:3000' });
    await wait(1800);

    // Bypass intro loader via sessionStorage
    await client.send('Runtime.evaluate', {
      expression: `
        sessionStorage.setItem('samprath_portfolio_visited', 'true');
        location.reload();
      `,
    });
    await wait(2000);

    // Evaluate layout metrics & test overflow
    const evalRes = await client.send('Runtime.evaluate', {
      expression: `
        (() => {
          const docWidth = document.documentElement.scrollWidth;
          const winWidth = window.innerWidth;
          const bodyWidth = document.body.scrollWidth;
          const hasOverflow = docWidth > winWidth || bodyWidth > winWidth;
          return {
            scrollWidth: docWidth,
            innerWidth: winWidth,
            bodyWidth: bodyWidth,
            hasOverflow: hasOverflow,
            title: document.title,
            sectionsCount: document.querySelectorAll('section').length,
            buttonsCount: document.querySelectorAll('button').length,
            linksCount: document.querySelectorAll('a').length
          };
        })()
      `,
      returnByValue: true,
    });

    const metrics = evalRes.result.value;
    console.log('Layout Metrics:', metrics);

    // Capture screenshot
    const shot = await client.send('Page.captureScreenshot', {
      format: 'png',
      captureBeyondViewport: false,
    });

    const shotPath = path.join(OUTPUT_DIR, `${bp.name}.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot to: ${shotPath}`);

    results.push({
      breakpoint: bp.name,
      width: bp.width,
      metrics,
      screenshot: shotPath,
      consoleErrors: [...client.consoleErrors],
    });
  }

  client.close();
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
    fs.rmSync(tempProfileDir, { recursive: true, force: true });
  } catch (e) {}

  console.log('\n=== All Breakpoints Tested Successfully! ===');
  fs.writeFileSync(
    path.join(OUTPUT_DIR, 'test-report.json'),
    JSON.stringify(results, null, 2)
  );
}

run().catch((err) => {
  console.error('Fatal error during test:', err);
  try {
    execSync('taskkill /F /IM chrome.exe /T', { stdio: 'ignore' });
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
  } catch (e) {}
  process.exit(1);
});
