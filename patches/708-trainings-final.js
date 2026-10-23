// 708: (Misty) Final QA + relayout of Trainings.
// Teacher: one designations card at the top — Qualified to teach · Working on (in training / completed / further, with status) · Teacher trainer —
//   and "All books & specializations ›" opens the full grouped list (it was a very long right column repeating the same badges).
//   The page is now hero → path (wide) + aside (coaching, self-study), balanced.
// Management: same card in a teacher's sheet; title row wraps neatly on narrow screens; Quick tick gets its own toolbar row;
//   the table uses more of the screen height before scrolling inside.
require('../tools/lib.js')(process.argv[2], [
// working-on row in the card
["(D0.length || TRN(d, who).length ?", "(D0.length || TRN(d, who).length || WK(d, who).length ?"],
["+ '</div>' + (TRN(d, who).length ? ", "+ '</div>' + (WK(d, who).length ? '<div class=\"tx-bdg\"><b class=\"tx-bl\">Working on:</b>' + WK(d, who).map(x => '<span class=\"wk\" style=\"--c:' + x[2] + '\">' + e(x[0]) + ' <small>' + e(x[1]) + '</small></span>').join('') + '</div>' : '') + (TRN(d, who).length ? "],
["  function profHtml(d, who, rank, own){", `  function WK(d, who){ return (d.trainings || []).filter(t => t.kind === 'unlock').sort((a, b) => a.sort - b.sort).map(t => { const r = latestRec(d.records, who, t.id), s = r && r.status !== 'done' && UST[r.status];
      return s ? [t.id === 'trial' ? 'Trial classes' : t.title.split(' · ')[0].replace(/ Specialization$/, '').replace(/^Phonics Training$/, 'Phonics'), s[0].replace('Requires further training', 'Further training'), s[1]] : null; }).filter(Boolean); }
  function profHtml(d, who, rank, own){`],
// own page: card gets the "all books" link; the long aside list moves into a sheet
["h += profHtml(d, who, R.rank, 1);", "h += profHtml(d, who, R.rank, 1).replace(/<\\/div><\\/div>$/, '<button type=\"button\" class=\"tx-all\" onclick=\"trBooks()\">All books &amp; specializations ›</button></div></div>');"],
["'<aside><section class=\"tx-card\"><div class=\"tx-h\"><b>What I can teach</b></div>' +", "'<aside>' + ((window._trBooksH = '<div class=\"tx\"><h1>Books &amp; specializations</h1><div class=\"mute small\">✓ = qualified to teach · tap one for its training</div><div class=\"tx-card\" style=\"margin-top:12px\">' +"],
["'</div>').join('') + '</section>'", "'</div>').join('') + '</div></div>'), '')"],
["  window.trView = async function(name){", "  window.trBooks = () => openSheet(window._trBooksH || '<div class=\"empty\">Open Trainings first.</div>');\n  window.trView = async function(name){"],
// quick tick toolbar on its own row
["return '<div class=\"tx-brush\">' + (b ?", "return '<div class=\"tx-brush' + (b ? ' full' : '') + '\">' + (b ?"],
// css
["\n.tx-bl{font-size:12px;", `.tx-bdg span.wk{border-style:dashed;color:#2B2253}.tx-bdg span.wk small{font-size:10.5px;color:var(--c);margin-left:2px}
.tx-all{display:inline-block;margin-top:10px;border:0;background:none;padding:0;font:inherit;font-size:13px;font-weight:700;color:#00737B;cursor:pointer}.tx-all:hover{text-decoration:underline}
.tx .lead > .grow{min-width:min(100%,260px)}
.tx-brush.full{width:100%;order:3;padding:10px 12px;background:#F6F5FA;border-radius:14px}.tx-brush.full button.qt{margin-left:auto}
.tx-tb{max-height:calc(100vh - 150px)!important;min-height:300px}
.tx-bl{font-size:12px;`],
]);
