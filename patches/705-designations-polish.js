// 705: (Misty) Polish: on her own Trainings page the card shows only the two designation rows (name and rank are already in the header);
// labels line up; "Teacher trainer" pills are soft filled teal (a role) vs outlined "Qualified to teach" (a qualification);
// header pills ★ and Trainer are the same size, Trainer with a small cap icon.
require('../tools/lib.js')(process.argv[2], [
["h += profHtml(d, who, R.rank);", "h += profHtml(d, who, R.rank, 1);"],
["function profHtml(d, who, rank){", "function profHtml(d, who, rank, own){"],
["return '<div class=\"tx-prof\">", "return '<div class=\"tx-prof' + (own ? ' own' : '') + '\">"],
["'<span style=\"--c:#00737B;background:#EEF8F7\" title=\"Facilitates this training\">'", "'<span class=\"trn\" title=\"Facilitates this training\">'"],
[">Trainer</button>');", "><svg width=\"11\" height=\"11\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M22 10 12 5 2 10l10 5 10-5z\"/><path d=\"M6 12v5c3 2 9 2 12 0v-5\"/></svg>Trainer</button>');"],
["'#txTrn{border:1.5px solid #00A3AD;background:#EEF8F7;color:#00626A;font:inherit;font-weight:700;font-size:12px;border-radius:99px;padding:1px 8px;margin-left:6px;cursor:pointer;vertical-align:1px}#txStar{border:1.5px solid #D67FA3;background:#FBEFF4;color:#8A3B6A;font:inherit;font-weight:700;font-size:12px;border-radius:99px;padding:1px 8px;margin-left:6px;cursor:pointer;vertical-align:1px}'",
 "'#txTrn,#txStar{display:inline-flex;align-items:center;gap:4px;height:22px;box-sizing:border-box;font:inherit;font-weight:700;font-size:12px;line-height:1;border-radius:99px;padding:0 9px;margin-left:6px;cursor:pointer;vertical-align:middle}#txTrn{border:1.5px solid #00A3AD;background:#EEF8F7;color:#00626A}#txStar{border:1.5px solid #D67FA3;background:#FBEFF4;color:#8A3B6A}'"],
[".tx-bl{", ".tx-prof.own{padding:14px 18px}.tx-prof.own .tx-av,.tx-prof.own .tx-pn{display:none}.tx-prof.own .tx-pn + .tx-bdg{margin-top:0}\n.tx-prof .tx-bl{min-width:132px}.tx-bdg span.trn{background:#DDF2F0;border-color:#DDF2F0;color:#00626A}\n@media(max-width:620px){.tx-prof .tx-bl{min-width:0;width:100%}}\n.tx-bl{"],
]);
