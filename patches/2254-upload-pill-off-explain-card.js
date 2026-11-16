// 2254 (Misty 16 Nov 10:39, teacher view): "Preparing the upload…" sat on top of the green "Upload with this explanation" button
// in the "Please explain this upload" card (screen proof / short video). The upload pills are hidden while that card is open and come
// back when it closes. Closing the card any other way (×, Back, Esc) now counts as Cancel, so the upload is not left stuck as busy.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["  window.vidPre = (c, f) => new Promise(async res => {",
  "  if(!window.__vc2254){ window.__vc2254 = 1; try{ const st = document.createElement('style'); st.textContent = 'body.vcAsk #svPills{visibility:hidden}'; document.head.appendChild(st); }catch(e){}\n" +
  "    const _c2254 = window.closeSheet; if(_c2254) window.closeSheet = function(){ const p = window._vcPend; const r = _c2254.apply(this, arguments); if(p){ const sh = document.getElementById('sheet'), b = document.getElementById('sheetBody'); if(!(sh && sh.classList.contains('on') && b && /_vcRes\\(1\\)/.test(b.innerHTML))) p(); } return r; }; }   /* 2254 */\n" +
  "  window.vidPre = (c, f) => new Promise(async res => {"],
 ["    if(!fl.length) return res({ dur });\n",
  "    if(!fl.length) return res({ dur });\n" +
  "    const fin = v => { window._vcPend = null; document.body.classList.remove('vcAsk'); res(v); };   /* 2254 */\n" +
  "    window._vcPend = () => fin(null); document.body.classList.add('vcAsk');\n"],
 ["window._vcRes = ok => { if(!ok){ closeSheet(); res(null); return; } const x = readForm(); if(!x) return; closeSheet(); res({ dur, why: x.why, note: x.note }); };",
  "window._vcRes = ok => { if(!ok){ window._vcPend = null; closeSheet(); fin(null); return; } const x = readForm(); if(!x) return; window._vcPend = null; closeSheet(); fin({ dur, why: x.why, note: x.note }); };"]
]);
