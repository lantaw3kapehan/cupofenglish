<script id="b2270">
/* 16 Nov · 2270 · Books extras (Misty 17:50 "let us do all"):
   1. Class card & book sheet: the unit the class ended on also shows that unit's audio (🔊) and video (▶) in one tap.
   2. Listening homework: in the class note, "🎧 Listening homework" picks tracks of the book; the family plays them in the student portal.
   3. Book progress on the student's Course book card: "Unit 12 of 48" with a bar and, when the notes show a pace, about when the book ends.
   4. Management · Books: "Missing materials" (per book: Student's Book, Workbook, audio, video; books in use first) and
   5. "Who opened what" (book pages, audio and videos opened by teachers, last 14 days).
   Also: book lists kept on a device from before today's Drive scan are dropped once, so new videos (Oxford Phonics) show at once.
   Server: Supabase function coe-books (log, opens, gaps, hwGet, hwSet, stuHw) · tables coe_hw_audio, coe_book_opens · docs books:gaps (hourly). */
(function(){
  const API = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-books';
  const AU = id => 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-audio?id=' + encodeURIComponent(id);
  const E = s => (typeof esc === 'function' ? esc(s) : String(s == null ? '' : s));
  const call = b => fetch(API, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, b)) }).then(r => r.json());
  const nat = (a, b) => String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: 'base' });
  const NONE = /^(freetalk|debate|ielts\w*|academicwriting|conversation|trial|review)$/;
  const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const codes = s => String(s || '').split(/\s*[,;/]\s*/).map(x => x.trim()).filter(p => p && !/^(pre[-\s]?)?[abc][12]\+?$/i.test(p)).map(norm).filter(x => x && !NONE.test(x));
  const ymd = d => { const x = new Date(d); return x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'); };

  /* once: book lists kept from before the 16 Nov scan */
  try{ if(!localStorage.getItem('coe.bkpurge2270')){ Object.keys(localStorage).filter(k => /^coe\.(bk3|bklib2|bk)\./.test(k)).forEach(k => localStorage.removeItem(k)); localStorage.setItem('coe.bkpurge2270', '1'); } }catch(e){}

  /* ── units of a file ── */
  function aParse(name){ const base = String(name).replace(/\.(mp3|m4a|wav|ogg|aac)$/i, '');
    let m = /^b\d+_[a-z]+_(\d+)_(\d+)(?:_(.*))?$/i.exec(base);
    if(m){ let rest = m[3] || '', acc = ''; const a = /(?:^|_)(usuk|uk|us)$/i.exec(rest); if(a){ acc = a[1].toUpperCase().replace('USUK', 'US/UK'); rest = rest.slice(0, a.index); } rest = rest.replace(/^_+|_+$/g, '');
      const t = rest === '' ? '' : rest.replace(/^eg(?=_|$)/i, 'Example').replace(/^(\d+)_([a-z])$/i, '$1$2').replace(/_/g, ' ');
      return { u: +m[1], label: m[1] + '.' + m[2] + (t ? ' · ' + t : '') + (acc ? ' (' + acc + ')' : ''), sort: [+m[1], +m[2], t] }; }
    m = /(?:^|_)(?:SB|WB)\d*_(\d+)\.(\d+)$/i.exec(base); if(m) return { u: +m[1], label: m[1] + '.' + m[2], sort: [+m[1], +m[2], ''] };
    return null; }
  function unitOf(f){ if(f.kind === 'audio'){ const p = aParse(f.name); if(p) return p.u; }
    const g = String(f.group || '');
    let m = /^(\d+)$/.exec(g.split(' / ').slice(-1)[0] || ''); if(m) return +m[1];
    m = /\bunit\s*0?(\d+)\b/i.exec(g) || /\bunit\s*0?(\d+)\b/i.exec(f.name) || /(?:^|[^A-Z])U0?(\d+)(?=L|W|[^0-9]|$)/.exec(f.name); return m ? +m[1] : null; }
  const label = f => { const p = f.kind === 'audio' ? aParse(f.name) : null; return p ? p.label : String(f.name).replace(/\.(mp3|mp4|pdf)$/i, ''); };

  function stuNotes(stu){ try{ const k = (typeof STU_CACHE !== 'undefined' && STU_CACHE[stu]) || (typeof STU !== 'undefined' && STU && STU.code === stu && STU.r) || JSON.parse(store('get', 'coe.stu.' + stu) || 'null'); return (k && k.notes) || []; }catch(e){ return []; } }
  const unitIn = t => { const m = /unit\s*(\d+)/i.exec(String(t || '')) || /\bU(\d+)(?=L|W|\b)/i.exec(String(t || '')); return m ? +m[1] : null; };
  function lastUnit(stu){ if(!stu) return null; const s = (D.students || []).find(x => x.code === stu) || {}; let u = unitIn(s.note && s.note.ended);
    if(u == null){ const n = stuNotes(stu).find(y => unitIn(y.ended) != null); if(n) u = unitIn(n.ended); } return u; }
  function cachedBook(k){ try{ const c = JSON.parse(store('get', 'coe.bk3.' + (window.bkU ? bkU() : '') + '.' + k) || 'null'); return c && c.b; }catch(e){ return null; } }
  const media = (b, u) => { const F = (b && b.files) || []; return { au: F.filter(f => f.kind === 'audio' && unitOf(f) === u), vd: F.filter(f => f.kind === 'video' && unitOf(f) === u) }; };

  /* ── 5 · log what is opened ── */
  const ctx = () => ({ book: ((document.querySelector('#bkBody h2') || document.querySelector('#stuBk h2 .c') || {}).textContent || '').trim().slice(0, 80),
    student: (((document.querySelector('#sheetBody .mute.small') || {}).textContent || '').split('·')[0] || '').trim().slice(0, 80) });
  window.bkLog = function(kind, id, title){ try{ if(!TOKEN) return; const c = ctx(); call({ op: 'log', kind, id, title: String(title || '').slice(0, 160), book: c.book, student: /books library/i.test(c.student) ? '' : c.student }).catch(() => {}); }catch(e){} };
  if(window.auPlay){ const p0 = window.auPlay; window.auPlay = function(i){ const r = p0.apply(this, arguments); try{ const t = document.querySelector('#auBar .au-t span'), a = document.getElementById('auEl'); const id = a ? decodeURIComponent((/id=([^&]+)/.exec(a.src) || [])[1] || '') : ''; if(t) bkLog('audio', id, t.textContent.replace(/^♪\s*/, '')); }catch(e){} return r; }; }
  if(window.vdOpen){ const v0 = window.vdOpen; window.vdOpen = function(id, title){ bkLog('video', id, title); return v0.apply(this, arguments); }; }
  document.addEventListener('click', ev => { try{ const a = ev.target && ev.target.closest && ev.target.closest('a[href*="drive.google.com/file/d/"]'); if(!a || ev.defaultPrevented) return;
    if(!(a.closest('#bkBody, #stuBk') || a.classList.contains('bkb'))) return; const t = (a.textContent || '').trim(); if(/^[▶♪]/.test(t)) return;
    const id = decodeURIComponent((/\/d\/([^/]+)/.exec(a.getAttribute('href')) || [])[1] || ''); bkLog('pdf', id, t); }catch(e){} });

  /* ── 1 · this unit's audio & video ── */
  window.bkUnitGo = function(stu, evId, u, kind){ const s = (D.students || []).find(x => x.code === stu) || {}, c = (D.schedule || []).find(x => x.id === evId) || {};
    const k = codes(c.book || s.book)[0], b = k && cachedBook(k), m = media(b, u);
    if(kind === 'v' && m.vd.length === 1 && window.vdOpen) return vdOpen(m.vd[0].id, label(m.vd[0]));
    window._bkJump = { u, kind, t: Date.now() }; bookSheet(stu, evId); };
  function jumpTo(u, kind){ const body = $('bkBody'); if(!body) return;
    if(kind === 'v'){ const a = [...body.querySelectorAll('a')].find(x => /^▶/.test(x.textContent.trim()) && unitOf({ name: x.textContent.replace(/^▶\s*/, ''), group: '' }) === u); if(a){ const d = a.closest('details'); if(d) d.open = true; a.scrollIntoView({ block: 'center' }); a.style.outline = '2px solid #13636B'; } return; }
    const ds = [...body.querySelectorAll('details')]; let d = ds.find(x => ((x.querySelector('summary b') || {}).textContent || '').trim() === 'Unit ' + u), row = null;
    if(!d){ row = [...body.querySelectorAll('.au-n')].find(x => x.textContent.trim() === 'Unit ' + u || x.textContent.trim().split('.')[0] === String(u)); d = row && row.closest('details'); }
    if(d){ d.open = true; (row || d).scrollIntoView({ block: 'start' }); } }
  window.bkJumpTo = jumpTo;
  if(window.bkCard){ const c0 = window.bkCard; window.bkCard = function(c, s){ let r = c0.apply(this, arguments);
    try{ const k = codes(c.book || s.book)[0], b = k && cachedBook(k), u = lastUnit(c.code); if(!r || !b || u == null) return r; const m = media(b, u);
      if(m.au.length) r += ` · <a class="link" onclick="event.stopPropagation();bkUnitGo('${E(c.code)}','${E(c.id)}',${u},'a')">🔊 Unit ${u}</a>`;
      if(m.vd.length) r += ` · <a class="link" onclick="event.stopPropagation();bkUnitGo('${E(c.code)}','${E(c.id)}',${u},'v')">▶ Video</a>`; }catch(e){} return r; }; }
  function sheetMedia(){ const body = $('bkBody'); if(!body || body.querySelector('.bk-um')) return;
    const b0 = [...body.querySelectorAll('b')].find(x => /^Unit \d+ · where you ended$/.test(x.textContent.trim())); const hdr = (body.querySelector('h2') || {}).textContent || '';
    if(window._bkJump && Date.now() - _bkJump.t < 8000){ const j = _bkJump; window._bkJump = null; setTimeout(() => jumpTo(j.u, j.kind), 50); }
    if(!b0) return; const u = +/\d+/.exec(b0.textContent)[0];
    const vids = [...body.querySelectorAll('a')].filter(x => /^▶/.test(x.textContent.trim()) && unitOf({ name: x.textContent.replace(/^▶\s*/, ''), group: '' }) === u);
    const det = [...body.querySelectorAll('details')].find(x => ((x.querySelector('summary b') || {}).textContent || '').trim() === 'Unit ' + u) || [...body.querySelectorAll('.au-n')].find(x => x.textContent.trim() === 'Unit ' + u || x.textContent.trim().split('.')[0] === String(u));
    if(!vids.length && !det) return;
    const row = document.createElement('div'); row.className = 'bk-um'; row.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-top:6px';
    row.innerHTML = (det ? `<button class="btn ghost sm" onclick="bkJumpTo(${u},'a')">🔊 Unit ${u} audio</button>` : '') + vids.slice(0, 4).map(a => `<button class="btn ghost sm" data-h="${E(a.getAttribute('href'))}">▶ ${E(a.textContent.replace(/^▶\s*/, '').slice(0, 40))}</button>`).join('');
    row.querySelectorAll('button[data-h]').forEach(bt => bt.onclick = () => { const a = vids.find(x => x.getAttribute('href') === bt.dataset.h); if(a) a.click(); });
    const box = b0.parentElement && b0.parentElement.nextElementSibling; (box || b0.parentElement).insertAdjacentElement('afterend', row); void hdr; }
  const S0 = window.bookSheet; if(S0) window.bookSheet = function(){ const r = S0.apply(this, arguments); Promise.resolve(r).then(() => { setTimeout(sheetMedia, 350); setTimeout(sheetMedia, 900); }, () => {}); return r; };

  /* ── 2 · listening homework in the class note ── */
  const LS = {};
  async function lsMount(code, evId){ const h = $('nH'); if(!h || $('lsBox')) return; const s = (D.students || []).find(x => x.code === code) || {}, c = (D.schedule || []).find(x => x.id === evId) || {};
    const k = codes(c.book || s.book)[0]; if(!k || !window.bkGet) return; let b = null; try{ b = await bkGet(k); }catch(e){ return; }
    const F = ((b && b.files) || []).filter(f => f.kind === 'audio'); if(!F.length || $('lsBox')) return;
    const day = c.day || ymd(c.start || Date.now()); const st = LS[code + '|' + day] = { code, day, book: (b && b.label) || k, F, sel: [], u: null };
    const box = document.createElement('div'); box.id = 'lsBox'; box.className = 'mini'; box.style.cssText = 'margin:8px 0;background:#F2F9F9;border:1px solid #CFE3E3';
    box.innerHTML = '<div class="row" style="gap:8px;align-items:center"><b class="grow">🎧 Listening homework</b><span class="small mute" id="lsSt">checking…</span><button type="button" class="btn sm ghost" id="lsBt">Add</button></div><div id="lsP" class="hide"></div>';
    const anchor = h.closest('.field') || h.parentElement; anchor.insertAdjacentElement('afterend', box);
    $('lsBt').onclick = () => lsOpen(code, day);
    try{ const r = await call({ op: 'hwGet', code, day }); st.sel = (r && r.hw && r.hw.files) || []; }catch(e){} lsStatus(code, day); }
  function lsStatus(code, day){ const st = LS[code + '|' + day], el = $('lsSt'), bt = $('lsBt'); if(!st || !el) return;
    el.textContent = st.sel.length ? st.sel.length + ' track' + (st.sel.length === 1 ? '' : 's') + ' set · the family plays them in the student portal' : 'none set';
    if(bt) bt.textContent = st.sel.length ? 'Edit' : 'Add'; }
  window.lsOpen = function(code, day){ const st = LS[code + '|' + day], p = $('lsP'); if(!st || !p) return; p.classList.remove('hide');
    const units = [...new Set(st.F.map(unitOf).filter(x => x != null))].sort((a, b) => a - b);
    if(st.u == null){ const lu = lastUnit(code); st.u = units.includes(lu) ? lu : (st.sel[0] ? unitOf({ kind: 'audio', name: st.F.find(f => f.id === st.sel[0].id) ? st.F.find(f => f.id === st.sel[0].id).name : '', group: '' }) : units[0]); if(st.u == null) st.u = units[0]; }
    lsPaint(code, day, units); };
  function lsPaint(code, day, units){ const st = LS[code + '|' + day], p = $('lsP'); if(!st || !p) return;
    const list = st.F.filter(f => units.length ? unitOf(f) === st.u : true).sort((a, b) => { const x = aParse(a.name), y = aParse(b.name); return x && y ? (x.sort[0] - y.sort[0]) || (x.sort[1] - y.sort[1]) || nat(x.sort[2], y.sort[2]) : nat(a.name, b.name); });
    const on = id => st.sel.some(x => x.id === id);
    p.innerHTML = (units.length ? `<div class="row" style="gap:8px;align-items:center;margin-top:8px"><span class="small">Unit</span><select id="lsU" class="in-t" style="max-width:120px">${units.map(u => `<option value="${u}"${u === st.u ? ' selected' : ''}>${u}</option>`).join('')}</select><span class="small mute">${list.length} tracks · tap to pick</span></div>` : '')
      + `<div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px;max-height:220px;overflow:auto">${list.map(f => `<button type="button" class="btn sm ${on(f.id) ? '' : 'ghost'}" data-id="${E(f.id)}">${on(f.id) ? '✓ ' : ''}${E(label(f))}</button>`).join('')}</div>`
      + `<div class="small" style="margin-top:8px">${st.sel.length ? '<b>Picked:</b> ' + st.sel.map(x => E(x.title)).join(', ') : '<span class="mute">No tracks picked yet</span>'}</div>`
      + `<div class="row" style="gap:8px;margin-top:8px"><button type="button" class="btn sm grow" id="lsSave">Save listening homework</button>${st.sel.length ? '<button type="button" class="btn sm ghost" id="lsClr">Clear</button>' : ''}</div>`;
    const us = $('lsU'); if(us) us.onchange = () => { st.u = +us.value; lsPaint(code, day, units); };
    p.querySelectorAll('button[data-id]').forEach(bt => bt.onclick = () => { const id = bt.dataset.id, f = st.F.find(x => x.id === id); if(on(id)) st.sel = st.sel.filter(x => x.id !== id); else if(st.sel.length < 40) st.sel.push({ id, title: (st.book ? st.book.replace(/^DK English for Everyone · /i, 'DK ') + ' · ' : '') + label(f) }); lsPaint(code, day, units); });
    const sv = $('lsSave'); if(sv) sv.onclick = () => lsSave(code, day, false); const cl = $('lsClr'); if(cl) cl.onclick = () => { st.sel = []; lsSave(code, day, true); }; }
  async function lsSave(code, day, clear){ const st = LS[code + '|' + day]; if(!st) return; const sv = $('lsSave'); if(sv){ sv.disabled = true; sv.textContent = 'Saving…'; }
    try{ const r = await call({ op: 'hwSet', code, day, book: st.book, files: st.sel }); if(!r || !r.ok) throw r; toast(clear || !st.sel.length ? 'Listening homework removed' : '✓ Listening homework saved · ' + st.sel.length + ' track' + (st.sel.length === 1 ? '' : 's') + ' in the student portal');
      const p = $('lsP'); if(p) p.classList.add('hide'); lsStatus(code, day); }
    catch(e){ toast('Not saved · ' + ((e && e.error) || 'try again')); if(sv){ sv.disabled = false; sv.textContent = 'Save listening homework'; } } }
  if(typeof noteSheet === 'function'){ const n0 = noteSheet; noteSheet = function(code, eventId){ const r = n0.apply(this, arguments); Promise.resolve(r).then(() => setTimeout(() => { try{ lsMount(code, eventId); }catch(e){} }, 120), () => {}); return r; }; }

  /* ── 3 · book progress on the student page ── */
  function progPaint(){ const el = $('stuBk'); if(!el || el.querySelector('.bk-prog') || el.querySelector('.sk') || typeof STU === 'undefined' || !STU || !STU.code || !STU.s) return;
    const k = codes(STU.s.book)[0], b = k && cachedBook(k); if(!b) return;
    const total = Math.max(0, ...((b.files || []).map(unitOf).filter(x => x != null && x < 200))); const cur = lastUnit(STU.code); if(total < 2 || cur == null) return;
    const pts = stuNotes(STU.code).map(n => ({ u: unitIn(n.ended), d: new Date(String(n.date || '').slice(0, 10) + 'T12:00:00') })).filter(x => x.u != null && !isNaN(x.d) && Date.now() - x.d < 180 * 864e5).sort((a, b) => a.d - b.d);
    let pace = ''; if(pts.length >= 3){ const a = pts[0], z = pts[pts.length - 1], wk = (z.d - a.d) / (7 * 864e5), du = z.u - a.u;
      if(wk >= 2 && du > 0){ const per = du / wk, left = Math.max(0, total - cur) / per, fin = new Date(Date.now() + left * 7 * 864e5);
        pace = ` · about ${per >= 1 ? Math.round(per * 10) / 10 + ' units a week' : Math.round(1 / per * 10) / 10 + ' weeks a unit'} · ${left < 1 ? 'finishing now' : 'finishes about ' + fin.toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}`; } }
    const pc = Math.max(2, Math.min(100, Math.round(cur / total * 100)));
    el.insertAdjacentHTML('beforeend', `<div class="bk-prog" style="margin-top:10px"><div class="small"><b>Book progress · Unit ${cur} of ${total}</b><span class="mute">${E(pace)}</span></div><div style="height:8px;border-radius:999px;background:#E6EEF0;margin-top:6px;overflow:hidden"><i style="display:block;height:100%;width:${pc}%;background:#13636B;border-radius:999px"></i></div></div>`); }
  try{ new MutationObserver(() => { if($('stuBk')) progPaint(); }).observe(document.body, { childList: true, subtree: true }); }catch(e){}

  /* ── 4 & 5 · management: missing materials · who opened what ── */
  let GAPS = null, OPENS = null;
  const tick = n => n ? '<span style="color:#1E7A55">✓</span>' : '<span style="color:#C0392B">—</span>';
  function inUse(){ const L = (window.SL && SL.students) || (D && D.students) || [], m = {}; L.forEach(s => codes(s.book).forEach(c => { m[c] = (m[c] || 0) + 1; })); return m; }
  function gapsHtml(){ if(!GAPS) return '<div class="small mute">Loading…</div>'; const U = inUse(), seen = {};
    const L = GAPS.books.map(x => Object.assign({ n: Object.keys(U).filter(c => { const lb = GAPS.books.find(y => y.code === c); return c === x.code || (lb && lb.label === x.label); }).reduce((a, c) => a + U[c], 0) }, x)).filter(x => !seen[x.label] && (seen[x.label] = 1));
    L.sort((a, b) => (b.n > 0) - (a.n > 0) || nat(a.label, b.label));
    const miss = x => !x.sb || !x.wb || !x.audio || !x.video;
    return `<div class="small mute" style="margin:4px 0 8px">✓ = in Drive · — = not found. Not every series has a workbook, audio or video. Last Drive scan: ${GAPS.scanned ? new Date(GAPS.scanned).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—'}.</div>
<div style="overflow:auto"><table class="small" style="width:100%;border-collapse:collapse"><tr class="mute"><td style="padding:4px 6px">Book</td><td>Students</td><td>Student's Book</td><td>Workbook</td><td>Audio</td><td>Video</td></tr>${L.map(x => `<tr style="border-top:1px solid #EEE;${x.n && miss(x) ? 'background:#FFF6F2' : ''}"><td style="padding:5px 6px"><b>${E(x.label)}</b></td><td>${x.n || '<span class="mute">—</span>'}</td><td>${tick(x.sb)}</td><td>${tick(x.wb)}</td><td>${x.audio ? '✓ ' + x.audio : tick(0)}</td><td>${x.video ? '✓ ' + x.video : tick(0)}</td></tr>`).join('')}</table></div>`; }
  function opensHtml(){ if(!OPENS) return '<div class="small mute">Loading…</div>'; const R = OPENS.filter(x => x.mode !== 'mgmt'); if(!R.length) return '<div class="small mute">Nothing opened by teachers in the last 14 days yet (counting from 16 Nov).</div>';
    const by = {}; R.forEach(x => { const w = x.who || '?'; (by[w] = by[w] || { pdf: 0, audio: 0, video: 0, last: x.at })[x.kind] = (by[w][x.kind] || 0) + 1; });
    const t = a => new Date(a).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    return `<div style="display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 10px">${Object.keys(by).sort((a, b) => by[b].last.localeCompare(by[a].last)).map(w => `<span class="bk-sn" style="--sb:#EEF6F6;--sc:#13636B">${E(w)} · 📄${by[w].pdf} 🔊${by[w].audio} ▶${by[w].video}</span>`).join('')}</div>`
      + `<div style="max-height:320px;overflow:auto">${R.slice(0, 200).map(x => `<div class="small" style="padding:4px 0;border-bottom:1px dashed #E3E8EC"><span class="mute">${E(t(x.at))}</span> · <b>${E(x.who)}</b> · ${x.kind === 'video' ? '▶' : x.kind === 'audio' ? '🔊' : '📄'} ${E(x.title)}${x.book ? ' <span class="mute">· ' + E(x.book) + '</span>' : ''}${x.student ? ' <span class="mute">· ' + E(x.student) + '</span>' : ''}</div>`).join('')}</div>`; }
  function mgPaint(){ if(!D || !D.mgr) return; const v = $('v-books'); if(!v || $('bkMg')) return; const at = $('bkAgree') || v.querySelector('.bk-rule') || v.querySelector('.bl-hd'); if(!at) return;
    at.insertAdjacentHTML('afterend', `<div id="bkMg" style="margin:6px 0 4px;display:grid;gap:6px"><details id="bkGaps"><summary class="small" style="cursor:pointer"><b>Missing materials</b> <span class="mute">· what to upload to Drive ›</span></summary><div id="bkGapsB"></div></details><details id="bkOpens"><summary class="small" style="cursor:pointer"><b>Who opened what</b> <span class="mute">· teachers, last 14 days ›</span></summary><div id="bkOpensB"></div></details></div>`);
    $('bkGaps').addEventListener('toggle', async () => { if(!$('bkGaps').open) return; $('bkGapsB').innerHTML = gapsHtml(); if(!GAPS){ try{ const r = await call({ op: 'gaps' }); if(r && r.ok) GAPS = r; }catch(e){} } const b = $('bkGapsB'); if(b) b.innerHTML = GAPS ? gapsHtml() : '<div class="small mute">Could not load · try again</div>'; });
    $('bkOpens').addEventListener('toggle', async () => { if(!$('bkOpens').open) return; $('bkOpensB').innerHTML = opensHtml(); try{ const r = await call({ op: 'opens', days: 14 }); if(r && r.ok) OPENS = r.rows; }catch(e){} const b = $('bkOpensB'); if(b) b.innerHTML = OPENS ? opensHtml() : '<div class="small mute">Could not load · try again</div>'; }); }
  const L0 = window.bkLib2; if(L0) window.bkLib2 = function(){ const r = L0.apply(this, arguments); try{ mgPaint(); setTimeout(mgPaint, 400); }catch(e){} return r; };
})();
</script>
