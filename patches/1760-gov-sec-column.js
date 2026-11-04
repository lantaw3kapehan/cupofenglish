// 1760: (Misty 4 Nov 18:24 "can you make SEC on this table too?") Finance › Government › By month always shows every column
//   (SSS, Pag-IBIG, PhilHealth, BIR, SEC, Charges), even when a year has no amount in it; the table is a little tighter so ✎ fits.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["    const used = GK.filter(([k]) => Y.some(g => +g[k]));", "    const used = GK;   /* 1760: every column, SEC included */"],
  ["#v-gov td{padding:7px 8px;", "#v-gov td{padding:7px 6px;"],
  ["#v-gov th{font-size:12px;font-weight:600;color:#5E5A76;text-align:right;padding:6px 8px;", "#v-gov th{font-size:12px;font-weight:600;color:#5E5A76;text-align:right;padding:6px 6px;"],
]);
