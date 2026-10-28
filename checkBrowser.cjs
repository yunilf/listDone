const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  console.log('Navigating to local preview...');
  await page.goto('http://localhost:4173', { waitUntil: 'networkidle0' });
  
  await page.screenshot({path: 'preview.png'});
  console.log('Screenshot saved to preview.png');
  
  await browser.close();
})();
