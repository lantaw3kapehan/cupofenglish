// 1180: (Misty, 26 Oct 16:17) "Before you start" keeps popping up on every refresh, with things already done
//      ("Trial report · Will" — sent in the app on 25 Oct; Christian the same with Eric).
// A · The pop-up: shown only for something NEW (each item remembered on this device for 14 days), at most once every 4 hours,
//     never during a class or in the 10 minutes before one, and 6 s after opening (so finished items are cleared first).
//     Refreshing the app never brings it back. Everything stays in Today's list; "Remind me in 2 hours" works as before.
// B · Done = done: the app reads the teacher's confirmed saves from the database (new function coe-done: message "Got it",
//     class-visit "Got it", trial reports, progress checks, peer reviews — status done, last 45 days), keeps them on the device,
//     and applies them BEFORE Today is drawn:
//     · a trial counts as reported when a report for the same student (code or name) was sent from 14 days before to 30 days
//       after the logged date (Will: logged 24 Oct, sent 25 Oct · Eric: logged 11/18/19 Oct, report 12 Oct);
//     · a message the teacher answered is treated as answered even when Google's copy has not caught up or skipped the step
//       (Ara 23 Oct and Lovely 23 Oct: "Recorded in the database (Google step skipped)" — their "Got it" never reached the sheet);
//     · a class visit she tapped "Got it" on stays read on every device; a peer review she sent leaves the list.
//     Nothing is written; records, deadlines and rules are unchanged. Truly pending items stay.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["if(POPPED === sig || snoozed(sig) || inClass() || VIEW !== 'today' || $('sheet').classList.contains('on') || (window._mustAt && Date.now() - window._mustAt < 10 * 6e4)) return;",
   "if(POPPED === sig || snoozed(sig) || inClass() || VIEW !== 'today' || $('sheet').classList.contains('on') || (window._mustAt && Date.now() - window._mustAt < 10 * 6e4) || (window.mustGate1180 && !mustGate1180(L))) return;"],
  ["clearTimeout(window._mustT); window._mustT = setTimeout(() => { if(POPPED === sig || $('sheet').classList.contains('on') || VIEW !== 'today') return; POPPED = sig;\n      window._mustAt = Date.now(); openSheet(popH()); }, 2500);",
   "clearTimeout(window._mustT); window._mustT = setTimeout(() => { if(POPPED === sig || window._mustSig !== sig || $('sheet').classList.contains('on') || VIEW !== 'today' || inClass() || (window.mustGate1180 && !mustGate1180(window._MUST || L))) return; POPPED = sig;\n      window._mustAt = Date.now(); if(window.mustShown1180) mustShown1180(window._MUST || L); openSheet(popH()); }, 6000);"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1180 · finished to-dos leave Today · "Before you start" only for something new */
(function(){
  if(window.__1180) return; window.__1180 = 1;
  var LS = function(k, v){ try{ if(v === undefined) return JSON.parse(localStorage.getItem(k) || 'null'); localStorage.setItem(k, JSON.stringify(v)); }catch(e){ return null; } };
  var me = function(){ try{ return String((D && D.me && D.me.name) || '').trim().toLowerCase(); }catch(e){ return ''; } };
  var DK = function(){ return 'coe.done1180.' + me(); };
  var DONE = null, BUSY = 0;
  function cur(){ if(!DONE || DONE._u !== me()){ DONE = LS(DK()) || null; if(DONE) DONE._u = me(); } return DONE; }
  var day = function(x){ var m = String(x || '').match(/(\d{4}-\d{2}-\d{2})/); return m ? m[1] : ''; };
  var add = function(d, k){ return new Date(Date.parse(d + 'T00:00:00Z') + k * 864e5).toISOString().slice(0, 10); };
  function apply(){
    var X = cur(); if(!X || typeof D === 'undefined' || !D || D.mgr) return;
    try{ (D.special || []).forEach(function(x){ if(!x || !x.reportMissing || !x.date) return; var lo = add(x.date, -14), hi = add(x.date, 30), c = String(x.code || '').trim().toUpperCase(), s = String(x.student || '').trim().toLowerCase();
      if((X.trial || []).some(function(r){ return r.d >= lo && r.d <= hi && ((c && r.c === c) || (s && r.s === s)); })) x.reportMissing = false; }); }catch(e){}
    try{ if(typeof TMSG !== 'undefined' && TMSG && TMSG.threads && (X.ack || []).length){ var A = {}; X.ack.forEach(function(id){ A[id] = 1; });
      TMSG.threads.forEach(function(t){ var r = t && t.root; if(r && r.id && A[r.id] && !r.ack){ r.ack = 'done'; if(!r.seen) r.seen = 'done'; } }); } }catch(e){}
    try{ if((X.visit || []).length){ var v = {}; try{ v = JSON.parse(store('get', 'coe.vack') || '{}') || {}; }catch(e){} var ch = 0; X.visit.forEach(function(id){ if(!v[id]){ v[id] = 1; ch = 1; } }); if(ch) store('set', 'coe.vack', JSON.stringify(v)); } }catch(e){}
    try{ if((X.peer || []).length && Array.isArray(D.peer)){ var P = {}; X.peer.forEach(function(id){ P[id] = 1; }); D.peer = D.peer.filter(function(x){ return !(x && P[x.id]); }); } }catch(e){}
  }
  window.done1180 = function(){ return cur(); };
  async function load(force){
    if(BUSY || typeof D === 'undefined' || !D || D.mgr || !TOKEN || typeof FAST_URL === 'undefined') return; var X = cur(); if(!force && X && Date.now() - (X.at || 0) < 2 * 6e4) return; BUSY = 1;
    try{ var r = await fetch(FAST_URL + '-done', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN }) }).then(function(y){ return y.json(); });
      if(r && r.ok){ var was = JSON.stringify(X ? { a: X.ack, v: X.visit, t: X.trial, p: X.peer } : null); r.at = Date.now(); r._u = me(); DONE = r; LS(DK(), r);
        if(was !== JSON.stringify({ a: r.ack, v: r.visit, t: r.trial, p: r.peer }) && typeof VIEW !== 'undefined' && VIEW === 'today' && typeof renderToday === 'function'){ try{ window.renderToday(); }catch(e){} } } }
    catch(e){} finally{ BUSY = 0; } }
  // the pop-up rule
  var SK = function(){ return 'coe.mustShown1180.' + me(); };
  function shown(){ var o = LS(SK()) || {}, cut = Date.now() - 14 * 864e5, k; for(k in o) if(o[k] < cut) delete o[k]; return o; }
  function nearClass(){ try{ var now = Date.now(); return (D.schedule || []).some(function(c){ if(!c || c.cancelled || c.day !== D.today) return false; var a = Date.parse(c.start), b = Date.parse(c.end); return (a - now <= 10 * 6e4 && b > now); }); }catch(e){ return false; } }
  window.mustGate1180 = function(L){ try{ if(!L || !L.length) return false; var o = shown(); if(!L.some(function(x){ return !o[x.key]; })) return false;
      var last = LS('coe.mustLast1180.' + me()) || 0; if(Date.now() - last < 4 * 3600e3) return false; if(nearClass()) return false; return true; }catch(e){ return false; } };
  window.mustShown1180 = function(L){ try{ var o = shown(), t = Date.now(); (L || []).forEach(function(x){ o[x.key] = t; }); LS(SK(), o); LS('coe.mustLast1180.' + me(), t); }catch(e){} };
  // apply before Today is drawn (same task — no extra flicker), refresh from the database in the background
  var _rt = window.renderToday; if(typeof _rt === 'function') window.renderToday = function(){ try{ apply(); }catch(e){} var r = _rt.apply(this, arguments); setTimeout(function(){ load(false); }, 0); return r; };
  var _r = window.render; if(typeof _r === 'function') window.render = function(){ try{ apply(); }catch(e){} return _r.apply(this, arguments); };
  // a save made on this device counts at once
  var _a = window.api; if(typeof _a === 'function') window.api = function(fn){ var p = _a.apply(this, arguments);
    try{ if(/^(tMsgAck|tVisitAck|tTrialSubmit|tPeerSubmit)$/.test(fn) && p && p.then){ var args = [].slice.call(arguments, 1); p.then(function(res){ if(!(res && res.ok)) return; var X = cur() || { ack: [], visit: [], trial: [], pc: [], peer: [], at: 0 }; X._u = me();
        if(fn === 'tMsgAck') X.ack = (X.ack || []).concat([String(args[1])]); else if(fn === 'tVisitAck') X.visit = (X.visit || []).concat([String(args[1])]); else if(fn === 'tPeerSubmit') X.peer = (X.peer || []).concat([String(args[1])]);
        else if(fn === 'tTrialSubmit' && args[1]) X.trial = (X.trial || []).concat([{ d: day(args[1].date), s: String(args[1].student || '').trim().toLowerCase(), c: String(args[1].code || '').trim().toUpperCase() }]);
        DONE = X; LS(DK(), X); }).catch(function(){}); } }catch(e){} return p; };
  setTimeout(function(){ load(true); }, 1500);
  document.addEventListener('visibilitychange', function(){ if(!document.hidden) load(false); });
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
lib(file, []);
