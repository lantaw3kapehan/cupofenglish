// 22 Oct · flicker (continued): the action-bar icons and moving Print into "Manage" ran 90–120 ms after drawing,
// so the bar changed height (252 → 208 px) and everything below jumped. Now in the same frame.
require('../tools/lib.js')(process.argv[2], [
["  try{ const sb = $('sheetBody'); let t = 0; if(sb) new MutationObserver(() => { clearTimeout(t); t = setTimeout(paint, 90); }).observe(sb, { childList: true, subtree: true }); }catch(e){}\n  const r0 = window.stuRender; window.stuRender = function(){ const r = r0.apply(this, arguments); setTimeout(paint, 120); return r; };",
 "  try{ const sb = $('sheetBody'); let t = 0, n = 0, at = 0; if(sb) new MutationObserver(() => { const now = Date.now(); if(now - at > 300){ at = now; n = 0; } if(++n < 12){ try{ paint(); }catch(e){} } else { clearTimeout(t); t = setTimeout(paint, 90); } }).observe(sb, { childList: true, subtree: true }); }catch(e){}   /* 581: same frame */\n  const r0 = window.stuRender; window.stuRender = function(){ const r = r0.apply(this, arguments); try{ paint(); }catch(e){} setTimeout(paint, 120); return r; };"],
]);
