// 876: Payment confirmation (audit #16). The form had one button "Issue Payment Confirmation N and email it" next to a live
//      picture, so preview, saving and emailing read as one thing. What each part does is unchanged; the three steps are now labelled:
// · Over the picture: "Preview · not saved yet" (before) → "Issued · No. N · saved" (after).
// · Above the button: 1 Preview (nothing saved) · 2 Save & issue (gives the number; after that only void) · 3 Email (to whom, or off / no address);
//   step 3 follows the email box and the tick live.
// · The tick: "Email it to them too" → "Step 3 · email the PDF to this address right after issuing".
// · Button: "Save & issue No. N · then email the PDF" (or "Save & issue No. N" when no email will go). Same ivIssue().
// · All payment confirmations: Picture → Copy picture · Message → Copy message · PDF → Download PDF · Email → Send by email /
//   Email again (when already emailed) · Add → Add BIR no. · status "Emailed" → "Emailed · <date>" (Manila date of emailed_at).
// (generated: each pair is [exact text in app.html, replacement]; JSON strings)
const fs = require('fs'), file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const goLbl = () => 'Issue Payment Confirmation ' + S.next + (S.email && S.mail !== false ? ' and email it' : '');",
   "const goLbl = () => 'Save & issue No. ' + S.next + (S.email && S.mail !== false ? ' · then email the PDF' : '');\nconst s3txt = () => String(S.email || '').trim() ? (S.mail !== false ? 'sent to ' + String(S.email).trim() + ' right after issuing' : 'off · you can email it later from All payment confirmations') : 'no email address · nothing is emailed';"],
  ["const goUpd = () => { const b = document.getElementById('ivGo'); if(b && !b.disabled) b.textContent = goLbl();",
   "const goUpd = () => { const b = document.getElementById('ivGo'); if(b && !b.disabled) b.textContent = goLbl(); const s3 = document.getElementById('ivS3'); if(s3) s3.textContent = s3txt();"],
  [" Email it to them too 同时发送邮件</label>",
   " Step 3 · email the PDF to this address right after issuing 同时发送邮件</label>"],
  ["<button class=\"btn go\" id=\"ivGo\" onclick=\"ivIssue()\">${goLbl()}</button>",
   "<div class=\"small\" style=\"margin-top:14px;line-height:1.55;color:#55516E\"><div><b>1 · Preview</b> — the page shown is a preview; nothing is saved yet.</div><div><b>2 · Save &amp; issue</b> — gives it No. ${e(String(S.next || ''))} and saves it. After that it can only be voided.</div><div><b>3 · Email</b> — <span id=\"ivS3\">${e(s3txt())}</span>.</div></div>\n  <button class=\"btn go\" id=\"ivGo\" onclick=\"ivIssue()\">${goLbl()}</button>"],
  ["b.textContent = 'Issue Payment Confirmation ' + S.next; return tst(x.message);",
   "b.textContent = goLbl(); return tst(x.message);"],
  ["const v = document.querySelector('#ivM .iv-v'); if(!v) return;",
   "const v = document.querySelector('#ivM .iv-v'); if(!v) return; v.dataset.st = 'Preview · not saved yet';"],
  ["const v = document.querySelector('#ivM .iv-v'); if(v){",
   "const v = document.querySelector('#ivM .iv-v'); if(v){ v.dataset.st = 'Issued · No. ' + inv.no + ' · saved';"],
  ["#ivM .iv-v .pg{transform-origin:top center;",
   "#ivM .iv-v{position:relative}#ivM .iv-v[data-st]::before{content:attr(data-st);position:absolute;top:3px;left:10px;z-index:1;font:700 11.5px/1.5 Inter,system-ui,sans-serif;color:#2f2752;background:#fff;border-radius:999px;padding:1px 10px;box-shadow:0 1px 2px rgba(0,0,0,.1)}\n#ivM .iv-v .pg{transform-origin:top center;"],
  ["onclick=\"ivPic(${i})\">Picture</button>",
   "onclick=\"ivPic(${i})\">Copy picture</button>"],
  ["onclick=\"ivMsg(${i})\">Message</button>",
   "onclick=\"ivMsg(${i})\">Copy message</button>"],
  ["onclick=\"ivPdf(${i})\">PDF</button>",
   "onclick=\"ivPdf(${i})\">Download PDF</button>"],
  ["onclick=\"ivRemail(${i})\">Email</button>",
   "onclick=\"ivRemail(${i})\">${x.emailed_at ? 'Email again' : 'Send by email'}</button>"],
  ["onclick=\"ivBir(${i})\">Add</button>",
   "onclick=\"ivBir(${i})\">Add BIR no.</button>"],
  ["'<span class=\"pill\">Emailed</span>'",
   "'<span class=\"pill\">Emailed' + (isNaN(Date.parse(x.emailed_at)) ? '' : ' · ' + e(dmy(new Date(Date.parse(x.emailed_at) + 8 * 3600e3).toISOString().slice(0, 10)))) + '</span>'"]
]);
