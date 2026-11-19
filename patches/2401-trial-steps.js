// 2401 (Misty 19 Nov 11:24, mock approved): trial steps ticked from what is really recorded, the same for everyone.
//   Detail sheet: progress bar "N of 10 done · Next: …", each tick says what, when and who; Paid hides Enrolled · paid once a package is
//   saved ("View package"); Class schedule from the booked classes (orange "Book the classes" when paid without classes); Agreement from
//   S-AGREE; course plan, CEFR picture, price and welcome are kept on the server (coe_trial_marks) with "Not sent" to undo.
//   Trials list: the 10 steps as dots + "N of 10 · Next: …" and a red note when paid without classes or the report waits.
//   Server: coe-hw v7 ops trialSteps / trialMark (coe_trial_steps).
const file = process.argv[2];
const JS = String.raw`
<script id="b2401">
(function(){
  if(window.__2401) return; window.__2401 = 1;
  const HW = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-hw';
  const F = {}, M = {}; let AG = false, busy = null, at = 0;
  const call = o => fetch(HW, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify(Object.assign({ token: TOKEN }, o)) }).then(x => x.json());
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const cap = s => { s = String(s || ''); return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; };
  const LK = { plan: 'plan', cefr: 'cefr', price: 'price', notice: 'welcome' };
  function migrate(t){ try{ const o = JSON.parse(localStorage.getItem('coe.tl4.' + String(t.label || (t.date + '|' + t.student))) || '{}') || {}, m = M[t.label] || {};
      Object.keys(LK).forEach(k => { if(o[k] && !m[LK[k]]) call({ op: 'trialMark', label: t.label, k: LK[k], at: new Date(+o[k]).toISOString(), keep: true }).catch(() => {}); }); }catch(e){} }
  async function load(rows, force){
    if(typeof TOKEN === 'undefined' || !TOKEN || !(typeof D !== 'undefined' && D && D.mgr)) return;
    if(busy) return busy; if(!force && Date.now() - at < 60000) return;
    const R = (rows || []).filter(t => t && t.label), codes = [...new Set(R.map(t => String(t.code || '').toUpperCase()).filter(c => /^ST-\d{4}-\d{3}$/.test(c)))];
    busy = (async () => { try{
        if(!AG && typeof agrMap === 'function'){ AG = true; try{ await agrMap(); }catch(e){} }
        const r = await call({ op: 'trialSteps', codes, labels: R.map(t => t.label) });
        if(r && r.ok && r.data){ Object.assign(F, r.data.codes || {}); R.forEach(t => { M[t.label] = (r.data.marks || {})[t.label] || {}; }); at = Date.now(); R.forEach(migrate); }
      }catch(e){} finally{ busy = null; } })();
    return busy; }
  /* the 10 steps of one trial */
  function steps(t){
    const code = String(t.code || '').toUpperCase(), f = F[code] || {}, m = M[t.label] || {}, day0 = Date.parse(String(t.date || '').slice(0, 10) + 'T00:00:00+08:00') - 864e5;
    const sent = t.status === 'Sent' || !!t.sent, S = t.sent || {};
    const fuL = String(t.pics || '').match(/Follow-up: .*? \d{4}-\d{2}-\d{2} \d{2}:\d{2} by \S+/g) || [], fu = fuL[fuL.length - 1] || '';
    const fuM = fu.match(/^Follow-up: (.*?) (\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}) by (\S+)/);
    const paid = f.paid && (!f.paid.ts || f.paid.ts >= day0) ? f.paid : null, sch = f.sched;
    let ag = null; try{ ag = typeof agrOf === 'function' ? agrOf(code, '', t.student) : null; }catch(e){}
    const mk = k => m[k] ? 'Copied ' + m[k].at + (m[k].by ? ' · ' + m[k].by : '') : '';
    const L = [
      { k: 'report', title: 'Trial report', done: sent, sub: sent ? 'Sent ' + (S.at ? S.at.slice(8, 10) + ' ' + ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+S.at.slice(5, 7)] + ' ' + S.at.slice(11, 16) : '') + (S.how ? ' · ' + S.how : '') + (S.by ? ' · ' + S.by : '') : '' },
      { k: 'plan', title: 'Course plan', done: !!m.plan, sub: mk('plan'), undo: 1 },
      { k: 'cefr', title: 'CEFR picture', done: !!m.cefr, sub: mk('cefr'), undo: 1 },
      { k: 'price', title: 'Price', done: !!m.price, sub: mk('price'), undo: 1 },
      { k: 'fu', title: 'Follow up', done: !!(fuM || paid), sub: fuM ? cap(fuM[1].replace(/\s*\(.*\)\s*$/, '')) + ' · ' + fuM[2].slice(8) + ' ' + ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+fuM[2].slice(5, 7)] + ' ' + fuM[3] + ' · ' + fuM[4] : paid ? 'Enrolled' : '' },
      { k: 'details', title: 'Student details', done: !!f.email, sub: f.email ? 'Parent email ' + f.email : '' },
      { k: 'paid', title: 'Paid', done: !!paid, sub: paid ? ((+paid.pkg ? paid.pkg + ' + ' + (+paid.free || 0) + ' lessons' : (paid.lessons || '?') + ' lessons') + (paid.inv ? ' · ' + String(paid.inv).replace(/^PaymentConfirmation(\d+).*$/, 'Payment Confirmation $1') : '') + ' · recorded ' + paid.at + (paid.by ? ' · ' + paid.by : '')) : '' },
      { k: 'sched', title: 'Class schedule', done: !!sch, warn: !!paid && !sch, sub: sch ? sch.n + ' classes · ' + (sch.slots || []).join(' + ') + (sch.teacher ? ' · Teacher ' + cap(sch.teacher) : '') + ' · from ' + sch.first : (paid ? 'Paid ' + paid.at + ' · no classes booked yet · book the classes' : '') },
      { k: 'agree', title: 'Agreement', done: !!(ag && ag.how !== 'Sent'), half: !!(ag && ag.how === 'Sent'), sub: ag ? (ag.how === 'Sent' ? 'Sent ' + String(ag.at || '').slice(0, 10) + ' · waiting for the signature' : 'Signed ' + String(ag.at || '').slice(0, 10)) : '' },
      { k: 'welcome', title: 'Welcome message', done: !!m.welcome, sub: mk('welcome'), undo: 1 }
    ];
    const n = L.filter(s => s.done).length, nx = L.find(s => !s.done);
    return { L, n, nx, paid, sch }; }
  window.tlSteps2401 = steps;
  /* ---------- detail sheet ---------- */
  const css = document.createElement('style'); css.textContent =
    '.st01p{background:#F4FAF8;border-radius:16px;padding:12px 16px;margin:14px 0 4px}.st01p .h{display:flex;justify-content:space-between;gap:10px;font-weight:700;color:#2B2253;font-size:15px}.st01p .h span{color:#0E7C7B}' +
    '.st01p .bar{height:9px;background:#E3EFEC;border-radius:6px;margin-top:8px;overflow:hidden}.st01p .bar i{display:block;height:100%;background:#2E9E6F;border-radius:6px}' +
    '.tl4 .tl4-r.done .tl4-t span{color:#1E7A55;display:block!important}.tl4 .tl4-r.st01w .tl4-n{background:#E0533D;color:#fff}.tl4 .tl4-r.st01w .tl4-t span{color:#B5432C;display:block!important;font-weight:600}' +
    '.tl4 .tl4-r.st01h .tl4-n{background:#F6C76B;color:#5A3D00}.tl4 .tl4-r.st01h .tl4-t span{color:#8A5A00;display:block!important}' +
    '.tl4 .st01u{grid-column:2/-1;font-size:12.5px;color:#8C88A3;margin-top:-4px}.tl4 .st01u a{color:#00737B;text-decoration:underline;cursor:pointer;margin-left:6px}' +
    '.st01d{display:inline-flex;gap:3px;vertical-align:middle;margin-right:6px}.st01d i{width:8px;height:8px;border-radius:50%;background:#E3E1EA;display:inline-block;box-sizing:border-box}.st01d i.d{background:#2E9E6F}.st01d i.n{background:#fff;border:2px solid #0E7C7B}.st01d i.w{background:#E0533D}' +
    '.st01l{font-size:13px;color:#2B2253;margin-top:5px}.st01l .w{color:#C0492F;font-weight:700}';
  document.head.appendChild(css);
  const rowOf = (el, title) => [...el.querySelectorAll('.tl4-r')].find(r => { const b = r.querySelector('.tl4-t b'); return b && b.textContent.trim() === title; }) || null;
  function deco(){
    const el = $('tlAct'), t = typeof TLD !== 'undefined' ? TLD : null; if(!el || !t || !el.classList.contains('tl4') || !(typeof D !== 'undefined' && D && D.mgr)) return;
    if(!F[String(t.code || '').toUpperCase()] && t.code && !el.dataset.st01w){ el.dataset.st01w = 1; load([t], true).then(() => { el.dataset.st01w = ''; deco(); }); }
    const st = steps(t), A = el.querySelector('#tl4A');
    /* Class notice is the welcome message · it goes last, after the agreement */
    const cn = rowOf(el, 'Class notice') || rowOf(el, 'Welcome message'), ag = rowOf(el, 'Agreement');
    if(cn){ const b = cn.querySelector('.tl4-t b'), s = cn.querySelector('.tl4-t span'); b.textContent = 'Welcome message'; if(!st.L[9].done) s.textContent = 'Class times, books and the first class · for the WeChat group';
      if(ag && ag.nextElementSibling !== cn) ag.after(cn);
      cn.querySelectorAll('button').forEach(x => { if(!x.dataset.st01){ x.dataset.st01 = 1; x.addEventListener('click', () => mark(t, 'welcome', true), true); } }); }
    ['Course plan', 'CEFR picture', 'Price'].forEach((ti, i) => { const r = rowOf(el, ti); if(r) r.querySelectorAll('button').forEach(x => { if(!x.dataset.st01){ x.dataset.st01 = 1; x.addEventListener('click', () => mark(t, ['plan', 'cefr', 'price'][i], true), true); } }); });
    const map = { report: 'Trial report', plan: 'Course plan', cefr: 'CEFR picture', price: 'Price', fu: 'Follow up', details: 'Student details', paid: 'Paid', sched: 'Class schedule', agree: 'Agreement', welcome: 'Welcome message' };
    st.L.forEach((s, i) => { const r = rowOf(el, map[s.k]); if(!r) return; const nEl = r.querySelector('.tl4-n'), sp = r.querySelector('.tl4-t span');
      r.classList.toggle('done', s.done); r.classList.toggle('next', !s.done && st.nx === s); r.classList.toggle('st01w', !!s.warn); r.classList.toggle('st01h', !s.done && !!s.half);
      if(nEl) nEl.textContent = s.done ? '✓' : s.warn ? '!' : String(i + 1);
      if(sp && s.sub && (s.done || s.warn || s.half)){ if(!sp.dataset.st01o) sp.dataset.st01o = sp.textContent; sp.textContent = s.sub; } else if(sp && sp.dataset.st01o && !s.done){ sp.textContent = sp.dataset.st01o; }
      const u = r.querySelector('.st01u'); if(u) u.remove();
      if(s.undo && s.done){ const d = document.createElement('div'); d.className = 'st01u'; d.innerHTML = 'Ticked by mistake?<a>Not sent</a>'; d.querySelector('a').onclick = ev => { ev.preventDefault(); mark(t, s.k, false); }; r.appendChild(d); }
      if(s.k === 'paid' && s.done){ r.querySelectorAll('.tl4-a button').forEach(b => { if(/Enrolled · paid|Renewed · paid|First package/.test(b.textContent)) b.style.display = 'none'; });
        if(!r.querySelector('.st01v')){ const v = document.createElement('button'); v.className = 'btn ghost st01v'; v.textContent = 'View package'; v.onclick = () => { closeSheet(); openStudent(t.code); }; r.querySelector('.tl4-a').appendChild(v);
          const d = document.createElement('div'); d.className = 'st01u'; d.textContent = 'Already recorded · Enrolled · paid is hidden so it cannot be saved twice · a new package goes in Renewals'; r.appendChild(d); } }
      if(s.k === 'sched'){ const b = r.querySelector('.tl4-a button'); if(b){ if(s.done){ b.textContent = 'View calendar'; b.onclick = ev => { ev.preventDefault(); ev.stopPropagation(); closeSheet(); openStudent(t.code); }; } else if(s.warn){ b.textContent = 'Book the classes'; b.classList.add('teal'); } } } });
    let p = el.querySelector('.st01p'); if(!p){ p = document.createElement('div'); p.className = 'st01p'; el.querySelector('.tl4').prepend(p); }
    p.innerHTML = '<div class="h"><b>' + st.n + ' of 10 done</b>' + (st.nx ? '<span>Next: ' + E(st.nx.title) + '</span>' : '<span>All done ✓</span>') + '</div><div class="bar"><i style="width:' + (st.n * 10) + '%"></i></div>'; }
  async function mark(t, k, on){ const m = M[t.label] = M[t.label] || {}, me = ((typeof D !== 'undefined' && D && D.me) || {}).name || '';
    if(on){ if(m[k]) return; const d = new Date(Date.now() + 8 * 3600e3); m[k] = { at: d.getUTCDate() + ' ' + ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()] + ' ' + d.toISOString().slice(11, 16), by: me }; }
    else { delete m[k]; try{ const key = 'coe.tl4.' + t.label, o = JSON.parse(localStorage.getItem(key) || '{}') || {}; Object.keys(LK).forEach(x => { if(LK[x] === k) delete o[x]; }); localStorage.setItem(key, JSON.stringify(o)); }catch(e){} }
    setTimeout(deco, 0); try{ paintList(); }catch(e){}
    try{ const r = await call({ op: 'trialMark', label: t.label, k, on: !!on }); if(!r || !r.ok) throw r; }catch(e){ toast('Not saved · try again'); if(on) delete m[k]; deco(); } }
  const _tb = window.tlBtns; if(_tb) window.tlBtns = function(){ const r = _tb.apply(this, arguments); try{ deco(); }catch(e){ console.warn('2401', e); } return r; };
  /* ---------- the Trials list ---------- */
  function paintList(){ const v = document.getElementById('v-trials'); if(!v || typeof TRL === 'undefined' || !TRL || !TRL.rows) return;
    v.querySelectorAll('.rp-row[onclick^="tlOpen("]').forEach(row => { const i = +(String(row.getAttribute('onclick')).match(/tlOpen\((\d+)\)/) || [])[1], t = TRL.rows[i]; if(!t) return;
      const code = String(t.code || '').toUpperCase(); if(code && !F[code]) return;
      const st = steps(t), sig = st.L.map(s => s.done ? 1 : s.warn ? 2 : 0).join('');
      let w = row.querySelector('.st01l'); if(w && w.dataset.s === sig) return;
      const late = !st.L[0].done && Date.now() - Date.parse(String(t.date || '').slice(0, 10) + 'T23:59:00+08:00') > 864e5 ? 'Report not sent · ' + Math.floor((Date.now() - Date.parse(String(t.date).slice(0, 10) + 'T12:00:00+08:00')) / 864e5) + ' days after the trial' : '';
      const warn = st.L[7].warn ? st.L[7].sub.replace(/ · book the classes$/, '') : late;
      const html = '<span class="st01d">' + st.L.map(s => '<i class="' + (s.done ? 'd' : s.warn ? 'w' : st.nx === s ? 'n' : '') + '"></i>').join('') + '</span><b>' + st.n + ' of 10</b>' + (st.nx ? ' · Next: ' + E(st.nx.title) : ' · all done') + (warn ? ' · <span class="w">' + E(warn) + '</span>' : '');
      if(!w){ w = document.createElement('div'); w.className = 'st01l'; const g = row.querySelector('.grow'); if(!g) return; g.appendChild(w); }
      w.dataset.s = sig; w.innerHTML = html; }); }
  window.tlPaint2401 = paintList;
  let lastN = 0;
  setInterval(() => { try{ if(typeof VIEW === 'undefined' || VIEW !== 'trials' || typeof TRL === 'undefined' || !TRL || !TRL.rows) return;
      const n = TRL.rows.length; if(n !== lastN || Date.now() - at > 60000){ lastN = n; load(TRL.rows, true).then(paintList); } else paintList(); }catch(e){} }, 1500);
})();
</script>
`;
require('../tools/lib.js')(file, [["<script id=\"b2278\">", JS.trim() + "\n<script id=\"b2278\">"]]);
