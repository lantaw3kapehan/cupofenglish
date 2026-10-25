// 822: PAY tab view (821) fits a laptop screen: the status column was cut off on the right and Print / PDF sat under the ✕.
// · Status shows "✓ Oct 9" (paid date) instead of "✓ Paid Oct 9 …"; columns a little tighter; the Print button moves clear of the ✕.
require('../tools/lib.js')(process.argv[2], [
  ["if(/^paid/i.test(c) || (p && !c)) return '<span class=\"pt-chip ok\">✓ ' + esc(c || 'Paid') + '</span>';",
   "if(/^paid/i.test(c) || (p && !c)) return '<span class=\"pt-chip ok\" title=\"' + esc(c) + '\">✓ ' + esc(c.replace(/^paid\\s*/i, '') || 'Paid') + '</span>';"],
  ["'.pt-w th{font-size:10.5px;letter-spacing:.06em;text-transform:uppercase;color:#8A86A0;background:#FAFAFC;padding:9px 10px;",
   "'.pt-h{padding-right:44px}.pt-w th{font-size:10px;letter-spacing:.05em;text-transform:uppercase;color:#8A86A0;background:#FAFAFC;padding:9px 7px;"],
  ["'.pt-w td{padding:8px 10px;", "'.pt-w td{padding:8px 7px;"],
  ["'.pt-w table{width:100%;border-collapse:collapse;font-size:13.5px;", "'.pt-w table{width:100%;border-collapse:collapse;font-size:13px;"]
]);
