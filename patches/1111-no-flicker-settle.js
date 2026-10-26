// 1111: (Misty 14:20) screens "flicker and look like they're adjusting when opening" — shared fix, management and teachers.
// Measured on the live app (26 Oct): every screen is drawn, painted, and only then finished by ~40 small "finishing passes"
// (contrast colours, button styles, number alignment, chart axes and hints, tab-strip arrows, …) that waited 60–700 ms on
// timers after each redraw. Screens also redraw when fresh data arrives (Finance overview every ~2 s while loading) and each
// redraw showed the unfinished version again for a moment: colours change, a chart gets its axis late, a 27 px hint line
// appears and disappears (Finance height 1507 ↔ 1534 px), number columns shift.
// Fix (presentation only): when a screen's content changes, the finishing passes that were waiting on short timers (≤ 800 ms)
// now run straight away in the same step, before the browser paints — so only the finished screen is ever shown and an
// identical redraw looks identical. Safety: a pass runs at most 3 times per step (one that keeps re-triggering itself goes back to its own timer), at most 40 rounds and 150 ms per step; only finishing passes (by name) are moved, never other timers and a time budget (if the passes would cost more than
// 400 ms in a second, they go back to their normal timers for 2 s); every pass still also has its original timer as a fallback.
// While a screen is being finished, button/colour transitions are switched off (they made buttons fade from solid to outline).
// Nothing about data, saving, buttons or what the passes do changes — only when they run.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const js = String.raw`<script>/* 1111 · finish screens before they are painted (no flicker) */
(function(){
  if(window.__1111) return; window.__1111 = 1;
  var NMO = window.MutationObserver, nST = window.setTimeout.bind(window), nCT = window.clearTimeout.bind(window);
  if(!NMO || typeof queueMicrotask !== 'function') return;
  var PASS = /^(all|paint|scan|bars|tag|run|mark|arrange|tidy|polish|fold|deco|decorate|lab|label|apply|fix|dec|add|strip|cut|home|chart|strips|place|later|build|hydrate|queue|refresh|addBtns|essentials|inject|ngBars|sheet|pass|go2)$|\b(all|paint|scan|bars|tag|run|mark|arrange|tidy|polish|fold|deco|decorate|apply|fix|ngBars)\(\)/, taskMs = 0, PER = new Map(), DEPTH = 0, Q = new Map(), sched = false, rounds = 0, reset = 0, spent = 0, spentAt = 0, offUntil = 0, MAX = 800, stats = { fast: 0, slow: 0, rounds: 0, capped: {} };
  function now(){ return (window.performance && performance.now) ? performance.now() : Date.now(); }
  function flush(){ sched = false; if(!Q.size) return;
    if(++rounds > 40 || taskMs > 150){ stats.slow += Q.size; Q.forEach(function(f, id){ var nm = f.n || '?'; stats.capped[nm] = (stats.capped[nm] || 0) + 1; }); Q.clear(); return; }                     /* leave the rest to their own timers */
    quiet(); var items = []; Q.forEach(function(f, id){ var c = (PER.get(f.key) || 0) + 1; if(c > 3) return; PER.set(f.key, c); items.push([id, f]); }); items.forEach(function(e){ Q.delete(e[0]); }); stats.slow += Q.size; Q.clear(); var t0 = now();   /* a pass that keeps re-triggering itself waits for its own timer */
    DEPTH++; try{ items.forEach(function(e){ nCT(e[0]); stats.fast++; try{ e[1](); }catch(x){ setTimeout(function(){ throw x; }, 0); } }); } finally{ DEPTH--; }
    var dt = now() - t0, n = now(); taskMs += dt; if(n - spentAt > 1000){ spentAt = n; spent = 0; } spent += dt; if(spent > 400){ offUntil = n + 2000; }
    stats.rounds = Math.max(stats.rounds, rounds); }
  var qt = 0; function quiet(){ var d = document.documentElement; if(!d.classList.contains('n1111')) d.classList.add('n1111'); if(qt) nCT(qt); qt = nST(function(){ qt = 0; d.classList.remove('n1111'); }, 350); }
  function plan(){ if(!sched){ sched = true; queueMicrotask(flush); } if(!reset){ reset = nST(function(){ reset = 0; rounds = 0; taskMs = 0; PER = new Map(); }, 0); } }
  window.setTimeout = function(fn, ms){
    var a = Array.prototype.slice.call(arguments, 2), d = +ms || 0;
    var key = typeof fn === 'function' ? (fn.name ? fn : String(fn)) : null;
    if(DEPTH > 0 && key && d <= MAX && (PER.get(key) || 0) < 3 && PASS.test(fn.name ? fn.name : String(fn).slice(0, 160)) && now() > offUntil && rounds <= 40 && taskMs <= 150){
      var id = nST(function(){ if(Q.has(id)){ Q.delete(id); } fn.apply(window, a); }, d);
      var run = function(){ fn.apply(window, a); }; run.n = (fn.name || String(fn).slice(0, 60)); run.key = key; Q.set(id, run); plan(); return id; }
    return nST.apply(window, arguments); };
  window.clearTimeout = function(id){ Q.delete(id); return nCT(id); };
  function MO(cb){ var w = function(recs, obs){ DEPTH++; try{ return cb.call(this, recs, obs); } finally{ DEPTH--; } }; return Reflect.construct(NMO, [w], new.target || MO); }
  MO.prototype = NMO.prototype; Object.setPrototypeOf(MO, NMO);
  try{ window.MutationObserver = MO; }catch(e){}
  window.__flicker1111 = function(){ return stats; };
})();
</script>`;
const k = s.indexOf('<script');
const css = '<style id="d1111">/* 1111 · no colour/size animations while a screen is being finished (they made buttons fade between styles) */ html.n1111 #app *,html.n1111 #sheet *{transition:none!important} /* career ladder: current rank on a darker teal from the start (white text AA) instead of a tint added later */ html body .py-wrap .py-t.cur.cur{background:var(--rt,#00666D)!important}</style>';
s = s.slice(0, k) + css + js + '\n' + s.slice(k);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, [
  /* 991/998 amount columns: also re-scan when a screen's content changes (cheap: tables already scanned are skipped) */
  ["var _r = window.render; if(typeof _r === 'function') window.render = function(){ var r = _r.apply(this, arguments); later(); return r; };   /* 998 */",
   "var _r = window.render; if(typeof _r === 'function') window.render = function(){ var r = _r.apply(this, arguments); later(); return r; };   /* 998 */ try{ var mo1111 = new MutationObserver(later); document.querySelectorAll('[id^=\"v-\"]').forEach(function(v){ mo1111.observe(v, { childList: true, subtree: true }); }); var sb1111 = document.getElementById('sheetBody'); if(sb1111) mo1111.observe(sb1111, { childList: true, subtree: true }); }catch(e){}   /* 1111 */"],
  /* 1007 chart axis + hint: handle every Sales-and-costs chart, not only the first one on the page (a hidden copy made the
     visible chart lose its axis until a later check — the chart "adjusted" seconds after opening) */
  ["function chart(){ var card = document.querySelector('.fx-tr'); if(!card) return; var svg = card.querySelector(':scope > svg');",
   "function chart(){ [].forEach.call(document.querySelectorAll('.fx-tr'), function(c){ try{ chart1(c); }catch(e){} }); } window.__c1007 = chart; function chart1(card){ if(!card) return; var svg = card.querySelector(':scope > svg');"],
  /* …and its own "done" mark: the contrast pass marks every element data-c1007="0", which made the chart step think it was done */
  ["if(!svg || svg.dataset.c1007) return;", "if(!svg || svg.dataset.ch1007) return;"],
  ["var G = [].slice.call(svg.querySelectorAll('g[role=button]')); if(G.length < 2) return; svg.dataset.c1007 = '1';", "var G = [].slice.call(svg.querySelectorAll('g[role=button],g[onclick]')); if(G.length < 2) return; svg.dataset.ch1007 = '1';"],
  ["'.fx-tr > svg:not([data-c1007])'", "'.fx-tr > svg:not([data-ch1007])'"],
  /* expose the debounced finishing passes so a redraw deep inside a screen (not only a new screen) finishes before paint */
  ["var q = 0, later = function(){ clearTimeout(q); q = setTimeout(all, 60); };", "var q = 0, later = function(){ clearTimeout(q); q = setTimeout(all, 60); }; window.__l1000 = later;"],
  ["var q = 0, later = function(){ clearTimeout(q); q = setTimeout(all, 250); };", "var q = 0, later = function(){ clearTimeout(q); q = setTimeout(all, 250); }; window.__l1007 = later;"],
  ["var q = 0, later = function(){ clearTimeout(q); q = setTimeout(all, 120); };", "var q = 0, later = function(){ clearTimeout(q); q = setTimeout(all, 120); }; window.__l1102 = later;"],
  ["var q = 0, later = function(){ clearTimeout(q); q = setTimeout(bars, 80); };", "var q = 0, later = function(){ clearTimeout(q); q = setTimeout(bars, 80); }; window.__l1002 = later;"],
]);

s = fs.readFileSync(file, 'utf8');
const js2 = String.raw`<script>/* 1111 · a redraw inside a screen (new rows, a refreshed chart) also finishes before paint */
(function(){ if(window.__1111b) return; window.__1111b = 1;
  function big(rs){ for(var k = 0; k < rs.length; k++){ var r = rs[k]; if(r.type === 'childList' && (r.removedNodes.length > 3 || r.addedNodes.length > 3)) return true;
      for(var j = 0; j < r.addedNodes.length; j++){ var n = r.addedNodes[j]; if(n.nodeType === 1 && n.firstElementChild) return true; } } return false; }
  var L = ['__l1000', '__l1007', '__l1102', '__l1002'];
  var mo = new MutationObserver(function(rs){ if(!big(rs)) return; try{ if(window.__c1007 && document.querySelector('.fx-tr > svg:not([data-ch1007])')) window.__c1007(); }catch(e){} L.forEach(function(k){ try{ if(typeof window[k] === 'function') window[k](); }catch(e){} }); });
  ['app', 'sheetBody'].forEach(function(id){ var el = document.getElementById(id); if(el) mo.observe(el, { childList: true, subtree: true }); });
})();
</script>`;
const e = s.lastIndexOf('</body>'); s = s.slice(0, e) + js2 + '\n' + s.slice(e); fs.writeFileSync(file, s);
