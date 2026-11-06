// 1794: (Misty 6 Nov 14:29, Payroll person sheet: "make colors here easy to follow like when teachers verify too so I can easily
//   know without going through, the visual guides me") One colour code on Payroll, in the list and in the person sheet:
//   green = done (pay verified, item in, ready), amber = waiting (not checked yet, asked, answered), red = needs action
//   (question on pay, amount changed, items missing). The Teacher's check becomes a coloured box; "Ready to release?" gets a
//   coloured answer; checklist circles are green when done and red with the count when not.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["const L = { Verified: ['ok', '✓ Pay verified'], Disputed: ['no', '! Question on pay'], Answered: ['', 'Answered · waiting'], Changed: ['no', 'Amount changed'] }[k.st] || ['', k.nd ? 'Asked to check pay' : 'Pay not checked'];",
   "const L = { Verified: ['ok', '✓ Pay verified'], Disputed: ['no', '! Question on pay'], Answered: ['wait', 'Answered · waiting'], Changed: ['no', '! Amount changed'] }[k.st] || ['wait', k.nd ? '… Asked to check pay' : '… Pay not checked'];   /* 1794 colours */"],
  ["return '<h2 style=\"margin-top:16px\">Teacher’s check</h2><div class=\"mini\">' +",
   "return '<h2 style=\"margin-top:16px\">Teacher’s check</h2><div class=\"mini pck ' + (k.st === 'Verified' ? 'ok' : (k.st === 'Disputed' || k.st === 'Changed') ? 'bad' : 'wait') + '\">' +"],
  ["<span class=\"c\">${rdyN(n) ? 'not yet' : 'yes, everything is in'}</span>",
   "<span class=\"rdy-h ${rdyN(n) ? 'no' : 'ok'}\">${rdyN(n) ? 'not yet' : '✓ yes, everything is in'}</span>"],
  [".pr-c.no{background:#FBF1DE;color:#8A5A0F}",
   ".pr-c.no{background:#FBF1DE;color:#8A5A0F}"
   + ".pr-c.ok,.py-cks .pr-c.ok{background:#E3F4EC!important;color:#1C6B4C!important;font-weight:600}"
   + ".pr-c.no,.py-cks .pr-c.no{background:#FDE8E4!important;color:#A3321E!important;font-weight:600}"
   + ".pr-c.wait,.py-cks .pr-c.wait{background:#FBF1DE!important;color:#8A5A0F!important;font-weight:600}"
   + ".mini.pck{border-left:4px solid;border-radius:12px}"
   + ".mini.pck.ok{background:#E3F4EC!important;border-color:#2E9E6B;color:#1C6B4C}"
   + ".mini.pck.bad{background:#FDE8E4!important;border-color:#D2553B;color:#A3321E}"
   + ".mini.pck.wait{background:#FFF6E5!important;border-color:#E2A93B;color:#8A5A0F}"
   + ".mini.pck b{color:inherit!important}"
   + ".rdy-h{display:inline-block;margin-left:8px;padding:3px 10px;border-radius:999px;font:700 13px/1.4 var(--f,inherit);vertical-align:middle}"
   + ".rdy-h.ok{background:#E3F4EC;color:#1C6B4C}.rdy-h.no{background:#FDE8E4;color:#A3321E}"
   + ".rdy .rdi{background:#FDE8E4;color:#A3321E;font-weight:700}"
   + ".rdy.ok .rdi{background:#E3F4EC!important;color:#1C6B4C!important}"],
]);
