// 813: Monitor board lists only people with classes that day (management time-ins, e.g. Ops, stay on the Time-ins tab).
require('../tools/lib.js')(process.argv[2], [
  ["if(r && r.ok){ M.data = r; M.day = r.day;", "if(r && r.ok){ r.teachers = (r.teachers || []).filter(t => t.classes && t.classes.length); M.data = r; M.day = r.day;"]
]);
