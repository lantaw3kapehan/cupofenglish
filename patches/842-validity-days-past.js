// 842: "Validity ended … extended N days" → "Validity ended … N days past" (audit #13).
// Verified: the number is today − the package's Deadline Date (ACTIVE › Deadline Date, or To do › DEADLINE), shown while
// lessons are left. Nothing in ACTIVE or the app records an approved extension (no extension column, no approval step),
// so "extended" read as if an extension had been granted. Wording only: same rule, same days, same places.
// · class cards, Students list, student page, To do renewals: "Validity ended 30 Oct · 12 days past · lessons left"
// · the Students list "Valid until" column keeps its "+12 days past" (its parser accepts the old and the new wording).
// The parent-facing lesson summary picture line is a separate patch (843) so it can be decided on its own.
require('../tools/lib.js')(process.argv[2], [
  ["title=\"Package end date passed · classes continue\">Validity ended ${tdDate(x.dl)} · extended ${-x.dlN} day${x.dlN === -1 ? '' : 's'}</span>",
   "title=\"The package's deadline date was ${tdDate(x.dl)} · ${-x.dlN} day${x.dlN === -1 ? '' : 's'} have passed since · classes continue while lessons are left · this is not an approved extension\">Validity ended ${tdDate(x.dl)} · ${-x.dlN} day${x.dlN === -1 ? '' : 's'} past</span>"],
  ["const chip = v => `<span class=\"vn\" title=\"Validity ended ${fmt(v.dl)} · classes continue · extended ${v.days} day${v.days === 1 ? '' : 's'} so far\"><i></i>Validity ended ${fmt(v.dl)} · extended ${v.days} day${v.days === 1 ? '' : 's'}</span>`;",
   "const chip = v => `<span class=\"vn\" title=\"Package deadline date (ACTIVE) was ${fmt(v.dl)} · ${v.days} day${v.days === 1 ? '' : 's'} have passed since · lessons are still left, so classes continue · not an approved extension\"><i></i>Validity ended ${fmt(v.dl)} · ${v.days} day${v.days === 1 ? '' : 's'} past · lessons left</span>`;"],
  ["const t = vn.textContent.match(/ended\\s+([^·]+)·\\s*extended\\s+(\\d+)/i);",
   "const t = vn.textContent.match(/ended\\s+([^·]+)·\\s*(?:extended\\s+)?(\\d+)/i);"]
]);
