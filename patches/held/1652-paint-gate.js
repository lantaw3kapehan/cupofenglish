// HELD again (29 Oct 23:40): tap-to-paint passes, but no measured benefit on current main (redraw test already 0 on base; cold/warm traces mixed). Not applied.
// 1652 = the 1650 paint gate held on 29 Oct (taps were slower while the runtime contrast passes ran; 1626 switched those off).
// 1650: (Misty 11:57, student Abby ST-2026-105: "Class notice flashes green then turns outline · the Overview numbers flicker on refresh")
// ROOT CAUSE of "shows old then new / it adjusts" on every screen: ~100 screen "finishers" (MutationObserver passes that restyle buttons,
// add icons, fold the toolbar, fix colours …) wait 60–700 ms on a timer before they run. The browser paints the plain screen first and
// the finished one later: a flash, again on every background redraw. The older gate (1111) caught only some of them (a list of names,
// max 3 per task, 150 ms per task), and debounced finishers ("wait until nothing changed for 120 ms") were starved while data kept
// arriving (thousands of clearTimeout calls during one student open in the 4× CPU trace).
// Fix: one paint gate, the FIRST script of the page, before anything creates an observer:
//  · a timer of ≤ 800 ms started by a screen observer (or by a finisher it ran) is a finisher. It keeps its real timer as a fallback,
//    but runs just BEFORE the next paint: all finishers waiting at the frame's animation step run together, once each, quickest first;
//    finishers they start run in the same frame (microtask). A screen drawn inside an animation frame is finished in that same frame.
//  · safety (28 Oct freeze): per frame at most 25 rounds, 4 runs of the same observer and 150 ms (as 1111 allowed per task); past
//    that the rest keep their own timers (the old behaviour); a finisher that keeps re-arming itself 3 frames running, or more than
//    400 ms of finishing within one second, sends all finishers back to their own timers for 2 s. One row per page load goes to coe_speed as fn 'gate:cap' (view = the observer's name) when a cap is hit after the
//    first 15 s or by a loop, like 'cls:student'.
//  · timers started outside observers (saves, the 1614 scheduler, toasts, polling) are untouched; clearTimeout works as before.
//  · 1652 (re-tested 29 Oct evening, after 1626 switched the runtime contrast passes off): 1111 stays on and keeps doing what it did;
//    in the second after a tap or key press this gate lets every timer through untouched, so a tapped screen costs exactly what it did
//    (interleaved tap-to-paint test, 9–15 runs a side: no screen slower by more than 20 ms at the median). It acts on the frames
//    nobody tapped for: data arriving, background refreshes. window.__gate1650() returns its counters.
const lib = require('../../tools/lib.js'), file = process.argv[2];
const GATE = `<script id="g1650">
/* 1650 · paint gate: screen finishers run before the paint, not 60–700 ms after it (no "plain then finished" flash) */
(function(){
  if(window.__gate1650) return;
  var W = window, NMO = W.MutationObserver, nST = W.setTimeout, nCT = W.clearTimeout, nRAF = W.requestAnimationFrame;
  if(!NMO || typeof nRAF !== 'function' || typeof queueMicrotask !== 'function' || typeof Reflect === 'undefined' || !Reflect.construct) return;
  var secAt = 0, secMs = 0, MAXD = 800, MAXR = 25, BUDGET = 150, PERK = 4, PER = new Map(), COST = new Map(), lastIn = -1e9;
  var DEPTH = 0, CUR = null, P = new Map(), inFrame = false, rafOn = false, mtOn = false, rounds = 0, spent = 0, coolUntil = 0, capStreak = 0, lastCapFrame = -1, frameNo = 0;
  var stats = { fast: 0, fallback: 0, frames: 0, maxRounds: 0, maxMs: 0, caps: 0, capped: {}, ms: {}, seen: {} }, logged = {}, nLogged = 0, nSeen = 0;
  var now = function(){ return W.performance && performance.now ? performance.now() : Date.now(); };
  var nm = function(f){ if(!f) return '?'; var n = f.name || ''; if(n && !/^(bound )?(anonymous)?$/.test(n)) return n; return String(f).replace(/\\s+/g, ' ').slice(0, 40); };
  function log(name){ if(logged[name] || nLogged >= 1) return; logged[name] = 1; nLogged++;
    nST.call(W, function(){ try{ if(typeof TOKEN === 'undefined' || !TOKEN) return; var v = typeof COE_V !== 'undefined' ? COE_V : 0;
      fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-notice', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, keepalive: true,
        body: JSON.stringify({ token: TOKEN, action: 'speed', rows: [{ fn: 'gate:cap', ms: Math.round(spent), ui: false, view: String(name).slice(0, 30), v: v, dev: (innerWidth || 0) < 900 ? 'phone' : 'laptop', at: new Date().toISOString() }] }) }).catch(function(){}); }catch(e){} }, 3000); }
  function cap(loop){ var first = null; P.forEach(function(r){ if(!first) first = r; stats.capped[r.n] = (stats.capped[r.n] || 0) + 1; }); stats.fallback += P.size; P.clear();   /* they keep their real timers */
    stats.caps++; if(lastCapFrame !== frameNo){ capStreak = lastCapFrame === frameNo - 1 ? capStreak + 1 : 1; lastCapFrame = frameNo; } if(loop && capStreak >= 3) coolUntil = now() + 2000;
    if(first && (loop || now() > 15000)) log(first.n); }
  var qt = 0; function quiet(){ var d = document.documentElement; if(!d.classList.contains('n1111')) d.classList.add('n1111'); if(qt) nCT.call(W, qt); qt = nST.call(W, function(){ qt = 0; d.classList.remove('n1111'); }, 350); }
  try{ ['pointerdown', 'keydown', 'touchstart'].forEach(function(ev){ addEventListener(ev, function(){ lastIn = now(); }, { capture: true, passive: true }); }); }catch(e){}
  function budget(){ return BUDGET; }
  function run(){ if(!P.size) return; var B = budget(); if(rounds >= MAXR || spent > B || now() < coolUntil){ cap(rounds >= MAXR); return; }
    rounds++; stats.maxRounds = Math.max(stats.maxRounds, rounds); var items = [], over = []; P.forEach(function(r){ var c = PER.get(r.k) || 0; if(c >= PERK){ over.push(r); return; } PER.set(r.k, c + 1); items.push(r); }); P.clear(); quiet();
    items.sort(function(x, y){ return (COST.get(x.k) || 0) - (COST.get(y.k) || 0); });   /* quick finishers first; a slow one that does not fit waits for its own timer */
    over.forEach(function(r){ stats.fallback++; stats.capped[r.n] = (stats.capped[r.n] || 0) + 1; });   /* re-arming itself in this frame: its own timer */
    var t0 = now(); DEPTH++;
    try{ for(var i = 0; i < items.length; i++){ var r = items[i]; if(r.done) continue;
        if(spent + now() - t0 > B){ for(var j = i; j < items.length; j++) if(!items[j].done){ P.set(items[j].id, items[j]); } cap(); break; }
        nCT.call(W, r.id); stats.fast++; var pc = CUR; CUR = r.k;
        try{ r.go(); }catch(x){ nST.call(W, function(){ throw x; }, 0); } finally{ CUR = pc; } } }
    finally{ DEPTH--; var dt = now() - t0, n1 = now(); spent += dt; stats.maxMs = Math.max(stats.maxMs, Math.round(spent));
      if(n1 - secAt > 1000){ secAt = n1; secMs = 0; } secMs += dt; if(secMs > 400){ coolUntil = n1 + 2000; secMs = 0; stats.cool = (stats.cool || 0) + 1; } } }   /* > 400 ms of finishing in a second: 2 s on their own timers (as 1111) */
  function micro(){ mtOn = false; run(); }
  var endOn = false; function endSoon(){ if(endOn) return; endOn = true; nST.call(W, function(){ endOn = false; inFrame = false; }, 0); }   /* the frame's own observers / resize callbacks still finish in this frame */
  function frame(){ rafOn = false; frameNo++; stats.frames++; rounds = 0; spent = 0; PER = new Map(); inFrame = true; endSoon(); run(); }
  /* screens drawn inside an animation frame: their finishers run in that same frame (not the next one) */
  W.requestAnimationFrame = function(cb){ if(typeof cb !== 'function') return nRAF.apply(W, arguments); return nRAF.call(W, function(t){ if(!inFrame){ inFrame = true; endSoon(); } return cb.call(W, t); }); };
  function plan(){ if(inFrame){ if(!mtOn){ mtOn = true; queueMicrotask(micro); } } else if(!rafOn){ rafOn = true; nRAF.call(W, frame); } }
  W.setTimeout = function(fn, ms){ var d = +ms || 0;
    if(DEPTH > 0 && typeof fn === 'function' && d <= MAXD && now() >= coolUntil && now() - lastIn >= 1000){   /* in the second after a tap: exactly as before (1111 only), so taps are not slower */
      var a = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : [];
      var r = { fn: fn, k: CUR || fn, n: nm(CUR || fn), done: false, id: 0 };
      r.go = function(){ if(r.done) return; r.done = true; P.delete(r.id); var t1 = now(); try{ fn.apply(W, a); } finally{ var dt = now() - t1; COST.set(r.k, COST.has(r.k) ? COST.get(r.k) * .7 + dt * .3 : dt); stats.ms[r.n] = Math.round(((stats.ms[r.n] || 0) + dt) * 10) / 10; } };
      r.id = nST.call(W, function(){ r.go(); }, d);   /* fallback: its own timer, exactly as before */
      var sk = r.n + ' > ' + nm(fn) + ' ' + d; if(stats.seen[sk]) stats.seen[sk]++; else if(nSeen < 300){ nSeen++; stats.seen[sk] = 1; }
      P.set(r.id, r); plan(); return r.id; }
    return nST.apply(W, arguments); };
  W.clearTimeout = function(id){ var r = P.get(id); if(r){ r.done = true; P.delete(id); } return nCT.call(W, id); };
  function MO(cb){ var w = function(recs, obs){ DEPTH++; var pc = CUR; CUR = cb; try{ return cb.call(this, recs, obs); } finally{ DEPTH--; CUR = pc; } };
    return Reflect.construct(NMO, [w], new.target || MO); }
  MO.prototype = NMO.prototype; try{ Object.setPrototypeOf(MO, NMO); }catch(e){}
  try{ W.MutationObserver = MO; }catch(e){}
  W.__gate1650 = function(){ return stats; };
})();
</script>`;
lib(file, [
  ['<meta charset="utf-8">\n<script id="l1651">', '<meta charset="utf-8">\n' + GATE + '\n<script id="l1651">']
]);
