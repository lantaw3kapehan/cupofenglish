// 1712: (QA 2 Nov, teacher click-through as Teacher Kat) two small screen fixes.
//   · My growth › score tiles (Critical Thinking, Communication, Collaboration, Creativity, Professionalism) were always 5 across;
//     on a narrower laptop window the word PROFESSIONALISM pushed the row past the edge and the whole page scrolled sideways.
//     The tiles now wrap to a second row when there isn't room (same size text, nothing hidden).
//   · Header "N online" chip (management only): after signing out of management and into a teacher account on the same computer
//     without a reload, the chip stayed on screen. It is now removed as soon as the signed-in person is not management.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  [".pr-sc{display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-top:10px}",
   ".pr-sc{display:grid;grid-template-columns:repeat(auto-fit,minmax(96px,1fr));gap:6px;margin-top:10px}"],
  ["function paint(){ const rf = document.getElementById('rf'); if(!rf || !hasD() || !D.mgr) return;",
   "function paint(){ const rf = document.getElementById('rf'); if(!rf || !hasD() || !D.mgr){ try{ const o = document.getElementById('onlN'); if(o && hasD() && !D.mgr) o.remove(); }catch(e){} return; }"]
]);
