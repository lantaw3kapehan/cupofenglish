// Student profile: the CEFR tile falls back to the level written in the book label (e.g. "Pre-A1, ShortVowels" → Pre-A1)
// when there is no progress-check CEFR yet, so it matches the Students list.
require('../tools/lib.js')(process.argv[2], [
[
"<div><b>${esc(s.cefr||(C[0]&&C[0].cefr)||'—')}</b><span>CEFR</span></div>",
"<div><b>${esc(s.cefr||(C[0]&&C[0].cefr)||(String(s.book||'').match(/\\b(Pre-A1|A1|A2|B1|B2|C1|C2)\\b\\+?/i)||[])[0]||'—')}</b><span>CEFR</span></div>"
]
]);
