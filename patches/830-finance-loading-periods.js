// 830: (audit 25 Oct, finding 1 + Payroll layout direction) Finance loading, saved copies, reporting period and update times are explicit.
// Root cause: Payroll's first paint used the saved PAY data (MO, "September pay") before the saved PAYROLL rows (PL) were read, so the
//   screen drew "September pay" and a moment later — once PAYROLL arrived and September was all paid — switched to "October so far".
//   At start-up on the Payroll screen it was worse: go('payroll') ran before the saved MO was read, so "Loading…", then September,
//   then October when the fresh PAY copy came. Finance › Overview drew skeleton panels first because the saved MONEY copy was only read
//   after the first paint.
// Fix (state handling only, the same saved copies the app already keeps):
//   · Opening Payroll / Finance Overview / Sales & costs reads the saved copies on this device first, so the first paint is already
//     the right period.
//   · A status line names the period from the first paint and says where the figures come from and how fresh they are:
//     "Showing October 2026 so far · …" / "Showing September 2026 pay · 7 of 9 paid · checking PAYROLL for October 2026 so far…"
//     and "Saved copy from 13:20 · refreshing…" → "Updated 13:42" (or "could not refresh"). Overview: the same next to the month.
//   · Payroll order: header · status · pay status strip · search and filters · teacher list · then the 12-month chart and the folded
//     Payroll insights · then Payroll history. Nothing removed, only moved down.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 830 · Finance: saved copy first, period named, update time shown; Payroll list before analytics */
(function(){
  if(window.__830) return; window.__830 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>' +
    '#v-payroll .st830{display:flex;flex-wrap:wrap;gap:4px 14px;align-items:baseline;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;font-size:13px;color:#5E5A75;margin:-4px 0 12px;font-variant-numeric:tabular-nums}' +
    '#v-payroll .st830 b{color:#2f2752}.st830 .fr{color:#7C7893}.st830 .fr.busy:before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#01b0bf;margin-right:6px;vertical-align:1px;animation:pl830 1.2s ease-in-out infinite}' +
    '.st830 .fr.err{color:#B5533C}@keyframes pl830{50%{opacity:.25}}@media(prefers-reduced-motion:reduce){.st830 .fr.busy:before{animation:none}}' +
    '#v-finov .st830o{margin-left:0}#v-payroll.s830 .py-top .sub{display:none}#v-payroll.s830 .py-top{margin-bottom:6px!important}#v-payroll.p824>.bd63{margin-top:12px}</style>');
  const LS = 'coe.at830'; let AT = {}; try{ AT = JSON.parse(localStorage.getItem(LS) || '{}') || {}; }catch(e){ AT = {}; }
  const ST = {}, st = k => ST[k] || (ST[k] = { n: 0, fresh: 0, err: 0 });
  const mark = k => { AT[k] = Date.now(); try{ localStorage.setItem(LS, JSON.stringify(AT)); }catch(e){} };
  const hm = ms => { const d = new Date(ms), t = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false }); return d.toDateString() === new Date().toDateString() ? t : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' ' + t; };
  const GET = { MO: () => typeof MO !== 'undefined' ? MO : null, PL: () => typeof PL !== 'undefined' ? PL : null, MN: () => typeof MN !== 'undefined' ? MN : null, VIEW: () => typeof VIEW !== 'undefined' ? VIEW : null };
  const g = n => { try{ return GET[n](); }catch(e){ return null; } };

  // ── 1 · saved copies before the first paint (exactly what swr / render() read a moment later)
  function hydrate(v){
    try{ if(v === 'payroll'){
        if(!g('MO')){ try{ const m = JSON.parse(store('get', 'coe.mo') || 'null'); if(m) MO = m; }catch(e){} }
        if(!g('PL') && typeof kept === 'function'){ const k = kept('payroll'); if(k) PL = k; } }
      if((v === 'finov' || v === 'money') && !g('MN') && typeof kept === 'function' && typeof isPres === 'function' && isPres()){ const k = kept('money'); if(k) MN = k; } }catch(e){ console.warn('830 hydrate', e); } }
  const _go = window.go;
  if(typeof _go === 'function') window.go = function(v){ hydrate(v); const r = _go.apply(this, arguments); try{ paint(); }catch(e){} return r; };

  // ── 2 · freshness: which copy is on screen, and when it was fetched
  const TRACK = { payroll: 1, money: 1 };
  try{ const S0 = window.swr; if(typeof S0 === 'function') window.swr = swr = function(k, call, set, paint0){
      if(!TRACK[k]) return S0.apply(this, arguments);
      const s = st(k); s.n++; s.err = 0; queue();
      const c = () => { let p; try{ p = call(); }catch(e){ s.err = 1; throw e; } return Promise.resolve(p).then(v => { s.fresh = 1; mark(k); return v; }, e => { s.err = 1; throw e; }); };
      return Promise.resolve(S0.call(this, k, c, set, paint0)).finally(() => { s.n = Math.max(0, s.n - 1); queue(); }); }; }catch(e){ console.warn('830 swr', e); }
  try{ const LM = window.loadMgmt; if(typeof LM === 'function') window.loadMgmt = async function(){ const s = st('mo'), before = g('MO'); s.n++; queue();
      try{ return await LM.apply(this, arguments); }
      finally{ s.n = Math.max(0, s.n - 1); const now = g('MO'); if(now && now !== before){ s.fresh = 1; s.err = 0; mark('mo'); } else if(!s.fresh) s.err = 1; queue(); } }; }catch(e){ console.warn('830 mgmt', e); }

  function fresh(keys){ const S = keys.map(st), busy = S.some(x => x.n > 0), all = S.every(x => x.fresh), err = S.some(x => x.err && !x.fresh);
    const T = keys.map(k => AT[k]).filter(Boolean), t = T.length === keys.length ? Math.min(...T) : 0;
    let txt = all && t ? 'Updated ' + hm(t) : t ? 'Saved copy from ' + hm(t) : 'Saved copy on this device';
    if(busy) txt += ' · refreshing…'; else if(err) txt += ' · could not refresh, showing the saved copy';
    return '<span class="fr' + (busy ? ' busy' : err ? ' err' : '') + '">' + txt + '</span>'; }

  // ── 3 · Payroll: status line + list before analytics
  const curLabel = () => new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  function payStatus(v){ const M = g('MO'), P = (M && M.payroll) || [], pm = (M && M.payMonth) || '', PLx = g('PL');
    if(!P.length) return '<span>Loading pay from the PAY tab…</span>';
    const now = v.classList.contains('py-now') && document.getElementById('pyCur'), paid = P.filter(x => x.paid).length, cl = curLabel();
    let per;
    if(now) per = 'Showing <b>' + esc(cl) + ' so far</b> (PAYROLL tab) · month still running, paid after month end · ' + esc(pm) + ' pay: all ' + P.length + ' paid';
    else { per = 'Showing <b>' + esc(pm) + ' pay</b> (PAY tab) · ' + paid + ' of ' + P.length + ' paid';
      if(paid === P.length) per += PLx ? ' · no ' + esc(cl) + ' rows in PAYROLL yet' : ' · checking PAYROLL for ' + esc(cl) + ' so far…'; }
    return '<span>' + per + '</span>' + fresh(PLx || now ? ['mo', 'payroll'] : ['mo']); }
  function payFix(){ const v = document.getElementById('v-payroll'); if(!v || !v.firstElementChild) return;
    const top = v.querySelector(':scope > .py-top');
    if(top){ let b = v.querySelector(':scope > .st830'); const h = payStatus(v); v.classList.add('s830');
      if(!b){ top.insertAdjacentHTML('afterend', '<div class="st830" role="status">' + h + '</div>'); }
      else { if(b.previousElementSibling !== top) top.after(b); if(b._h !== h){ b.innerHTML = h; b._h = h; } }
      if(!b){ b = v.querySelector(':scope > .st830'); if(b) b._h = h; } }
    if(!v.classList.contains('p824')) return;                     // the dark summary card still shows: leave the layout alone
    const pl = document.getElementById('plList'); if(!pl || pl.parentElement !== v) return;
    const cap = pl.previousElementSibling && pl.previousElementSibling.classList.contains('py-cap') ? pl.previousElementSibling : pl;
    const A = [v.querySelector(':scope > .bd63') || v.querySelector(':scope > .pm60'), v.querySelector(':scope > details.pi824') || v.querySelector(':scope > .in63')].filter(Boolean);
    for(let k = A.length - 1, next = cap; k >= 0; k--){ if(A[k].nextElementSibling !== next) next.before(A[k]); next = A[k]; } }

  // ── 4 · Finance Overview: status next to the month
  function ovFix(){ const v = document.getElementById('v-finov'); if(!v) return; const hd = v.querySelector('.fx-h'); if(!hd) return;
    if(typeof isPres === 'function' && !isPres()) return;
    const h = g('MN') ? fresh(['money']) : '<span class="fr busy">Loading sales and costs from the MONEY tab…</span>';
    let b = hd.querySelector('.st830o'); if(!b){ const sub = hd.querySelector('.fx-sub'); (sub || hd.firstElementChild).insertAdjacentHTML('afterend', '<span class="fx-sub st830 st830o" role="status">' + h + '</span>'); b = hd.querySelector('.st830o'); if(b) b._h = h; }
    else if(b._h !== h){ b.innerHTML = h; b._h = h; } }

  function paint(){ try{ payFix(); }catch(e){ console.warn('830 pay', e); } try{ ovFix(); }catch(e){ console.warn('830 ov', e); } }
  let qd = 0; function queue(){ if(qd) return; qd = 1; Promise.resolve().then(() => { qd = 0; paint(); }); }
  ['v-payroll', 'v-finov'].forEach(id => { const el = document.getElementById(id); if(el) new MutationObserver(queue).observe(el, { childList: true }); });
  // v-finov is made by 823 at start-up; if it appears later, watch it too
  if(!document.getElementById('v-finov')) setTimeout(() => { const el = document.getElementById('v-finov'); if(el) new MutationObserver(queue).observe(el, { childList: true }); }, 4000);
  try{ const V = g('VIEW'); if(V === 'payroll' || V === 'finov'){ hydrate(V); if(V === 'payroll') renderPayroll(); paint(); } }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
// 823 Overview: the month was chosen after the header was built, so the first paint had no month next to "Finance".
require('../tools/lib.js')(file, [
  ["function paintOv(){ const v = $('v-finov'); if(!v) return; const M = money(), mo = (typeof MO !== 'undefined' && MO) || {}, P = mo.payroll || [];",
   "function paintOv(){ const v = $('v-finov'); if(!v) return; const M = money(), mo = (typeof MO !== 'undefined' && MO) || {}, P = mo.payroll || []; if(M && M.L.length && (!OM || !M.L.some(x => x.m === OM))) OM = M.L[0].m;"]
]);
