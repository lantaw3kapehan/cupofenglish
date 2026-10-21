// 21 Oct · Misty: generation time in military (24-hour) time like the lesson summary. Row "Generated 生成时间 19:50" under Date,
// from the time the database issued the confirmation (Manila time), so reprints keep the original time; the date is added when it differs from the paid date.
require('../tools/lib.js')(process.argv[2], [
["<table><tr><td>Date</td><td>${dmy(inv.day)}</td></tr>", "<table><tr><td>Date</td><td>${dmy(inv.day)}</td></tr><tr><td>Generated <span class=\"zh\">\u751f\u6210\u65f6\u95f4</span></td><td>${genAt(inv)}</td></tr>"],
["const dmy = d => {", "/* 544: generation time in 24-hour Manila time (like the lesson summary), from the moment the database issued it; date shown too when it differs from the paid date */\nconst genAt = inv => { const t = inv && inv.created_at ? new Date(inv.created_at) : new Date(), m = new Date(t.getTime() + 8 * 3600e3), hm = String(m.getUTCHours()).padStart(2, '0') + ':' + String(m.getUTCMinutes()).padStart(2, '0'), d = m.toISOString().slice(0, 10);\n  return d === String(inv && inv.day || '').slice(0, 10) ? hm : hm + ' \u00b7 ' + dmy(d); };\nconst dmy = d => {"]
]);
