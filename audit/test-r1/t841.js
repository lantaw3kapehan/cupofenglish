// does Edit student open the second time (DBL cached, DB loaded)? usage: node t841.js <preview.html>
const { chromium } = require('playwright'), path = require('path');
(async () => { const b = await chromium.launch(), p = await b.newPage();
  await p.goto('file://' + path.resolve(process.argv[2])); await p.waitForTimeout(5000);
  await p.evaluate(async () => { await loadDb(true); });
  for(const k of [1, 2]){ await p.evaluate(() => { try{ closeSheet(); }catch(e){} }); await p.waitForTimeout(300); await p.evaluate(() => stuForm(94, 'ST-2026-058')); await p.waitForTimeout(2500);
    console.log('open #' + k, await p.evaluate(() => JSON.stringify({ dbl: !!DBL, form: !!document.getElementById('sGo'), h1: (document.querySelector('#sheetBody h1') || {}).textContent }))); }
  await b.close(); })();
