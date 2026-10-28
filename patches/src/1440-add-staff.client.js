/* 1440 · Teachers › Add teacher / staff · Edit · Give app access · Deactivate. Saved in the database first (coe-staff);
   Google (MASTERLIST, T-DASH, PAYROLL rows and name dropdowns, sign-in) follows within a minute (STAFF28).
   Pay and private MASTERLIST columns are shown in management only, hidden until "Show" is tapped. */
(function(){
  if(window.AS40) return;
  const URL_ = () => (typeof FAST_URL !== 'undefined' ? FAST_URL : 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe') + '-staff';
  const APP = 'https://app.cupofenglishatph.com';
  const S = window.AS40 = { L: null, head: [], sens: [], pres: false, busy: false, err: '' };
  const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const I = { plus: '<path d="M12 5v14M5 12h14"/>', edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
    key: '<circle cx="7.5" cy="15.5" r="4.5"/><path d="M10.7 12.3L21 2M16 7l3 3M18 5l2 2"/>', off: '<path d="M18.4 5.6A9 9 0 1 1 5.6 5.6"/><path d="M12 2v10"/>',
    copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>', eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
    dice: '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1"/><circle cx="15.5" cy="15.5" r="1"/><circle cx="15.5" cy="8.5" r="1"/><circle cx="8.5" cy="15.5" r="1"/>',
    chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>', back: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>' };
  const ic = k => '<svg class="as40-i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[k] + '</svg>';
  const css = document.createElement('style'); css.id = 'st1440';
  css.textContent = '#as40{min-height:180px;margin-top:22px}#as40 .as40-hd{display:flex;align-items:center;gap:10px;flex-wrap:wrap}#as40 .as40-hd h2{margin:0;flex:1}' +
    '.as40-i{width:16px;height:16px;flex:none}.as40-b{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px;border-radius:10px;border:1px solid var(--line);background:#fff;color:var(--ink);font:600 13px/1 Inter,var(--f,system-ui);cursor:pointer;white-space:nowrap}' +
    '.as40-b:hover{border-color:var(--teal)}.as40-b.pri{background:var(--teal);border-color:var(--teal);color:#fff}.as40-b.pur{color:#6B4FB8}.as40-b.red{color:var(--red)}.as40-b[disabled]{opacity:.5;cursor:default}' +
    '.as40-row{display:flex;align-items:center;gap:12px;padding:12px 2px;border-bottom:1px solid var(--line)}.as40-row:last-child{border-bottom:0}.as40-av{width:36px;height:36px;border-radius:50%;background:var(--tint);color:var(--teal);display:grid;place-items:center;font:400 16px "Fredoka One",var(--f);flex:none}' +
    '.as40-row.off .as40-av{background:var(--soft);color:var(--mute)}.as40-nm{font-weight:700}.as40-sub{font-size:12px;color:var(--mute);margin-top:2px}.as40-act{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end}' +
    '.as40-c{display:inline-block;font-size:11px;font-weight:600;padding:2px 8px;border-radius:20px;margin-left:6px;vertical-align:1px}.as40-c.ok{background:#E3F4EA;color:#23784A}.as40-c.no{background:#FFF3DF;color:#9A5B00}.as40-c.dis{background:var(--soft);color:var(--mute)}.as40-c.sy{background:#EEE9FB;color:#6B4FB8}.as40-c.rl{background:var(--tint);color:var(--teal)}' +
    '.as40-f h3{font:400 15px "Fredoka One",var(--f);color:var(--ink);margin:18px 0 8px;display:flex;align-items:center;gap:8px}.as40-f h3 small{font:600 11px Inter,var(--f);color:var(--mute);letter-spacing:.04em;text-transform:uppercase}' +
    '.as40-g{display:grid;grid-template-columns:1fr 1fr;gap:10px 12px}@media (max-width:620px){.as40-g{grid-template-columns:1fr}}.as40-f label{display:block;font-size:12px;font-weight:600;color:var(--ink2)}' +
    '.as40-f input,.as40-f select,.as40-f textarea{display:block;width:100%;box-sizing:border-box;margin-top:4px;height:42px;border:1px solid var(--line);border-radius:10px;padding:0 12px;font:500 14px Inter,var(--f);color:var(--ink);background:#fff}' +
    '.as40-f textarea{height:64px;padding:8px 12px;resize:vertical}.as40-f input[readonly]{background:var(--soft);color:var(--mute)}.as40-f .chk{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500}.as40-f .chk input{width:18px;height:18px;margin:0}' +
    '.as40-sec{-webkit-text-security:disc}.as40-priv{border:1px dashed #CFC6EA;border-radius:12px;padding:10px 12px;background:#FBFAFE}.as40-note{font-size:12px;color:var(--mute);margin-top:6px;line-height:1.45}' +
    '.as40-pw{display:flex;gap:6px;align-items:flex-end}.as40-pw label{flex:1}.as40-msg{white-space:pre-wrap;background:var(--soft);border-radius:12px;padding:12px 14px;font:500 13px/1.5 Inter,var(--f);color:var(--ink);margin:10px 0}' +
    '.as40-c{white-space:nowrap;margin-top:2px}@media (max-width:620px){.as40-row{flex-wrap:wrap}.as40-act{width:100%;justify-content:flex-start;padding-left:48px}}' +
    '.as40-err{color:var(--red);font-size:13px;margin-top:10px;min-height:18px}.as40-foot{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;flex-wrap:wrap}';
  document.head.appendChild(css);

  async function call(action, body){
    const r = await fetch(URL_(), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.assign({ token: TOKEN, action }, body || {})) });
    let j = {}; try{ j = await r.json(); }catch(x){}
    if(!r.ok && !j.msg) j.msg = j.error === 'AUTH' ? 'Please sign in again.' : (j.error || ('Server error ' + r.status));
    return j;
  }
  S.call = call;
  const lite = L => (L || []).map(p => { const o = Object.assign({}, p); ['sss', 'philhealth', 'pagibig', 'tin', 'contact', 'ml', 'pay_hist'].forEach(k => delete o[k]); return o; });
  S.load = function(){ if(S._ld) return S._ld; S._ld = S.load1().finally(() => { S._ld = null; }); return S._ld; };
  S.load1 = async function(){
    try{ const j = await call('list'); if(!j.ok) throw new Error(j.msg || j.error); S.L = j.people; S.head = j.head || []; S.sens = j.sens || []; S.pres = !!j.pres; S.err = '';
      try{ store('set', 'coe.m.staff40', JSON.stringify({ L: lite(j.people), pres: S.pres })); }catch(x){} }
    catch(x){ S.err = String(x.message || x); }
    paint();
  };
  try{ const k = JSON.parse(store('get', 'coe.m.staff40') || 'null'); if(k && k.L){ S.L = k.L; S.pres = !!k.pres; S.stale = true; } }catch(x){}

  const ROLE = { teacher: 'Teacher', ops: 'Operations', admin: 'Admin', staff: 'Staff · no app' };
  const access = p => p.status !== 'active' ? ['dis', 'Disabled'] : p.role === 'staff' ? null : p.signin === 'ready' || p.pw_pending ? ['ok', 'Has access'] : ['no', 'No access'];
  const canTouch = p => !p.president && (S.pres || (p.role !== 'ops' && p.role !== 'admin'));
  S.rows = L => L.map(p => { const a = access(p), off = p.status !== 'active';
    return '<div class="as40-row' + (off ? ' off' : '') + '" data-id="' + p.id + '"><div class="as40-av">' + e((p.name || '?')[0]) + '</div><div class="grow" style="min-width:0">' +
      '<div><span class="as40-nm">' + e(p.name) + '</span><span class="as40-c rl">' + e(p.president ? 'President' : ROLE[p.role] || p.role) + '</span>' + (a ? '<span class="as40-c ' + a[0] + '">' + a[1] + '</span>' : '') + (p.sync_pending ? '<span class="as40-c sy" title="Google copies this within about a minute">Syncing to Google</span>' : '') + '</div>' +
      '<div class="as40-sub ell">' + e([p.position, p.email, p.start_date ? 'since ' + p.start_date : ''].filter(Boolean).join(' · ')) + '</div></div>' +
      '<div class="as40-act">' + (canTouch(p) ? (off ? '<button class="as40-b" onclick="AS40.on(' + p.id + ')">' + ic('back') + 'Reactivate</button>'
        : (a && a[0] === 'no' ? '<button class="as40-b pur" onclick="AS40.access(' + p.id + ')">' + ic('key') + 'Give app access</button>' : '') +
          '<button class="as40-b" onclick="AS40.form(' + p.id + ')">' + ic('edit') + 'Edit</button>') : '') + '</div></div>'; }).join('');
  S.list = () => (S.L || []).filter(p => p.status === 'active').concat((S.L || []).filter(p => p.status !== 'active'));
  function paint(){
    const v = $('v-teachers'); if(!v || !D || !D.mgr) return;
    let box = $('as40'); if(!box){ box = document.createElement('section'); box.id = 'as40'; v.appendChild(box); }
    const lead = v.querySelector('.lead'); if(lead && !lead.querySelector('#as40Add')){ const b = document.createElement('button'); b.id = 'as40Add'; b.className = 'as40-b pri'; b.style.marginTop = '8px'; b.style.marginLeft = '6px'; b.innerHTML = ic('plus') + 'Add teacher / staff'; b.onclick = () => S.form(0); lead.appendChild(b); }
    const L = S.list();
    const html = '<div class="as40-hd"><h2>TEAM &amp; ACCESS <span class="c">' + (L.filter(p => p.status === 'active').length || '') + ' active</span></h2><button class="as40-b pri" onclick="AS40.form(0)">' + ic('plus') + 'Add teacher / staff</button></div>' +
      '<div id="as40Tools"></div><div class="card" id="as40L">' + (S.L ? (L.length ? S.rows(S.filter ? S.filter(L) : L) : '<div class="mute small">Nobody yet.</div>') : '<div class="sk"></div><div class="sk"></div>') + '</div>' +
      (S.err ? '<div class="as40-err">' + e(S.err) + ' <button class="as40-b" onclick="AS40.load()">Try again</button></div>' : '');
    if(box._h !== html){ box._h = html; box.innerHTML = html; if(S.tools) try{ S.tools(); }catch(x){} }
  }
  S.paint = paint;
  const _r = window.renderTeachers;
  if(typeof _r === 'function') window.renderTeachers = function(){ const r = _r.apply(this, arguments); try{ const b = $('as40'); if(b) b._h = ''; paint(); if(!S.L || S.stale){ S.stale = false; S.load(); } }catch(x){ console.warn('1440', x); } return r; };

  /* ── password, welcome message ── */
  S.gen = function(){ const a = 'abcdefghjkmnpqrstuvwxyz', d = '23456789', A = 'ABCDEFGHJKLMNPQRSTUVWXYZ', R = n => { const u = new Uint32Array(1); crypto.getRandomValues(u); return u[0] % n; };
    let p = A[R(A.length)]; for(let i = 0; i < 6; i++) p += a[R(a.length)]; p += d[R(d.length)] + d[R(d.length)] + d[R(d.length)]; return p; };
  S.pwGen = function(){ const i = $('as40pw'); if(!i) return; i.value = S.gen(); i.type = 'text'; };
  S.pwShow = function(){ const i = $('as40pw'); if(i) i.type = i.type === 'password' ? 'text' : 'password'; };
  S.copy = function(t, done){ const ok = () => toast(done || 'Copied');
    if(navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(ok, () => fallback()); else fallback();
    function fallback(){ const x = document.createElement('textarea'); x.value = t; x.style.position = 'fixed'; x.style.opacity = '0'; document.body.appendChild(x); x.select(); try{ document.execCommand('copy'); ok(); }catch(y){ toast('Select the text and copy it'); } x.remove(); } };
  S.pwCopy = function(){ const i = $('as40pw'); if(i && i.value) S.copy(i.value, 'Password copied'); };
  S.welcome = function(p, pw){
    const mg = p.role === 'ops' || p.role === 'admin', first = (p.first || p.name);
    const lines = ['Hi ' + first + '! Welcome to Cup of English.', '', 'Your ' + (mg ? 'management' : 'teacher') + ' app:', APP, '', 'Sign in with your email: ' + p.email].concat(pw ? ['Your password: ' + pw, 'Please keep it private.'] : ['Use the password we gave you.']).concat(['',
      'Put the app on your home screen so it opens like an app:', '- iPhone: open the link in Safari, tap the Share button, then "Add to Home Screen".', '- Android: open the link in Chrome, tap the three dots, then "Install app" or "Add to Home screen".', '',
      mg ? 'Welcome to the team!' : 'See you in class!']);
    const txt = lines.join('\n'), wc = txt.replace(/^- /gm, '').replace(/\n\n/g, '\n \n');
    S._w = { txt, wc, id: p.id };
    openSheet('<div class="as40-f"><h2 style="margin:0">' + e(p.name) + ' can sign in now</h2><div class="as40-note">Send this to ' + e(first) + '. ' + (pw ? 'The password is shown only now — it is not kept anywhere.' : '') + '</div>' +
      '<div class="as40-msg">' + e(txt) + '</div><div class="as40-foot"><button class="as40-b" onclick="AS40.copy(AS40._w.wc,\'Copied for WeChat\')">' + ic('chat') + 'Copy for WeChat</button><button class="as40-b pri" onclick="AS40.copy(AS40._w.txt)">' + ic('copy') + 'Copy message</button><button class="as40-b" onclick="AS40._w=null;closeSheet()">Done</button></div></div>');
  };

  /* ── Add / Edit form: every MASTERLIST column, in the sheet's order and labels ── */
  const SKIP = { 4: 'name', 9: 'calc', 10: 'status', 28: 'email', 29: 'role', 21: 'dup', 0: 'id' };
  const isDate = h => /DATE|BIRTH|LAST WORKING DAY/i.test(h) && !/STATUS/i.test(h);
  const colName = i => { let s = '', n = i + 1; while(n){ const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; } return s; };
  const dv = x => { const s = String(x == null ? '' : x); const m = s.match(/^(\d{4}-\d{2}-\d{2})/); return m ? m[1] : s; };
  const today1 = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-01'; };
  S.form = async function(id){
    if(!S.L || !S.head.length){ toast('Loading the team…'); await S.load(); if(!S.head.length){ toast(S.err || 'Not loaded'); return; } }
    const p = id ? S.L.find(x => x.id === id) : null; if(id && !p) return;
    const ml = (p && p.ml) || [], H = S.head, sens = S.sens;
    const fld = (i, h) => { const v = dv(ml[i]), d = !sens.includes(i) && isDate(h) && (!v || /^\d{4}-\d{2}-\d{2}$/.test(v)), lab = (String(h).trim() || 'Column ' + colName(i)) + (String(h).trim() ? '' : ' (no title)');
      if(i === 5) return '<label>' + e(lab) + '<input readonly value="' + e(v) + '" title="Worked out by the sheet"></label>';
      return '<label>' + e(lab) + (/REASON|RECORD|TRAININGS|ADDRESS/i.test(h) ? '<textarea data-ml="' + i + '"' + (sens.includes(i) ? ' class="as40-sec"' : '') + '>' + e(v) + '</textarea>' : '<input data-ml="' + i + '" ' + (d ? 'type="date"' : 'type="text"') + (sens.includes(i) && !d ? ' class="as40-sec"' : '') + ' value="' + e(v) + '" autocomplete="off">') + '</label>'; };
    const cols = H.map((h, i) => i).filter(i => !(i in SKIP));
    const pub = cols.filter(i => !sens.includes(i)), priv = cols.filter(i => sens.includes(i));
    const last = p && Array.isArray(p.pay_hist) && p.pay_hist.length ? p.pay_hist[p.pay_hist.length - 1] : null;
    const role = p ? p.role : 'teacher', pt = p ? p.pay_type : 'lesson', mg = r => r === 'ops' || r === 'admin';
    const ropt = Object.keys(ROLE).map(k => '<option value="' + k + '"' + (k === role ? ' selected' : '') + (mg(k) && !S.pres ? ' disabled' : '') + '>' + ROLE[k] + (mg(k) && !S.pres ? ' (President only)' : '') + '</option>').join('');
    S._p = p;
    openSheet('<div class="as40-f" id="as40F"><h2 style="margin:0">' + (p ? 'Edit ' + e(p.name) : 'Add teacher / staff') + '</h2><div class="as40-note">Saved in the app at once; the MASTERLIST row (same columns), T-DASH, PAYROLL and the name dropdowns follow in Google within about a minute.</div>' +
      '<h3>In the app</h3><div class="as40-g"><label>App name (as shown everywhere)<input id="as40n" value="' + e(p ? p.name : '') + '"' + (p ? ' readonly title="The app name links all records, so it is not changed here"' : ' placeholder="e.g. Rose"') + ' autocomplete="off"></label>' +
      '<label>Role<select id="as40r" onchange="AS40.roleCh()">' + ropt + '</select></label><label>Chinese name (optional)<input id="as40cn" value="' + e(p && p.cn_name || '') + '"></label>' +
      '<label class="chk" style="align-self:end;height:42px"><input type="checkbox" id="as40ch"' + (!p || p.chat !== false ? ' checked' : '') + '>In Team Chat</label></div>' +
      '<div class="as40-note" id="as40rn"></div>' +
      '<h3>MASTERLIST <small>same columns as the sheet</small></h3><div class="as40-g">' + pub.map(i => fld(i, H[i])).join('') + '</div>' +
      '<h3>Private <small>management only</small><button type="button" class="as40-b" style="height:28px;margin-left:auto" onclick="AS40.reveal(this)">' + ic('eye') + 'Show</button></h3><div class="as40-priv"><div class="as40-g">' + priv.map(i => fld(i, H[i])).join('') + '</div></div>' +
      '<h3>Pay <small>management only</small></h3><div class="as40-g"><label>Paid<select id="as40pt"><option value="lesson"' + (pt === 'lesson' ? ' selected' : '') + '>Per lesson</option><option value="monthly"' + (pt === 'monthly' ? ' selected' : '') + '>Fixed monthly</option><option value="none"' + (pt === 'none' ? ' selected' : '') + '>Not paid through PAYROLL</option></select></label>' +
      '<label>Amount (₱)<input id="as40pa" type="number" min="0" step="1" class="as40-sec" placeholder="' + (last ? e(last.rate || last.monthly) : '') + '"></label><label>Starting<input id="as40pf" type="date" value="' + today1() + '"></label>' +
      '<div class="as40-note" style="align-self:end">' + (last ? 'Now: <span class="as40-sec">₱' + e(last.rate || last.monthly) + '</span> from ' + e(last.from) + '. ' : '') + 'A new amount is added with its starting date; earlier amounts stay in the history. Per-lesson pay in PAYROLL still follows the rank.</div></div>' +
      '<h3>Books &amp; hours</h3><div class="as40-g"><label>Books they teach<textarea id="as40bk">' + e(p && p.books || '') + '</textarea></label><label>Available hours<textarea id="as40av">' + e(p && p.avail || '') + '</textarea></label></div>' +
      '<div id="as40si"><h3>App sign-in</h3><div class="as40-g"><label>Sign-in email (MASTERLIST APP EMAIL)<input id="as40em" type="email" autocomplete="off" value="' + e(p ? (p.email || dv(ml[28])) : '') + '"></label>' +
      '<div class="as40-pw"><label>' + (p && access(p) && access(p)[0] === 'ok' ? 'New password (empty = keep)' : 'Password (empty = no access yet)') + '<input id="as40pw" type="password" autocomplete="new-password"></label><button type="button" class="as40-b" title="Generate" onclick="AS40.pwGen()">' + ic('dice') + '</button><button type="button" class="as40-b" title="Show" onclick="AS40.pwShow()">' + ic('eye') + '</button><button type="button" class="as40-b" title="Copy" onclick="AS40.pwCopy()">' + ic('copy') + '</button></div></div></div>' +
      '<div class="as40-err" id="as40e"></div><div class="as40-foot">' + (p && canTouch(p) ? '<button class="as40-b red" style="margin-right:auto" onclick="AS40.off(' + p.id + ')">' + ic('off') + 'Deactivate</button>' : '') +
      '<button class="as40-b" onclick="closeSheet()">Cancel</button><button class="as40-b pri" id="as40s" onclick="AS40.save()">' + (p ? 'Save' : 'Add') + '</button></div></div>');
    try{ $('sheet').classList.add('wide'); }catch(x){}
    S.roleCh();
  };
  S.reveal = function(b){ const box = b.closest('h3').nextElementSibling, on = box.classList.toggle('as40-open'); box.querySelectorAll('[data-ml]').forEach(x => x.classList.toggle('as40-sec', !on)); b.lastChild.textContent = on ? 'Hide' : 'Show'; };
  S.roleCh = function(){ const r = $('as40r') && $('as40r').value, si = $('as40si'), n = $('as40rn'); if(!r) return;
    if(si) si.style.display = r === 'staff' ? 'none' : '';
    if(n) n.textContent = r === 'teacher' ? 'Signs in to the teacher app.' : r === 'staff' ? 'Kept in MASTERLIST and PAYROLL only, no app sign-in.' : 'Signs in to MANAGEMENT (sees money and everyone\'s records).'; };
  S.collect = function(){
    const f = { id: S._p ? S._p.id : 0, name: $('as40n').value.trim(), role: $('as40r').value, cn_name: $('as40cn').value.trim(), chat: $('as40ch').checked,
      pay_type: $('as40pt').value, pay_amount: $('as40pa').value, pay_from: $('as40pf').value, books: $('as40bk').value.trim(), avail: $('as40av').value.trim(), ml: {} };
    if(f.role !== 'staff'){ f.email = $('as40em').value.trim(); f.pw = $('as40pw').value; } else f.email = (S._p && S._p.email) || '';
    document.querySelectorAll('#as40F [data-ml]').forEach(x => { f.ml[x.dataset.ml] = x.value.trim(); });
    return f;
  };
  S.save = async function(){
    if(S.busy) return; const f = S.collect(), b = $('as40s'), er = $('as40e');
    if(!f.name){ er.textContent = 'Enter the app name.'; return; }
    if(f.pw && !f.email){ er.textContent = 'Add the sign-in email first.'; return; }
    S.busy = true; b.disabled = true; b.textContent = 'Saving…'; er.textContent = '';
    try{ const j = await call('save', { f });
      if(!j.ok){ er.textContent = j.msg || j.error || 'Not saved'; return; }
      toast((j.isNew ? 'Added ' : 'Saved ') + j.name + ' · Google follows within a minute');
      S.load(); if(typeof loadMgmt === 'function') setTimeout(() => { try{ loadMgmt(true); }catch(x){} }, 70000);
      if(j.pw && j.email) S.welcome({ id: j.id, name: j.name, first: f.ml[2] || j.name, email: j.email, role: j.role }, f.pw); else closeSheet();
    }catch(x){ er.textContent = 'Not saved — check the internet and try again.'; }
    finally{ S.busy = false; if(b){ b.disabled = false; b.textContent = S._p ? 'Save' : 'Add'; } }
  };

  /* ── Give app access (for people without a sign-in), reset password ── */
  S.access = function(id){
    const p = (S.L || []).find(x => x.id === id); if(!p) return; S._p = p;
    const em = p.email || dv((p.ml || [])[28]);
    openSheet('<div class="as40-f"><h2 style="margin:0">Give ' + e(p.name) + ' app access</h2><div class="as40-note">' + (p.role === 'teacher' ? 'Teacher app.' : 'MANAGEMENT app.') + ' Nothing is created until you tap Give access.</div>' +
      '<div class="as40-g" style="margin-top:12px"><label>Sign-in email<input id="as40em" type="email" value="' + e(em) + '" autocomplete="off"></label>' +
      '<div class="as40-pw"><label>Password<input id="as40pw" type="text" autocomplete="new-password" value="' + S.gen() + '"></label><button type="button" class="as40-b" title="Generate" onclick="AS40.pwGen()">' + ic('dice') + '</button><button type="button" class="as40-b" title="Copy" onclick="AS40.pwCopy()">' + ic('copy') + '</button></div></div>' +
      '<div class="as40-err" id="as40e"></div><div class="as40-foot"><button class="as40-b" onclick="closeSheet()">Cancel</button><button class="as40-b pri" id="as40s" onclick="AS40.give()">' + ic('key') + 'Give access</button></div></div>');
  };
  S.give = async function(){
    if(S.busy) return; const p = S._p, em = $('as40em').value.trim(), pw = $('as40pw').value, b = $('as40s'), er = $('as40e');
    if(!em || !pw){ er.textContent = 'Email and password are both needed.'; return; }
    S.busy = true; b.disabled = true;
    try{ const j = await call('save', { f: { id: p.id, role: p.role, email: em, pw, chat: p.chat !== false, pay_type: p.pay_type, cn_name: p.cn_name || '', books: p.books || '', avail: p.avail || '' } });
      if(!j.ok){ er.textContent = j.msg || j.error; return; }
      S.load(); S.welcome({ id: p.id, name: p.name, first: p.first_name || p.name, email: j.email, role: p.role }, pw);
    }catch(x){ er.textContent = 'Not saved — check the internet and try again.'; } finally{ S.busy = false; if(b) b.disabled = false; }
  };

  /* ── Deactivate / Reactivate (history is always kept) ── */
  S.off = function(id){
    const p = (S.L || []).find(x => x.id === id); if(!p) return; S._p = p;
    openSheet('<div class="as40-f"><h2 style="margin:0">Deactivate ' + e(p.name) + '?</h2><div class="as40-note">Sign-in stops now and open sessions end. MASTERLIST STATUS becomes Resigned. Classes, lessons, pay and reports are all kept.</div>' +
      '<div id="as40ob"></div><label style="margin-top:12px">Reason (optional)<input id="as40why" autocomplete="off"></label>' +
      '<div class="as40-err" id="as40e"></div><div class="as40-foot"><button class="as40-b" onclick="closeSheet()">Cancel</button><button class="as40-b pri" style="background:var(--red);border-color:var(--red)" id="as40s" onclick="AS40.offGo()">Deactivate</button></div></div>');
    if(S.offPrep) try{ S.offPrep(p); }catch(x){}
  };
  S.offGo = async function(){
    if(S.busy) return; const p = S._p, b = $('as40s'), er = $('as40e'); S.busy = true; b.disabled = true;
    try{ const j = await call('off', { id: p.id, reason: ($('as40why') || {}).value || '' }); if(!j.ok){ er.textContent = j.msg || j.error; return; }
      toast(p.name + ' deactivated · history kept'); closeSheet(); S.load(); }
    catch(x){ er.textContent = 'Not saved — check the internet and try again.'; } finally{ S.busy = false; if(b) b.disabled = false; }
  };
  S.on = async function(id){
    const p = (S.L || []).find(x => x.id === id); if(!p || S.busy) return; S.busy = true;
    try{ const j = await call('on', { id }); if(!j.ok){ toast(j.msg || j.error); return; } toast(p.name + ' is active again'); await S.load(); if(j.needPw) S.access(id); }
    catch(x){ toast('Not saved — check the internet'); } finally{ S.busy = false; }
  };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'teachers') renderTeachers(); }catch(x){}
})();
