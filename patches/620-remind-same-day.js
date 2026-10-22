// 620: reminder wording is the same for every student on a given day and changes the next day (no per-student mix).
require('../tools/lib.js')(process.argv[2], [
["let h = 0; String(e.code || e.student || e.title || '').toLowerCase().split('').forEach(c => { h = (h * 31 + c.charCodeAt(0)) % 9973; });\nconst p = L[(h + Math.floor(s.getTime() / 864e5)) % L.length]",
 "const p = L[Math.floor((Date.parse(ymdLocal(new Date())) || Date.now()) / 864e5) % L.length]"]
]);
