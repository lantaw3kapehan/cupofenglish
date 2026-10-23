// 726: (Misty) Teacher Trainings, redesigned — minimal and clear, built around one chart.
//  · Hero card: a rank staircase (First week → Master), each step filled up to the teacher's rank, "You" on the current step, the next step
//    filling with units; beside it: your rank, next rank with the units bar, and the trainings that next rank needs as a short checklist.
//  · Below: What I can teach (bars) · Coaching · I train teachers in · Self-study. The full ladder of every training moves to "All trainings".
//  · Management: on a teacher's path, "See their Trainings screen" shows exactly what that teacher sees.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const R = String.raw;
const a = s.indexOf(R`  function paintMy(){ const v = $('v-train'); if(!v || !MY) return; const d = MY, who = d.me, R = myRank() || { ix: 0, rank: 'Newly Hired', life: 0, next: null };`);
const b = s.indexOf('  function teachCard(d, who){', a);
if (a < 0 || b < 0 || s.indexOf(R`function paintMy(){ const v = $('v-train')`, a + 10) > -1 && s.indexOf(R`function paintMy(){ const v = $('v-train')`, a + 10) < b) { console.error('paintMy not found'); process.exit(1); }
const NEW = R`  /* 726 · Trainings v5 (teacher): one staircase chart + next-rank checklist */
  function myHtml(d, who, R, peek){ const L = statusList(d, who, R.ix), ix = Math.max(0, R.ix), n = RANKS.length;
    const units = R.next ? (R.next.units != null ? +R.next.units : (+R.life || 0) + (+R.next.need || 0)) : 0, life = Math.round((+R.life || 0) * 10) / 10, pct = R.next ? Math.min(100, Math.round(life / Math.max(1, units) * 100)) : 100;
    const nx = L.find(x => x.st === 'next'), need = L.filter(x => x.gi === ix + 1), CU = L.filter(x => x !== nx && x.st !== 'done' && x.st !== 'lock' && x.t.id !== 'spec' && x.t.id !== 'way' && x.gi <= ix);
    const U = (d.trainings || []).filter(t => t.kind === 'unlock').sort((x, y) => x.sort - y.sort), okU = t => ['done', 'excused'].includes((latestRec(d.records, who, t.id) || {}).status);
    const M = partsOf(d, 'model').filter(p => p.video_path), tt = id => ((d.trainings || []).find(t => t.id === id) || {}).title || '';
    const last = (d.records || []).filter(r => r.teacher === who && r.status === 'done' && r.done_at && r.training_id !== 'coach' && r.training_id !== 'facil').sort((p, q) => Date.parse(q.done_at) - Date.parse(p.done_at))[0];
    const fresh = last && Date.now() - Date.parse(last.done_at) < 14 * 864e5, c2 = RC[(R.next && R.next.name) || R.rank] || '#00A3AD';
    window._tr5 = { d, who, R };
    /* the staircase */
    const steps = RANKS.map((rk, k) => { const T = L.filter(x => x.gi === k), dn = T.filter(x => x.st === 'done').length, st = k < ix ? 'ok' : k === ix ? 'me' : k === ix + 1 ? 'nx' : 'lk';
      return '<div class="s ' + st + '" style="--c:' + (RC[rk] || '#00A3AD') + ';--h:' + Math.round(26 + k * (74 / (n - 1))) + '%"><div class="b">' + (st === 'nx' ? '<i style="height:' + pct + '%"></i>' : '') + (st === 'me' ? '<span class="you">' + (peek ? e(who) : 'You') + '</span>' : '')
        + (T.length ? '<em>' + (dn === T.length ? '✓' : dn + '/' + T.length) + '</em>' : '') + '</div><span class="lb">' + e(RS[rk] || rk) + '</span></div>'; }).join('');
    /* the checklist for the next rank */
    const ses = x => (d.sessions || []).find(s0 => s0.training_id === x.t.id && s0.status === 'scheduled' && new Date(s0.starts_at).getTime() > Date.now() - 3 * 3600e3);
    const ck = x => { const dn = x.st === 'done', s0 = ses(x), P = x.t.id === 'way' ? partsOf(d, 'way') : [], pd = P.filter(p => partDone(d, who, p)).length;
      const ttl = x.t.id === 'spec' ? 'One specialization (IELTS · TOEFL · KET · PET)' : x.t.title, sub = dn ? 'Done · ' + fmtD(x.rec.done_at) : s0 ? fmtDT(s0.starts_at) + (s0.facilitator ? ' · with ' + tName(s0.facilitator) : '') : P.length ? pd + ' of ' + P.length + ' parts' : x.rec && x.rec.status === 'assigned' ? 'Assigned to you' : 'Live training · date to follow';
      return '<button type="button" class="ck ' + (dn ? 'd' : x === nx ? 'n' : '') + '" onclick="trOpen(\'' + x.t.id + '\')"><i>' + (dn ? '✓' : x === nx ? '▶' : '') + '</i><span class="grow"><b>' + e(ttl) + '</b><small>' + e(sub) + '</small></span><span class="mute">›</span></button>'; };
    const s0 = nx && ses(nx), P0 = nx && nx.t.id === 'way' ? partsOf(d, 'way') : [], pd0 = P0.filter(p => partDone(d, who, p)).length;
    const btn = !nx ? '' : s0 && s0.meet_url ? '<a class="btn teal block" href="' + e(s0.meet_url) + '" target="_blank" rel="noopener">Join ' + e(nx.t.title) + '</a>' : nx.t.id === 'way' ? '<button class="btn teal block" onclick="trOpen(\'way\')">' + (pd0 ? 'Continue' : 'Start') + ' CupOfEnglish Way</button>' : '';
    let h = '<div class="lead"><div><h1>Trainings</h1><div class="mute small">' + (peek ? 'What Teacher ' + e(who) + ' sees' : 'Trainings move you up the ranks and unlock the books you teach') + '</div></div><button type="button" class="btn ghost sm" onclick="trAllPath()">All trainings</button></div>';
    h += '<section class="h5"><div class="st5">' + steps + '</div><div class="h5-r" style="--c2:' + c2 + '"><small>' + (peek ? 'RANK' : 'YOUR RANK') + '</small><b class="rk">' + e(R.rank || 'Newly Hired') + '</b>'
      + (R.next ? '<div class="h5-nx">Next · <b>' + e(R.next.name) + '</b></div><div class="h5-bar"><i style="width:' + pct + '%"></i></div><div class="h5-u">' + life.toLocaleString() + ' of ' + Math.round(units).toLocaleString() + ' units · ' + pct + '%</div>' : '<div class="h5-nx">Top rank reached 🎉</div>')
      + (R.next ? '<div class="h5-ck"><h4>' + (need.length ? 'Trainings for ' + e(R.next.name) + ' · ' + need.filter(x => x.st === 'done').length + ' of ' + need.length + ' done' : 'No training needed · units only') + '</h4>' + need.map(ck).join('') + '</div>' : '')
      + (nx && nx.gi <= ix ? '<div class="h5-ck"><h4>Next up</h4>' + ck(nx) + '</div>' : '') + (btn ? '<div style="margin-top:12px">' + btn + '</div>' : '')
      + (CU.length ? '<div class="h5-cu">Not recorded yet · ' + CU.map(x => '<a onclick="trOpen(\'' + x.t.id + '\')">' + e(x.t.title) + '</a>').join(' · ') + '</div>' : '')
      + (fresh ? '<div class="h5-yay">🎉 <b>Well done!</b> ' + e(tt(last.training_id)) + ' · ' + e(fmtD(last.done_at)) + '</div>' : '') + '</div></section>';
    window._trBooksH = '<div class="tx"><h1>Books &amp; specializations</h1><div class="mute small">✓ = qualified to teach · tap one for its training</div><div class="tx-card" style="margin-top:12px">' + ['Phonics', 'Reading', 'Oxford Discover', 'Adults', 'Books', 'Specializations', 'Trial classes'].filter(g => U.some(t => BG(t) === g)).map(g => '<div class="tx-tg"><span style="background:' + BGC[g] + '"></span>' + g + '</div><div class="tx-tiles">' + U.filter(t => BG(t) === g).map(t => '<button type="button" class="' + (okU(t) ? 'ok' : '') + '" onclick="trOpen(\'' + t.id + '\')">' + (okU(t) ? '✓ ' : '') + e(t.id === 'trial' ? 'Trial classes' : t.title.split(' · ')[0].replace(/ Specialization$/, '').replace(/^Phonics Training$/, 'Phonics')) + uSt(d, who, t) + '</button>').join('') + '</div>').join('') + '</div></div>';
    const side = coachCard(d, who) + trainCard(d, who) + (M.length ? '<section class="tx-card"><div class="tx-h"><b>Self-study</b><span>free · model lessons</span></div>' + M.map(p => partRow(d, who, p)).join('') + '</section>' : '');
    h += '<div class="tx5-grid"><div>' + teachCard(d, who) + '</div>' + (side ? '<aside>' + side + '</aside>' : '') + '</div>';
    return h; }
  function paintMy(){ const v = $('v-train'); if(!v || !MY) return; const d = MY, who = d.me, R = myRank() || { ix: 0, rank: 'Newly Hired', life: 0, next: null };
    const h = '<div class="tx tx5">' + myHtml(d, who, R) + '</div>'; if(v._h !== h){ v.innerHTML = h; v._h = h; } }
  window.trAllPath = () => { const c = window._tr5; if(!c) return; openSheet('<div class="tx"><h1>All trainings</h1><div class="mute small">Climb from the bottom · tap a training for details</div><div class="tx-card" style="margin-top:12px">' + ladderHtml(c.d, c.who, c.R) + '</div></div>'); };
  window.trSeeAs = async function(name){ try{ const x = teachers().find(y => y.name === name) || { ix: 0, rank: '', life: 0 }; TV = await call('my', { teacher: name });
      openSheet('<div class="tx tx5 peek">' + myHtml(TV, name, { ix: Math.max(0, x.ix), rank: x.rank, life: x.life, next: x.next }, 1) + '</div>'); }catch(x){ toast(x.message); } };
  (function(){ const st = document.createElement('style'); st.textContent = R2; document.head.appendChild(st); })();
`;
const CSS = '.tx5 .lead{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:14px}'
 + '.tx5 .h5{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:30px;background:#fff;border:1px solid rgba(236,234,241,.9);border-radius:22px;padding:22px 26px 20px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 14px 34px -20px rgba(43,34,83,.22)}'
 + '.st5{display:flex;align-items:flex-end;gap:8px;height:230px;padding-top:30px;align-self:end}'
 + '.st5 .s{flex:1;min-width:0;height:100%;display:flex;flex-direction:column;justify-content:flex-end}'
 + '.st5 .b{position:relative;height:var(--h);border-radius:12px 12px 4px 4px;background:#F3F2F7}'
 + '.st5 .ok .b{background:linear-gradient(rgba(255,255,255,.5),rgba(255,255,255,.5)),var(--c)}'
 + '.st5 .me .b{background:var(--c);box-shadow:0 10px 22px -10px var(--c)}'
 + '.st5 .nx .b{background:#F6F5FA;outline:1.5px dashed var(--c);outline-offset:-1.5px;overflow:hidden}'
 + '.st5 .nx .b i{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(rgba(255,255,255,.55),rgba(255,255,255,.55)),var(--c)}'
 + '.st5 em{position:absolute;top:8px;left:0;right:0;text-align:center;font-style:normal;font-size:11.5px;font-weight:700;color:#fff}'
 + '.st5 .ok em{color:#2B2253}.st5 .nx em,.st5 .lk em{color:#9A97AE}'
 + '.st5 .you{position:absolute;top:-28px;left:50%;transform:translateX(-50%);background:#2B2253;color:#fff;font-size:11px;font-weight:700;border-radius:99px;padding:3px 10px;white-space:nowrap}'
 + '.st5 .you:after{content:"";position:absolute;left:50%;bottom:-4px;margin-left:-4px;border:4px solid transparent;border-top-color:#2B2253;border-bottom:0}'
 + '.st5 .lb{font-size:11.5px;line-height:1.2;text-align:center;color:#8A87A0;margin-top:8px;min-height:28px}.st5 .me .lb{color:#2B2253;font-weight:700}'
 + '.h5-r small{font-size:11px;letter-spacing:.09em;color:#9A97AE;font-weight:700}'
 + '.h5-r .rk{display:block;font-family:"Fredoka One",Fredoka,sans-serif;font-weight:400;font-size:28px;line-height:1.15;color:#2B2253;margin:2px 0 12px}'
 + '.h5-nx{font-size:13.5px;color:#5E5A75}.h5-nx b{color:#2B2253}'
 + '.h5-bar{height:10px;border-radius:99px;background:#EEEDF3;overflow:hidden;margin:8px 0 5px}.h5-bar i{display:block;height:100%;border-radius:99px;background:var(--c2)}'
 + '.h5-u{font-size:12px;color:#77738C;font-variant-numeric:tabular-nums}'
 + '.h5-ck{margin-top:14px;border-top:1px solid #F0EFF5;padding-top:10px}.h5-ck h4{margin:0 0 4px;font-size:12px;color:#77738C;font-weight:700}'
 + '.tx5 .ck{display:flex;gap:10px;align-items:center;width:100%;padding:7px 0;background:none;border:0;text-align:left;font:inherit;color:inherit;cursor:pointer;font-size:13.5px}'
 + '.tx5 .ck i{width:22px;height:22px;flex:none;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:11px;font-weight:700;border:1.5px solid #D9D7E3;color:#9A97AE}'
 + '.tx5 .ck.d i{background:#00A3AD;border-color:#00A3AD;color:#fff}.tx5 .ck.n i{background:#2B2253;border-color:#2B2253;color:#fff}.tx5 .ck.d b{color:#5E5A75;font-weight:400}'
 + '.tx5 .ck small{display:block;font-size:11.5px;color:#77738C}'
 + '.h5-cu{margin-top:12px;font-size:12px;color:#77738C}.h5-cu a{color:#00737B;font-weight:700;cursor:pointer}'
 + '.h5-yay{margin-top:12px;padding:8px 12px;border-radius:12px;background:#EEF8F7;color:#00626A;font-size:12.5px}'
 + '.tx5-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;margin-top:16px;align-items:start}.tx5-grid aside{display:flex;flex-direction:column;gap:16px}'
 + '.tx5.peek .h5{grid-template-columns:1fr;gap:18px}.tx5.peek .tx5-grid{grid-template-columns:1fr}'
 + '@media(max-width:860px){.tx5 .h5{grid-template-columns:1fr;gap:18px;padding:18px}.tx5-grid{grid-template-columns:1fr}.st5{height:180px;gap:5px}.st5 .lb{font-size:10.5px}}';
s = s.slice(0, a) + NEW.replace('R2', JSON.stringify(CSS)) + s.slice(b);
// management: "See their Trainings screen" on a teacher's path
const k = R`openSheet('<div class="tr tx">' + profHtml(TV, name, x.rank)`;
if (s.split(k).length !== 2) { console.error('trView anchor'); process.exit(1); }
s = s.replace(k, R`openSheet('<div class="tr tx"><button class="btn ghost sm" style="float:right;margin-top:4px" onclick="trSeeAs(\'' + e(name) + '\')">See their screen</button>' + profHtml(TV, name, x.rank)`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
