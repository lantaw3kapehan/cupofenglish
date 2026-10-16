/* 16 Oct · 245 · Books library, easier to find with the eyes: each book is a small cover (colour per series, big level),
   "Your students' books" first, then the books by stage of learning (Phonics & first reading → Kids → Teens & IELTS → Adults),
   with stage chips and the search. */
(function(){
  try{ const st = document.createElement('style'); st.textContent = `
#v-books .bl-hd{display:flex;align-items:flex-end;justify-content:space-between;gap:12px;flex-wrap:wrap}
#v-books .bl-hd h1{margin:0}
#v-books .bl-sub{color:var(--mute);font-size:13px;margin-top:2px}
#v-books .bl-q{width:100%;margin:14px 0 10px}
#v-books .bl-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px}
#v-books .bl-chips button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:6px 12px;font:inherit;font-size:13px;color:var(--ink2);cursor:pointer}
#v-books .bl-chips button.on{background:var(--ink);border-color:var(--ink);color:#fff}
#v-books .bl-st{margin:22px 0 2px;display:flex;align-items:baseline;gap:10px;flex-wrap:wrap}
#v-books .bl-st h2{margin:0;font-family:var(--brand);font-weight:400;font-size:19px;color:var(--ink)}
#v-books .bl-st span{color:var(--mute);font-size:12.5px}
#v-books .bl-ser{margin:12px 0 6px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink2);display:flex;align-items:center;gap:8px}
#v-books .bl-ser i{width:10px;height:10px;border-radius:3px;display:inline-block}
#v-books .bl-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:10px}
#v-books .bl-c{position:relative;display:flex;flex-direction:column;justify-content:space-between;min-height:132px;padding:10px 10px 9px;border-radius:12px;background:#fff;border:1px solid var(--line);box-shadow:0 1px 2px rgba(45,42,74,.05);cursor:pointer;text-align:left;font:inherit;color:var(--ink);overflow:hidden;transition:transform .12s,box-shadow .12s}
#v-books .bl-c:hover{transform:translateY(-2px);box-shadow:0 6px 16px rgba(45,42,74,.10)}
#v-books .bl-c::before{content:"";position:absolute;left:0;top:0;bottom:0;width:6px;background:var(--bc)}
#v-books .bl-c .s{font-size:10.5px;letter-spacing:.05em;text-transform:uppercase;color:var(--bc);font-weight:700;padding-left:4px;line-height:1.25}
#v-books .bl-c .b{font-family:var(--brand);font-size:34px;line-height:1;color:var(--ink);padding-left:4px;margin:6px 0 2px;word-break:break-word}
#v-books .bl-c .b.sm{font-size:19px;line-height:1.15}
#v-books .bl-c .l{font-size:12px;color:var(--ink2);padding-left:4px;line-height:1.3}
#v-books .bl-c .n{font-size:11px;color:var(--mute);padding-left:4px;margin-top:6px}
#v-books .bl-c .u{position:absolute;right:8px;top:8px;font-size:10px;background:var(--tint);color:var(--teal);border-radius:999px;padding:2px 7px}
#v-books .bl-mine .bl-c{background:linear-gradient(180deg,#fff, var(--tint))}
#v-books .bl-mine .bl-c .who{font-size:11px;color:var(--teal);padding-left:4px;margin-top:4px;line-height:1.3}
@media(max-width:520px){#v-books .bl-grid{grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:8px}#v-books .bl-c{min-height:118px}#v-books .bl-c .b{font-size:28px}}
`; document.head.appendChild(st); }catch(e){}
  const SER = {
    'OXFORD PHONICS':  { n: 'Oxford Phonics', c: '#E09A2D', st: 0, o: 1 },
    'RAZ KIDS':        { n: 'Raz Kids', c: '#8C6BB1', st: 0, o: 2 },
    'WONDERS':         { n: 'Wonders', c: '#D4705A', st: 1, o: 1 },
    'OXFORD DISCOVER': { n: 'Oxford Discover', c: '#3F6FB5', st: 1, o: 2 },
    'ROALD DAHL':      { n: 'Roald Dahl', c: '#B23A22', st: 1, o: 3 },
    'OXFORD DISCOVER FUTURES': { n: 'Discover Futures', c: '#6C9BD2', st: 2, o: 1 },
    'READING EXPLORER - 3RD EDITION': { n: 'Reading Explorer', c: '#2E8B57', st: 2, o: 2 },
    'PATHWAYS':        { n: 'Pathways', c: '#5B9EA6', st: 2, o: 3 },
    'DK ENGLISH FOR EVERYONE': { n: 'DK English', c: '#2D2A4A', st: 3, o: 1 },
    'BUSINESS PARTNER':{ n: 'Business Partner', c: '#7A7A8C', st: 3, o: 2 }
  };
  const STAGES = [['Phonics & first reading', 'sounds, letters and first little books'], ['Kids', 'courses and readers'], ['Teens & IELTS', 'reading, writing, listening, speaking'], ['Adults', 'general and business English']];
  const ser = x => SER[x.series] || { n: x.series.toLowerCase().replace(/\b\w/g, m => m.toUpperCase()), c: '#5B9EA6', st: 1, o: 9 };
  function face(x){ const L = String(x.label || ''), S = ser(x);
    let m = /·\s*Level\s+(\w+)/i.exec(L); if(m) return { b: m[1].length <= 2 ? m[1].toUpperCase() === 'AA' ? 'aa' : m[1].toUpperCase() : m[1], l: 'Level ' + m[1] };
    m = /^Oxford Phonics\s+(\d)\s*·\s*(.+)$/i.exec(L); if(m) return { b: m[1], l: m[2] };
    m = /^Wonders\s+(\w+)$/i.exec(L); if(m) return { b: m[1], l: m[1] === 'K' ? 'Kindergarten' : 'Grade ' + m[1] };
    m = /Foundation$/i.exec(L); if(m) return { b: 'F', l: 'Foundation' };
    m = /(\d+)$/.exec(L); if(m && /Discover|Explorer|Pathways|Futures/i.test(L)) return { b: m[1], l: 'Level ' + m[1] };
    if(/^DK English for Everyone$/i.test(L)) return { b: 'All', l: 'every level + guides' };
    if(/Business Partner\s+(\w+)/i.test(L)) return { b: /Business Partner\s+(\w+)/i.exec(L)[1], l: "Student's Book · Workbook" };
    if(S.n === 'Roald Dahl') return { b: 'Novels', l: 'Charlie, The BFG, The Twits', sm: true };
    return { b: L, l: '', sm: true }; }
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  function mine(LIB){ const by = {}; (D && D.students || []).forEach(s => String(s.book || '').split(/\s*[,;/]\s*/).forEach(p => { const k = norm(p); if(k) (by[k] = by[k] || []).push(s.name || s.code); }));
    const alias = { shorvowels: 'shortvowels', razbb: 'razb', letterblends: 'lettercombination', businessenglish: 'businesspartner' };
    const out = []; LIB.forEach(x => { const ks = [x.code].concat(Object.keys(alias).filter(a => alias[a] === x.code || a === x.code)); const who = [...new Set([].concat(...ks.map(k => by[k] || [])))]; if(who.length) out.push(Object.assign({ who }, x)); });
    return out; }
  let STG = -1;
  window.bkStage = i => { STG = STG === i ? -1 : i; try{ store('set', 'coe.bkstg', String(STG)); }catch(e){} window.bkLib2(window._bkL, window._bkQ); };
  try{ const v = store('get', 'coe.bkstg'); if(v != null && v !== '') STG = +v; }catch(e){}
  const card = (x, who) => { const S = ser(x), f = face(x);
    return `<button type="button" class="bl-c" style="--bc:${S.c}" onclick="bookSheet('','',${esc(JSON.stringify(x.code))})"><div><div class="s">${esc(S.n)}</div><div class="b${f.sm || String(f.b).length > 4 ? ' sm' : ''}">${esc(f.b)}</div><div class="l">${esc(f.l)}</div>${who ? `<div class="who">${esc(who.slice(0, 3).join(', '))}${who.length > 3 ? ' +' + (who.length - 3) : ''}</div>` : ''}</div><div class="n">${x.n} file${x.n === 1 ? '' : 's'}</div></button>`; };
  window.bkLib2 = function(LIB, LQ){ const v = $('v-books'); if(!v) return; window._bkL = LIB; window._bkQ = LQ || '';
    const head = `<div class="bl-hd"><div><h1>Books</h1><div class="bl-sub">Tap a book · it opens in Google Drive, no Adobe needed</div></div></div>
<input class="in-t bl-q" placeholder="Search: OD2, Raz C, Wonders 1, Pathways…" value="${esc(LQ || '')}" oninput="bkLibQ(this.value)">`;
    if(!LIB){ v.innerHTML = head + '<div class="sk"></div><div class="sk"></div>'; return; }
    const q = String(LQ || '').trim().toLowerCase(), hit = x => !q || (x.label + ' ' + x.code + ' ' + ser(x).n).toLowerCase().indexOf(q) > -1 || norm(x.label).indexOf(norm(q)) > -1;
    const M = q ? [] : mine(LIB);
    let h = head + `<div class="bl-chips">${STAGES.map((s, i) => `<button type="button" class="${STG === i ? 'on' : ''}" onclick="bkStage(${i})">${esc(s[0])}</button>`).join('')}</div>`;
    if(M.length && STG < 0) h += `<div class="bl-st"><h2>Your students' books</h2><span>the books your students use now</span></div><div class="bl-grid bl-mine">${M.sort((a, b) => b.who.length - a.who.length).map(x => card(x, x.who)).join('')}</div>`;
    let any = false;
    STAGES.forEach((s, i) => { if(STG >= 0 && STG !== i) return; const L = LIB.filter(x => ser(x).st === i && hit(x)); if(!L.length) return; any = true;
      const G = {}; L.forEach(x => (G[x.series] = G[x.series] || []).push(x));
      h += `<div class="bl-st"><h2>${esc(s[0])}</h2><span>${esc(s[1])}</span></div>` + Object.keys(G).sort((a, b) => ser({ series: a }).o - ser({ series: b }).o).map(g => { const S = ser({ series: g });
        return `<div class="bl-ser"><i style="background:${S.c}"></i>${esc(S.n)}</div><div class="bl-grid">${G[g].sort((a, b) => String(face(a).b).localeCompare(String(face(b).b), undefined, { numeric: true })).map(x => card(x)).join('')}</div>`; }).join(''); });
    if(!any) h += '<div class="mute small" style="margin-top:14px">No book matches.</div>';
    v.innerHTML = h; };
})();
