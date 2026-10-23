// 729: (Misty) teachers' Activity log gets its own screen in the menu ("Activity log", after Pay) instead of a card on Pay.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("async function load(name, day){ ST = { name, day, rows: null }; paint();", "async function load(name, day, el){ ST = { name, day, rows: null, el: el || null }; paint();");
rep("if($('sheet').classList.contains('on') && $('sheetBody').querySelector('#alBox')) $('sheetBody').querySelector('#alBox').innerHTML = h; else openSheet('<div id=\"alBox\">' + h + '</div>'); }",
    "if(s.el){ s.el.innerHTML = '<div class=\"al-page\">' + h + '</div>'; return; } if($('sheet').classList.contains('on') && $('sheetBody').querySelector('#alBox')) $('sheetBody').querySelector('#alBox').innerHTML = h; else openSheet('<div id=\"alBox\">' + h + '</div>'); }");
rep("window.actLogDay = n => { if(!ST) return; const d = shift(ST.day, n); if(d > today()) return; load(ST.name, d); };",
    "window.actLogDay = n => { if(!ST) return; const d = shift(ST.day, n); if(d > today()) return; load(ST.name, d, ST.el); };\n  window.actLogPage = () => { const v = $('v-act'); if(v) load('', (ST && ST.el === v && ST.day) || today(), v); };");
rep("function payBtn(){ try{ if(typeof D === 'undefined' || !D || D.mgr) return;", "function payBtn(){ return; try{ if(typeof D === 'undefined' || !D || D.mgr) return;");
rep("setInterval(payBtn, 3000);", `/* 729 · its own screen */
  try{ ICON.act = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v2h6V3M9 10h6M9 14h6M9 18h3"/></svg>'; }catch(e){}
  (function w(){ try{ if(typeof D === 'undefined' || !D || typeof NAV_T === 'undefined' || !$('v-today')){ setTimeout(w, 800); return; }
    if(!$('v-act')){ const d0 = document.createElement('div'); d0.id = 'v-act'; d0.className = 'hide'; $('v-today').parentNode.appendChild(d0); }
    if(VIEWS.indexOf('act') < 0) VIEWS.push('act');
    if(!D.mgr && !NAV_T.some(x => x[0] === 'act')){ const i = NAV_T.findIndex(x => x[0] === 'pay'); NAV_T.splice(i < 0 ? NAV_T.length : i + 1, 0, ['act', 'Activity log', 'act']); buildNav(); }
    if(typeof VIEW !== 'undefined' && VIEW === 'act') actLogPage(); }catch(e){ setTimeout(w, 1500); } })();
  const _go2 = window.go; window.go = function(v){ const r = _go2.apply(this, arguments); try{ if(v === 'act') actLogPage(); }catch(e){} return r; };
  (function(){ const st2 = document.createElement('style'); st2.textContent = '.al-page{max-width:760px}.al-page h1{margin-bottom:2px}.al-page .al{background:#fff;border:1px solid #ECEAF1;border-radius:18px;padding:4px 18px;margin-top:4px}'; document.head.appendChild(st2); })();`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
