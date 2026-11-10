// 2047 (10 Nov 10:23, Misty: "6, 7 and 8, we can do all now"): management's start data (getBootstrap) comes from the database
//   (coe-lists op "bootstrap", about 0.1 s) instead of Google (3–4 s; Misty waited 3.6 s at 09:10 opening the app). The database
//   version was compared with Google's on every management open since 1773: 20 of 20 identical. Google is used only if the database
//   cannot answer (it then says so and the app falls back as before).
const file = process.argv[2];
require('../tools/lib.js')(file, [
 ["    : fn === 'mgmtClassInfo' && a[1] && typeof a[1] === 'object' ? { token: a[0], op: 'classinfo', ev: a[1] } : null;",
  "    : fn === 'mgmtClassInfo' && a[1] && typeof a[1] === 'object' ? { token: a[0], op: 'classinfo', ev: a[1] }\n    : fn === 'getBootstrap' && !(typeof D !== 'undefined' && D && D.me && !D.mgr) ? { token: a[0], op: 'bootstrap' } : null;   /* 2047: management start data from the database */"]
]);
