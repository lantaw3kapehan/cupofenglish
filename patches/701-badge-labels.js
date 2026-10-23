// 701: (Misty) Two clearly labelled rows on the profile: "Cleared to teach:" (trainings she completed, e.g. Dezza · Phonics Training)
// and "Teacher trainer:" (trainings she leads for other teachers, e.g. April · The Alphabet). TESOL/TEFL wording.
require('../tools/lib.js')(process.argv[2], [
["(D0.length || TRN(d, who).length ? '<div class=\"tx-bdg\">' + D0.map(", "(D0.length || TRN(d, who).length ? '<div class=\"tx-bdg\">' + (D0.length ? '<b class=\"tx-bl\">Cleared to teach:</b>' : '') + D0.map("],
["<b class=\"small\" style=\"align-self:center;color:#00737B\">Trains:</b>", "<b class=\"tx-bl\" style=\"color:#00737B\">Teacher trainer:</b>"],
[".tx-prof{", ".tx-bl{font-size:12px;font-weight:700;color:var(--ink2,#5E5A75);align-self:center;margin-right:2px}\n.tx-prof{"],
]);
