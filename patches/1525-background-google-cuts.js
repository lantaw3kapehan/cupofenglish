// 1525 · fewer background Google reads, and a record of why each Google read happened (Misty's App health, 28 Oct 21:12:
//   tStudent 10.4 s ×189, tGrowth 23.3 s ×39, tFbStatus 12.4 s ×28, mgmtStudent 7.6 s ×36, schedLists 6.2 s ×41).
//   coe_speed shows nobody waited for most of these: they are background refreshes behind a saved copy.
//   · Today's "class brief" prefetch (up to 15 students every 30 min) reads the database copy only — never Google.
//     Opening a student still reads it the normal way (database first, Google behind when needed).
//   · Growth asks Google behind the screen only when Google's part (peer reviews, visits, monthly record) is over 3 h old,
//     or over 30 min while Growth is open (was: over 30 min, at most every 10 min, wherever the teacher was).
//   · schedLists (management's schedule lists) refresh behind at most hourly (was 15 min).
//   · Each Google read of a watched screen is recorded in coe_speed as "g:<call>:<why>" (nocopy / notlive / old / aftersave /
//     direct) with ui = someone waited, so App health can say what people waited for and what ran behind.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["if(Date.now() - at > 30 * 6e4 && Date.now() - last > 10 * 6e4)",
   "if(Date.now() - at > ((typeof VIEW !== 'undefined' && VIEW === 'growth') ? 30 : 180) * 6e4 && Date.now() - last > 30 * 6e4)"],
  ["</script>\n<script>\n/* 1374 · progress reports",
   "</script>\n<script>\n/* 1525 · background Google cuts + why each Google read happened */\n(function(){\n" +
   "  if(window.__1525) return; window.__1525 = 1;\n" +
   "  try{ if(typeof SB_BGAGE !== 'undefined') SB_BGAGE.schedLists = 60 * 6e4; }catch(e){}\n" +
   "  /* the class-brief prefetch: database copy only */\n" +
   "  if(typeof window.briefPrefetch === 'function') window.briefPrefetch = briefPrefetch = async function(){\n" +
   "    if(!TOKEN || !D || D.mgr || window._bpf || typeof sbOn !== 'function' || !sbOn()) return; window._bpf = 1;\n" +
   "    try{ const codes = [...new Set((D.schedule || []).filter(x => x.day >= D.today && x.code && !x.cancelled).sort((a, b) => String(a.start).localeCompare(String(b.start))).map(x => x.code))].slice(0, 15);\n" +
   "      for(const code of codes){ while(document.hidden) await new Promise(r => setTimeout(r, 5000));\n" +
   "        let c = null; try{ c = JSON.parse(store('get', 'coe.stu.' + code) || 'null'); }catch(e){}\n" +
   "        if(c && c._at && Date.now() - c._at < 6 * 3600e3){ if(typeof STU_CACHE !== 'undefined' && !STU_CACHE[code]) STU_CACHE[code] = c; continue; }\n" +
   "        try{ const d = await Promise.race([sbDoc(sbKey('tStudent', [TOKEN, code])), new Promise(z => setTimeout(() => z(null), 8000))]);\n" +
   "          const r = d && d.data; if(r && r.ok !== false && !r.error){ r._at = Date.now(); try{ store('set', 'coe.stu.' + code, JSON.stringify(r)); }catch(e){} if(typeof STU_CACHE !== 'undefined') STU_CACHE[code] = r; } }catch(e){}\n" +
   "        await new Promise(r => setTimeout(r, 700)); }\n" +
   "    }catch(e){} finally{ window._bpf = 0; } };\n" +
   "  /* why a Google read happened (watched screens only) */\n" +
   "  const WATCH = /^(tStudent|tGrowth|tFbStatus|mgmtStudent|schedLists|tPayCheck|tPayReady|tMsgs|getBootstrap|mgmtStuClasses|tStuClasses|mgmtActive|tMyVisits|tPeerForm)$/, LAST = {}, Q = [];\n" +
   "  if(typeof window.sbDocV === 'function'){ const sv = window.sbDocV; window.sbDocV = sbDocV = function(key){ const p = sv.apply(this, arguments);\n" +
   "    try{ Promise.resolve(p).then(d => { LAST[key] = { t: Date.now(), d: d ? { at: d.at, live: !!d.live } : null }; }, () => { LAST[key] = { t: Date.now(), d: null }; }); }catch(e){} return p; }; }\n" +
   "  if(typeof window.apiNow === 'function'){ const an = window.apiNow; window.apiNow = apiNow = function(fn){ const p = an.apply(this, arguments);\n" +
   "    try{ if(WATCH.test(fn) && typeof sbKey === 'function' && typeof D !== 'undefined' && D){ const args = Array.prototype.slice.call(arguments, 1), key = sbKey(fn, args), L = LAST[key], now = Date.now(), ui = now - (window._ui || 0) < 1500;\n" +
   "      let why = 'direct'; if(L && now - L.t < 15000){ const d = L.d; why = !d ? 'nocopy' : (typeof SB_LASTW !== 'undefined' && SB_LASTW && now - SB_LASTW < 120000 && Date.parse(d.at) < SB_LASTW) ? 'aftersave' : !d.live ? 'notlive' : 'old' + Math.min(99, Math.round((now - Date.parse(d.at)) / 36e5)) + 'h'; }\n" +
   "      const t0 = performance.now(); Promise.resolve(p).then(() => push(), () => push()); function push(){ if(Q.length < 200) Q.push({ fn: ('g:' + fn + ':' + why).slice(0, 40), ms: Math.round(performance.now() - t0), ui: ui, view: typeof VIEW !== 'undefined' ? String(VIEW || '') : '', v: typeof COE_V !== 'undefined' ? COE_V : 0, dev: (window.innerWidth || 0) < 900 ? 'phone' : 'laptop', at: new Date().toISOString() }); } } }catch(e){}\n" +
   "    return p; }; }\n" +
   "  function flush(leaving){ try{ if(!Q.length || typeof TOKEN === 'undefined' || !TOKEN || typeof LIVE === 'undefined' || !LIVE) return; const rows = Q.splice(0, 200);\n" +
   "    fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-notice', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, action: 'speed', rows: rows }), keepalive: !!leaving }).catch(() => {}); }catch(e){} }\n" +
   "  setInterval(flush, 60000); document.addEventListener('visibilitychange', () => { if(document.hidden) flush(true); });\n" +
   "})();\n" +
   "</script>\n<script>\n/* 1374 · progress reports"],
]);
