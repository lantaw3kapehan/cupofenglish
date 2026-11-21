// 2594 (audit QA-26, 21 Nov): normal screens named storage tabs and checks: "MASTERLIST → APP EMAIL", "saved in T-LEAVE", "Remove this
// leave from T-LEAVE?", "from the PAY tab", "meta check failed". They now say what it means for the user; the technical step stays in the
// "Books that did not open" details as a second line. (The leave proof note also said "Drive folder"; proofs are kept in the app's
// private storage now.)
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["<label>App sign-in email (MASTERLIST → APP EMAIL)</label>", "<label>App sign-in email</label>"],
  ["Add teachers' Gmail in MASTERLIST → APP EMAIL to see them here.", "Add each teacher's sign-in email (Teachers › tap the teacher › Edit) to see them here."],
  ["' as Resigned in MASTERLIST?\\n\\nOK = yes, hide them from the lists", "' as Resigned in the staff list?\\n\\nOK = yes, hide them from the lists"],
  ["management approves · saved in T-LEAVE</div>", "management approves · kept in the leave records</div>"],
  ["[/^Requests with proof · Operations checks · management approves · saved in T-LEAVE$/,", "[/^Requests with proof · Operations checks · management approves · kept in the leave records$/,"],
  ["onclick=\"if(confirm('Remove this leave from T-LEAVE?'))lvSave(true)\"", "onclick=\"if(confirm('Remove this leave record?'))lvSave(true)\""],
  ["Saved in T-LEAVE · proof files go to the private Drive folder \"CupOfEnglish Leave proofs\" · the", "Kept in the leave records · proof files are stored privately (management only) · the"],
  ["<div class=\"mute small\">${esc((MO&&MO.payMonth)||'')} pay · from the PAY tab</div>", "<div class=\"mute small\">${esc((MO&&MO.payMonth)||'')} pay · from the database</div>"],
  ["<div class=\"sub\">${esc((MO && MO.payMonth) || '')} pay · from the PAY tab</div>", "<div class=\"sub\">${esc((MO && MO.payMonth) || '')} pay · from the database</div>"],
  ["return '<span>Loading pay from the PAY tab…</span>';", "return '<span>Loading pay…</span>';"],
  ["<div class=\"small mute\">' + E(x.step || '') + (x.error ? ' · ' + E(x.error) : '') + '</div>",
   "<div class=\"small\">' + E(x.outcome === 'failed' ? 'The book could not be opened' : /meta check failed|book details did not load/.test(x.error || '') ? 'The book details did not load, so a slower copy was used' : x.outcome === 'fallback' ? 'Opened from Drive (slow)' : 'Took ' + (+x.secs || 0) + ' s to open') + '</div><div class=\"small mute\">Details: ' + E(x.step || '') + (x.error ? ' · ' + E(x.error) : '') + '</div>"],
]);
