// 20 Oct · 478 follow-up: a waiting update with no saved copy still reloads once the person is not in the middle of something.
require('../tools/lib.js')(process.argv[2], [
["function applyUpdate(){ if(newerSaved()){", "function applyUpdate(){ if(newerSaved() || window._updNet){"],
["  if(ok) applyUpdate(); else { if(busy() || updQuiet()) window._upd = 1; else location.reload(); } } }).catch(()=>{}); }",
 "  if(ok) applyUpdate(); else { window._updNet = 1; applyUpdate(); } } }).catch(()=>{}); }"]
]);
