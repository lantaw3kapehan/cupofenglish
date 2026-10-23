// 659: Books to buy opened from the student page picked the CEFR level ("A1, OD2 → …" → A1). Now it skips levels and arrows and opens
// the student's course book (the one with covers when there are several). bbOpen also accepts a whole book field.
require('../tools/lib.js')(process.argv[2], [
[
"const b0 = String(STU.s.book).split(/\\s*,\\s*/)[0];",
"const b0 = window.bbPick ? bbPick(STU.s.book) : String(STU.s.book).split(/\\s*,\\s*/)[0];"
],
[
"window.bbOpen = async (book, en, cn) => { CUR = { code: key(book), en: en || '', cn: cn || '' };",
"/* 659 · from a book field like \"A1, OD2 → OD3\": not levels, the current book first (before the arrow), one with covers when possible */\n  window.bbPick = f => { const P = String(f || '').split(/\\s*(?:,|;|→|->|\\/|·)\\s*/).map(x => x.trim()).filter(x => x && !/^(pre[-\\s]?)?[abc][12]\\+?$/i.test(x) && !/^cefr/i.test(x));\n    return P.find(x => { const r = rowOf(x); return r && r.sb_cover && !r.hidden; }) || P.find(x => rowOf(x)) || P[0] || ''; };\n  window.bbOpen = async (book, en, cn) => { if(/[,→]|^\\s*(pre[-\\s]?)?[abc][12]\\+?\\s*$/i.test(String(book || ''))) book = bbPick(book) || book; CUR = { code: key(book), en: en || '', cn: cn || '' };"
]
]);
