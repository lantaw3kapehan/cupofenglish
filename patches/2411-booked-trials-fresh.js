// 2411 (Misty 19 Nov 12:55, Celine's Trials still showed Elowen and Monica under "Booked trial classes · Today 20:00" the next day)
//   · the box was only redrawn when the whole Trials screen was; a screen left open overnight kept yesterday's box. It now checks
//   itself every 30 s (and when the window comes back), dropping trials whose report is in and fixing "Today" / "Report not in yet".
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  try{ if(typeof VIEW !== 'undefined' && VIEW === 'trials') renderTP(); }catch(e){}\n})();\n</script>\n<script>\n/* 16 Oct · Misty: Jennie's parent",
   "  try{ if(typeof VIEW !== 'undefined' && VIEW === 'trials') renderTP(); }catch(e){}\n" +
   "  const fresh2411 = () => { try{ if(typeof VIEW === 'undefined' || VIEW !== 'trials') return; load(); const old = $('tpBk'), h = html(); if(old && h && old.outerHTML === h) return; if(!old && !h) return; if(old) old.remove(); const tabs = $('tpTabs'); if(tabs && h) tabs.insertAdjacentHTML('beforebegin', h); }catch(e){} };\n" +
   "  setInterval(fresh2411, 30000); document.addEventListener('visibilitychange', () => { if(!document.hidden) setTimeout(fresh2411, 500); });\n" +
   "})();\n</script>\n<script>\n/* 16 Oct · Misty: Jennie's parent"]
]);
