// 14 Oct · CEFR journey: date the latest "Up" step from the -DAILY tabs (the month the current book first appears in the
// student's monthly classes, e.g. Gaby's first REF class), instead of showing "—". Book names with a teacher after them
// ("REF Julia", "OD2 Daniela") count as the same book.
require('../tools/lib.js')(process.argv[2], [
["const DT = T.filter(x => x.d && !/^Trial/.test(x.en))",
 "{ const fm = {}; MO.forEach(x => { const c = String(x.c || '').trim().split(/\\s+/)[0].toUpperCase(); if(c && (!fm[c] || x.m < fm[c])) fm[c] = x.m; });\n" +
 "  T.forEach(x => { const b = String(x.bk || '').trim().split(/[\\s,]+/)[0].toUpperCase(); if(/^Level/.test(x.en) && !x.d && b && fm[b]) x.d = fm[b] + '-01'; }); }   /* 14 Oct: level-up month from the -DAILY tabs */\n" +
 "const DT = T.filter(x => x.d && !/^Trial/.test(x.en))"],
["function cjHtml(S){ try{",
 "function cjPath(MO){ const fm = {}; (MO || []).forEach(x => { const c = String(x.c || '').trim().split(/\\s+/)[0].toUpperCase(); if(c && (!fm[c] || x.m < fm[c])) fm[c] = x.m; }); const L = Object.keys(fm).sort((a, b) => fm[a].localeCompare(fm[b])); if(L.length < 2) return ''; const mo = m => new Date(m + '-01T12:00:00').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });\n" +
 "  return '<div style=\"margin-top:4px;color:#2B2253\"><b>Book path 教材路径</b> · ' + L.map(b => '<b>' + esc(b) + '</b> ' + esc(mo(fm[b]))).join(' → ') + '</div>'; }   /* 14 Oct: from the -DAILY tabs (2025 onwards) */\n" +
 "function cjHtml(S){ try{"],
["<div class=\"mute\" style=\"margin-top:2px\">' + (tot > tot0 ? 'Since '",
 "' + cjPath(MO) + '<div class=\"mute\" style=\"margin-top:2px\">' + (tot > tot0 ? 'Since '"],
]);
