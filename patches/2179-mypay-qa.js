// 2179 (13 Nov · Misty 20:01 "QA and audit and fix Celine's screen, especially her My pay"):
// · November's estimate showed ₱5,460 as the net although ₱2,410 of contributions were listed under it (Celine's contributions are put
//   inside "deductions" only at payroll time): coe_mgmt_mypay now takes them off the month in progress → net ₱3,050 (DB, same release).
// · The "day 13 of 30 · on pace" bar was drawn inside the "October 2026 pay · Ready ✓" card (first card on the page): it now sits under
//   "November so far", and the pace is worked out from the pay earned per day with the month's contributions taken off once (it used to
//   scale the net, so the projection was off).
// · The "October 2026 pay · ready to be released" card stayed after her October pay was paid (it only checked the teachers' pay list):
//   it now also checks her own pay history.
// · Text: no "from PAYROLL" (the pay comes from the database now); the contributions line is a full sentence without "·".
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["const card = v.querySelector('.card'), cur = MYP.pay.find(x => x.m === MYP.month);",
   "const cur = MYP.pay.find(x => x.m === MYP.month), card = [...v.querySelectorAll('.card')].find(c => /so far/.test(c.textContent)) || null;   /* 2179 */"],
  ["    if(cur) pace(card, num(cur.net), MYP.pay.filter(x => x !== cur));",
   "    if(cur && card){ const d0 = Math.max(1, now.getDate()), tgt = (num(cur.base) + num(cur.lessonPay)) / d0 * dim + num(cur.bonus) - num(cur.deduct) - num(cur.gov); pace(card, tgt * d0 / dim, MYP.pay.filter(x => x !== cur)); }   /* 2179: earned per day, contributions once */"],
  ["<div class=\"small mute\" style=\"margin-top:8px\">SSS · Pag-IBIG · PhilHealth · BIR ${peso(cur.gov)}${cur.deduct ? ' · deductions ' + peso(cur.deduct) : ''} · tap a month below for the full breakdown</div>",
   "<div class=\"small mute\" style=\"margin-top:8px\">Government contributions (SSS, Pag-IBIG, PhilHealth and BIR): ${peso(cur.gov)}${cur.deduct ? '. Other deductions: ' + peso(cur.deduct) : ''}. Tap a month below for the full breakdown.</div>"],
  ["${esc(p.name||'')} · from PAYROLL · ${month} is an estimate, final after review", "${esc(p.name||'')}. ${month} is an estimate; the final amount is set after review."],
  ["function myReadyHtml(){ if(!MYR || !MYR.me || payPaid(MYR.month)) return '';",
   "function myReadyHtml(){ if(!MYR || !MYR.me || payPaid(MYR.month)) return ''; try{ const k3 = String(MYR.month || '').slice(0, 3).toLowerCase(), y3 = (String(MYR.month || '').match(/\\d{4}/) || [''])[0]; if(typeof MYP !== 'undefined' && MYP && (MYP.pay || []).some(x => String(x.month || '').slice(0, 3).toLowerCase() === k3 && String(x.month || '').indexOf(y3) > -1 && /paid/i.test(x.status || ''))) return ''; }catch(e){}   /* 2179: own pay already paid */"],
  ["No pay records for ' + esc(p.name||'you') + ' in PAYROLL.", "No pay records for ' + esc(p.name||'you') + ' yet."],
]);
