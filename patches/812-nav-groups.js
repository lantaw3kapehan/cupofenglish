// 812: (Misty) "GO AHEAD AND DO ALL" — fewer screens to hunt through: the management sidebar goes from 18 entries to 9.
// Screens that belong together become tabs of ONE sidebar entry (same tab bar on top of each, like Monitor › Time-ins):
// · Students › Students · Parent reports · Database
// · Trials   › Trials · Enquiries
// · Teachers › Teachers · Performance · Trainings · Leave · Cases
// · Money    › Payroll · Sales & costs · My pay (when you have one)
// Sidebar: Overview · Monitor · To do · Schedule · Messages · Students · Trials · Teachers · Money. Nothing is removed; every screen is one tap away.
const fs = require('fs'), file = process.argv[2];
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 812 · sidebar groups with tabs */
(function(){
  if(window.__812 || typeof NAV_M === 'undefined' || typeof buildNav !== 'function') return; window.__812 = 1;
  const G = [
    { nav: 'astudents', label: 'Students', views: [['astudents', 'Students'], ['reports', 'Parent reports'], ['db', 'Database']] },
    { nav: 'trials', label: 'Trials', views: [['trials', 'Trials'], ['enquiry', 'Enquiries']] },
    { nav: 'teachers', label: 'Teachers', views: [['teachers', 'Teachers'], ['perf', 'Performance'], ['train', 'Trainings'], ['leave', 'Leave'], ['actions', 'Cases']] },
    { nav: 'payroll', label: 'Money', views: [['payroll', 'Payroll'], ['money', 'Sales & costs'], ['mypay', 'My pay']] }];
  const GOF = {}; G.forEach(g => g.views.forEach(([v]) => GOF[v] = g));
  const KNOWN = {};   /* views we took out of the sidebar, remembered so their tab shows only when the screen exists */
  const isM = () => typeof D !== 'undefined' && D && D.mgr;
  function shape(){ if(!isM()) return;
    NAV_M.forEach(x => { const g = GOF[x[0]]; if(g && g.nav !== x[0]) KNOWN[x[0]] = 1; });
    for(let k = NAV_M.length - 1; k >= 0; k--){ const x = NAV_M[k], g = GOF[x[0]]; if(g && g.nav !== x[0]) NAV_M.splice(k, 1); }
    G.forEach(g => { const x = NAV_M.find(y => y[0] === g.nav); if(x){ x[1] = g.label; x[4] = g.label === 'Money' ? 'Money' : (g.label === 'Teachers' ? 'Teachers' : 'Students'); } });
    // order: Today group first, then Students · Trials · Teachers · Money, then the rest
    const ord = ['home', 'monitor', 'mtoday', 'schedule', 'msgs', 'astudents', 'trials', 'teachers', 'payroll'];
    NAV_M.sort((a, b) => { const ia = ord.indexOf(a[0]), ib = ord.indexOf(b[0]); return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib); }); }
  const has = v => KNOWN[v] || NAV_M.some(x => x[0] === v) || (v === 'mypay' && typeof MYP !== 'undefined' && MYP && MYP.has);
  function tabs(v){ const g = GOF[v]; if(!g) return ''; const L = g.views.filter(([k]) => k === v || has(k)); if(L.length < 2) return '';
    return '<div class="mo-tabs grp-tabs" data-g="' + g.nav + '">' + L.map(([k, l]) => '<button class="' + (k === v ? 'on' : '') + '" onclick="go(\'' + k + '\')">' + l + '</button>').join('') + '</div>'; }
  function strip(v){ const el = $('v-' + v); if(!el || !isM()) return; const h = tabs(v); const cur = el.querySelector(':scope > .grp-tabs');
    if(!h){ if(cur) cur.remove(); return; } if(cur){ if(cur.outerHTML !== h) cur.outerHTML = h; if(el.firstElementChild !== el.querySelector(':scope > .grp-tabs')) el.insertBefore(el.querySelector(':scope > .grp-tabs'), el.firstChild); return; }
    el.insertAdjacentHTML('afterbegin', h); }
  const hl = v => { const g = GOF[v]; document.querySelectorAll('nav button').forEach(b => { if(g && b.dataset.v === g.nav) b.classList.add('on'); }); };
  const _bn = window.buildNav; window.buildNav = function(){ try{ shape(); }catch(e){} return _bn.apply(this, arguments); };
  const _go = window.go; window.go = function(v){ const r = _go.apply(this, arguments); try{ if(GOF[v]){ strip(v); setTimeout(() => strip(v), 300); hl(v); } }catch(e){} return r; };
  // the screens redraw themselves; put the tab bar back when that happens
  const mo = new MutationObserver(() => { try{ if(typeof VIEW !== 'undefined' && GOF[VIEW]){ const el = $('v-' + VIEW); if(el && el.firstElementChild && !el.firstElementChild.classList.contains('grp-tabs')) strip(VIEW); } }catch(e){} });
  const start = () => { if(!isM()){ setTimeout(start, 1500); return; } try{ shape(); _bn(); }catch(e){} Object.keys(GOF).forEach(v => { const el = $('v-' + v); if(el) mo.observe(el, { childList: true }); });
    if(GOF[VIEW]){ strip(VIEW); hl(VIEW); } setTimeout(() => { Object.keys(GOF).forEach(v => { const el = $('v-' + v); if(el && !el._g812){ el._g812 = 1; mo.observe(el, { childList: true }); } }); }, 8000); };
  setTimeout(start, 1500);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
require('../tools/lib.js')(file, []);
