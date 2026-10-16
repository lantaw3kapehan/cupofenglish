/* 16 Oct · 243 · Course books open from the app (teachers). The class card shows "Book ›" next to the book code: the sheet
   lists the unit the last class ended on (and the next one), the Student's Book and the Workbook (for homework), then every
   other file of that book (unit PDFs, readers, videos, teacher's guide). Files open in Google Drive's own viewer, in the browser
   or the Drive app: no Adobe needed, the original PDF pages. List from coe-mgmt › books (Drive › COURSEWARE_Used in Class). */
(function(){
  const NONE = /^(freetalk|debate|ielts\w*|academicwriting|conversation|trial|review)$/;
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const codes = s => String(s || '').split(/\s*[,;/]\s*/).map(x => x.trim()).filter(p => p && !/^(pre[-\s]?)?[abc][12]\+?$/i.test(p)).map(norm).filter(x => x && !NONE.test(x));
  window.bkHas = s => codes(s).length > 0;
  const BK = {};
  async function bkGet(code){ const k = norm(code); if(BK[k] && Date.now() - BK[k].t < 6 * 36e5) return BK[k].b;
    try{ const c = JSON.parse(store('get', 'coe.bk.' + k) || 'null'); if(c && Date.now() - c.t < 864e5){ BK[k] = c; bkFetch(k); return c.b; } }catch(e){}
    return bkFetch(k); }
  async function bkFetch(k){ const r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'books', token: TOKEN, code: k }) }).then(x => x.json());
    if(!r || !r.ok) throw new Error('books'); const o = { b: r.book, t: Date.now() }; BK[k] = o; try{ store('set', 'coe.bk.' + k, JSON.stringify(o)); }catch(e){} return r.book; }
  const url = f => 'https://drive.google.com/file/d/' + encodeURIComponent(f.id) + '/view';
  const nat = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
  const unitRe = n => new RegExp('(?:\\bunit\\s*0?' + n + '(?!\\d))|(?:\\bU0?' + n + '(?=L|W|\\b|[^0-9]))', 'i');
  const isMain = f => !f.group && /student|workbook|work book|course book|teacher|answer|\bTG\b/i.test(f.name) || /^(student|workbook)/i.test(f.name);
  const label = f => { const n = f.name; if(/work\s*book/i.test(n)) return 'Workbook · homework'; if(/teacher|\bTG\b/i.test(n)) return "Teacher's guide"; if(/answer/i.test(n)) return 'Answer key';
    if(/student|course book/i.test(n)) return "Student's Book"; return n; };
  const icon = f => f.kind === 'video' ? '▶ ' : f.kind === 'audio' ? '♪ ' : '';
  const a = (f, t, cls) => `<a class="${cls || 'btn ghost'}" style="${cls ? '' : 'margin:4px 6px 0 0;display:inline-block'}" href="${url(f)}" target="_blank" rel="noopener">${icon(f)}${esc(t || f.name)}</a>`;
  function lastUnit(stu){ const s = (D.students || []).find(x => x.code === stu) || {}; let t = (s.note && s.note.ended) || '';
    if(!t){ try{ const k = (typeof STU_CACHE !== 'undefined' && STU_CACHE[stu]) || JSON.parse(store('get', 'coe.stu.' + stu) || 'null'); const n = k && (k.notes || []).find(y => y.ended); if(n) t = n.ended; }catch(e){} }
    const m = /unit\s*(\d+)/i.exec(t) || /\bU(\d+)(?=L|W|\b)/i.exec(t); return { text: t, unit: m ? +m[1] : null }; }
  window.bookSheet = async function(stu, evId, only){
    const s = (D.students || []).find(x => x.code === stu) || {}, c = (D.schedule || []).find(x => x.id === evId) || {};
    const list = codes(only || c.book || s.book); if(!list.length) return toast('No course book saved for this student');
    openSheet(`<h1>Course book</h1><div class="mute small">${esc(c.student || s.name || stu)} · ${esc(c.book || s.book || '')}</div><div id="bkBody" style="margin-top:12px"><div class="sk"></div><div class="sk"></div></div>`);
    const L = lastUnit(stu); let html = '';
    for(const k of list){ let b = null; try{ b = await bkGet(k); }catch(e){ html += `<div class="mute small" style="margin-top:8px">Could not load the book list. Check your internet and try again.</div>`; continue; }
      if(!b || !(b.files || []).length){ html += `<h2>${esc(k.toUpperCase())}</h2><div class="mute small">No book file for this code yet · management can add it in Drive › COURSEWARE.</div>`; continue; }
      const F = b.files.filter(f => f.kind === 'pdf'), O = b.files.filter(f => f.kind !== 'pdf');
      html += `<h2>${esc(b.label || k)}</h2>`;
      if(L.unit != null){ const u = [L.unit, L.unit + 1].map(n => ({ n, f: F.filter(f => unitRe(n).test(f.name)).sort((x, y) => nat(x.name, y.name)) })).filter(x => x.f.length);
        if(u.length) html += `<div class="small mute" style="margin-top:2px">Last class ended: ${esc(L.text)}</div>` + u.map(x => `<div class="small" style="margin-top:8px"><b>Unit ${x.n}${x.n === L.unit ? ' · where you ended' : ' · next'}</b></div><div>${x.f.map(f => a(f, x.f.length > 1 ? f.name.replace(/^.*?(U\d+L\d+.*)$/i, '$1') : 'Open Unit ' + x.n)).join('')}</div>`).join(''); }
      const M = F.filter(isMain).sort((x, y) => (/work/i.test(y.name) - /work/i.test(x.name)) || nat(x.name, y.name));
      if(M.length) html += `<div class="small" style="margin-top:10px"><b>Books</b></div><div>${M.map(f => a(f, label(f) + (b.files.filter(g => label(g) === label(f)).length > 1 ? ' · ' + f.name : ''))).join('')}</div>`;
      const G = {}; F.filter(f => !M.includes(f)).concat(O).forEach(f => { const g = f.group || 'Files'; (G[g] = G[g] || []).push(f); });
      Object.keys(G).sort(nat).forEach(g => { const fs = G[g].sort((x, y) => nat(x.name, y.name));
        html += `<details style="margin-top:8px"><summary class="small"><b>${esc(g.split(' / ').slice(-1)[0] || 'More')}</b> <span class="mute">· ${fs.length}</span></summary><div style="max-height:46vh;overflow:auto;margin-top:4px">${fs.map(f => `<div style="padding:6px 0;border-bottom:1px dashed #E3E8EC">${a(f, f.name, 'link')}</div>`).join('')}</div></details>`; });
    }
    html += `<div class="small mute" style="margin-top:14px">Opens in Google Drive (browser or the Drive app) · no Adobe needed · sign in to Google with the email you use for this app.</div>`;
    const el = $('bkBody'); if(el) el.innerHTML = html;
  };
  /* Class brief: a Course book button · Class note: Workbook › beside Homework given */
  if(typeof classBrief === 'function'){ const cb0 = classBrief; classBrief = async function(id){ const r = cb0.apply(this, arguments);
    try{ const c = (D.schedule || []).find(x => x.id === id), s = c && (D.students || []).find(x => x.code === c.code) || {};
      if(c && !D.mgr && bkHas(c.book || s.book)){ const row = document.querySelector('#sheetBody .row[style*="margin-top:16px"]'); if(row) row.insertAdjacentHTML('afterbegin', `<button class="btn ghost grow" onclick="bookSheet('${esc(c.code)}','${esc(c.id)}')">Course book</button>`); } }catch(e){}
    return r; }; }
  if(typeof noteSheet === 'function'){ const ns0 = noteSheet; noteSheet = function(code, eventId){ const r = ns0.apply(this, arguments);
    try{ const s = (D.students || []).find(x => x.code === code) || {}, c = (D.schedule || []).find(x => x.id === eventId) || {}, h = $('nH');
      if(h && !D.mgr && bkHas(c.book || s.book)){ const lb = h.previousElementSibling; if(lb && lb.tagName === 'LABEL') lb.insertAdjacentHTML('beforeend', ` · <a class="link" onclick="bookSheet('${esc(code)}','${esc(eventId || '')}')">Workbook ›</a>`); } }catch(e){}
    return r; }; }
})();
