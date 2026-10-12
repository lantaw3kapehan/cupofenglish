// Class visit (management QA): no "Class note" box for anyone in management (before: hidden for Operations only).
require('../tools/lib.js')(process.argv[2], [
[
"try{ if(!e || !e.code || !isPres()) return h;",
"try{ if(h || !h) return h;   /* Class note box removed from the class visit (QA) for all management · 12 Oct */"
]
]);
