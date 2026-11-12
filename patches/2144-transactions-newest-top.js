// 2144 (12 Nov, Misty 20:44: "the latest entry should always be the top row"): Finance › Transactions lists the newest ENTRY first
// (when it was saved, n from coe-expenses v9), then by date. Lines brought over from Google on 4 Nov have no entry time and keep
// the date order below. A line just saved on this device (not yet back from the database) counts as the newest.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["  function txAll(src){ const E = ((src || F).rows || []).map(r => ({ k: 'out', d: r.d, t: r.t || '—', c: r.c || 'Other', a: r.a, q: r.q, ref: '', key: r.key }));",
   "  function txAll(src){ const NOW = Date.now(), en = r => +r.n || (r.q ? NOW : 0);   /* 2144: newest entry first */\n    const E = ((src || F).rows || []).map(r => ({ k: 'out', d: r.d, t: r.t || '—', c: r.c || 'Other', a: r.a, q: r.q, ref: '', key: r.key, n: en(r) }));"],
  ["pkg: pkg(r), pay: r.pay, rmb: r.rmb, key: r.key }));\n    return E.concat(S).sort((a, b) => b.d.localeCompare(a.d) || (a.k === 'in' ? -1 : 1)); }",
   "pkg: pkg(r), pay: r.pay, rmb: r.rmb, key: r.key, n: en(r) }));\n    return E.concat(S).sort((a, b) => (b.n - a.n) || b.d.localeCompare(a.d) || (a.k === 'in' ? -1 : 1)); }"],
]);
