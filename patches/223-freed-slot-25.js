// 16 Oct · Misty: a freed time is shown in 25-minute lesson slots (5 min break): a cancelled 17:30–18:20 class shows
// "free 17:30–18:25 · 2 × 25 min", unless the next class starts before 18:25.
require('../tools/lib.js')(process.argv[2], [
["g.insertAdjacentHTML('beforeend', `<div class=\"cxo\"><i></i><span class=\"grow\">Open · Teacher ${esc(e.teacher)} is free ${tm(e.start)}–${tm(e.end)}</span>",
 "const s0 = +new Date(e.start), n = Math.max(1, Math.ceil((+new Date(e.end) - s0) / 18e5)), e1 = s0 + (n - 1) * 18e5 + 15e5;\n        const clash = SC.events.some(x => !x.cancelled && x !== e && key(x.teacher) === key(e.teacher) && +new Date(x.start) < e1 && +new Date(x.end) > s0), endT = clash ? tm(e.end) : tm(new Date(e1).toISOString());\n        g.insertAdjacentHTML('beforeend', `<div class=\"cxo\"><i></i><span class=\"grow\">Open · Teacher ${esc(e.teacher)} is free ${tm(e.start)}–${endT}${!clash && n > 1 ? ' · ' + n + ' × 25 min' : ''}</span>"],
]);
