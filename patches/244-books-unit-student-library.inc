/* 16 Oct · 244 · Course books, three places (Misty 20:22 "yes all 3"):
   1. Class card: "OD1 · Unit 4 ›" opens the unit the last class ended on in one tap (from the class note), "All" opens the list.
      When the unit is not known or has no PDF of its own, "Book ›" as before.
   2. Student page (teachers): a Course book card · that unit and the next, the Workbook with the last workbook page given, All files.
   3. Books library in the teacher menu: every book by series, with a search, without picking a student (subs, trials, extra readers).
   Files open in Google Drive's own viewer: no Adobe, original pages. Lists from coe-mgmt › books. Replaces 243's bookSheet. */
(function(){
  const NONE = /^(freetalk|debate|ielts\w*|academicwriting|conversation|trial|review)$/;
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const codes = s => String(s || '').split(/\s*[,;/]\s*/).map(x => x.trim()).filter(p => p && !/^(pre[-\s]?)?[abc][12]\+?$/i.test(p)).map(norm).filter(x => x && !NONE.test(x));
  window.bkHas = s => codes(s).length > 0;
  const BK = {}, BKF = {};
  const cached = k => { if(BK[k]) return BK[k]; try{ const c = JSON.parse(store('get', 'coe.bk.' + k) || 'null'); if(c && Date.now() - c.t < 3 * 864e5){ BK[k] = c; return c; } }catch(e){} return null; };
  function bkFetch(k){ if(BKF[k]) return BKF[k];
    const p = fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'books', token: TOKEN, code: k }) }).then(x => x.json()).then(r => {
      if(!r || !r.ok) throw new Error('books'); const o = { b: r.book, t: Date.now() }; BK[k] = o; try{ store('set', 'coe.bk.' + k, JSON.stringify(o)); }catch(e){} return r.book; });
    BKF[k] = p; p.then(() => delete BKF[k], () => delete BKF[k]); return p; }
  async function bkGet(k){ k = norm(k); const c = cached(k); if(c && Date.now() - c.t < 6 * 36e5) return c.b; if(c){ bkFetch(k).catch(() => {}); return c.b; } return bkFetch(k); }
  window.bkGet = bkGet;
  const url = f => 'https://drive.google.com/file/d/' + encodeURIComponent(f.id) + '/view';
  const nat = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
  const unitRe = n => new RegExp('(?:\\bunit\\s*0?' + n + '(?!\\d))|(?:\\bU0?' + n + '(?=L|W|[^0-9]|$))', 'i');
  const isMain = f => (!f.group && /student|workbook|work book|course book|teacher|answer|\bTG\b/i.test(f.name)) || /^(student|workbook)/i.test(f.name);
  const label = f => { const n = f.name; if(/work\s*book/i.test(n)) return 'Workbook · homework'; if(/teacher|\bTG\b/i.test(n)) return "Teacher's guide"; if(/answer/i.test(n)) return 'Answer key';
    if(/student|course book/i.test(n)) return "Student's Book"; return n; };
  const icon = f => f.kind === 'video' ? '▶ ' : f.kind === 'audio' ? '♪ ' : '';
  const a = (f, t, cls) => `<a class="${cls || 'btn ghost'}" style="${cls ? '' : 'margin:4px 6px 0 0;display:inline-block'}" href="${url(f)}" target="_blank" rel="noopener">${icon(f)}${esc(t || f.name)}</a>`;
  const wbOf = s => { const m = /(?:WB|work\s*book)\s*(?:p\.?|pages?)?\s*(\d+)(?:\s*[-–]\s*(\d+))?/i.exec(String(s || '')); return m ? +(m[2] || m[1]) : null; };
  function stuNotes(stu){ try{ const k = (typeof STU_CACHE !== 'undefined' && STU_CACHE[stu]) || (typeof STU !== 'undefined' && STU && STU.code === stu && STU.r) || JSON.parse(store('get', 'coe.stu.' + stu) || 'null'); return (k && k.notes) || []; }catch(e){ return []; } }
  function lastUnit(stu){ if(!stu) return { text: '', unit: null }; const s = (D.students || []).find(x => x.code === stu) || {}; let t = (s.note && s.note.ended) || '';
    if(!t){ const n = stuNotes(stu).find(y => y.ended); if(n) t = n.ended; }
    const m = /unit\s*(\d+)/i.exec(t) || /\bU(\d+)(?=L|W|\b)/i.exec(t); return { text: t, unit: m ? +m[1] : null }; }
  function lastWb(stu){ for(const n of stuNotes(stu)){ const w = wbOf(n.homework); if(w != null) return w; } return null; }
  const unitFiles = (b, n) => (b && b.files || []).filter(f => f.kind === 'pdf' && unitRe(n).test(f.name)).sort((x, y) => nat(x.name, y.name));
  const workbook = b => (b && b.files || []).filter(f => f.kind === 'pdf' && /work\s*book/i.test(f.name) && !/audio/i.test(f.name))[0];

  /* 1 · class card */
  let RD = 0; const redraw = () => { clearTimeout(RD); RD = setTimeout(() => { try{ if(!document.querySelector('#sheet.on') && (VIEW === 'today' || VIEW === 'tsched')) render(); }catch(e){} }, 400); };
  window.bkCard = function(c, s){ const L = codes(c.book || s.book); if(!L.length) return '';
    const k = L[0], hit = cached(k), U = lastUnit(c.code), all = `<a class="link" onclick="bookSheet('${esc(c.code)}','${esc(c.id)}')">`;
    if(!hit){ bkFetch(k).then(redraw, () => {}); return ` · ${all}Book ›</a>`; }
    if(U.unit != null){ const f = unitFiles(hit.b, U.unit); if(f.length === 1) return ` · <a class="link" href="${url(f[0])}" target="_blank" rel="noopener">${esc(k.toUpperCase())} · Unit ${U.unit} ›</a> · ${all}All</a>`;
      if(f.length > 1) return ` · ${all}${esc(k.toUpperCase())} · Unit ${U.unit} ›</a>`; }
    return (hit.b && (hit.b.files || []).length) ? ` · ${all}Book ›</a>` : ''; };

  /* the book sheet (from a class, a student, or the library) */
  window.bookSheet = async function(stu, evId, only){
    const s = (D.students || []).find(x => x.code === stu) || {}, c = (D.schedule || []).find(x => x.id === evId) || {};
    const list = only ? [norm(only)] : codes(c.book || s.book); if(!list.length) return toast('No course book saved for this student');
    openSheet(`<h1>Course book</h1><div class="mute small">${stu ? esc(c.student || s.name || stu) + ' · ' + esc(c.book || s.book || '') : 'Books library'}</div><div id="bkBody" style="margin-top:12px"><div class="sk"></div><div class="sk"></div></div>`);
    const L = lastUnit(stu), wb = stu ? lastWb(stu) : null; let html = '';
    for(const k of list){ let b = null; try{ b = await bkGet(k); }catch(e){ html += `<div class="mute small" style="margin-top:8px">Could not load the book list. Check your internet and try again.</div>`; continue; }
      if(!b || !(b.files || []).length){ html += `<h2>${esc(k.toUpperCase())}</h2><div class="mute small">No book file for this code yet · management can add it in Drive › COURSEWARE.</div>`; continue; }
      const F = b.files.filter(f => f.kind === 'pdf'), O = b.files.filter(f => f.kind !== 'pdf');
      html += `<h2>${esc(b.label || k)}</h2>`;
      if(L.unit != null){ const u = [L.unit, L.unit + 1].map(n => ({ n, f: unitFiles(b, n) })).filter(x => x.f.length);
        if(u.length) html += `<div class="small mute" style="margin-top:2px">Last class ended: ${esc(L.text)}</div>` + u.map(x => `<div class="small" style="margin-top:8px"><b>Unit ${x.n}${x.n === L.unit ? ' · where you ended' : ' · next'}</b></div><div>${x.f.map(f => a(f, x.f.length > 1 ? f.name.replace(/^.*?(U\d+L\d+.*)$/i, '$1') : 'Open Unit ' + x.n)).join('')}</div>`).join(''); }
      const M = F.filter(isMain).sort((x, y) => (/work/i.test(y.name) - /work/i.test(x.name)) || nat(x.name, y.name));
      if(M.length) html += `<div class="small" style="margin-top:10px"><b>Books</b>${wb != null && M.some(f => /work/i.test(f.name)) ? ` <span class="mute">· last workbook page given: ${wb}</span>` : ''}</div><div>${M.map(f => a(f, label(f) + (M.filter(g => label(g) === label(f)).length > 1 ? ' · ' + f.name : ''))).join('')}</div>`;
      const G = {}; F.filter(f => !M.includes(f)).concat(O).forEach(f => { const g = f.group || 'Files'; (G[g] = G[g] || []).push(f); });
      Object.keys(G).sort(nat).forEach(g => { const fs = G[g].sort((x, y) => nat(x.name, y.name));
        html += `<details style="margin-top:8px"${Object.keys(G).length === 1 && !M.length ? ' open' : ''}><summary class="small"><b>${esc(g.split(' / ').slice(-1)[0] || 'Files')}</b> <span class="mute">· ${fs.length}</span></summary><div style="max-height:46vh;overflow:auto;margin-top:4px">${fs.map(f => `<div style="padding:6px 0;border-bottom:1px dashed #E3E8EC">${a(f, f.name, 'link')}</div>`).join('')}</div></details>`; });
    }
    html += `<div class="row" style="margin-top:14px;gap:8px;flex-wrap:wrap"><button class="btn ghost grow" onclick="closeSheet();go('books')">All books</button></div><div class="small mute" style="margin-top:10px">Opens in Google Drive (browser or the Drive app) · no Adobe needed · sign in to Google with the email you use for this app.</div>`;
    const el = $('bkBody'); if(el) el.innerHTML = html;
  };

  /* 2 · student page (teachers) */
  const sr0 = window.stuRender; if(sr0) window.stuRender = function(){ const r = sr0.apply(this, arguments);
    try{ if(D && !D.mgr && STU && STU.code && STU.s && bkHas(STU.s.book) && !$('stuBk')){ const row = document.querySelector('#sheetBody .row.noprint');
      if(row){ row.insertAdjacentHTML('afterend', `<div id="stuBk" style="margin-top:14px"><h2>Course book</h2><div class="sk"></div></div>`); const code = STU.code, k = codes(STU.s.book)[0];
        bkGet(k).then(b => { const el = $('stuBk'); if(!el || !STU || STU.code !== code) return; if(!b || !(b.files || []).length){ el.remove(); return; }
          const U = lastUnit(code), wb = lastWb(code), w = workbook(b), uf = U.unit != null ? unitFiles(b, U.unit) : [], nf = U.unit != null ? unitFiles(b, U.unit + 1) : [];
          el.innerHTML = `<h2>Course book <span class="c">${esc(b.label || k)}</span></h2>${U.text ? `<div class="small mute">Last class ended: ${esc(U.text)}</div>` : ''}<div>`
            + (uf.length === 1 ? a(uf[0], 'Unit ' + U.unit) : '') + (nf.length === 1 ? a(nf[0], 'Unit ' + (U.unit + 1) + ' · next') : '')
            + (w ? a(w, 'Workbook' + (wb != null ? ' · last p. ' + wb : '')) : '')
            + `<button class="btn ghost" style="margin:4px 6px 0 0" onclick="bookSheet('${esc(code)}','')">All files</button></div>`; }).catch(() => { const el = $('stuBk'); if(el) el.remove(); }); } } }catch(e){}
    return r; };

  /* 3 · the Books library (teacher menu) */
  try{ if(!NAV_T.some(x => x[0] === 'books')) NAV_T.push(['books', 'Books', 'book']); if(VIEWS.indexOf('books') < 0) VIEWS.push('books');
    if(!$('v-books') && $('v-today')){ const d = document.createElement('div'); d.id = 'v-books'; d.className = 'hide'; $('v-today').parentNode.appendChild(d); } }catch(e){}
  let LIB = null, LQ = '';
  const SER = s => String(s || '').toLowerCase().replace(/\b\w/g, x => x.toUpperCase()).replace(/ - 3rd Edition/i, ' · 3rd edition').replace(/^Dk /, 'DK ');
  function renderBooks(){ const v = $('v-books'); if(!v) return; const q = LQ.trim().toLowerCase();
    if(!LIB){ v.innerHTML = `<div class="hd"><h1>Books</h1></div><div class="sk"></div><div class="sk"></div>`; return; }
    const G = {}; LIB.filter(x => !q || (x.label + ' ' + x.code + ' ' + x.series).toLowerCase().indexOf(q) > -1).forEach(x => (G[x.series] = G[x.series] || []).push(x));
    v.innerHTML = `<div class="hd"><h1>Books</h1><div class="mute small">Every course book in Drive › COURSEWARE · opens in Google Drive, no Adobe needed</div></div>
<input class="in-t" style="width:100%;margin:10px 0 4px" placeholder="Search a book, e.g. OD2, Raz, Wonders" value="${esc(LQ)}" oninput="bkLibQ(this.value)">
${Object.keys(G).sort(nat).map(g => `<h2 style="margin-top:16px">${esc(SER(g))}</h2><div>${G[g].sort((x, y) => nat(x.label, y.label)).map(x => `<button class="btn ghost" style="margin:4px 6px 0 0" onclick="bookSheet('','',${esc(JSON.stringify(x.code))})">${esc(x.label.replace(/^(Oxford Discover|Reading Explorer|Raz Kids ·|Wonders|Pathways|Oxford Phonics) ?/, '') || x.label)} <span class="mute small">· ${x.n}</span></button>`).join('')}</div>`).join('') || '<div class="mute small" style="margin-top:12px">No book matches.</div>'}`;
  }
  window.bkLibQ = t => { LQ = t; clearTimeout(window._bkq); window._bkq = setTimeout(() => { renderBooks(); const e = document.querySelector('#v-books input'); if(e){ e.focus(); e.setSelectionRange(e.value.length, e.value.length); } }, 200); };
  async function loadBooks(){ try{ const c = JSON.parse(store('get', 'coe.bklib') || 'null'); if(c && c.l){ LIB = c.l; renderBooks(); if(Date.now() - c.t < 6 * 36e5) return; } }catch(e){}
    try{ const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'books', token: TOKEN, list: true }) }).then(x => x.json());
      if(r && r.ok){ LIB = r.list || []; try{ store('set', 'coe.bklib', JSON.stringify({ l: LIB, t: Date.now() })); }catch(e){} } }catch(e){}
    if(!LIB){ const v = $('v-books'); if(v) v.innerHTML = '<div class="hd"><h1>Books</h1></div><div class="mute small">Could not load the books. Check your internet and try again.</div>'; return; }
    if(VIEW === 'books') renderBooks(); }
  const g0 = go; go = function(v){ const r = g0.apply(this, arguments); if(v === 'books'){ renderBooks(); loadBooks(); } return r; };
  try{ if(D && !D.mgr) buildNav(); }catch(e){}
})();
