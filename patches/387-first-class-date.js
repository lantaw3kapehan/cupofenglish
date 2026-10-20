// 20 Oct · Set class schedule from the trial starts from tomorrow (not next Monday: Elsa's Sat 24 Oct was skipped);
// the trial's Chinese name wins too (Eric's "Sun Yuchen" was on Elsa's parent picture). Date label says "Starting from".
require('../tools/lib.js')(process.argv[2], [
  ["d.setDate(d.getDate() + ((8 - d.getDay()) % 7 || 7)); const dd = $('cD'); if(dd) dd.value = ymdLocal(d);   /* next Monday */",
   "d.setDate(d.getDate() + 1); const dd = $('cD'); if(dd) dd.value = ymdLocal(d);   /* 387: from tomorrow · the first chosen day after it is the first class */"],
  ["cn: cxCnOf(s.code) || f.cn || ''", "cn: (window.NAMEFIX && NAMEFIX[String(s.code).toUpperCase()]) ? (NAMEFIX['cn:' + String(s.code).toUpperCase()] || f.cn || '') : (cxCnOf(s.code) || f.cn || '')"],
  ["    if(code && nm) NAMEFIX[code] = nm;", "    if(code && nm){ NAMEFIX[code] = nm; NAMEFIX['cn:' + code] = String(x.cn || '').trim(); }"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n/* 387 · with Weekly package on, Date reads \"Starting from\" */\n(function(){ const bp = window.classPrev; window.classPrev = function(){ const r = bp.apply(this, arguments); try{ const d = $('cD'), l = d && d.closest('.grow') && d.closest('.grow').querySelector('label'); if(l){ const on = $('cR') && $('cR').checked; const t = on ? 'Starting from' : 'Date'; if(l.textContent !== t) l.textContent = t; } }catch(e){} return r; }; })();\n</script>\n\n</body>"]]);
