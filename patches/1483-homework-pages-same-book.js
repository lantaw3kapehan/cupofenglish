// 1483 · Homework "Pages go back" only within the same book (Misty 18:26 · Kat could not give "page 3" to Phyllis ST-2025-103)
// Cause: the check compared the new page with the last homework that had page numbers (matched only workbook / not workbook),
// never the book. Phyllis moved from LongVowels (last paged homework "Long Vowels Workbook - page 37", 14 Oct) to OD1 (21 Oct),
// so page 3 of the new book was called "going back · next is p. 38"; the first Save showed a red box, the second sent tHwFlag.
// Now (both paths: the Homework sheet / markHw and the class note's homework box #nH / saveNote):
// · The book of the new homework = the book of this class (class record), else the student's book.
// · The book of the earlier homework = the book of that day's class (the teacher's own schedule, tSchedule for that day,
//   looked up once, ≤ 2.5 s), else the book named in its text when that is this class's book.
// · Pages are compared only when both books are known and the same, and no "Updated / new book" homework came in between.
//   Different or unknown book → no page warning. "Same homework as before" is unchanged.
// · The warning is a warning: "Check the pages" with two buttons, Change it / Keep it (one tap keeps it and saves).
// · One flag per homework: a second tap or a retry never sends tHwFlag twice (the log shows most flags sent twice, 0.5 s apart),
//   and Save cannot run twice while the check is still reading the history.
// Nothing else changes: same flag sheet (S-HW-FLAGS), same history read, same saves.
const file = process.argv[2];
const OLD_CHECK = `function check(text, list, eventId){
if(!text || /^no homework/i.test(text)) return null;
const L = list.filter(x => x.eventId !== eventId && !/^no homework/i.test(x.text));
const same = L.find(x => norm(x.text) === norm(text));
if(same) return { issue: 'Same homework as before', msg: 'This is the same homework as on ' + fd(same.date) + ' (' + same.text + '). Give the next pages or a new task.', last: same };
const pg = pages(text); if(!pg.length) return null;
const prev = L.find(x => pages(x.text).length && isWb(x.text) === isWb(text)); if(!prev) return null;
const lastMax = Math.max.apply(null, pages(prev.text)), curMin = Math.min.apply(null, pg);
if(curMin <= lastMax) return { issue: 'Pages go back', msg: 'Page ' + curMin + ' comes before the last homework (' + prev.text + ', ' + fd(prev.date) + '). ' + (isWb(text) ? 'Workbook pages should move forward' : 'Pages should move forward') + ': next is p. ' + (lastMax + 1) + '.', last: prev };
return null;
}`;
const NEW_CHECK = `const bkK = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, '');
const BK1483 = {};   /* code|day → book of my class that day ('' = looked up, not found) */
const bookNow = (code, eventId) => { const c = (D.schedule || []).find(x => x.id === eventId && (!code || String(x.code || '').toUpperCase() === String(code).toUpperCase())) || (D.schedule || []).find(x => String(x.code || '').toUpperCase() === String(code || '').toUpperCase() && x.day === D.today);
  const s = (D.students || []).find(x => String(x.code || '').toUpperCase() === String(code || '').toUpperCase()); return (c && c.book) || (s && s.book) || ''; };
const CHG = /\\b(updated|new book|next book|moved to|changed? to|start(?:ed|s|ing)? (?:the )?(?:new |next )?book)\\b/i;
async function books1483(code, list, text){   /* looks up only the earlier homework's class day that could matter, once */
  const L = list.filter(x => !/^no homework/i.test(x.text)), pg = text == null ? [1] : pages(text); if(!pg.length) return;
  const prev = L.find(x => pages(x.text).length && (text == null || isWb(x.text) === isWb(text))); if(!prev) return;
  if(text != null && Math.min.apply(null, pg) > Math.max.apply(null, pages(prev.text))) return;
  const d = String(prev.date || '').slice(0, 10); if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(d) || (code + '|' + d) in BK1483) return;
  await Promise.race([api('tSchedule', TOKEN, d, 1).then(r => { const ev = ((r && (r.events || (r.data && r.data.events))) || []).find(e => String(e.code || '').toUpperCase() === String(code).toUpperCase() && !e.cancelled); BK1483[code + '|' + d] = ev ? String(ev.book || '') : ''; }).catch(() => {}), new Promise(z => setTimeout(z, 2500))]); }
function check(text, list, eventId, code){
if(!text || /^no homework/i.test(text)) return null;
const L = list.filter(x => x.eventId !== eventId && !/^no homework/i.test(x.text));
const same = L.find(x => norm(x.text) === norm(text));
if(same) return { issue: 'Same homework as before', msg: 'This is the same homework as on ' + fd(same.date) + ' (' + same.text + '). Give the next pages or a new task — or keep it if you meant to.', last: same };
const pg = pages(text); if(!pg.length) return null;
const pi = L.findIndex(x => pages(x.text).length && isWb(x.text) === isWb(text)); if(pi < 0) return null; const prev = L[pi];
if(L.slice(0, pi).some(x => CHG.test(x.text))) return null;                       /* a book change was written in between */
const cur = bookNow(code, eventId), kc = bkK(cur), day = String(prev.date || '').slice(0, 10), bd = BK1483[code + '|' + day];
const kp = bd ? bkK(bd) : (kc && bkK(prev.text).indexOf(kc) > -1 ? kc : '');
if(!kc || !kp || kc !== kp) return null;                                           /* different or unknown book: pages are not compared */
const lastMax = Math.max.apply(null, pages(prev.text)), curMin = Math.min.apply(null, pg);
if(curMin <= lastMax) return { issue: 'Pages go back', msg: 'Page ' + curMin + ' comes before the last homework in ' + cur + ' (' + prev.text + ', ' + fd(prev.date) + '). Next would be p. ' + (lastMax + 1) + '. If this is a review or a new part, keep it.', last: prev };
return null;
}`;
require('../tools/lib.js')(file, [
  [OLD_CHECK, NEW_CHECK],
  ["const paint = () => { const box = $('hwLast'), tip = $('hwLastTip'); if(!box) return; const h = HWH[code], w = h ? check(el.value.trim(), h.list, ev) : null;",
   "const paint = () => { const box = $('hwLast'), tip = $('hwLastTip'); if(!box) return; const h = HWH[code], w = h ? check(el.value.trim(), h.list, ev, code) : null;"],
  ["function warn(inputId, w){ const el = $(inputId); if(!el) return; const old = $('hwWarn'); if(old) old.remove();\nel.insertAdjacentHTML('afterend', '<div id=\"hwWarn\" class=\"gx-tip\" style=\"margin-top:6px;background:#FDECEA;border:2px solid #D93F2B;border-radius:10px;padding:8px 10px;color:#8E1F12\"><b style=\"color:#D93F2B\">⚠ Check the homework</b><br>' + esc(w.msg) + '<br><span class=\"small\">Change it, or tap Save again to keep it as it is.</span></div>');",
   "function warn(inputId, w, keep){ const el = $(inputId); if(!el) return; const old = $('hwWarn'); if(old) old.remove();\nel.insertAdjacentHTML('afterend', '<div id=\"hwWarn\" class=\"gx-tip\" role=\"alert\" style=\"margin-top:6px;background:#FFF6E8;border:1.5px solid #E2A33A;border-radius:10px;padding:8px 10px;color:#6B4A0E\"><b style=\"color:#8A5300\">' + (w.issue === 'Pages go back' ? 'Check the pages' : 'Same homework as before?') + '</b><br>' + esc(w.msg) + '<div style=\"display:flex;gap:8px;flex-wrap:wrap;margin-top:8px\"><button type=\"button\" class=\"btn ghost sm\" id=\"hwWarnFix\">Change it</button><button type=\"button\" class=\"btn teal sm\" id=\"hwWarnKeep\">Keep it</button></div><span class=\"small\" style=\"display:block;margin-top:4px\">Keep it saves it as it is · management sees a note about it.</span></div>');\n{ const f = $('hwWarnFix'), k = $('hwWarnKeep'); if(f) f.onclick = () => { try{ el.focus(); el.select && el.select(); }catch(e){} }; if(k) k.onclick = () => { k.disabled = true; k.textContent = 'Saving…'; if(keep) keep(); }; }"],
  ["function flag(c, text, w){ try{ api('tHwFlag',", "const FLAGGED = {}; function flag(c, text, w){ const fk = [c.code, c.day || D.today, text, w.issue].join('|'); if(FLAGGED[fk]) return; FLAGGED[fk] = 1; try{ api('tHwFlag',"],
  ["const t = $('hwT'), c = (D.schedule || []).find(x => x.id === id);\nif(t && c && c.code && !($('hwNo') && $('hwNo').checked)){ const text = t.value.trim(), w = check(text, await hist(c.code), id);\nif(w && OK_ONCE !== text){ OK_ONCE = text; warn('hwT', w); return; }",
   "const t = $('hwT'), c = (D.schedule || []).find(x => x.id === id);\nif(window._hw1483 === id) return; window._hw1483 = id; try{\nif(t && c && c.code && !($('hwNo') && $('hwNo').checked)){ const text = t.value.trim(), L = await hist(c.code); await books1483(c.code, L, text); const w = check(text, L, id, c.code);\nif(w && OK_ONCE !== text){ OK_ONCE = text; warn('hwT', w, () => { window._hw1483 = ''; window.markHw(id, btn); }); return; }"],
  ["hist(c.code).then(L => { const t = $('hwT');", "hist(c.code).then(L => { books1483(c.code, L); const t = $('hwT');"],
  ["hist(code).then(L => { const h = $('nH');", "hist(code).then(L => { books1483(code, L); const h = $('nH');"],
  ["if(w) flag(c, text, w); }\nreturn _mh(id, btn);\n};", "if(w) flag(c, text, w); }\n}finally{ window._hw1483 = ''; }\nreturn _mh(id, btn);\n};"],
  ["const w = check(text, await hist(code), eventId || '');\nif(w && OK_ONCE !== text){ OK_ONCE = text; warn('nH', w); return; }",
   "if(window._sn1483 === code + eventId) return; window._sn1483 = code + eventId; let w = null; try{ const L = await hist(code); await books1483(code, L, text); w = check(text, L, eventId || '', code); }finally{ window._sn1483 = ''; }\nif(w && OK_ONCE !== text){ OK_ONCE = text; warn('nH', w, () => window.saveNote(code, eventId, day)); return; }"]
]);
