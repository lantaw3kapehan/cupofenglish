// 2192 (13 Nov · Misty: "why her January to May isn't showing"): management's My pay chart shows the last 12 months (teachers keep 8);
// a saved copy from before 2190 (no allTime.paidNet) is fetched again, so new totals show without waiting;
// her time-in months (database) now list every month on record, from January 2026.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [[".sort((a, b) => a.k.localeCompare(b.k)).slice(-8); if(R.length < 2) return '';",
  ".sort((a, b) => a.k.localeCompare(b.k)).slice(w === 'm' ? -12 : -8); if(R.length < 2) return '';"],
 [" _c1300 = kept('mypay') &&", " _c1300 = kept('mypay') && (m => m.allTime !== undefined && (!m.allTime || m.allTime.paidNet != null))(kept('mypay')) &&"]]);
