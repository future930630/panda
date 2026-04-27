const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  // Enable console log capture
  const consoleLogs = [];
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
    else consoleLogs.push(msg.text());
  });

  // Navigate
  await page.goto('http://localhost:3000/products-all.html');
  await page.waitForTimeout(2000);

  // Check if compare bar exists
  const barExists = await page.$('#compareBar');
  console.log('Compare bar element exists:', !!barExists);

  // Try to add 2 products to compare by clicking checkboxes
  const checks = await page.$$('.pa-card-compare-check input[type="checkbox"]');
  console.log('Found compare checkboxes:', checks.length);

  if (checks.length >= 2) {
    await checks[0].click();
    await page.waitForTimeout(300);
    await checks[1].click();
    await page.waitForTimeout(500);

    // Check compare bar display
    const barDisplay = await page.$eval('#compareBar', el => el.style.display);
    console.log('Compare bar display after adding 2:', barDisplay);

    const count = await page.$eval('#compareCount', el => el.textContent);
    console.log('Compare count:', count);

    // Try clicking the clear button
    const clearBtn = await page.$('.pa-compare-clear-btn');
    if (clearBtn) {
      console.log('Clear button found, clicking...');
      await clearBtn.click();
      await page.waitForTimeout(500);

      const barDisplayAfter = await page.$eval('#compareBar', el => el.style.display);
      console.log('Compare bar display after clear:', barDisplayAfter);

      const countAfter = await page.$eval('#compareCount', el => el.textContent);
      console.log('Compare count after clear:', countAfter);
    } else {
      console.log('Clear button NOT found!');
    }
  } else {
    console.log('Not enough checkboxes to test');
  }

  console.log('\n--- Console Errors ---');
  consoleErrors.forEach(e => console.log('ERROR:', e));

  await browser.close();
})();
