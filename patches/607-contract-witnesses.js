// 22 Oct · Misty: the same person cannot be both witnesses. Witness 1 is CupOfEnglish Operations; witness 2 is any other adult
// present at the signing who is not a party (often someone at the notary's office).
require('../tools/lib.js')(process.argv[2], [
[`<td>Witness · Signature over printed name<br><small>Operations, CupOfEnglish</small></td><td class="gap"></td><td>Witness · Signature over printed name<br><small>Operations, CupOfEnglish</small></td>`,
 `<td>Witness · Signature over printed name<br><small>Operations, CupOfEnglish</small></td><td class="gap"></td><td>Witness · Signature over printed name<br><small>Second witness (another person present)</small></td>`],
]);
