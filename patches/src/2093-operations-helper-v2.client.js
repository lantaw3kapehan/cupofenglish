/* 2093 (11 Nov 20:29, Misty: Anna enrolment, the form said first class Wed 11 Nov while the classes start Sun 15 Nov; and "No student package found" on a first enrolment): the check card shows the booked classes, flags a first class or lesson count that differs, one tap sets the first class; the enrolment form opens with the first booked class. Server coe-ops v2.
   2091 (11 Nov, Misty: Operations "always makes mistakes with details … I want her to be productive" · "go ahead and do all").
   1. The check card before Renewed · paid and Enrolled · paid (1583) also asks the database: the invoice name against the student, the partner
      against the student's referral (any agency, not only an empty or CupOfEnglish partner), and the package against last time. One tap fills the
      right partner. Add sale gets the same check card.
   2. To do opens with "Fix these": the database checks the last 60 days of payments and the next 30 days of classes (coe_ops_check) and lists what
      needs a look. "It's correct" puts an item away for good.
   3. Undo for 10 seconds after a class is cancelled or restored.
   4. "Your week" on To do, and the same line in the President's Briefing.
   Server: coe-ops (management only). Nothing here blocks a save: if the check cannot be reached, the save goes on as before. */
(function(){
  if(window.__ops2091) return; window.__ops2091 = 1;
  var OPS = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-ops';
  var E = function(s){ return String(s == null ? '' : s).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  var $i = function(id){ return document.getElementById(id); };
  var tok = function(){ try{ return TOKEN; }catch(e){ return ''; } };
  var mgr = function(){ try{ return !!(D && D.mgr); }catch(e){ return false; } };
  var pres = function(){ try{ return typeof isPres === 'function' && isPres(); }catch(e){ return false; } };
  var val = function(id){ var x = $i(id); return x ? String(x.value || '').trim() : ''; };
  var nf = function(n){ return Number(n || 0).toLocaleString('en-US'); };
  function post(body, ms){ var ctl = typeof AbortController === 'function' ? new AbortController() : null, t = ctl ? setTimeout(function(){ ctl.abort(); }, ms || 8000) : 0;
    return fetch(OPS, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: tok() }, body)), signal: ctl ? ctl.signal : undefined })
      .then(function(r){ return r.json(); }).finally(function(){ if(t) clearTimeout(t); }); }
  try{ var st = document.createElement('style'); st.id = 's2091'; st.textContent = [
    '.o91-fl{margin-top:10px;padding:10px 12px;border-radius:12px;background:#FFF8E6;border:1px solid #F3D48B;color:#6B4A00;font-size:14px;line-height:1.45}',
    '.o91-fl b{color:#2B2253}.o91-fl .o91-ok{color:#0B6B4F}',
    '.o91-use{margin-top:6px;border:1.5px solid #00737B;background:#fff;color:#00737B;border-radius:10px;padding:5px 10px;font:600 13px Inter,sans-serif;cursor:pointer}',
    '#o91fix{margin:0 0 16px;border:1px solid #ECEAF2;border-radius:16px;background:#fff;padding:16px 18px;box-shadow:0 1px 2px rgba(43,34,83,.04)}',
    '#o91fix h2{margin:0;font-family:"Fredoka One",Inter,sans-serif;font-weight:400;font-size:20px;color:#2B2253}',
    '#o91fix .o91-wk{font-size:14px;color:#3D3760;margin:4px 0 0;line-height:1.5}',
    '#o91fix .o91-it{display:flex;gap:10px;align-items:flex-start;border-top:1px solid #F1F0F6;padding:10px 0;font-size:15px;line-height:1.45;color:#2B2253}',
    '#o91fix .o91-it:first-of-type{margin-top:8px}#o91fix .o91-tx{flex:1;min-width:0}',
    '#o91fix .o91-bt{display:flex;gap:6px;flex-wrap:wrap;flex:none}',
    '#o91fix .o91-bt button{border:1.5px solid #D9D6E6;background:#fff;color:#2B2253;border-radius:10px;padding:5px 10px;font:600 13px Inter,sans-serif;cursor:pointer}',
    '#o91fix .o91-bt button.go{border-color:#00737B;color:#00737B}',
    '#o91fix .o91-none{font-size:15px;color:#0B6B4F;margin-top:8px}',
    '@media(max-width:640px){#o91fix .o91-it{flex-direction:column}}',
    '#o91undo{position:fixed;left:50%;transform:translateX(-50%);bottom:24px;z-index:10000;background:#2B2253;color:#fff;border-radius:14px;padding:12px 14px 12px 16px;display:flex;gap:14px;align-items:center;box-shadow:0 8px 24px rgba(43,34,83,.25);font:14px Inter,sans-serif;max-width:calc(100vw - 32px)}',
    '#o91undo button{border:0;background:#fff;color:#2B2253;border-radius:10px;padding:6px 12px;font:700 14px Inter,sans-serif;cursor:pointer}',
    '#v-finbrief .o91-br{border:1px solid #ECEAF2;border-radius:16px;background:#fff;padding:14px 16px;margin:0 0 14px;font-size:15px;line-height:1.5;color:#2B2253}',
    '#v-finbrief .o91-br h3{margin:0 0 4px;font-size:18px;font-weight:600}'
  ].join(''); document.head.appendChild(st); }catch(e){}

  /* ---------- 1 · the check card asks the database too ---------- */
  var dl = function(d){ try{ return new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); }catch(e){ return d; } };
  function classFlags(r, startId, lessons){   /* 2093: the first class and the lessons in the form match what is booked in the calendar */
    var c = r && r.classes, out = { fl: [], btn: '' }; if(!c) return out;
    var st = startId ? val(startId) : '';
    if(startId && st && st !== c.first){ out.fl.push('First class here is ' + dl(st) + ', but the first booked class is ' + dl(c.first) + '.'); out.btn = '<button type="button" class="o91-use" data-d="' + E(c.first) + '" data-id="' + E(startId) + '">Use first class: ' + E(dl(c.first)) + '</button>'; }
    if(lessons && Math.abs(c.lessons - lessons) > 0.01) out.fl.push('The calendar has ' + c.n + ' classes booked (= ' + c.lessons + ' lessons), but the package is ' + lessons + ' lessons.');
    return out; }
  function flagsHtml(r, partnerId, startId, lessons){
    var cf = classFlags(r, startId, lessons); if(cf.fl.length) r = Object.assign({}, r, { flags: cf.fl.concat((r && r.flags) || []) });
    var fl = (r && r.flags) || [], hint = r && r.partnerHint, cur = partnerId ? val(partnerId) : '';
    var h = '<div class="o91-fl" id="o91fl">';
    if(r && r.student) h += '<div><b>' + E(r.student.name) + ' · ' + E(r.student.code) + '</b>' + (r.student.source ? ' came through <b>' + E(r.student.source) + '</b>' : '') + '.</div>';
    if(r && r.classes) h += '<div>Booked: ' + r.classes.n + ' classes (= ' + r.classes.lessons + ' lessons), ' + E(dl(r.classes.first)) + ' to ' + E(dl(r.classes.last)) + '.</div>';
    if(r && r.last) h += '<div>Last payment: ' + E(r.last.day) + ', ' + E(r.last.pkg) + (Number(r.last.free) ? ' + ' + E(r.last.free) : '') + ' lessons, partner ' + E(r.last.partner || 'none') + '.</div>';
    h += fl.length ? fl.map(function(x){ return '<div style="margin-top:4px">⚠ ' + E(x) + '</div>'; }).join('') : '<div class="o91-ok" style="margin-top:4px">✓ Name, partner, first class and package match the records.</div>';
    if(partnerId && hint && hint.toLowerCase() !== cur.toLowerCase()) h += '<button type="button" class="o91-use" data-p="' + E(hint) + '" data-id="' + E(partnerId) + '">Use partner: ' + E(hint) + '</button>';
    h += cf.btn;
    return h + '</div>'; }
  document.addEventListener('click', function(ev){ var b = ev.target && ev.target.closest && ev.target.closest('.o91-use'); if(!b) return;
    var i = $i(b.dataset.id); if(!i) return; i.value = b.dataset.d || b.dataset.p; i.dataset.t = '1';
    if(b.dataset.d){ try{ if(typeof ENS !== 'undefined' && ENS) ENS.touched = 1; if(typeof enPrev === 'function') enPrev(); }catch(e){} try{ i.dispatchEvent(new Event('change', { bubbles: true })); }catch(e){} try{ toast('First class set to ' + dl(b.dataset.d) + '. Check it, then save again.'); }catch(e){} return; }
    try{ i.dispatchEvent(new Event('input', { bubbles: true })); }catch(e){}
    var sc = $i('o91sc'); if(sc){ sc.remove(); var fg = $i('fGo'); if(fg) fg.style.display = ''; }   /* Add sale: a fresh check on the next tap */
    try{ toast('Partner set to ' + b.dataset.p + '. Check it, then save again.'); }catch(e){} }, true);
  function addFlags(box){ if(!box || box.dataset.o91) return; box.dataset.o91 = '1';
    var ren = !!$i('rpS') && $i('rpS').style.display === 'none', S = null;
    try{ S = ren ? (typeof RPS !== 'undefined' ? RPS : null) : (typeof ENS !== 'undefined' ? ENS : null); }catch(e){}
    if(!S || !S.code) return; if(!ren && (S.tr || S.sale)) return;   /* a transfer or a payment already in SALES: nothing new to check */
    var pid = ren ? 'rpPa' : 'enPa', body = { op: 'precheck', code: S.code, invoice: val(ren ? 'rpI' : 'enI'), partner: val(pid), pkg: +S.pkg || 0, free: +S.free || 0 };
    var go = $i('rvGo'), row = go && go.parentNode; if(row) row.insertAdjacentHTML('beforebegin', '<div class="o91-fl" id="o91fl">Checking with the records…</div>');
    post(body, 6000).then(function(r){ var el = $i('o91fl'); if(!el || !r || !r.ok){ if(el) el.remove(); return; } el.outerHTML = flagsHtml(r, pid, ren ? '' : 'enS', ren ? 0 : (+S.pkg || 0) + (+S.free || 0)); })
      .catch(function(){ var el = $i('o91fl'); if(el) el.remove(); }); }
  /* 2093: Enrolled · paid opens with the first class booked in the calendar (the form's own read can miss classes added a minute ago) */
  function fillFirst(inp){ if(!inp || inp.dataset.o93) return; inp.dataset.o93 = '1'; var S = null; try{ S = typeof ENS !== 'undefined' ? ENS : null; }catch(e){} if(!S || !S.code) return;
    post({ op: 'precheck', code: S.code }, 6000).then(function(r){ var c = r && r.ok && r.classes, x = $i('enS'); if(!c || !x || x !== inp) return; var S2 = null; try{ S2 = ENS; }catch(e){}
      if(!S2 || S2.code !== S.code || S2.touched || x.dataset.t || ($i('enSx') || {}).checked || x.value === c.first) return;
      x.value = c.first; try{ if(typeof enPrev === 'function') enPrev(); }catch(e){} }).catch(function(){}); }
  try{ new MutationObserver(function(){ var b = $i('rv1583'); if(b && !b.dataset.o91 && mgr()) addFlags(b); var s5 = $i('enS'); if(s5 && !s5.dataset.o93 && mgr()) fillFirst(s5); }).observe(document.body, { childList: true, subtree: true }); }catch(e){}

  /* Add sale: the same kind of check card */
  var sm0 = window.sendMoney;
  if(typeof sm0 === 'function') window.sendMoney = function(fn){ var self = this, args = arguments;
    if(fn !== 'addSale' || window.__o91sale){ window.__o91sale = 0; return sm0.apply(self, args); }
    var inv = val('fI'), pa = val('fR'), pkg = +val('fP') || 0, free = +val('fF') || 0, file = null; try{ file = typeof INV !== 'undefined' && INV ? INV.name : null; }catch(e){}
    if(!(inv || file) || !pa) return sm0.apply(self, args);   /* the form's own message says what is missing */
    var b = $i('fGo'); if(!b) return sm0.apply(self, args); var old = $i('o91sc'); if(old) old.remove();
    b.insertAdjacentHTML('beforebegin', '<div id="o91sc" class="card" style="margin-top:14px;border:1.5px solid #00737B;background:#fff"><h3 style="margin:0 0 8px;font-family:\'Fredoka One\',Inter,sans-serif;font-weight:400;color:#2B2253">Check before saving</h3>' +
      '<table style="width:100%;border-collapse:collapse;font-size:14px">' + [['Invoice', inv || file], ['Package', (pkg + free) + ' lessons' + (free ? ' (' + pkg + ' paid + ' + free + ' free)' : '')], ['Partner', pa], ['Paid on', val('fD')], ['Method', val('fM') || '—']]
        .map(function(r){ return '<tr><td style="padding:4px 10px 4px 0;color:#6C6883;white-space:nowrap">' + E(r[0]) + '</td><td style="padding:4px 0;color:#2B2253"><b>' + E(r[1]) + '</b></td></tr>'; }).join('') + '</table>' +
      '<div class="o91-fl" id="o91fl">Checking with the records…</div>' +
      '<div class="row" style="gap:8px;margin-top:12px"><button type="button" class="btn teal grow" id="o91go">Confirm and save</button><button type="button" class="btn ghost" id="o91back">Edit</button></div></div>');
    b.style.display = 'none';
    var close = function(){ var c = $i('o91sc'); if(c) c.remove(); b.style.display = ''; };
    $i('o91go').onclick = function(){ close(); window.__o91sale = 1; window.sendMoney('addSale'); };
    $i('o91back').onclick = close;
    post({ op: 'precheck', invoice: inv || file || '', partner: pa, pkg: pkg, free: free }, 6000).then(function(r){ var el = $i('o91fl'); if(!el) return; if(!r || !r.ok){ el.remove(); return; } el.outerHTML = flagsHtml(r, 'fR'); })
      .catch(function(){ var el = $i('o91fl'); if(el) el.remove(); }); };

  /* ---------- 2 + 4 · To do: Fix these and your week ---------- */
  var FX = { items: null, at: 0, weeks: null, busy: 0 };
  function wkLine(w, mine){ if(!w) return ''; var bits = [];
    bits.push(nf(w.saves) + ' saves'); if(w.reports) bits.push(nf(w.reports) + ' reports sent'); if(w.reminders) bits.push(nf(w.reminders) + ' reminders'); if(w.classes) bits.push(nf(w.classes) + ' class changes');
    return (mine ? 'Your week: ' : E(w.who) + ' this week: ') + bits.join(', ') + '. ' + (+w.errors ? nf(w.errors) + ' did not go through and were tried again.' : 'Every save went through.') + (+w.checked ? ' ' + nf(w.checked) + ' item' + (+w.checked === 1 ? '' : 's') + ' checked.' : ''); }
  function fixHtml(){ var it = FX.items || [], me = (FX.weeks || [])[0];
    var h = '<div id="o91fix"><h2>' + (it.length ? 'Fix these · ' + it.length : 'Fix these') + '</h2>' + (me && !pres() ? '<div class="o91-wk">' + wkLine(me, true) + '</div>' : '');
    if(FX.items == null) return h + '<div class="o91-wk">Checking payments and classes…</div></div>';
    if(!it.length) return h + '<div class="o91-none">✓ All checked. Payments, partners and classes match the records.</div></div>';
    return h + it.map(function(x, i){ return '<div class="o91-it"><div class="o91-tx">' + E(x.text) + '</div><div class="o91-bt">' +
      (x.go ? '<button type="button" class="go" onclick="o2091go(' + i + ')">Open</button>' : '') + '<button type="button" onclick="o2091ok(' + i + ', this)">It\'s correct</button></div></div>'; }).join('') + '</div>'; }
  function putFix(){ var v = $i('v-mtoday'); if(!v || !mgr()) return; var h = fixHtml(), old = $i('o91fix');
    if(old){ if(old.outerHTML !== h) old.outerHTML = h; return; }
    var lead = v.querySelector('.lead'); if(lead) lead.insertAdjacentHTML('afterend', h); else v.insertAdjacentHTML('afterbegin', h); }
  function loadFix(force){ if(!mgr() || FX.busy || (!force && FX.items && Date.now() - FX.at < 5 * 6e4)) return; FX.busy = 1;
    Promise.all([post({ op: 'check' }), post({ op: 'week' }).catch(function(){ return null; })]).then(function(a){ FX.busy = 0; if(a[0] && a[0].ok){ FX.items = a[0].items || []; FX.at = Date.now(); } if(a[1] && a[1].ok) FX.weeks = a[1].weeks || [];
      try{ if(typeof VIEW !== 'undefined' && VIEW === 'mtoday') putFix(); }catch(e){} }).catch(function(){ FX.busy = 0; }); }
  window.o2091go = function(i){ var x = (FX.items || [])[i]; if(!x) return; try{ go(x.go); }catch(e){} };
  window.o2091ok = function(i, btn){ var x = (FX.items || [])[i]; if(!x) return; if(btn) btn.disabled = true;
    post({ op: 'ok', ref: x.ref }).then(function(r){ if(!r || !r.ok) throw r; FX.items = (FX.items || []).filter(function(y){ return y.ref !== x.ref; }); putFix(); try{ toast('✓ Put away. It will not come back.'); }catch(e){} })
      .catch(function(){ if(btn) btn.disabled = false; try{ toast('Not saved. Try again.'); }catch(e){} }); };
  var rt0 = window.renderMToday;
  if(typeof rt0 === 'function') window.renderMToday = function(){ var r = rt0.apply(this, arguments); try{ putFix(); loadFix(false); }catch(e){} return r; };
  var go0 = window.go;
  if(typeof go0 === 'function') window.go = function(v){ var r = go0.apply(this, arguments); try{ if(v === 'mtoday'){ putFix(); loadFix(false); } }catch(e){} return r; };

  /* the President's Briefing: one line about Operations */
  var BR = { at: 0, h: '' };
  function putBrief(){ var v = $i('v-finbrief'); if(!v || !pres()) return; var col = v.querySelector('.bz-cols > div:last-child'); if(!col) return;
    var old = col.querySelector('.o91-br'); if(!BR.h){ if(old) old.remove(); return; } if(old){ if(old.innerHTML !== BR.h) old.innerHTML = BR.h; return; }
    col.insertAdjacentHTML('afterbegin', '<div class="o91-br">' + BR.h + '</div>'); }
  function loadBrief(){ if(!pres() || Date.now() - BR.at < 10 * 6e4) return; BR.at = Date.now();
    post({ op: 'week' }).then(function(r){ if(!r || !r.ok) return; var w = r.weeks || [];
      BR.h = '<h3>Operations</h3>' + (w.length ? w.map(function(x){ return '<div>' + wkLine(x, false) + '</div>'; }).join('') : '') +
        '<div style="margin-top:4px">' + (r.open ? nf(r.open) + ' item' + (r.open === 1 ? '' : 's') + ' in "Fix these" for Operations to check.' : 'Nothing to fix: payments, partners and classes match the records.') + '</div>';
      putBrief(); }).catch(function(){ BR.at = 0; }); }
  try{ var mo = new MutationObserver(function(){ var v = $i('v-finbrief'); if(v && !v.classList.contains('hide')){ loadBrief(); putBrief(); } });
    var hook = function(){ var v = $i('v-finbrief'); if(v){ mo.observe(v, { childList: true, attributes: true, attributeFilter: ['class'] }); return true; } return false; };
    if(!hook()){ var n = 0, iv = setInterval(function(){ if(hook() || ++n > 40) clearInterval(iv); }, 1500); } }catch(e){}

  /* ---------- 3 · Undo for 10 seconds after a cancel or a restore ---------- */
  var ARM = null;
  var se0 = window.sendEdit;
  if(typeof se0 === 'function') window.sendEdit = function(i, action, src){
    var e = null; try{ e = evList(src)[i]; }catch(x){}
    ARM = (action === 'cancel' || action === 'restore') && e ? { action: action, src: src, id: e.id, who: e.student || e.title || 'the class', why: e.why || '', was: !!e.cancelled, t: Date.now() } : null;
    try{ return se0.apply(this, arguments); } finally { setTimeout(function(){ ARM = null; }, 0); } };
  var api0 = window.api;
  if(typeof api0 === 'function') window.api = function(fn, t, id, f){ var p = api0.apply(this, arguments);
    try{ if(fn === 'editClass' && ARM && ARM.id === id && f && (f.action === 'cancel' || f.action === 'restore') && !f.forward && !f.makeup && !f.__undo){ var a = ARM, sent = Object.assign({}, f); ARM = null;
      if(f.action === 'cancel' && a.was) return p;   /* a reason change on a cancelled class: nothing to undo */
      Promise.resolve(p).then(function(r){ if(r && r.ok) undoBar(a, sent); }).catch(function(){}); } }catch(x){}
    return p; };
  function mutate(id, cancelled, why){ var lists = []; try{ if(typeof SW !== 'undefined' && SW && SW.events) lists.push(SW.events); }catch(e){} try{ if(typeof STU !== 'undefined' && STU && STU.cls) lists.push(STU.cls); }catch(e){}
    try{ if(typeof CLSM !== 'undefined') Object.keys(CLSM).forEach(function(k){ if(Array.isArray(CLSM[k])) lists.push(CLSM[k]); }); }catch(e){} try{ if(D && Array.isArray(D.schedule)) lists.push(D.schedule); }catch(e){}
    try{ if(typeof SC !== 'undefined' && SC && Array.isArray(SC.events)) lists.push(SC.events); }catch(e){}
    lists.forEach(function(L){ L.forEach(function(e){ if(e && e.id === id){ e.cancelled = cancelled; e.why = cancelled ? why : ''; e.title = String(e.title || '').replace(/\s+X$/i, '') + (cancelled ? ' X' : ''); } }); });
    try{ if(typeof SCC !== 'undefined') Object.keys(SCC).forEach(function(k){ SCC[k]._t = 0; }); }catch(e){}
    try{ if(typeof SW !== 'undefined' && SW && typeof swPaint === 'function' && $i('sheet') && $i('sheet').classList.contains('on')) swPaint(); }catch(e){}
    try{ if(typeof VIEW !== 'undefined' && VIEW === 'schedule' && typeof renderSchedule === 'function') renderSchedule(); }catch(e){} }
  function undoBar(a, f){ var old = $i('o91undo'); if(old) old.remove(); var left = 10;
    var verb = a.action === 'cancel' ? 'Cancelled' : 'Restored';
    document.body.insertAdjacentHTML('beforeend', '<div id="o91undo" role="status"><span>' + verb + ' ' + E(a.who) + '.</span><button type="button" id="o91ub">Undo (<span id="o91us">10</span>)</button></div>');
    var iv = setInterval(function(){ left--; var s = $i('o91us'); if(s) s.textContent = left; if(left <= 0){ clearInterval(iv); var b = $i('o91undo'); if(b) b.remove(); } }, 1000);
    $i('o91ub').onclick = function(){ clearInterval(iv); var bar = $i('o91undo'); if(bar) bar.innerHTML = '<span>Undoing…</span>';
      var back = Object.assign({}, f, { action: a.action === 'cancel' ? 'restore' : 'cancel', reason: a.action === 'cancel' ? '' : (function(){ try{ return cxSplit(a.why).r || a.why; }catch(e){ return a.why; } })(), forward: false, force: false, makeup: false, __undo: 1 });
      if(back.action === 'restore') delete back.by; else if(window._ceWho) back.by = window._ceWho;
      delete back.__undo;
      Promise.resolve(api0('editClass', tok(), a.id, back)).then(function(r){ if(!r || !r.ok) throw r; mutate(a.id, back.action === 'cancel', back.reason); var b = $i('o91undo'); if(b) b.remove(); try{ toast('✓ Undone. ' + E(a.who) + ' is ' + (back.action === 'cancel' ? 'cancelled' : 'back on') + ' again.'); }catch(e){} })
        .catch(function(r){ var b = $i('o91undo'); if(b) b.remove(); try{ toast(((r && r.msg) || 'Undo did not go through') + '. Open the class and change it there.'); }catch(e){} }); }; }
})();
