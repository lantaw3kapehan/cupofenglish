// 22 Oct · Misty: My Contract gets its own screen in the teacher menu (heading "Contract"), instead of a row on Pay.
// Reading a document still opens over it; "‹ My Contract" goes back to the screen.
require('../tools/lib.js')(process.argv[2], [
[`window.ctMy = async function(){ openSheet(`, `window.ctMy = async function(){ if(!isMgmt() && $('v-contract')){ try{ if($('sheet').classList.contains('on')) closeSheet(); }catch(x){} go('contract'); return; } openSheet(`],
[`function paintMy(){ const b = $('sheetBody');`, `function paintMy(){ const b = (typeof VIEW !== 'undefined' && VIEW === 'contract' && $('v-contract') && !$('sheet').classList.contains('on')) ? $('v-contract') : $('sheetBody');`],
[`function paintPayLink(){ if(isMgmt()) return;`, `function paintPayLink(){ return;`],
[`if(v === 'today') paintBanner(); if(v === 'pay') paintPayLink(); }catch(x){} return r; };`,
 `if(v === 'today') paintBanner(); if(v === 'contract'){ const c = $('v-contract'); if(c){ if(MY) paintMy(); else c.innerHTML = '<div class="ct"><h1>My Contract</h1><div class="sub">Loading your contract…</div><div class="sk"></div><div class="sk"></div></div>'; loadMy(!MY || Date.now() - MYT > 60e3).then(() => { if(VIEW === 'contract') paintMy(); }); } } }catch(x){} return r; };
  try{ ICON.contract = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M7 3h7l5 5v5"/><path d="M14 3v5h5"/><path d="M6 4v16a1 1 0 0 0 1 1h6"/><path d="M9 12h6M9 16h3"/><path d="m15.5 20.5 4.8-4.8a1.4 1.4 0 0 0-2-2l-4.8 4.8-.5 2.5z"/></svg>';
    if(!NAV_T.some(x => x[0] === 'contract')) NAV_T.push(['contract', 'My Contract', 'contract', 0, 'Contract']); if(VIEWS.indexOf('contract') < 0) VIEWS.push('contract');
    if(!$('v-contract') && $('v-today')){ const d0 = document.createElement('div'); d0.id = 'v-contract'; d0.className = 'hide'; $('v-today').parentNode.appendChild(d0); }
    if(D && !D.mgr) buildNav(); else setTimeout(function w(){ if(D){ if(!D.mgr) buildNav(); } else setTimeout(w, 1000); }, 1000); }catch(x){}`],
]);
