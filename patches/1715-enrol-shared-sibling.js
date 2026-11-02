// 1715: (Misty, 2 Nov 18:19) "Nature and Ruyi are shared package but in the app Nature is still not syncing with Ruyi" → "both 1 and 2,
//   especially longer term". A sibling who uses the package the other child paid for had no way to get an ACTIVE row in the app
//   (Enrolled · paid always needs a payment or a lesson transfer), so "Shares a package with…" had no row to be set on.
//   · Enrolled · paid now has "Shares a sibling's package · no payment" at the top. It opens a short form: the sibling who paid
//     (children with a paid package; the ones from the same source are offered first), teacher, first class, course.
//   · Save → mgmtEnrolShared (Google, SERVER-SHAREDENROL1102-paste.md): new ACTIVE row with no lessons of its own and
//     Shared Package Code = the sibling's code, so this child's classes come off the sibling's package. No SALES row.
//   · Until the server part is pasted, Save says so instead of failing silently.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  ["  /* 1706 · adults: occupation and industry on the student page */\n",
   "  /* 1715 · Enrolled · paid › Shares a sibling's package · no payment */\n" +
   "  try{ const up = x => String(x || '').trim().toUpperCase();\n" +
   "    const cols = () => { const C = {}; try{ (AT.cols || []).forEach((c, i) => C[c] = i); }catch(e){} return C; };\n" +
   "    const srcOf = code => { try{ const r = ((typeof DB !== 'undefined' && DB && DB.rows) || []).filter(r => up(r[0]) === up(code)).pop(); return r ? String(r[22] || '').trim() : ''; }catch(e){ return ''; } };\n" +
   "    window.enShSheet = async function(code, name, teacher){\n" +
   "      openSheet('<h1>' + esc(name) + ' · shares a sibling\\'s package</h1><div class=\"sk\"></div><div class=\"sk\"></div>');\n" +
   "      try{ if(typeof AT === 'undefined' || !AT || !AT.rows) await loadActive(true); }catch(e){}\n" +
   "      let cls = []; try{ const L = await api('mgmtStuClasses', TOKEN, code); cls = Array.isArray(L) ? L : []; }catch(e){}\n" +
   "      const fut = cls.filter(c => !c.cancelled && !/-TC$/i.test(String(c.title || '').replace(/\\s+X$/, '')) && new Date(c.start) > Date.now()).sort((a, b) => String(a.start).localeCompare(String(b.start)));\n" +
   "      const first = fut[0] ? ymdLocal(new Date(fut[0].start)) : '', books = [...new Set(cls.map(c => String(c.book || '').trim()).filter(Boolean))];\n" +
   "      const tFut = fut[0] ? String((fut[0].teachers || [fut[0].teacher] || [])[0] || fut[0].teacher || '') : '', T = [...new Set([].concat((typeof SL !== 'undefined' && SL && SL.teachers) || [], teacher || [], tFut || []).filter(Boolean))];\n" +
   "      const C = cols(), rows = (typeof AT !== 'undefined' && AT && AT.rows) ? AT.rows : [], me = srcOf(code);\n" +
   "      const own = rows.filter(r => r[C.enrolled] !== '' && r[C.enrolled] != null && up(r[C.code]) !== up(code));\n" +
   "      const sug = own.filter(r => me && String(r[C.source] || '').trim() === me).sort((a, b) => String(b[C.start] || '').localeCompare(String(a[C.start] || ''))).slice(0, 6);\n" +
   "      const tSel = T.map(t => '<option' + (t.toLowerCase() === String(tFut || teacher || '').toLowerCase() ? ' selected' : '') + '>' + esc(t) + '</option>').join('');\n" +
   "      openSheet('<h1>' + esc(name) + ' · shares a sibling\\'s package</h1><div class=\"mute small\">' + esc(code) + ' · no payment · this child\\'s lessons come off the package the sibling paid for</div>' +\n" +
   "        '<label>Sibling who paid</label><input id=\"esW\" class=\"in-t\" list=\"esL\" placeholder=\"Type the name or code of the child whose package it is\" autocomplete=\"off\"><datalist id=\"esL\">' + own.map(r => '<option value=\"' + esc(up(r[C.code]) + ' · ' + r[C.name]) + '\">' + esc((r[C.cn] || '') + ' · ' + (r[C.teacher] || '')) + '</option>').join('') + '</datalist>' +\n" +
   "        (sug.length ? '<div class=\"rnl\" style=\"margin-top:6px\">' + sug.map(r => '<button type=\"button\" class=\"rno\" onclick=\"$(\\'esW\\').value=this.dataset.v\" data-v=\"' + esc(up(r[C.code]) + ' · ' + r[C.name]) + '\"><b>' + esc(r[C.name]) + ' ' + esc(r[C.cn] || '') + '</b><span>' + esc(up(r[C.code])) + ' · ' + esc(r[C.teacher] || '') + ' · ' + esc(String(r[C.enrolled])) + ' lessons</span></button>').join('') + '</div><div class=\"small mute\" style=\"margin-top:4px\">Same source (' + esc(me) + '), newest first</div>' : '') +\n" +
   "        '<label>Teacher</label><select id=\"esT\" class=\"in-t\">' + tSel + '</select>' +\n" +
   "        '<div class=\"row\" style=\"gap:8px\"><div class=\"grow\"><label>First class</label><input id=\"esS\" class=\"in-t\" type=\"date\" value=\"' + esc(first) + '\"></div><div class=\"grow\"><label>Course</label><input id=\"esC\" class=\"in-t\" value=\"' + esc(books.length === 1 ? books[0] : '') + '\" placeholder=\"calendar course code · blank = all\"></div></div>' +\n" +
   "        '<div class=\"card\" style=\"margin-top:12px;background:#F1FAF9;border-color:#BFE6E3\"><div class=\"small\">Adds ' + esc(name) + '\\'s row to ACTIVE with <b>no lessons of its own</b> and Shared Package Code = the sibling, so both children use one package. Nothing goes into SALES.</div></div>' +\n" +
   "        '<button id=\"esGo\" class=\"btn teal block\" style=\"margin-top:14px\" onclick=\"enShSave(\\'' + esc(code) + '\\',\\'' + esc(String(name).replace(/\\'/g, '')) + '\\')\">Save · shares the package</button>');\n" +
   "    };\n" +
   "    window.enShSave = async function(code, name){ const b = $('esGo'); if(b && b.disabled) return;\n" +
   "      const v = String(($('esW') || {}).value || ''), owner = (v.toUpperCase().match(/ST-\\d{4}-\\d{3}/) || [''])[0], teacher = String(($('esT') || {}).value || '').trim();\n" +
   "      if(!owner) return toast('Choose the sibling who paid from the list'); if(owner === up(code)) return toast('Choose the other child (the one who paid)'); if(!teacher) return toast('Choose the teacher');\n" +
   "      if(b){ b.disabled = true; b.textContent = 'Saving… (Google takes up to 30 s)'; }\n" +
   "      try{ const r = await api('mgmtEnrolShared', TOKEN, { code: up(code), owner, teacher, start: String(($('esS') || {}).value || ''), course: String(($('esC') || {}).value || '').trim() });\n" +
   "        if(!r || !r.ok) throw r;\n" +
   "        try{ if(typeof SB_FRESH !== 'undefined') Object.keys(SB_FRESH).forEach(k => { if(/(mgmtActive|mgmtStudents?|mgmtRenewals)\\|/.test(k)) delete SB_FRESH[k]; }); }catch(e){}\n" +
   "        openSheet('<h1>✓ ' + esc(r.name || name) + ' shares ' + esc(r.ownerName || owner) + '\\'s package</h1><div class=\"card\" style=\"margin-top:10px;background:#F1FAF9;border-color:#BFE6E3\"><div class=\"small\">ACTIVE row ' + esc(r.row) + ' · Teacher ' + esc(teacher) + ' · no lessons of its own · Shared Package Code ' + esc(owner) + '</div><div class=\"small mute\" style=\"margin-top:4px\">The shared package shows in Students within about 2 minutes.</div></div><button class=\"btn block\" style=\"margin-top:14px\" onclick=\"closeSheet()\">Done</button>');\n" +
   "        try{ setTimeout(() => { loadActive(true).catch(() => {}); }, 90000); }catch(e){} }\n" +
   "      catch(e){ if(b){ b.disabled = false; b.textContent = 'Save · shares the package'; } const m = String((e && e.msg) || '');\n" +
   "        toast(/unknown action/i.test(m) ? 'The server part is not installed yet (SERVER-SHAREDENROL1102)' : (m || 'Not saved. Check your internet and try again.')); } };\n" +
   "    const _en1715 = window.enSheet; if(typeof _en1715 === 'function') window.enSheet = async function(code, name, teacher){ const r = await _en1715.apply(this, arguments);\n" +
   "      try{ if(typeof ENS !== 'undefined' && ENS && ENS.code === code && !document.getElementById('enSh1715')){ const h = document.querySelector('#sheet h1'), sub = h && h.nextElementSibling;\n" +
   "        if(sub) sub.insertAdjacentHTML('afterend', '<button type=\"button\" id=\"enSh1715\" class=\"btn ghost sm\" style=\"margin-top:8px\" onclick=\"enShSheet(\\'' + esc(code) + '\\',\\'' + esc(String(name || '').replace(/\\'/g, '')) + '\\',\\'' + esc(String(teacher || '').replace(/\\'/g, '')) + '\\')\">Shares a sibling\\'s package · no payment →</button>'); } }catch(e){}\n" +
   "      return r; };\n" +
   "  }catch(e){}\n" +
   "  /* 1706 · adults: occupation and industry on the student page */\n"]
]);
