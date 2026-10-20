// 20 Oct · The update could not be saved on browsers whose storage was full (the app is ~2.5 M characters), so they stayed on an old version.
require('../tools/lib.js')(process.argv[2], [[
"const m = h.match(/const COE_V = (\\d+);/); if(m && +m[1] > COE_V){ try{ localStorage.setItem('coe.app', h); }catch(e){} applyUpdate(); } }).catch(()=>{}); }",
"const m = h.match(/const COE_V = (\\d+);/); if(m && +m[1] > COE_V){ let ok = false; try{ localStorage.setItem('coe.app', h); ok = true; }catch(e){}\n" +
"  /* 20 Oct · 478 · storage full: drop the old copy and try again; if it still does not fit, keep no copy, so reopening loads the newest from the internet (index.html does the same) */\n" +
"  if(!ok){ try{ localStorage.removeItem('coe.app'); localStorage.setItem('coe.app', h); ok = true; }catch(e){ try{ localStorage.removeItem('coe.app'); }catch(x){} } }\n" +
"  if(ok) applyUpdate(); else { if(busy() || updQuiet()) window._upd = 1; else location.reload(); } } }).catch(()=>{}); }"
]]);
