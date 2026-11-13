// 2155 (13 Nov · Misty 11:42 "the briefing screen still shows something then goes back to normal"): measured in the app:
// opening Briefing painted at once from the numbers left over in memory (no payroll yet: "On track · ₱94,000 left over",
// payroll ₱58,500), then 0.8 s later the real ones ("Okay, watch renewals · ₱27,500", payroll ₱125,000), then renewals, then wallets.
// Now: on opening, "One moment, I am gathering the numbers…" shows until EVERYTHING is in (the Briefing's own data + the Forecast
// engine's payroll / expenses / wallets), then the briefing is drawn once. A live refresh (a payment in) keeps the briefing on screen
// and redraws once when the new numbers are complete. Safety: after 10 s it draws whatever it has.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["  var LASTH = '';",
   "  var LASTH = '', W5 = { loaded: 0, enter: 0, t0: 0 };   /* 2155 */"],
  ["    var o = compose();\n    h += !o ?",
   "    var o = compose();\n    var busy5 = false; try{ busy5 = !!(window.fc980 && fc980.st && fc980.st().busy); }catch(e){}\n    if(!((W5.loaded && !busy5) || (W5.t0 && Date.now() - W5.t0 > 10000))){ if(W5.enter) o = null; else return; } else W5.enter = 0;   /* 2155: draw once, when complete */\n    h += !o ?"],
  ["  function startLoads(){ try{ if(window.fc980 && fc980.load) fc980.load(); }catch(e){}",
   "  function startLoads(){ W5.loaded = 0; W5.t0 = Date.now(); setTimeout(paint, 10200); try{ if(window.fc980 && fc980.load) fc980.load(); }catch(e){}"],
  ["    loadAll().then(paint);",
   "    loadAll().then(function(){ W5.loaded = 1; paint(); });"],
  ["localStorage.setItem('coe.fbz.seen', String(Date.now())); }catch(e){} paint(); startLoads(); }",
   "localStorage.setItem('coe.fbz.seen', String(Date.now())); }catch(e){} W5.enter = 1; LASTH = ''; startLoads(); paint(); }"],
  ["  try{ if(typeof VIEW !== 'undefined' && VIEW === 'finbrief'){ paint(); startLoads(); } }catch(e){}",
   "  try{ if(typeof VIEW !== 'undefined' && VIEW === 'finbrief'){ W5.enter = 1; startLoads(); paint(); } }catch(e){}"],
]);
