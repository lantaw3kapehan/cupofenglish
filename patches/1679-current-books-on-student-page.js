// 1679: (Misty, 31 Oct 23:08, student page · Lucy) "Can we also have the CURRENT BOOKS, and the template will show? Same when we
//   change books, so we can inform parents what to buy on Taobao."
//   · Management's student page: a "Current books" row under Every week, one chip per book in use (the books of the upcoming
//     classes, each with its teacher when there are two; else the latest class; else the saved book). Tapping a chip opens the
//     Course Books picture (covers + Taobao search words, 656) for that book, ready to copy to the parent.
//   · Change book: when the new book is saved, the Course Books picture for the new book opens by itself.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  window.swMine1676 = ",
   "  /* 1679 · Current books on the student page + Course Books picture after Change book */\n" +
   "  try{ const BK1679 = {};\n" +
   "    const css1679 = document.createElement('style'); css1679.textContent = '#sheetBody.stu2 .shbk{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:10px}#sheetBody.stu2 .shbk .lb{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#6C6786;margin-right:2px}#sheetBody.stu2 .shbk button{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;border-radius:999px;border:1px solid #BFE3E5;background:#E9F6F7;color:#00666D;font:inherit;font-size:14px;font-weight:600;cursor:pointer}#sheetBody.stu2 .shbk button:hover{background:#D6EFF1}#sheetBody.stu2 .shbk button span{font-weight:400;color:#4C6E72;font-size:12px}#sheetBody.stu2 .shbk .h{font-size:12px;color:#6C6883}'; document.head.appendChild(css1679);\n" +
   "    const books1679 = () => { const code = STU.code, now = Date.now() - 3 * 36e5, ov = BK1679[code];\n" +
   "      if(ov && Date.now() - ov.t < 6 * 36e5) return [{ book: ov.book, t: '' }];\n" +
   "      const ok = (Array.isArray(STU.cls) ? STU.cls : []).filter(c => c && !c.cancelled && c.book && !/-TC\\b|trial/i.test(String(c.title || '')));\n" +
   "      let L = ok.filter(c => +new Date(c.start) >= now); if(!L.length) L = ok.slice().sort((a, b) => +new Date(b.start) - +new Date(a.start)).slice(0, 1);\n" +
   "      const seen = {}, out = []; L.sort((a, b) => +new Date(a.start) - +new Date(b.start)).forEach(c => { const k = String(c.book).trim().toLowerCase(); if(seen[k]) return; seen[k] = 1; out.push({ book: String(c.book).trim(), t: c.teacher || '' }); });\n" +
   "      if(!out.length && STU.s && STU.s.book) out.push({ book: window.bbPick ? bbPick(STU.s.book) : String(STU.s.book).split(/\\s*,\\s*/)[0], t: '' });\n" +
   "      if(out.length < 2) out.forEach(x => { x.t = ''; }); return out; };\n" +
   "    window.bk1679Open = i => { try{ const x = (window._bk1679L || [])[i]; if(!x || !window.bbOpen) return; const s = STU && STU.s || {}; bbOpen(x.book, s.name || '', s.cn || s.chinese || ''); }catch(e){} };\n" +
   "    const paint1679 = () => { try{ const body = $('sheetBody'); if(!body || !body.classList.contains('stu2') || typeof STU === 'undefined' || !STU || !STU.code || !(D && D.mgr) || !window.bbOpen) return;\n" +
   "      const hero = body.querySelector('.shero'); if(!hero) return; const L = books1679(); window._bk1679L = L;\n" +
   "      const html = L.length ? '<span class=\"lb\">Current books</span>' + L.map((x, i) => '<button type=\"button\" title=\"Covers and Taobao search words for the parent\" onclick=\"bk1679Open(' + i + ')\">📚 ' + esc(x.book) + (x.t ? ' <span>· ' + esc(typeof tName === 'function' ? tName(x.t) : x.t) + '</span>' : '') + ' <span>· what to buy ›</span></button>').join('') : (STU.cls ? '<span class=\"lb\">Current books</span><span class=\"h\">No book on the classes yet · use Change book</span>' : '');\n" +
   "      let el = hero.querySelector('.shbk'); if(!html){ if(el) el.remove(); return; } if(!el){ el = document.createElement('div'); el.className = 'shbk'; const wk = hero.querySelector('.shwk'); if(wk) wk.after(el); else hero.appendChild(el); }\n" +
   "      if(el.dataset.k !== html){ el.dataset.k = html; el.innerHTML = html; } }catch(e){} };\n" +
   "    const r1679 = window.stuRender; if(r1679) window.stuRender = function(){ const r = r1679.apply(this, arguments); try{ paint1679(); }catch(e){} setTimeout(paint1679, 120); setTimeout(paint1679, 900); return r; };\n" +
   "    try{ const sb = $('sheetBody'); let t1 = 0; if(sb) new MutationObserver(() => { clearTimeout(t1); t1 = setTimeout(paint1679, 200); }).observe(sb, { childList: true, subtree: true }); }catch(e){}\n" +
   "    const _api1679 = window.api; if(_api1679) window.api = function(fn){ const p = _api1679.apply(this, arguments);\n" +
   "      if(fn === 'mgmtSetBook'){ const code = arguments[2], multi = !!window._cbMulti; Promise.resolve(p).then(r => { if(!r || !r.ok || !r.book || r.same) return; if(!multi) BK1679[code] = { book: r.book, t: Date.now() };\n" +
   "        try{ delete CLSM[code]; }catch(e){} const s = (STU && STU.code === code && STU.s) || ((typeof MS !== 'undefined' && MS) || []).find(x => x.code === code) || {};\n" +
   "        setTimeout(() => { try{ if(window.bbOpen) bbOpen(window.bbPick ? bbPick(r.book) : r.book, s.name || '', s.cn || s.chinese || ''); }catch(e){} }, 700); }).catch(() => {}); }\n" +
   "      return p; }; }catch(e){}\n" +
   "  window.swMine1676 = "]
]);
