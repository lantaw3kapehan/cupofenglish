// 1563 · Payment Confirmation: review first, issue, then email as its own step (29 Oct 2026, Misty's Trials/Enquiries audit:
// "separate generating a payment-confirmation preview from emailing it, and show an explicit review before saving").
// One shared dialog (ivOpen, used by Add sale, Enrolled · paid from Students or a trial, Renewed · paid), changed in one place:
// · The form button is "Review Payment Confirmation N". It checks the same things as before and shows a review: number, date, bill to,
//   address, every line (qty × rate = amount), total, tax inside, paid, method, the email that will be saved on it. "Back to edit" or
//   "Issue Payment Confirmation N". The old browser confirm() is replaced by this review (same wording: can't be edited, only voided).
// · Issue = exactly the old issue call (same fields; the database stamps the time, which the renewal rule uses as the payment time).
//   It no longer emails. The "Email it to them too" tick is gone (it was on by default).
// · After issuing: "Email to <address>" is its own button with its own confirm; it only sends the PDF (mailInvoice + 'mailed' mark),
//   never makes a new confirmation and never changes its time. Copy picture / Copy message / Download / Back to the form unchanged.
// · Void, numbering, tax, attach-to-form: unchanged. All payment confirmations › Email again: unchanged.
require('../tools/lib.js')(process.argv[2], [
  [`<label class="chk" id="ivMailRow"\${S.email ? '' : ' style="display:none"'}><input type="checkbox" \${S.mail !== false ? 'checked' : ''} onchange="ivMailOpt(this.checked)"> Email it to them too 同时发送邮件</label>`,
   `<div class="small mute" id="ivMailRow" style="margin-top:4px\${S.email ? '' : ';display:none'}">Saved on the confirmation. Nothing is emailed when you issue it: after issuing, check it and tap Email.</div>`],
  [`<button class="btn go" id="ivGo" onclick="ivIssue()">\${goLbl()}</button>`, `<button class="btn go" id="ivGo" onclick="ivReview()">\${goLbl()}</button>`],
  [`const goLbl = () => 'Issue Payment Confirmation ' + S.next + (S.email && S.mail !== false ? ' and email it' : '');`,
   `const goLbl = () => 'Review Payment Confirmation ' + S.next;`],
  ["window.ivIssue = async () => {\n  const d = draft(), b = document.getElementById('ivGo');",
   `/* 1563 · review before issuing */
window.ivReview = () => {
  if(!S || S.issued) return; const d = draft();
  if(!String(S.bill_name || '').trim()) return tst('Bill to is empty');
  if(S.lines.some(l => !(+l.qty > 0) || (!(+l.rate) && l.open))) return tst('Check the lines: each needs a quantity and a price');
  if(S.email && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(S.email)) return tst('The email address looks wrong');
  const f = document.querySelector('#ivM .iv-f'); if(!f) return; S.reviewed = 1; S.revY = f.scrollTop;
  const td = 'padding:7px 6px;border-bottom:1px solid #EEF0F4;vertical-align:top', tr = (k, v) => '<tr><td style="' + td + ';color:#6F6B85;width:38%">' + k + '</td><td style="' + td + '">' + v + '</td></tr>';
  f.innerHTML = '<h3 style="margin:0 0 4px">Review before issuing</h3><div class="small mute">Check every line. Once issued it can\\'t be edited or deleted, only voided with a reason.</div>'
    + '<table style="width:100%;border-collapse:collapse;margin-top:10px;font-size:14px">'
    + tr('Number', '<b>' + e(d.no) + '</b>') + tr('Date', e(dmy(d.day))) + tr('Bill to', '<b>' + e(d.bill_name) + '</b>' + (d.bill_addr ? '<div class="small mute" style="white-space:pre-line">' + e(d.bill_addr) + '</div>' : ''))
    + tr('Lines', d.items.map(x => '<div style="margin-bottom:4px"><b>' + e(x.name) + '</b><div class="small mute">' + x.qty + ' × ' + (x.rate ? '¥' + n2(x.rate) : 'free') + ' = ' + (x.amt ? '¥' + n2(x.amt) : 'free') + '</div></div>').join(''))
    + tr('Total', '<b>¥' + n2(d.total) + '</b> <span class="small mute">· includes 3% tax ¥' + n2(d.tax) + '</span>') + tr('Paid', d.paid ? 'Paid in full (PAID stamp)' : 'Not marked paid')
    + tr('Payment method', e(d.method || '—')) + (d.bir_no ? tr('BIR invoice no.', e(d.bir_no)) : '')
    + tr('Email', d.email ? e(d.email) + '<div class="small mute">saved on the confirmation · not emailed now</div>' : '<span class="mute">none · nothing will be emailed</span>') + '</table>'
    + '<button class="btn go" id="ivGo" onclick="ivIssue()">Issue Payment Confirmation ' + e(S.next) + '</button><button class="btn ghost block" style="margin-top:8px" onclick="ivEdit()">Back to edit</button>';
  f.scrollTop = 0; preview(); };
window.ivEdit = () => { if(!S || S.issued) return; S.reviewed = 0; const f = document.querySelector('#ivM .iv-f'); if(!f) return; f.innerHTML = formHtml(); f.scrollTop = S.revY || 0; preview(); };
window.ivMailNow = async () => { if(!S || !S.issued || !S.issued.email) return; if(!confirm('Email Payment Confirmation ' + S.issued.no + ' to ' + S.issued.email + '?')) return;
  if(!S.blob){ try{ S.blob = (await both(S.issued)).pdf; }catch(x){} }   /* the PDF of the issued confirmation (never a new one) */
  ivMailAgain(); };
window.ivIssue = async () => {
  const d = draft(), b = document.getElementById('ivGo');`],
  ["  if(!confirm(`Issue Payment Confirmation ${S.next} to ${S.bill_name} for ¥${n2(d.total)}?\\n\\nAfter this it can't be edited or deleted, only voided.`)) return;",
   "  if(!S.reviewed) return ivReview();"],
  ["  if(inv.email && S.mail !== false){ const s = document.getElementById('ivMail');", "  if(inv.email && S.mail === 'now'){ const s = document.getElementById('ivMail');"],
  [`\${inv.email ? (S.mail !== false ? 'Sending the email…' : '<span class="mute">Not emailed (you chose not to). You can email it later from All payment confirmations.</span>') : '<span class="mute">No email address, so nothing was emailed.</span>'}`,
   `\${inv.email ? '<span class="mute">Not emailed yet.</span> <button class="btn ghost sm" style="margin-left:6px" onclick="ivMailNow()">Email to ' + e(inv.email) + '</button>' : '<span class="mute">No email address, so nothing was emailed.</span>'}`]
]);
