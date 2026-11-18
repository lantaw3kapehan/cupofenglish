// 2356 (QA 18 Nov): Monitor › Yesterday showed "Time-in –" (picture not sent) for every teacher although all 8 sent it; the check loaded today's posts only.
const file = process.argv[2];
require('../tools/lib.js')(file, [
["function loadDay(force){ if(DAYBUSY || typeof D === 'undefined' || !D || !D.mgr) return; var d = today();", "function loadDay(force){ if(DAYBUSY || typeof D === 'undefined' || !D || !D.mgr) return; var d = (typeof VIEW !== 'undefined' && VIEW === 'monitor' && window.M && M.day) ? String(M.day).slice(0, 10) : today();   /* 2356: the day Monitor shows (Yesterday too) */"],
["if(!/\\d/.test(cell.textContent)) return; var h = (o.posted ?", "if(!/\\d/.test(cell.textContent)) return; if(OVDAY !== String((window.M && M.day) || d).slice(0, 10)){ loadDay(true); return; }   /* 2356: not loaded for this day yet \u00b7 no false \"\u2013\" */ var h = (o.posted ?"]
]);
