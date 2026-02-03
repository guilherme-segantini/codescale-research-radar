const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('Running unit tests...\n');
  await page.goto('http://localhost:8086/test/unit/unitTests.qunit.html');

  // Wait for QUnit to finish
  await page.waitForFunction(() => {
    const result = window.QUnit && window.QUnit.config && window.QUnit.config.stats;
    return result && result.all > 0;
  }, { timeout: 60000 });

  // Get results
  const results = await page.evaluate(() => {
    const stats = QUnit.config.stats;
    const tests = [];
    document.querySelectorAll('#qunit-tests > li').forEach(li => {
      const name = li.querySelector('.test-name')?.textContent || '';
      const module = li.querySelector('.module-name')?.textContent || '';
      const passed = li.classList.contains('pass');
      tests.push({ module, name, passed });
    });
    return { passed: stats.all - stats.bad, failed: stats.bad, total: stats.all, tests };
  });

  console.log('========== QUnit Unit Test Results ==========');
  console.log('Total: ' + results.total + ' | Passed: ' + results.passed + ' | Failed: ' + results.failed);
  console.log('==============================================\n');

  results.tests.forEach(t => {
    const icon = t.passed ? '✓' : '✗';
    console.log(icon + ' [' + t.module + '] ' + t.name);
  });

  await browser.close();
  process.exit(results.failed > 0 ? 1 : 0);
})();
