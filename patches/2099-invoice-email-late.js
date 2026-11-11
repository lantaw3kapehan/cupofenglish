// 2099 (11 Nov 21:21, Misty: Payment confirmations "Can we send email here especially if parent sent their email address late?").
//   A confirmation with no email now has an Email button too: type the parent's email, it is saved on that confirmation and on the student
//   (for the next ones, if the student had none), and the confirmation is emailed at once (same email as before). Server: coe-ops v3 op invemail.
const lib = require("../tools/lib.js"), file = process.argv[2];
lib(file, [
  ["${x.status !== 'void' && x.email ? ` <button class=\"btn ghost sm\" onclick=\"ivRemail(${i})\">Email</button>` : ''}",
   "${x.status !== 'void' && x.email ? ` <button class=\"btn ghost sm\" onclick=\"ivRemail(${i})\">Email</button>` : x.status !== 'void' ? ` <button class=\"btn ghost sm\" onclick=\"ivAddMail(${i})\">Email</button>` : ''}"],
  ["window.ivBir = async i => {",
   "window.ivAddMail = async i => { const x = LIST[i]; if(!x || x.status === 'void') return;   /* 2099: the parent's email came late */\n" +
   "  const v = prompt('Parent\\'s email for Payment Confirmation ' + x.no + ' (' + x.bill_name + '):\\n\\nIt is saved on this confirmation and on the student, then the confirmation is emailed.'); if(v == null) return;\n" +
   "  const em = String(v).trim().toLowerCase(); if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(em)) return tst('The email address looks wrong. Nothing was sent.');\n" +
   "  tst('Saving the email…');\n" +
   "  try{ const r = await fetch('https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-ops', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: tok(), op: 'invemail', no: x.no, email: em }) }).then(y => y.json());\n" +
   "    if(!r || !r.ok) throw new Error((r && r.error) || 'The email was not saved.'); x.email = r.email || em; tst('Sending to ' + x.email + '…');\n" +
   "    await mail(x, await pdfOf(x)); tst('✓ Emailed to ' + x.email); ivList(); }catch(err){ tst(err.message || 'Not sent'); ivList(); } };\n" +
   "window.ivBir = async i => {"]
]);
