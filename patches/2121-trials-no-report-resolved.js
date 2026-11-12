// 2121 (12 Nov audit): Trials › No report yet listed bookings that are already settled: a cancelled trial booking for a student whose
// trial report was sent on another day (Leon), and "another booking has the report" (Alice). They stayed there for weeks.
// Now they drop off the list; a cancelled booking with no report anywhere still shows (it needs a look).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["      if(w._rc.k === 'moved-ahead') return;",
   "      if(w._rc.k === 'moved-ahead') return;\n      if(w._rc.k === 'check' || (w._rc.k === 'cancelled' && reps().some(function(r){ return same(r, w); }))) return;   /* 2121: settled, the student has a report */"],
]);
