// 823: (Misty) "FOR FINANCE, PLEASE REDESIGN considering this score and comments" + brief "CupOfEnglish Finance UI/UX Refinement"
// Finance = three views: Overview · Payroll · Transactions (+ "Sales & costs", the MONEY sheet, kept as a quiet 4th tab).
// The sidebar's Finance opens Overview.
//
// OVERVIEW (new) — every figure comes from the MONEY tab (COE DATABASE), which already holds the checked formula:
//   costs = EXPENSES + net salaries (PAYROLL) + government dues (GOV); net = sales − costs. No new calculation is made here.
//   · One KPI strip: Sales received · Costs (expenses · salaries · gov dues) · Net · Margin, with ‹ month › (12 months).
//   · Compact 12-month trend (sales vs costs, net in the tooltip).
//   · Payroll: this month ACCRUED (not paid yet) vs last month's pay DISBURSED (paid x of y).
//   · Recent transactions (6) → View all.  · "Last synced" for each source (MONEY tab · database copy · PAY).
// TRANSACTIONS (was History) — one register for sales and expenses:
//   · Filters: All / Sales / Expenses · ‹ month › or All months · category / partner · search.
//   · Slim totals (sales, expenses, difference); scheduled (future-dated) lines kept out of the totals, as MONEY does.
//   · A note when the month's expenses include Government Contributions (Overview counts them under Gov dues), so totals reconcile.
//   · Compact table: Date · Name · Reference · Category · Amount; tap a row for the full record (package, payment method, RMB,
//     partner, description, source tab). + Sale · + Expense · Export CSV kept.
// Visual: brand purple #2f2752 for headings, teal #01b0bf for actions, green income, muted red expenses; tabular numerals,
// sans-serif for figures and tables, smaller gaps (~20%), one card radius.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["{ nav: 'payroll', label: 'Finance', views: [['payroll', 'Payroll'], ['money', 'Sales & costs'], ['expenses', 'History']] }",
   "{ nav: 'payroll', label: 'Finance', views: [['finov', 'Overview'], ['payroll', 'Payroll'], ['expenses', 'Transactions'], ['money', 'Sales & costs']] }"],
  ["const has = v => v === 'expenses' ||", "const has = v => v === 'expenses' || v === 'finov' ||"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 823 · Finance: Overview + Transactions */
(function(){
  if(window.__823 || typeof VIEWS === 'undefined') return; window.__823 = 1;
  const SANS = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
  document.head.insertAdjacentHTML('beforeend', '<style>' + [
    '.fx{--fp:#2f2752;--ft:#01b0bf;--fi:#2E7D5B;--fo:#B5533C;--fl:#E9E7F0;--fm:#7C7893;max-width:1100px;margin:0 auto}',
    '.fx .num,.fx table,.fx .fx-k b,.fx .fx-k small,.fx input,.fx select,.fx .fx-sub{font-family:' + SANS + ';font-variant-numeric:tabular-nums}',
    '.fx-h{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin:4px 0 12px}.fx-h h1{margin:0;font-size:26px;color:var(--fp)}.fx-h .grow{flex:1}',
    '.fx-sub{font-size:13px;color:var(--fm)}.fx-h .fx-sub{margin-left:4px}',
    '.fx .btn.sm{height:34px;padding:0 14px;font-size:13px}',
    '.fx-card{background:#fff;border:1px solid var(--fl);border-radius:14px;padding:14px 16px;margin-bottom:12px}',
    '.fx-card h2{margin:0;font-size:15px;color:var(--fp)}.fx-ch{display:flex;align-items:center;gap:8px;margin-bottom:10px}.fx-ch .grow{flex:1}.fx-ch a{font-size:13px;font-weight:700;color:#00808B;cursor:pointer}',
    '.fx-k{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));background:#fff;border:1px solid var(--fl);border-radius:14px;margin-bottom:12px;overflow:hidden}',
    '.fx-k>div{padding:12px 16px;border-left:1px solid var(--fl);min-width:0}.fx-k>div:first-child{border-left:0}',
    '.fx-k span{display:block;font-size:11.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--fm)}',
    '.fx-k b{display:block;font-size:22px;font-weight:700;color:var(--fp);margin-top:3px;white-space:nowrap}.fx-k small{display:block;font-size:12px;color:var(--fm);margin-top:2px;line-height:1.35}',
    '.fx .in{color:var(--fi)!important}.fx .out{color:var(--fo)!important}',
    '.fx-m{display:inline-flex;align-items:center;gap:2px;background:#fff;border:1px solid var(--fl);border-radius:10px;height:34px;padding:0 2px}',
    '.fx-m button{border:0;background:none;width:28px;height:28px;border-radius:8px;font-size:16px;cursor:pointer;color:var(--fp)}.fx-m button:hover:not(:disabled){background:#F3F2F8}.fx-m button:disabled{opacity:.3;cursor:default}',
    '.fx-m b{font-size:13.5px;min-width:86px;text-align:center;font-family:' + SANS + ';color:var(--fp)}',
    '.fx-seg{display:inline-flex;background:#F1F0F6;border-radius:10px;padding:2px;height:34px;box-sizing:border-box}.fx-seg button{border:0;background:none;padding:0 12px;border-radius:8px;font:inherit;font-size:13px;font-weight:700;color:var(--fm);cursor:pointer}',
    '.fx-seg button.on{background:#fff;color:var(--fp);box-shadow:0 1px 2px rgba(47,39,82,.12)}',
    '.fx-bar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:10px}.fx-bar .grow{flex:1}',
    '.fx-bar select,.fx-bar input{height:34px;border:1px solid var(--fl);border-radius:10px;background:#fff;padding:0 10px;font-size:13px;color:var(--fp);margin:0}.fx-bar input{min-width:200px;flex:1;max-width:320px}',
    '.fx-pill{border:1px solid var(--fl);background:#fff;border-radius:10px;height:34px;padding:0 12px;font:inherit;font-size:13px;font-weight:700;color:var(--fm);cursor:pointer}.fx-pill.on{background:var(--fp);color:#fff;border-color:var(--fp)}',
    '.fx-two{display:grid;grid-template-columns:minmax(0,1.5fr) minmax(0,1fr);gap:12px}.fx-two .fx-card{margin-bottom:12px}',
    '.fx-tr svg{display:block;width:100%;height:130px}.fx-tr .lg{display:flex;gap:12px;font-size:12px;color:var(--fm);font-family:' + SANS + '}.fx-tr .lg i{display:inline-block;width:14px;height:3px;border-radius:2px;margin-right:5px;vertical-align:3px}',
    '.fx-pr{display:grid;gap:10px}.fx-pr>div{border:1px solid var(--fl);border-radius:12px;padding:10px 12px}.fx-pr span{display:block;font-size:11.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--fm)}',
    '.fx-pr b{display:block;font-family:' + SANS + ';font-size:19px;color:var(--fp);margin-top:2px;font-variant-numeric:tabular-nums}.fx-pr small{font-family:' + SANS + ';font-size:12px;color:var(--fm)}',
    '.fx-tag{display:inline-block;font-family:' + SANS + ';font-size:11px;font-weight:700;border-radius:999px;padding:1px 8px;vertical-align:1px}.fx-tag.ok{background:#E8F4EE;color:var(--fi)}.fx-tag.ac{background:#FFF5E6;color:#97600F}.fx-tag.mu{background:#F1F0F6;color:#5E5A75}',
    '.fx table{width:100%;border-collapse:collapse;font-size:13.5px}',
    '.fx th{font-size:11px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:var(--fm);text-align:left;padding:8px 10px;border-bottom:1px solid var(--fl);white-space:nowrap}.fx th.r,.fx td.r{text-align:right}',
    '.fx td{padding:9px 10px;border-bottom:1px solid #F3F2F7;color:#2A2540;vertical-align:middle}.fx tbody tr.rw{cursor:pointer}.fx tbody tr.rw:hover td{background:#FAFAFD}',
    '.fx td.d{white-space:nowrap;color:var(--fm);width:1%}.fx td.n b{font-weight:600}.fx td.n .m{display:none;font-size:12px;color:var(--fm)}.fx td.ref{color:var(--fm);white-space:nowrap}.fx td.c{color:#5E5A75}',
    '.fx td.a{font-weight:700;white-space:nowrap;width:1%}.fx tr.q td{opacity:.6}.fx tr.op td{background:#FAFAFD}',
    '.fx tr.dt td{background:#FAFAFD;padding:2px 10px 12px}.fx .dl{display:grid;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));gap:8px 18px;font-family:' + SANS + ';font-size:13px}.fx .dl span{display:block;font-size:11px;color:var(--fm);text-transform:uppercase;letter-spacing:.04em}',
    '.fx-note{font-family:' + SANS + ';font-size:12.5px;color:var(--fm);margin:-2px 2px 10px}',
    '.fx-sync{font-family:' + SANS + ';font-size:12px;color:var(--fm);display:flex;gap:6px 16px;flex-wrap:wrap;margin:4px 2px 0}',
    '.fx .more{display:block;margin:10px auto 0}',
    '.grp-tabs[data-g=payroll] button:nth-child(4){margin-left:auto;opacity:.75;font-weight:600}',
    '@media(max-width:900px){.fx-k{grid-template-columns:1fr 1fr!important}.fx-k>div:nth-child(3){border-left:0}.fx-k>div:nth-child(n+3){border-top:1px solid var(--fl)}.fx-two{grid-template-columns:1fr}}',
    '@media(max-width:640px){.fx-h h1{font-size:22px}.fx-k b{font-size:18px}.fx th.ref,.fx td.ref,.fx th.c,.fx td.c{display:none}.fx td.n .m{display:block}.fx-bar input{max-width:none;min-width:0;width:100%}.fx-card{padding:12px}}'].join('') + '</style>');

  const SC = () => typeof isPres === 'function' ? isPres() : true;
  const P0 = n => (n < 0 ? '−' : '') + '₱' + Math.round(Math.abs(n || 0)).toLocaleString('en-US');
  const P2 = n => (n < 0 ? '−' : '') + '₱' + Math.abs(Number(n || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const N = v => { const n = parseFloat(String(v == null ? '' : v).replace(/[^\d.\-]/g, '')); return isNaN(n) ? 0 : n; };
  const today = () => new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10), ym = d => String(d || '').slice(0, 7);
  const addM = (m, k) => { const d = new Date(Date.parse(m + '-15T12:00:00Z')); d.setUTCMonth(d.getUTCMonth() + k); return d.toISOString().slice(0, 7); };
  const mL = (m, s) => new Date(m + '-15T12:00:00').toLocaleDateString('en-GB', s ? { month: 'short' } : { month: 'long', year: 'numeric' });
  const dL = d => new Date(d + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  const MON = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
  const mKey = t => { const m = String(t || '').match(/([A-Za-z]{3})[a-z]*\s+(\d{4})/); return m ? m[2] + '-' + MON[m[1].toLowerCase()] : ''; };

  // ── shared data: sales + expenses (database copy) ──
  const F = { rows: null, sales: null, at: null, busy: 0 };
  try{ const k = JSON.parse(localStorage.getItem('coe.exp') || 'null'); if(k && k.rows){ F.rows = k.rows; F.sales = k.sales || []; F.at = k.at; } }catch(e){}
  async function loadF(){ if(F.busy || typeof TOKEN === 'undefined' || !TOKEN) return; F.busy = 1;
    try{ const r = await fetch(FAST_URL + '-expenses', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: TOKEN }) }).then(x => x.json());
      if(r && r.ok){ F.rows = r.rows; F.sales = r.sales || []; F.at = r.at; try{ localStorage.setItem('coe.exp', JSON.stringify({ rows: r.rows, sales: r.sales || [], at: r.at })); }catch(e){} if(VIEW === 'finov') paintOv(); } }catch(e){} F.busy = 0; }
  const pkg = r => { const n = Number(r.pkg) || 0, f = Number(r.free) || 0; return n ? n + (f ? ' + ' + f : '') + ' lessons' : ''; };
  function txAll(src){ const E = ((src || F).rows || []).map(r => ({ k: 'out', d: r.d, t: r.t || '—', c: r.c || 'Other', a: r.a, q: r.q, ref: '' }));
    const S = ((src || F).sales || []).map(r => ({ k: 'in', d: r.d, t: r.t || 'Sale', c: r.src || 'Direct', a: r.a, ref: r.inv ? '#' + r.inv : '', pkg: pkg(r), pay: r.pay, rmb: r.rmb }));
    return E.concat(S).sort((a, b) => b.d.localeCompare(a.d) || (a.k === 'in' ? -1 : 1)); }
  const syncAt = at => at ? new Date(at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false }) : '—';

  // ── MONEY tab (validated monthly figures) ──
  function money(){ if(typeof MN === 'undefined' || !MN || !MN.rows) return null; const R = MN.rows.map(r => (r || []).map(x => String(x == null ? '' : x).trim()));
    const h = R.findIndex(r => /^MONTH$/i.test(r[0]) && /SALES/i.test(r[1]) && /EXPENSES/i.test(r[2])); if(h < 0) return null;
    const H = R[h].map(x => x.toUpperCase()), c = k => H.indexOf(k), L = [];
    for(let k = h + 1; k < R.length && R[k][0]; k++){ const r = R[k], m = mKey(r[0]); if(!m) break;
      L.push({ m, sales: N(r[c('SALES')]), exp: N(r[c('EXPENSES')]), sal: N(r[c('SALARIES')]), gov: N(r[c('GOV DUES')]), cost: N(r[c('TOTAL COSTS')]), net: N(r[c('NET')]), mg: r[c('MARGIN')] || '', note: r[8] || '' }); }
    let pays = {}; const sh = R.findIndex(r => /^SALES$/i.test(r[1]) && /PAYMENTS/i.test(r.join('|')));
    if(sh > -1){ const ip = R[sh].findIndex(x => /PAYMENTS/i.test(x)); for(let k = sh + 1; k < sh + 4 && R[k]; k++){ const t = R[k][0]; const mk = /so far/i.test(t) ? ym(today()) : mKey(t); if(mk) pays[mk] = R[k][ip]; } }
    const u = (R[1] && R[1][0] || '').match(/Updated\s+([A-Za-z]{3} \d{1,2})(?:, \d{4})?\s+·\s+(\d{1,2}:\d{2})/);
    return { L, pays, upd: u ? u[1] + ', ' + u[2] : '' }; }

  // ── OVERVIEW ──
  try{ if(VIEWS.indexOf('finov') < 0) VIEWS.push('finov'); if(!$('v-finov')){ const d = document.createElement('div'); d.id = 'v-finov'; d.className = 'hide'; const ref = $('v-payroll'); ref.parentNode.insertBefore(d, ref); } }catch(e){}
  let OM = '';
  window.fxOvM = k => { const M = money(); if(!M) return; const ms = M.L.map(x => x.m), j = ms.indexOf(OM || ms[0]) - k; if(j >= 0 && j < ms.length){ OM = ms[j]; paintOv(); } };
  function trend(L){ const P = L.slice(0, 12).reverse(); if(P.length < 2) return '';
    const W = 600, H = 130, pl = 6, pr = 6, pt = 10, pb = 22, mx = Math.max(1, ...P.map(x => Math.max(x.sales, x.cost))) * 1.08, X = j => pl + j * (W - pl - pr) / (P.length - 1), Y = v => pt + (H - pt - pb) * (1 - v / mx);
    const path = k => P.map((x, j) => (j ? 'L' : 'M') + X(j).toFixed(1) + ' ' + Y(x[k]).toFixed(1)).join(' ');
    const grid = [0.5, 1].map(f => '<line x1="0" x2="' + W + '" y1="' + Y(mx / 1.08 * f).toFixed(1) + '" y2="' + Y(mx / 1.08 * f).toFixed(1) + '" stroke="#EFEEF4" stroke-dasharray="3 4"/>').join('');
    const sel = P.findIndex(x => x.m === OM);
    return '<svg viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" role="img" aria-label="Sales and costs, last 12 months">' + grid +
      (sel > -1 ? '<rect x="' + (X(sel) - 14).toFixed(1) + '" y="' + pt + '" width="28" height="' + (H - pt - pb) + '" rx="6" fill="#F3F2F8"/>' : '') +
      '<path d="' + path('cost') + '" fill="none" stroke="#D08A78" stroke-width="2" vector-effect="non-scaling-stroke"/><path d="' + path('sales') + '" fill="none" stroke="#2E7D5B" stroke-width="2.2" vector-effect="non-scaling-stroke"/>' +
      P.map((x, j) => '<g style="cursor:pointer" onclick="fxOvGo(\'' + x.m + '\')"><title>' + mL(x.m) + ' · sales ' + P0(x.sales) + ' · costs ' + P0(x.cost) + ' · net ' + P0(x.net) + (x.mg ? ' (' + x.mg + ')' : '') + '</title><rect x="' + (X(j) - 14).toFixed(1) + '" y="0" width="28" height="' + H + '" fill="transparent"/>' +
        '<circle cx="' + X(j).toFixed(1) + '" cy="' + Y(x.sales).toFixed(1) + '" r="2.6" fill="#2E7D5B"/><circle cx="' + X(j).toFixed(1) + '" cy="' + Y(x.cost).toFixed(1) + '" r="2.3" fill="#D08A78"/>' +
        '<text x="' + X(j).toFixed(1) + '" y="' + (H - 6) + '" text-anchor="' + (j === 0 ? 'start' : j === P.length - 1 ? 'end' : 'middle') + '" font-size="10.5" fill="' + (x.m === OM ? '#2f2752' : '#9A96AE') + '" font-weight="' + (x.m === OM ? '700' : '400') + '" font-family="' + SANS.replace(/"/g, '') + '">' + mL(x.m, 1) + '</text></g>').join('') + '</svg>'; }
  window.fxOvGo = m => { OM = m; paintOv(); };
  function paintOv(){ const v = $('v-finov'); if(!v) return; const M = money(), mo = (typeof MO !== 'undefined' && MO) || {}, P = mo.payroll || [];
    const head = '<div class="fx-h"><h1>Finance</h1><span class="fx-sub">' + (OM ? mL(OM) + (OM === ym(today()) ? ' · month to date' : '') : '') + '</span><span class="grow"></span>' +
      (typeof saleSheet === 'function' ? '<button class="btn teal sm" onclick="saleSheet()">+ Sale</button>' : '') + (typeof expSheet === 'function' ? '<button class="btn ghost sm" onclick="expSheet()">+ Expense</button>' : '') + '</div>';
    if(!SC()){ v.innerHTML = '<div class="fx">' + head + '<div class="fx-card">Sales, costs and net are for the President. Payroll and Transactions are in the tabs above.</div></div>'; return; }
    if(!M || !M.L.length){ v.innerHTML = '<div class="fx">' + head + '<div class="sk"></div><div class="sk"></div></div>'; return; }
    if(!OM || !M.L.some(x => x.m === OM)) OM = M.L[0].m;
    const j = M.L.findIndex(x => x.m === OM), x = M.L[j], pv = M.L[j + 1], run = OM === ym(today());
    const vs = (a, b) => b ? '<span class="' + (a >= b ? 'in' : 'out') + '">' + (a >= b ? '▲ ' : '▼ ') + Math.abs(Math.round((a - b) / Math.abs(b) * 100)) + '%</span> vs ' + mL(pv.m, 1) : '';
    let h = head + '<div class="fx-bar"><div class="fx-m"><button onclick="fxOvM(-1)" ' + (j >= M.L.length - 1 ? 'disabled' : '') + '>‹</button><b>' + mL(OM, 1) + ' ' + OM.slice(0, 4) + '</b><button onclick="fxOvM(1)" ' + (j <= 0 ? 'disabled' : '') + '>›</button></div><span class="fx-sub">' + (run ? 'Month to date · salaries and dues are accrued, paid after month end' : 'Full month') + '</span></div>';
    h += '<div class="fx-k"><div><span>Sales received</span><b class="in">' + P0(x.sales) + '</b><small>' + (M.pays[OM] ? M.pays[OM] + ' payments · ' : '') + (pv ? vs(x.sales, pv.sales) : '') + '</small></div>' +
      '<div><span>Costs</span><b class="out">' + P0(x.cost) + '</b><small>Expenses ' + P0(x.exp) + ' · Salaries ' + P0(x.sal) + (run ? ' (accrued)' : '') + ' · Gov dues ' + P0(x.gov) + '</small></div>' +
      '<div><span>Net' + (run ? ' so far' : '') + '</span><b class="' + (x.net >= 0 ? 'in' : 'out') + '">' + P0(x.net) + '</b><small>Sales − costs' + (pv ? ' · ' + mL(pv.m, 1) + ' ' + P0(pv.net) : '') + '</small></div>' +
      '<div><span>Margin</span><b>' + esc(x.mg || '—') + '</b><small>Net ÷ sales' + (pv && pv.mg ? ' · ' + mL(pv.m, 1) + ' ' + esc(pv.mg) : '') + '</small></div></div>';
    const paidN = P.filter(p => p.paid).length, pTot = P.reduce((a, p) => a + (+p.net || 0), 0), pPaid = P.filter(p => p.paid).reduce((a, p) => a + (+p.net || 0), 0);
    h += '<div class="fx-two"><div class="fx-card fx-tr"><div class="fx-ch"><h2>Sales and costs</h2><span class="fx-sub">last 12 months · tap a month</span><span class="grow"></span><span class="lg"><span><i style="background:#2E7D5B"></i>Sales</span><span><i style="background:#D08A78"></i>Costs</span></span></div>' + trend(M.L) + '</div>' +
      '<div class="fx-card"><div class="fx-ch"><h2>Payroll</h2><span class="grow"></span><a onclick="go(\'payroll\')">Open payroll ›</a></div><div class="fx-pr">' +
        '<div><span>' + mL(OM, 1) + ' salaries · ' + (run ? 'accrued' : 'recorded') + '</span><b>' + P0(x.sal) + '</b><small>' + (run ? '<span class="fx-tag ac">Not paid yet</span> paid after month end' : 'net salaries in PAYROLL for ' + mL(OM)) + '</small></div>' +
        (P.length ? '<div><span>' + esc(mo.payMonth || 'Last') + ' pay · disbursed</span><b>' + P2(pPaid) + '</b><small>' + (paidN === P.length ? '<span class="fx-tag ok">✓ All ' + P.length + ' paid</span>' : '<span class="fx-tag ac">' + paidN + ' of ' + P.length + ' paid</span> ' + P2(pTot - pPaid) + ' still to pay') + '</small></div>' : '') +
      '</div></div></div>';
    const T = F.rows ? txAll().filter(r => r.d <= today()).slice(0, 6) : null;
    h += '<div class="fx-card"><div class="fx-ch"><h2>Recent transactions</h2><span class="grow"></span><a onclick="go(\'expenses\')">View all ›</a></div>' + (T ? '<table><tbody>' + T.map(r => '<tr class="rw" onclick="go(\'expenses\')"><td class="d">' + dL(r.d) + '</td><td class="n"><b>' + esc(r.t) + '</b><span class="m">' + esc(r.c) + '</span></td><td class="ref">' + esc(r.ref) + '</td><td class="c">' + esc(r.c) + '</td><td class="a r ' + r.k + '">' + (r.k === 'in' ? '+' : '−') + P2(r.a) + '</td></tr>').join('') + '</tbody></table>' : '<div class="sk"></div>') + '</div>';
    h += '<div class="fx-sync"><span>Sales, costs, net: MONEY tab' + (M.upd ? ', updated ' + esc(M.upd) : '') + '</span><span>Transactions: database copy ' + syncAt(F.at) + '</span><span>Payroll: PAY tab</span></div>';
    v.innerHTML = '<div class="fx">' + h + '</div>'; }
  async function openOv(){ paintOv(); loadF(); try{ if(SC() && typeof loadMoney === 'function'){ const p = loadMoney(true); if(p && p.then) p.then(() => { if(VIEW === 'finov') paintOv(); }, () => {}); } }catch(e){} setTimeout(() => { if(VIEW === 'finov') paintOv(); }, 2500); }
  const _go = window.go; window.go = function(v){ const r = _go.apply(this, arguments); try{ if(v === 'finov') openOv(); }catch(e){} return r; };
  // the sidebar's Finance opens Overview
  function navFix(){ document.querySelectorAll('nav button[data-v="payroll"]').forEach(b => { if(b._f823) return; b._f823 = 1; b.onclick = e => { e.preventDefault(); e.stopPropagation(); go('finov'); }; }); }
  const _bn = window.buildNav; if(typeof _bn === 'function') window.buildNav = function(){ const r = _bn.apply(this, arguments); try{ navFix(); }catch(e){} return r; };
  setTimeout(navFix, 3000); setTimeout(navFix, 9000);

  // ── TRANSACTIONS (replaces 818's History drawing) ──
  let K = 'all', CAT = '', OPEN = '', ALLM = false;
  try{ K = localStorage.getItem('coe.hist.k') || 'all'; }catch(e){}
  const rp = () => { if(window.__exX) window.exPaint2(window.__exX); };
  window.fxK = k => { K = k; CAT = ''; try{ localStorage.setItem('coe.hist.k', k); }catch(e){} rp(); };
  window.fxStep = k => { const X = window.__exX; if(!X) return; ALLM = false; X.m = addM(X.m || ym(today()), k); X.n = 150; rp(); };
  window.fxAll = () => { const X = window.__exX; if(!X) return; ALLM = !ALLM; X.m = ALLM ? '' : ym(today()); X.n = 150; rp(); };
  window.fxCat = v => { CAT = v; const X = window.__exX; if(X) X.n = 150; rp(); };
  window.fxOpen = k => { OPEN = OPEN === k ? '' : k; rp(); };
  window.exM = m => { const X = window.__exX; if(!X) return; ALLM = !m; X.m = m; X.n = 150; rp(); };
  window.exCsv = () => { const L = window.__fxList || [], q = x => '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"';
    const csv = 'Date,Type,Name,Reference,Category or partner,Details,Amount (PHP)\n' + L.map(r => [r.d, r.k === 'in' ? 'Sale' : 'Expense', q(r.t), q(r.ref), q(r.c), q([r.pkg, r.pay, r.rmb ? 'RMB ' + r.rmb : ''].filter(Boolean).join('; ')), (r.k === 'in' ? '' : '-') + r.a].join(',')).join('\n');
    const X = window.__exX || {}, a = document.createElement('a'); a.href = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv' })); a.download = 'CupOfEnglish-transactions-' + (X.m || 'all') + '.csv'; document.body.appendChild(a); a.click(); a.remove(); };
  window.exPaint2 = function(X){ window.__exX = X; const v = $('v-expenses'); if(!v) return;
    if(ALLM) X.m = ''; else if(!X.m) X.m = ym(today());
    const now = today(), cur = ym(now);
    const head = '<div class="fx-h"><h1>Transactions</h1><span class="fx-sub">Sales and expenses · database copy ' + syncAt(X.at) + '</span><span class="grow"></span>' +
      (typeof saleSheet === 'function' ? '<button class="btn teal sm" onclick="saleSheet()">+ Sale</button>' : '') + (typeof expSheet === 'function' ? '<button class="btn ghost sm" onclick="expSheet()">+ Expense</button>' : '') + '<button class="btn ghost sm" onclick="exCsv()">Export CSV</button></div>';
    if(!X.rows){ v.innerHTML = '<div class="fx">' + head + '<div class="sk"></div><div class="sk"></div></div>'; return; }
    const A = txAll(X), inP = r => !X.m || ym(r.d) === X.m, P = A.filter(inP);
    const cats = {}; P.forEach(r => { if(K !== 'all' && r.k !== K) return; const key = r.k + ':' + r.c; cats[key] = (cats[key] || 0) + r.a; });
    if(CAT && !cats[CAT]) CAT = '';
    const q = (X.q || '').trim().toLowerCase(), qok = r => !q || [r.t, r.c, r.ref, r.pkg, r.pay, r.a, r.d].join(' ').toLowerCase().indexOf(q) > -1;
    const L = P.filter(r => (K === 'all' || r.k === K) && (!CAT || r.k + ':' + r.c === CAT) && qok(r)); window.__fxList = L;
    const done = L.filter(r => r.d <= now), sch = L.length - done.length, tin = done.filter(r => r.k === 'in').reduce((a, r) => a + r.a, 0), tout = done.filter(r => r.k === 'out').reduce((a, r) => a + r.a, 0);
    const nin = done.filter(r => r.k === 'in').length, nout = done.filter(r => r.k === 'out').length;
    const opt = k => Object.keys(cats).filter(c => c.indexOf(k + ':') === 0).sort((a, b) => cats[b] - cats[a]).map(c => '<option value="' + esc(c) + '"' + (CAT === c ? ' selected' : '') + '>' + esc(c.slice(k.length + 1)) + ' · ' + P0(cats[c]) + '</option>').join('');
    let h = head + '<div class="fx-bar"><div class="fx-seg">' + [['all', 'All'], ['in', 'Sales'], ['out', 'Expenses']].map(([k, l]) => '<button class="' + (K === k ? 'on' : '') + '" onclick="fxK(\'' + k + '\')">' + l + '</button>').join('') + '</div>' +
      '<div class="fx-m"><button onclick="fxStep(-1)" ' + (ALLM ? 'disabled' : '') + '>‹</button><b>' + (X.m ? mL(X.m, 1) + ' ' + X.m.slice(0, 4) : 'All months') + '</b><button onclick="fxStep(1)" ' + (ALLM || X.m >= cur ? 'disabled' : '') + '>›</button></div>' +
      '<button class="fx-pill ' + (ALLM ? 'on' : '') + '" onclick="fxAll()">All months</button>' +
      '<select onchange="fxCat(this.value)" aria-label="Category or partner"><option value="">' + (K === 'in' ? 'All partners' : K === 'out' ? 'All categories' : 'All categories and partners') + '</option>' + (K !== 'out' ? (K === 'all' ? '<optgroup label="Sales · partner">' + opt('in') + '</optgroup>' : opt('in')) : '') + (K !== 'in' ? (K === 'all' ? '<optgroup label="Expenses · category">' + opt('out') + '</optgroup>' : opt('out')) : '') + '</select>' +
      '<input id="exQ" placeholder="Search name, invoice, category, amount" value="' + esc(X.q || '') + '" oninput="exQ(this.value)"></div>';
    const kc = K === 'all' ? 4 : 2; h += '<div class="fx-k" style="grid-template-columns:repeat(' + kc + ',minmax(0,1fr))">' + (K !== 'out' ? '<div><span>Sales</span><b class="in">' + P0(tin) + '</b><small>' + nin + ' payment' + (nin === 1 ? '' : 's') + '</small></div>' : '') +
      (K !== 'in' ? '<div><span>Expenses</span><b class="out">' + P0(tout) + '</b><small>' + nout + ' line' + (nout === 1 ? '' : 's') + '</small></div>' : '') +
      (K === 'all' ? '<div><span>Difference</span><b class="' + (tin - tout >= 0 ? 'in' : 'out') + '">' + P0(tin - tout) + '</b><small>sales − these expenses (salaries are on Payroll)</small></div>' : '') +
      '<div><span>Lines shown</span><b>' + L.length + '</b><small>' + (sch ? sch + ' scheduled (future date, not in totals)' : (X.m ? mL(X.m) : 'all months')) + '</small></div></div>';
    const gov = K !== 'in' && !CAT ? done.filter(r => r.k === 'out' && /government contrib/i.test(r.c)).reduce((a, r) => a + r.a, 0) : 0;
    if(gov) h += '<div class="fx-note">Expenses here include ' + P0(gov) + ' Government Contributions; Overview (MONEY tab) counts these under Gov dues, so its Expenses figure is ' + P0(tout - gov) + '.</div>';
    const vis = L.slice(0, X.n || 150);
    h += '<div class="fx-card" style="padding:4px 6px 8px"><table><thead><tr><th>Date</th><th>Name</th><th class="ref">Reference</th><th class="c">' + (K === 'in' ? 'Partner' : K === 'out' ? 'Category' : 'Category / partner') + '</th><th class="r">Amount</th></tr></thead><tbody>' +
      (vis.length ? vis.map((r, j) => { const key = r.k + '|' + r.d + '|' + r.t + '|' + r.a + '|' + j, op = OPEN === key, fut = r.d > now;
        const row = '<tr class="rw ' + (r.q ? 'q ' : '') + (op ? 'op' : '') + '" onclick="fxOpen(\'' + esc(key).replace(/'/g, '&#39;') + '\')"><td class="d">' + dL(r.d) + (X.m ? '' : ' ' + r.d.slice(0, 4)) + '</td><td class="n"><b>' + esc(r.t) + '</b>' + (fut ? ' <span class="fx-tag ac">Scheduled</span>' : '') + (r.q ? ' <span class="fx-tag mu">Saving…</span>' : '') + '<span class="m">' + esc(r.c) + (r.ref ? ' · ' + esc(r.ref) : '') + '</span></td><td class="ref">' + esc(r.ref || '—') + '</td><td class="c">' + esc(r.c) + '</td><td class="a r ' + r.k + '">' + (r.k === 'in' ? '+' : '−') + P2(r.a) + '</td></tr>';
        if(!op) return row;
        const it = (l, x) => x ? '<div><span>' + l + '</span>' + esc(x) + '</div>' : '';
        return row + '<tr class="dt"><td colspan="5"><div class="dl">' + (r.k === 'in' ? it('Type', 'Sale (money received)') + it('Student', r.t) + it('Invoice', r.ref) + it('Package', r.pkg) + it('Payment method', r.pay) + it('RMB', r.rmb ? '¥' + Number(r.rmb).toLocaleString('en-US') : '') + it('Partner', r.c) + it('Amount (PHP)', P2(r.a)) + it('Record', 'COE DATABASE › SALES')
          : it('Type', 'Expense (paid)') + it('Description', r.t) + it('Category', r.c) + it('Date', new Date(r.d + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })) + it('Amount (PHP)', P2(r.a)) + it('Record', r.q ? 'Saving to COE DATABASE › EXPENSES' : 'COE DATABASE › EXPENSES')) + '</div></td></tr>'; }).join('') : '<tr><td colspan="5" class="fx-sub" style="text-align:center;padding:22px">Nothing matches.</td></tr>') + '</tbody></table>' +
      (L.length > vis.length ? '<button class="btn ghost sm more" onclick="exMore()">Show ' + Math.min(150, L.length - vis.length) + ' more</button>' : '') + '</div>';
    v.innerHTML = '<div class="fx">' + h + '</div>'; };
  try{ if(VIEW === 'expenses' && window.__exX) exPaint2(window.__exX); if(VIEW === 'finov') openOv(); }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
