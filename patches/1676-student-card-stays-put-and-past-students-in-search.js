// 1676: (Misty, 31 Oct 19:03 and 19:05)
//   · "In TEACHERS, I'm opening OPEN SLOTS but it auto shows LUCY." A student's class card (Schedule search › a student) kept
//     painting itself after it was gone: when a class changed in the database, the card's quiet refresh (1424 swRefresh), or a
//     late answer to its first load, drew that student over whatever sheet was open at the time (here: a teacher's open slots).
//     Now the sheet remembers which student card it shows; quiet refreshes and late answers only draw when that card is still
//     the one on screen. Opening any other sheet forgets it. Edits made from the card itself still redraw it as before.
//   · "Yoyo (ST-2025-083) isn't showing on our STUDENTS though she ended July 10 · now she wants to renew." Her finished package
//     was taken off ACTIVE before the database copy (15 Oct), so the Students search (active list + packages) never had her.
//     Searching now also looks through DATABASE: a student found only there shows as "Not active", and tapping opens her page,
//     where Status › "Enrolled · paid" records the new package (SALES, ACTIVE, DATABASE in one save).
const file = process.argv[2];
require('../tools/lib.js')(file, [
  /* 1 · a new sheet forgets the student card */
  ["function openSheet(html){ if(",
   "function openSheet(html){ try{ const _b1676 = document.getElementById('sheetBody'); if(_b1676) delete _b1676.dataset.sw; }catch(e){} if("],
  /* 2 · the card marks the sheet as its own (skeleton first) */
  ["SW = { code, name, events: null };\nopenSheet(`<h1>${esc(name || code)}</h1><div class=\"sk\"></div><div class=\"sk\"></div><div class=\"sk\" style=\"width:60%\"></div>`); $('sheet').classList.add('wide');",
   "SW = { code, name, events: null };\nopenSheet(`<h1>${esc(name || code)}</h1><div class=\"sk\"></div><div class=\"sk\"></div><div class=\"sk\" style=\"width:60%\"></div>`); $('sheet').classList.add('wide'); try{ $('sheetBody').dataset.sw = code; }catch(e){}   /* 1676 */"],
  /* 3 · late first answer: only if the card is still on screen */
  ["if(SW && SW.code === code){ SW.events = L.slice(); swPaint(); }",
   "if(SW && SW.code === code && window.swMine1676 && swMine1676(code)){ SW.events = L.slice(); swPaint(); }"],
  /* 4 · quiet refresh after a database change: same */
  ["if(!Array.isArray(L) || !(SW && SW.code === code)) return; CLSM[code] = L;",
   "if(!Array.isArray(L) || !(SW && SW.code === code)) return; CLSM[code] = L; if(!swMine1676(code)) return;"],
  /* 5 · the delayed refetch after an edit: same */
  ["if(SW && SW.code === swc){ SW.events",
   "if(SW && SW.code === swc && swMine1676(swc)){ SW.events"],
  /* 6 · every paint of the card marks the sheet again (edits from the card redraw it) */
  ["  function lsRefresh(){",
   "  window.swMine1676 = code => { try{ const b = document.getElementById('sheetBody'), s = document.getElementById('sheet'); return !!(b && s && s.classList.contains('on') && b.dataset.sw === String(code)); }catch(e){ return false; } };\n" +
   "  try{ const _swp1676 = swPaint; swPaint = function(){ const r = _swp1676.apply(this, arguments); try{ if(SW && SW.code) document.getElementById('sheetBody').dataset.sw = SW.code; }catch(e){} return r; }; }catch(e){}\n" +
   "  function lsRefresh(){"],
  /* 7 · Students search also finds students who are only on DATABASE (finished before 15 Oct, unenrolled) */
  ["left: P.by[k].left }, o: P.by[k], on: false }); });",
   "left: P.by[k].left }, o: P.by[k], on: false }); });\n" +
   "    if(q){ try{ const DX = (typeof DB !== 'undefined' && DB && DB.rows) ? DB : (typeof DBX !== 'undefined' && DBX && DBX.rows ? DBX : null);   /* 1676 */\n" +
   "      if(DX){ const have = {}; items.forEach(it => { have[up(it.s.code)] = 1; });\n" +
   "        DX.rows.forEach(r => { const c = up(r[0]); if(!/^ST-\\d{4}-\\d+$/.test(c) || have[c]) return; have[c] = 1;\n" +
   "          items.push({ s: { code: c, name: String(r[2] || '').trim() || c, cn: String(r[1] || '').trim(), teachers: r[14] ? String(r[14]).split(/[,/&]/).map(t => t.trim()).filter(Boolean) : [], book: r[12] || '' }, o: null, on: false, db1676: 1 }); }); }\n" +
   "      else if(!window._asDB1676){ window._asDB1676 = 1; api('mgmtDatabase', TOKEN).then(v => { if(v && v.rows){ DB = v; if(VIEW === 'astudents') renderAStudents(); } }).catch(() => {}).then(() => { setTimeout(() => { window._asDB1676 = 0; }, 60000); }); } }catch(e){} }"]
]);
