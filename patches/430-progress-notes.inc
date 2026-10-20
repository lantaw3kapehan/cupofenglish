/* 20 Oct · 430 · Progress and Notes tabs (Misty: "what about the notes and progress?")
   Progress
   · New "At a glance" row on top: latest monthly score (arrow vs the month before), level now → next, latest progress check, classes noted this month.
   · Progress checks: Speaking /20 · Listening /8 · Reading /8 as bars; the "Report ↗" link stays. A blank total no longer shows "undefined/36".
   · An empty Skill breakdown card shrinks to one line.
   Notes
   · Top: notes this month, homework given, last page reached, and a line of the pages reached in the current book over time.
   · Each note: a date block on the left; teacher and a coloured skill chip; "Noticed" in larger text; Ended · Next · Homework as labelled rows.
   All notes stay (20 shown, the rest under "Older notes"). */
(function(){
  const css = document.createElement('style');
  css.textContent = `
.pf29 .ln{margin:6px 6px 0!important}
.pf29 .ms.f{transform:none;text-align:left}.pf29 .ms.f i{margin-left:0}
.pf29 .ms.l{transform:translateX(-100%);text-align:right}.pf29 .ms.l i{margin-right:0}
.pg30{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
.pg30>div{border:1px solid var(--line);border-radius:14px;background:#fff;padding:12px 14px;min-width:0}
.pg30 em{display:block;font-style:normal;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8A86A0;margin-bottom:4px}
.pg30 b.v{font-family:var(--brand);font-weight:400;font-size:26px;color:var(--ink);line-height:1.1}
.pg30 small{font-size:12px;color:#8A86A0}
.pg30 .up{color:#1E8A6E;font-weight:700;font-size:12.5px}.pg30 .dn{color:#C0563F;font-weight:700;font-size:12.5px}
.pg30 .lv{display:flex;align-items:center;gap:6px;flex-wrap:wrap}
.pg30 .lv span{font-size:13px;font-weight:700;padding:3px 10px;border-radius:999px;background:#00808A;color:#fff}
.pg30 .lv span.n{background:#fff;color:#9A6A10;box-shadow:inset 0 0 0 1.5px #E0A030}
.pg30 .sp{display:block;margin-top:6px}
.sb30{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:4px 10px;align-items:center;margin-top:8px;max-width:520px}
.sb30 span{font-size:12.5px;color:#55526E}
.sb30 i{display:block;height:8px;border-radius:4px;background:var(--soft);position:relative;overflow:hidden}
.sb30 i:after{content:'';position:absolute;left:0;top:0;bottom:0;width:var(--w);background:var(--c);border-radius:4px}
.sb30 b{font-size:12.5px;color:var(--ink)}
.pc30{border:1px solid var(--line);border-radius:14px;padding:12px 14px;margin-top:10px;background:#fff}
.pc30 .h{display:flex;align-items:center;gap:8px;flex-wrap:wrap}
.pc30 .h b{font-size:14px}
.pc30 .h .grow{flex:1}
.pc30 p{margin:8px 0 0;font-size:13.5px;color:var(--ink)}
.pc30 p.nx{color:#55526E;font-size:12.5px;margin-top:4px}
#sheetBody .sec.sk30{padding-top:12px!important;padding-bottom:12px!important}
#sheetBody .sec.sk30 h2{margin-bottom:0!important;font-size:15px}
#sheetBody .sec.sk30 .sbbox{display:inline;margin-left:8px}
.nt30 .st{display:grid;grid-template-columns:repeat(3,minmax(0,1fr)) minmax(0,2fr);gap:10px;margin:4px 0 14px}
.nt30 .st>div{border:1px solid var(--line);border-radius:14px;padding:10px 14px;background:#fff;min-width:0}
.nt30 .st em{display:block;font-style:normal;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:#8A86A0}
.nt30 .st b{font-family:var(--brand);font-weight:400;font-size:24px;color:var(--ink)}
.nt30 .st small{font-size:12px;color:#8A86A0;margin-left:4px}
.nt30 .st svg{display:block;width:100%;height:58px;margin-top:2px}
.nt30 .n{display:grid;grid-template-columns:64px minmax(0,1fr);gap:14px;padding:12px 0;border-top:1px solid #F1F0F6}
.nt30 .n:first-of-type{border-top:0}
.nt30 .dt{text-align:center;border-radius:12px;background:var(--soft);padding:8px 0;align-self:start}
.nt30 .dt b{display:block;font-family:var(--brand);font-weight:400;font-size:22px;color:var(--ink);line-height:1.1}
.nt30 .dt span{display:block;font-size:11.5px;color:#8A86A0}
.nt30 .n.new .dt{background:var(--tint)}
.nt30 .tp{display:flex;gap:6px;align-items:center;flex-wrap:wrap;font-size:12.5px;color:#55526E}
.nt30 .tp .sk{font-size:11.5px;font-weight:700;padding:2px 9px;border-radius:999px;background:var(--c);color:#fff;height:auto;margin:0;width:auto;animation:none}
.nt30 .ob{font-size:15px;color:var(--ink);margin:4px 0 6px;line-height:1.45}
.nt30 dl{display:grid;grid-template-columns:auto minmax(0,1fr);gap:3px 10px;margin:0;font-size:13px}
.nt30 dt{font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;padding-top:2px;color:var(--c)}
.nt30 dd{margin:0;color:#3F3B5C}
.nt30 details.old>summary{font-size:12.5px;font-weight:700;color:#2F6F77;cursor:pointer;margin-top:8px}
@media(max-width:820px){.pg30{grid-template-columns:repeat(2,minmax(0,1fr))}.nt30 .st{grid-template-columns:repeat(3,minmax(0,1fr))}.nt30 .st>div:last-child{grid-column:1/-1}}`;
  document.head.appendChild(css);
  const MN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], WD = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const SKC = { speaking: '#00A3AD', listening: '#6B5BD2', reading: '#E0A030', writing: '#D4705A', phonics: '#2B8C6E', vocabulary: '#3A7BD5', grammar: '#8A5A9E' };
  const skc = s => { const k = String(s || '').trim().toLowerCase(); return SKC[k] || SKC[Object.keys(SKC).find(x => k.indexOf(x) >= 0)] || '#8A86A0'; };
  const pg = s => { const m = String(s || '').match(/p\.?\s*(\d{1,3})/i); return m ? +m[1] : null; };
  const bk = s => { const m = String(s || '').trim().match(/^([A-Za-z]+\s?\d*)/); return m ? m[1].replace(/\s+/g, '').toUpperCase() : ''; };
  const ymd = d => d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  const nd = v => { const d = new Date(String(v || '').slice(0, 10) + 'T12:00:00'); return isNaN(d) ? String(v || '') : d.getDate() + ' ' + MN[d.getMonth()] + ' ' + d.getFullYear(); };
  const nmo = v => { const m = String(v || '').match(/^(\d{4})-(\d{2})/); return m ? MN[+m[2] - 1] + ' ' + m[1] : String(v || ''); };
  const tn = t => typeof tName === 'function' ? tName(t) : 'Teacher ' + t;
  function notes(sec){ const N = ((STU && STU.r && STU.r.notes) || []).slice(); if(!N.length) return;
    const now = new Date(), ym = ymd(now), thisM = N.filter(n => String(n.date || '').slice(0, 7) === ym).length, hw = N.filter(n => String(n.date || '').slice(0, 7) === ym && n.homework).length;
    const lastEnd = (N.find(n => n.ended) || {}).ended || '';
    /* pages in the current book, oldest → newest */
    const cur = bk(lastEnd), P = N.filter(n => n.ended && bk(n.ended) === cur && pg(n.ended) != null).slice(0, 14).reverse().map(n => ({ d: n.date, p: pg(n.ended) }));
    let chart = '<small>Not enough notes with pages yet</small>';
    if(P.length >= 2){ const W = 300, H = 58, lo = Math.min(...P.map(x => x.p)), hi = Math.max(...P.map(x => x.p)), sp = Math.max(1, hi - lo);
      const X = i => 8 + i * (W - 16) / (P.length - 1), Y = p => H - 10 - (p - lo) / sp * (H - 22);
      chart = '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none"><polyline fill="none" stroke="#00A3AD" stroke-width="2" vector-effect="non-scaling-stroke" points="' + P.map((x, i) => X(i) + ',' + Y(x.p)).join(' ') + '"/>' +
        P.map((x, i) => '<circle cx="' + X(i) + '" cy="' + Y(x.p) + '" r="3.5" fill="#fff" stroke="#00A3AD" stroke-width="2" vector-effect="non-scaling-stroke"><title>' + esc(x.d) + ' · p.' + x.p + '</title></circle>').join('') +
        '<text x="' + X(0) + '" y="' + (H - 1) + '" font-size="10" fill="#8A86A0">p.' + P[0].p + '</text><text x="' + (W - 8) + '" y="10" font-size="10" fill="#00808A" text-anchor="end">p.' + P[P.length - 1].p + '</text></svg>'; }
    const card = n => { const d = new Date(String(n.date || '') + 'T12:00:00'), ok = !isNaN(d), sk = String(n.skills || '').split(/[,·\/]/).map(x => x.trim()).filter(Boolean), c = skc(sk[0]);
      const recent = ok && (now - d) < 7 * 864e5;
      return '<div class="n' + (recent ? ' new' : '') + '" style="--c:' + c + '"><div class="dt">' + (ok ? '<span>' + WD[d.getDay()] + '</span><b>' + d.getDate() + '</b><span>' + MN[d.getMonth()] + '</span>' : '<span>' + esc(n.date || '') + '</span>') + '</div><div>' +
        '<div class="tp">' + esc(tn(n.teacher || '')) + sk.map(s => '<span class="sk" style="--c:' + skc(s) + '">' + esc(s) + '</span>').join('') + '</div>' +
        (n.obs ? '<div class="ob">' + esc(n.obs) + '</div>' : '') + '<dl style="--c:#2F6F77">' + (n.ended ? '<dt>Ended</dt><dd>' + esc(n.ended) + '</dd>' : '') + (n.next ? '<dt>Next</dt><dd>' + esc(n.next) + '</dd>' : '') + (n.homework ? '<dt style="color:#B07A10">Homework</dt><dd>' + esc(n.homework) + '</dd>' : '') + '</dl></div></div>'; };
    const h2 = sec.querySelector('h2'); const head = h2 ? h2.outerHTML : '<h2>Class notes</h2>';
    sec.innerHTML = head + '<div class="nt30"><div class="st"><div><em>This month</em><b>' + thisM + '</b><small>notes</small></div><div><em>Homework</em><b>' + hw + '</b><small>this month</small></div>' +
      '<div><em>Last page</em><b>' + (pg(lastEnd) != null ? 'p.' + pg(lastEnd) : '—') + '</b><small>' + esc(cur) + '</small></div><div><em>Pages reached' + (cur ? ' · ' + esc(cur) : '') + '</em>' + chart + '</div></div>' +
      N.slice(0, 20).map(card).join('') + (N.length > 20 ? '<details class="old"><summary>Older notes · ' + (N.length - 20) + '</summary>' + N.slice(20).map(card).join('') + '</details>' : '') + '</div>';
    sec.dataset.n30 = N.length; }
  function checks(sec){ const C = (STU && STU.r && STU.r.checks) || []; if(!C.length) return; const h2 = sec.querySelector('h2');
    const bar = (l, v, mx, c) => v === '' || v == null || isNaN(+v) ? '' : '<span>' + l + '</span><i style="--w:' + Math.min(100, +v / mx * 100) + '%;--c:' + c + '"></i><b>' + v + '<small style="color:#8A86A0">/' + mx + '</small></b>';
    sec.innerHTML = (h2 ? h2.outerHTML : '<h2>Progress checks</h2>') + C.map(c => '<div class="pc30"><div class="h"><b>' + esc(nd(c.date)) + '</b><span class="chip teal">' + esc(c.cefr || '') + '</span>' +
      '<span class="mute grow small">' + (c.total != null && c.total !== '' ? esc(c.total) + '/36 · ' : '') + [c.teacher ? esc(tn(c.teacher)) : '', c.book ? esc(c.book) : ''].filter(Boolean).join(' · ') + '</span>' +
      (c.pr ? '<a class="link small noprint" onclick="docSheet(\'PRREP\',\'Progress report\',\'' + esc(c.pr) + '\')">Report ↗</a>' : '') + '</div>' +
      '<div class="sb30">' + bar('Speaking', c.speaking, 20, '#00A3AD') + bar('Listening', c.listening, 8, '#6B5BD2') + bar('Reading', c.reading, 8, '#E0A030') + '</div>' +
      (c.progress ? '<p>' + esc(c.progress) + '</p>' : '') + (c.next ? '<p class="nx">Next: ' + esc(c.next) + '</p>' : '') + '</div>').join('');
    sec.dataset.c30 = C.length; }
  function glance(body){ const r = STU.r || {}, F = r.feedback || [], C = r.checks || [], N = r.notes || [];
    const f0 = F[0], f1 = F[1], df = f0 && f1 ? f0.total - f1.total : null;
    const L = ['Pre-A1','A1','A2','B1','B2','C1','C2'], lvNow = (C[0] && C[0].cefr) || (STU.s && /pre-?a1|[abc][12]/i.test(STU.s.book || '') ? (String(STU.s.book).match(/pre-?a1|[abc][12]\+?/i) || [''])[0] : '') || (r.trial && r.trial.cefr) || '';
    const bi = L.findIndex(x => x.toLowerCase() === String(lvNow).replace(/\+$/, '').toLowerCase()), nxt = bi >= 0 && bi < L.length - 1 ? L[bi + 1] : '';
    let spark = ''; if(F.length > 1){ const S = F.slice(0, 8).reverse(), W = 120, H = 24, lo = Math.min(...S.map(f => f.total)), hi = Math.max(...S.map(f => f.total)), sp = Math.max(1, hi - lo);
      spark = '<svg class="sp" width="' + W + '" height="' + H + '"><polyline fill="none" stroke="#00A3AD" stroke-width="2" points="' + S.map((f, i) => (4 + i * (W - 8) / (S.length - 1)) + ',' + (H - 4 - (f.total - lo) / sp * (H - 8))).join(' ') + '"/></svg>'; }
    const ym = ymd(new Date()), nm = N.filter(n => String(n.date || '').slice(0, 7) === ym).length;
    const c0 = C[0];
    return '<section class="sec noprint" id="pg30" data-stab="pr"><h2>At a glance</h2><div class="pg30">' +
      '<div><em>Monthly score</em>' + (f0 ? '<b class="v">' + f0.total + '</b><small>/100 · ' + esc(nmo(f0.month)) + '</small> ' + (df != null ? '<span class="' + (df >= 0 ? 'up' : 'dn') + '">' + (df >= 0 ? '▲ ' : '▼ ') + Math.abs(df) + '</span>' : '') + spark : '<small>No monthly feedback yet</small>') + '</div>' +
      '<div><em>Level</em><div class="lv">' + (lvNow ? '<span>' + esc(lvNow) + '</span>' : '<small>—</small>') + (nxt ? '<small>→</small><span class="n">' + nxt + '</span>' : '') + '</div><small class="sp">' + (nxt ? 'working towards ' + nxt : '') + '</small></div>' +
      '<div><em>Progress check</em>' + (c0 ? '<b class="v" style="font-size:18px">' + esc(nd(c0.date)) + '</b><small class="sp">Speaking ' + esc(c0.speaking) + '/20 · Listening ' + esc(c0.listening) + '/8 · Reading ' + esc(c0.reading) + '/8</small>' : '<small>None yet · ask the teacher</small>') + '</div>' +
      '<div><em>Class notes</em><b class="v">' + nm + '</b><small> this month</small><small class="sp">' + (N[0] ? 'last ' + esc(nd(N[0].date)) : 'none yet') + '</small></div></div></section>'; }
  function paint(){ const body = $('sheetBody'); if(!body || typeof STU === 'undefined' || !STU || !STU.r || !body.querySelector('.shero')) return;
    [...body.querySelectorAll(':scope > section.sec')].forEach(sec => { const h = sec.querySelector('h2'); const t = h ? h.textContent.trim() : '';
      if(/^Class notes/i.test(t) && sec.dataset.n30 == null) notes(sec);
      if(/^Progress checks/i.test(t) && sec.dataset.c30 == null) checks(sec);
      if(/^Skill breakdown/i.test(t)) sec.classList.toggle('sk30', /No progress check/i.test(sec.textContent) && !sec.querySelector('.sk, table, canvas, img')); });
    if(!$('pg30')){ const first = body.querySelector(':scope > [data-stab="pr"]') || body.querySelector(':scope > section.cj'); if(first){ first.insertAdjacentHTML('beforebegin', glance(body)); const g = $('pg30'); if(g && first.classList.contains('stu-hide')) g.classList.add('stu-hide'); } } }
  const _sr = window.stuRender; if(_sr) window.stuRender = function(){ const r = _sr.apply(this, arguments); try{ paint(); setTimeout(() => { try{ paint(); }catch(e){} }, 30); }catch(e){ console.warn('pn30', e); } return r; };
  const _st = window.stuTab; if(_st) window.stuTab = function(){ const r = _st.apply(this, arguments); try{ paint(); }catch(e){} return r; };
})();
