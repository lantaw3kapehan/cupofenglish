// 1597: (Misty's live telemetry, v1473, 13:59 and 14:19: "sEnr 418,272 | 0.043" + "sSrc 49,0 | 0.0045" at 6–9.5 s) Edit details on a student
// drew the full form, then ~1.3 s later folded the filled sections into one-line summaries (essentials → fold, after it waits for the email
// and DATABASE): the whole form jumped (preview: 0.057; plus a birthdate row growing 37 px). Now the form stays invisible (its space kept)
// until the fold has run, then shows once in its final form; a safety timer shows it after 2.5 s in any case.
// Edit details now opens over the student page (‹ Back returns to it) instead of closing the card and opening a short loading card 120 ms later.
// A card opened on top of another (Edit details, Lesson summary…) keeps the sheet's height while its loading bars show (preview: 0.094 → 0).
// Student page header (live "stuStat 24,0 | 0.0057" at 2.9 s, v1473): on laptops the two meta lines no longer wrap when a late item (e-mail,
// city, partner) arrives — they stay one line each and cut with "…" (full text on hover / Profile tab). Phones still wrap.
const lib = require('../tools/lib.js'), file = process.argv[2];
lib(file, [
  ["const code = m[0], newRow = /New row for/.test(sub.textContent); b.querySelector('#sEn').dataset.sf = 1;",
   "const code = m[0], newRow = /New row for/.test(sub.textContent); b.querySelector('#sEn').dataset.sf = 1;\n  b.classList.add('sfw1597'); setTimeout(() => { b.classList.remove('sfw1597'); }, 2500);   /* 1597: shown once folded */"],
  ["    snap(b); };\n  const fill = d =>",
   "    snap(b); b.classList.remove('sfw1597'); };\n  const fill = d =>"],
  ["    closeSheet(); setTimeout(() => stuForm(r[r.length - 1], r[0]), 120); };",
   "    stuForm(r[r.length - 1], r[0]); };   /* 1597: opens over the student page (Back returns to it) instead of closing and reopening */"],
  ["if(s && s.style.minHeight && !document.getElementById('stuLoad')) s.style.minHeight = '';",
   "if(s && s.style.minHeight && !document.getElementById('stuLoad') && !s.dataset.mh1597) s.style.minHeight = '';"],
  ["</body>\n</html>",
   "<script>/* 1597 · a card that opens on top of another keeps the height while it loads (no jump to a short loading card) */(function(){ if(window.__1597) return; window.__1597 = 1; const o = window.openSheet; if(typeof o !== 'function') return; let LC = 0, LH = 0; const c0 = window.closeSheet; if(typeof c0 === 'function') window.closeSheet = function(){ try{ const s = document.getElementById('sheet'); if(s && s.classList.contains('on')){ LH = s.offsetHeight; LC = Date.now(); } }catch(e){} return c0.apply(this, arguments); }; window.openSheet = function(html){ const sh = document.getElementById('sheet'), on = !!(sh && sh.classList.contains('on')), was = on || Date.now() - LC < 400, h = on ? sh.offsetHeight : was ? LH : 0; const r = o.apply(this, arguments); try{ if(was && h && /class=\"sk\"/.test(String(html))){ sh.style.minHeight = h + 'px'; sh.dataset.mh1597 = 1; } else if(sh && sh.dataset.mh1597){ sh.style.minHeight = ''; delete sh.dataset.mh1597; } }catch(e){} return r; }; })();</script>\n<style id=\"css1597\">#sheetBody.sfw1597>:not(h1):not(.mute.small):not(.sbk):not(#rnBack){visibility:hidden}\n@media(min-width:621px){#sheet #sheetBody.stu2 .shero.h1589 .grow>:is(.h-who,.h-learn):not(#z1597){flex-wrap:nowrap!important;overflow:hidden}#sheet #sheetBody.stu2 .shero.h1589 .grow>:is(.h-who,.h-learn):not(#z1597)>*{white-space:nowrap;min-width:0;flex:0 1 auto;overflow:hidden;text-overflow:ellipsis}#sheet #sheetBody.stu2 .shero.h1589 .grow>:is(.h-who,.h-learn):not(#z1597)>:first-child{flex:none}}</style>\n</body>\n</html>"]
]);
