// node audit/check-views.js <preview.html> <tag> <width> <height> → audit/out/<tag>.json + screenshots audit/shots/<tag>-<view>.png
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const [,, file, tag, w, h] = process.argv; fs.mkdirSync('audit/out', { recursive: true });
  const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: +w, height: +h } })).newPage();
  let errs = []; p.on('pageerror', e => errs.push(e.message.slice(0, 160)));
  await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(12000);
  const views = await p.evaluate(() => VIEWS.filter(v => !/^(today|students|pay|growth|qa|tsched|mypay|tinbox)$/.test(v) && document.getElementById('v-' + v)));
  const res = {};
  for(const v of views){ errs = []; await p.evaluate(v => { try{ closeSheet(); }catch(e){} go(v); window.scrollTo(0, 0); }, v); await p.waitForTimeout(2600);
    const r = await p.evaluate(v => { const el = document.getElementById('v-' + v), t = (el && el.innerText || '').trim();
      return { len: t.length, nodata: /no sample data|Could not load/i.test(t), hscroll: document.documentElement.scrollWidth > innerWidth + 1, sheetOpen: !!document.querySelector('#sheet.on') }; }, v);
    r.errs = errs.slice(0, 3); res[v] = r; await p.screenshot({ path: `audit/shots/${tag}-${v}.png` }); }
  fs.writeFileSync(`audit/out/${tag}.json`, JSON.stringify(res, null, 1)); console.log(tag, Object.keys(res).length, 'views', JSON.stringify(Object.fromEntries(Object.entries(res).filter(([k, r]) => r.errs.length || r.hscroll || r.nodata || r.len < 100))));
  await b.close();
})();
