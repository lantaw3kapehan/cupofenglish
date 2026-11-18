// 2390 (Misty 18 Nov 21:47: Kat's late time-in was waived but still showed under Lates to decide) · the waive was saved (21:39) and the
//   database no longer lists it, but the Overview box only re-read the lates on some events, so a decision made on another screen or
//   device stayed on this one. Now, on Overview, the lates are read again every minute and when the window comes back into view.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<script id=\"b2278\">",
   "<script id=\"b2390\">\n(function(){\n  if(window.__2390) return; window.__2390 = 1; let busy = false;\n" +
   "  async function sync(){ try{ if(busy || document.hidden || typeof VIEW === 'undefined' || VIEW !== 'home' || typeof D === 'undefined' || !D || !D.mgr || typeof MO === 'undefined' || !MO || typeof TOKEN === 'undefined' || !TOKEN) return; busy = true;\n" +
   "    const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'overview', token: TOKEN }) }).then(x => x.json());\n" +
   "    if(r && r.ok && r.data && Array.isArray(r.data.late)){ const a = JSON.stringify(MO.late || []), L = r.data.late; if(JSON.stringify(L) !== a){ MO.late = L; try{ store('set', 'coe.mo', JSON.stringify(MO)); }catch(e){} try{ renderTeam(); }catch(e){} } }\n" +
   "  }catch(e){} finally{ busy = false; } }\n" +
   "  setInterval(sync, 60000); document.addEventListener('visibilitychange', () => { if(!document.hidden) setTimeout(sync, 800); });\n" +
   "})();\n</script>\n<script id=\"b2278\">"]
]);
