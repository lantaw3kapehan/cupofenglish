// 16 Oct · Misty: 17:30–18:20 was right (a 50-minute class). The freed time shows the class's own time again, with its length.
require('../tools/lib.js')(process.argv[2], [
["is free ${tm(e.start)}–${endT}${!clash && n > 1 ? ' · ' + n + ' × 25 min' : ''}</span>",
 "is free ${tm(e.start)}–${tm(e.end)} · ${Math.round((+new Date(e.end) - s0) / 6e4)} min</span>"],
]);
