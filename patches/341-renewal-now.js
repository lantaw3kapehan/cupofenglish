// 19 Oct · Renewal picture: "lessons now" = what was left on the old package + the new lessons (Mia: 4.5 + 33 = 37.5).
// Right after a renewal the Active list can still show the old package for a few minutes (the database adds the new one within ~5 min); the picture showed only the 4.5 left.
// Old package = its deadline is before the payment date → now = left + new, carried over = left. New package already there → now = its lessons left.
require('../tools/lib.js')(process.argv[2], [
["cxDraw = async function(){ const P = CXP; if(P && P.kind === 'bal') P.renew = rnFor(P) || null;",
 "cxDraw = async function(){ const P = CXP; if(P && P.kind === 'bal') P.renew = rnFor(P) || null;\n  try{ const Q = P && P.renew, b = P && P.bal; if(Q && b && b.left !== '' && b.left != null){ const dl = String(b.deadline || '').slice(0, 10), old = !/^\\d{4}-\\d{2}-\\d{2}$/.test(dl) || dl < Q.paid;   /* 341 */\n    if(old){ Q.carry = Math.round(+b.left * 10) / 10; Q.now = Math.round((+b.left + Q.tot) * 10) / 10; } else Q.now = +b.left; } }catch(x){}"],
["ns = shared ? '—' : (!P.renew && +b.left < 0 ? '+' + Math.round(-b.left * 10) / 10 : String(b.left))",
 "ns = shared ? '—' : (!P.renew && +b.left < 0 ? '+' + Math.round(-b.left * 10) / 10 : String(P.renew && P.renew.now != null ? P.renew.now : b.left))"]]);
