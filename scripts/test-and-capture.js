const { spawn, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.join(__dirname, '..', 'screenshots');

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function checkServer(port, retries = 25) {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get(`http://127.0.0.1:${port}`, (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error(`Status ${res.statusCode}`));
        });
        req.on('error', reject);
        req.setTimeout(1500, () => {
          req.destroy();
          reject(new Error('Timeout'));
        });
      });
      console.log(`Server responding on 127.0.0.1:${port}!`);
      return true;
    } catch (e) {
      await new Promise((r) => setTimeout(r, 600));
    }
  }
  return false;
}

async function run() {
  console.log('Starting Next.js production server on 127.0.0.1:3000...');
  const server = spawn('cmd.exe', ['/c', 'npx.cmd', 'next', 'start', '-p', '3000', '-H', '127.0.0.1'], {
    stdio: 'inherit',
  });

  const isUp = await checkServer(3000);
  if (!isUp) {
    console.error('Failed to start server within timeout.');
    try {
      execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
    } catch (e) {}
    process.exit(1);
  }

  const breakpoints = [
    { name: 'desktop-1280px', width: 1280, height: 900 },
    { name: 'tablet-768px', width: 768, height: 1024 },
    { name: 'mobile-375px', width: 375, height: 812 },
  ];

  for (const bp of breakpoints) {
    const outFile = path.join(OUTPUT_DIR, `${bp.name}.png`);
    console.log(`Capturing screenshot for ${bp.name} (${bp.width}x${bp.height})...`);
    try {
      execSync(
        `"${CHROME_PATH}" --headless --disable-gpu --hide-scrollbars --window-size=${bp.width},${bp.height} --screenshot="${outFile}" http://127.0.0.1:3000`,
        { stdio: 'inherit' }
      );
      console.log(`Saved screenshot: ${outFile}`);
    } catch (err) {
      console.error(`Error capturing ${bp.name}:`, err.message);
    }
  }

  console.log('Stopping server...');
  try {
    execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
  } catch (e) {}

  console.log('All screenshots completed successfully!');
}

run();
