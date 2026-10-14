// 14 Oct night · The app waits up to 4 s (was 2.5 s) for the database before asking Google instead. When several screens
// open together (after a reload) the database works out a few of them at once, which can take 2–3 s; with 2.5 s the app
// sometimes gave up and waited for Google (8+ s) instead.
require('../tools/lib.js')(process.argv[2], [
["  let docs = {}; try{ const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 2500) : 0;",
 "  let docs = {}; try{ const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), 4000) : 0;"],
]);
