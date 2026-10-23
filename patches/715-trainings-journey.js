// 715: (Misty) Trainings redesigned in the same design language as Growth / Overview (white sections with the teal dash heading,
// KPI tiles with a coloured left edge, the Growth-style milestone line). Teacher: "journey" line Hired → Master with what each rank
// needs, 4 KPI tiles (units to next rank · trainings done · qualified to teach · teacher trainer/self-study), Next step card,
// then My path + What I can teach / I train teachers in / Coaching / Self-study. Latest achievement is celebrated.
// Management: counters become KPI tiles; all Trainings cards match the app's sections.
const fs = require('fs'), f = process.argv[2]; let s = fs.readFileSync(f, 'utf8');
const A = "  function paintMy(){ const v = $('v-train')", B = "\n  function teachCard(";
const i = s.indexOf(A), j = s.indexOf(B, i);
if(i < 0 || j < 0 || s.indexOf(A, i + 1) >= 0){ console.error('paintMy anchors'); process.exit(1); }
const NEW = String.raw`  function paintMy(){ const v = $('v-train'); if(!v || !MY) return; const d = MY, who = d.me, R = myRank() || { ix: 0, rank: 'Newly Hired', life: 0, next: null };
    const L = statusList(d, who, R.ix), done = L.filter(x => x.st === 'done').length, nx = L.find(x => x.st === 'next');
    const units = R.next ? (R.next.units != null ? +R.next.units : (+R.life || 0) + (+R.next.need || 0)) : 0, life = Math.round((+R.life || 0) * 10) / 10, pct = R.next ? Math.min(100, Math.round(life / Math.max(1, units) * 100)) : 100;
    const ses = nx && (d.sessions || []).find(s => s.training_id === nx.t.id && s.status === 'scheduled' && new Date(s.starts_at).getTime() > Date.now() - 3 * 3600e3);
    const P = nx ? partsOf(d, nx.t.id) : [], pd = P.filter(p => partDone(d, who, p)).length;
    const CU = L.filter(x => x !== nx && x.st !== 'done' && x.st !== 'lock' && x.t.id !== 'spec' && x.t.id !== 'way' && x.gi <= R.ix);
    const U = (d.trainings || []).filter(t => t.kind === 'unlock').sort((x, y) => x.sort - y.sort), okU = t => ['done', 'excused'].includes((latestRec(d.records, who, t.id) || {}).status), QN = U.filter(okU).length;
    const TR = TRN(d, who), M = partsOf(d, 'model').filter(p => p.video_path), tt = id => ((d.trainings || []).find(t => t.id === id) || {}).title || '';
    const last = (d.records || []).filter(r => r.teacher === who && r.status === 'done' && r.done_at && r.training_id !== 'coach' && r.training_id !== 'facil').sort((a, b) => Date.parse(b.done_at) - Date.parse(a.done_at))[0];
    const fresh = last && Date.now() - Date.parse(last.done_at) < 14 * 864e5;
    let h = '<div class="tx tx4"><div class="lead"><h1>Trainings</h1><div class="mute small">Your training journey · what unlocks your next rank and the books you can teach</div></div>';
    /* journey line, Growth style */
    const n = RANKS.length - 1, ix = Math.max(0, R.ix);
    h += '<div class="gj59 tx-jr" style="--rc:' + (RC[R.rank] || '#00A3AD') + '"><div class="top"><b>' + e(R.rank || 'Newly Hired') + '</b><span>' + done + ' of ' + L.length + ' trainings done' + (R.next ? ' · ' + Math.max(0, Math.round((units - life) * 10) / 10).toLocaleString() + ' units to ' + e(R.next.name) : ' · top rank') + '</span></div>'
      + '<div class="ln" style="--nx:' + ((n - ix) / n * 100) + '%">' + RANKS.map((rk, k) => { const T = L.filter(x => x.gi === k), dn = T.filter(x => x.st === 'done').length;
        const cls = k === 0 ? ' f' : k === n ? ' l' : '', sub = k < ix ? (dn === T.length ? '✓ done' : dn + '/' + T.length + ' done') : k === ix ? 'you are here' : T.length ? T.length + ' training' + (T.length > 1 ? 's' : '') : '';
        return '<div class="ms' + cls + (k > ix ? ' nx' : '') + '" style="left:' + (k / n * 100) + '%;--c:' + (k <= ix ? (RC[rk] || '#00A3AD') : '#C9C6D6') + '"><i></i><b>' + e(RS[rk] || rk) + '</b><span>' + sub + '</span></div>'; }).join('') + '</div>'
      + (fresh ? '<div class="tx-yay"><b>Well done!</b> ' + e(tt(last.training_id)) + ' recorded ' + e(fmtD(last.done_at)) + '</div>' : '') + '</div>';
    /* KPI tiles */
    const bar = (p, c) => '<span class="tx-kb"><i style="width:' + Math.max(0, Math.min(100, p)) + '%;background:' + c + '"></i></span>';
    h += '<div class="gr-kpi tx-kpi">'
      + '<div class="stat"><b class="num">' + pct + '%</b>' + bar(pct, '#00A3AD') + '<span>' + (R.next ? 'of the units for ' + e(R.next.name) : 'top rank reached') + '</span><em>' + life.toLocaleString() + (R.next ? ' of ' + Math.round(units).toLocaleString() : '') + ' units</em></div>'
      + '<div class="stat"><b class="num">' + done + '<small>/' + L.length + '</small></b>' + bar(done / Math.max(1, L.length) * 100, '#6C5FC7') + '<span>mandatory trainings done</span><em>' + (CU.length ? CU.length + ' not recorded yet' : 'all caught up') + '</em></div>'
      + '<div class="stat"><b class="num">' + QN + '<small>/' + U.length + '</small></b>' + bar(QN / Math.max(1, U.length) * 100, '#E7A65A') + '<span>qualified to teach</span><em>books &amp; specializations</em></div>'
      + (TR.length ? '<div class="stat"><b class="num">' + TR.length + '</b>' + bar(100, '#D67FA3') + '<span>teacher trainer</span><em>' + e(TR.slice(0, 3).join(', ')) + (TR.length > 3 ? ' …' : '') + '</em></div>'
        : '<div class="stat"><b class="num">' + M.length + '</b>' + bar(M.length ? 100 : 0, '#D67FA3') + '<span>self-study lessons</span><em>free model lessons to watch</em></div>') + '</div>';
    /* next step */
    if(nx || CU.length){ h += '<section class="sec tx-next"><h2>Next step <span class="c">' + (nx ? (nx.gi > ix ? 'unlocks ' + e(RANKS[nx.gi] || '') : 'catch-up') : 'catch-up') + '</span></h2>';
      if(nx) h += '<div class="tx-nx"><div class="grow"><b>' + e(nx.t.title) + '</b><span>' + (ses ? e(fmtDT(ses.starts_at)) + (ses.facilitator ? ' · with ' + e(tName(ses.facilitator)) : '') : nx.t.id === 'way' ? pd + ' of ' + P.length + ' parts done · watch in the app' : 'Live training · management will set the date') + '</span></div>'
        + (ses && ses.meet_url ? '<a class="btn teal" href="' + e(ses.meet_url) + '" target="_blank" rel="noopener">Join</a>' : '<button class="btn teal" onclick="trOpen(\'' + nx.t.id + '\')">' + (nx.t.id === 'way' ? (pd ? 'Continue' : 'Start') : 'Details') + '</button>') + '</div>';
      if(CU.length) h += '<div class="tx-cu"><span>Also not recorded yet</span>' + CU.map(x => '<button type="button" onclick="trOpen(\'' + x.t.id + '\')">' + e(x.t.title) + '</button>').join('') + '</div>';
      h += '</section>'; }
    h += '<div class="tx-grid"><section class="tx-card"><div class="tx-h"><b>My path</b><span>climb from the bottom · tap a training for details</span></div>' + ladderHtml(d, who, R) + '</section>'
      + '<aside>' + ((window._trBooksH = '<div class="tx"><h1>Books &amp; specializations</h1><div class="mute small">✓ = qualified to teach · tap one for its training</div><div class="tx-card" style="margin-top:12px">' + ['Phonics', 'Reading', 'Oxford Discover', 'Adults', 'Books', 'Specializations', 'Trial classes'].filter(g => U.some(t => BG(t) === g)).map(g => '<div class="tx-tg"><span style="background:' + BGC[g] + '"></span>' + g + '</div><div class="tx-tiles">' + U.filter(t => BG(t) === g).map(t => '<button type="button" class="' + (okU(t) ? 'ok' : '') + '" onclick="trOpen(\'' + t.id + '\')">' + (okU(t) ? '✓ ' : '') + e(t.id === 'trial' ? 'Trial classes' : t.title.split(' · ')[0].replace(/ Specialization$/, '').replace(/^Phonics Training$/, 'Phonics')) + uSt(d, who, t) + '</button>').join('') + '</div>').join('') + '</div></div>'), '')
      + teachCard(d, who) + trainCard(d, who) + coachCard(d, who) + '<section class="tx-card"><div class="tx-h"><b>Self-study</b><span>free</span></div>' + (M.length ? M.map(p => partRow(d, who, p)).join('') : '<div class="small mute">Videos of our best classes will appear here.</div>') + '</section></aside></div></div>';
    if(v._h !== h){ v.innerHTML = h; v._h = h; } }`;
s = s.slice(0, i) + NEW + s.slice(j);
fs.writeFileSync(f, s);
require('../tools/lib.js')(f, [
[".tx-card{background:var(--card,#fff);border:1px solid var(--line);border-radius:20px;padding:18px 20px}",
 `.tx-card{background:#fff;border:1px solid rgba(236,234,241,.8);border-radius:18px;box-shadow:var(--sh1,0 1px 2px rgba(43,34,83,.04),0 10px 28px -16px rgba(43,34,83,.16));padding:16px 18px 18px}
.tx-h b:before{content:'';display:inline-block;width:14px;height:3px;border-radius:2px;background:linear-gradient(135deg,#00AEB5,#008E9C);vertical-align:middle;margin:-2px 8px 0 0}
.tx4 .gj59{box-shadow:var(--sh1,0 1px 2px rgba(43,34,83,.04),0 10px 28px -16px rgba(43,34,83,.16));border-radius:18px;padding:14px 20px 10px;margin:14px 0 0}
.tx4 .gj59 .ln{margin:6px 30px 0}.tx-yay{margin:6px 0 4px;padding:8px 12px;border-radius:12px;background:linear-gradient(90deg,#EEF8F7,#FBF7EE);font-size:13px;color:#2B2253}.tx-yay b{color:#00737B;margin-right:4px}
.tx-kpi{margin-top:14px}.tx-kpi .stat{background:#fff}.tx-kpi .stat b.num{font-family:"Fredoka One",Fredoka,sans-serif;font-weight:400;color:var(--c53,#00A3AD)}.tx-kpi .stat b.num small{font-size:15px;color:#9A97AE;margin-left:1px}
.tx-kb{display:block;height:6px;border-radius:99px;background:#EEEDF3;margin:6px 0 6px;overflow:hidden}.tx-kb i{display:block;height:100%;border-radius:99px}
.tx-kpi .stat:nth-child(3){--c53:#C98A2E}.tx-kpi .stat:nth-child(4){--c53:#C2588A}
section.sec.tx-next{margin-top:14px}.tx-nx{display:flex;align-items:center;gap:14px;padding:12px 14px;border-radius:14px;background:linear-gradient(90deg,#F2FBFA,#fff);border:1px solid #DDF2F0}
.tx-nx b{display:block;font-family:"Fredoka One",Fredoka,sans-serif;font-weight:400;font-size:19px;color:var(--ink)}.tx-nx span{font-size:12.5px;color:#5E5A75}
.tx-cu{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:10px}.tx-cu span{font-size:12px;color:#77738C;margin-right:2px}.tx-cu button{font:inherit;font-size:12.5px;font-weight:700;border:1.5px dashed #D9D7E3;background:#fff;color:#5E5A75;border-radius:99px;padding:4px 10px;cursor:pointer}.tx-cu button:hover{border-color:#00A3AD;color:#00737B}
.tx4 .tx-grid{margin-top:14px}
@media(max-width:620px){.tx4 .gj59 .ln{margin:6px 14px 0}.tx4 .gj59 .ms span{display:none}.tx4 .gj59 .ms b{font-size:10.5px}.tx-nx{flex-wrap:wrap}}`],
[".tx-cnt{font:inherit;text-align:left;background:var(--card,#fff);border:1px solid var(--line);border-radius:18px;padding:14px 16px;cursor:pointer;color:var(--ink)}",
 `.tx-cnt{font:inherit;text-align:left;background:#fff;border:1px solid var(--line);border-left:4px solid var(--c53,#00A3AD);border-radius:22px;padding:12px 16px;cursor:pointer;color:var(--ink);box-shadow:0 1px 2px rgba(45,42,74,.05),0 4px 14px rgba(45,42,74,.05)}
.tx-cnt b{color:var(--c53,#00A3AD)}.tx-cnts .tx-cnt:nth-child(2){--c53:#6C5FC7}.tx-cnts .tx-cnt:nth-child(3){--c53:#C2483A}.tx-cnts .tx-cnt:nth-child(4){--c53:#C98A2E}.tx-cnt:hover{box-shadow:0 2px 4px rgba(45,42,74,.08),0 8px 20px rgba(45,42,74,.08)}`],
]);
