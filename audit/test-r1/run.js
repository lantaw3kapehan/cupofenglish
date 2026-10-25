// R1 birthdate tests on the preview (?writes=fake). usage: node run.js <preview.html> [base]
const { chromium } = require('playwright'), path = require('path');
const file = process.argv[2], BASE = process.argv[3] === 'base';
let pass = 0, fail = 0; const ok = (c, m, extra) => { if(c){ pass++; console.log('  PASS ' + m); } else { fail++; console.log('  FAIL ' + m + (extra ? ' · ' + JSON.stringify(extra) : '')); } };
(async () => {
  const b = await chromium.launch(), ctx = await b.newContext({ viewport: { width: 420, height: 860 } }), p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(file) + '?writes=fake'); await p.waitForTimeout(5000);
  await p.evaluate(async () => { await loadDb(true);
    const f = window.fetch; window.fetch = function(u, o){ const body = o && o.body || ''; if(/dbRecord/.test(body) && window.__DBR){ const d = window.__DBR; if(d === 'fail') return Promise.reject(new Error('net')); return new Promise(r => setTimeout(() => r(f.call(this, u, o)), d)); } return f.apply(this, arguments); }; });
  const saves = () => p.evaluate(() => (window.__PREVIEW_MISSB || []).filter(x => x.e === 'coe' && /"op":"write"/.test(x.body) && /saveStudent/.test(x.body)).map(x => JSON.parse(x.body).args));
  const reset = () => p.evaluate(async () => { window.__DBR = 0; window.__PREVIEW_DELAY = 0; await new Promise(r => setTimeout(r, 2500)); try{ closeSheet(); }catch(e){} await new Promise(r => setTimeout(r, 400)); try{ SB_LASTW = 0; }catch(e){} if(!DB) await loadDb(true); if(!DB) throw new Error('DB not loaded'); window.__PREVIEW_MISSB = []; });
  const open = async (row, code, ms) => { await p.evaluate(([r, c]) => { window.__open = stuForm(r, c); }, [row, code]); if(ms != null){ for(let k = 0; k < 30; k++){ if(await p.evaluate(() => !!document.getElementById('sGo'))) break; await p.waitForTimeout(100); } return p.waitForTimeout(ms); } for(let k = 0; k < 40; k++){ await p.waitForTimeout(100); if(await p.evaluate(() => { const g = document.getElementById('sGo'); return !!document.getElementById('sBirthR') || (g && !g.disabled); })) break; } await p.waitForTimeout(150); };
  const st = () => p.evaluate(() => { const g = document.getElementById('sGo'), el = document.getElementById('sBirth'), ro = document.getElementById('sBirthRO'), on = document.getElementById('sheet').classList.contains('on');
    return { on, go: g ? { dis: g.disabled, txt: g.textContent } : null, birth: el ? { type: el.type, val: el.value, hidden: el.hidden } : null, ro: ro && !ro.hidden ? ro.textContent : null, act: [...document.querySelectorAll('#sBirthA button')].map(x => x.textContent) }; });
  const typeCity = () => p.evaluate(() => { const c = document.getElementById('sCity'); c.value = c.value + 'x'; c.dataset.t = 1; c.dispatchEvent(new Event('input', { bubbles: true })); });
  const setBirth = v => p.evaluate(v => { const el = document.getElementById('sBirth'); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true })); }, v);
  const save = async () => { await p.evaluate(() => { const g = document.getElementById('sGo'); g.click(); }); await p.waitForTimeout(700); };
  const act = a => p.evaluate(a => { const x = [...document.querySelectorAll('#sBirthA button')].find(b => b.textContent.indexOf(a) === 0); x.click(); }, a);

  console.log('T1 untouched month-year birthdate (ST-2026-105 row 27, sheet shows April//2018, stored 2018-04-01)');
  await reset(); await open(27, 'ST-2026-105'); let s = await st(); console.log('   ', JSON.stringify(s));
  if(!BASE) ok(s.ro && /April 2018/.test(s.ro) && /month and year only/.test(s.ro) && s.birth.hidden, 'read-only "April 2018 (month and year only)"', s);
  if(!BASE) ok(s.act.join('|') === 'Change birthdate|Remove birthdate', 'Change / Remove actions', s.act);
  await typeCity(); await save(); let w = await saves();
  ok(w.length === 1 && w[0][1].birth === '2018-04-01' && w[0][1].birthKeep === 1 && !w[0][1].birthClear && w[0][2] === 27, 'payload keeps the stored value + birthKeep', w.map(x => [x[1].birth, x[1].birthKeep, x[1].birthClear]));

  console.log('T1b untouched, the fresh record NOT yet in (Save before the record arrives)');
  await reset(); await p.evaluate(() => { window.__DBR = 4000; }); await open(18, 'ST-2026-113', 700); console.log(await p.evaluate(() => JSON.stringify({ dbl: JSON.stringify(DBL).slice(0,80), db: !!DB, lr: !!(DB && DB.rows.find(x => x[0] === 'ST-2026-113' && x[x.length-1] === 18)), html: document.getElementById('sheetBody').innerHTML.slice(0, 200), on: document.getElementById('sheet').className }))); s = await st(); console.log('   ', JSON.stringify(s));
  if(!BASE) ok(s.go && s.go.dis && /Loading the latest record/.test(s.go.txt), 'Save disabled · "Loading the latest record…"', s.go);
  await typeCity(); await save(); await p.evaluate(() => { try{ sendStu(18, 'ST-2026-113'); }catch(e){} }); await p.waitForTimeout(300); w = await saves();
  ok(w.length === 0, 'nothing sent (click and direct sendStu)', w.map(x => [x[1].birth]));
  await p.waitForTimeout(4000); s = await st(); console.log('   ', JSON.stringify(s));
  if(!BASE) ok(s.go && !s.go.dis && /October 2013/.test(s.ro || ''), 'record arrived → Save enabled, read-only October 2013', s);
  await save(); w = await saves(); ok(w.length === 1 && w[0][1].birth === '2013-10-01' && w[0][1].birthKeep === 1 && /x$/.test(w[0][1].city), 'then saves with stored birthdate kept and the typed city', w.map(x => [x[1].birth, x[1].birthKeep, x[1].city]));

  console.log('T2 full date edited (ST-2026-058 row 94, 2021-07-10)');
  await reset(); await open(94, 'ST-2026-058'); s = await st(); console.log('   ', JSON.stringify(s));
  if(!BASE) ok(s.birth.type === 'date' && s.birth.val === '2021-07-10' && !s.birth.hidden && s.act.join('|') === 'Remove birthdate', 'date box shows 2021-07-10 + Remove action', s);
  await setBirth('2021-07-11'); await save(); w = await saves();
  ok(w.length === 1 && w[0][1].birth === '2021-07-11' && !w[0][1].birthKeep && !w[0][1].birthClear, 'payload birth 2021-07-11, no flags', w.map(x => [x[1].birth, x[1].birthKeep, x[1].birthClear]));

  console.log('T2b full date box emptied by hand (no Remove) → kept');
  await reset(); await open(94, 'ST-2026-058'); await setBirth(''); await typeCity(); await save(); w = await saves();
  ok(w.length === 1 && w[0][1].birth === '2021-07-10' && w[0][1].birthKeep === 1, 'payload keeps 2021-07-10', w.map(x => [x[1].birth, x[1].birthKeep]));

  if(!BASE){
  console.log('T3 explicit remove (full date row 94, then month-year row 27)');
  await reset(); await open(94, 'ST-2026-058'); await act('Remove birthdate'); s = await st(); console.log('   ', JSON.stringify(s));
  await save(); w = await saves();
  ok(w.length === 1 && w[0][1].birth === '' && w[0][1].birthClear === 1 && !w[0][1].birthKeep, 'payload birth "" + birthClear', w.map(x => [x[1].birth, x[1].birthKeep, x[1].birthClear]));
  await reset(); await open(27, 'ST-2026-105'); await act('Remove birthdate'); await save(); w = await saves();
  ok(w.length === 1 && w[0][1].birth === '' && w[0][1].birthClear === 1, 'month-year: Remove → "" + birthClear (no other change needed)', w.map(x => [x[1].birth, x[1].birthClear]));
  await reset(); await open(27, 'ST-2026-105'); await act('Remove birthdate'); await act('Keep the birthdate'); s = await st(); await typeCity(); await save(); w = await saves();
  ok(s.ro && /April 2018/.test(s.ro) && w.length === 1 && w[0][1].birth === '2018-04-01' && w[0][1].birthKeep === 1, 'Remove then "Keep the birthdate" → kept', { s, w: w.map(x => [x[1].birth, x[1].birthKeep]) });

  console.log('T4 Change birthdate on month-year (row 27)');
  await reset(); await open(27, 'ST-2026-105'); await act('Change birthdate'); s = await st(); console.log('   ', JSON.stringify(s));
  ok(s.birth.type === 'date' && s.birth.val === '' && !s.birth.hidden, 'Change → empty real date box (no day made up)', s.birth);
  await typeCity(); await save(); w = await saves(); ok(w.length === 1 && w[0][1].birth === '2018-04-01' && w[0][1].birthKeep === 1, 'left empty → kept', w.map(x => [x[1].birth, x[1].birthKeep]));
  await reset(); await open(27, 'ST-2026-105'); await act('Change birthdate'); await setBirth('2018-04-15'); await save(); w = await saves();
  ok(w.length === 1 && w[0][1].birth === '2018-04-15' && !w[0][1].birthKeep, 'full date picked → sent', w.map(x => [x[1].birth, x[1].birthKeep]));

  console.log('T5 stored as text the date box cannot hold (row 47 "March//2018", synthetic)');
  await reset(); await open(47, 'ST-2026-006'); s = await st(); console.log('   ', JSON.stringify(s));
  ok(s.ro && /March 2018/.test(s.ro), 'read-only March 2018', s.ro);
  await typeCity(); await save(); w = await saves(); ok(w.length === 1 && w[0][1].birth === 'March//2018' && w[0][1].birthKeep === 1, 'payload sends the original text + birthKeep', w.map(x => [x[1].birth, x[1].birthKeep]));

  console.log('T6 no birthdate stored (row 5): add one');
  await reset(); await open(5, 'ST-2026-124'); s = await st(); ok(s.birth.type === 'date' && s.birth.val === '' && !s.act.length, 'empty date box, no Remove', s);
  await setBirth('2017-02-03'); await save(); w = await saves(); ok(w.length === 1 && w[0][1].birth === '2017-02-03', 'new birthdate sent', w.map(x => [x[1].birth]));

  console.log('T7 slow line (window.__PREVIEW_DELAY = 1500 for every request)');
  await reset(); await p.evaluate(() => { window.__PREVIEW_DELAY = 1500; }); const t0 = Date.now(); await p.evaluate(() => { window.__open = stuForm(94, 'ST-2026-058'); });
  let seenWait = false, enabledAt = 0; for(let k = 0; k < 60; k++){ await p.waitForTimeout(100); s = await st(); if(s.go && s.go.dis && /Loading/.test(s.go.txt)) seenWait = true; if(s.go && !s.go.dis){ enabledAt = Date.now() - t0; break; } }
  const rec = await p.evaluate(() => !!document.getElementById('sBirthR') && document.getElementById('sBirthR').value);
  ok(seenWait && enabledAt > 1400 && rec === '94|ST-2026-058', 'button waits, enables when the record arrives (' + enabledAt + ' ms)', { seenWait, enabledAt, rec });
  await p.evaluate(() => { window.__PREVIEW_DELAY = 0; });

  console.log('T8 stale form: closed / other screen / other student before the record arrives');
  await reset(); await p.evaluate(() => { window.__DBR = 2500; }); await open(27, 'ST-2026-105', 600); console.log('   VIEW before', await p.evaluate(() => VIEW)); await p.evaluate(() => go(VIEW === 'astudents' ? 'mtoday' : 'astudents')); await p.waitForTimeout(3000); s = await st();
  await p.evaluate(() => { try{ sendStu(27, 'ST-2026-105'); }catch(e){} }); await p.waitForTimeout(300); w = await saves();
  ok(!s.on && w.length === 0, 'after go(other screen): card closed, sendStu sends nothing', { on: s.on, w: w.length });
  await reset(); await p.evaluate(() => { window.__DBR = 2500; }); await open(27, 'ST-2026-105', 600); await p.evaluate(() => closeSheet()); await p.evaluate(() => { window.__DBR = 5000; }); await open(94, 'ST-2026-058', 2000);
  s = await st(); ok(s.on && s.go && s.go.dis && /Loading/.test(s.go.txt), 'A\'s record arrived while B is open → B still waiting', s.go);
  await p.evaluate(() => { try{ sendStu(27, 'ST-2026-105'); }catch(e){} }); await save(); w = await saves(); ok(w.length === 0, 'nothing sent for A or B', w.length);
  await p.waitForTimeout(4500); s = await st(); ok(s.go && !s.go.dis && s.birth.val === '2021-07-10', 'B ready with B\'s record', s);

  console.log('T9 record fails to load → button says so, tap loads again');
  await reset(); await p.evaluate(() => { window.__DBR = 'fail'; }); await open(94, 'ST-2026-058', 600); s = await st(); ok(s.go && s.go.dis, 'while failing: still blocked', s.go); for(let k = 0; k < 40; k++){ await p.waitForTimeout(1000); if(await p.evaluate(() => /Could not/.test((document.getElementById('sGo') || {}).textContent || ''))) break; } s = await st(); console.log('   ', JSON.stringify(s.go));
  ok(s.go && !s.go.dis && /Could not load the latest record/.test(s.go.txt), 'failure shown on the button', s.go);
  await p.evaluate(() => { window.__DBR = 0; }); await save(); w = await saves(); for(let k = 0; k < 50; k++){ await p.waitForTimeout(100); s = await st(); if(s.go && !s.go.dis) break; }
  ok(w.length === 0 && s.go && !s.go.dis && /Save|Nothing/.test(s.go.txt), 'tap → reloaded, nothing sent, Save available', { w: w.length, go: s.go });
  await setBirth('2021-07-12'); await save(); w = await saves(); ok(w.length === 1 && w[0][1].birth === '2021-07-12', 'then saves normally', w.map(x => [x[1].birth]));

  console.log('T10 failed save → form comes back (sheetBack) and can be sent again with the same decision');
  await reset(); await open(27, 'ST-2026-105'); await act('Remove birthdate');
  const r10 = await p.evaluate(async () => { const sn = sheetSnap(); closeSheet(); await new Promise(r => setTimeout(r, 300)); sheetBack(sn); await new Promise(r => setTimeout(r, 300));
    return { R: (document.getElementById('sBirthR') || {}).value, M: (document.getElementById('sBirthM') || {}).value, x: !document.getElementById('sBirthX').hidden }; });
  await save(); w = await saves(); ok(r10.R === '27|ST-2026-105' && r10.M === 'clear' && r10.x && w.length === 1 && w[0][1].birthClear === 1, 'restored form keeps its state and sends', { r10, w: w.map(x => [x[1].birth, x[1].birthClear]) });
  }
  console.log('errors:', JSON.stringify(errs.slice(0, 8)));
  console.log('RESULT pass ' + pass + ' fail ' + fail); await b.close();
})();
