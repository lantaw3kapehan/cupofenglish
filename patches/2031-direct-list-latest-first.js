// 2031 (9 Nov 20:50, Misty: "for someone who sent a message, should always be at the top of the list of teachers, so it's easy to
//   find, like how it is in common chats … I meant above April letter A"): the Direct list is ordered by the latest message, newest
//   first (coe-chat v24 gives each chat its last message time). People with no messages yet follow in A–Z order. Groups keep their order.
const file = process.argv[2];
require('../tools/lib.js')(file, [
 [
  "var q = String(S.dmq || '').trim().toLowerCase(), g2f = q ?",
  "g2 = g2.map(function(g, i){ return [g, i]; }).sort(function(a, b){ var x = a[0].last || '', y = b[0].last || ''; return x === y ? a[1] - b[1] : (x < y ? 1 : -1); }).map(function(p){ return p[0]; });   /* 2031: latest message first */\n    var q = String(S.dmq || '').trim().toLowerCase(), g2f = q ?"
 ]
]);
