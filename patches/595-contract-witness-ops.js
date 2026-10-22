// 22 Oct · Misty: both witnesses on the printable contract are from CupOfEnglish Operations (e.g. the Operations Coordinator).
require('../tools/lib.js')(process.argv[2], [
[`'<h3>Signed in the presence of</h3>' + line('', '') + '<table><tr><td>Witness</td><td style="width:40px"></td><td>Witness</td></tr></table>'`,
 `'<h3>Signed in the presence of</h3>' + line('', '') + '<table><tr><td>Witness · Signature over printed name<br><small>Operations, CupOfEnglish</small></td><td style="width:40px"></td><td>Witness · Signature over printed name<br><small>Operations, CupOfEnglish</small></td></tr></table>'`],
]);
