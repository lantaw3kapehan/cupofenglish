// 14 Oct night · Renewal card in steps, like the trial card (Misty: "will it be similar to renewal as well?").
// 1 Remind the parent (Copy reminder · ✓ Reminder sent; lessons left and deadline) · 2 What did the parent say?
// (Renewing · Paused · Not renewing, note, Save / Save note only) · 3 Record the payment (Renewed · paid, or ✓ Renewed
// with "Record another payment") · 4 Send the parent the new package (renewal picture, class notice, agreement) · History.
// Same card from To do and from the student page. The code is in 129-renewal-card-steps.inc.
const inc = require('fs').readFileSync(require('path').join(__dirname, '129-renewal-card-steps.inc'), 'utf8');
require('../tools/lib.js')(process.argv[2], [
["const renRow = x => { const r = x.r, i = TDC.push(x.rem) - 1,",
 "const renRow = x => { const r = x.r, i = TDC.push(x.rem) - 1, _rm = ((window.REMC = window.REMC || {})[String(r[1]).toUpperCase()] = x.rem),"],
["\n</script>\n\n</body>", "\n</script>\n<script>\n" + inc + "</script>\n\n</body>"],
]);
