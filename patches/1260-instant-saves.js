// 1260: (Misty, 26 Oct 23:43 "Yes I want them made instant") slow saves that still waited for Google now answer at once:
//   service agreement (Sent / agreed / signed copy, ~9 s), leave "informed" tick (~8 s, management and teachers), class tag (~21 s) and
//   late time-in decision (~21 s). The save goes to the database inbox (edge function coe-wq) and the app shows it as saved; Google's own
//   function runs in the background with the same sign-in and arguments (same checks, same sheets, same Drive upload). Same rid = same save.
//   If Google refuses later, the person sees "Not saved · … · please do it again" (the existing failed-saves notice). If the database does
//   not answer, the save goes to Google exactly as before. Case numbers (late / tag) appear in a short notice when Google has made them.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 1260 · instant saves through the database (coe-wq) */
(function(){
  if(window.__1260 || typeof window.api !== 'function') return; window.__1260 = 1;
  const FNS = { mgmtAgreeSave: 1, mgmtLeaveInformed: 1, tLeaveInformed: 1, mgmtTagClass: 1, decideLate: 1 };
  const LBL = { mgmtAgreeSave: 'Service agreement', 'mgmtAgreeSave:file': 'Service agreement (signed copy)', mgmtLeaveInformed: 'Leave · informed', tLeaveInformed: 'Leave · informed', mgmtTagClass: 'Class tag', decideLate: 'Late time-in decision' };
  try{ if(typeof FF_L === 'object' && FF_L) Object.keys(LBL).forEach(k => { if(!FF_L[k]) FF_L[k] = LBL[k]; }); }catch(e){}
  const me = () => (typeof D !== 'undefined' && D && D.me && D.me.name) || '';
  const p2 = n => ('0' + n).slice(-2);
  const nowAt = () => { const d = new Date(Date.now() + 8 * 3600e3); return d.toISOString().slice(0, 10) + ' ' + p2(d.getUTCHours()) + ':' + p2(d.getUTCMinutes()); };   // Manila, as S-AGREE
  /* agreements saved here but not yet in Google's copy: shown at once (kept 3 h on this device) */
  const AGP_K = 'coe.agp';
  const agp = () => { try{ const o = JSON.parse(localStorage.getItem(AGP_K) || '[]'); return o.filter(x => Date.now() - x.t < 3 * 36e5); }catch(e){ return []; } };
  const agpSet = L => { try{ localStorage.setItem(AGP_K, JSON.stringify(L.slice(-30))); }catch(e){} };
  const same = (r, code, key, name) => { const c = String(code || '').toUpperCase(); return (c && String(r.code || '').toUpperCase() === c) || (key && r.key === key) || (name && String(r.name || '').trim().toLowerCase() === String(name).trim().toLowerCase()); };
  const newer = (a, b) => !b || String(a.at || '') > String(b.at || '');
  const _of = window.agrOf;
  if(typeof _of === 'function') window.agrOf = function(code, key, name){ const r = _of.apply(this, arguments);
    try{ const p = agp().filter(x => same(x.rec, code, key, name)).map(x => x.rec).sort((a, b) => String(b.at).localeCompare(String(a.at)))[0];
      if(p && newer(p, r)) return p; }catch(e){} return r; };
  function ans(fn, a){ const f = a[1] || {};
    if(fn === 'mgmtAgreeSave'){ const rec = { at: nowAt(), by: me(), how: String(f.how || ''), key: String(f.key || ''), code: String(f.code || ''), file: '', name: String(f.name || ''), note: '', pending: 1 };
      const L = agp().filter(x => x.rid !== f.rid); L.push({ t: Date.now(), rid: f.rid || '', rec }); agpSet(L); return { ok: true, queued: true, rec }; }
    if(fn === 'mgmtTagClass' || fn === 'decideLate'){ const cond = String((fn === 'decideLate' ? a[2] : a[3]) || ''); return { ok: true, queued: true, note: cond, caseId: '' }; }
    return { ok: true, queued: true }; }
  /* Google's answer: case numbers, the agreement's file link; a refusal → the failed-saves notice */
  function watch(id, fn, a){ let n = 0; const W = [12e3, 20e3, 30e3, 60e3, 120e3, 240e3];
    const tick = async () => { let r = null;
      try{ r = await fetch(FAST_URL + '-mgmt', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ op: 'writeStatus', token: TOKEN, id }) }).then(x => x.json()); }catch(e){}
      if(r && r.ok && r.status === 'done'){ const g = r.result || {};
        if((fn === 'decideLate' || fn === 'mgmtTagClass') && g.caseId) try{ toast((g.note || 'Saved') + ' · ' + g.caseId); }catch(e){}
        if(fn === 'mgmtAgreeSave'){ try{ const f = a[1] || {}; agpSet(agp().map(x => x.rid === f.rid && g.rec ? Object.assign(x, { rec: Object.assign({}, g.rec, { at: String(g.rec.at || x.rec.at).replace('T', ' ').slice(0, 16) }) }) : x));
          if(typeof AGS !== 'undefined' && AGS && AGS.list && AGS.list[0] && AGS.list[0].pending && g.rec) Object.assign(AGS.list[0], g.rec, { pending: 0 }); }catch(e){} }
        return; }
      if(r && r.ok && r.status === 'error'){ if(fn === 'mgmtAgreeSave'){ const f = a[1] || {}; agpSet(agp().filter(x => x.rid !== f.rid)); }
        try{ if(fn === 'mgmtLeaveInformed' && typeof loadLeave === 'function') loadLeave(true); }catch(e){}
        try{ if(typeof fastFails === 'function') fastFails(); else toast('Not saved · ' + (LBL[fn] || fn) + ' · ' + (r.error || 'refused') + ' · please do it again'); }catch(e){}
        return; }
      if(n < W.length) setTimeout(tick, W[n++]); };
    setTimeout(tick, W[n++]); }
  const base = window.api;
  const w = function(fn){ const all = arguments, self = this, a = [].slice.call(arguments, 1);
    if(fn === 'mgmtAgree') return Promise.resolve(base.apply(this, all)).then(r => { try{ const q = a[1] || {}, P = agp().filter(x => same(x.rec, q.code, q.key, q.name)).map(x => x.rec);
        if(r && r.ok && P.length){ const L = Array.isArray(r.list) ? r.list : []; const add = P.filter(p => !L.some(x => x.how === p.how && String(x.at || '') >= String(p.at || ''))); if(add.length) r.list = add.concat(L).sort((x, y) => String(y.at || '').localeCompare(String(x.at || ''))); } }catch(e){} return r; });
    let on = !!FNS[fn]; try{ if(localStorage.getItem('coe.fast') === '0') on = false; }catch(e){}
    if(!on || typeof TOKEN === 'undefined' || !TOKEN || typeof D === 'undefined' || !D || (fn !== 'tLeaveInformed' && !D.mgr) || a[0] !== TOKEN) return base.apply(this, all);
    const f = a[1] && typeof a[1] === 'object' ? a[1] : null;
    if(fn === 'mgmtAgreeSave' && f && f.file && String(f.file.b64 || '').length > 12e6) return base.apply(this, all);
    const rid = (f && f.rid ? 'w-' + f.rid : 'w' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8));
    const send = () => { const ac = window.AbortController ? new AbortController() : null, tid = ac ? setTimeout(() => ac.abort(), f && f.file ? 30000 : 8000) : 0;
      return fetch(FAST_URL + '-wq', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN, fn, args: a, rid }), signal: ac ? ac.signal : undefined }).then(x => x.json()).finally(() => clearTimeout(tid)); };
    return send().catch(() => new Promise(z => setTimeout(z, 800)).then(send))   /* the same rid twice = one save */
      .then(r => { if(!r || !r.ok || !r.queued) throw new Error('db');
        if(r.id && !r.dup) watch(r.id, fn, a); else if(r.id) watch(r.id, fn, a);
        return ans(fn, a); })
      .catch(() => base.apply(self, all));   /* the database did not take it: Google, exactly as before */ };
  for(const k in base) try{ w[k] = base[k]; }catch(e){}
  window.api = w;
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
