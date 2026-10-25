// node audit/releaseA/assert.js <preview.html> <tag>  → targeted checks for each fix in Release A (sample data, read-only)
const { chromium } = require('playwright'); const path = require('path'); const fs = require('fs');
(async () => {
  const [,, file, tag] = process.argv; const b = await chromium.launch(); const res = [];
  const page = async (w) => { const p = await (await b.newContext({ viewport: { width: w, height: 900 } })).newPage(); p.on('pageerror', e => res.push({ id: 'pageerror', ok: false, info: e.message.slice(0, 120) })); await p.goto('file://' + path.resolve(file)); await p.waitForTimeout(12000); return p; };
  const p = await page(1280);
  const txt = async v => { await p.evaluate(v => { try{ closeSheet(); }catch(e){} go(v); }, v); await p.waitForTimeout(3500); return p.evaluate(v => document.getElementById('v-' + v).innerText, v); };
  const T = {};
  for(const v of ['payroll', 'expenses', 'money', 'finov', 'home', 'reports', 'enquiry', 'perf', 'astudents', 'mtoday', 'schedule', 'teachers']) T[v] = await txt(v);
  const ck = (id, fix, ok, info) => res.push({ id, fix, ok: !!ok, info: info || '' });
  ck('830', 'Payroll shows the period and update state from first paint', /Showing (September|October) 2026/.test(T.payroll), (T.payroll.match(/Showing[^\n]{0,90}/) || [''])[0]);
  ck('831a', 'Transactions labels Difference as not Net', /not Net/i.test(T.expenses), (T.expenses.match(/[^\n]{0,40}not Net[^\n]{0,40}/i) || [''])[0]);
  ck('831b', 'Sales & costs defines Net', /Net \(also called profit\)/.test(T.money));
  ck('831c', 'Finance Overview net note', /Sales − expenses − salaries − gov dues/.test(T.finov));
  ck('877a', 'Sales & costs: Checks to do vs Insights', /Checks to do/.test(T.money) && /Insights/.test(T.money));
  ck('877b', 'Sales & costs: break-even merged with target', /Break-even[^\n]{0,20}monthly sales target/i.test(T.money));
  ck('870', 'Student flow relabelled (package activity)', /package activity/i.test(T.home) || /package activity/i.test(T.astudents), 'home or students');
  ck('871', 'Parent reports queue-specific empty state (no blanket “All reports checked”)', !/All reports checked\. Nice work/.test(T.reports), (T.reports.split('\n').slice(0, 6).join(' / ')).slice(0, 160));
  ck('872', 'Enquiries “Reached trial” milestone label', /Reached trial/i.test(T.enquiry));
  ck('860', 'Performance windows explained', /Each number has its own period/i.test(T.perf));
  ck('861', 'First-90-days scope wording', /first 90 days checklist/i.test(T.perf) || /first 90 days checklist/i.test(T.teachers), 'perf or teachers');
  ck('892', 'Specific nav labels (Database sheet)', await p.evaluate(() => [...document.querySelectorAll('.grp-tabs button, nav button')].some(b => /Database sheet/.test(b.textContent)) || /Database sheet/.test(document.body.innerText)));
  ck('873', 'Commands read as actions (“Mark as sent”) where shown', !/✓ Sent<\/button>/.test(await p.evaluate(() => document.body.innerHTML)), 'no “✓ Sent” buttons on visited screens');
  // 895 payroll names
  await p.evaluate(() => go('payroll')); await p.waitForTimeout(2500);
  const nw = await p.evaluate(() => { const n = document.querySelector('#pyCur .py-row .py-n'); return n ? n.getBoundingClientRect().width : -1; }); ck('895', 'Payroll name column wide enough (>150px)', nw > 150, Math.round(nw) + 'px');
  const virgo = await p.evaluate(() => /per lesson · \d/.test(document.getElementById('v-payroll').innerText)); ck('845', 'Same-name payroll rows show rate · units', virgo);
  // 850 schedule cancelled never Live
  await p.evaluate(() => go('schedule')); await p.waitForTimeout(3000);
  const cl = await p.evaluate(() => { const rows = [...document.querySelectorAll('#v-schedule [class*="cancel"], #v-schedule .x, #v-schedule .cx')]; return rows.filter(r => /Live/i.test(r.innerText)).length; }); ck('850', 'No cancelled class shows “Live”', cl === 0, cl + ' cancelled rows with Live');
  // 896 phone header
  const q = await page(390);
  const hdr = await q.evaluate(() => { const r = document.getElementById('rf').getBoundingClientRect(), o = [...document.querySelectorAll('.hd .iconbtn')].map(x => x.getBoundingClientRect().right); return { rf: r.right, max: Math.max(...o), w: innerWidth }; });
  ck('896', 'Phone: refresh and sign-out on screen', hdr.max <= hdr.w, JSON.stringify(hdr));
  for(const v of ['perf', 'astudents', 'active', 'enquiry', 'schedule', 'payroll', 'finov', 'expenses', 'money']){ await q.evaluate(v => { try{ closeSheet(); }catch(e){} go(v); }, v); await q.waitForTimeout(2600);
    const sw = await q.evaluate(() => document.documentElement.scrollWidth); ck('897/896 ' + v, 'Phone ' + v + ': no sideways scroll', sw <= 391, 'scrollWidth ' + sw); }
  fs.writeFileSync(`audit/releaseA/${tag}.json`, JSON.stringify(res, null, 1));
  console.log(tag, res.filter(r => r.ok).length + '/' + res.length + ' ok'); res.filter(r => !r.ok).forEach(r => console.log('FAIL', r.id, r.fix, r.info));
  await b.close();
})();
