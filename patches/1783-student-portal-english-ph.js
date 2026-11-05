// 1783: (Misty 5 Nov "Yes, go ahead" + 13:52 "ensure that can be editable too like a real web app.. and easy for management to edit")
//   English (Philippines) student portal + walk-in assessment linked to a student.
//   · Student access: each student has "Portal language" — 中文 + English (default) / English (Philippines). One tap saves at once
//     (coe-student op sLocale → student_access.locale), no reload; tap the other to switch back. "Copy message" for English (Philippines)
//     is English only (no WeChat): link, ST code, password = English name (or own password).
//   · Walk-in assessment › Result › Her details: "Linked student" — type a name or ST code, tap a suggestion (from the students the app
//     already has) or type the code and tap Link; saved at once to coe_assessments.student_code (coe-assess). Un-link / re-link any time.
//     Shows in her student portal once linked; the portal reads the assessment live, so later edits show on its next refresh.
//     The linked student's portal language can be switched right there too.
const file = process.argv[2];
require('../tools/lib.js')(file, [
  // ── Student access (1350): the English (Philippines) message ──
  [String.raw`  function msg(x){ if(x && x.ph && window.phMsg1530) return phMsg1530(x, URLS); var n`,
   String.raw`  function msg(x){ if(x && x.ph && window.phMsg1530) return phMsg1530(x, URLS); if(x && x.locale === 'en-ph') return msgEn(x); var n`],
  [String.raw`  window.psMsg1354 = msg; window.__ps1350 = { P: P, call: call, load: load, paint: paint, URLS: URLS };`,
   String.raw`  /* 1783 · English (Philippines): English only, no WeChat; sign-in unchanged (ST code + English name, or the password they set) */
  function msgEn(x){ var n = String(x.name || '').trim(), L = [];
    L.push('CupOfEnglish · Student Portal');
    L.push(x.adult || !n ? 'Hello' + (n ? ' ' + n : '') + '! Your classes, lessons left, class notes, reports and English assessment are now on your phone.' : 'Hello, ' + n + '’s family! ' + n + '’s classes, lessons left, class notes, reports and English assessment are now on your phone.');
    L.push(''); L.push('Link: ' + URLS + '?lang=en-ph'); L.push('Student code: ' + x.code);
    L.push(x.own ? 'Password: the password you set (message us if you need it reset)' : 'Password: ' + (n ? n + ' (' + (x.adult ? 'your' : 'the student’s') + ' English name, not case-sensitive)' : (x.adult ? 'your' : 'the student’s') + ' English name (not case-sensitive)'));
    L.push(''); L.push('Add it to your home screen so it opens like an app:'); L.push('iPhone: open the link in Safari › Share › Add to Home Screen.'); L.push('Android: open the link in Chrome › menu (⋮) › Add to Home screen.');
    L.push(''); L.push('You stay signed in for 30 days. Message us anytime if you need help!'); return L.join('\n'); }
  /* 1783 · Portal language: one tap saves (sLocale), the list updates in place; no reload */
  function langSeg(x){ var en = x.locale === 'en-ph', b = P.busy['L' + x.code];
    return '<div class="row" style="gap:6px;flex-wrap:wrap;align-items:center;margin-top:8px"><span class="small mute">Portal language</span><div class="seg" role="group" aria-label="Portal language" style="margin:0">'
      + '<button type="button" class="' + (en ? '' : 'on') + '" ' + (b ? 'disabled ' : '') + 'aria-pressed="' + !en + '" onclick="psLoc(\'' + x.code + '\',\'zh\')">中文 + English</button>'
      + '<button type="button" class="' + (en ? 'on' : '') + '" ' + (b ? 'disabled ' : '') + 'aria-pressed="' + en + '" onclick="psLoc(\'' + x.code + '\',\'en-ph\')">English (Philippines)</button></div>'
      + (x.ph ? '<span class="small mute">· Philippine market: always English</span>' : '') + (b ? '<span class="small mute">Saving…</span>' : '') + '</div>'; }
  function setLoc(code, loc){ var x = (P.list || []).find(function(y){ return y.code === code; }); if(!x || x.locale === loc || P.busy['L' + code]) return Promise.resolve(x && x.locale === loc);
    var was = x.locale || 'zh'; x.locale = loc; P.busy['L' + code] = 1; repaint();
    return call('sLocale', { code: code, locale: loc }).then(function(r){ delete P.busy['L' + code]; if(r && r.ok){ toast(loc === 'en-ph' ? code + ' · portal in English (Philippines)' : code + ' · portal back to 中文 + English'); repaint(); return true; }
        x.locale = was; toast((r && r.msg) || 'Not saved · try again'); repaint(); return false; })
      .catch(function(){ delete P.busy['L' + code]; x.locale = was; toast('No connection · try again'); repaint(); return false; }); }
  function repaint(){ var L = document.getElementById('psL'); if(L) L.innerHTML = rows(); try{ if(window.as1783) as1783.refresh(); }catch(e){} }
  window.psLoc = setLoc;
  window.psMsg1354 = msg; window.__ps1350 = { P: P, call: call, load: load, paint: paint, URLS: URLS, setLoc: setLoc };`],
  [String.raw`'<button class="btn teal sm" onclick="psCopy(\'' + x.code + '\')">' + (x.ph ? 'Copy message (English)' : 'Copy WeChat message') + '</button>'`,
   String.raw`'<button class="btn teal sm" onclick="psCopy(\'' + x.code + '\')">' + (x.ph || x.locale === 'en-ph' ? 'Copy message (English)' : 'Copy WeChat message') + '</button>'`],
  [String.raw`(x.access ? 'Switch off' : 'Switch on') + '</button></div><div class="ph30-slot" id="psPh_' + x.code + '"></div></div>'; }).join('')`,
   String.raw`(x.access ? 'Switch off' : 'Switch on') + '</button></div>' + langSeg(x) + '<div class="ph30-slot" id="psPh_' + x.code + '"></div></div>'; }).join('')`],
  [String.raw`try{ navigator.clipboard.writeText(t).then(function(){ toast('Copied · paste it to ' + (x.adult ? (x.name || code) : (x.name || code) + '’s family') + ' on WeChat'); }`,
   String.raw`try{ navigator.clipboard.writeText(t).then(function(){ toast('Copied · ' + (x.ph || x.locale === 'en-ph' ? 'send it to ' : 'paste it to ') + (x.adult ? (x.name || code) : (x.name || code) + '’s family') + (x.ph || x.locale === 'en-ph' ? '' : ' on WeChat')); }`],
  [String.raw`and see the portal in English with their learning roadmap.</div>`,
   String.raw`and see the portal in English with their learning roadmap.</div><div class="small mute" style="margin:8px 0 0"><b>Portal language</b> (each student): <b>中文 + English</b> is the default; <b>English (Philippines)</b> shows the portal in English only, Philippine time, no WeChat wording. One tap saves; tap the other to switch back. Sign-in stays the ST code + English name.</div>`],
  // ── Walk-in assessment (1778): Linked student on the Result tab ──
  [String.raw`oninput="as1778.put(\'purpose\',this.value)">' + asrIn() + '</div>' +`,
   String.raw`oninput="as1778.put(\'purpose\',this.value)">' + asrIn() + '<div id="as-lk">' + lkHtml() + '</div></div>' +`],
  ['  window.as1778 = { ck, nm, edit, show, scrOpen,', String.raw`  /* 1783 · Linked student: the assessment shows in that student's portal (read live from coe_assessments) */
  const LK = { q: null, list: null, busy: 0, err: '' };
  const lkUp = s => String(s || '').trim().toUpperCase();
  const lkCode = s => { const t = lkUp(s).replace(/[\s_–—-]+/g, ''), m = t.match(/^ST(\d{4})(\d{3})$/); return m ? 'ST-' + m[1] + '-' + m[2] : ''; };
  function lkStudents(){ const m = {}, add = (c, n, cn, extra) => { const k = lkCode(c); if(!k) return; const o = m[k] = m[k] || { code: k, name: '', cn: '' }; if(!o.name && n) o.name = String(n).trim(); if(!o.cn && cn) o.cn = String(cn).trim(); if(extra) Object.assign(o, extra); };
    try{ const ms = (typeof MS !== 'undefined' && MS) ? (Array.isArray(MS) ? MS : (MS.students || MS.rows || [])) : []; ms.forEach(s => add(s.code, s.name || s.en, s.cn)); }catch(e){}
    try{ const A = window.__ps1350; ((A && A.P.list) || []).forEach(s => add(s.code, s.name, s.cn, { locale: s.locale || 'zh', ph: !!s.ph, access: 1 })); }catch(e){}
    return Object.values(m); }
  function lkLoad(){ const A = window.__ps1350; if(!A || LK.list) return; LK.list = 1;
    A.call('sList').then(r => { if(r && r.ok){ A.P.list = r.students || []; lkRefresh(); } }).catch(() => { LK.list = null; }); }
  function lkSug(){ const q = (LK.q == null ? '' : LK.q).trim().toLowerCase(), L = lkStudents(), nameW = String((S.a && S.a.name) || '').toLowerCase().split(/\s+/).filter(w => w.length > 1);
    const sc = s => { const t = (s.code + ' ' + s.name + ' ' + s.cn).toLowerCase(); if(q) return t.indexOf(q) > -1 ? (s.code.toLowerCase() === q ? 3 : 2) : 0; return nameW.filter(w => t.indexOf(w) > -1).length; };
    return L.map(s => [sc(s), s]).filter(x => x[0] > 0).sort((a, b) => b[0] - a[0] || b[1].code.localeCompare(a[1].code)).slice(0, 6).map(x => x[1]); }
  function lkHtml(){ const a = S.a; if(!a) return ''; lkLoad(); const cur = a.student_code || '', st = cur ? lkStudents().find(s => s.code === cur) : null;
    let h = '<h3 style="margin-top:14px">Linked student</h3><div class="as-m">Shows in her student portal once linked. Later changes here show there on its next refresh.</div>';
    if(cur) h += '<div class="as-row" style="align-items:center"><span style="font-weight:700;background:#E3F4F5;color:#00575F;border-radius:999px;padding:6px 12px;font-size:13.5px">' + E(cur) + (st && st.name ? ' · ' + E(st.name) : '') + '</span><button class="btn ghost sm" ' + (LK.busy ? 'disabled ' : '') + 'onclick="as1783.link(\'\')">Un-link</button><button class="btn ghost sm" onclick="as1783.change()">Change</button></div>'
      + (st && st.access ? '<div class="as-row" style="align-items:center"><span class="as-m" style="margin:0">Her portal language</span><button class="btn sm ' + (st.locale === 'en-ph' ? 'ghost' : 'teal') + '" onclick="as1783.loc(\'' + cur + '\',\'zh\')">中文 + English</button><button class="btn sm ' + (st.locale === 'en-ph' ? 'teal' : 'ghost') + '" onclick="as1783.loc(\'' + cur + '\',\'en-ph\')">English (Philippines)</button>' + (st.ph ? '<span class="as-m" style="margin:0">Philippine market: always English</span>' : '') + '</div>' : '');
    if(!cur || LK.q != null){ const sug = lkSug();
      h += '<div class="as-row"><input class="as-in" id="as-lkq" style="flex:1;min-width:180px" placeholder="Type her name or ST code" value="' + E(LK.q || '') + '" oninput="as1783.q(this.value)" onkeydown="if(event.key===\'Enter\'){event.preventDefault();as1783.link(this.value)}"><button class="btn teal sm" ' + (LK.busy ? 'disabled ' : '') + 'onclick="as1783.link(document.getElementById(\'as-lkq\').value)">Link</button>' + (cur ? '<button class="btn ghost sm" onclick="as1783.change(1)">Cancel</button>' : '') + '</div>'
        + '<div id="as-lks">' + (sug.length ? '<div class="as-m" style="margin-top:6px">' + (LK.q ? 'Matches' : 'Students with her name') + ' · tap to link</div><div class="as-row" style="margin-top:4px">' + sug.map(s => '<button class="btn ghost sm" ' + (LK.busy ? 'disabled ' : '') + 'onclick="as1783.link(\'' + s.code + '\')">' + E(s.code) + (s.name ? ' · ' + E(s.name) : '') + (s.cn ? ' ' + E(s.cn) : '') + '</button>').join('') + '</div>' : (LK.q ? '<div class="as-m" style="margin-top:6px">No student matches · type the full ST code (e.g. ST-2026-001) and tap Link</div>' : '')) + '</div>'; }
    if(LK.err) h += '<div class="as-m" style="color:#B42318;margin-top:6px">' + E(LK.err) + '</div>';
    return h; }
  function lkRefresh(keepFocus){ const d = document.getElementById('as-lk'); if(!d) return; const f = document.activeElement && document.activeElement.id === 'as-lkq', pos = f ? document.activeElement.selectionStart : 0;
    d.innerHTML = lkHtml(); if(f || keepFocus){ const i = document.getElementById('as-lkq'); if(i){ i.focus(); try{ i.setSelectionRange(pos || i.value.length, pos || i.value.length); }catch(e){} } } }
  async function lkLink(v){ const a = S.a; if(!a || LK.busy) return; v = String(v || '').trim(); let code = '';
    if(v){ code = lkCode(v); if(!code){ const m = lkSug(); if(m.length === 1) code = m[0].code; } if(!code){ LK.err = 'Pick a student from the list, or type the full ST code (e.g. ST-2026-001).'; lkRefresh(1); return; } }
    LK.busy = 1; LK.err = ''; lkRefresh(); status('Saving…'); await flush();
    try{ const r = await call('save', { id: a.id, patch: { student_code: code } }); if(!r || !r.ok) throw new Error(r && r.msg || 'Not saved');
      if(S.a && S.a.id === r.a.id){ S.a.student_code = r.a.student_code || null; merge(r.a); } LK.q = null; const L = (S.list || []).find(x => x.id === a.id); if(L) L.student_code = r.a.student_code || null;
      status('Saved · ' + new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })); toast(code ? 'Linked to ' + code + ' · shows in her student portal' : 'Un-linked · no longer in a student portal'); }
    catch(e){ LK.err = String(e.message || e) + ' · try again'; status('Not saved'); }
    LK.busy = 0; lkRefresh(); }
  window.as1783 = { q: v => { LK.q = v; LK.err = ''; const s = document.getElementById('as-lks'); if(s){ const t = document.createElement('div'); t.innerHTML = lkHtml(); const n = t.querySelector('#as-lks'); s.innerHTML = n ? n.innerHTML : ''; } },
    link: lkLink, change: off => { LK.q = off ? null : ''; LK.err = ''; lkRefresh(!off); }, refresh: () => lkRefresh(),
    loc: (code, l) => { const A = window.__ps1350; if(A && A.setLoc) A.setLoc(code, l).then(() => lkRefresh()); } };
  window.as1778 = { ck, nm, edit, show, scrOpen,`],
  // a newly opened assessment starts with no half-typed link search
  ["  async function open(id){ const c = (S.list || []).find(x => x.id === id);", "  async function open(id){ try{ LK.q = null; LK.err = ''; }catch(e){} const c = (S.list || []).find(x => x.id === id);"],
]);
