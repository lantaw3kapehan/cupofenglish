// 1708: (Misty, 2 Nov 10:52, David's calendar picture) "this copy picture for parent isn't showing the real schedule above? they might
//   question its accuracy" · David has 5 weekly times (Mon–Thu 22:00, Sun 21:30) but the picture's "Every week" row only had room for
//   3 and dropped the rest; and the name showed his code (no package yet, so the page had the code as his name).
//   · The weekly chips now wrap onto as many rows as needed (the picture grows), so every weekly time is shown.
//   · The weekly times are read from the next 20 classes (was 12), so a 5-day week is found reliably.
//   · When the page only has the code, the picture takes the English and Chinese name from the student list, ACTIVE or the DATABASE copy.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["const sl = {}; live.slice(0, 12).forEach(e => {", "const sl = {}; live.slice(0, 20).forEach(e => {"],
  ["      const head = 420 + (W.length ? 70 : 0), mH =",
   "      const nm1708 = (() => { const up = x => String(x || '').trim().toUpperCase(), C0 = up(code); let en = s.name && !/^ST-\\d{4}-\\d{3}$/i.test(String(s.name)) ? s.name : '', zh = s.cn || s.chinese || '';   /* 1708 */\n" +
   "        try{ const L = [].concat((typeof MS !== 'undefined' && Array.isArray(MS)) ? MS : [], (typeof SL !== 'undefined' && SL && Array.isArray(SL.students)) ? SL.students : []); const x = L.find(y => y && up(y.code) === C0 && y.name && !/^ST-/i.test(String(y.name))); if(x){ en = en || x.name; zh = zh || x.cn || ''; } }catch(e){}\n" +
   "        try{ if((!en || !zh) && typeof AT !== 'undefined' && AT && AT.cols){ const C = {}; AT.cols.forEach((k, i) => C[k] = i); const r = AT.rows.find(r => up(r[C.code]) === C0); if(r){ en = en || r[C.name] || ''; zh = zh || r[C.cn] || ''; } } }catch(e){}\n" +
   "        try{ if((!en || !zh) && typeof DB !== 'undefined' && DB && Array.isArray(DB.rows)){ const r = DB.rows.find(r => up(r[0]) === C0); if(r){ en = en || r[2] || ''; zh = zh || r[1] || ''; } } }catch(e){}\n" +
   "        try{ if(!en){ const h = document.querySelector('#sheetBody h1'); if(h) en = String(h.childNodes[0] && h.childNodes[0].textContent || '').trim(); } }catch(e){}\n" +
   "        return { en: String(en || code).trim(), zh: String(zh || '').trim() }; })();\n" +
   "      const chipRows1708 = (() => { if(!W.length) return 0; const m = document.createElement('canvas').getContext('2d'); m.font = '400 24px Inter,\"PingFang SC\",\"Microsoft YaHei\",sans-serif'; const x0 = 56 + m.measureText('Every week · 每周').width + 20; let x = x0, n = 1;\n" +
   "        m.font = '700 26px Inter,\"PingFang SC\",\"Microsoft YaHei\",sans-serif'; W.forEach(w => { const lw = m.measureText(DEN[+w[0]] + ' 周' + DZH[+w[0]] + '  ' + w[1]).width + 36; if(x + lw > 1080 - 56 && x > x0){ n++; x = x0; } x += lw + 12; }); return n; })();\n" +
   "      const head = 420 + (W.length ? 70 + (chipRows1708 - 1) * 64 : 0), mH ="],
  ["c.font = '400 64px ' + BR; c.fillText(s.name || code, PAD, 306);",
   "c.font = '400 64px ' + BR; c.fillText(nm1708.en, PAD, 306);"],
  ["c.fillText([s.cn || s.chinese || '', code].filter(Boolean).join('  ·  '), PAD, 356);",
   "c.fillText([nm1708.zh, code].filter(Boolean).join('  ·  '), PAD, 356);"],
  ["c.font = '700 26px ' + F; const lw = c.measureText(lab).width + 36; if(x + lw > WD - PAD) return; c.fillStyle = NAVY; rr(x, y, lw, 52, 26);",
   "c.font = '700 26px ' + F; const lw = c.measureText(lab).width + 36; if(x + lw > WD - PAD && x > x00){ x = x00; y += 64; } c.fillStyle = NAVY; rr(x, y, lw, 52, 26);"],
  ["let x = PAD + c.measureText('Every week · 每周').width + 20; W.forEach(w => {",
   "let x = PAD + c.measureText('Every week · 每周').width + 20; const x00 = x; W.forEach(w => {"]
]);
