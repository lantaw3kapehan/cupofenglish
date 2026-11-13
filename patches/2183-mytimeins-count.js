// 2183 (13 Nov · QA): "N days this month" on My time-ins counts only days with a real time-in (not rest days or day-off rows).
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [["'<section class=\"at80\"><h3>My time-ins</h3><div class=\"sub\">' + cur.length + ' day' + (cur.length === 1 ? '' : 's') + ' this month'",
  "'<section class=\"at80\"><h3>My time-ins</h3><div class=\"sub\">' + cur.filter(x => /^\\d/.test(String(x.tin || ''))).length + ' day' + (cur.filter(x => /^\\d/.test(String(x.tin || ''))).length === 1 ? '' : 's') + ' worked this month'"]]);
