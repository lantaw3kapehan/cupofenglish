// 758: (Misty)
// 1) Ian's book was changed to OD2 but "Course Books" still showed Oxford Discover 1: the button kept the book from when the student page
//    was first drawn. Now the book is taken when you tap it, from the student's next class in the calendar (the database copy that
//    Change book updates at once), falling back to the student's saved book.
// 2) Students search was not convenient: it redrew everything on every letter and needed the exact text in order.
//    Now: words in any order ("ian ara", "od2 ara"), name, Chinese name, code or just its number ("004", "2025-004"), teacher, book;
//    best matches first (name starts with it); a short pause before redrawing; "N found" + × clear; Enter opens the top result, Esc clears.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const rep = (a, b) => { if (s.split(a).length !== 2) { console.error('not unique: ' + a.slice(0, 90)); process.exit(1); } s = s.replace(a, b); };
const R = String.raw;
rep(R`" onclick="bbOpen(\'' + esc(b0) + '\',\'' + esc(STU.s.name || '') + '\',\'' + esc(STU.s.cn || STU.s.chinese || '') + '\')">Course Books</button>'`,
    R`" onclick="bbStuOpen(this)">Course Books</button>'`);
rep(R`  /* entry points: To do › New book, and the student page (management) */`,
    R`  /* 758 · the book at the moment you tap: the student's next class (else the latest), else the saved book */
  window.bbStuOpen = async function(btn){ if(!STU || !STU.code) return; const code = STU.code, s = STU.s || {}; let book = s.book || '';
    try{ if(btn) btn.disabled = true; const L = await api('mgmtStuClasses', TOKEN, code), now = Date.now() - 3 * 36e5;
      const ok = (Array.isArray(L) ? L : []).filter(c => c && !c.cancelled && c.book && !/trial/i.test(String(c.title || '')));
      const nx = ok.filter(c => +new Date(c.start) >= now).sort((a, b) => +new Date(a.start) - +new Date(b.start))[0] || ok.sort((a, b) => +new Date(b.start) - +new Date(a.start))[0];
      if(nx) book = nx.book; }catch(e){} finally{ if(btn) btn.disabled = false; }
    if(!book) return toast('No book on this student yet');
    const b0 = window.bbPick ? bbPick(book) : String(book).split(/\s*,\s*/)[0]; bbOpen(b0, s.name || '', s.cn || s.chinese || ''); };
  /* entry points: To do › New book, and the student page (management) */`);
rep(R`let L = q ? items.filter(it => [it.s.code, it.s.name, it.s.cn, (it.s.teachers || []).join(' '), it.o && it.o.shared].join(' ').toLowerCase().indexOf(q) > -1).sort((a, b) => b.on - a.on) : (F[STF] || F.active);`,
    R`let L = q ? asFind(items, q) : (F[STF] || F.active);`);
rep(R`'<div style="margin-top:14px"><input id="aq" class="search" placeholder="Search student, code or teacher · also finds past students" value="' + esc(q) + '" oninput="renderAStudents()"></div>' +`,
    R`'<div class="as-q"><input id="aq" class="search" placeholder="Search name, 中文, code or number, teacher, book · past students too" value="' + esc(q) + '" oninput="asQ()" onkeydown="asKey(event)" autocomplete="off">' + (q ? '<button type="button" class="as-x" title="Clear" onclick="asClear()">×</button>' : '') + '</div>' + (q ? '<div class="small mute" style="margin:6px 2px 0">' + L.length + ' found' + (L.length ? ' · Enter opens ' + esc((L[0].s || {}).name || '') : '') + '</div>' : '') +`);
rep(R`  window.stF = function(f){ STF = f; renderAStudents(); };`,
    R`  window.stF = function(f){ STF = f; renderAStudents(); };
  /* 758 · search */
  const norm = v => String(v == null ? '' : v).toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');
  window.asFind = function(items, q){ const W = norm(q).split(/\s+/).filter(Boolean); if(!W.length) return items;
    const out = []; items.forEach(it => { const s = it.s || {}, o = it.o || {}, code = norm(s.code), name = norm(s.name);
      const hay = [code, code.replace(/^st-/, ''), code.replace(/^st-\d{4}-/, ''), name, norm(s.cn), norm((s.teachers || []).join(' ')), norm(s.book), norm(o.shared), norm(o.teacher)].join(' ');
      if(!W.every(w => hay.indexOf(w) > -1)) return;
      const w0 = W[0], sc = (name === norm(q) ? 0 : name.indexOf(w0) === 0 ? 1 : code.indexOf(w0) > -1 ? 2 : name.indexOf(w0) > -1 ? 3 : 4) + (it.on ? 0 : 10);
      out.push([sc, it]); });
    return out.sort((a, b) => a[0] - b[0] || String(a[1].s.name).localeCompare(String(b[1].s.name))).map(x => x[1]); };
  let AS_T = 0; window.asQ = () => { clearTimeout(AS_T); AS_T = setTimeout(() => renderAStudents(), 140); };
  window.asClear = () => { const i = $('aq'); if(i){ i.value = ''; } renderAStudents(); setTimeout(() => { const j = $('aq'); if(j) j.focus(); }, 0); };
  window.asKey = ev => { if(ev.key === 'Escape'){ ev.preventDefault(); asClear(); return; }
    if(ev.key === 'Enter'){ ev.preventDefault(); clearTimeout(AS_T); renderAStudents(); const f = document.querySelector('#v-astudents .li'); if(f) f.click(); } };
  try{ const st = document.createElement('style'); st.textContent = '.as-q{position:relative;margin-top:14px}.as-q .search{width:100%;padding-right:40px}.as-x{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:28px;height:28px;border:0;border-radius:50%;background:#EEEDF3;color:#5B5675;font-size:18px;line-height:1;cursor:pointer}'; document.head.appendChild(st); }catch(e){}`);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
