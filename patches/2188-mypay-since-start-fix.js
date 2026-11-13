// 2188: 2187 must not change the loaded pay data (a second render would add this month twice); the year bars read the local copy.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
 ["\n    a.byYear = by;", ""],
 ["'<div title=\"' + esc(y) + ': ' + esc(peso(+a.byYear[y] || 0)) + '\"><s>' + esc(sh(+a.byYear[y] || 0)) + '</s><i style=\"height:' + Math.max(6, Math.round((+a.byYear[y] || 0) / mx * 44))",
  "'<div title=\"' + esc(y) + ': ' + esc(peso(+by[y] || 0)) + '\"><s>' + esc(sh(+by[y] || 0)) + '</s><i style=\"height:' + Math.max(6, Math.round((+by[y] || 0) / mx * 44))"]
]);
