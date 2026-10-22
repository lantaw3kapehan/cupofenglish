// 22 Oct · Misty: in the printable contract, the Acknowledgment has only the notary's signature — the Independent Contractor
// and the President already sign above. The parties are listed with their ID (competent evidence of identity) for the notary to fill.
require('../tools/lib.js')(process.argv[2], [
["which they signed electronically in the App on the dates stated above and confirm by their signatures below, and declared",
 "which they signed electronically in the App on the dates stated above and signed before me, and declared"],
[`line(e(r.typed_name || ''), e(r.pres_name || 'Misty T. Dagyapen')) + '<table><tr><td>Independent Contractor · ID ____________</td><td style="width:40px"></td><td>President · ID ____________</td></tr></table>' +`,
 `'<table class="ct-t" style="margin-top:6px"><thead><tr><th>Name</th><th>Competent evidence of identity</th><th>Date and place issued</th></tr></thead><tbody><tr><td>' + e(r.typed_name || '') + '<br><small>Independent Contractor</small></td><td></td><td></td></tr><tr><td>' + e(r.pres_name || 'Misty T. Dagyapen') + '<br><small>President, CupOfEnglish Online Tutorial Services OPC</small></td><td></td><td></td></tr></tbody></table>' +
        '<p style="margin-top:16px">WITNESS MY HAND AND SEAL on the date and place first written above.</p>' +`],
]);
