// 818: (Misty) Money › Expenses: "Can you make it better please?" · "Like Sales and Expenses history together? … every entry we do we can
//      easily track it, because for sales, we only see it in PAYMENT CONFIRMATION"
// Money › History (was Expenses): every sale (COE DATABASE › SALES) and every expense (› EXPENSES) in one calm, easy list (coe-expenses v2).
// · All · Sales (money in) · Expenses (money out).
// · One month at a time with ‹ Oct 2026 › arrows, and a 12-month chart (money in green, money out coral; tap a month to open it).
// · Tiles: Sales · Expenses · Net (sales − expenses) for the month, or for one side: total, against last month, the biggest part.
// · "Where it came from" (sales by partner) and "Where it went" (expenses by category): one coloured bar + amounts and shares; tap = only that.
// · The list grouped by date: a sale shows the student, invoice no., package (+ free lessons), payment method, RMB and partner (+₱ in green);
//   an expense shows its description and category (−₱). Search covers both. Future-dated lines show "Scheduled" under All months.
// · + Sale, + Expense and Download CSV. A sale or expense saved in the app shows here within seconds.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["function paint(){ const v = $('v-expenses'); if(!v) return;", "function paint(){ if(window.exPaint2) return window.exPaint2(X); const v = $('v-expenses'); if(!v) return;"],
  ["X.rows = r.rows; X.at = r.at;", "X.rows = r.rows; X.sales = r.sales || []; X.at = r.at;"],
  ["JSON.stringify({ rows: r.rows, at: r.at })", "JSON.stringify({ rows: r.rows, sales: r.sales || [], at: r.at })"],
  ["X.rows = k.rows; X.at = k.at;", "X.rows = k.rows; X.sales = k.sales || []; X.at = k.at;"],
  ["['expenses', 'Expenses']", "['expenses', 'History']"],
  ["if(fn === 'addExpense') Promise.resolve(p)", "if(/^(addExpense|addSale|mgmtRenewPaid|mgmtEnrolPaid)$/.test(fn)) Promise.resolve(p)"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 818 · Money › History (sales + expenses) */
(function(){
  if(window.__818) return; window.__818 = 1;
  document.head.insertAdjacentHTML('beforeend', '<style>' + [
    '#v-expenses{max-width:1100px;margin:0 auto}',
    '#v-expenses .e2-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:8px 0 14px}#v-expenses .e2-h h1{margin:0}#v-expenses .grow{flex:1}',
    '#v-expenses .e2-k{display:inline-flex;background:#F1F0F6;border-radius:12px;padding:3px;gap:2px;margin-bottom:12px}#v-expenses .e2-k button{border:0;background:none;padding:8px 14px;border-radius:10px;font:inherit;font-size:14px;font-weight:700;color:#6F6B85;cursor:pointer}#v-expenses .e2-k button.on{background:#fff;color:var(--ink);box-shadow:0 1px 3px rgba(43,34,83,.12)}',
    '#v-expenses .e2-m{display:flex;align-items:center;gap:6px}#v-expenses .e2-m b{font-size:18px;min-width:110px;text-align:center}',
    '#v-expenses .e2-m button{border:1px solid var(--line);background:#fff;border-radius:10px;width:34px;height:34px;font-size:18px;cursor:pointer;color:var(--ink)}#v-expenses .e2-m button:disabled{opacity:.3;cursor:default}',
    '#v-expenses .e2-m .all{width:auto;padding:0 12px;font-size:13px;font-weight:700}#v-expenses .e2-m .all.on{background:var(--ink);color:#fff;border-color:var(--ink)}',
    '#v-expenses .e2-card{background:#fff;border:1px solid var(--line);border-radius:18px;padding:18px 20px;margin-bottom:14px}',
    '#v-expenses .e2-chart{display:flex;align-items:flex-end;gap:10px;height:130px;padding-top:6px}',
    '#v-expenses .e2-chart a{flex:1;display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;text-decoration:none;min-width:0;border-radius:10px;padding:4px 0}#v-expenses .e2-chart a.on{background:#F4F3F9}',
    '#v-expenses .e2-chart .bb{display:flex;align-items:flex-end;gap:3px;height:100px;width:100%;justify-content:center}#v-expenses .e2-chart .bb i{display:block;width:42%;max-width:18px;border-radius:6px 6px 2px 2px}',
    '#v-expenses .e2-chart .in{background:#3FB58A}#v-expenses .e2-chart .out{background:#E8957F}#v-expenses .e2-chart a:not(.on) i{opacity:.55}',
    '#v-expenses .e2-chart a span{font-size:11px;color:#8A86A0;white-space:nowrap}#v-expenses .e2-chart a.on span{color:var(--ink);font-weight:700}',
    '#v-expenses .e2-leg{display:flex;gap:14px;font-size:12px;color:#6F6B85}#v-expenses .e2-leg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:-1px}',
    '#v-expenses .e2-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:14px}',
    '#v-expenses .e2-t{background:#fff;border:1px solid var(--line);border-radius:18px;padding:16px 18px}#v-expenses .e2-t small{display:block;font-size:12px;color:#8A86A0;letter-spacing:.04em;text-transform:uppercase;margin-bottom:6px}',
    '#v-expenses .e2-t b{font-size:26px;font-family:"Fredoka One","Fredoka",Rockwell,sans-serif;font-weight:400}#v-expenses .e2-t .s{font-size:13px;color:#6F6B85;margin-top:4px}',
    '#v-expenses .pos{color:#1C7A55}#v-expenses .neg{color:#B4442F}',
    '#v-expenses .e2-two{display:grid;grid-template-columns:1fr 1fr;gap:14px}#v-expenses .e2-two .e2-card{margin-bottom:14px}',
    '#v-expenses .e2-bar{display:flex;height:14px;border-radius:999px;overflow:hidden;background:#F1F0F6;margin:8px 0 12px}#v-expenses .e2-bar i{display:block;height:100%}',
    '#v-expenses .e2-cats{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:4px 16px}',
    '#v-expenses .e2-c{display:flex;align-items:center;gap:8px;padding:7px 8px;border-radius:10px;cursor:pointer;font-size:14px}#v-expenses .e2-c:hover{background:#F7F6FB}#v-expenses .e2-c.on{background:#EFEEF6}#v-expenses .e2-c.off{opacity:.45}',
    '#v-expenses .dot{width:10px;height:10px;border-radius:50%;flex:none}#v-expenses .e2-c .n{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#v-expenses .e2-c .a{font-weight:700;font-variant-numeric:tabular-nums}#v-expenses .e2-c .p{color:#8A86A0;font-size:12px;width:38px;text-align:right}',
    '#v-expenses .e2-lh{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:2px 0 8px}#v-expenses .e2-lh h2{margin:0;font-size:17px}#v-expenses .e2-lh input{max-width:300px;margin:0}',
    '#v-expenses .e2-day{display:flex;gap:10px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#8A86A0;padding:14px 4px 6px;border-bottom:1px solid #F1F0F6}#v-expenses .e2-day .grow{flex:1}#v-expenses .e2-day b{font-weight:600;letter-spacing:0;text-transform:none}',
    '#v-expenses .e2-r{display:flex;align-items:center;gap:14px;padding:10px 4px;border-bottom:1px solid #F5F4F9;text-align:left}',
    '#v-expenses .e2-r .ic{width:30px;height:30px;border-radius:10px;display:grid;place-items:center;flex:none;font-size:14px;font-weight:700}#v-expenses .e2-r .ic.in{background:#E8F6EE;color:#1C7A55}',
    '#v-expenses .e2-r .d{flex:1;min-width:0}#v-expenses .e2-r .d b{display:block;font-weight:600;font-size:15px}#v-expenses .e2-r .d span{font-size:12.5px;color:#8A86A0}',
    '#v-expenses .e2-r .a{font-weight:700;font-size:15px;font-variant-numeric:tabular-nums;white-space:nowrap}#v-expenses .e2-r.q{opacity:.6}',
    '#v-expenses .e2-tag{display:inline-block;font-size:11px;font-weight:700;border-radius:999px;padding:1px 8px;background:#FFF4E5;color:#9A5B10;letter-spacing:0;text-transform:none}',
    '@media(max-width:860px){#v-expenses .e2-tiles,#v-expenses .e2-two{grid-template-columns:1fr}#v-expenses .e2-chart{gap:4px}#v-expenses .e2-chart a span{font-size:9px}}'].join('') + '</style>');
  const COL = ['#1F8F96', '#2B2253', '#E4846B', '#D9962B', '#6C5FC7', '#2E9E6F', '#C2410C', '#00A3AD', '#B7791F', '#8A86A0', '#4A90C2', '#A35FA0'];
  const SCOL = ['#2E9E6F', '#1F8F96', '#6C5FC7', '#00A3AD', '#4A90C2', '#B7791F', '#A35FA0', '#2B2253'];
  const ym = d => d.slice(0, 7), today = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10);
  const mL = (m, y) => new Date(m + '-15T12:00:00').toLocaleDateString('en-GB', y === false ? { month: 'short' } : { month: 'short', year: 'numeric' });
  const P = n => '₱' + Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const P0 = n => '₱' + Math.round(n || 0).toLocaleString('en-US');
  const addM = (m, k) => { const d = new Date(Date.parse(m + '-15T12:00:00Z')); d.setUTCMonth(d.getUTCMonth() + k); return d.toISOString().slice(0, 7); };
  let ALL = false, K = 'all', SRC = '';
  try{ K = localStorage.getItem('coe.hist.k') || 'all'; }catch(e){}
  const rep = () => { if(window.__exX) exPaint2(window.__exX); };
  window.exAll = () => { ALL = !ALL; const X = window.__exX; if(X){ X.m = ALL ? '' : ym(today()); X.n = 150; } rep(); };
  window.exStep = k => { const X = window.__exX; if(!X) return; ALL = false; X.m = addM(X.m || ym(today()), k); X.c = ''; SRC = ''; X.n = 150; rep(); };
  window.exK = k => { K = k; try{ localStorage.setItem('coe.hist.k', k); }catch(e){} const X = window.__exX; if(X){ X.c = ''; X.n = 150; } SRC = ''; rep(); };
  window.exM = m => { const X = window.__exX; if(!X) return; ALL = !m; X.m = m; X.c = ''; SRC = ''; X.n = 150; rep(); };
  window.exS = v => { SRC = SRC === v ? '' : v; const X = window.__exX; if(X) X.n = 150; rep(); };
  window.exCsv = () => { const X = window.__exX; if(!X) return; const L = window.__exList || [], q = x => '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"';
    const csv = 'Date,Type,Description,Category or partner,Details,Amount (PHP)\n' + L.map(r => [r.d, r.k === 'in' ? 'Sale' : 'Expense', q(r.t), q(r.c), q(r.sub || ''), (r.k === 'in' ? '' : '-') + r.a].join(',')).join('\n');
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' })); a.download = 'CupOfEnglish-' + (K === 'in' ? 'sales' : K === 'out' ? 'expenses' : 'sales-and-expenses') + '-' + (X.m || 'all') + '.csv'; document.body.appendChild(a); a.click(); a.remove(); };
  const pkgTxt = r => { const n = Number(r.pkg) || 0, f = Number(r.free) || 0; return n ? n + (f ? ' + ' + f : '') + ' lessons' : ''; };
  function card(title, link, groups, col, cur, fn){ const T = Object.values(groups).reduce((a, b) => a + b, 0), ks = Object.keys(groups).sort((a, b) => groups[b] - groups[a]);
    return '<div class="e2-card"><div class="e2-lh"><h2>' + title + '</h2><span class="grow"></span>' + (cur ? '<a class="link small" onclick="' + fn + '(\'\')">' + link + '</a>' : '') + '</div>' +
      '<div class="e2-bar">' + ks.map(c => '<i title="' + esc(c) + ': ' + P(groups[c]) + '" style="width:' + (T ? groups[c] / T * 100 : 0) + '%;background:' + col(c) + '"></i>').join('') + '</div>' +
      '<div class="e2-cats">' + (ks.map(c => '<div class="e2-c ' + (cur === c ? 'on' : cur ? 'off' : '') + '" onclick="' + fn + '(\'' + esc(c).replace(/'/g, '&#39;') + '\')"><span class="dot" style="background:' + col(c) + '"></span><span class="n">' + esc(c) + '</span><span class="a">' + P0(groups[c]) + '</span><span class="p">' + (T ? Math.round(groups[c] / T * 100) : 0) + '%</span></div>').join('') || '<div class="small mute">Nothing in this period.</div>') + '</div></div>'; }
  window.exPaint2 = function(X){ window.__exX = X; const v = $('v-expenses'); if(!v) return;
    if(ALL) X.m = ''; else if(!X.m) X.m = ym(today());
    const head = '<div class="e2-h"><h1>History</h1><span class="small mute">every sale and expense from COE DATABASE' + (X.at ? ', copied ' + esc(new Date(X.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false })) : '') + '</span><span class="grow"></span>' +
      (typeof saleSheet === 'function' ? '<button class="btn teal sm" onclick="saleSheet()">+ Sale</button>' : '') + (typeof expSheet === 'function' ? '<button class="btn ghost sm" onclick="expSheet()">+ Expense</button>' : '') + '<button class="btn ghost sm" onclick="exCsv()">Download CSV</button></div>' +
      '<div class="e2-k">' + [['all', 'All'], ['in', 'Sales'], ['out', 'Expenses']].map(([k, l]) => '<button class="' + (K === k ? 'on' : '') + '" onclick="exK(\'' + k + '\')">' + l + '</button>').join('') + '</div>';
    if(!X.rows){ v.innerHTML = head + '<div class="sk"></div><div class="sk"></div>'; return; }
    const now = today(), cur = ym(now);
    const E = (X.rows || []).map(r => ({ k: 'out', d: r.d, t: r.t, c: r.c, a: r.a, q: r.q }));
    const S = (X.sales || []).map(r => ({ k: 'in', d: r.d, t: r.t, inv: r.inv, c: r.src || 'Direct', a: r.a, sub: [pkgTxt(r), r.pay, r.rmb ? '¥' + Number(r.rmb).toLocaleString('en-US') : ''].filter(Boolean).join(', ') }));
    const catAll = {}; E.forEach(r => catAll[r.c] = (catAll[r.c] || 0) + r.a); const colOf = {}; Object.keys(catAll).sort((a, b) => catAll[b] - catAll[a]).forEach((c, k) => colOf[c] = COL[k % COL.length]);
    const srcAll = {}; S.forEach(r => srcAll[r.c] = (srcAll[r.c] || 0) + r.a); const scol = {}; Object.keys(srcAll).sort((a, b) => srcAll[b] - srcAll[a]).forEach((c, k) => scol[c] = SCOL[k % SCOL.length]);
    const sumM = (L, m) => L.filter(r => ym(r.d) === m).reduce((a, r) => a + r.a, 0);
    const last12 = []; for(let k = 11; k >= 0; k--) last12.push(addM(cur, -k));
    const MI = {}, MO = {}; last12.forEach(m => { MI[m] = sumM(S, m); MO[m] = sumM(E, m); });
    const mx = Math.max(1, ...last12.map(m => Math.max(K !== 'out' ? MI[m] : 0, K !== 'in' ? MO[m] : 0)));
    const per = r => !X.m || ym(r.d) === X.m;
    const Ep = E.filter(per), Sp = S.filter(per);
    const cats = {}; Ep.forEach(r => cats[r.c] = (cats[r.c] || 0) + r.a); const srcs = {}; Sp.forEach(r => srcs[r.c] = (srcs[r.c] || 0) + r.a);
    const q = (X.q || '').trim().toLowerCase(), qok = r => !q || (r.t + ' ' + r.c + ' ' + (r.sub || '') + ' ' + (r.inv || '') + ' ' + r.a).toLowerCase().indexOf(q) > -1;
    let L = [].concat(K !== 'in' ? Ep.filter(r => (!X.c || r.c === X.c) && !(SRC && K === 'all')) : [], K !== 'out' ? Sp.filter(r => (!SRC || r.c === SRC) && !(X.c && K === 'all')) : []).filter(qok);
    L.sort((a, b) => b.d.localeCompare(a.d) || (a.k === 'in' ? -1 : 1)); window.__exList = L;
    const tin = Sp.reduce((a, r) => a + r.a, 0), tout = Ep.reduce((a, r) => a + r.a, 0);
    let h = head;
    h += '<div class="e2-card"><div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:6px"><div class="e2-m"><button onclick="exStep(-1)" ' + (ALL ? 'disabled' : '') + '>‹</button><b>' + (X.m ? mL(X.m) : 'All months') + '</b><button onclick="exStep(1)" ' + (ALL || !X.m || X.m >= cur ? 'disabled' : '') + '>›</button><button class="all ' + (ALL ? 'on' : '') + '" onclick="exAll()">All months</button></div><span class="grow"></span>' +
      '<span class="e2-leg">' + (K !== 'out' ? '<span><i style="background:#3FB58A"></i>Sales</span>' : '') + (K !== 'in' ? '<span><i style="background:#E8957F"></i>Expenses</span>' : '') + '</span></div>' +
      '<div class="e2-chart">' + last12.map(m => '<a class="' + (X.m === m ? 'on' : '') + '" onclick="exM(\'' + m + '\')" title="' + mL(m) + ': sales ' + P0(MI[m]) + ', expenses ' + P0(MO[m]) + '"><div class="bb">' + (K !== 'out' ? '<i class="in" style="height:' + Math.max(3, Math.round(MI[m] / mx * 96)) + 'px"></i>' : '') + (K !== 'in' ? '<i class="out" style="height:' + Math.max(3, Math.round(MO[m] / mx * 96)) + 'px"></i>' : '') + '</div><span>' + mL(m, false) + '</span></a>').join('') + '</div></div>';
    const pm = X.m ? addM(X.m, -1) : '', cmp = (a, b) => { if(!pm || !b) return '<div class="s">' + (pm ? 'Nothing in ' + mL(pm) + '.' : 'Pick a month to compare.') + '</div>'; const d = a - b, pc = Math.round(d / b * 100); return '<div class="s">' + (d >= 0 ? '▲ ' : '▼ ') + Math.abs(pc) + '% against ' + mL(pm) + ' (' + P0(b) + ')</div>'; };
    if(K === 'all'){ const net = tin - tout;
      h += '<div class="e2-tiles"><div class="e2-t"><small>Sales' + (X.m ? ', ' + mL(X.m) : '') + '</small><b class="pos">' + P0(tin) + '</b>' + cmp(tin, pm ? sumM(S, pm) : 0) + '</div>' +
        '<div class="e2-t"><small>Expenses' + (X.m ? ', ' + mL(X.m) : '') + '</small><b class="neg">' + P0(tout) + '</b>' + cmp(tout, pm ? sumM(E, pm) : 0) + '</div>' +
        '<div class="e2-t"><small>Net (sales − expenses)</small><b class="' + (net >= 0 ? 'pos' : 'neg') + '">' + (net < 0 ? '−' : '') + P0(Math.abs(net)) + '</b><div class="s">' + Sp.length + ' sales, ' + Ep.length + ' expenses. Salaries are on Payroll.</div></div></div>';
      h += '<div class="e2-two">' + card('Where it came from', 'All partners', srcs, c => scol[c] || '#2E9E6F', SRC, 'exS') + card('Where it went', 'All categories', cats, c => colOf[c] || '#8A86A0', X.c, 'exC') + '</div>'; }
    else { const isIn = K === 'in', G = isIn ? srcs : cats, tot = L.reduce((a, r) => a + r.a, 0), top = Object.keys(G).sort((a, b) => G[b] - G[a])[0], prev = pm ? (isIn ? S : E).filter(r => ym(r.d) === pm && (isIn ? (!SRC || r.c === SRC) : (!X.c || r.c === X.c))).reduce((a, r) => a + r.a, 0) : 0;
      h += '<div class="e2-tiles"><div class="e2-t"><small>' + (isIn ? 'Sales' : 'Expenses') + (X.m ? ', ' + mL(X.m) : '') + ((isIn ? SRC : X.c) ? ', ' + esc(isIn ? SRC : X.c) : '') + '</small><b class="' + (isIn ? 'pos' : 'neg') + '">' + P0(tot) + '</b><div class="s">' + L.length + (isIn ? ' sale' : ' expense') + (L.length === 1 ? '' : 's') + '</div></div>' +
        '<div class="e2-t"><small>Against ' + (pm ? mL(pm) : 'last month') + '</small>' + (pm && prev ? '<b>' + ((tot - prev) >= 0 ? '▲ ' : '▼ ') + P0(Math.abs(tot - prev)) + '</b><div class="s">' + Math.abs(Math.round((tot - prev) / prev * 100)) + '% ' + (tot >= prev ? 'more' : 'less') + ' than ' + P0(prev) + '</div>' : '<b>—</b><div class="s">' + (pm ? 'Nothing in ' + mL(pm) + '.' : 'Pick a month to compare.') + '</div>') + '</div>' +
        '<div class="e2-t"><small>' + (isIn ? 'Biggest partner' : 'Biggest category') + '</small>' + (top ? '<b style="color:' + (isIn ? scol[top] : colOf[top]) + '">' + P0(G[top]) + '</b><div class="s">' + esc(top) + '</div>' : '<b>—</b>') + '</div></div>';
      h += isIn ? card('Where it came from', 'All partners', srcs, c => scol[c] || '#2E9E6F', SRC, 'exS') : card('Where it went', 'All categories', cats, c => colOf[c] || '#8A86A0', X.c, 'exC'); }
    const vis = L.slice(0, X.n || 150); let lastD = '';
    const dayTot = {}; L.forEach(r => { const o = dayTot[r.d] || (dayTot[r.d] = { i: 0, o: 0 }); if(r.k === 'in') o.i += r.a; else o.o += r.a; });
    h += '<div class="e2-card"><div class="e2-lh"><h2>' + (K === 'in' ? 'Sales' : K === 'out' ? 'Expenses' : 'Sales and expenses') + ((K !== 'in' && X.c) ? ', ' + esc(X.c) : '') + ((K !== 'out' && SRC) ? ', ' + esc(SRC) : '') + '</h2><span class="grow"></span><input class="in-t" id="exQ" placeholder="Search student, invoice, description or amount" value="' + esc(X.q || '') + '" oninput="exQ(this.value)"></div>' +
      (vis.length ? vis.map(r => { const t0 = dayTot[r.d]; const dh = r.d !== lastD ? '<div class="e2-day"><span>' + esc(new Date(r.d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: X.m ? undefined : 'numeric' })) + '</span>' + (r.d > now ? '<span class="e2-tag">Scheduled</span>' : '') + '<span class="grow"></span>' + (t0.i ? '<b class="pos">+' + P0(t0.i) + '</b>' : '') + (t0.o ? '<b class="neg">−' + P0(t0.o) + '</b>' : '') + '</div>' : ''; lastD = r.d;
          if(r.k === 'in') return dh + '<div class="e2-r"><span class="ic in">₱</span><div class="d"><b>' + esc(r.t || 'Sale') + (r.inv ? ' <span class="small mute" style="font-weight:400">Invoice ' + esc(r.inv) + '</span>' : '') + '</b><span>' + esc([r.sub, r.c].filter(Boolean).join('. ')) + '</span></div><span class="a pos">+' + P(r.a) + '</span></div>';
          return dh + '<div class="e2-r ' + (r.q ? 'q' : '') + '"><span class="ic" style="background:' + (colOf[r.c] || '#8A86A0') + '22;color:' + (colOf[r.c] || '#8A86A0') + '">−</span><div class="d"><b>' + esc(r.t || '—') + '</b><span>' + esc(r.c) + (r.q ? '. Saving to the sheet…' : '') + '</span></div><span class="a neg">−' + P(r.a) + '</span></div>'; }).join('') : '<div class="empty">Nothing here.</div>') +
      (L.length > vis.length ? '<div style="text-align:center;margin:12px 0 2px"><button class="btn ghost sm" onclick="exMore()">Show ' + Math.min(150, L.length - vis.length) + ' more</button></div>' : '') + '</div>';
    v.innerHTML = h; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'expenses' && window.__exX) exPaint2(window.__exX); }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
