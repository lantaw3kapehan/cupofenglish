// 1779: (Misty 5 Nov 13:06 "for writing, can it be separate from SPEAKING? ... maybe she cannot do it 40 minutes today just the speaking,
//   that could be done at her home, and she will just send us") Walk-in assessment: Speaking and Writing stand on their own.
//   · Writing tab: "Copy message for home" (the link + how the 40 minutes work); the link already works any time until she taps Start.
//   · Speaking can be shared alone: her result / picture / message show Writing as "Pending" (no empty criteria) until it is scored.
//   · Her essay arriving: list chip "Essay in · score it" and a Management Home item "Walk-in essays to score".
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  function chip(a){ return a.shared_at ?",
   "  function chip(a){ if(a.essay_submitted_at && a.wr_band == null) return '<span class=\"as-k t\">Essay in \\u00b7 score it</span>';   /* 1779 */\n    return a.shared_at ?"],
  ["'<div class=\"as-row\"><button class=\"btn teal\" onclick=\"as1778.copy(\\'' + wl + '\\',\\'Writing link copied\\')\">Copy writing link</button>",
   "'<div class=\"as-row\"><button class=\"btn teal\" onclick=\"as1778.copy(as1778.homeMsg(),\\'Message copied \\u00b7 send it to her\\')\">Copy message for home</button><button class=\"btn ghost\" onclick=\"as1778.copy(\\'' + wl + '\\',\\'Writing link copied\\')\">Copy writing link</button>"],
  ["<div class=\"as-m\">Open it on her phone or a laptop. The 40 minutes start when she taps Start; it saves as she types and you see it below live.</div>",
   "<div class=\"as-m\">Here or at home: the link works any time. The 40 minutes start only when she taps Start; it saves as she types, is sent by itself at 40:00, and you see it below live.</div>"],
  ["  function msg(){ const a = S.a, f = String(a.name || '').split(' ')[0]; return 'Hi ' + f + ', thank you for taking the CupOfEnglish English Proficiency Assessment today.\\n\\nSpeaking: ' + b1(a.sp_band) + (a.cefr_sp ? ' (' + a.cefr_sp + ')' : '') + '\\nAcademic Writing Task 2: ' + b1(a.wr_band) + (a.cefr_wr ? ' (' + a.cefr_wr + ')' : '')",
   "  function homeMsg(){ const a = S.a, f = String(a.name || '').split(' ')[0]; return 'Hi ' + f + ', here is your CupOfEnglish Academic Writing task (IELTS Task 2):\\n' + SITE + '?w=' + a.wkey + '\\n\\nPlease do it when you have 40 quiet minutes. The time starts only when you tap Start, your writing is saved as you type, and it is sent to us automatically when the 40 minutes end (or when you tap Submit). Write at least 250 words. Please type your own answer; pasting and spell-check are off, as in the IELTS test.\\n\\nThank you!'; }   /* 1779 */\n" +
   "  function msg(){ const a = S.a, f = String(a.name || '').split(' ')[0]; return 'Hi ' + f + ', thank you for taking the CupOfEnglish English Proficiency Assessment.\\n\\nSpeaking: ' + (a.sp_band == null ? 'pending' : b1(a.sp_band) + (a.cefr_sp ? ' (' + a.cefr_sp + ')' : '')) + '\\nAcademic Writing Task 2: ' + (a.wr_band == null ? 'pending' : b1(a.wr_band) + (a.cefr_wr ? ' (' + a.cefr_wr + ')' : ''))"],
  ["  window.as1778 = { newForm,", "  window.as1778 = { homeMsg, newForm,"],
  ["  function guideHtml(){ const c = S.a.combined;", "  function guideHtml(){ const c = S.a.combined != null ? S.a.combined : S.a.sp_band != null ? S.a.sp_band : S.a.wr_band;   /* 1779 */"],
  // picture: a skill not scored yet shows "Pending" and no empty criteria
  ["c.fillStyle = NAVY; c.font = '400 104px ' + BR; c.fillText(b1(t[1]), x + 30, y + 160);",
   "c.fillStyle = NAVY; if(t[1] == null){ c.font = '400 56px ' + BR; c.fillText('Pending', x + 30, y + 140); } else { c.font = '400 104px ' + BR; c.fillText(b1(t[1]), x + 30, y + 160); }"],
  ["    y = bars('Speaking criteria', SP, a.sp || {}, y + 20); y = bars('Writing criteria', WR, a.wr || {}, y + 20);",
   "    if(a.sp_band != null) y = bars('Speaking criteria', SP, a.sp || {}, y + 20); if(a.wr_band != null) y = bars('Writing criteria', WR, a.wr || {}, y + 20);   /* 1779 */"],
  // Home: walk-in essays waiting to be scored
  ["  setInterval(poll, 4000);",
   "  /* 1779 · Management Home: essays sent in (e.g. from home) and not scored yet */\n" +
   "  let hAt = 0; const hLoad = () => { if(typeof D === 'undefined' || !D || !D.mgr || typeof TOKEN === 'undefined' || !TOKEN || Date.now() - hAt < 120000) return; hAt = Date.now(); loadList().then(() => { try{ if(VIEW === 'home') renderHome(); hmBadge(); }catch(e){} }); };\n" +
   "  const q0 = window.hmQueue; if(typeof q0 === 'function') window.hmQueue = function(){ const o = q0.apply(this, arguments); try{ const w = (S.list || []).filter(a => a.essay_submitted_at && a.wr_band == null);\n" +
   "    if(o && w.length){ o.Q.push({ n: w.length, tone: '', t: 'Walk-in essays to score', s: w.slice(0, 3).map(a => a.name).join(' \\u00b7 ') + ' \\u00b7 open Walk-in assessment \\u203a Writing', go: \"go('assess')\" }); } }catch(e){} return o; };\n" +
   "  const l0 = window.hmLoad; if(typeof l0 === 'function') window.hmLoad = function(){ hLoad(); return l0.apply(this, arguments); };\n" +
   "  setTimeout(hLoad, 5000); setInterval(() => { if(!document.hidden) hLoad(); }, 300000);\n" +
   "  setInterval(poll, 4000);"],
]);
