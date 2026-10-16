/* 16 Oct · 246 · Books: a teacher opens only the books of the students in their own classes (Misty 20:31; the server checks it:
   coe-mgmt › books, coe_teacher_books). The library becomes a map of the teacher's books: "By book" (each cover lists the students
   using it) or "By student" (each student with their book). Colours are the calendar's book colours (Phonics yellow,
   Oxford Discover blue, Raz red, Wonders orange/pink, Reading Explorer green), the others in the same calendar palette. */
(function(){
  try{ const st = document.createElement('style'); st.textContent = `
#v-books .bl-c{border-radius:14px;padding:14px 12px 10px;background:linear-gradient(180deg,var(--bt) 0,#fff 78%);border:1px solid var(--line)}
#v-books .bl-c::before{left:0;right:0;top:0;bottom:auto;width:auto;height:6px;background:var(--bc)}
#v-books .bl-c .s{color:var(--ink2);display:flex;align-items:center;gap:6px}
#v-books .bl-c .s i{width:8px;height:8px;border-radius:50%;background:var(--bc);display:inline-block;flex:none}
#v-books .bl-c .who{font-size:11.5px;color:var(--ink2);padding-left:4px;margin-top:6px;line-height:1.35}
#v-books .bl-c .who b{color:var(--ink);font-weight:700}
#v-books .bl-tog{display:inline-flex;border:1px solid var(--line);border-radius:999px;overflow:hidden;background:#fff}
#v-books .bl-tog button{border:0;background:none;padding:7px 14px;font:inherit;font-size:13px;color:var(--ink2);cursor:pointer}
#v-books .bl-tog button.on{background:var(--ink);color:#fff}
#v-books .bl-note{margin:10px 0 2px;padding:10px 12px;border-radius:10px;background:var(--tint);color:var(--ink2);font-size:13px;line-height:1.45}
#v-books .bl-stu{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:8px;margin-top:12px}
#v-books .bl-sr{display:flex;align-items:center;gap:10px;padding:9px 10px;border:1px solid var(--line);border-radius:12px;background:#fff}
#v-books .bl-sr .nm{font-weight:700;color:var(--ink);min-width:0;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#v-books .bl-pill{border:0;border-radius:999px;padding:5px 10px;font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;color:var(--ink);background:var(--bt);box-shadow:inset 0 0 0 1.5px var(--bc);white-space:nowrap}
#v-books .bl-av{width:30px;height:30px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;font-family:var(--brand);color:#fff;background:var(--bc)}
`; document.head.appendChild(st); }catch(e){}
  const C = [[/^(thealphabet|shor?tvowels|longvowels|consonantblends|letter\w*)$/, '#F6BF26', 'Oxford Phonics', 0, 1], [/^raz/, '#D50000', 'Raz Kids', 0, 2],
    [/^wondersgk$/, '#F4511E', 'Wonders', 1, 1], [/^wonders/, '#E67C73', 'Wonders', 1, 1], [/^od\d/, '#3F51B5', 'Oxford Discover', 1, 2], [/^roalddahl$/, '#795548', 'Roald Dahl', 1, 3],
    [/^odf/, '#7986CB', 'Discover Futures', 2, 1], [/^re(f|\d)$/, '#0B8043', 'Reading Explorer', 2, 2], [/^pathways/, '#33B679', 'Pathways', 2, 3],
    [/^dk/, '#616161', 'DK English', 3, 1], [/^business/, '#8E24AA', 'Business Partner', 3, 2]];
  const sty = x => { const m = C.find(y => y[0].test(x.code)) || [0, '#5B9EA6', x.series, 1, 9]; return { c: m[1], n: m[2], st: m[3], o: m[4] }; };
  const STAGES = [['Phonics & first reading', 'sounds, letters and first little books'], ['Kids', 'courses and readers'], ['Teens & IELTS', 'reading, writing, listening, speaking'], ['Adults', 'general and business English']];
  function face(x){ const L = String(x.label || ''); let m;
    if((m = /·\s*Level\s+(\w+)/i.exec(L))) return { b: m[1].toUpperCase() === 'AA' ? 'aa' : m[1].length <= 2 ? m[1].toUpperCase() : m[1], l: 'Level ' + m[1] };
    if((m = /^Oxford Phonics\s+(\d)\s*·\s*(.+)$/i.exec(L))) return { b: m[1], l: m[2] };
    if((m = /^Wonders\s+(\w+)$/i.exec(L))) return { b: m[1], l: m[1] === 'K' ? 'Kindergarten' : 'Grade ' + m[1] };
    if(/Foundation$/i.test(L)) return { b: 'F', l: 'Foundation' };
    if((m = /(\d+)$/.exec(L)) && /Discover|Explorer|Pathways|Futures/i.test(L)) return { b: m[1], l: 'Level ' + m[1] };
    if(/^DK English for Everyone$/i.test(L)) return { b: 'All', l: 'every level + guides' };
    if((m = /Business Partner\s+(\w+)/i.exec(L))) return { b: m[1], l: "Student's Book · Workbook" };
    if(/Roald Dahl/i.test(L)) return { b: 'Novels', l: 'Charlie · The BFG · The Twits', sm: true };
    return { b: L, l: '', sm: true }; }
  const okey = x => { const b = String(face(x).b); return /^(F|aa|K|All)$/.test(b) ? '0' : b.length === 1 && /[A-Z]/.test(b) ? '1' + b : b.replace(/^(\d+)$/, '1$1'); };   /* Foundation, aa, K first, then levels 1, 2, 3… / A, B, C… */
  const tint = c => c + '24';
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  let MODE = 'book'; try{ MODE = store('get', 'coe.bkmode') || 'book'; }catch(e){}
  window.bkMode = m => { MODE = m; try{ store('set', 'coe.bkmode', m); }catch(e){} window.bkLib2(window._bkL, window._bkQ); };
  const open = x => `bookSheet('','',${esc(JSON.stringify(x.code))})`;
  const card = x => { const S = sty(x), f = face(x), who = x.who || [];
    return `<button type="button" class="bl-c" style="--bc:${S.c};--bt:${tint(S.c)}" onclick="${open(x)}"><div><div class="s"><i></i>${esc(S.n)}</div><div class="b${f.sm || String(f.b).length > 4 ? ' sm' : ''}">${esc(f.b)}</div><div class="l">${esc(f.l)}</div>${who.length ? `<div class="who"><b>${who.length}</b> · ${esc(who.slice(0, 4).join(', '))}${who.length > 4 ? ' +' + (who.length - 4) : ''}</div>` : ''}</div><div class="n">${x.n} file${x.n === 1 ? '' : 's'}</div></button>`; };
  window.bkLib2 = function(LIB, LQ){ const v = $('v-books'); if(!v) return; window._bkL = LIB; window._bkQ = LQ || '';
    const teach = !!(LIB && LIB.some && LIB.some(x => x.who)), others = window._bkOthers || 0;
    const head = `<div class="bl-hd"><div><h1>Books</h1><div class="bl-sub">Tap a book · it opens in Google Drive, no Adobe needed</div></div>${teach ? `<div class="bl-tog"><button type="button" class="${MODE !== 'stu' ? 'on' : ''}" onclick="bkMode('book')">By book</button><button type="button" class="${MODE === 'stu' ? 'on' : ''}" onclick="bkMode('stu')">By student</button></div>` : ''}</div>
<input class="in-t bl-q" placeholder="${teach ? 'Search a book or a student' : 'Search: OD2, Raz C, Wonders 1, Pathways…'}" value="${esc(LQ || '')}" oninput="bkLibQ(this.value)">`;
    if(!LIB){ v.innerHTML = head + '<div class="sk"></div><div class="sk"></div>'; return; }
    const q = String(LQ || '').trim().toLowerCase(), hit = x => !q || (x.label + ' ' + x.code + ' ' + sty(x).n + ' ' + (x.who || []).join(' ')).toLowerCase().indexOf(q) > -1 || norm(x.label).indexOf(norm(q)) > -1;
    let h = head;
    if(teach) h += `<div class="bl-note">These are the books of the students in your classes${others ? ` · the other ${others} books open when one of your students starts them` : ''}.</div>`;
    if(!LIB.length){ v.innerHTML = h + '<div class="mute small" style="margin-top:14px">None of your students has a course book with a file yet.</div>'; return; }
    if(teach && MODE === 'stu'){ const by = {}; LIB.forEach(x => (x.who || []).forEach(w => (by[w] = by[w] || []).push(x)));
      const names = Object.keys(by).filter(w => !q || w.toLowerCase().indexOf(q) > -1 || by[w].some(hit)).sort((a, b) => a.localeCompare(b));
      v.innerHTML = h + (names.length ? `<div class="bl-stu">${names.map(w => { const B = by[w].sort((a, b) => sty(a).st - sty(b).st || sty(a).o - sty(b).o), S0 = sty(B[0]);
        return `<div class="bl-sr"><div class="bl-av" style="--bc:${S0.c}">${esc(w[0] || '?')}</div><div class="nm">${esc(w)}</div>${B.map(x => { const S = sty(x), f = face(x); return `<button type="button" class="bl-pill" style="--bc:${S.c};--bt:${tint(S.c)}" onclick="${open(x)}">${esc(S.n.split(' ').map(p => p[0]).join('').toUpperCase())} ${esc(f.b)}</button>`; }).join('')}</div>`; }).join('')}</div>` : '<div class="mute small" style="margin-top:14px">No match.</div>');
      return; }
    let any = false;
    STAGES.forEach((s, i) => { const L = LIB.filter(x => sty(x).st === i && hit(x)); if(!L.length) return; any = true;
      const G = {}; L.forEach(x => { const n = sty(x).n; (G[n] = G[n] || []).push(x); });
      h += `<div class="bl-st"><h2>${esc(s[0])}</h2><span>${esc(s[1])}</span></div>` + Object.keys(G).sort((a, b) => sty(G[a][0]).o - sty(G[b][0]).o).map(g => `<div class="bl-ser"><i style="background:${sty(G[g][0]).c}"></i>${esc(g)}</div><div class="bl-grid">${G[g].sort((a, b) => okey(a).localeCompare(okey(b), undefined, { numeric: true })).map(card).join('')}</div>`).join(''); });
    if(!any) h += '<div class="mute small" style="margin-top:14px">No book matches.</div>';
    v.innerHTML = h; };
})();
