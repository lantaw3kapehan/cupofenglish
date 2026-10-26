// 1221 · 26 Oct (Misty 21:00, audit retest: Alice's CEFR summary vs journey; Luna's blank level).
// One rule for "the CEFR level now", used by the student page box, the CEFR journey (and its parent picture) and — on the server
// (coe v44) — the Students list:
//   latest dated assessment (progress check, or a trial report written after the student started, e.g. a second teacher's trial)
//   → otherwise the latest course level in DATABASE › CEFR & BOOKS, reading EVERY DATABASE row of the code, oldest first class first
//   → otherwise the trial CEFR.
// Before: Alice ST-2024-101 showed A1 in the box while the journey put Julia's 24 Oct A2 trial on the Pre-A1 start step; Alice
// ST-2024-029 (Kat since Mar 2024, Dezza since Sep 2026) "started with us Sep 2026 at A1" because only Dezza's newer row was read;
// teachers saw "—" (blank) in the CEFR box (Luna: Pre-A1 in the journey) because their student list has no CEFR.
// Data comes from the new read-only edge function coe-cj (all DATABASE rows + every trial report of the code; teachers only for
// their own students, without enrolment dates). A trial report by another teacher can raise the level shown, never lower it.
// Display only: no record is written. If coe-cj does not answer, everything shows exactly as before.
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
["T.push({ d: cjDay(c.date), i, en: 'Progress check', zh: '阶段测评' })", "T.push({ d: cjDay(c.date), i, en: c.tr ? 'Assessment' : 'Progress check', zh: '阶段测评' })"],
["<div><b>${esc(s.cefr||(C[0]&&C[0].cefr)||", "<div><b>${esc((window.cjNowLv ? cjNowLv(STU) : '')||s.cefr||(C[0]&&C[0].cefr)||"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1221 · one CEFR level everywhere (student box = CEFR journey = Students list) · data: coe-cj (read-only) */
(function(){
  if(window.__1221) return; window.__1221 = 1;
  var CJX = window.CJX = {}, LV = { at: 0, busy: 0, lv: null };
  var add7 = function(d){ var t = Date.parse(d + 'T12:00:00'); return isNaN(t) ? '' : new Date(t + 7 * 864e5).toISOString().slice(0, 10); };
  function prep(S){ try{
    var r = S && S.r; if(!r) return S; var P = r.profile, X = CJX[S.code] || {}, cj = (P && P.cj) || X.cj || null, T = Array.isArray(r.trials) ? r.trials : Array.isArray(X.trials) ? X.trials : null;
    if(!cj && !T) return S;
    var row = P && Array.isArray(P.row) ? P.row.slice() : null;
    var ix = function(re){ return P && Array.isArray(P.head) ? P.head.findIndex(function(h){ return re.test(String(h || '')); }) : -1; };
    if(cj && row){ var put = function(re, v){ var j = ix(re); if(j > -1 && v != null && v !== '') row[j] = v; };
      put(/FIRST CLASS/i, cj.first); put(/TRIAL CLASS\s*·\s*DATE/i, cj.td); put(/TRIAL CLASS\s*·\s*BOOK/i, cj.tb); put(/TRIAL CLASS\s*·\s*CEFR/i, cj.tc);
      var jc = ix(/CEFR\s*&\s*BOOKS/i); if(jc > -1) row[jc] = cj.cb || ''; }
    var get = function(re){ var j = ix(re); return j > -1 && row ? row[j] : ''; };
    var T0 = (T || []).filter(function(t){ return t && t.date; }).map(function(t){ return t.date; }).sort();
    var st = cjDay(get(/FIRST CLASS/i)) || cjDay(get(/TRIAL CLASS\s*·\s*DATE/i)) || T0[0] || '', lim = st ? add7(st) : '';
    var ch = String(get(/CEFR\s*&\s*BOOKS/i) || '').split(/→|->/).map(cjLv).filter(function(i){ return i >= 0; }), base = ch.length ? ch[ch.length - 1] : cjLv(get(/TRIAL CLASS\s*·\s*CEFR/i));
    var isLater = function(t){ return t && t.date && lim && t.date > lim; };
    var later = (T || []).filter(function(t){ return isLater(t) && cjLv(t.cefr) >= 0 && cjLv(t.cefr) >= base; });   /* another teacher's placement never lowers the level */
    var early = (T || []).filter(function(t){ return !isLater(t); });
    var r2 = Object.assign({}, r); if(row) r2.profile = Object.assign({}, P, { row: row });
    if(later.length) r2.checks = (r.checks || []).concat(later.map(function(t){ return { date: t.date, cefr: t.cefr, teacher: t.teacher, total: t.total, tr: 1 }; }));
    if(r.trial && isLater(r.trial)){ var e0 = early[early.length - 1]; r2.trial = e0 ? Object.assign({}, r.trial, e0) : null; }   /* the start step keeps the first trial */
    return Object.assign({}, S, { r: r2 });
  }catch(e){ return S; } }
  var _cj = window.cjHtml;
  if(typeof _cj === 'function') window.cjHtml = function(S){ return _cj.call(this, prep(S)); };
  window.cjNowLv = function(S){ try{ window._CJ = null; cjHtml(S); var c = window._CJ; return c && c.now != null && c.now >= 0 ? CJ_L[c.now] : ''; }catch(e){ return ''; } };
  function paintStu(code){ try{ if(typeof STU === 'undefined' || !STU || STU.code !== code) return; var el = document.querySelector('#sheetBody section.cj');
      var n = cjHtml(STU), lv = cjNowLv(STU); if(el && n && el.outerHTML !== n){ var y = ($('sheet') || {}).scrollTop; el.outerHTML = n; try{ $('sheet').scrollTop = y; }catch(e){} }
      var k = [...document.querySelectorAll('#sheetBody .kpis > div')].find(function(d){ return /CEFR/.test((d.querySelector('span') || {}).textContent || ''); }); if(k && lv){ var b = k.querySelector('b'); if(b && b.textContent !== lv) b.textContent = lv; } }catch(e){} }
  async function one(code){ var X = CJX[code]; if(!code || (X && (X.busy || Date.now() - X.at < 3e5)) || typeof TOKEN === 'undefined' || !TOKEN) return; CJX[code] = Object.assign({}, X || {}, { busy: 1, at: X ? X.at : 0 });
    try{ var r = await fetch(FAST_URL + '-cj', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'one', code: code }) }).then(function(y){ return y.json(); });
      if(r && r.ok){ var was = JSON.stringify([X && X.cj, X && X.trials]); CJX[code] = { at: Date.now(), cj: r.cj || null, trials: r.trials || [] }; if(was !== JSON.stringify([r.cj || null, r.trials || []])) paintStu(code); } else CJX[code] = Object.assign({}, X || {}, { busy: 0 }); }
    catch(e){ CJX[code] = Object.assign({}, X || {}, { busy: 0 }); } }
  var _sr = window.stuRender;
  if(typeof _sr === 'function') window.stuRender = function(){ var r = _sr.apply(this, arguments); try{ if(typeof STU !== 'undefined' && STU && STU.code) one(STU.code); }catch(e){} return r; };
  /* Students list (management): the same level */
  function applyLv(){ try{ if(!LV.lv || typeof MS === 'undefined' || !Array.isArray(MS)) return 0; var n = 0; MS.forEach(function(x){ var v = x && LV.lv[x.code]; if(v && x.cefr !== v){ x.cefr = v; n++; } }); return n; }catch(e){ return 0; } }
  async function list(){ if(LV.busy || Date.now() - LV.at < 6e5 || typeof TOKEN === 'undefined' || !TOKEN || typeof D === 'undefined' || !D || !D.mgr) return; LV.busy = 1;
    try{ var r = await fetch(FAST_URL + '-cj', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'list' }) }).then(function(y){ return y.json(); });
      if(r && r.ok && r.lv){ LV.lv = r.lv; LV.at = Date.now(); if(applyLv() && typeof VIEW !== 'undefined' && VIEW === 'astudents') renderAStudents(); } }catch(e){} finally{ LV.busy = 0; } }
  var _ra = window.renderAStudents;
  if(typeof _ra === 'function') window.renderAStudents = function(){ applyLv(); var r = _ra.apply(this, arguments); setTimeout(list, 0); return r; };
  try{ if(typeof STU !== 'undefined' && STU && document.querySelector('#sheetBody section.cj')) one(STU.code); }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
