// 22 Oct · Misty ("make it fit"): the printed contract keeps the signatures and the notary's Acknowledgment each on one page
// (no lone "Notary Public" on a last page), A4 with our own margins so the browser's date/title header does not print over the text,
// slightly smaller print text, and the per-page signature footer inside the margin.
require('../tools/lib.js')(process.argv[2], [
[`.pg>tbody>tr>td,.pg>tfoot>tr>td{padding:0;border:0}.pf{display:none}@page{margin:14mm 14mm 10mm}@media print{.pf{display:flex;position:fixed;left:0;right:0;bottom:0;`,
 `.pg>thead>tr>td,.pg>tbody>tr>td,.pg>tfoot>tr>td{padding:0;border:0}.keep{break-inside:avoid;page-break-inside:avoid}.sh{height:0}.pf{display:none}@page{size:A4;margin:0}@media print{body{max-width:none;margin:0;padding:0 16mm;font-size:12.5px;line-height:1.5}h2{font-size:18px}h3{font-size:14px;margin-top:14px}.sh{height:12mm}.pf{display:flex;position:fixed;left:16mm;right:16mm;bottom:7mm;`],
[`.sp{height:0}@media print{.sp{height:24mm}}</style></head><body><table class="pg"><tbody><tr><td>`,
 `.sp{height:0}@media print{.sp{height:26mm}}</style></head><body><table class="pg"><thead><tr><td><div class="sh"></div></td></tr></thead><tbody><tr><td>`],
[`'<h3>Signatures</h3><table><tr>'`, `'<div class="keep"><h3>Signatures</h3><table><tr>'`],
[`'<h3>Acknowledgment</h3><p>REPUBLIC OF THE PHILIPPINES )`, `'</div><div class="keep"><h3>Acknowledgment</h3><p>REPUBLIC OF THE PHILIPPINES )`],
[`Notary Public</p></td></tr></tbody>`, `Notary Public</p></div></td></tr></tbody>`],
]);
