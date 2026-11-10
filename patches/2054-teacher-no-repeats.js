// 2054 (10 Nov 11:27, Misty: final QA "include the teacher access too" · no repeated buttons or information). Display only.
//   · Header: the pay rate (₱…/unit) next to the rank is gone. It is on Pay, and the header shows on every time-in screen share
//     (posted in Team Chat for all teachers to see).
//   · Needs your action: the monthly feedback is listed once it opens (25th), not as "opens in 15 days" (nothing to do yet).
//   · Notices & requests: "Request leave" was here and on Schedule → Schedule only (where the affected classes are).
//   · Growth: "Pay is per unit…" repeated the Pay screen → Pay only.
const file = process.argv[2];
require('../tools/lib.js')(file, [
[
"esc([me.rank, me.rate ? peso(me.rate)+'/unit' : ''].filter(Boolean).join(' · '));\nconst nk = D.mgr",
"esc(me.rank || '');   /* 2054: no pay rate in the header (it shows on screen shares; the rate is on Pay) */\nconst nk = D.mgr"
],
[
"if(h) h.innerHTML = esc([D.me.rank, D.me.rate ? peso(D.me.rate) + '/unit' : ''].filter(Boolean).join(' · '));",
"if(h) h.innerHTML = esc(D.me.rank || '');   /* 2054 */"
],
[
"const when = toOpen > 0 ? 'opens ' + f(op) + ' (in ' + toOpen + ' day' + (toOpen === 1 ? '' : 's') + ')' : 'open now';",
"if(toOpen > 0) return '';   /* 2054: Needs your action lists the monthly feedback only once it opens (the 25th) */\nconst when = 'open now';"
],
[
"<button class=\"btn teal\" onclick=\"tMsgNew()\">New message</button><button class=\"btn ghost\" onclick=\"tlvSheet()\">Request leave</button><button class=\"btn ghost rf\" title=\"Check for new messages\"",
"<button class=\"btn teal\" onclick=\"tMsgNew()\">New message</button><button class=\"btn ghost rf\" title=\"Check for new messages\""
],
[
"['v-pay', 'v-growth'].forEach(id => { const v = document.getElementById(id); if(!v || !v.childElementCount) return; let e = v.querySelector('.unit1998');",
"['v-pay'].forEach(id => { const v = document.getElementById(id); if(!v || !v.childElementCount) return; let e = v.querySelector('.unit1998');   /* 2054: Pay only (Growth repeated it) */"
]
]);
