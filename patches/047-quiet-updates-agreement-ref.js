// Three changes in one update (one reload instead of three):
// 1) Teachers: during class hours (16:00–22:00) an open app does not reload for a new version; it updates when opened or after 22:00.
// 2) Student profile › DATABASE facts: cells with a sheet error (#REF!, #N/A, …) are not shown.
// 3) "Agreement" button on each enquiry (Enquiries) and on the trial report, for parents who ask before enrolling.
require('../tools/lib.js')(process.argv[2], [
["function applyUpdate(){ if(newerSaved()){ if(busy()) window._upd = 1; else location.reload(); } }",
"function applyUpdate(){ if(newerSaved()){ if(busy() || updQuiet()) window._upd = 1; else location.reload(); } }\nfunction updQuiet(){ try{ if(typeof D === 'undefined' || !D || D.mgr || performance.now() < 15000) return false; const h = new Date().getHours(); return h >= 16 && h < 22; }catch(e){ return false; } }"],
["if(!v || v==='FALSE' || j===0) return; if(v==='TRUE') v = '✓';",
"if(!v || v==='FALSE' || j===0 || /^#(REF!|N\\/A|VALUE!|DIV\\/0!|NAME\\?|NUM!|ERROR!|NULL!)$/.test(v)) return; if(v==='TRUE') v = '✓';"],
["onclick=\"enqPic(\\'' + e.id + '\\',\\'c\\')\">CEFR</button>",
"onclick=\"enqPic(\\'' + e.id + '\\',\\'c\\')\">CEFR</button><button class=\"btn ghost sm\" onclick=\"enqAgr(\\'' + e.id + '\\')\">Agreement</button>"],
["window.enqF = function(f){ ENQ_F = f; renderEnq(); };",
"window.enqF = function(f){ ENQ_F = f; renderEnq(); };\nwindow.enqAgr = function(id){ const e = (ENQ || []).find(x => x && String(x.id) === String(id)); if(!e) return; agrOpen({ key: 'enq:' + e.id, name: String(e.name || '').trim(), cn: String(e.cn || '').trim() }); };"],
["if(el && TLD && !$('cpB')) el.insertAdjacentHTML('beforeend', '<button class=\"btn ghost grow\" id=\"cpB\"",
"if(el && TLD && !$('agB')) el.insertAdjacentHTML('beforeend', '<button class=\"btn ghost grow\" id=\"agB\" onclick=\"agrOpen({ code: /^ST-/.test(TLD.code || \\'\\') ? TLD.code : \\'\\', key: \\'trial:\\' + (TLD.label || TLD.student), name: TLD.student, cn: TLD.cn || \\'\\' })\">Agreement</button>');\nif(el && TLD && !$('cpB')) el.insertAdjacentHTML('beforeend', '<button class=\"btn ghost grow\" id=\"cpB\""]
]);
