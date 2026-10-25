const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const [,, file, out] = process.argv; const b = await chromium.launch(); const p = await (await b.newContext({ viewport: { width: 1280, height: 860 } })).newPage();
  await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(6000);
  const views = await p.evaluate(() => VIEWS.filter(v => !/^(msgs|today|students|pay|growth|qa|tsched|mypay)$/.test(v)));
  for(const v of views){ await p.evaluate(v => { try{ closeSheet(); }catch(e){} go(v); }, v); await p.waitForTimeout(2500); }
  await p.evaluate(() => { go('astudents'); try{ openStudent('ST-2026-105'); }catch(e){} }); await p.waitForTimeout(4000);
  await p.evaluate(() => { closeSheet(); go('payroll'); try{ tabSheet('PAY','PAY tab'); }catch(e){} }); await p.waitForTimeout(3000);
  await p.evaluate(() => { closeSheet(); try{ payslip(''); }catch(e){} }); await p.waitForTimeout(3000);
  const m = await p.evaluate(() => window.__PREVIEW_MISSB || []); fs.writeFileSync(out, JSON.stringify(m)); console.log(m.length); await b.close();
})();
