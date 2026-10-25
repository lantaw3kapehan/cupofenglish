// usage: node audit/shoot.js <preview.html> <prefix> [views...]
const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const [,, file, pre, ...views] = process.argv;
  const b = await chromium.launch(); const ctx = await b.newContext({ viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push('pageerror ' + e.message)); p.on('console', m => { if(m.type() === 'error') errs.push('console ' + m.text().slice(0, 160)); });
  await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(6000);
  for(const v of (views.length ? views : ['home'])){
    await p.evaluate(v => { try{ closeSheet(); }catch(e){} go(v); }, v); await p.waitForTimeout(3500);
    await p.screenshot({ path: `audit/shots/${pre}-${v}.png`, fullPage: false });
  }
  const miss = await p.evaluate(() => (window.__PREVIEW_MISS || []).slice(0, 40));
  console.log(JSON.stringify({ errs: errs.slice(0, 15), miss }, null, 1)); await b.close();
})();
