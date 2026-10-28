// Trials / Enquiries / Payment Confirmation regression checks (29 Oct 2026, releases 1560–1566). Run next to regress-saves.js:
//   node tools/regress-trials.js <app.html>
// Builds the management preview on the trials sample data (tools/trials-fixture.js) and checks, with every network answer stubbed
// in the page (nothing reaches Google, the database or e-mail):
//   1. Payment Confirmation (1563): Review → Issue writes the confirmation record exactly once and sends NO e-mail; "Email to …" later
//      sends the e-mail once and does not issue again (the issue time is the renewal payment time, coe_renew_at).
//   2. Trial ↔ report matching (1560): a trial moved to another day matches its report by calendar event id; a trial moved ahead is
//      not "no report yet"; repeated entries after a report are kept but flagged "check"; a real missing report stays.
//   3. Trial dialogs (1562): an adult trial opens Price picture / Course plan on Adults, a young learner on Kids & teens.
//   4. Enquiries (1565): no negative "days"; the summary cards open the list they count.
// Exit code 1 on any failure.
const { chromium } = require('playwright'), { execSync } = require('child_process'), path = require('path');
const app = path.resolve(process.argv[2] || 'app.html'), root = path.resolve(__dirname, '..'), pv = '/tmp/regress-trials.html';
(async () => {
  execSync('node tools/trials-fixture.js audit/fx/synth.json audit/fx/synth-trials.json', { cwd: root, stdio: 'ignore' });
  execSync(`node tools/preview-build.js ${app} audit/fx/synth-trials.json ${pv} regress-trials`, { cwd: root, stdio: 'ignore' });
  const b = await chromium.launch(), p = await b.newPage({ viewport: { width: 1440, height: 900 } }), errs = []; p.on('pageerror', e => errs.push(e.message + (process.env.STACK ? ' @ ' + String(e.stack).split('\n').slice(1, 4).join(' / ') : '')));
  p.on('dialog', d => d.accept());
  let bad = 0; const out = [], ok = (n, c, why) => { out.push((c ? 'ok    ' : 'FAIL  ') + n + (c ? '' : '  · ' + why)); if(!c) bad++; };
  await p.goto('file://' + pv + '#trials'); await p.waitForTimeout(8000);

  /* 1 · Payment Confirmation */
  const pc = await p.evaluate(async () => {
    const calls = [], _f = window.fetch;
    const P = [{ code: 'AE-P30', name: 'Adult English Professional Package', zh: '巩固阶段 · {n}节课', descr: 'One-to-One English Language Program\n30 Units', category: 'Adult English', units: '30', rate: '80.00', free: false, bonus_units: '3', extras: [], sort: 21 }];
    window.fetch = function(u, o){ const url = String(u && u.url || u), body = o && typeof o.body === 'string' ? o.body : '';
      if(/coe-invoice/.test(url)){ let j = {}; try{ j = JSON.parse(body); }catch(x){} calls.push('inv:' + j.action);
        const inv = Object.assign({}, j.inv || {}, { no: 9001, status: 'issued', created_at: '2027-10-24T05:50:00Z', email: 'parent@example.invalid' });
        const ans = j.action === 'boot' ? { ok: true, products: P, next: 9001, profile: { email: 'parent@example.invalid', bill_name: 'Student Test' }, student: { en: 'Test', zh: '', city: '' }, recent: [] } : j.action === 'issue' ? { ok: true, invoice: inv } : { ok: true };
        return Promise.resolve(new Response(JSON.stringify(ans))); }
      if(/mailInvoice/.test(body)){ calls.push('mail'); return Promise.resolve(new Response(JSON.stringify({ ok: true, data: { ok: true } }))); }
      return _f.apply(this, arguments); };
    const wait = ms => new Promise(r => setTimeout(r, ms));
    try{ await ivOpen('ST-2099-606'); }catch(e){ return { err: 'open ' + e.message, calls }; }
    await wait(300); const btn = document.getElementById('ivGo'); const lbl = btn ? btn.textContent : '';
    ivReview(); await wait(100); const rev = /Review before issuing/.test((document.querySelector('#ivM .iv-f') || {}).textContent || '');
    const before = calls.slice(); await ivIssue(); await wait(1500);
    const afterIssue = calls.slice(), mailBtn = !!document.querySelector('#ivMail button');
    ivMailNow(); await wait(2500); const mailTxt = ((document.getElementById('ivMail') || {}).textContent || '');
    try{ ivFin(); }catch(e){} window.fetch = _f;
    return { lbl, rev, before, afterIssue, after: calls.slice(), mailBtn, mailTxt }; });
  if(pc.err) ok('payment confirmation opens', false, pc.err); else {
    const n = (L, k) => L.filter(x => x === k).length;
    ok('PC button says Review (not "and email it")', /^Review Payment Confirmation/.test(pc.lbl) && !/email/i.test(pc.lbl), pc.lbl);
    ok('PC review screen shown before issuing', pc.rev, 'no review');
    ok('PC nothing issued before Issue', n(pc.before, 'inv:issue') === 0, pc.before.join(','));
    ok('PC Issue writes the confirmation once', n(pc.afterIssue, 'inv:issue') === 1, pc.afterIssue.join(','));
    ok('PC Issue sends no e-mail', n(pc.afterIssue, 'mail') === 0, pc.afterIssue.join(','));
    ok('PC "Email to" button after issuing', pc.mailBtn, 'missing');
    // (offline the PDF library cannot load, so the e-mail stops before sending with "Not emailed: …"; it must still never issue again)
    ok('PC Email sends once (or reports why not) and does not issue again', n(pc.after, 'inv:issue') === 1 && (n(pc.after, 'mail') === 1 || /Not emailed/.test(pc.mailTxt)), pc.after.join(',') + ' · ' + pc.mailTxt); }

  /* 2 · trial ↔ report by session */
  const tr = await p.evaluate(async () => { const w = ms => new Promise(r => setTimeout(r, ms)); for(let i = 0; i < 30 && !(window.trRecon1560 && trRecon1560.ready()); i++) await w(200);
    if(!window.trRecon1560) return { err: 'trRecon1560 missing' };
    const W = (TRL && TRL.wait) || [], all = trRecon1560.all();
    const k = (s, d) => (all.find(x => x.student === s && x.date === d) || {})._rc;
    return { open: W.filter(x => !x._rc || x._rc.k === 'missing' || x._rc.k === 'moved').map(x => x.student + ' ' + x.date), chenia: k('Chenia', '2027-10-23'), toma: k('Toma', '2027-10-25'), ricco: k('Ricco', '2027-10-17'), lumi: k('Lumi', '2027-10-22'),
      rep: ((TRL.rows || []).find(r => r.student === 'Chenia') || {})._mvFrom || '' }; });
  if(tr.err) ok('trial matching loaded', false, tr.err); else {
    ok('moved trial matched to its report (Chenia 23 → 24 Oct)', tr.chenia && tr.chenia.k === 'moved-reported', JSON.stringify(tr.chenia));
    ok('report shows "rescheduled from"', tr.rep === '2027-10-23', tr.rep);
    ok('trial moved ahead is not missing (Toma → 30 Oct)', tr.toma && tr.toma.k === 'moved-ahead', JSON.stringify(tr.toma));
    ok('repeat entry after a report kept, flagged check (Ricco 17 Oct)', tr.ricco && tr.ricco.k === 'check', JSON.stringify(tr.ricco));
    ok('real missing report stays (Lumi)', tr.lumi && tr.lumi.k === 'missing' && tr.open.indexOf('Lumi 2027-10-22') > -1, JSON.stringify(tr));
    ok('No report yet = only the real ones', tr.open.length === 1, tr.open.join(', ')); }

  /* 3 · trial dialogs use the trial's learner type */
  const dl = await p.evaluate(async () => { const w = ms => new Promise(r => setTimeout(r, ms)), R = (TRL && TRL.rows) || [], res = {};
    for(const s of ['Chenia', 'Alin']){ const i = R.findIndex(r => r.student === s); if(i < 0){ res[s] = 'no row'; continue; } tlOpen(i); await w(600);
      const pb = document.getElementById('ppB'); if(pb) pb.click(); await w(300); res[s + ' price'] = ((document.querySelector('#ppAd .on') || {}).textContent || '').trim(); closeSheet(); await w(200);
      tlOpen(i); await w(600); const cb = document.getElementById('cpB'); if(cb) cb.click(); await w(300); res[s + ' plan'] = ((document.querySelector('#cpAdS .on') || {}).textContent || '').trim() + ' / ' + ((document.querySelector('#cpGo .on') || {}).textContent || '').trim(); closeSheet(); await w(200); }
    return res; });
  ok('adult trial → Price picture on Adults', /^Adults/.test(dl['Chenia price'] || ''), JSON.stringify(dl));
  ok('adult business trial → Course plan Adults · business', /^Adults/.test(dl['Chenia plan'] || '') && /business/i.test(dl['Chenia plan'] || ''), JSON.stringify(dl));
  ok('young learner trial → Price picture on Kids & teens', /^Kids/.test(dl['Alin price'] || ''), JSON.stringify(dl));

  /* 4 · Enquiries */
  await p.evaluate(() => go('enquiry')); await p.waitForTimeout(2500);
  const en = await p.evaluate(async () => { const w = ms => new Promise(r => setTimeout(r, ms)), el = document.getElementById('v-enquiry'), out = { neg: /(^|\s)-\d+\s*(day|DAYS)/i.test(el.innerText), cards: [] };
    const keys = [...el.querySelectorAll('.fn31 .st[onclick]')].map(t => (String(t.getAttribute('onclick')).match(/enqF\('(\w+)'\)/) || [])[1]);
    for(const k of keys){ const t = document.querySelector('#v-enquiry .fn31 .st[onclick="enqF(\'' + k + '\')"]'); if(!t) continue; const n = +((t.querySelector('b') || {}).textContent || 0); t.click(); await w(400);
      const rows = document.querySelectorAll('#enqBox .tdr').length, on = !!document.querySelector('#v-enquiry .fn31 .st.on[onclick="enqF(\'' + k + '\')"]'); out.cards.push(k + ' ' + n + '/' + rows + (on ? '' : ' (not marked)')); }
    return out; });
  ok('Enquiries: no negative day counts', !en.neg, 'negative label');
  ok('Enquiries: 4 summary cards found', en.cards.length === 4, en.cards.join(', '));
  ok('Enquiries: each card opens the list it counts, marked', en.cards.every(c => { const [a, b2] = c.split(' ')[1].split('/'); return !/not marked/.test(c) && (+a === +b2 || (+a > 60 && +b2 === 60)); }), en.cards.join(', '));

  ok('no page errors', !errs.length, errs.slice(0, 3).join(' | '));
  console.log(out.join('\n')); console.log((out.length - bad) + '/' + out.length + ' passed');
  await b.close(); process.exit(bad ? 1 : 0); })();
