// 2405 (Misty 19 Nov 11:46: the list "adjusts slowly and these changes appear") · the steps are kept on this device and drawn the moment
//   the list is drawn (no wait for the server, no 1.5 s timer), then refreshed quietly in the background; only changed lines repaint.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  const F = {}, M = {}; let AG = false, busy = null, at = 0;",
   "  const F = {}, M = {}; let AG = false, busy = null, at = 0;\n" +
   "  try{ const c = JSON.parse(localStorage.getItem('coe.st01') || 'null'); if(c && Date.now() - c.t < 3 * 864e5){ Object.assign(F, c.F || {}); Object.assign(M, c.M || {}); } }catch(e){}\n" +
   "  const keep = () => { try{ localStorage.setItem('coe.st01', JSON.stringify({ t: Date.now(), F, M })); }catch(e){} };"],
  ["at = Date.now(); R.forEach(migrate); }",
   "at = Date.now(); R.forEach(migrate); keep(); }"],
  ["  window.tlPaint2401 = paintList;",
   "  window.tlPaint2401 = paintList;\n" +
   "  try{ const v0 = document.getElementById('v-trials'); if(v0) new MutationObserver(() => { try{ if(v0.querySelector('.rp-row[onclick^=\"tlOpen(\"]:not(:has(.st01l))')) paintList(); }catch(e){} }).observe(v0, { childList: true, subtree: true }); }catch(e){}"]
]);
