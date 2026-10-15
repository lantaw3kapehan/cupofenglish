// 15 Oct · Edit form: a field the server's fresh copy does not include (Source, before the STUEDIT paste) keeps the
// value from the app's copy instead of being blanked.
require('../tools/lib.js')(process.argv[2], [
["Object.keys(M).forEach(id => { const el = $(id); if(!el || el.dataset.t) return;", "Object.keys(M).forEach(id => { const el = $(id); if(!el || el.dataset.t || !(M[id] in v2)) return;"],
]);
