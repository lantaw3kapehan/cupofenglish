// Class visit (Ops QA): drop the "Class note" box (note + comment chips + Send comment) for Operations; the visit form
// above already covers it. The President still sees it.
require('../tools/lib.js')(process.argv[2], [
[
"try{ if(!e || !e.code) return h; const k = (e.id || '') + '|' + e.code; setTimeout(() => monNoteLoad(e, k), 30);",
"try{ if(!e || !e.code || !isPres()) return h; const k = (e.id || '') + '|' + e.code; setTimeout(() => monNoteLoad(e, k), 30);"
]
]);
