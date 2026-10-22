// 22 Oct · Misty: "if they don't sign, what happens" must be clear, to avoid apathetic or avoidant teachers.
// Screens now say what Clauses 1.7–1.8 say: respond within 14 days; no response = treated as declined after a reminder;
// declining keeps the old terms only until the Agreement ends — the Company may end it with 30 days' notice, and renewal is
// only on current terms.
require('../tools/lib.js')(process.argv[2], [
["'<div class=\"fine\">Future updates to your contract come here as a numbered addendum. They bind you only when you sign them; if you decline, your current terms continue.</div>",
 "'<div class=\"fine\">Future updates to your contract come here as a numbered addendum. You must respond to each within 14 days: sign, ask a question, or decline. If you decline or do not respond, your old terms continue only until your Agreement ends: CupOfEnglish may end it with 30 days\\' notice, and renewal is only on the current terms (Clauses 1.7–1.8).</div>"],
["<div class=\"fine\">Please respond within 14 days. If you do not agree, your current terms continue and your lessons are not reduced for that reason; you may also end the Agreement with 30 days\\' written notice.</div>",
 "<div class=\"fine\"><b>You must respond within 14 days.</b> Not responding is treated as declining after a reminder. If you decline, your old terms continue only until your Agreement ends: CupOfEnglish may end it with 30 days\\' written notice, and renewal is only on the current terms. Lessons already booked are completed and paid (Clauses 1.7–1.8).</div>"],
["<div class=\"fine\">Your current terms continue. Management will talk with you. You can still sign below if you change your mind.</div>",
 "<div class=\"fine\">Management will talk with you. Your old terms continue only until your Agreement ends: CupOfEnglish may end it with 30 days\\' notice, and renewal is only on the current terms (Clause 1.8). You can still sign below if you change your mind.</div>"],
["toast(kind === 'declined' ? 'Sent · your current terms continue' : 'Question sent · management will reply here');",
 "toast(kind === 'declined' ? 'Sent · management will talk with you' : 'Question sent · management replies within 7 days');"],
]);
