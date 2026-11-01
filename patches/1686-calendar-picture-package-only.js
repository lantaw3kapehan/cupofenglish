// 1686: (Misty, 1 Nov 10:47, Yoyo's calendar picture showed "98 classes × 25 min booked · 49 units") "It should show the accurate
//   one, 33, even if we have adjusted it, otherwise parents would believe that's what they booked."
//   The parent picture now shows only the classes the package pays for: from the next class on, classes are counted in order
//   (25 min = 0.5 unit) until the student's lessons left (e.g. 30 + 3 = 33) are used; later classes booked beyond the package
//   are left out of the picture (they stay in the app's calendar, marked as over). Past and cancelled classes show as before.
//   Shared packages, or a student whose lessons left are not known, show every class as before.
//   The first month shown also moves to the month of the next class when the chosen month has no classes at all.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const st = window._cal28S ? _cal28S() : { L: [], off: 0 }, L = (st.L || []).filter(e => e && e.start && !isNaN(new Date(e.start))), s = (typeof STU",
   "const st = window._cal28S ? _cal28S() : { L: [], off: 0 }, L = cover1686((st.L || []).filter(e => e && e.start && !isNaN(new Date(e.start)))), s = (typeof STU"],
  ["const now = Date.now(), t0 = new Date(), A = new Date(t0.getFullYear(), t0.getMonth() + (st.off || 0), 1)",
   "const now = Date.now(), t0 = new Date(), A = (() => { let a = new Date(t0.getFullYear(), t0.getMonth() + (st.off || 0), 1); const b = new Date(a.getFullYear(), a.getMonth() + 1, 1), nx0 = L.filter(e => !e.cancelled && new Date(e.end || e.start) >= Date.now()).sort((x, y) => new Date(x.start) - new Date(y.start))[0];\n" +
   "        if(nx0 && !L.some(e => { const d = new Date(e.start); return d >= a && d < b; })){ const d = new Date(nx0.start); if(d >= b) a = new Date(d.getFullYear(), d.getMonth(), 1); } return a; })()"],
  ["  window.swMine1676 = ",
   "  /* 1686 · the parent calendar picture shows only the classes the lessons left pay for */\n" +
   "  window.cover1686 = L => { try{ const s = (typeof STU !== 'undefined' && STU && STU.s) || {}, lv = s.left, left = lv === '' || lv == null ? NaN : +lv; if(!(left >= 0) || s.shared) return L;\n" +
   "      const now = Date.now(), fut = L.filter(e => !e.cancelled && new Date(e.end || e.start) >= now).sort((a, b) => new Date(a.start) - new Date(b.start)), drop = new Set(); let acc = 0;\n" +
   "      fut.forEach(e => { const u = (window.len1684 ? len1684(e) : 25) / 50; if(acc + u > left + 1e-9) drop.add(e); else acc += u; });\n" +
   "      return L.filter(e => !drop.has(e)); }catch(e){ return L; } };\n" +
   "  window.swMine1676 = "]
]);
