// 1484 · Teacher screens do not move after opening or refreshing (phone first; Misty's rule "screens must never move")
// Measured on the phone preview with the CPU slowed 6× (how a busy phone behaves), after a refresh with the saved copy:
// 1. Header: the name block showed until the teacher marker (body.role-t, set by 950 after the menu was rebuilt) arrived 3–15 s
//    later; meanwhile the "I'm in" chip squeezed the name onto 3 lines and the header grew 64 → 98 px, then shrank (CLS ≈ 0.15
//    on every screen). Now the marker is set as soon as the saved data says this is a teacher.
// 2. Today was drawn in its raw order (greeting, boxes, class list) and the 1104 arrangement (Now & next, Needs your action)
//    waited on a 30 ms debounce that was restarted by every change; while boxes kept arriving it never ran (25 s on a slow
//    phone), then everything jumped (CLS 0.15–0.53). The Today arrangers 1104 / 1105 / 1106 now run in the same step as the
//    change, before the screen paints (with a loop guard), so the raw order is never shown.
// 3. On a refresh the app drew Today from the saved copy while the rest of the page (≈450 scripts that finish each screen)
//    was still loading, so later scripts rearranged it in front of the teacher. For a teacher's warm open, the steady
//    loading card (1320, used on a first open) now covers the screen until the page has finished loading and Today stops
//    changing (≥ 350 ms quiet, at most 2.2 s after that; never more than 12 s), and Today is drawn once more with every
//    finishing pass in place (Pay's two-column arrangement 1110 also runs before the paint). Management opens are unchanged. Under the card the screen is transparent rather than hidden,
//    so the text the finishing passes read (row titles) is there (with visibility:hidden it read as empty).
// 4. Notice of breach banner, the management-comments warning and Punctuality (late time-ins: Today's line and the Pay
//    section, which pushed Pay down 400 px ~5 s after a refresh) were fetched after every refresh and pushed Now & next down
//    (S6). Both are now drawn from the last copy on this device at once and updated in place.
// Display only; the same data, the same order, the same buttons.
const fs = require('fs'), file = process.argv[2];
const MT = fn => "var t = 0, n1484 = 0, f1484 = 0, later = function(){ if(t) return; var now = Date.now(); if(now - f1484 > 250){ f1484 = now; n1484 = 0; } if(++n1484 > 12){ t = setTimeout(function(){ t = 0; " + fn + "; }, 40); return; } t = 1; Promise.resolve().then(function(){ t = 0; " + fn + "; }); };";
require('../tools/lib.js')(file, [
  ["var t = 0, later = function(){ clearTimeout(t); t = setTimeout(arrange, 30); };", MT('arrange()')],
  ["var t = 0, later = function(){ clearTimeout(t); t = setTimeout(paint, 40); };", MT('paint()')],
  ["var t = 0, later = function(){ clearTimeout(t); t = setTimeout(function(){ build(false); }, 80); };", MT('build(false)')],
  ["function ready(){ try{ return typeof D !== 'undefined' && !!D && typeof VIEW !== 'undefined' && !!VIEW; }catch(e){ return false; } }",
   "function ready(){ try{ return typeof D !== 'undefined' && !!D && typeof VIEW !== 'undefined' && !!VIEW && document.readyState !== 'loading'; }catch(e){ return false; } }"],
  ["Promise.race([BIG_READY, new Promise(r => setTimeout(r, 1500))]).then(boot);",
   "Promise.race([BIG_READY, new Promise(r => setTimeout(r, 1500))]).then(() => { try{ const c = TOKEN && document.readyState === 'loading' && store('get', KEY_D); if(c && !/\"mgr\":true/.test(c) && window.__curtain1320) window.__curtain1320(); }catch(e){} boot(); });"],
  ["html.cur1320 #app{visibility:hidden!important}", "html.cur1320 #app{opacity:0!important;pointer-events:none!important}"],
  ["async function loadLates(){ try{ const r = await call('lates'); if(r && r.ok){ LT = r; LTT = Date.now(); paintLates(); } }catch(x){} }",
   "async function loadLates(){ try{ const r = await call('lates'); if(r && r.ok){ LT = r; LTT = Date.now(); try{ if(window.ft1484) ft1484.put('lt', JSON.stringify(r)); }catch(y){} paintLates(); } }catch(x){} }"],
  ["function ltPut(id, full){ const v = $(id); if(!v) return; const h = ltHtml(full)",
   "function ltPut(id, full){ const v = $(id); if(!v) return; if(!LT && window.ft1484){ try{ const c = ft1484.take('lt'); if(c) LT = JSON.parse(c); }catch(y){} } const h = ltHtml(full)"],
  ["      loadLates(); setInterval(() => { if(document.visibilityState === 'visible') loadLates(); }, 300e3); };\n    setTimeout(w, 5000); })();",
   "      paintLates(); setTimeout(loadLates, 5000); setInterval(() => { if(document.visibilityState === 'visible') loadLates(); }, 300e3); };\n    setTimeout(w, 0); })();"],
  ["const w = () => { if(typeof D === 'undefined' || !D || !TOKEN){ setTimeout(w, 1500); return; } if(D.mgr) return; let q = 0;",
   "const w = () => { if(typeof D === 'undefined' || !D || !TOKEN){ setTimeout(w, 100); return; } if(D.mgr) return; let q = 0;"],
  ["function paintLates(){ if(typeof D === 'undefined' || !D || D.mgr) return; try{ ltPut('v-pay', true); }catch(x){} try{ ltPut('v-today', false); }catch(x){} }",
   "function paintLates(){ if(typeof D === 'undefined' || !D || D.mgr) return; try{ ltPut('v-pay', true); }catch(x){} try{ ltPut('v-today', false); }catch(x){} } window.paintLates1484 = paintLates;"],
  ["new MutationObserver(function(){ if(!busy) setTimeout(arrange, 0); }).observe(v, { childList: true }); arrange(); }",
   "new MutationObserver(function(){ if(!busy) Promise.resolve().then(arrange); }).observe(v, { childList: true }); arrange(); }"],
  ["const openN = () => (NT || []).filter(n => !n.decided_at && !n.explain_at);",
   "const NTK1484 = 'coe.nt1484', ntWho1484 = () => { try{ return String((D && D.me && D.me.name) || '').toLowerCase(); }catch(x){ return ''; } };\n  const ntSaved1484 = () => { try{ const c = JSON.parse(localStorage.getItem(NTK1484) || 'null'); return c && c.who && c.who === ntWho1484() && Array.isArray(c.list) ? c.list : null; }catch(x){ return null; } };\n  const openN = () => (NT || ntSaved1484() || []).filter(n => !n.decided_at && !n.explain_at);"],
  ["try{ NT = (await call('list')).notices; NTT = Date.now(); }catch(x){}",
   "try{ NT = (await call('list')).notices; NTT = Date.now(); try{ if(Array.isArray(NT) && ntWho1484()) localStorage.setItem(NTK1484, JSON.stringify({ who: ntWho1484(), list: NT.filter(n => !n.decided_at && !n.explain_at).slice(0, 5) })); }catch(y){} }catch(x){}"],
  ["if(!(MYV && typeof TMSG !== 'undefined' && TMSG && TMSG.threads)){ if(window._FTLAST){",
   "if(!(MYV && typeof TMSG !== 'undefined' && TMSG && TMSG.threads)){ if(window._FTLAST === undefined && window.ft1484) window._FTLAST = ft1484.get(); if(window._FTLAST){"],
  ["if(R.level < 2){ window._FTLAST = ''; return; }", "if(R.level < 2){ window._FTLAST = ''; if(window.ft1484) ft1484.set(''); return; }"],
  ["window._FTLAST = box; const lead", "window._FTLAST = box; if(window.ft1484) ft1484.set(box); const lead"]
]);
let s = fs.readFileSync(file, 'utf8');
const A = 'const msgAt = s => {'; if (s.split(A).length !== 2) { console.error('msgAt anchor not found once'); process.exit(1); }
s = s.replace(A, () => String.raw`/* 1484 · teacher marker as soon as the saved data is known (header never grows and shrinks); warning box copy per teacher */
(function(){ try{ var st = document.createElement('style'); st.id = 's1484'; st.textContent = '@media(max-width:520px){body.role-t .hd .who{display:none!important}}'; (document.head || document.documentElement).appendChild(st); }catch(e){} var k = 0; function f(){ try{ if(typeof D !== 'undefined' && D && document.body){ document.body.classList.toggle('role-t', !D.mgr); return; } }catch(e){} if(++k < 1800) requestAnimationFrame(f); } if(window.requestAnimationFrame) requestAnimationFrame(f); })();
['renderPay', 'renderToday'].forEach(function(n){ var f = window[n]; if(typeof f !== 'function') return; window[n] = function(){ var r = f.apply(this, arguments); try{ if(window.paintLates1484) paintLates1484(); }catch(e){} return r; }; });   /* Punctuality drawn with the screen, not after it */
document.addEventListener('DOMContentLoaded', function(){ try{ if(typeof D !== 'undefined' && D && !D.mgr && typeof VIEW !== 'undefined' && VIEW === 'today' && typeof renderToday === 'function') renderToday(); }catch(e){} });
window.ft1484 = { key: function(){ try{ return 'coe.ft1484.' + String((D && D.me && D.me.name) || '').toLowerCase(); }catch(e){ return ''; } },
  get: function(){ try{ var k = this.key(); if(!k || /\.$/.test(k)) return undefined; var v = localStorage.getItem(k); return v == null ? undefined : v; }catch(e){ return undefined; } },
  set: function(h){ try{ var k = this.key(); if(k && !/\.$/.test(k)) localStorage.setItem(k, String(h || '')); }catch(e){} },
  put: function(n, v){ try{ var k = this.key(); if(k && !/\.$/.test(k)) localStorage.setItem(k + '.' + n, String(v || '')); }catch(e){} },
  take: function(n){ try{ var k = this.key(); if(!k || /\.$/.test(k)) return null; return localStorage.getItem(k + '.' + n); }catch(e){ return null; } } };
` + '\n' + A);
fs.writeFileSync(file, s);
