// Renewal test suite (28 Oct 2026 · Misty: "We always go back to this same concern every time our students renew.")
// Runs on EVERY release: tools/check.js calls it (CI "Check the screens"), so a change that breaks a renewal rule fails the release.
// Rules: server/RULES-renewals.md. Tests the one renewal calculation in app.html (<script id="coe-renew">) with the cases that went
// wrong before, plus static checks that every screen still goes through it. The database side of the rule (coe_pkg_calc) has its
// own cases in server/TEST-renewals-1540.sql (run in a rolled-back transaction).
// usage: node tools/renewal-suite.js app.html   (exit 1 on any failure)
const fs = require('fs'), vm = require('vm');
function run(file) {
  const s = fs.readFileSync(file, 'utf8'), out = []; let bad = 0;
  const ok = (name, cond, got) => { out.push((cond ? 'ok    ' : 'FAIL  ') + name + (cond ? '' : '  · got ' + JSON.stringify(got))); if (!cond) bad++; };
  const m = s.match(/<script id="coe-renew">([\s\S]*?)<\/script>/);
  if (!m) { console.error('FAIL  renewal module <script id="coe-renew"> is missing from app.html'); return 1; }
  const ctx = { console, Date, Math, JSON, Object, Number, String, Promise, isNaN, globalThis: null }; ctx.globalThis = ctx; vm.createContext(ctx);
  vm.runInContext(m[1], ctx); const R = ctx.coeRenew;
  ok('module loads', !!R && typeof R.split === 'function', !!R); if (!R) return 1;
  const T0 = Date.parse('2026-10-28T14:30:00Z'), fresh = { at: '2026-10-28T14:25:00Z', copyAt: '2026-10-28T14:24:00Z', copyOk: true };
  const pic = (rows, row, extra) => { const sp = R.split(R.fromRows(rows), row); return { sp, g: R.guard(Object.assign({ split: sp, doc: fresh, row, now: T0 }, extra || {})) }; };

  // 1 · Lucy: 20:30 class ended before the 22:17 renewal → old package · 2.5 carried + 33 new · 0 used · 35.5 now
  { const rows = [{ owner: true, carry: 2.5, enrolled: 33, finished: 0, available: 35.5 }, { carry: '', finished: 0 }];
    const row = { ok: true, now: 35.5, start: '2026-10-30', validRule: '2027-06-30', validSheet: '2027-06-30' };
    const { sp, g } = pic(rows, row, { renew: true, tot: 33 });
    ok('Lucy · split 2.5 + 33 − 0 = 35.5', sp.ok && sp.carry === 2.5 && sp.new === 33 && sp.used === 0 && sp.now === 35.5, sp);
    ok('Lucy · guard passes', g.ok, g.why);
    ok('Lucy · picture line "2.5 carried over + 33 new"', R.line({ carry: 2.5, tot: 33, used: 0 }) === '2.5 carried over + 33 new · 结转 2.5 + 新购 33 课时', R.line({ carry: 2.5, tot: 33, used: 0 }));
    // the old, wrong split (3 carried + 33 new shown with 35.5 now and the 0.5 hidden) must never draw
    const bad1 = R.split({ carry: 3, add: 0, new: 33, used: 0, now: 35.5 });
    ok('Lucy · "3 + 33 = 35.5" is refused', !bad1.ok && /don’t agree/.test(bad1.why), bad1);
    ok('Lucy · valid until from the first class (30 Oct) → 30 Jun 2027', R.validFrom('2026-10-30', 33) === '2027-06-30', R.validFrom('2026-10-30', 33));
    const g2 = R.guard({ split: sp, doc: fresh, row: Object.assign({}, row, { validSheet: '2027-06-28' }), renew: true, tot: 33, now: T0 });
    ok('Lucy · ACTIVE valid-until 28 Jun ≠ first-class rule → not a hold (picture uses 30 Jun; App health asks for the sheet fix)', g2.ok, g2.why);
    const sync = R.split({ carry: 2.5, add: 0, new: 33, used: 0.5, now: 35.5 });
    ok('Lucy 29 Oct · the sync\'s "+0.5 used" (2.5 + 33 − 0.5 ≠ 35.5) is still refused, never drawn', !sync.ok, sync);
    ok('Lucy · renewal form holds a stale carry (Google 3, held 2.5)', R.formHold(3, 2.5).hold === true && R.formHold(3, 2.5).sheet === 3 && R.formHold(3, 2.5).live === 2.5, R.formHold(3, 2.5));
    ok('Lucy · form saves once Google takes it off itself (early)', R.formHold(2.5, 2.5, 0.5).hold === false && R.formHold(3, 2.5, 0.5).hold === false, 0);
    ok('Lucy · teachers: Daniela (previous) left off the renewal picture', JSON.stringify(R.teachers(['Daniela', 'Dezza'], ['Daniela'])) === '["Dezza"]', R.teachers(['Daniela', 'Dezza'], ['Daniela']));
    ok('teachers · nobody known as previous → all kept', JSON.stringify(R.teachers(['Daniela', 'Dezza'], [])) === '["Daniela","Dezza"]', 0);
  }
  // 2 · a class AFTER the renewal counts in the new package and shows on the picture
  { const { sp, g } = pic([{ owner: true, carry: 2.5, enrolled: 33, finished: 0.5, available: 35 }], { ok: true, now: 35 }, { renew: true, tot: 33 });
    ok('after · 2.5 + 33 − 0.5 = 35', sp.ok && sp.used === 0.5 && sp.now === 35 && g.ok, sp);
    ok('after · picture line shows the used lesson', R.line({ carry: 2.5, tot: 33, used: 0.5 }) === '2.5 carried over + 33 new − 0.5 used · 结转 2.5 + 新购 33 课时 − 已上 0.5', R.line({ carry: 2.5, tot: 33, used: 0.5 })); }
  // 3 · Luna: paid 28 Oct, the new cycle starts with the 31 Oct class → valid until 30 Jun 2027 (month end kept)
  { ok('Luna · 31 Oct + 8 months = 30 Jun 2027', R.validFrom('2026-10-31', 33) === '2027-06-30', R.validFrom('2026-10-31', 33));
    const { g } = pic([{ owner: true, carry: 4, enrolled: 33, finished: 0, available: 37 }], { ok: true, now: 37, start: '2026-10-31', validRule: '2027-06-30', validSheet: '2027-06-30' }, { renew: true, tot: 33 });
    ok('Luna · guard passes (4 + 33 = 37)', g.ok, g.why);
    const old = R.guard({ split: R.split({ carry: 0, add: 0, new: 33, used: 30, now: 3 }), doc: fresh, row: null, renew: true, oldRow: true, tot: 33, now: T0 });
    ok('Luna · ACTIVE still on the old package → held', !old.ok && old.why.some(w => /old package/.test(w)), old.why); }
  // 4 · free lessons: 30+3 = 33 lessons → 8 months · 60+8 = 68 → 12 months · 15 → 4 months; ENROLLED must equal paid + free
  { ok('free · 30+3 → 8 months', R.months(33) === 8, R.months(33)); ok('free · 60+8 → 12 months', R.months(68) === 12, R.months(68)); ok('free · 15 → 4 months', R.months(15) === 4, R.months(15));
    ok('free · 29.5 → 4 months · 30 → 8', R.months(29.5) === 4 && R.months(30) === 8, 0);
    const { g } = pic([{ owner: true, carry: 2, enrolled: 30, finished: 0, available: 32 }], { ok: true, now: 32 }, { renew: true, tot: 33 });
    ok('free · ENROLLED 30 for a 30+3 payment → held', !g.ok && g.why.some(w => /ENROLLED/.test(w)), g.why);
    const fr = R.split(R.fromRows([{ owner: true, carry: 1, enrolled: 33, incentive: 2, finished: 0, available: 36 }]));
    ok('free · incentive lessons are counted (1 + 33 + 2 = 36)', fr.ok && fr.new === 33 && fr.add === 2, fr); }
  // 5 · two teachers on one package (Lucy: Daniela row + Dezza row) and a shared family package
  { const rows = [{ owner: true, carry: 3, enrolled: 33, finished: 0.5, available: 34 }, { carry: '', finished: 1.5 }];
    const sp = R.split(R.fromRows(rows)); ok('two teachers · 3 + 33 − (0.5 + 1.5) = 34', sp.ok && sp.used === 2, sp);
    const sp2 = R.split(R.fromRows([{ owner: true, carry: 3, enrolled: 33, finished: 0.5, available: 34 }, { carry: '', finished: 1 }]));
    ok('two teachers · one teacher\'s lesson missing → held', !sp2.ok, sp2);
    const sh = R.split(R.fromRows([{ owner: true, carry: -1, enrolled: 33, finished: 2, available: 32.5 }, { carry: 2.5, finished: 0 }]));
    ok('shared / extra rows · carry on a second row counts (−1 + 2.5 + 33 − 2 = 32.5)', sh.ok && sh.carry === 1.5, sh);
    const gift = R.split({ carry: 2, add: 0, new: 33, used: 1, now: 36 }, { ok: true, now: 36, unk: 2 });
    ok('gift / returned lessons known to the database → shown as other, not refused', gift.ok && gift.other === 2, gift);
    const nog = R.split({ carry: 3, add: 0, new: 33, used: 0, now: 35.5 }, { ok: true, now: 35.5, unk: 0 });
    ok('an unexplained difference is never absorbed (3 + 33 ≠ 35.5 even if the check row says ok)', !nog.ok, nog); }
  // 6 · half lessons (25 min = 0.5): no floating-point drift
  { const sp = R.split(R.fromRows([{ owner: true, carry: 0.1 + 0.2, enrolled: 33, finished: 0.5 + 0.5 + 0.5, available: 31.8 }]));
    ok('half lessons · 0.3 + 33 − 1.5 = 31.8 exactly', sp.ok, sp);
    ok('half lessons · 2.5 + 33 − 0.5 = 35', R.split({ carry: 2.5, add: 0, new: 33, used: 0.5, now: 35 }).ok, 0); }
  // 7 · stale inputs: an old ACTIVE copy (like 11:24 today), a check that stopped, a save still waiting, a check not loaded
  { const sp = R.split({ carry: 2.5, add: 0, new: 33, used: 0, now: 35.5 });
    const g1 = R.guard({ split: sp, doc: { at: '2026-10-28T14:25:00Z', copyAt: '2026-10-28T03:24:00Z', copyOk: false }, renew: true, now: T0 });
    ok('stale · renewal picture · Google sync stopped → held with the time', !g1.ok && /out of date/.test(g1.why.join()), g1.why);
    const g2 = R.guard({ split: sp, doc: { at: '2026-10-28T13:40:00Z', copyAt: '2026-10-28T14:24:00Z', copyOk: true }, renew: true, now: T0 });
    ok('stale · renewal picture · renewal check older than 25 min → held', !g2.ok && /has not run since/.test(g2.why.join()), g2.why);
    const g3 = R.guard({ split: sp, doc: fresh, row: { pending: true }, now: T0 }); ok('stale · renewal save waiting for Google → held', !g3.ok, g3.why);
    const g4 = R.guard({ split: sp, doc: null, needDoc: true, renew: true, now: T0 }); ok('stale · renewal check not loaded → held', !g4.ok, g4.why);
    // 1610 · ordinary "Lessons left" pictures and the Lesson Summary: database numbers + the numbers-agree check only (Abby, 29 Oct 08:56)
    { const off = { at: '2026-10-28T13:40:00Z', copyAt: '2026-10-28T03:16:00Z', copyOk: false }, abby = R.split(R.fromRows([{ owner: true, carry: '', enrolled: 15, finished: 3.5, available: 11.5 }]), null);
      const g5 = R.guard({ split: abby, doc: off, row: null, now: T0 }); ok('1610 · Abby · ordinary picture, sync stopped + check old, numbers agree (15 − 3.5 = 11.5) → shown', g5.ok, g5.why);
      const bad = R.split(R.fromRows([{ owner: true, carry: '', enrolled: 15, finished: 3.5, available: 12 }]), null), g6 = R.guard({ split: bad, doc: off, row: null, now: T0 });
      ok('1610 · ordinary picture, numbers disagree (15 − 3.5 ≠ 12) → still 核对中, for the numbers only', !g6.ok && g6.why.length === 1 && !/out of date|has not run/.test(g6.why.join()), g6.why);
      const g7 = R.guard({ split: abby, doc: off, row: null }); ok('1610 · Lesson Summary call (no renewal) with a stopped sync → shown', g7.ok, g7.why);
      ok('1611 · wiring · the renewal save also waits while Google\'s sync has stopped', s.indexOf("const G = d ? R.guard({ doc: d, renew: true }) : null; if(G && !G.ok) H = { hold: true, why: G.why.join(' · ') };") > -1, 0); }
    ok('stale · lessons left unknown → form holds (核对中)', R.formHold('', 2.5).hold && /核对中/.test(R.formHold('', 2.5).why), R.formHold('', 2.5));
    ok('stale · lessons now unknown → split refused (核对中)', !R.split({ carry: 1, add: 0, new: 33, used: 0, now: null }).ok, 0); }
  // 8 · Anna / Luna validity dates
  { ok('Anna · first class 25 Oct, 33 lessons → 25 Jun 2027', R.validFrom('2026-10-25', 33) === '2027-06-25', R.validFrom('2026-10-25', 33));
    ok('Leo · first class 27 Oct, 68 lessons → 27 Oct 2027', R.validFrom('2026-10-27', 68) === '2027-10-27', R.validFrom('2026-10-27', 68));
    ok('month end · 31 Jan + 4 months = 31 May · 30 Nov + 4 = 30 Mar · 29 Feb 2028 + 12 = 28 Feb 2029', R.addM('2027-01-31', 4) === '2027-05-31' && R.addM('2026-11-30', 4) === '2027-03-30' && R.addM('2028-02-29', 12) === '2029-02-28', 0);
    ok('no first class yet → no valid-until (never a guess)', R.validFrom('', 33) === '', 0); }
  // static: every screen still goes through the one calculation
  ok('wiring · renewal picture header uses coeRenew.line', s.indexOf("c.fillText(window.coeRenew ? coeRenew.line(Q)") > -1, 0);
  ok('wiring · picture / Lesson Summary / form / App health guard present', /window\.__1540 = 1/.test(s) && s.indexOf('window.lsHtml = function(code){') > -1 && s.indexOf('_ls.apply(this, arguments)') > -1 && s.indexOf('R.formHold(S.info.left') > -1 && s.indexOf("'Renewal · ' + x.name") > -1, 0);
  ok('wiring · lesson-balance picture and Lesson Summary use the first-class valid-until (1543)', s.indexOf('if(P.bal && !Q0 && row && row.validRule) P.bal.deadline = row.validRule;') > -1 && s.indexOf('k0.o[k0.C.deadline] = rw0.validRule') > -1, 0);
  ok('wiring · no "carry + new" estimate of lessons now', s.indexOf("Q.now = fresh && +b.left < Q.tot") < 0 && s.indexOf('Q.carry = Math.round(+b.left * 10) / 10') < 0, 0);
  // the database cases (server/TEST-renewals-1540.sql) must keep the payment-time cases (1542): the payment time is the Payment Confirmation's generated time
  { const sq = require('path').join(require('path').dirname(require('path').resolve(file)), 'server', 'TEST-renewals-1540.sql');
    if (fs.existsSync(sq)) { const t = fs.readFileSync(sq, 'utf8'); ok('database cases · payment time from the Payment Confirmation (S7) and a void one (S8) are kept', /S7 payment time taken from the confirmation/.test(t) && /S8 void confirmation/.test(t), 0);
      ok('database cases · no ACTIVE edits + a recent Google check-in is not stale (S9) / a stopped sync is (S10) · 1547', /S9 no ACTIVE edits/.test(t) && /S10 no Google check-in/.test(t), 0); } }
  // 1546 · the portal's renewal-month hold (supabase-coe-student-v*/renew.ts, newest): 核对中 only where the numbers really disagree
  return guard1546(file, ok).then(() => { console.log(out.join('\n')); console.log(bad ? '\n' + bad + ' renewal check(s) FAILED' : '\nAll ' + out.length + ' renewal checks passed'); return bad ? 1 : 0; });
}
async function guard1546(file, ok) {
  const P = require('path'), root = P.dirname(P.resolve(file));
  const dirs = fs.readdirSync(root).filter((d) => /^supabase-coe-student-v\d+$/.test(d) && fs.existsSync(P.join(root, d, 'renew.ts'))).sort((a, b) => +a.split('-v')[1] - +b.split('-v')[1]);
  if (!dirs.length) return;
  const src = fs.readFileSync(P.join(root, dirs[dirs.length - 1], 'renew.ts'), 'utf8');
  ok('portal hold · uses the calendar from Oct 2026, the row start day, and the payment time (1546)', /CAL = "2026-10"/.test(src) && /const sb = r\.buy/.test(src) && /!paid && x >= post - bd/.test(src), 0);
  const strip = require('module').stripTypeScriptTypes; if (typeof strip !== 'function') return;   // behaviour cases need Node ≥ 22.13
  const js = strip(src).replace(/^export /gm, '');
  const flags = async (T) => {   // T: table → rows; a tiny read-only stand-in for supabase-js (filters ignored except range paging)
    const q = (t) => { const b = { a: 0, z: 1e9 }; const o = { select: () => o, is: () => o, order: () => o, ilike: () => o, gt: () => o, eq: () => o, range: (a, z) => { b.a = a; b.z = z; return o; },
      then: (res) => res({ data: (T[t] || []).slice(b.a, b.z + 1), error: null }) }; return o; };
    const ctx = { Date, Math, Number, String, JSON, Map, Set, Promise, Error, console }; vm.createContext(ctx);
    vm.runInContext(js + '\nthis.renewFlags = renewFlags;', ctx); return ctx.renewFlags({ from: q });
  };
  const daily = (tab, m0, rows) => [{ tab, r: 1, data: [0, 0, 0, 0, m0] }].concat(rows.map(([code, t, days], i) => { const d = [code, '', t, '']; for (let j = 0; j < 31; j++) d.push(days[j + 1] || ''); return { tab, r: 3 + i, data: d }; }));
  const pk = (id, code, t, buy, x) => Object.assign({ id, code, teacher: t, buy, enrolled: 33, active: true, shared: null, fin_adj: 0 }, x || {});
  const C = 'ST-2099-001';
  const mar = (c, extra) => ({ coe_packages: [pk('a', C, 'Kat', '2026-03-10')].concat(extra ? extra.pk : []), coe_pkg_mon: [{ id: 'a', m: '2026-03-01', v: c }].concat(extra ? extra.mon : []),
    sheet_rows: daily('MAR-DAILY', '2026-03-01', [[C, 'Kat', { 5: 1, 10: 0.5, 20: 1.5 }]]), coe_renew_at: [], coe_cls_days: [] });
  ok('portal hold · counted from the payment date (2) → shown', !(await flags(mar(2))).has(C), 0);
  ok('portal hold · start-day class on the old side, no payment time (1.5) → shown', !(await flags(mar(1.5))).has(C), 0);
  { const T = mar(1.5); T.coe_renew_at = [{ code: C, buy: '2026-03-10' }]; ok('portal hold · same with a recorded payment time saying after → 核对中', (await flags(T)).has(C), 0); }
  ok('portal hold · whole month counted (3, a class before the payment twice) → 核对中', (await flags(mar(3))).has(C), 0);
  ok('portal hold · a teacher row with no DAILY record that month is not compared', !(await flags(mar(2, { pk: [pk('b', C, 'Mayi', '2026-03-10', { enrolled: null })], mon: [{ id: 'b', m: '2026-03-01', v: 4 }] }))).has(C), 0);
  const oct = (cal, c) => ({ coe_packages: [pk('o', C, 'April', '2026-10-10')], coe_pkg_mon: [{ id: 'o', m: '2026-10-01', v: c }],
    sheet_rows: daily('OCT-DAILY', '2026-10-01', [[C, 'April', { 3: 1.5, 12: 3 }]]), coe_renew_at: [], coe_cls_days: cal.map(([day, h]) => ({ code: C, t: 'april', day, h, hb: 0 })) });
  ok('portal hold · from Oct the calendar decides, not the DAILY copy (2.5 = calendar) → shown', !(await flags(oct([['2026-10-03', 1.5], ['2026-10-12', 2.5]], 2.5))).has(C), 0);
  ok('portal hold · from Oct a real difference with the calendar → 核对中', (await flags(oct([['2026-10-03', 1.5], ['2026-10-12', 2.5]], 4))).has(C), 0);
  { const T = { coe_packages: [pk('d', C, 'Dezza', '2026-10-10'), pk('r', 'ST-2099-002', 'Rose', '2026-10-05', { enrolled: null, shared: C })],
      coe_pkg_mon: [{ id: 'd', m: '2026-10-01', v: 2 }, { id: 'r', m: '2026-10-01', v: 2.5 }], sheet_rows: [], coe_renew_at: [],
      coe_cls_days: [{ code: C, t: 'dezza', day: '2026-10-03', h: 1, hb: 0 }, { code: C, t: 'dezza', day: '2026-10-14', h: 2, hb: 0 }, { code: 'ST-2099-002', t: 'rose', day: '2026-10-06', h: 1, hb: 0 }, { code: 'ST-2099-002', t: 'rose', day: '2026-10-12', h: 1.5, hb: 0 }] };
    ok('portal hold · a shared row counts from its own start day (Rose 5 Oct, owner 10 Oct) → shown', !(await flags(T)).has(C), 0); }
}
module.exports = run;
if (require.main === module) Promise.resolve(run(process.argv[2] || 'app.html')).then((c) => process.exit(c));
