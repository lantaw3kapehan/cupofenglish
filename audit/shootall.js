const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const [,, file, pre, w, h] = process.argv; const b = await chromium.launch();
  const p = await (await b.newContext({ viewport: { width: +w || 1280, height: +h || 860 } })).newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message.slice(0, 140)));
  await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(6000);
  const views = await p.evaluate(() => VIEWS.filter(v => !/^(today|students|pay|growth|qa|tsched|mypay)$/.test(v)));
  const res = {};
  for(const v of views){ await p.evaluate(v => { try{ closeSheet(); }catch(e){} go(v); window.scrollTo(0,0); }, v); await p.waitForTimeout(2500);
    res[v] = await p.evaluate(v => { const el = document.getElementById('v-' + v); const t = (el && el.innerText || '').trim(); return t.length + ' ' + /no sample data|Could not load/i.test(t); }, v);
    await p.screenshot({ path: `audit/shots/${pre}-${v}.png` }); }
  console.log(JSON.stringify(res), JSON.stringify(errs.slice(0, 10))); await b.close();
})();
