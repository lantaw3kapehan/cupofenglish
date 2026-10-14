// 14 Oct pm · Speed (Misty: "do all now"). "Add to calendar" waited ≈ 10 s on the sheet (calendar + conflict check).
// Now the sheet closes at once and the classes are added in the background ("Adding Ellery · 12 classes…").
// When it's done, the share message opens as before (after any sheet you opened meanwhile is closed).
// If the server says no (a clash, a missing teacher …), the same form comes back exactly as you left it, with the reason.
// Enrol (20–40 s: SALES + ACTIVE + invoice) works the same way: the sheet closes, "Enrolling …" shows, and the
// "✓ enrolled" card opens when it's done. Tapping Save again for the same student while it's still saving is blocked.
require('../tools/lib.js')(process.argv[2], [
["const b = $('cGo'); b.disabled = true; b.textContent = 'Adding…';\ntry{ const r = await api('addClass', TOKEN, f); if(!r.ok) throw r; toast('Added · ' + r.note + (r.ref || ''));",
 "const body = $('sheetBody'), snap = body.innerHTML, vals = {}; body.querySelectorAll('input,select,textarea').forEach(el => { if(el.id) vals[el.id] = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value; });\n" +
 "const back = () => { const same = $('cGo') && body.innerHTML === snap; if(!same){ openSheet(snap); Object.keys(vals).forEach(k => { const el = $(k); if(!el) return; if(el.type === 'checkbox' || el.type === 'radio') el.checked = vals[k]; else el.value = vals[k]; }); } else { $('scrim').classList.add('on'); $('sheet').classList.add('on'); } const b = $('cGo'); if(b){ b.disabled = false; b.textContent = 'Add to calendar'; } try{ classPrev(); }catch(y){} };\n" +
 "closeSheet(); toast('Adding ' + (s.name || s.code) + (f.count > 1 ? ' · ' + f.count + ' classes' : '') + '…');   /* 14 Oct: closes at once, adds in the background */\n" +
 "try{ const r = await api('addClass', TOKEN, f); if(!r.ok) throw r; toast('✓ Added · ' + r.note + (r.ref || ''));"],
["try{ classShare(f, r, s); if(r.sub) cxSubCard(r.sub); }catch(x){ closeSheet(); }\nObject.keys(SCC)",
 "const share = () => { try{ classShare(f, r, s); if(r.sub) cxSubCard(r.sub); }catch(x){ closeSheet(); } };\n" +
 "whenFree(share);   /* the share message waits for a sheet you opened meanwhile */\n" +
 "Object.keys(SCC)"],
["catch(e){ toast((e&&e.msg)||'Not added. Try again.'); b.disabled = false; classPrev(); }",
 "catch(e){ back(); toast(((e&&e.msg)||'Not added') + ' · your details are back in the form'); }\nfinally{ delete BUSY[bk]; }"],
["const body = $('sheetBody'), snap = body.innerHTML, vals = {};",
 "const bk = 'c:' + f.code + '|' + f.date + '|' + f.time; if(BUSY[bk]) return toast('Still adding this class · wait a moment'); BUSY[bk] = 1;\nconst body = $('sheetBody'), snap = body.innerHTML, vals = {};"],
["async function sendClass(){",
 "const BUSY = {};   /* 14 Oct: saves running in the background (no double taps) */\nconst whenFree = fn => { if(!$('sheet').classList.contains('on')) return fn(); let n = 0; const w = setInterval(() => { if(!$('sheet').classList.contains('on') || ++n > 120){ clearInterval(w); if(n <= 120) fn(); } }, 1000); };\nasync function sendClass(){"],
["if(b){ b.disabled = true; b.textContent = 'Saving… (about 20–40 seconds)'; }\ntry{ const r = await api('mgmtEnrolPaid', TOKEN, f); if(!r || !r.ok) throw r; AT = null; MS = null; try{ ding('msg'); }catch(e){}\nopenSheet(",
 "const bk = 'e:' + S.code; if(BUSY[bk]) return toast('Still saving ' + S.name + '\\'s enrolment · wait a moment'); BUSY[bk] = 1;\n" +
 "const body = $('sheetBody'), snap = body.innerHTML, vals = {}; body.querySelectorAll('input,select,textarea').forEach(el => { if(el.id && el.type !== 'file') vals[el.id] = (el.type === 'checkbox' || el.type === 'radio') ? el.checked : el.value; });\n" +
 "closeSheet(); toast('Enrolling ' + S.name + '… (about 30 s · you can keep working)');   /* 14 Oct: closes at once, saves in the background */\n" +
 "try{ const r = await api('mgmtEnrolPaid', TOKEN, f); if(!r || !r.ok) throw r; AT = null; MS = null; try{ ding('msg'); }catch(e){} toast('✓ ' + S.name + ' enrolled');\nwhenFree(() => openSheet("],
["'<button class=\"btn teal block\" style=\"margin-top:14px\" onclick=\"cnOpen(\\'' + esc(S.code) + '\\')\">Class notice</button><button class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"openStudent(\\'' + esc(S.code) + '\\')\">Open student</button>'); }\ncatch(e){ if(b){ b.disabled = false; b.textContent = 'Save enrolment'; } toast((e && e.msg) || 'Not saved. Check SALES and ACTIVE before trying again.'); } };",
 "'<button class=\"btn teal block\" style=\"margin-top:14px\" onclick=\"cnOpen(\\'' + esc(S.code) + '\\')\">Class notice</button><button class=\"btn ghost block\" style=\"margin-top:8px\" onclick=\"openStudent(\\'' + esc(S.code) + '\\')\">Open student</button>')); }\n" +
 "catch(e){ try{ if(!($('enGo') && $('sheetBody').innerHTML === snap)){ openSheet(snap); Object.keys(vals).forEach(k => { const el = $(k); if(!el) return; if(el.type === 'checkbox' || el.type === 'radio') el.checked = vals[k]; else el.value = vals[k]; }); } else { $('scrim').classList.add('on'); $('sheet').classList.add('on'); } ENS = S; const b2 = $('enGo'); if(b2){ b2.disabled = false; b2.textContent = 'Save enrolment'; } }catch(y){}\n" +
 "  toast(((e && e.msg) || 'Not saved') + ' · check SALES and ACTIVE before trying again' + (f.file ? ' · choose the invoice file again' : '')); }\nfinally{ delete BUSY[bk]; } };"],
]);
