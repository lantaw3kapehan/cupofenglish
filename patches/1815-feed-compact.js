// 1815: final QA (phone width): "New from teachers" with 6 new items pushed Good evening and the day's numbers below the fold.
//   The card now shows the 3 newest and a "Show all 6" link (tap again: "Show fewer"); everything else unchanged.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["const show = (nw.length ? nw : L.slice(0, 3)).slice(0, 8);",
   "const pool = nw.length ? nw : L.slice(0, 3), show = FD1806.all ? pool.slice(0, 12) : pool.slice(0, 3);   /* 1815: 3 unless Show all */"],
  ["</a>').join('') : '<div class=\"small mute\" style=\"padding:6px 0\">No notices or messages from teachers in the last 7 days.</div>')",
   "</a>').join('') + (pool.length > 3 ? '<a class=\"link small\" style=\"display:block;padding:6px 6px 0\" onclick=\"FD1806.all=!FD1806.all;fd1806paint()\">' + (FD1806.all ? 'Show fewer' : 'Show all ' + pool.length) + '</a>' : '') : '<div class=\"small mute\" style=\"padding:6px 0\">No notices or messages from teachers in the last 7 days.</div>')"],
]);
