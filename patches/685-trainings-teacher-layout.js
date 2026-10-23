// 685: (Misty) Teacher Trainings screen — cleaner layout. On a laptop: left = my rank (units bar + trainings still needed), next
// training, what I can teach (tiles), self-study; right = my path in a card ("start at the bottom, climb to Master"). Phones: stacked.
// "Catch up" → "Not recorded yet" (softer dashed circles). Specialization (now the Senior Teacher step) counts as done when any
// specialization (IELTS/TOEFL/KET/PET/YLE/Inquiry-Based) is ticked.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
rep("  const latestRec = (recs, t, id) => { let r = null; (recs || []).forEach(x => { if(x.teacher === t && x.training_id === id) r = x; }); return r; };",
    "  const latestRec0 = (recs, t, id) => { let r = null; (recs || []).forEach(x => { if(x.teacher === t && x.training_id === id) r = x; }); return r; };\n" +
    "  const latestRec = (recs, t, id) => { const r = latestRec0(recs, t, id); if(id !== 'spec' || (r && r.status === 'done')) return r; let z = null; (recs || []).forEach(x => { if(x.teacher === t && x.status === 'done' && (x.training_id === 'inq' || /^spec-/.test(x.training_id))) z = x; }); return z ? Object.assign({}, z, { training_id: 'spec', via: z.via }) : r; };");
rep("x.st === 'open' && x.gi <= R.ix && x.t.id !== 'way' ? 'Catch up'", "x.st === 'open' && x.gi <= R.ix && x.t.id !== 'way' ? 'Not recorded yet'");
const A = "  function paintMy(){ const v = $('v-train'); if(!v || !MY) return;", Z = "  function partRow(";
const i = s.indexOf(A), j = s.indexOf(Z); if (i < 0 || j < i) { console.error('paintMy'); process.exit(1); }
s = s.slice(0, i) + `  function paintMy(){ const v = $('v-train'); if(!v || !MY) return; const d = MY, who = d.me, R = myRank() || { ix: 0, rank: 'Newly Hired', life: 0, next: null };
    const L = statusList(d, who, R.ix), done = L.filter(x => x.st === 'done').length, nx = L.find(x => x.st === 'next');
    const units = R.next ? (R.next.units != null ? +R.next.units : (+R.life || 0) + (+R.next.need || 0)) : 0, life = Math.round((+R.life || 0) * 10) / 10;
    const needT = R.next ? L.filter(x => x.gi === R.ix + 1) : [];
    let a = '<div class="tr3-card"><div class="k">MY RANK</div><div class="tr3-rk">' + e(R.rank || '') + '</div>' + (R.next ? '<div class="small mute">Next: <b style="color:#2B2253">' + e(R.next.name) + '</b></div>'
      + '<div class="tr3-row"><span>Units</span><b>' + life.toLocaleString() + ' / ' + Math.round(units).toLocaleString() + '</b></div><div class="tr-bar" style="margin:4px 0 10px"><i style="width:' + Math.min(100, Math.round(life / Math.max(1, units) * 100)) + '%"></i></div>'
      + (needT.length ? '<div class="tr3-row"><span>Trainings</span><b>' + needT.filter(x => x.st === 'done').length + ' / ' + needT.length + '</b></div>' + needT.map(x => '<div class="tr3-need ' + (x.st === 'done' ? 'ok' : '') + '" onclick="trOpen(\\'' + x.t.id + '\\')"><i>' + (x.st === 'done' ? '✓' : '') + '</i>' + e(x.t.title) + '</div>').join('') : '<div class="small mute">No training needed for this step · units only</div>') : '<div class="small mute">Top rank · thank you for leading the team</div>')
      + '<div class="tr3-row" style="margin-top:12px;border-top:1px solid #F0EFF5;padding-top:10px"><span>All trainings</span><b>' + done + ' / ' + L.length + '</b></div></div>';
    if(nx){ const ses = (d.sessions || []).find(s => s.training_id === nx.t.id && s.status === 'scheduled' && new Date(s.starts_at).getTime() > Date.now() - 3 * 3600e3);
      const P = partsOf(d, nx.t.id), pd = P.filter(p => partDone(d, who, p)).length;
      a += '<div class="tr-next"><div class="grow"><div class="k">NEXT · MANDATORY</div><b>' + e(nx.t.title) + '</b><div class="small mute">' + (ses ? e(fmtDT(ses.starts_at)) + (ses.facilitator ? ' · ' + e(tName(ses.facilitator)) : '') : nx.t.id === 'way' ? pd + ' of ' + P.length + ' parts done' : 'Live training · management will set the date') + '</div></div>'
        + (ses && ses.meet_url ? '<a class="btn" href="' + e(ses.meet_url) + '" target="_blank" rel="noopener">Join</a>' : '<button class="btn" onclick="trOpen(\\'' + nx.t.id + '\\')">' + (nx.t.id === 'way' ? (pd ? 'Continue' : 'Start') : 'Details') + '</button>') + '</div>'; }
    const U = (d.trainings || []).filter(t => t.kind === 'unlock').sort((x, y) => x.sort - y.sort), okU = t => ['done', 'excused'].includes((latestRec(d.records, who, t.id) || {}).status);
    a += '<div class="tr3-card"><div class="k">WHAT I CAN TEACH</div><div class="tr3-tiles">' + U.map(t => '<button type="button" class="' + (okU(t) ? 'ok' : '') + '" onclick="trOpen(\\'' + t.id + '\\')"><i>' + (okU(t) ? '✓' : '') + '</i><span>' + e(t.id === 'trial' ? 'Trial classes' : t.title.split(' · ')[0].replace(/ Specialization$/, '')) + '</span></button>').join('') + '</div><div class="small mute" style="margin-top:8px">Ticked by management after the training.</div></div>';
    const M = partsOf(d, 'model').filter(p => p.video_path);
    a += '<div class="tr3-card"><div class="k">SELF-STUDY · FREE</div>' + (M.length ? M.map(p => partRow(d, who, p)).join('') : '<div class="small mute">Videos of our best classes will appear here. Watch them any time and write what you will try.</div>') + '</div>';
    const h = '<div class="tr tr3"><div class="lead row"><div class="grow"><h1>Trainings</h1><div class="sub">Mandatory trainings unlock your next rank · ' + done + ' of ' + L.length + ' done</div></div></div>'
      + '<div class="tr3-grid"><aside>' + a + '</aside><section class="tr3-card tr3-path"><div class="k">MY PATH · START AT THE BOTTOM, CLIMB TO MASTER</div>' + pathHtml(d, who, R) + '</section></div></div>';
    if(v._h !== h){ v.innerHTML = h; v._h = h; }
    if(!v._sc){ v._sc = 1; setTimeout(() => { try{ const n = v.querySelector('.tr-n.next'); if(n && innerWidth < 980) n.scrollIntoView({ block: 'center', behavior: 'smooth' }); else if(n){ const P = v.querySelector('.tr3-path'); if(P) P.scrollTop = Math.max(0, n.offsetTop - P.clientHeight / 2); } }catch(x){} }, 300); } }
` + s.slice(j);
const st = ".tr-chips{";
if (s.split(st).length !== 2) { console.error('css'); process.exit(1); }
s = s.replace(st, `.tr3{max-width:1120px}.tr3-grid{display:grid;grid-template-columns:minmax(0,1fr);gap:16px;margin-top:14px}
@media(min-width:980px){.tr3-grid{grid-template-columns:minmax(0,360px) minmax(0,1fr);align-items:start}.tr3-path{max-height:calc(100vh - 150px);overflow:auto;position:sticky;top:96px}}
.tr3 aside{display:flex;flex-direction:column;gap:14px}.tr3 .tr-next{margin:0}
.tr3-card{background:#fff;border:1px solid #EEEDF3;border-radius:18px;padding:14px 16px}.tr3-card .k{font-size:11px;font-weight:700;letter-spacing:.06em;color:#5E5A75;margin-bottom:6px}
.tr3-rk{font-family:"Fredoka One",Fredoka,sans-serif;font-size:22px;color:#2B2253;line-height:1.2}
.tr3-row{display:flex;justify-content:space-between;font-size:13px;margin-top:8px}
.tr3-need{display:flex;gap:8px;align-items:center;font-size:13px;padding:5px 0;cursor:pointer}.tr3-need i{width:20px;height:20px;border-radius:50%;border:2px solid #F0C9BD;display:grid;place-items:center;font-style:normal;font-size:11px;color:#fff;flex:none}.tr3-need.ok i{background:#00A3AD;border-color:#00A3AD}
.tr3-tiles{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.tr3-tiles button{display:flex;gap:8px;align-items:center;text-align:left;font:inherit;font-size:12.5px;background:#F6F5FA;border:0;border-radius:12px;padding:9px 10px;color:#5E5A75;cursor:pointer}
.tr3-tiles button i{width:20px;height:20px;border-radius:50%;border:2px solid #DCDAE5;display:grid;place-items:center;font-style:normal;font-size:11px;color:#fff;flex:none}.tr3-tiles button.ok{background:#EEF8F7;color:#00626A;font-weight:700}.tr3-tiles button.ok i{background:#00A3AD;border-color:#00A3AD}
.tr3-path .tr-path{margin-top:10px}.tr-n.open{border-style:dashed}
.tr-chips{`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
