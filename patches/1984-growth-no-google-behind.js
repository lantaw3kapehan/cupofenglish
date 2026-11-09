// 1984: (Misty 9 Nov "go ahead") Growth no longer asks Google behind the screen (59 times in 48 h, 19 s each).
//   The parts Google used to supply — peer reviews, class visits, this month's homework — are now written by the database into the
//   Growth copy (trigger coe_growth_db_parts, kept current every 15 min); records to fix were already the database's (1941).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["try{ const g = r.data._src && r.data._src.google, at = g && g.at ? Date.parse(g.at) : 0; if(Date.now() - at >",
   "try{ const g = r.data._src && r.data._src.google, at = g && g.at ? Date.parse(g.at) : 0; if(false && Date.now() - at >"],
]);
