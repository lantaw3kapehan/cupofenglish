// 1330: (Misty, 27 Oct 12:43 · teacher access)
//  1. Today: a class running now showed "Now & next" with the next class's card beside/below the main card AND "then <next> at 16:00",
//     and the same class again further down → one place only: Now & next shows the class now (with "then … at 16:00");
//     the next class stays first in "Remaining today". With no class now, the next class is the main card (unchanged).
//  2. Class brief "Level" was blank unless the student had a progress check → the same one-level rule as the student page / journey
//     (latest assessment · else last course level across all DATABASE rows · else trial level, via coe-cj); "Not assessed yet" only
//     when nothing is known.
//  3. Student page "At a glance" took its level from the first progress check / book name (Alice: Pre-A1) while the header and
//     journey said A1 → it uses the same level; shown as "A1 now → goal A2".
//  4. "At a glance" monthly score was labelled with the month the feedback is due (November) → the month of the classes
//     ("Oct 2026 classes"), as everywhere else since 1220.
require('../tools/lib.js')(process.argv[2], [
  ["[cur, nxt].forEach(function(c){ if(!c) return;", "[cur, cur ? null : nxt].forEach(function(c){ if(!c) return;"],
  ["const lv = (ck && ck.cefr) || ''; if($('cbLv')) $('cbLv').textContent = lv || '—';",
   "const lvOne = () => { try{ return (window.cjNowLv && cjNowLv({ code: c.code, r: r, s: s })) || ''; }catch(e){ return ''; } };   /* 1330 */\n" +
   "const lv = lvOne() || (ck && ck.cefr) || (r.trial && r.trial.cefr) || ''; if($('cbLv')) $('cbLv').textContent = lv || 'Not assessed yet';\n" +
   "try{ if(window.CJX && !CJX[c.code] && typeof FAST_URL !== 'undefined' && TOKEN) fetch(FAST_URL + '-cj', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, op: 'one', code: c.code }) }).then(y => y.json()).then(x => { if(x && x.ok){ CJX[c.code] = { at: Date.now(), cj: x.cj || null, trials: x.trials || [] }; const v2 = lvOne(); if(v2 && $('cbLv') && $('cbLv').textContent !== v2) $('cbLv').textContent = v2; } }).catch(() => {}); }catch(e){}"],
  ["const L = ['Pre-A1','A1','A2','B1','B2','C1','C2'], lvNow = (C[0] && C[0].cefr)",
   "const L = ['Pre-A1','A1','A2','B1','B2','C1','C2'], lvNow = (function(){ try{ return (window.cjNowLv && cjNowLv(STU)) || ''; }catch(e){ return ''; } })() || (C[0] && C[0].cefr)"],
  ["(nxt ? '<small>→</small><span class=\"n\">' + nxt + '</span>' : '')", "(lvNow ? '<small>now</small>' : '') + (nxt ? '<small>→ goal</small><span class=\"n\">' + nxt + '</span>' : '')"],
  ["esc(nmo(f0.month))", "esc(window.fbClsLab && /^\\d{4}-\\d{2}/.test(String(f0.month || '')) ? fbClsLab(f0.month) + ' classes' : nmo(f0.month))"]]);
