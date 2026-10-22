// 22 Oct · Misty: one witness for both parties (signing is online): CupOfEnglish Operations signs once as witness.
require('../tools/lib.js')(process.argv[2], [
[`'<h3>Signed in the presence of</h3><table class="wl"><tr><td class="ln"></td><td class="gap"></td><td class="ln"></td></tr><tr><td>Witness · Signature over printed name<br><small>Operations, CupOfEnglish</small></td><td class="gap"></td><td>Witness · Signature over printed name<br><small>Second witness (another person present)</small></td></tr></table></div>'`,
 `'<h3>Witness</h3><table class="wl"><tr><td class="ln"></td><td class="gap"></td><td style="border:0"></td></tr><tr><td>Signature over printed name<br><small>Witness for both parties · Operations, CupOfEnglish</small></td><td class="gap"></td><td></td></tr></table></div>'`],
]);
