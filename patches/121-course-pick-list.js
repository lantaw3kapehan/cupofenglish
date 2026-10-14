// 14 Oct night · Enrolled · paid: Course is picked, not typed (Misty: "you already know our courses").
// Books from the student's own calendar classes as one-tap buttons, then our course list (CN_BOOKS) grouped, "Other · type it"
// last. The value saved is the calendar spelling (e.g. DK2, OD1, IELTSWriting) so ACTIVE › COURSE matches the classes.
require('../tools/lib.js')(process.argv[2], [
["let first = r.firstClass || ''; try{ const L = await api('mgmtStuClasses', TOKEN, code);",
 "let first = r.firstClass || ''; try{ const L = await api('mgmtStuClasses', TOKEN, code); ENS.cls = Array.isArray(L) ? L : [];"],
["<label>Course <span class=\"mute small\">(book on the calendar, e.g. OD1)</span></label><input id=\"enC\" class=\"in-t\" list=\"cBL\" placeholder=\"OD1\"><datalist id=\"cBL\">' + (window.classBooks ? classBooks() : '') + '</datalist>' +",
 "<label>Course</label>' + bkHtml('enC', [...new Set((ENS.cls || []).map(c => String(c.book || '').trim()).filter(Boolean))]) +"],
["window.enOth = function(){",
 "window.bkCode = o => { const seen = {}; ['OD1','OD2','OD3','REF','RE1','RE2','TheAlphabet','ShortVowels','LongVowels','ConsonantBlends','LetterBlends','RazAa','RazA','RazBb','RazC','Pathways1','Pathways3','WondersGK','WondersG1','WondersG2','Freetalk','Debate','IELTSSpeaking','IELTSWriting','AcademicWriting','BusinessEnglish'].forEach(b => { seen[cnN(b)] = b; }); try{ ((typeof SC !== 'undefined' && SC && SC.events) || []).forEach(e => { const b = String(e.book || '').trim(); if(b) seen[cnN(b)] = b.replace(/\\s+/g, ''); }); ((typeof SL !== 'undefined' && SL && SL.books) || []).forEach(b => { if(b) seen[cnN(b)] = String(b).replace(/\\s+/g, ''); }); }catch(e){}\n" +
 "  for(const a of o) if(seen[cnN(a)]) return seen[cnN(a)]; return String(o[0]).replace(/\\s+/g, ''); };\n" +
 "window.bkName = b => { try{ return cnBookPick(b) || String(b || ''); }catch(e){ return String(b || ''); } };\n" +
 "window.bkHtml = (id, own) => (own.length ? '<div class=\"skc\" style=\"margin:2px 0 8px\">' + own.map(b => '<button type=\"button\" data-bk=\"' + esc(b) + '\" onclick=\"bkSet(\\'' + id + '\\',this.dataset.bk)\">' + esc(bkName(b)) + ' · on the calendar</button>').join('') + '</div>' : '') +\n" +
 "  '<select id=\"' + id + 'S\" class=\"in-t\" onchange=\"bkSel(\\'' + id + '\\',this.value)\"><option value=\"\">No course yet · counts every lesson with this teacher</option>' + CN_BOOKS.map(g => '<optgroup label=\"' + esc(g[0]) + '\">' + g[1].map(o => '<option value=\"' + esc(bkCode(o)) + '\">' + esc(o[0]) + '</option>').join('') + '</optgroup>').join('') + '<option value=\"__o\">Other · type it</option></select>' +\n" +
 "  '<input id=\"' + id + '\" class=\"in-t hide\" style=\"margin-top:6px\" placeholder=\"the course code as on the calendar\">';\n" +
 "window.bkSel = (id, v) => { const i = $(id); if(!i) return; if(v === '__o'){ i.classList.remove('hide'); i.value = ''; i.focus(); } else { i.classList.add('hide'); i.value = v; } };\n" +
 "window.bkSet = (id, b) => { const s = $(id + 'S'), i = $(id); if(!s || !i) return; const o = [...s.options].find(x => x.value && x.value !== '__o' && cnN(x.value) === cnN(b)); if(o){ s.value = o.value; bkSel(id, o.value); } else { s.value = '__o'; i.classList.remove('hide'); i.value = b; } };\n" +
 "window.enOth = function(){"],
]);
