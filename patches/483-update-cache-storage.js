// 20 Oct · In-app update on Safari / iPhone: the new version goes to Cache Storage when it does not fit in the small storage (index.html reads it).
require('../tools/lib.js')(process.argv[2], [["  if(ok) applyUpdate(); else { window._updNet = 1; applyUpdate(); } } }).catch(()=>{}); }",
"  if(ok) applyUpdate(); else { const go = () => { window._updNet = 1; applyUpdate(); }; try{ caches.open('coe-4').then(c => c.put('app-copy.html', new Response(h, { headers: { 'Content-Type': 'text/html;charset=utf-8' } }))).then(go, go); }catch(e){ go(); } } } }).catch(()=>{}); }"]]);
