<script id="b2273">
/* 16 Nov · 2273 · The book sheet, organised by unit (Misty 18:23 "can this be better?").
   Before: UNIT 1…8 folders (PDFs only), then one long "Videos" list, then audio folders, with the Student's Book buttons misaligned.
   Now each unit is one row with everything for it: "Unit 1 · Aa Bb Cc" + 📄 3 · ▶ 3 · 🔊 36. Tap to open: the unit's pages (open in Drive),
   its videos (play here) and its audio (by exercise, play here). The unit the student's last class ended on is pinned on top and open.
   The main books (Student's Book, Workbook, Teacher's guide) are clean buttons; other files (readers, tests…) under "More"; a search box
   for big books. Audio, video, the books rule, the one-tap class-card links and the open log keep working (same links underneath). */
(function(){
  try{ const st = document.createElement('style'); st.textContent = `
#bkBody .b3-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:6px 0 2px}
#bkBody .b3-head h2{margin:0}
#bkBody .b3-cnt{font-size:12.5px;color:var(--mute,#7A7F8A)}
#bkBody .b3-main{display:flex;flex-wrap:wrap;gap:8px;margin:10px 0 4px}
#bkBody .b3-main a{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:8px 16px;border-radius:12px;border:1px solid var(--line,#E3E1EA);background:#fff;color:var(--ink,#2B2450);font-weight:700;text-decoration:none;box-shadow:0 1px 2px rgba(45,42,74,.06)}
#bkBody .b3-main a:hover{border-color:#13636B}
#bkBody .b3-main a .k{font-size:16px}
#bkBody .b3-pin{border:1.5px solid #13636B;background:#F2F9F9;border-radius:16px;padding:10px 12px;margin:12px 0 6px}
#bkBody .b3-pin .t{font-size:12.5px;color:#13636B;font-weight:700;margin-bottom:4px}
#bkBody details.b3u{border:1px solid #ECEAF2;border-radius:14px;margin-top:8px;background:#fff}
#bkBody details.b3u>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:10px;padding:11px 14px;min-height:48px}
#bkBody details.b3u>summary::-webkit-details-marker{display:none}
#bkBody details.b3u>summary .ar{color:#9A97AE;transition:transform .15s}
#bkBody details.b3u[open]>summary .ar{transform:rotate(90deg)}
#bkBody details.b3u>summary b{font-size:15px;white-space:nowrap}
#bkBody details.b3u>summary .sub{flex:1;min-width:0;color:var(--mute,#7A7F8A);font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#bkBody details.b3u>summary .pills{display:flex;gap:4px;flex:none}
#bkBody .b3p{font-size:11.5px;font-weight:700;border-radius:999px;padding:3px 8px;background:#F3F2F7;color:#4C4868;white-space:nowrap}
#bkBody .b3p.v{background:#FDF0EC;color:#B4513B}#bkBody .b3p.a{background:#EAF5F5;color:#13636B}
#bkBody .b3-in{padding:2px 14px 12px}
#bkBody .b3-lbl{font-size:12px;font-weight:700;color:var(--mute,#7A7F8A);margin:10px 0 4px;text-transform:uppercase;letter-spacing:.03em}
#bkBody .b3-in a.link{display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px dashed #E3E8EC;text-decoration:none}
#bkBody .b3-in a.link:last-child{border-bottom:0}
#bkBody .b3-in details{margin-top:4px}
#bkBody .b3-in details>summary{cursor:pointer;font-size:13px;font-weight:700;color:#13636B;padding:6px 0}
#bkBody .b3-q{width:100%;margin:10px 0 2px}
#bkBody .b3-sec{font-size:13px;font-weight:800;color:var(--ink,#2B2450);margin:16px 0 2px}
#bkBody .b3-note{font-size:12px;color:var(--mute,#7A7F8A);margin-top:14px}
`; document.head.appendChild(st); }catch(e){}
  const E = s => (typeof esc === 'function' ? esc(s) : String(s == null ? '' : s));
  const nat = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
  const NONE = /^(freetalk|debate|ielts\w*|academicwriting|conversation|trial|review)$/;
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const codes = s => String(s || '').split(/\s*[,;/]\s*/).map(x => x.trim()).filter(p => p && !/^(pre[-\s]?)?[abc][12]\+?$/i.test(p)).map(norm).filter(x => x && !NONE.test(x));
  const url = f => 'https://drive.google.com/file/d/' + encodeURIComponent(f.id) + '/view';
  function aParse(name){ const base = String(name).replace(/\.(mp3|m4a|wav|ogg|aac)$/i, '');
    let m = /^b\d+_[a-z]+_(\d+)_(\d+)(?:_(.*))?$/i.exec(base); if(m) return { u: +m[1] };
    m = /(?:^|_)(?:SB|WB)\d*_(\d+)\.(\d+)$/i.exec(base); return m ? { u: +m[1] } : null; }
  function unitOf(f){ if(f.kind === 'audio'){ const p = aParse(f.name); if(p) return p.u; }
    const g = String(f.group || ''); let m = /^(\d+)$/.exec(g.split(' / ').slice(-1)[0] || ''); if(m) return +m[1];
    m = /\bunit\s*0?(\d+)\b/i.exec(g) || /\bunit\s*0?(\d+)\b/i.exec(f.name) || /(?:^|[^A-Z])U0?(\d+)(?=L|W|[^0-9]|$)/.exec(f.name); return m ? +m[1] : null; }
  const isMain = f => f.kind === 'pdf' && ((!f.group && /student|workbook|work book|course book|teacher|answer|\bTG\b/i.test(f.name)) || /^(student|workbook)/i.test(f.name));
  const mainLabel = f => { const n = f.name; if(/work\s*book/i.test(n)) return ['✏️', 'Workbook · homework']; if(/teacher|\bTG\b/i.test(n)) return ['🧑‍🏫', "Teacher's guide"]; if(/answer/i.test(n)) return ['✅', 'Answer key']; return ['📘', "Student's Book"]; };
  function stuNotes(stu){ try{ const k = (typeof STU_CACHE !== 'undefined' && STU_CACHE[stu]) || (typeof STU !== 'undefined' && STU && STU.code === stu && STU.r) || JSON.parse(store('get', 'coe.stu.' + stu) || 'null'); return (k && k.notes) || []; }catch(e){ return []; } }
  const unitIn = t => { const m = /unit\s*(\d+)/i.exec(String(t || '')) || /\bU(\d+)(?=L|W|\b)/i.exec(String(t || '')); return m ? +m[1] : null; };
  function last(stu){ if(!stu) return { u: null, t: '' }; const s = (D.students || []).find(x => x.code === stu) || {}; let t = (s.note && s.note.ended) || '';
    if(unitIn(t) == null){ const n = stuNotes(stu).find(y => unitIn(y.ended) != null); if(n) t = n.ended; } return { u: unitIn(t), t }; }
  /* a short line under each unit: letters, word families or the video titles */
  function subOf(vids){ const t = vids.map(v => String(v.name).replace(/^Unit \d+\s*·\s*/i, ''));
    const L = t.map(x => (/^Letter (\w\w)/.exec(x) || [])[1]).filter(Boolean); if(L.length) return L.join(' ');
    const W = t.map(x => (/^(-\w+) words$/.exec(x) || /^short (\w) sound$/.exec(x) || [])[1]).filter(Boolean); if(W.length) return W.join(' · ');
    const R = t.filter(x => !/^(Reflect|video$)/i.test(x)).map(x => x.replace(/\s*·.*$/, '')); return [...new Set(R)].slice(0, 2).join(' · '); }
  const a = (f, txt) => `<a class="link" href="${url(f)}" target="_blank" rel="noopener">${f.kind === 'video' ? '▶ ' : f.kind === 'audio' ? '♪ ' : ''}${E(txt || f.name)}</a>`;
  function unitBlock(u, F, open){ const P = F.filter(f => f.kind === 'pdf').sort((x, y) => nat(x.name, y.name)), V = F.filter(f => f.kind === 'video').sort((x, y) => nat(x.name, y.name)), A = F.filter(f => f.kind === 'audio');
    const sub = subOf(V);
    return `<details class="b3u"${open ? ' open' : ''}><summary><span class="ar">▸</span><b>Unit ${u}</b><span class="sub">${E(sub)}</span><span class="pills">${P.length ? `<span class="b3p">📄 ${P.length}</span>` : ''}${V.length ? `<span class="b3p v">▶ ${V.length}</span>` : ''}${A.length ? `<span class="b3p a">🔊 ${A.length}</span>` : ''}</span></summary><div class="b3-in">`
      + (P.length ? `<div class="b3-lbl">Pages · open in Drive</div>${P.map(f => a(f, f.name.replace(/^.*?(U\d+L\d+.*)$/i, '$1'))).join('')}` : '')
      + (V.length ? `<div class="b3-lbl">Videos · play here</div>${V.map(f => a(f, String(f.name).replace(/^Unit \d+\s*·\s*/i, ''))).join('')}` : '')
      + (A.length ? `<div class="b3-lbl">Audio · play here</div><details class="b3a"><summary><b>Unit ${u}</b> <span class="mute">· ${A.length} audio</span></summary><div>${A.map(f => a(f)).join('')}</div></details>` : '')
      + `</div></details>`; }
  async function render(stu, evId, only){ const body = $('bkBody'); if(!body || !window.bkGet) return;
    const s = (D.students || []).find(x => x.code === stu) || {}, c = (D.schedule || []).find(x => x.id === evId) || {};
    const list = only ? [norm(only)] : codes(c.book || s.book); if(!list.length) return;
    const L = last(stu); let html = '';
    for(const k of list){ let b = null; try{ b = await bkGet(k); }catch(e){ return; } if(!b || !(b.files || []).length) return;
      const F = b.files, M = F.filter(isMain).sort((x, y) => (/student|course/i.test(y.name) - /student|course/i.test(x.name)) || nat(x.name, y.name));
      const U = {}, other = {}; F.filter(f => !M.includes(f)).forEach(f => { const u = unitOf(f); if(u != null && u < 200) (U[u] = U[u] || []).push(f); else { const g = (String(f.group || '').split(' / ').slice(-1)[0]) || (f.kind === 'video' ? 'Videos' : 'Files'); (other[g] = other[g] || []).push(f); } });
      const units = Object.keys(U).map(Number).sort((x, y) => x - y), nP = F.filter(f => f.kind === 'pdf').length, nV = F.filter(f => f.kind === 'video').length, nA = F.filter(f => f.kind === 'audio').length;
      html += `<div class="b3-head"><h2>${E(b.label || k)}</h2><span class="b3-cnt">${[nP ? '📄 ' + nP : '', nV ? '▶ ' + nV : '', nA ? '🔊 ' + nA : ''].filter(Boolean).join(' · ')}${units.length ? ' · ' + units.length + ' units' : ''}</span></div>`;
      if(M.length) html += `<div class="b3-main">${M.map(f => { const [ic, t] = mainLabel(f); return `<a href="${url(f)}" target="_blank" rel="noopener"><span class="k">${ic}</span>${E(t + (M.filter(g => mainLabel(g)[1] === t).length > 1 ? ' · ' + f.name : ''))}</a>`; }).join('')}</div>`;
      if(F.length > 40) html += `<input class="in-t b3-q" placeholder="Search this book · e.g. unit 4, letter m, -at, workbook" oninput="b3Find(this.value)">`;
      const pin = L.u != null && U[L.u] ? L.u : null;
      if(pin != null) html += `<div class="b3-pin"><div class="t">📍 Where the last class ended${L.t ? ' · ' + E(L.t) : ''}</div>${unitBlock(pin, U[pin], true)}${U[pin + 1] ? unitBlock(pin + 1, U[pin + 1], false).replace('<b>Unit ' + (pin + 1) + '</b>', '<b>Unit ' + (pin + 1) + '</b> <span class="b3p">next</span>') : ''}</div>`;
      if(units.length) html += `<div class="b3-sec">${pin != null ? 'All units' : 'Units'}</div>` + units.map(u => unitBlock(u, U[u], false)).join('');
      const og = Object.keys(other).sort(nat); if(og.length) html += `<div class="b3-sec">More</div>` + og.map(g => { const fs = other[g].sort((x, y) => nat(x.name, y.name)), kinds = new Set(fs.map(f => f.kind));
        return `<details class="b3u"><summary><span class="ar">▸</span><b>${E(g.replace(/^[A-Z0-9 &'-]+$/, w => w.charAt(0) + w.slice(1).toLowerCase()))}</b><span class="sub"></span><span class="pills"><span class="b3p${kinds.has('video') ? ' v' : kinds.has('audio') ? ' a' : ''}">${kinds.has('video') ? '▶' : kinds.has('audio') ? '🔊' : '📄'} ${fs.length}</span></span></summary><div class="b3-in">${kinds.size === 1 && kinds.has('audio') ? `<details class="b3a" open><summary><b>${E(g)}</b></summary><div>${fs.map(f => a(f)).join('')}</div></details>` : fs.map(f => a(f)).join('')}</div></details>`; }).join('');
    }
    if(!html) return;
    html += `<div class="row" style="margin-top:14px;gap:8px;flex-wrap:wrap"><button class="btn ghost grow" onclick="closeSheet();go('books')">All books</button></div><div class="b3-note">Pages open in Google Drive · videos and audio play here in the app.</div>`;
    body.innerHTML = html; delete body.dataset.au;
    body.insertAdjacentHTML('afterbegin', '<span class="bk-um" hidden></span>');   /* 2270's extra row is not needed: the pinned unit already has everything */
    try{ window.auEnhance && auEnhance(); }catch(e){}
    body.querySelectorAll('.small.mute').forEach(x => { if(/^Audio: open a unit/.test(x.textContent || '')) x.remove(); });
    body.querySelectorAll('details.b3a').forEach(d => { const sm = d.querySelector('summary'); if(sm) sm.innerHTML = '🔊 Audio by exercise <span class="mute">· tap a number to play</span>'; });
    if(window._bkJump && Date.now() - _bkJump.t < 8000 && window.bkJumpTo){ const j = _bkJump; window._bkJump = null; setTimeout(() => { const d = [...body.querySelectorAll('details.b3u')].find(x => ((x.querySelector('summary b') || {}).textContent || '') === 'Unit ' + j.u); if(d){ d.open = true; if(j.kind === 'a'){ const aa = d.querySelector('details.b3a'); if(aa) aa.open = true; } d.scrollIntoView({ block: 'start' }); } }, 60); }
  }
  window.b3Find = function(q){ q = String(q || '').trim().toLowerCase(); const body = $('bkBody'); if(!body) return;
    body.querySelectorAll('details.b3u').forEach(d => { if(!q){ d.style.display = ''; d.querySelectorAll('a.link, .au-ex').forEach(x => x.style.display = ''); return; }
      const head = (d.querySelector('summary').textContent || '').toLowerCase(); let any = head.includes(q);
      d.querySelectorAll('a.link, .au-ex').forEach(x => { const hit = head.includes(q) || (x.textContent || '').toLowerCase().includes(q); x.style.display = hit ? '' : 'none'; if(hit) any = true; });
      d.style.display = any ? '' : 'none'; if(any && !head.includes(q)) d.open = true; }); };
  const S0 = window.bookSheet; if(S0) window.bookSheet = function(stu, evId, only){ const r = S0.apply(this, arguments); Promise.resolve(r).then(() => setTimeout(() => { render(stu, evId, only).catch(() => {}); }, 30), () => {}); return r; };
})();
</script>
