// 1877: (Misty 7 Nov 20:16 "since Celine is Operations, this shouldnt be teacher, also I asked her to check but she said she cannot see on her access")
//   · Payroll's check box says "Staff check" / "Ask Celine to check this pay" for office staff (base pay, no lessons), not "Teacher".
//   · Management's own My pay shows the same "please check" card teachers have on Pay (✓ This is correct / Something's wrong), from the
//     database (coe-payedit op mypay → coe_tpay.check) and saved as tPayVerify (coe_pay_takeover answers it).
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  [`function pchkSheetHtml(x){ const k = pchkOf(x); if(!k) return ''; const c = k.c || {};
return '<h2 style="margin-top:16px">Teacher’s check</h2>`,
   `function pchkSheetHtml(x){ const h = pchkSheetHtml1877(x); return (+x.base > 0 && !(+x.units || +x.reg || +x.lessonPay || +x.lesson_pay)) ? h.replace('Teacher’s check', 'Staff check').replace(/Teacher (?=\\S)/g, '') : h; }   /* 1877: office staff are not "Teacher" */
function pchkSheetHtml1877(x){ const k = pchkOf(x); if(!k) return ''; const c = k.c || {};
return '<h2 style="margin-top:16px">Teacher’s check</h2>`],
  [`let h = \`<div class="lead"><h1>My pay</h1><div class="mute small">\${esc(p.name||'')} · from PAYROLL · \${month} is an estimate, final after review</div></div>\` + myReadyHtml();`,
   `if(!renderMyPay._c1877){ renderMyPay._c1877 = 1; myChk1877(); }   /* 1877 */
let h = \`<div class="lead"><h1>My pay</h1><div class="mute small">\${esc(p.name||'')} · from PAYROLL · \${month} is an estimate, final after review</div></div>\` + myReadyHtml() + myChkHtml1877();`],
  [`function paySheet(p){`,
   `let MPCK1877 = null;   /* 1877: management's own pay check (same card as a teacher's Pay) */
async function myChk1877(){ try{ const r = await fetch(FAST_URL + '-payedit', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'mypay' }) }).then(x => x.json());
  if(r && r.ok && r.check && r.check.me){ MPCK1877 = r.check; if(VIEW === 'mypay') renderMyPay(); } }catch(e){} }
function myChkHtml1877(){ const p = MPCK1877; if(!p || !p.me || p.me.paid) return ''; let h = '';
  const k0 = PCK; try{ PCK = p; h = payChkHtml(); } catch(e){ h = ''; } finally{ PCK = k0; }
  if(!(+p.me.lessonPay) && !(+p.me.units)) h = h.replace(/<tr><td class="mute">Units<\\/td>.*?<\\/tr>/, '').replace(/<tr><td class="mute">Lesson pay<\\/td>.*?<\\/tr>/, '').replace('<td class="mute">Base</td>', '<td class="mute">Base pay (office days)</td>');
  return h.replace('onclick="payVerify()"', 'onclick="myPayVerify1877(true)"').replace(/onclick="payDispute\\(\\)"/g, 'onclick="myPayDispute1877()"'); }
async function myPayVerify1877(ok, note){ const p = MPCK1877; if(!p) return; const b = $(ok ? 'pvB' : 'pdB'); if(b){ b.disabled = true; b.textContent = ok ? 'Saving…' : 'Sending…'; }
  try{ const r = await fastWrite('tPayVerify', [TOKEN, p.month, !!ok, note || '']); if(r && r.ok === false) throw r;
    if(!ok) closeSheet(); toast(ok ? '✓ Thank you · your pay is verified' : '✓ Sent · the President sees your note on Payroll'); setTimeout(myChk1877, 1500); setTimeout(myChk1877, 6000); }
  catch(e){ toast((e && (e.msg || e.message || e.error)) || 'Not saved. Try again.'); if(b){ b.disabled = false; b.textContent = ok ? '✓ This is correct' : 'Send'; } } }
function myPayDispute1877(){ openSheet('<h1>Something’s wrong with my pay</h1><div class="mute small">' + esc((MPCK1877 && MPCK1877.month) || '') + ' · the President sees this on Payroll and answers you here</div><label>What looks wrong?</label><textarea id="pdN" class="in-t" rows="4" placeholder="e.g. 14 Oct is missing from my days"></textarea><button class="btn teal block" style="margin-top:12px" id="pdB" onclick="(function(){ const t = ($(\\'pdN\\') || {}).value || \\'\\'; if(!t.trim()) return toast(\\'Write what looks wrong\\'); myPayVerify1877(false, t); })()">Send</button>'); }
function paySheet(p){`],
]);
