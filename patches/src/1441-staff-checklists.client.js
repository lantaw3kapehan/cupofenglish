/* 1441 · Team & access, second release: onboarding checklist, profile completeness, search and filters, offboarding checklist on
   Deactivate, history (who changed what). Builds on 1440 (window.AS40). Ticks are saved in the database (staff.ob); automatic
   steps (first sign-in, first class, Team Chat, access off) tick themselves. */
(function(){
  const S = window.AS40; if(!S || S.v41) return; S.v41 = 1;
  const e = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const css = document.createElement('style'); css.id = 'st1441';
  css.textContent = '#as40Tools{display:flex;gap:8px;flex-wrap:wrap;margin:10px 0 0}#as40Tools input,#as40Tools select{height:38px;border:1px solid var(--line);border-radius:10px;padding:0 10px;font:500 13px Inter,var(--f);color:var(--ink);background:#fff}' +
    '#as40Tools input{flex:1 1 180px;min-width:0}#as40Tools select{flex:0 1 auto}@media (max-width:620px){#as40Tools select{flex:1 1 40%}}' +
    '.as41-m{display:inline-flex;align-items:center;gap:6px;font-size:11px;color:var(--mute);margin-left:8px;vertical-align:1px}.as41-m i{display:inline-block;width:42px;height:4px;border-radius:4px;background:var(--soft);overflow:hidden}.as41-m i b{display:block;height:100%;background:var(--teal)}' +
    '.as41-cl{display:grid;grid-template-columns:1fr 1fr;gap:6px 14px}@media (max-width:620px){.as41-cl{grid-template-columns:1fr}}.as41-cl label{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:500;color:var(--ink);min-height:30px}' +
    '.as41-cl input{width:18px;height:18px;margin:0;flex:none}.as41-cl small{color:var(--mute);font-weight:500}.as41-log{font-size:13px;border-bottom:1px solid var(--line);padding:9px 0}.as41-log:last-child{border-bottom:0}.as41-log .t{color:var(--mute);font-size:12px}';
  document.head.appendChild(css);

  /* completeness: the MASTERLIST columns a full profile needs */
  const NEED = [1, 2, 6, 7, 8, 17, 18, 20, 22, 23, 24, 25, 26, 27];
  S.pct = p => { const ml = p.ml || [], need = NEED.concat(p.role === 'staff' ? [] : [28]); if(!p.ml) return null; return Math.round(100 * need.filter(i => String(ml[i] == null ? '' : ml[i]).trim()).length / need.length); };

  /* onboarding: key, label, automatic check */
  const OB = [['profile', 'Profile complete', p => S.pct(p) === 100], ['sent', 'Access sent', p => !!p.seen], ['signin', 'First sign-in', p => !!p.seen],
    ['contract', 'Contract signed'], ['books', 'Books rule agreed'], ['training', 'Training started'], ['firstclass', 'First class', p => !!(p.cls && p.cls.first)], ['chat', 'Added to Team Chat', p => p.chat !== false && p.status === 'active']];
  S.obItems = p => OB.filter(x => p.role === 'staff' ? ['profile', 'contract'].includes(x[0]) : p.role === 'teacher' ? true : !['books', 'firstclass'].includes(x[0]));
  const done = (p, x) => !!((p.ob || {})[x[0]] || (x[2] && x[2](p)));
  S.obState = p => { const L = S.obItems(p); return { n: L.filter(x => done(p, x)).length, of: L.length }; };
  const isNew = p => p.status === 'active' && !p.president && (p.src === 'app' || (p.start_date && (Date.now() - new Date(p.start_date + 'T00:00:00')) < 75 * 864e5));

  /* list rows: completeness meter and onboarding progress for new people */
  const _rows = S.rows;
  S.rows = L => { let h = _rows(L); L.forEach(p => { const pc = S.pct(p), o = S.obState(p);
    const add = (pc != null && pc < 100 && p.status === 'active' ? '<span class="as41-m" title="Profile ' + pc + '% complete"><i><b style="width:' + pc + '%"></b></i>' + pc + '%</span>' : '') +
      (isNew(p) && o.n < o.of ? '<span class="as40-c sy" style="background:var(--tint);color:var(--teal)">Onboarding ' + o.n + '/' + o.of + '</span>' : '');
    if(add) h = h.replace(new RegExp('(data-id="' + p.id + '">[\\s\\S]*?<span class="as40-nm">[^<]*</span>(?:<span class="as40-c[^"]*"[^>]*>[^<]*</span>)*)'), '$1' + add); }); return h; };

  /* search and filters (remembered on this device only) */
  let F = { q: '', role: '', st: 'active', acc: '', pay: '' };
  try{ const k = JSON.parse(localStorage.getItem('coe.staff41.f') || 'null'); if(k) F = Object.assign(F, k, { q: '' }); }catch(x){}
  const acc = p => p.status !== 'active' ? 'dis' : p.role === 'staff' ? 'na' : (p.signin === 'ready' || p.pw_pending) ? 'ok' : 'no';
  S.filter = L => L.filter(p => (!F.q || (p.name + ' ' + (p.first_name || '') + ' ' + (p.last_name || '') + ' ' + (p.email || '') + ' ' + (p.position || '')).toLowerCase().includes(F.q.toLowerCase())) &&
    (!F.role || p.role === F.role) && (!F.st || p.status === F.st) && (!F.acc || acc(p) === F.acc) && (!F.pay || p.pay_type === F.pay));
  const sel = (k, opts) => '<select aria-label="' + k + '" onchange="AS40.f(\'' + k + '\',this.value)">' + opts.map(o => '<option value="' + o[0] + '"' + (F[k] === o[0] ? ' selected' : '') + '>' + o[1] + '</option>').join('') + '</select>';
  S.tools = function(){ const t = document.getElementById('as40Tools'); if(!t || !S.L) return;
    t.innerHTML = '<input type="search" placeholder="Search name, email, position" value="' + e(F.q) + '" oninput="AS40.f(\'q\',this.value)">' +
      sel('role', [['', 'All roles'], ['teacher', 'Teachers'], ['ops', 'Operations'], ['admin', 'Admin'], ['staff', 'Staff']]) + sel('st', [['active', 'Active'], ['inactive', 'Inactive'], ['', 'Active and inactive']]) +
      sel('acc', [['', 'Any access'], ['ok', 'Has access'], ['no', 'No access'], ['dis', 'Disabled']]) + sel('pay', [['', 'Any pay'], ['lesson', 'Per lesson'], ['monthly', 'Fixed monthly'], ['none', 'Not paid here']]); };
  S.f = function(k, v){ F[k] = v; try{ localStorage.setItem('coe.staff41.f', JSON.stringify(Object.assign({}, F, { q: '' }))); }catch(x){}
    const box = document.getElementById('as40L'); if(box){ const L = S.filter(S.list()); box.innerHTML = L.length ? S.rows(L) : '<div class="mute small">Nobody matches.</div>'; } };

  /* onboarding / offboarding sections in Edit, History button */
  const tick = async (id, k, on, el) => { const p = S.L.find(x => x.id === id); if(el) el.disabled = true;
    try{ const j = await S.call('ob', { id, set: { [k]: on } }); if(!j.ok){ toast(j.msg || j.error); if(el) el.checked = !on; } else if(p){ p.ob = j.ob; const b = document.getElementById('as40'); if(b) b._h = ''; S.paint(); } }
    catch(x){ toast('Not saved — check the internet'); if(el) el.checked = !on; } finally{ if(el) el.disabled = false; } };
  S.tick = tick;
  const box = (p, items) => '<div class="as41-cl">' + items.map(x => { const auto = x[2] && x[2](p), on = done(p, x), who = (p.ob || {})[x[0]];
    return '<label><input type="checkbox"' + (on ? ' checked' : '') + (auto ? ' disabled' : '') + ' onchange="AS40.tick(' + p.id + ',\'' + x[0] + '\',this.checked,this)">' + e(x[1]) +
      (auto ? ' <small>· automatic</small>' : who ? ' <small>· ' + e(who.at) + '</small>' : '') + '</label>'; }).join('') + '</div>';
  const OFF = p => [['off_pay', 'Final pay settled'], ['off_access', 'App access disabled', q => q.status !== 'active'], ['off_chat', 'Removed from Team Chat', q => q.status !== 'active' || q.chat === false],
    ['off_classes', 'Removed from schedules' + (p.cls && p.cls.future ? ' (' + p.cls.future + ' classes still booked)' : ''), q => q.status !== 'active' && !(q.cls && q.cls.future)],
    ['off_students', 'Students reassigned' + (p.cls && p.cls.students ? ' (' + p.cls.students + ' students)' : ''), q => q.status !== 'active' && !(q.cls && q.cls.students)]];
  const _form = S.form;
  S.form = async function(id){ await _form.apply(this, arguments); const p = id && S.L && S.L.find(x => x.id === id); const f = document.getElementById('as40F'); if(!f) return;
    const pc = p ? S.pct(p) : null, h2 = f.querySelector('h2');
    if(p && pc != null && h2) h2.insertAdjacentHTML('beforeend', '<span class="as41-m" style="font:500 12px Inter,var(--f)"><i><b style="width:' + pc + '%"></b></i>profile ' + pc + '%</span>');
    if(p){ const sec = p.status === 'active' ? '<h3>Onboarding <small>' + S.obState(p).n + ' of ' + S.obState(p).of + '</small></h3>' + box(p, S.obItems(p)) : '<h3>Offboarding <small>history is kept</small></h3>' + box(p, OFF(p));
      const at = f.querySelector('h3'); if(at) at.insertAdjacentHTML('beforebegin', '<div>' + sec + '</div>');
      const ft = f.querySelector('.as40-foot'); if(ft) ft.insertAdjacentHTML('afterbegin', '<button class="as40-b" onclick="AS40.log(' + p.id + ')">History</button>'); }
  };
  /* inactive people can be opened too (to finish offboarding) */
  const _rows2 = S.rows;
  S.rows = L => _rows2(L).replace(/(<button class="as40-b" onclick="AS40\.on\((\d+)\)">)/g, '<button class="as40-b" onclick="AS40.form($2)">Open</button>$1');
  S.offPrep = function(p){ const el = document.getElementById('as40ob'); if(!el) return;
    el.innerHTML = '<h3 style="font:400 15px \'Fredoka One\',var(--f);margin:16px 0 8px">Offboarding</h3><div class="as41-cl">' + OFF(p).map(x => '<label><input type="checkbox" data-k="' + x[0] + '"' + (/^off_(access|chat)$/.test(x[0]) ? ' checked disabled' : ((p.ob || {})[x[0]] ? ' checked' : '')) + '>' + e(x[1]) + (/^off_(access|chat)$/.test(x[0]) ? ' <small>· on Deactivate</small>' : '') + '</label>').join('') + '</div>' +
      (p.cls && p.cls.future ? '<div class="as40-note">' + p.name + ' still has ' + p.cls.future + ' booked classes. Move them in Schedule (they stay on record until moved); the list shows here until it is done.</div>' : ''); };
  const _offGo = S.offGo;
  S.offGo = async function(){ const p = S._p, set = {}; document.querySelectorAll('#as40ob input[data-k]:not([disabled])').forEach(x => { if(x.checked) set[x.dataset.k] = true; });
    await _offGo.apply(this, arguments); if(p && Object.keys(set).length) try{ const j = await S.call('ob', { id: p.id, set }); if(j.ok) p.ob = j.ob; }catch(x){} };
  /* "Access sent" ticks itself when the welcome message is copied */
  const _copy = S.copy;
  S.copy = function(t){ const w = S._w; if(w && w.id && (t === w.txt || t === w.wc)) S.call('ob', { id: w.id, set: { sent: true } }).then(j => { const p = S.L && S.L.find(x => x.id === w.id); if(j && j.ok && p) p.ob = j.ob; }).catch(() => {}); return _copy.apply(this, arguments); };
  OB[1][2] = p => !!p.seen || !!(p.ob || {}).sent;

  /* history: who changed what (private values are never in the log) */
  const WHAT = { add: 'Added', edit: 'Edited', deactivate: 'Deactivated', reactivate: 'Reactivated', checklist: 'Checklist' };
  S.log = async function(id){ const p = S.L.find(x => x.id === id); if(!p) return;
    openSheet('<div class="as40-f"><h2 style="margin:0">History · ' + e(p.name) + '</h2><div id="as41L" style="margin-top:10px"><div class="sk"></div><div class="sk"></div></div><div class="as40-foot"><button class="as40-b" onclick="AS40.form(' + id + ')">Back</button></div></div>');
    let L = []; try{ const j = await S.call('log', { id }); L = j.log || []; }catch(x){}
    const H = S.head || [], d = x => { const o = x.detail || {}; if(x.what === 'checklist') return Object.keys(o).map(k => (o[k] ? 'ticked ' : 'unticked ') + k.replace(/_/g, ' ')).join(', ');
      const bits = []; if(o.role) bits.push('role ' + o.role); if(o.email) bits.push('sign-in ' + o.email); if(o.pw) bits.push('password set'); if(o.pay_type) bits.push('pay ' + o.pay_type); if(o.reason) bits.push('reason: ' + o.reason);
      if(Array.isArray(o.fields) && o.fields.length) bits.push(o.fields.length + ' MASTERLIST fields'); return bits.join(' · '); };
    const el = document.getElementById('as41L'); if(el) el.innerHTML = L.length ? L.map(x => '<div class="as41-log"><b>' + e(WHAT[x.what] || x.what) + '</b> <span class="t">· ' + e(String(x.at).slice(0, 16).replace('T', ' ')) + ' · ' + e(x.by || '') + '</span><div class="t">' + e(d(x)) + '</div></div>').join('') : '<div class="mute small">No changes made in the app yet (MASTERLIST edits made in Google are not listed here).</div>';
  };
  try{ const b = document.getElementById('as40'); if(b){ b._h = ''; S.paint(); } }catch(x){}
})();
