// 14 Oct pm · Fast layer for every teacher (Misty: "do all now"). Until now only Misty (teacher view) and Julia.
// Published only after Julia's first real saves were replayed into the sheet without errors.
// Management screens still save the normal way. Switch off on one phone: localStorage coe.fast = '0'.
require('../tools/lib.js')(process.argv[2], [
["return !!(D && !D.mgr && D.me && FAST_USERS.indexOf(String(D.me.name || '').trim().toLowerCase()) > -1); }",
 "return !!(D && !D.mgr && D.me && D.me.name); }   /* 14 Oct pm: every teacher (was FAST_USERS only) */"],
]);
