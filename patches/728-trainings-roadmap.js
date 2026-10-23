// 728: (Misty) Trainings · a winding ROADMAP instead of the bar chart (her reference: a snake path of round steps with ✓ / lock).
// Top: compact card — your rank, next rank and units, and the checklist for the next rank. Below: "My roadmap" — every rank as a pill,
// then its trainings as round steps along one winding road: ✓ done · ▶ next · ! not recorded yet · lock = later. Tap a step for details.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const R = String.raw;
const a = s.indexOf('  /* 726 · Trainings v5 (teacher): one staircase chart + next-rank checklist */');
const b = s.indexOf(R`  function paintMy(){ const v = $('v-train'); if(!v || !MY) return; const d = MY, who = d.me, R = myRank()`, a);
if (a < 0 || b < 0) { console.error('726 block not found'); process.exit(1); }
const NEW = R`  /* 728 · Trainings (teacher): compact rank card + winding roadmap */
  function roadHtml(d, who, R, peek){ const L = statusList(d, who, R.ix), ix = Math.max(0, R.ix), R0 = (d.records || []).filter(r => r.teacher === who && r.status === 'done');
    const units = R.next ? (R.next.units != null ? +R.next.units : (+R.life || 0) + (+R.next.need || 0)) : 0, life = Math.round((+R.life || 0) * 10) / 10;
    const items = []; RANKS.forEach((rk, k) => { items.push({ rank: rk, k, st: k < ix ? 'ok' : k === ix ? 'me' : k === ix + 1 ? 'nx' : 'lk' });
      L.filter(x => x.gi === k).forEach(x => { let st = x.st; if(x.t.id === 'spec' && R0.some(r => r.training_id === 'inq' || /^spec-/.test(r.training_id))) st = 'done'; items.push({ x, st, k }); }); });
    const PER = window.innerWidth < 560 ? 3 : 4, RH = 116, TOP = 40, rows = []; for(let i = 0; i < items.length; i += PER) rows.push(items.slice(i, i + PER));
    const X = j => PER === 1 ? 50 : 12 + j * (76 / (PER - 1));
    rows.forEach((row, r) => row.forEach((it, j) => { it.cx = r % 2 ? X(PER - 1 - j) : X(j); it.cy = TOP + r * RH; }));
    const H = TOP + (rows.length - 1) * RH + 64, on = it => it.rank ? it.st === 'ok' || it.st === 'me' : it.st === 'done';
    let pOk = '', pNo = ''; for(let i = 1; i < items.length; i++){ const p = items[i - 1], q = items[i]; let seg;
      if(p.cy === q.cy) seg = 'M' + p.cx + ' ' + p.cy + ' L' + q.cx + ' ' + q.cy + ' ';
      else { const ex = p.cx > 50 ? 98 : 2; seg = 'M' + p.cx + ' ' + p.cy + ' C' + ex + ' ' + p.cy + ' ' + ex + ' ' + q.cy + ' ' + q.cx + ' ' + q.cy + ' '; }
      if(on(p) && on(q)) pOk += seg; else pNo += seg; }
    const ses = x => (d.sessions || []).find(s0 => s0.training_id === x.t.id && s0.status === 'scheduled' && new Date(s0.starts_at).getTime() > Date.now() - 3 * 3600e3);
    const nodes = items.map(it => { if(it.rank){ const c = RC[it.rank] || '#00A3AD', sub = it.st === 'me' ? (peek ? 'now' : 'you are here') : it.st === 'nx' && R.next ? life.toLocaleString() + ' / ' + Math.round(units).toLocaleString() + ' units' : it.st === 'ok' ? '✓' : '';
        return '<div class="rp ' + it.st + '" style="left:' + it.cx + '%;top:' + it.cy + 'px;--c:' + c + '">' + (it.st === 'me' ? '<span class="you">' + (peek ? e(who) : 'You') + '</span>' : '') + e(RS[it.rank] || it.rank) + (sub ? '<small>' + e(sub) + '</small>' : '') + '</div>'; }
      const x = it.x, st = it.st, s0 = ses(x), ttl = x.t.id === 'spec' ? 'Specialization' : x.t.title.split(' · ')[0];
      const sub = st === 'done' ? (x.rec && x.rec.done_at ? fmtD(x.rec.done_at) : '') : s0 ? fmtDT(s0.starts_at) : st === 'next' ? 'next' : st === 'open' && x.gi <= ix && x.t.id !== 'way' ? 'not recorded yet' : '';
      const ic = st === 'done' ? '✓' : st === 'next' ? '▶' : st === 'open' ? (x.gi <= ix && x.t.id !== 'way' ? '!' : '') : LOCK;
      return '<button type="button" class="rn ' + (st === 'open' && x.gi <= ix && x.t.id !== 'way' ? 'miss' : st) + '" style="left:' + it.cx + '%;top:' + it.cy + 'px" aria-label="' + e(ttl) + '" onclick="trOpen(\'' + x.t.id + '\')">' + ic + '</button>'
        + '<div class="rl' + (st === 'lock' ? ' dim' : '') + '" style="left:' + it.cx + '%;top:' + (it.cy + 30) + 'px" onclick="trOpen(\'' + x.t.id + '\')">' + e(ttl) + (sub ? '<small>' + e(sub) + '</small>' : '') + '</div>'; }).join('');
    return '<section class="tx-card rmc"><div class="tx-h"><b>My roadmap</b><span>✓ done · ▶ next · ! not recorded yet · tap a step</span></div><div class="rm" style="height:' + H + 'px"><svg viewBox="0 0 100 ' + H + '" preserveAspectRatio="none" aria-hidden="true">'
      + '<path d="' + pOk + '" fill="none" stroke="#7FD0CB" stroke-width="4" stroke-linecap="round" vector-effect="non-scaling-stroke"/><path d="' + pNo + '" fill="none" stroke="#DDDBE6" stroke-width="4" stroke-linecap="round" stroke-dasharray="1 9" vector-effect="non-scaling-stroke"/></svg>' + nodes + '</div></section>'; }
  function myHtml(d, who, R, peek){ const L = statusList(d, who, R.ix), ix = Math.max(0, R.ix);
    const units = R.next ? (R.next.units != null ? +R.next.units : (+R.life || 0) + (+R.next.need || 0)) : 0, life = Math.round((+R.life || 0) * 10) / 10, pct = R.next ? Math.min(100, Math.round(life / Math.max(1, units) * 100)) : 100;
    const nx = L.find(x => x.st === 'next'), need = L.filter(x => x.gi === ix + 1), CU = L.filter(x => x !== nx && x.st !== 'done' && x.st !== 'lock' && x.t.id !== 'spec' && x.t.id !== 'way' && x.gi <= ix);
    const U = (d.trainings || []).filter(t => t.kind === 'unlock').sort((x, y) => x.sort - y.sort), okU = t => ['done', 'excused'].includes((latestRec(d.records, who, t.id) || {}).status);
    const M = partsOf(d, 'model').filter(p => p.video_path), tt = id => ((d.trainings || []).find(t => t.id === id) || {}).title || '';
    const last = (d.records || []).filter(r => r.teacher === who && r.status === 'done' && r.done_at && r.training_id !== 'coach' && r.training_id !== 'facil').sort((p, q) => Date.parse(q.done_at) - Date.parse(p.done_at))[0];
    const fresh = last && Date.now() - Date.parse(last.done_at) < 14 * 864e5, c1 = RC[R.rank] || '#00A3AD', c2 = RC[(R.next && R.next.name) || R.rank] || '#00A3AD';
    window._tr5 = { d, who, R, peek };
    const ses = x => (d.sessions || []).find(s0 => s0.training_id === x.t.id && s0.status === 'scheduled' && new Date(s0.starts_at).getTime() > Date.now() - 3 * 3600e3);
    const ck = x => { const dn = x.st === 'done', s0 = ses(x), P = x.t.id === 'way' ? partsOf(d, 'way') : [], pd = P.filter(p => partDone(d, who, p)).length;
      const ttl = x.t.id === 'spec' ? 'One specialization (IELTS · TOEFL · KET · PET)' : x.t.title, sub = dn ? 'Done · ' + fmtD(x.rec.done_at) : s0 ? fmtDT(s0.starts_at) + (s0.facilitator ? ' · with ' + tName(s0.facilitator) : '') : P.length ? pd + ' of ' + P.length + ' parts' : x.rec && x.rec.status === 'assigned' ? 'Assigned to you' : 'Live training · date to follow';
      return '<button type="button" class="ck ' + (dn ? 'd' : x === nx ? 'n' : '') + '" onclick="trOpen(\'' + x.t.id + '\')"><i>' + (dn ? '✓' : x === nx ? '▶' : '') + '</i><span class="grow"><b>' + e(ttl) + '</b><small>' + e(sub) + '</small></span><span class="mute">›</span></button>'; };
    const s0 = nx && ses(nx), P0 = nx && nx.t.id === 'way' ? partsOf(d, 'way') : [], pd0 = P0.filter(p => partDone(d, who, p)).length;
    const btn = !nx ? '' : s0 && s0.meet_url ? '<a class="btn teal block" href="' + e(s0.meet_url) + '" target="_blank" rel="noopener">Join ' + e(nx.t.title) + '</a>' : nx.t.id === 'way' ? '<button class="btn teal block" onclick="trOpen(\'way\')">' + (pd0 ? 'Continue' : 'Start') + ' CupOfEnglish Way</button>' : '';
    let h = '<div class="lead"><div><h1>Trainings</h1><div class="mute small">' + (peek ? 'What Teacher ' + e(who) + ' sees' : 'Trainings move you up the ranks and unlock the books you teach') + '</div></div></div>';
    h += '<section class="h6"><div class="h6-l" style="--c1:' + c1 + ';--c2:' + c2 + '"><small>' + (peek ? 'RANK' : 'YOUR RANK') + '</small><b class="rk"><i></i>' + e(R.rank || 'Newly Hired') + '</b>'
      + (R.next ? '<div class="h5-nx">Next · <b>' + e(R.next.name) + '</b></div><div class="h5-bar"><i style="width:' + pct + '%"></i></div><div class="h5-u">' + life.toLocaleString() + ' of ' + Math.round(units).toLocaleString() + ' units · ' + pct + '%</div>' : '<div class="h5-nx">Top rank reached 🎉</div>')
      + (fresh ? '<div class="h5-yay">🎉 <b>Well done!</b> ' + e(tt(last.training_id)) + ' · ' + e(fmtD(last.done_at)) + '</div>' : '') + '</div>'
      + '<div class="h6-r">' + (R.next ? '<h4>' + (need.length ? 'For ' + e(R.next.name) + ' · ' + need.filter(x => x.st === 'done').length + ' of ' + need.length + ' trainings done' : 'For ' + e(R.next.name) + ' · units only, no training needed') + '</h4>' + need.map(ck).join('') : '<h4>All ranks reached</h4>')
      + (nx && nx.gi <= ix ? '<h4 style="margin-top:10px">Next up</h4>' + ck(nx) : '') + (btn ? '<div style="margin-top:10px">' + btn + '</div>' : '')
      + (CU.length ? '<div class="h5-cu">Not recorded yet · ' + CU.map(x => '<a onclick="trOpen(\'' + x.t.id + '\')">' + e(x.t.title) + '</a>').join(' · ') + '</div>' : '') + '</div></section>';
    h += roadHtml(d, who, R, peek);
    window._trBooksH = '<div class="tx"><h1>Books &amp; specializations</h1><div class="mute small">✓ = qualified to teach · tap one for its training</div><div class="tx-card" style="margin-top:12px">' + ['Phonics', 'Reading', 'Oxford Discover', 'Adults', 'Books', 'Specializations', 'Trial classes'].filter(g => U.some(t => BG(t) === g)).map(g => '<div class="tx-tg"><span style="background:' + BGC[g] + '"></span>' + g + '</div><div class="tx-tiles">' + U.filter(t => BG(t) === g).map(t => '<button type="button" class="' + (okU(t) ? 'ok' : '') + '" onclick="trOpen(\'' + t.id + '\')">' + (okU(t) ? '✓ ' : '') + e(t.id === 'trial' ? 'Trial classes' : t.title.split(' · ')[0].replace(/ Specialization$/, '').replace(/^Phonics Training$/, 'Phonics')) + uSt(d, who, t) + '</button>').join('') + '</div>').join('') + '</div></div>';
    const side = coachCard(d, who) + trainCard(d, who) + (M.length ? '<section class="tx-card"><div class="tx-h"><b>Self-study</b><span>free · model lessons</span></div>' + M.map(p => partRow(d, who, p)).join('') + '</section>' : '');
    h += '<div class="tx5-grid"><div>' + teachCard(d, who) + '</div>' + (side ? '<aside>' + side + '</aside>' : '') + '</div>';
    return h; }
  window.trAllPath = () => { const c = window._tr5; if(!c) return; openSheet('<div class="tx"><h1>All trainings</h1><div class="tx-card" style="margin-top:12px">' + ladderHtml(c.d, c.who, c.R) + '</div></div>'); };
  window.trSeeAs = async function(name){ try{ const x = teachers().find(y => y.name === name) || { ix: 0, rank: '', life: 0 }; TV = await call('my', { teacher: name });
      openSheet('<div class="tx tx5 peek">' + myHtml(TV, name, { ix: Math.max(0, x.ix), rank: x.rank, life: x.life, next: x.next }, 1) + '</div>'); }catch(x){ toast(x.message); } };
  let _rmW = window.innerWidth; window.addEventListener('resize', () => { if((window.innerWidth < 560) !== (_rmW < 560)){ _rmW = window.innerWidth; try{ const v = $('v-train'); if(v) v._h = ''; paintMy(); }catch(x){} } });
  (function(){ const st = document.createElement('style'); st.textContent = R2; document.head.appendChild(st); })();
`;
const CSS = '.tx5 .lead{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:14px}'
 + '.tx5 .h6{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:28px;background:#fff;border:1px solid rgba(236,234,241,.9);border-radius:22px;padding:22px 26px;box-shadow:0 1px 2px rgba(43,34,83,.04),0 14px 34px -20px rgba(43,34,83,.22)}'
 + '.h6-l small{font-size:11px;letter-spacing:.09em;color:#9A97AE;font-weight:700}'
 + '.h6-l .rk{display:flex;align-items:center;gap:10px;font-family:"Fredoka One",Fredoka,sans-serif;font-weight:400;font-size:28px;line-height:1.15;color:#2B2253;margin:4px 0 14px}.h6-l .rk i{width:12px;height:12px;border-radius:50%;background:var(--c1);flex:none}'
 + '.h5-nx{font-size:13.5px;color:#5E5A75}.h5-nx b{color:#2B2253}'
 + '.h5-bar{height:10px;border-radius:99px;background:#EEEDF3;overflow:hidden;margin:8px 0 5px}.h5-bar i{display:block;height:100%;border-radius:99px;background:var(--c2)}'
 + '.h5-u{font-size:12px;color:#77738C;font-variant-numeric:tabular-nums}'
 + '.h6-r{border-left:1px solid #F0EFF5;padding-left:26px}.h6-r h4{margin:0 0 4px;font-size:12px;color:#77738C;font-weight:700}'
 + '.tx5 .ck{display:flex;gap:10px;align-items:center;width:100%;padding:7px 0;background:none;border:0;text-align:left;font:inherit;color:inherit;cursor:pointer;font-size:13.5px;letter-spacing:normal}'
 + '.tx5 .ck i{width:22px;height:22px;flex:none;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:11px;font-weight:700;border:1.5px solid #D9D7E3;color:#9A97AE}'
 + '.tx5 .ck.d i{background:#00A3AD;border-color:#00A3AD;color:#fff}.tx5 .ck.n i{background:#2B2253;border-color:#2B2253;color:#fff}.tx5 .ck.d b{color:#5E5A75;font-weight:400}'
 + '.tx5 .ck small{display:block;font-size:11.5px;color:#77738C;font-weight:400;letter-spacing:normal}'
 + '.h5-cu{margin-top:12px;font-size:12px;color:#77738C}.h5-cu a{color:#00737B;font-weight:700;cursor:pointer}'
 + '.h5-yay{margin-top:14px;padding:8px 12px;border-radius:12px;background:#EEF8F7;color:#00626A;font-size:12.5px}'
 + '.tx5 .rmc{margin-top:16px}.rm{position:relative;margin:6px 4px 0}.rm svg{position:absolute;left:0;top:0;width:100%;height:100%;overflow:visible}'
 + '.rn{position:absolute;transform:translate(-50%,-50%);width:46px;height:46px;border-radius:50%;display:grid;place-items:center;border:0;padding:0;cursor:pointer;font:700 17px/1 inherit;color:#fff;z-index:1}'
 + '.rn.done{background:#00A3AD;box-shadow:0 0 0 6px #E3F6F5}.rn.next{background:#2B2253;box-shadow:0 0 0 6px #E6E3F3;animation:rmP 2s ease-in-out infinite}'
 + '.rn.miss{background:#fff;border:2.5px solid #E7A65A;color:#C27A22}.rn.open{background:#fff;border:2.5px solid #C9C6D6}.rn.lock{background:#F1F0F6;color:#B3B0C2}'
 + '@keyframes rmP{0%,100%{box-shadow:0 0 0 6px #E6E3F3}50%{box-shadow:0 0 0 11px rgba(43,34,83,.08)}}'
 + '.rl{position:absolute;transform:translateX(-50%);width:23%;text-align:center;font-size:12px;line-height:1.25;color:#2B2253;font-weight:700;cursor:pointer;z-index:1}.rl.dim{color:#9A97AE;font-weight:400}'
 + '.rl small{display:block;font-size:11px;font-weight:400;color:#77738C;margin-top:2px}'
 + '.rp{position:absolute;transform:translate(-50%,-50%);z-index:1;padding:8px 14px;border-radius:14px;font-size:12.5px;font-weight:700;white-space:nowrap;text-align:center;background:#fff;border:2px solid var(--c);color:#2B2253}'
 + '.rp small{display:block;font-size:10.5px;font-weight:400;color:#77738C}.rp.me{background:var(--c);color:#fff;box-shadow:0 10px 22px -10px var(--c)}.rp.me small{color:rgba(255,255,255,.85)}'
 + '.rp.ok{background:linear-gradient(rgba(255,255,255,.8),rgba(255,255,255,.8)),var(--c)}.rp.nx{border-style:dashed}.rp.lk{border-color:#DDDBE6;color:#9A97AE}'
 + '.rp .you{position:absolute;top:-24px;left:50%;transform:translateX(-50%);background:#2B2253;color:#fff;font-size:10.5px;border-radius:99px;padding:2px 9px}'
 + '.tx5-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:16px;margin-top:16px;align-items:start}.tx5-grid aside{display:flex;flex-direction:column;gap:16px}'
 + '.tx5 .tx-gr{grid-template-columns:128px 1fr 40px}.tx5 .tx-gr .nm{min-width:0;overflow:hidden;text-overflow:ellipsis}'
 + '.tx5.peek .h6{grid-template-columns:1fr;gap:16px}.tx5.peek .h6-r{border-left:0;padding-left:0;border-top:1px solid #F0EFF5;padding-top:12px}.tx5.peek .tx5-grid{grid-template-columns:1fr}'
 + '@media(max-width:860px){.tx5 .h6{grid-template-columns:1fr;gap:14px;padding:18px}.h6-r{border-left:0;padding-left:0;border-top:1px solid #F0EFF5;padding-top:12px}.tx5-grid{grid-template-columns:1fr}.rl{width:30%;font-size:11.5px}.rp{font-size:11.5px;padding:7px 10px}}';
s = s.slice(0, a) + NEW.replace('R2', JSON.stringify(CSS)) + s.slice(b);
// drop 726's trAllPath / trSeeAs / style (replaced above)
const o1 = s.indexOf(R`  window.trAllPath = () => { const c = window._tr5; if(!c) return; openSheet('<div class="tx"><h1>All trainings</h1><div class="mute small">Climb`), o2 = s.indexOf('  function teachCard(d, who){', o1);
if (o1 < 0 || o2 < 0) { console.error('726 tail not found'); process.exit(1); }
s = s.slice(0, o1) + s.slice(o2);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
