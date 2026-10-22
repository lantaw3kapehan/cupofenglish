// 22 Oct · Misty: on the printed contract every page carries the signatures of the President and the Independent Contractor,
// so no page can be added or swapped later. A footer repeats on each printed page with both signatures from the app,
// the document name, version and fingerprint, and lines for initials in ink before the notary.
require('../tools/lib.js')(process.argv[2], [
[`p.ct-ai{padding-left:18px;text-indent:-18px}</style></head><body>' +`,
 `p.ct-ai{padding-left:18px;text-indent:-18px}.pg{width:100%;border-collapse:collapse;table-layout:auto}.pg>tbody>tr>td,.pg>tfoot>tr>td{padding:0;border:0}.pf{display:none}@page{margin:14mm 14mm 10mm}@media print{.pf{display:flex;position:fixed;left:0;right:0;bottom:0;gap:14px;align-items:flex-end;justify-content:space-between;border-top:1px solid #999;padding-top:4px;background:#fff;font-size:9px;color:#444}.pf img{height:26px;display:block}.pf .b{min-width:150px}.pf .l{border-bottom:1px solid #333;height:26px}}.sp{height:0}@media print{.sp{height:24mm}}</style></head><body><table class="pg"><tbody><tr><td>' +`],
[`Notary Public</p></body></html>'`,
 `Notary Public</p></td></tr></tbody><tfoot><tr><td><div class="sp"></div></td></tr></tfoot></table>' +
        '<div class="pf"><div class="b">' + (r.sig ? '<img src="' + r.sig + '" alt="">' : '<div class="l"></div>') + e(r.typed_name || r.teacher) + ' · Independent Contractor</div>' +
        '<div style="text-align:center;flex:1">' + e(d.title.split(' · ')[0]) + ' v' + e(d.version) + ' · ' + e(String(r.filled_hash || d.hash).slice(0, 12)) + '<br>Each page is signed by both parties</div>' +
        '<div class="b" style="text-align:right">' + (r.pres_sig ? '<img src="' + r.pres_sig + '" alt="" style="margin-left:auto">' : '<div class="l"></div>') + e(r.pres_name || 'Misty T. Dagyapen') + ' · President</div></div></body></html>'`],
]);
