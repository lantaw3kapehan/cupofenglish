// 1543: (Misty, 29 Oct 03:36) payment times from the invoice-sent times: Amy 14 Oct 16:40 and Lucian 16 Oct 11:01 paid BEFORE that
// day's class (it is used in the new package: carry +0.5, used +0.5); Mia 19 Oct 20:13 paid AFTER her 19:30 class (old package).
// Database: migration renewal_misty_times_1543 (coe_renew_at with source "invoice time from Misty", signed early, the sync respects it).
// App: the lesson-balance picture and the Lesson Summary show valid until from the first class after the payment (the database check's
// validRule) — the same date the renewal picture already uses (1541) — so Mia shows 23 Jun 2027 everywhere a parent sees it.
// App health keeps asking for the sheet's RENEWAL DATE to match.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["unhold(); if(sp && sp.ok && P.bal && !Q0) P.bal.carry = sp.carry;",
   "unhold(); if(sp && sp.ok && P.bal && !Q0) P.bal.carry = sp.carry; if(P.bal && !Q0 && row && row.validRule) P.bal.deadline = row.validRule;   /* 1543: valid until from the first class after the payment */"],
  ["window.lsHtml = function(code){ const h = _ls.apply(this, arguments);",
   "window.lsHtml = function(code){ let h; const k0 = D && D.mgr ? pkgOf(code) : null, d0 = R.last(), rw0 = d0 && d0.rows ? d0.rows[up(code)] : null, sw = k0 && rw0 && rw0.validRule && k0.C.deadline != null ? k0.o[k0.C.deadline] : undefined;   /* 1543: the same valid-until as the pictures */\n    if(sw !== undefined) k0.o[k0.C.deadline] = rw0.validRule; try{ h = _ls.apply(this, arguments); } finally { if(sw !== undefined) k0.o[k0.C.deadline] = sw; }"]
]);
