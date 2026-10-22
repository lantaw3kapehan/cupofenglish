// 646: late class video uploads are tagged automatically (server: Unexcused · POLICY penalty → ACTIONS case + deduction).
// Teacher wording before and after upload says so; management reviews it the next day in Cases and can Waive it, otherwise it stays.
require('../tools/lib.js')(process.argv[2], [
[
"'Uploading it now still saves it to the student\\'s folder and DAILY, but it is recorded as a <b>late video</b> in your class record, and management may tag it under the contract (<b>Teacher Late Class Video Submission</b>, penalty from POLICY).</div>'",
"'Uploading it now still saves it to the student\\'s folder and DAILY, but it is recorded as a <b>late video</b> and a <b>Late Class Video case (Unexcused)</b> is added at once under the contract, with the penalty from POLICY deducted from your pay. Management reviews it the next day and may waive it if there was a valid reason.</div>'"
],
[
"'<div class=\"small\" style=\"color:#9A3B22;margin:2px 0 8px\">Due by 23:59 on the class day · these are now <b>late</b> and count as late videos in your class record (contract: Teacher Late Class Video Submission).</div>'",
"'<div class=\"small\" style=\"color:#9A3B22;margin:2px 0 8px\">Due by 23:59 on the class day · uploading now adds a <b>Late Class Video case</b> (contract: Teacher Late Class Video Submission · penalty from POLICY).</div>'"
],
[
"const lateTxt = window.vidLate && vidLate(c) ? '<div class=\"small\" style=\"margin-top:4px;font-weight:700\">Uploaded late (due 23:59 on the class day) · recorded as a late video · management may tag it under the contract</div>' : '';",
"const lc = d && d.late && d.late.caseId ? d.late : null;\n      const lateTxt = lc ? '<div class=\"small\" style=\"margin-top:4px;font-weight:700\">Uploaded late · case ' + esc(lc.caseId) + (lc.amount ? ' · −₱' + esc(lc.amount) : '') + ' (Late Class Video · Unexcused) · management reviews it tomorrow</div>'\n        : window.vidLate && vidLate(c) ? '<div class=\"small\" style=\"margin-top:4px;font-weight:700\">Uploaded late (due 23:59 on the class day) · recorded as a late video</div>' : '';"
]
]);
