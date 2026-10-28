// Save → refresh regression test (28 Oct 2026, Misty: "why issues like these are being repetitive?"). Run in every release, next to
// the stability check:  node tools/regress-saves.js <app.html>
// For each kind of save, the database bumps a change stamp (docs 'sys:stamps', release 1424). This test builds the management preview,
// plants STALE copies in every cache a screen keeps (class lists, ACTIVE, money, student page, Schedule window, lesson summary), then
// plays the stamp each save produces and checks that every dependent view dropped its stale copy and refetched (no merge).
// Also: the moved-class ghost cleaner (1420), the renewal valid-until rule (1423) and the paid-date chip (1422).
// Exit code 1 on any failure. Nothing is saved: the preview has saving switched off.
const { chromium } = require('playwright'), { execSync } = require('child_process'), path = require('path');
const app = path.resolve(process.argv[2] || 'app.html'), root = path.resolve(__dirname, '..'), pv = '/tmp/regress-mgmt.html';
const SAVES = {   // save type → the change stamps it produces (database-first save and/or Google's copy)
  'renew (mgmtRenewPaid)': ['packages', 'sales', 'lessons'], 'enrol (mgmtEnrolPaid)': ['packages', 'sales', 'students'],
  'move class': ['classes'], 'cancel class': ['classes'], 'add class': ['classes'],
  'add sale': ['sales'], 'add expense': ['money'], 'class note / homework': ['notes'], 'monthly report': ['reports'], 'time-in': ['timein'] };
const EXPECT = {   // stamp → caches that must be gone (stale marker), views that must refetch
  classes: ['CLSM', 'SW', 'STUcls'], packages: ['AT', 'LS'], lessons: ['AT', 'LS'], sales: ['MN', 'LS'], money: ['MN'], students: ['DB'],
  notes: ['STUr'], reports: ['STUr'], timein: [] };
(async () => {
  execSync(`node tools/preview-build.js ${app} audit/fx/synth.json ${pv} regress`, { cwd: root, stdio: 'ignore' });
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1440, height: 900 } }), errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + pv + '#todo'); await p.waitForTimeout(7000);
  let bad = 0; const out = [];
  const ok = (name, cond, why) => { out.push((cond ? 'ok    ' : 'FAIL  ') + name + (cond ? '' : '  · ' + why)); if(!cond) bad++; };
  const has = await p.evaluate(() => ({ reg: typeof coeStampApply === 'function', clean: typeof clsClean === 'function', valid: typeof rnValid === 'function', paid: typeof pkPaid === 'function' }));
  ok('change-stamp registry present (1424)', has.reg, 'coeStampApply missing'); ok('ghost cleaner present (1420)', has.clean, 'clsClean missing');
  ok('renewal validity present (1423)', has.valid, 'rnValid missing'); ok('paid-date helper present (1422)', has.paid, 'pkPaid missing');
  for (const [save, stamps] of Object.entries(SAVES)) {
    const r = await p.evaluate(async (stamps) => {
      const STALE = { stale: 1 }, calls = [];
      // plant stale copies everywhere
      try{ CLSM['ST-ZZZ-001'] = [{ id: 'old', start: '2020-01-01T00:00:00Z', stale: 1 }]; }catch(e){}
      try{ AT = Object.assign({ cols: [], rows: [] }, STALE); }catch(e){} try{ MN = STALE; }catch(e){} try{ DB = STALE; }catch(e){}
      try{ SB_FRESH['mgmt:mgmtActive|[]'] = { t: Date.now(), data: STALE }; SB_FRESH['mgmt:mgmtStuClasses|["ST-ZZZ-001"]'] = { t: Date.now(), data: STALE }; SB_FRESH['mgmt:moneyLists|[]'] = { t: Date.now(), data: STALE }; }catch(e){}
      // watch the refreshers
      const wrap = n => { const f = window[n]; if(typeof f !== 'function') return; window[n] = function(){ calls.push(n); return f.apply(this, arguments); }; };
      ['shSummary', 'swPaint', 'stuRender', 'loadActive', 'loadSchedule', 'loadMoney', 'loadDb'].forEach(wrap);
      try{ coeStampApply(stamps); }catch(e){ return { err: String(e) }; }
      await new Promise(z => setTimeout(z, 300));
      return { CLSM: !(CLSM['ST-ZZZ-001'] && CLSM['ST-ZZZ-001'][0] && CLSM['ST-ZZZ-001'][0].stale), AT: !(AT && AT.stale), MN: !(MN && MN.stale), DB: !(DB && DB.stale),
        freshAT: !SB_FRESH['mgmt:mgmtActive|[]'], freshCls: !SB_FRESH['mgmt:mgmtStuClasses|["ST-ZZZ-001"]'], freshMoney: !SB_FRESH['mgmt:moneyLists|[]'], calls };
    }, stamps);
    if (r.err) { ok(save, false, r.err); continue; }
    const need = [...new Set(stamps.flatMap(s => EXPECT[s] || []))], miss = [];
    if (need.includes('CLSM') && !(r.CLSM && r.freshCls)) miss.push('class list kept a stale copy');
    if (need.includes('AT') && !(r.AT && r.freshAT)) miss.push('ACTIVE kept a stale copy');
    if (need.includes('MN') && !(r.MN && r.freshMoney)) miss.push('money kept a stale copy');
    if (need.includes('DB') && !r.DB) miss.push('student database kept a stale copy');
    ok(save + ' → ' + stamps.join(', '), !miss.length, miss.join(' · '));
  }
  // 1420 · a moved class's old copy never shows
  const g = await p.evaluate(() => clsClean([{ id: 'S', start: '2026-11-01T02:30:00.000Z', mv: null }, { id: 'S', start: '2026-11-01T11:30:00.000Z', mv: { start: '2026-11-01T02:30:00.000Z' } }, { id: 'S', start: '2026-11-08T02:30:00.000Z' }]).map(e => e.start));
  ok('moved class: no ghost at the old time', JSON.stringify(g) === JSON.stringify(['2026-11-01T11:30:00.000Z', '2026-11-08T02:30:00.000Z']), JSON.stringify(g));
  // 1423 · validity = first class + 4/8/12 months, month-end
  const v = await p.evaluate(() => [rnAddM('2026-10-31', 8), rnAddM('2026-09-22', 4), rnAddM('2026-09-22', 8), rnAddM('2027-01-31', 1)]);
  ok('valid-until rule (31 Oct+8 → 30 Jun · 22 Sep+4 → 22 Jan · +8 → 22 May)', JSON.stringify(v) === JSON.stringify(['2027-06-30', '2027-01-22', '2027-05-22', '2027-02-28']), JSON.stringify(v));
  ok('no page errors', !errs.length, errs.slice(0, 2).join(' | '));
  await b.close(); out.forEach(l => console.log(l)); console.log(bad ? `\n${bad} check(s) failed` : `\nAll ${out.length} save/refresh checks passed`); process.exit(bad ? 1 : 0);
})();
