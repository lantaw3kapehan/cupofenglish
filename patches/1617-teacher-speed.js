// 1617 · teachers' access (Misty 18:09: "supervise and solve what's slow on teachers' access now").
//   · (database, same release) students a teacher may open but who had no saved page (trial and sub students, new ones) get a
//     placeholder copy every 10 min (coe_tstudent_seed, cron coe-tstudent-seed), so the database works their page out live:
//     no more 12–20 s Google "nocopy" waits (April 17:40, 17:48, 18:08). Same rule as Google's teacherHas_.
//   · Today tapped again within 1.5 s (April 17:25: 7 full Today drawings in 1 s, each 52–99 ms): the second tap only scrolls
//     to the top; the screen is not drawn again. A tap after 1.5 s still redraws as before.
//   · Background Google reads that waited their turn (1614) no longer count as "a tap" in the speed log just because she
//     tapped something else at the moment they started (g:tPayReady / g:tPayCheck rows marked ui while the Pay card was
//     already showing the saved copy).
//   · New versions wait from 20 minutes before a class until it ends (was 1 minute before), so a teacher is not reloaded
//     between her time-in and her class.
//   · Real tap-to-paint and long-task numbers from teachers' own laptops and phones (teacher mode only): once a minute at
//     most, the slowest tap (fn inp:<screen>, view = what was tapped) and the longest frame (fn lt:<screen>, view = the
//     script that held it) go to coe_speed (ui false, at most 40 rows an hour). Nothing is shown on screen.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["let p; try{ p = Promise.resolve(an.apply(null, [j.fn].concat(j.args))); }catch(e){ p = Promise.reject(e); }",
   "let p; const u1617 = window._ui; window._ui = 0; try{ p = Promise.resolve(an.apply(null, [j.fn].concat(j.args))); }catch(e){ p = Promise.reject(e); } finally { window._ui = u1617; }   /* 1617: a queued read is not a tap */"],
  ["now >= new Date(c.start).getTime() - 6e4", "now >= new Date(c.start).getTime() - 20 * 6e4   /* 1617: from 20 min before */"],
  ["</body>\n</html>",
   "<script>\n/* 1617 · teacher Today not drawn twice for one quick double tap · tap-to-paint and long-frame sampler (teachers) */\n(function(){\n" +
   "  if(window.__1617) return; window.__1617 = 1;\n" +
   "  const isT = () => { try{ return typeof D !== 'undefined' && D && !D.mgr && !!D.me; }catch(e){ return false; } };\n" +
   "  const g0 = window.go; let lastV = '', lastT = 0;\n" +
   "  if(typeof g0 === 'function') window.go = function(v){\n" +
   "    try{ const el = document.getElementById('v-' + v), now = Date.now();\n" +
   "      if(isT() && v === lastV && typeof VIEW !== 'undefined' && VIEW === v && now - lastT < 1500 && el && el.childElementCount && !document.querySelector('#sheet.on')){ window.scrollTo(0, 0); return; }\n" +
   "      lastV = v; lastT = now; }catch(e){}\n" +
   "    return g0.apply(this, arguments); };\n" +
   "  if(!('PerformanceObserver' in window)) return;\n" +
   "  const vw = () => { try{ return String(typeof VIEW !== 'undefined' ? VIEW || '' : '').slice(0, 30); }catch(e){ return ''; } };\n" +
   "  const tg = t => { try{ if(!t || !t.tagName) return ''; const id = t.id ? '#' + t.id : '', c = !id && t.className && typeof t.className === 'string' ? '.' + t.className.trim().split(/\\s+/)[0] : ''; return t.tagName.toLowerCase() + id + c; }catch(e){ return ''; } };\n" +
   "  let I = null, L = null, n = 0, hr = 0;\n" +
   "  try{ new PerformanceObserver(l => { if(!isT()) return; for(const e of l.getEntries()){ if(!e.interactionId) continue; if(!I || e.duration > I.ms) I = { ms: e.duration, v: vw(), w: (e.name + ' ' + tg(e.target)).slice(0, 30) }; } }).observe({ type: 'event', durationThreshold: 40, buffered: false }); }catch(e){}\n" +
   "  let loaf = false; try{ loaf = (PerformanceObserver.supportedEntryTypes || []).indexOf('long-animation-frame') > -1; }catch(e){}\n" +
   "  try{ new PerformanceObserver(l => { if(!isT()) return; for(const e of l.getEntries()){ if(L && e.duration <= L.ms) continue; let w = '';\n" +
   "      if(loaf){ const s = (e.scripts || []).slice().sort((a, b) => b.duration - a.duration)[0]; w = s ? ((s.sourceFunctionName || s.invoker || 'script') + '@' + (s.sourceCharPosition >= 0 ? s.sourceCharPosition : '') + ' ' + String(s.invokerType || '')) : 'no script info · block ' + Math.round(e.blockingDuration || 0); }\n" +
   "      else { const a = (e.attribution || [])[0]; w = 'task ' + ((a && (a.containerType || a.name)) || e.name || ''); }\n" +
   "      L = { ms: e.duration, v: vw(), w: w.slice(0, 30) }; } }).observe({ type: loaf ? 'long-animation-frame' : 'longtask', buffered: false }); }catch(e){}\n" +
   "  setInterval(() => { try{ const h = Math.floor(Date.now() / 36e5); if(h !== hr){ hr = h; n = 0; }\n" +
   "    if(!isT() || typeof TOKEN === 'undefined' || !TOKEN){ I = L = null; return; }\n" +
   "    const rows = [], dev = (window.innerWidth || 0) < 900 ? 'phone' : 'laptop', at = new Date().toISOString(), v = typeof COE_V !== 'undefined' ? COE_V : 0;\n" +
   "    if(I && I.ms >= 100 && n < 40){ rows.push({ fn: 'inp:' + I.v, ms: Math.round(I.ms), ui: false, view: I.w, v, dev, at }); n++; }\n" +
   "    if(L && L.ms >= 150 && n < 40){ rows.push({ fn: 'lt:' + L.v, ms: Math.round(L.ms), ui: false, view: L.w, v, dev, at }); n++; }\n" +
   "    I = L = null; if(!rows.length) return;\n" +
   "    fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-notice', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'speed', rows }), keepalive: true }).catch(() => {}); }catch(e){} }, 60000);\n" +
   "})();\n</script>\n</body>\n</html>"],
]);
