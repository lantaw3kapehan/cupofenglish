// 20 Oct · Trial sheet: a trial with no student code (Elsa · Mayi 19 Oct — six students are called Elsa) takes the code from its calendar booking
// (coe-trials v3 find), else management picks the student from the list. New first step "Student details": Edit details, and the parent's /
// student's email (coe-fb v2 contact · kept in the database; there is no email column in DATABASE).
require('../tools/lib.js')(process.argv[2], [
  ["if(D && D.mgr && t.code){   /* 378 */",
   "if(D && D.mgr && !t.code && !t._find){ t._find = 1; fetch(FAST_URL + '-trials', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, find: { date: t.date, student: t.student } }) }).then(x => x.json()).then(r => { if(!r || !r.ok) return; t._cands = r.list || []; if(r.code) t.code = r.code; if(TLD === t){ const o = $('tlAct'); if(o) o.dataset.tl4 = ''; tlBtns(); } }).catch(() => {}); }   /* 380 */\n" +
   "    if(D && D.mgr && !t.code && t._cands){ const r = document.createElement('div'); r.className = 'tl4-r'; r.innerHTML = '<div class=\"tl4-n\">?</div><div class=\"tl4-t\"><b>Which student is this?</b><span>' + (t._cands.length ? t._cands.length + ' students are called ' + esc(t.student) + ' · choose one to pay, schedule and send' : 'No student called ' + esc(t.student) + ' yet · add the student first') + '</span></div><div class=\"tl4-a\" style=\"flex-wrap:wrap\"></div>';\n" +
   "      const a = r.querySelector('.tl4-a'); t._cands.slice(0, 8).forEach(c => { const b = document.createElement('button'); b.type = 'button'; b.className = 'btn ghost sm'; b.textContent = c.code + (c.cn ? ' · ' + c.cn : '') + (c.trial ? ' · trial ' + c.trial : '') + (c.teacher ? ' · ' + c.teacher : ''); b.onclick = () => tlSetCode(c.code); a.appendChild(b); });\n" +
   "      if(!t._cands.length){ const b = document.createElement('button'); b.type = 'button'; b.className = 'btn teal sm'; b.textContent = '+ New student'; b.onclick = () => { try{ stuForm(); }catch(e){} }; a.appendChild(b); } A.appendChild(r); }\n" +
   "    if(D && D.mgr && t.code){   /* 378 */"],
  ["      row('paid', 'Paid', has ?",
   "      row('details', 'Student details', '<span id=\"tlCt\">' + cd + ' · checking emails…</span>', '<button class=\"btn ghost\" onclick=\"stuEdit(\\'' + cd + '\\')\">Edit details</button><button class=\"btn ghost\" onclick=\"ctSheet(\\'' + cd + '\\',\\'' + nm + '\\')\">Emails</button>');\n" +
   "      ctGet(t.code).then(c => { const el = $('tlCt'); if(el) el.textContent = t.code + ' · ' + (c && (c.parent || c.student) ? [c.parent ? 'Parent: ' + c.parent : '', c.student ? 'Student: ' + c.student : ''].filter(Boolean).join(' · ') : 'no email yet'); }).catch(() => {});\n" +
   "      row('paid', 'Paid', has ?"],
  ["\n</script>\n\n</body>", "\n</script>\n<script>\n/* 380 · choose the student of a trial · emails */\n" +
   "window.tlSetCode = function(c){ if(typeof TLD === 'undefined' || !TLD) return; TLD.code = c; const o = $('tlAct'); if(o) o.dataset.tl4 = ''; try{ tlBtns(); }catch(e){} toast(c + ' · ' + TLD.student); };\n" +
   "const CT380 = {}; window.ctGet = function(code){ if(CT380[code]) return CT380[code]; CT380[code] = fetch(FAST_URL + '-fb', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code, op: 'contact' }) }).then(x => x.json()).then(r => (r && r.ok && r.data && r.data.contact) || null).catch(() => { delete CT380[code]; return null; }); return CT380[code]; };\n" +
   "window.ctSheet = async function(code, name){ openSheet('<h1>' + esc(name || code) + ' · emails</h1><div class=\"mute small\">' + esc(code) + ' · for class invitations and reports · only management sees them</div>' +\n" +
   "  '<label style=\"margin-top:12px\">Parent\\'s email</label><input id=\"ctP\" class=\"in-t\" type=\"email\" placeholder=\"e.g. parent@gmail.com\" autocomplete=\"off\">' +\n" +
   "  '<label style=\"margin-top:10px\">Student\\'s email</label><input id=\"ctS\" class=\"in-t\" type=\"email\" placeholder=\"e.g. student@gmail.com\" autocomplete=\"off\">' +\n" +
   "  '<button class=\"btn teal block\" id=\"ctB\" style=\"margin-top:14px\" onclick=\"ctSave(\\'' + esc(code) + '\\')\">Save</button><div id=\"ctW\" class=\"small mute\" style=\"margin-top:6px\"></div>');\n" +
   "  const c = await ctGet(code); if(c){ if($('ctP')) $('ctP').value = c.parent || ''; if($('ctS')) $('ctS').value = c.student || ''; if($('ctW') && c.by) $('ctW').textContent = 'Last saved by ' + c.by + ' · ' + String(c.at || '').slice(0, 10); } };\n" +
   "window.ctSave = async function(code){ const b = $('ctB'); if(b){ b.disabled = true; b.textContent = 'Saving…'; }\n" +
   "  try{ const r = await fetch(FAST_URL + '-fb', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, code, op: 'contact', set: { parent: ($('ctP') || {}).value || '', student: ($('ctS') || {}).value || '' } }) }).then(x => x.json());\n" +
   "    if(!(r && r.ok && r.data)) throw 0; if(r.data.ok === false){ toast(r.data.msg || 'Check the email'); if(b){ b.disabled = false; b.textContent = 'Save'; } return; }\n" +
   "    CT380[code] = Promise.resolve(r.data.contact); toast('✓ Emails saved'); const R = window._tlRet; if(R && R.i > -1){ window._tlRet = null; tlOpen(R.i); } else closeSheet(); }\n" +
   "  catch(e){ toast('Not saved · check the connection'); if(b){ b.disabled = false; b.textContent = 'Save'; } } };\n</script>\n\n</body>"]
]);
