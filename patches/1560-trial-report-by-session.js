// 1560 · Trials: a trial is matched to its report by the class session (calendar event id), not by the date (29 Oct 2026, Misty's audit).
// Will (ST-2026-123): booked Sat 24 Oct 10:00, moved by the office to Sun 25 Oct (same calendar event lkj78…), report dated 25 Oct and
// sent; Trials › No report yet still listed "Will · 24 Oct" because Google's list (mgmtTrials.wait) compares the TC&SUB log date with
// the report date. Same pattern on 29 Oct: Haochen (26 Oct, moved to 31 Oct, not held yet) and Eric (two more "Trial" log rows on
// 18 + 19 Oct, other events, after his 12 Oct report).
// Now (records untouched, nothing merged or deleted; matching only):
// · coe-trials v11 `recon` (read-only, management): every Trial session logged in TC&SUB (last 75 days) with its calendar event id, where
//   that event is now (day, cancelled, moved from) and the trial reports. Kept on the device (instant open), refreshed every 5 minutes.
// · Each "No report yet" entry is classified by its session:
//     moved + report on the new day   → not listed; the report row says "rescheduled from <old day>"
//     moved to a later day (not held) → not listed (it shows in Booked trial classes as "moved from")
//     moved, past, no report          → listed, "moved to <day>"
//     event cancelled                  → listed, chip "Cancelled?" (check the calendar)
//     another session of the same student has a report (−14 … +30 days) → listed, chip "Check" + which report (a second trial or a
//                                        mislabelled class? decided by a person, never merged automatically)
//     otherwise                        → listed, "No report yet" (a real missing report)
// · An enquiry linked to the old date (e.g. "24 Oct|Will") finds the report on the new day.
// · If the session list cannot be read, everything stays exactly as before.
require('../tools/lib.js')(process.argv[2], [
  ["return w ? { i: -1, r: w } : null; }", "if(w) return { i: -1, r: w }; const a = window.trRecon1560 && trRecon1560.alias(k); return a && a !== k ? trialOf(a) : null; }"],
  ["wait = !t.label, [c, l] = wait ? ['red', 'No report yet'] : TL_ST(t.status);", "wait = !t.label, [c, l] = wait ? (window.trRecon1560 ? trRecon1560.chip(t) : ['red', 'No report yet']) : TL_ST(t.status);"],
  ["(t.sent ? ' · sent ' + esc(t.sent.at) : '') + '</div><div class=\"tags\"", "(t.sent ? ' · sent ' + esc(t.sent.at) : '') + (window.trRecon1560 ? esc(trRecon1560.note(t)) : '') + '</div><div class=\"tags\""]
]);
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8'); const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1560 · trial ↔ report by session (calendar event id) */
(function(){ if(window.__1560) return; window.__1560 = 1;
  var KEY = 'coe.trRecon', RC = null, busy = 0, at = 0;
  try{ RC = JSON.parse(localStorage.getItem(KEY) || 'null'); if(!(RC && Array.isArray(RC.sessions))) RC = null; }catch(e){ RC = null; }
  var low = function(x){ return String(x || '').trim().toLowerCase(); }, first = function(x){ return low(x).split(/[\s·(]+/)[0]; }, up = function(x){ return String(x || '').trim().toUpperCase(); };
  var today = function(){ return new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10); };   /* Philippine / China calendar day */
  var addD = function(d, n){ return new Date(Date.parse(d + 'T00:00:00Z') + n * 864e5).toISOString().slice(0, 10); };
  function same(a, w){ var c = up(w.code); return (/^ST-/.test(c) && up(a.code) === c) || (first(a.s || a.student) && first(a.s || a.student) === first(w.student)); }
  function reps(){ var R = (RC && RC.reports) || [], T = (typeof TRL !== 'undefined' && TRL && TRL.rows) || []; return R.concat(T.map(function(r){ return { d: r.date, code: r.code, s: r.student }; })); }
  function classify(w){
    var S = ((RC && RC.sessions) || []).filter(function(x){ return x.d === w.date && same(x, w); });
    if(!S.length) return { k: 'missing' };
    var s0 = S.find(function(x){ return x.cal && x.cal.day !== w.date; }) || S[0], ev = s0.ev || '', R = reps();
    var hasOn = function(d){ return R.some(function(r){ return r.d === d && same(r, w); }); };
    if(s0.cal && s0.cal.day !== w.date){ var to = s0.cal.day;
      if(s0.cal.x) return { k: 'cancelled', to: to, ev: ev };
      if(hasOn(to)) return { k: 'moved-reported', to: to, ev: ev };
      if(to > today()) return { k: 'moved-ahead', to: to, ev: ev };
      return { k: 'moved', to: to, ev: ev }; }
    if(s0.cal && s0.cal.x) return { k: 'cancelled', ev: ev };
    var lo = addD(w.date, -14), hi = addD(w.date, 30), o = R.filter(function(r){ return r.d !== w.date && r.d >= lo && r.d <= hi && same(r, w); })
      .sort(function(a, b){ return Math.abs(Date.parse(a.d) - Date.parse(w.date)) - Math.abs(Date.parse(b.d) - Date.parse(w.date)); })[0];
    if(o) return { k: 'check', rep: o.d, ev: ev };
    return { k: 'missing', ev: ev }; }
  function apply(){ var T = (typeof TRL !== 'undefined' && TRL) ? TRL : null; if(!T || !RC) return;
    if(T.wait !== T._rcW) T._rcAll = (T.wait || []).slice();
    var seen = {}, out = [];
    (T._rcAll || []).forEach(function(w){ w._rc = classify(w);
      if(w._rc.k === 'moved-reported'){ (T.rows || []).forEach(function(r){ if(r.date === w._rc.to && same({ code: r.code, s: r.student }, w)) r._mvFrom = w.date; }); return; }
      if(w._rc.k === 'moved-ahead') return;
      var dk = (w._rc.ev || '') + '|' + w.date + '|' + first(w.student); if(w._rc.ev && seen[dk]) return; seen[dk] = 1; out.push(w); });
    var rank = { missing: 0, moved: 0, cancelled: 1, check: 2 }; out.sort(function(a, b){ return (rank[a._rc.k] || 0) - (rank[b._rc.k] || 0) || String(b.date).localeCompare(String(a.date)); });
    T.wait = out; T._rcW = out; }
  function load(force){ if(busy || typeof TOKEN === 'undefined' || !TOKEN || !(typeof D !== 'undefined' && D && D.mgr) || typeof FAST_URL === 'undefined') return;
    if(!force && at && Date.now() - at < 5 * 6e4) return; busy = 1;
    fetch(FAST_URL + '-trials', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, recon: 75 }) }).then(function(x){ return x.json(); })
      .then(function(j){ if(!(j && j.ok && Array.isArray(j.sessions))) return; at = Date.now(); var k0 = JSON.stringify(RC); RC = { sessions: j.sessions, reports: j.reports || [], next: j.next || {}, at: at };
        try{ localStorage.setItem(KEY, JSON.stringify(RC)); }catch(e){}
        if(typeof TRL !== 'undefined' && TRL){ TRL._rcW = null; TRL.wait = TRL._rcAll || TRL.wait; }
        apply(); try{ window.dispatchEvent(new Event('coe-trrecon')); }catch(e){}
        if(k0 !== JSON.stringify(RC) && typeof VIEW !== 'undefined' && VIEW === 'trials' && typeof renderTP === 'function') renderTP(); })
      .catch(function(){}).finally(function(){ busy = 0; }); }
  var D_ = function(d){ var x = new Date(String(d) + 'T12:00:00'); return isNaN(x) ? String(d) : x.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); };
  window.trRecon1560 = {
    ready: function(){ return !!RC; }, all: function(){ return (typeof TRL !== 'undefined' && TRL && TRL._rcAll) || []; }, data: function(){ return RC; }, load: load, apply: apply,
    chip: function(t){ var r = t && t._rc; if(!r) return ['red', 'No report yet']; return r.k === 'check' ? ['amber', 'Check'] : r.k === 'cancelled' ? ['', 'Cancelled?'] : r.k === 'moved' ? ['red', 'No report yet'] : ['red', 'No report yet']; },
    note: function(t){ if(t && t.label && t._mvFrom) return ' · rescheduled from ' + t._mvFrom; var r = t && t._rc; if(!r || t.label) return '';
      return r.k === 'moved' ? ' · moved to ' + r.to : r.k === 'cancelled' ? ' · cancelled in the calendar' + (r.to ? ' (' + r.to + ')' : '') + ' · check'
        : r.k === 'check' ? ' · another booking has the report (' + r.rep + ')' : ''; },
    alias: function(k){ var T = (typeof TRL !== 'undefined' && TRL) ? TRL : null; if(!T) return ''; var w = (T._rcAll || []).find(function(x){ return low(x.date + '|' + x.student) === low(k) && x._rc && x._rc.k === 'moved-reported'; });
      if(!w) return ''; var r = (T.rows || []).find(function(x){ return x.date === w._rc.to && same({ code: x.code, s: x.student }, w); }); return r ? low(r.date + '|' + r.student) : ''; },
    day: D_ };
  var _lt = window.loadTrials; if(typeof _lt === 'function') window.loadTrials = async function(){ var r = await _lt.apply(this, arguments); try{ apply(); load(); }catch(e){} return r; };
  var _r = window.renderTP; if(typeof _r === 'function') window.renderTP = function(){ try{ apply(); load(); }catch(e){} return _r.apply(this, arguments); };
  try{ apply(); }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
console.log('1560 trial ↔ report by session');
