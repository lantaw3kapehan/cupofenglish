// 2407 (Misty 19 Nov 11:58, "I click copy picture, but it's still not appearing that it has been copied") · a tick made on this device
//   stays while the server saves it: a background refresh that started before the save no longer wipes it (kept 2 minutes, or until
//   the server has it; "Not sent" likewise stays off). Also: a book opened from a class card or a student page tells the reader the
//   student, so the reader's homework picture shows "For / 学生: name".
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["R.forEach(t => { M[t.label] = (r.data.marks || {})[t.label] || {}; });",
   "R.forEach(t => { const s = Object.assign({}, (r.data.marks || {})[t.label] || {}), o = M[t.label] || {}; Object.keys(PEND).forEach(pk => { const [lb, k] = pk.split('\\u0001'); if(lb !== t.label || Date.now() - PEND[pk].t > 120000){ if(Date.now() - PEND[pk].t > 120000) delete PEND[pk]; return; } if(PEND[pk].on){ if(!s[k] && o[k]) s[k] = o[k]; } else delete s[k]; }); M[t.label] = s; });"],
  ["  const F = {}, M = {}; let AG = false, busy = null, at = 0;",
   "  const F = {}, M = {}, PEND = {}; let AG = false, busy = null, at = 0;"],
  ["    if(on){ if(m[k]) return; const d = new Date(Date.n",
   "    PEND[t.label + '\\u0001' + k] = { on: !!on, t: Date.now() };\n    if(on){ if(m[k]) return; const d = new Date(Date.n"],
  ["    const q = new URLSearchParams({ id, t: String(title || (hit && hit.f.name) || '').slice(0, 120), n: '1' }); if(hit && hit.code) q.set('b', hit.code);",
   "    const q = new URLSearchParams({ id, t: String(title || (hit && hit.f.name) || '').slice(0, 120), n: '1' }); if(hit && hit.code) q.set('b', hit.code);\n" +
   "    try{ const cx = window._bkStu2407; if(cx && Date.now() - cx.t < 15 * 6e4 && cx.name) q.set('s', cx.name); }catch(e){}   /* 2407 */"],
  ["  document.addEventListener('click', ev => { try{ if(ev.defaultPrevented || !D) return;\n    const a = ev.target && ev.target.closest && ev.target.closest('a[href*=\"drive.google.com/file/d/\"]'); if(!a) return;",
   "  /* 2407: the student of the class card or student page a book is opened from */\n" +
   "  document.addEventListener('click', ev => { try{ if(!D || !ev.target || !ev.target.closest) return; let nm = '';\n" +
   "      if(typeof STU !== 'undefined' && STU && STU.s && ev.target.closest('#sheetBody, #v-student')) nm = STU.s.name || '';\n" +
   "      if(!nm){ let el = ev.target; for(let i = 0; i < 8 && el && el !== document.body; i++, el = el.parentElement){ const m = String(el.textContent || '').match(/ST-\\d{4}-\\d{3}/g); if(m && m.length){ if(new Set(m).size > 1) break; const c = (D.schedule || []).find(x => String(x.code || '').toUpperCase() === m[0].toUpperCase()); nm = c ? String(c.student || '').replace(/\\s+X$/i, '') : ''; break; } } }\n" +
   "      if(nm && !/^ST-/.test(nm)) window._bkStu2407 = { name: nm, t: Date.now() }; }catch(e){} }, true);\n" +
   "  document.addEventListener('click', ev => { try{ if(ev.defaultPrevented || !D) return;\n    const a = ev.target && ev.target.closest && ev.target.closest('a[href*=\"drive.google.com/file/d/\"]'); if(!a) return;"]
]);
