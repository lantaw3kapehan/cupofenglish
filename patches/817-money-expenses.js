// 817: (Misty) "In the MONEY screen, replace my PAY into a table of those expenses lodged … since we only see those expenses itemized on COE
//      EXCEL DATABASE · like a history? or any best workaround"
// Money › Expenses (replaces My pay in the Money tabs): every line of COE DATABASE › EXPENSES, newest first (database copy, coe-expenses):
// · Month chips (this month, last months, All) · search box · category chips with their totals (tap = only that category)
// · Total for the period and against the month before · one row per expense: date · description · category · amount
// · An expense just added in the app shows at once ("saving to the sheet")
// · + Expense (the same form as on Sales & costs) · Download CSV for the period shown.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["['payroll', 'Payroll'], ['money', 'Sales & costs'], ['mypay', 'My pay']", "['payroll', 'Payroll'], ['money', 'Sales & costs'], ['expenses', 'Expenses']"],
  ["const has = v => KNOWN[v] ||", "const has = v => v === 'expenses' || KNOWN[v] ||"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 817 · Money › Expenses */
(function(){
  if(window.__817 || typeof VIEWS === 'undefined') return; window.__817 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>' + [
    '#v-expenses .ex-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:6px 0 12px}#v-expenses .ex-h h1{margin:0}#v-expenses .grow{flex:1}',
    '#v-expenses .ex-ch{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 10px}#v-expenses .ex-ch button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:6px 12px;font:inherit;font-size:13px;font-weight:600;color:var(--ink2);cursor:pointer}',
    '#v-expenses .ex-ch button.on{background:var(--ink);color:#fff;border-color:var(--ink)}#v-expenses .ex-ch button i{font-style:normal;opacity:.7;margin-left:6px;font-weight:500}',
    '#v-expenses .ex-sum{display:flex;gap:24px;flex-wrap:wrap;align-items:baseline;margin:6px 0 14px}#v-expenses .ex-sum b{font-size:28px}#v-expenses .ex-sum .up{color:#B4442F}#v-expenses .ex-sum .dn{color:#1C7A55}',
    '#v-expenses table{width:100%;border-collapse:collapse;background:#fff;border:1px solid var(--line);border-radius:14px;overflow:hidden;font-size:14px}',
    '#v-expenses th{text-align:left;font-size:11px;letter-spacing:.06em;text-transform:uppercase;color:#8A86A0;background:#FAFAFC;padding:10px 12px}',
    '#v-expenses td{padding:9px 12px;border-top:1px solid #F1F0F6;vertical-align:top}#v-expenses td.a{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;font-weight:600}#v-expenses th.a{text-align:right}',
    '#v-expenses td.d{white-space:nowrap;color:#5C5876}#v-expenses td.c span{display:inline-block;background:#F1F0F6;border-radius:999px;padding:2px 9px;font-size:12px;color:#55526E}#v-expenses tr.q td{opacity:.65}',
    '@media(max-width:640px){#v-expenses td.c{display:none}#v-expenses th.c{display:none}}'].join('') + '</style>');
  try{ if(VIEWS.indexOf('expenses') < 0) VIEWS.push('expenses'); if(!$('v-expenses')){ const d = document.createElement('div'); d.id = 'v-expenses'; d.className = 'hide'; const ref = $('v-money') || $('v-payroll'); ref.parentNode.insertBefore(d, ref.nextSibling); } }catch(e){}
  const X = { rows: null, at: null, m: '', c: '', q: '', n: 150, busy: 0 };
  try{ const k = JSON.parse(localStorage.getItem('coe.exp') || 'null'); if(k && k.rows){ X.rows = k.rows; X.at = k.at; } }catch(e){}
  const ym = d => d.slice(0, 7), mLbl = m => new Date(m + '-15T12:00:00').toLocaleDateString('en-GB', { month: 'short', year: 'numeric' });
  const P = n => '₱' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  async function load(){ if(X.busy || typeof TOKEN === 'undefined' || !TOKEN) return; X.busy = 1;
    try{ const r = await fetch(FAST_URL + '-expenses', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN }) }).then(x => x.json());
      if(r && r.ok){ X.rows = r.rows; X.at = r.at; try{ localStorage.setItem('coe.exp', JSON.stringify({ rows: r.rows, at: r.at })); }catch(e){} if(VIEW === 'expenses') paint(); } }catch(e){} X.busy = 0; }
  const today = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  function list(){ const R = X.rows || [], q = X.q.trim().toLowerCase();
    return R.filter(r => (!X.m || ym(r.d) === X.m) && (!X.c || r.c === X.c) && (!q || (r.t + ' ' + r.c + ' ' + r.a).toLowerCase().indexOf(q) > -1)); }
  function paint(){ const v = $('v-expenses'); if(!v) return;
    if(!X.m) X.m = ym(today());
    if(!X.rows){ v.innerHTML = '<div class="ex-h"><h1>Expenses</h1></div><div class="sk"></div><div class="sk"></div>'; return; }
    const months = [...new Set(X.rows.map(r => ym(r.d)).filter(m => m <= ym(today())))].sort().reverse().slice(0, 12);
    const inM = X.rows.filter(r => !X.m || ym(r.d) === X.m), cats = {}; inM.forEach(r => cats[r.c] = (cats[r.c] || 0) + r.a);
    const L = list(), tot = L.reduce((a, r) => a + r.a, 0);
    let cmp = ''; if(X.m && !X.q){ const pm = new Date(Date.parse(X.m + '-15') - 30 * 864e5).toISOString().slice(0, 7), pt = X.rows.filter(r => ym(r.d) === pm && (!X.c || r.c === X.c)).reduce((a, r) => a + r.a, 0);
      if(pt) { const d = tot - pt; cmp = '<span class="' + (d > 0 ? 'up' : 'dn') + '">' + (d > 0 ? '▲ ' : '▼ ') + P(Math.abs(d)) + '</span> <span class="small mute">vs ' + mLbl(pm) + ' (' + P(pt) + ')</span>'; } }
    const vis = L.slice(0, X.n);
    v.innerHTML = '<div class="ex-h"><h1>Expenses</h1><span class="small mute">from COE DATABASE › EXPENSES' + (X.at ? ' · copied ' + esc(new Date(X.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })) : '') + '</span><span class="grow"></span>' +
        (typeof expSheet === 'function' ? '<button class="btn teal sm" onclick="expSheet()">+ Expense</button>' : '') + '<button class="btn ghost sm" onclick="exCsv()">Download CSV</button></div>' +
      '<div class="ex-ch">' + months.map(m => '<button class="' + (X.m === m ? 'on' : '') + '" onclick="exM(\'' + m + '\')">' + (m === ym(today()) ? 'This month' : mLbl(m)) + '</button>').join('') + '<button class="' + (!X.m ? 'on' : '') + '" onclick="exM(\'\')">All</button></div>' +
      '<input class="in-t" id="exQ" placeholder="Search description, category or amount" value="' + esc(X.q) + '" oninput="exQ(this.value)" style="max-width:420px">' +
      '<div class="ex-ch">' + '<button class="' + (!X.c ? 'on' : '') + '" onclick="exC(\'\')">All categories</button>' + Object.keys(cats).sort((a, b) => cats[b] - cats[a]).map(c => '<button class="' + (X.c === c ? 'on' : '') + '" onclick="exC(\'' + esc(c).replace(/'/g, '&#39;') + '\')">' + esc(c) + '<i>' + P(cats[c]) + '</i></button>').join('') + '</div>' +
      '<div class="ex-sum"><div><div class="small mute">' + (X.m ? mLbl(X.m) : 'All time') + (X.c ? ' · ' + esc(X.c) : '') + '</div><b class="num">' + P(tot) + '</b></div><div class="small mute">' + L.length + ' expense' + (L.length === 1 ? '' : 's') + '</div>' + (cmp ? '<div>' + cmp + '</div>' : '') + '</div>' +
      (vis.length ? '<table><tr><th>Date</th><th>Description</th><th class="c">Category</th><th class="a">Amount</th></tr>' + vis.map(r => '<tr class="' + (r.q ? 'q' : '') + '"><td class="d">' + esc(new Date(r.d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: X.m ? undefined : 'numeric' })) + '</td><td>' + esc(r.t || '—') + (r.q ? ' <span class="small mute">· saving to the sheet</span>' : '') + '</td><td class="c"><span>' + esc(r.c) + '</span></td><td class="a">' + P(r.a) + '</td></tr>').join('') + '</table>' : '<div class="empty">No expenses here.</div>') +
      (L.length > vis.length ? '<div style="text-align:center;margin:12px 0"><button class="btn ghost sm" onclick="exMore()">Show ' + Math.min(150, L.length - vis.length) + ' more</button></div>' : ''); }
  window.exM = m => { X.m = m; X.c = ''; X.n = 150; paint(); };
  window.exC = c => { X.c = X.c === c ? '' : c; X.n = 150; paint(); };
  let qt = 0; window.exQ = q => { X.q = q; clearTimeout(qt); qt = setTimeout(() => { X.n = 150; paint(); const el = $('exQ'); if(el){ el.focus(); el.setSelectionRange(el.value.length, el.value.length); } }, 250); };
  window.exMore = () => { X.n += 150; paint(); };
  window.exCsv = () => { const L = list(), q = x => '"' + String(x).replace(/"/g, '""') + '"';
    const csv = 'Date,Description,Category,Amount\n' + L.map(r => [r.d, q(r.t), q(r.c), r.a].join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' })); a.download = 'CupOfEnglish-expenses-' + (X.m || 'all') + '.csv'; document.body.appendChild(a); a.click(); a.remove(); };
  const _go = window.go; window.go = function(v){ const r = _go.apply(this, arguments); try{ if(v === 'expenses'){ paint(); load(); } }catch(e){} return r; };
  // a new expense: show it at once and read the list again shortly after
  const _api = window.api; window.api = function(fn){ const p = _api.apply(this, arguments); if(fn === 'addExpense') Promise.resolve(p).then(() => setTimeout(load, 1500)).catch(() => {}); return p; };
  for(const k in _api) try{ window.api[k] = _api[k]; }catch(e){}
  // "My pay" leaves the Money tabs and the side menu
  const _bn = window.buildNav; if(typeof _bn === 'function') window.buildNav = function(){ try{ if(typeof D !== 'undefined' && D && D.mgr){ const k = NAV_M.findIndex(x => x[0] === 'mypay'); if(k > -1) NAV_M.splice(k, 1); } }catch(e){} return _bn.apply(this, arguments); };
  setTimeout(() => { try{ if(typeof D !== 'undefined' && D && D.mgr){ buildNav(); if(VIEW === 'mypay') go('expenses'); } }catch(e){} }, 2500);
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
