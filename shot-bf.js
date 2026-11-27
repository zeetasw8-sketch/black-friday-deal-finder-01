// Screenshot DealHound for the make.fun entry: 3 shots per shots.json.
// Usage: node shot-bf.js (serve.ts must be running on localhost:8080)
const puppeteer = require('puppeteer-core');
const fs = require('fs');

const SHOTS = [
  { file: 'screenshots/1-deals.jpg', hash: '#/', width: 1280, height: 800 },
  { file: 'screenshots/2-deal.jpg', hash: '#/deal/dyson-v9', width: 1280, height: 800 },
  { file: 'screenshots/3-deal-phone.jpg', hash: '#/deal/airpods-pro-3', width: 390, height: 844 },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/home/hatch/workspace/tools/cloakbrowser/chrome',
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars'],
  });
  try {
    for (const s of SHOTS) {
      const page = await browser.newPage();
      await page.setViewport({ width: s.width, height: s.height });
      await page.goto('http://localhost:8080/' + s.hash, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.waitForFunction('window.__shotReady === true', { timeout: 15000 });
      await new Promise((r) => setTimeout(r, 400));
      await page.screenshot({ path: s.file, type: 'jpeg', quality: 82 });
      const size = fs.statSync(s.file).size;
      console.log(s.file, size, 'bytes');
      await page.close();
    }
  } finally {
    await browser.disconnect();
  }
  console.log('DONE');
})();
