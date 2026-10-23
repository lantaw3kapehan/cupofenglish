// 712: (Misty) Trainings v3 (approved mock). Teacher page: next step first (with what is still not recorded), path on the left,
// "What I can teach" as one row per book group with a progress bar (replaces the wall of badges), "I train teachers in" card,
// coaching, self-study. Senior shows one line once a specialization is done. Header: no pills — one quiet line with a
// "Teacher trainer" link (line icon, no emoji) for trainers.
const CAP = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="vertical-align:-2px"><path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>';
require('../tools/lib.js')(process.argv[2], [
// teacher page: drop the badge card (the right column now says it), add "still not recorded"
["    h += profHtml(d, who, R.rank, 1).replace(/<\\/div><\\/div>$/, '<button type=\"button\" class=\"tx-all\" onclick=\"trBooks()\">All books &amp; specializations ›</button></div></div>');\n", ""],
["    const P = nx ? partsOf(d, nx.t.id) : [], pd = P.filter(p => partDone(d, who, p)).length;",
 "    const P = nx ? partsOf(d, nx.t.id) : [], pd = P.filter(p => partDone(d, who, p)).length;\n    const CU = L.filter(x => x !== nx && x.st !== 'done' && x.st !== 'lock' && x.t.id !== 'spec' && x.t.id !== 'way' && x.gi <= R.ix).map(x => e(x.t.title));"],
[": 'live training · management will set the date') : '') + '</div></div>'",
 ": 'live training · management will set the date') : '') + '</div>' + (CU.length ? '<div class=\"s2\">Also not recorded yet: ' + CU.join(' · ') + '</div>' : '') + '</div>'"],
// senior: one line once done
["            const one = (ok, id, t) =>",
 "            const DN = (d.trainings || []).filter(t => (t.id === 'inq' || /^spec-/.test(t.id)) && R0.some(r => r.training_id === t.id)).map(t => t.title.replace(/ Specialization$/, '')); if(DN.length) return '<button type=\"button\" class=\"tx-pill done\" onclick=\"trBooks()\"><span>✓ Specialization · ' + e(DN.join(', ')) + '</span></button>';\n            const one = (ok, id, t) =>"],
// right column
["+ coachCard(d, who) + '<section class=\"tx-card\"><div class=\"tx-h\"><b>Self-study</b>", "+ teachCard(d, who) + trainCard(d, who) + coachCard(d, who) + '<section class=\"tx-card\"><div class=\"tx-h\"><b>Self-study</b>"],
["  function partRow(d, who, p){", `  function teachCard(d, who){ const U = (d.trainings || []).filter(t => t.kind === 'unlock'), st = t => (latestRec(d.records, who, t.id) || {}).status, ok = t => ['done', 'excused'].includes(st(t));
    const nm = t => t.id === 'trial' ? 'Trial classes' : t.title.split(' · ')[0].replace(/ Specialization$/, '').replace(/^Phonics Training$/, 'Phonics');
    const rows = ['Phonics', 'Reading', 'Oxford Discover', 'Adults', 'Books', 'Specializations', 'Trial classes'].map(g => { const G = U.filter(t => BG(t) === g); if(!G.length) return '';
      const q = G.filter(ok).length, pc = Math.round(q / G.length * 100), sub = [];
      if(g === 'Specializations' && q) sub.push(G.filter(ok).map(t => '★ ' + e(nm(t))).join(' · '));
      [['further', 'needs more training', 'need more training'], ['completed', 'training completed', 'training completed'], ['assigned', 'in training', 'in training']].forEach(([s, one, many]) => { const W = G.filter(t => st(t) === s); if(W.length) sub.push(W.length > 2 ? W.length + ' ' + many : W.map(t => e(nm(t))).join(', ') + ' · ' + one); });
      return '<button type="button" class="tx-gr" onclick="trBooks()"><span class="nm">' + e(g) + '</span><span class="bar"><i style="width:' + pc + '%;background:' + (BGC[g] || '#00A3AD') + '"></i></span><span class="n' + (q ? '' : ' z') + '">' + (G.length === 1 ? (q ? '✓' : '—') : q + '/' + G.length) + '</span>' + (sub.length ? '<span class="sub">' + sub.join(' · ') + '</span>' : '') + '</button>'; }).join('');
    return '<section class="tx-card"><div class="tx-h"><b>What I can teach</b><button type="button" class="tx-all" style="margin:0" onclick="trBooks()">All ›</button></div>' + rows + '</section>'; }
  function trainCard(d, who){ const L = TRN(d, who); if(!L.length) return '';
    return '<section class="tx-card"><div class="tx-h"><b><span style="color:#00737B">${CAP.replace(/"/g, '\\"')}</span> I train teachers in</b></div><div class="tx-bdg" style="margin:0">' + L.map(x => '<span class="trn">' + e(x) + '</span>').join('') + '</div></section>'; }
  function partRow(d, who, p){`],
// css
[".tx-hero .s{font-size:13px;opacity:.82}", `.tx-hero .s{font-size:13px;opacity:.82}.tx-hero .s2{font-size:12.5px;opacity:.75;margin-top:8px}
.tx-gr{display:grid;grid-template-columns:118px 1fr 40px;gap:4px 10px;align-items:center;width:100%;text-align:left;border:0;border-bottom:1px solid #F3F2F7;background:none;padding:10px 0;font:inherit;font-size:13.5px;color:var(--ink);cursor:pointer}
.tx-gr:last-child{border-bottom:0}.tx-gr:hover .nm{color:#00737B}.tx-gr .bar{height:8px;border-radius:99px;background:#EEEDF3;overflow:hidden}.tx-gr .bar i{display:block;height:100%;border-radius:99px}
.tx-gr .n{text-align:right;font-weight:700;font-size:13px}.tx-gr .n.z{color:#9A97AE}.tx-gr .sub{grid-column:2/4;font-size:11.5px;color:#77738C;line-height:1.4}`],
// header: one quiet line
["><svg width=\"11\" height=\"11\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M22 10 12 5 2 10l10 5 10-5z\"/><path d=\"M6 12v5c3 2 9 2 12 0v-5\"/></svg>Trainer</button>');",
 "><svg width=\"12\" height=\"12\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\" aria-hidden=\"true\"><path d=\"M22 10 12 5 2 10l10 5 10-5z\"/><path d=\"M6 12v5c3 2 9 2 12 0v-5\"/></svg>Teacher trainer</button>');"],
["#txTrn{border:1.5px solid #00A3AD;background:#EEF8F7;color:#00626A}", "#txTrn{border:0;background:none;color:#00737B;padding:0;margin-left:2px;height:auto}#txTrn::before{content:\"·\";color:var(--ink2,#5E5A75);font-weight:400;margin-right:4px}#txStar{display:none!important}"],
]);
