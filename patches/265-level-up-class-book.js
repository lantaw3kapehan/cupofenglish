// 17 Oct · Misty: Jennie's level-up report said "Now: REF Unit 1 page 7" — REF was only the test material; her class book is OD2.
// In a level-up test the book box now asks for the CLASS book (used in the report's Learning journey), and the test material
// has its own small box (kept with the decision, not in the report's "Now").
require('../tools/lib.js')(process.argv[2], [
["at.insertAdjacentHTML('beforebegin', '<div class=\"lut\" id=\"luT\"></div>'); el = $('luT'); }\n    el.innerHTML = html; }",
 "at.insertAdjacentHTML('beforebegin', '<div class=\"lut\" id=\"luT\"></div>'); el = $('luT'); }\n    el.innerHTML = html;\n" +
 "    try{ const bi = $('pcB'), lb = bi && bi.previousElementSibling; if(bi && lb && lb.tagName === 'LABEL' && !$('luTm')){ lb.innerHTML = 'Class book and unit now <span class=\"small mute\" style=\"font-weight:400\">· the book in the regular classes (not the test material)</span>'; bi.placeholder = 'e.g. Oxford Discover 2 - Unit 5 p.32';\n" +
 "      bi.insertAdjacentHTML('afterend', '<label>Test material used <span class=\"small mute\" style=\"font-weight:400\">· for the level-up test</span></label><input id=\"luTm\" class=\"in-t\" placeholder=\"e.g. REF Unit 1 p.7 (A2 reading and questions)\" oninput=\"luTmSet(this.value)\" value=\"' + esc(d.tm || '') + '\">'); } }catch(e){} }\n" +
 "  window.luTmSet = function(v){ const q = luOf(CUR); if(!q) return; DECS[q.k] = Object.assign(DECS[q.k] || {}, { tm: v }); keep(); };"],
["return { to: q.to, d: d.d, why: String(d.why || '').slice(0, 800), cefr: rubric(tot) }; };",
 "return { to: q.to, d: d.d, why: (String(d.why || '').trim() + (String(d.tm || '').trim() ? ' (Test material: ' + String(d.tm).trim() + ')' : '')).slice(0, 800), test: String(d.tm || '').slice(0, 120), cefr: rubric(tot) }; };"],
]);
