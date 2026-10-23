// 694: (Misty) Path and books together, clearly: books are grouped by series — Phonics (Phonics Training, The Alphabet, Short Vowels,
// Long Vowels, Consonant Blends, Letter Combinations), Reading (Raz-Kids, Reading Explorer), Oxford Discover — and specializations
// (Inquiry-Based, YLE, IELTS, TOEFL, KET, PET) plus Trial classes are their own group. Management: three tabs Path · Books ·
// Specializations & trials, each with coloured group lines (centred labels). Teacher: "What I can teach" shows the same groups.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("  const RC = {", "  const BG = t => /^cw-(phonics|alphabet|shortvowels|longvowels|blends|lettercomb)$/.test(t.id) ? 'Phonics' : /^cw-(raz|re)$/.test(t.id) ? 'Reading' : /^cw-od/.test(t.id) ? 'Oxford Discover' : t.id === 'inq' || /^spec-/.test(t.id) ? 'Specializations' : t.id === 'trial' ? 'Trial classes' : 'Books';\n  const BGC = { 'Phonics': '#3CC8C0', 'Reading': '#E7A65A', 'Oxford Discover': '#5D8FD6', 'Specializations': '#D67FA3', 'Trial classes': '#8E7FD6', 'Books': '#9A97AE' };\n  const RC = {");
rep("const tab = window._trTab || 'path', U = (d.trainings || []).filter(t => t.kind === 'unlock').sort((a, b) => a.sort - b.sort), C = tab === 'path' ? M : U;",
    "const tab = ['path', 'books', 'spec'].includes(window._trTab) ? window._trTab : 'path', U = (d.trainings || []).filter(t => t.kind === 'unlock').sort((a, b) => a.sort - b.sort), C = tab === 'path' ? M : tab === 'books' ? U.filter(t => !['Specializations', 'Trial classes'].includes(BG(t))) : U.filter(t => ['Specializations', 'Trial classes'].includes(BG(t)));");
rep("const g = tab === 'path' ? (t.gate || '') : 'Books & trials';", "const g = tab === 'path' ? (t.gate || '') : BG(t);");
rep("<button class=\"' + (tab === 'unl' ? 'on' : '') + '\" onclick=\"window._trTab=\\'unl\\';paintTrAll()\">Books &amp; trials</button>",
    "<button class=\"' + (tab === 'books' ? 'on' : '') + '\" onclick=\"window._trTab=\\'books\\';paintTrAll()\">Books</button><button class=\"' + (tab === 'spec' ? 'on' : '') + '\" onclick=\"window._trTab=\\'spec\\';paintTrAll()\">Specializations &amp; trials</button>");
rep("'<th colspan=\"' + x.n + '\"><span style=\"border-color:' + (tab === 'path' ? RC[x.g] || 'var(--teal)' : 'var(--teal)') + '\">' + e(tab === 'path' ? (RS[x.g] || x.g) : x.g) + '</span></th>'",
    "'<th colspan=\"' + x.n + '\"><span style=\"border-color:' + (tab === 'path' ? RC[x.g] || 'var(--teal)' : BGC[x.g] || 'var(--teal)') + '\">' + e(tab === 'path' ? (RS[x.g] || x.g) : x.g) + '</span></th>'");
rep("<div class=\"tx-tiles\">' + U.map(t => '<button type=\"button\" class=\"' + (okU(t) ? 'ok' : '') + '\" onclick=\"trOpen(\\'' + t.id + '\\')\">' + (okU(t) ? '✓ ' : '') + e(t.id === 'trial' ? 'Trial classes' : t.title.split(' · ')[0].replace(/ Specialization$/, '')) + '</button>').join('') + '</div></section>'",
    "' + ['Phonics', 'Reading', 'Oxford Discover', 'Books', 'Specializations', 'Trial classes'].filter(g => U.some(t => BG(t) === g)).map(g => '<div class=\"tx-tg\"><span style=\"background:' + BGC[g] + '\"></span>' + g + '</div><div class=\"tx-tiles\">' + U.filter(t => BG(t) === g).map(t => '<button type=\"button\" class=\"' + (okU(t) ? 'ok' : '') + '\" onclick=\"trOpen(\\'' + t.id + '\\')\">' + (okU(t) ? '✓ ' : '') + e(t.id === 'trial' ? 'Trial classes' : t.title.split(' · ')[0].replace(/ Specialization$/, '')) + '</button>').join('') + '</div>').join('') + '</section>'");
rep(".tr-chips{", ".tx-tg{display:flex;align-items:center;gap:6px;font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:#77738C;margin:12px 0 6px}.tx-tg:first-of-type{margin-top:0}.tx-tg span{width:10px;height:3px;border-radius:3px}\n.tx-tb tr.g th,.tx-tb tr.g th span{text-align:center!important}\n.tr-chips{");
const sh = "trial: 'Trials', 'spec-yle': 'YLE',";
rep(sh, "trial: 'Trials', 'cw-alphabet': 'Alphabet', 'cw-shortvowels': 'Short V.', 'cw-longvowels': 'Long V.', 'cw-blends': 'Blends', 'cw-lettercomb': 'Letter C.', 'cw-raz': 'Raz-Kids', 'spec-yle': 'YLE',");
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
