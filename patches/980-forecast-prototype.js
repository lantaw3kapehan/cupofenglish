// 980: PROTOTYPE · NOT FOR RELEASE (task FC, 25 Oct 2026; Misty 15:08) — Finance › Forecast, for Misty's review.
// Adds a "Forecast" tab to the Finance tab bar (view `forecast`, President only, same isPres() rule as Wallets).
// Two sub-views:
//   · Monthly — sales, costs and expected net for the current month + 5 months ahead (3 past months for comparison) with the
//     MONEY tab definitions (costs = EXPENSES + net salaries (PAYROLL, accrued by work month) + GOV dues; PHP = RMB × 7).
//     Every line carries a tag: Actual / Committed / Estimated / Manual. Estimates show the expected figure + the
//     conservative–optimistic range; a small chart shows the range band per month.
//   · 13-week cash — weekly rows, yuan wallets (Alipay / WeChat / CCB, from coe-wallet `get`) and peso bank (manual) kept apart:
//     confirmed collections, expected renewals & new packages (separate line, range), remittances CNY→PHP with rate and fee,
//     payroll (accrued vs to be paid on pay day), operating payments, gov dues, closing balances; an "incomplete" banner lists
//     every missing input. A missing balance is never treated as zero.
//   · Assumptions panel — editable, kept apart from the records, with the source and date of each measured default.
//     PROTOTYPE STORE: this device's localStorage (key coe.fc980) only. Nothing is sent to the server. Proposed real store:
//     coe_fc_assump / coe_fc_items / coe_fc_snap behind a President-only coe-forecast function (see FORECAST-PROPOSAL.md (g)).
//   · "What changed" — differences from the last build seen on this device + corrections made to the 25 Oct proposal.
// Data: only what the app already reads — MONEY tab (MN via loadMoney), PAYROLL (PL via loadPayLedger), coe-expenses rows and
// sales (same read as Finance › Overview / Transactions), coe-wallet `get`, and the Schedule's day reads (schedGet) for the rest
// of the month. No new endpoint, no write: the page never calls api() with a save, never calls coe-wallet `add`.
// The existing "expected net" tiles (renderMoney, Home month()) and every accounting calculation are NOT touched.
// Engine exposed as window.fc980 (build, defaults, parse helpers) for testing.
const lib = require('../tools/lib.js'), fs = require('fs'), file = process.argv[2];
lib(file, [
  ["['money', 'Sales & costs'], ['wallets', 'Wallets']] }];",
   "['money', 'Sales & costs'], ['forecast', 'Forecast'], ['wallets', 'Wallets']] }];"],
  ["(v === 'wallets' && typeof isPres === 'function' && isPres()) ||",
   "(v === 'wallets' && typeof isPres === 'function' && isPres()) || (v === 'forecast' && typeof isPres === 'function' && isPres()) ||"]
]);
let s = fs.readFileSync(file, 'utf8');
const i = s.lastIndexOf('</body>');
s = s.slice(0, i) + String.raw`<script>
/* 980 · Finance › Forecast — PROTOTYPE, read-only, assumptions on this device only */
(function(){
  if(window.__980) return; window.__980 = 1;
  var F = 'var(--ui-font,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif)';
  var css = [
    '#v-forecast .fx{max-width:1100px}',
    '#v-forecast .fx-h h1{font-family:var(--ui-brand,"Fredoka One",sans-serif);font-weight:400;font-size:var(--fs-h1,26px);color:var(--ui-ink,#2f2752);margin:0;line-height:1.25}',
    '#v-forecast,#v-forecast input,#v-forecast select,#v-forecast button,#v-forecast table{font-family:' + F + '}',
    '#v-forecast .fx-sub,#v-forecast .fc-s{font-size:var(--fs-small,13px);color:var(--ui-mute,#6B6782)}',
    '#v-forecast .fx-card h2{font-size:var(--fs-h2,16px);font-weight:700;color:var(--ui-ink,#2f2752);margin:0}',
    '#v-forecast .fx-card{border-radius:var(--ui-r,14px);box-shadow:none}',
    '#v-forecast .fx-k span{font-size:var(--fs-label,12px)}#v-forecast .fx-k b{font-size:var(--fs-kpi,22px);font-variant-numeric:tabular-nums}#v-forecast .fx-k small{font-size:var(--fs-small,13px)}',
    '#v-forecast .fx-seg button{font-size:var(--fs-small,13px)}',
    '.fc-proto{display:flex;gap:8px;align-items:flex-start;background:#F3F2F8;border:1px solid var(--ui-line,#E9E7F0);border-radius:12px;padding:10px 12px;margin:0 0 12px;font-size:var(--fs-small,13px);color:#3D3857;line-height:1.45}',
    '.fc-proto b{color:var(--ui-ink,#2f2752)}',
    '.fc-inc{background:var(--ui-ac-b,#FFF5E6);border:1px solid #F1DDBA;border-radius:12px;padding:10px 14px;margin:0 0 12px;font-size:var(--fs-small,13px);color:#5B3D08;line-height:1.5}',
    '.fc-inc b{color:#7A4E0B}.fc-inc ul{margin:4px 0 0;padding-left:18px}.fc-inc li{margin:1px 0}',
    '.fc-tg{display:inline-block;font-size:var(--fs-label,12px);font-weight:700;line-height:1.5;border-radius:999px;padding:0 7px;white-space:nowrap;vertical-align:1px}',
    '.fc-tg.A{background:#E8F4EE;color:#256B4C}.fc-tg.C{background:#E6F0FA;color:#22558C}.fc-tg.E{background:#FFF5E6;color:#87560D}.fc-tg.M{background:#F1F0F6;color:#4F4A68}.fc-tg.X{background:#FBEDEA;color:#9A4330}',
    '.fc-t{width:100%;border-collapse:collapse;font-size:var(--fs-table,15px);font-variant-numeric:tabular-nums}',
    '.fc-t th{font-size:var(--fs-label,12px);font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--ui-mute,#6B6782);text-align:right;padding:8px 8px;border-bottom:1px solid var(--ui-line,#E9E7F0);white-space:nowrap;vertical-align:bottom}',
    '.fc-t th:first-child,.fc-t td:first-child{text-align:left}',
    '.fc-t td{padding:7px 8px;border-bottom:1px solid #F3F2F7;text-align:right;white-space:nowrap;color:#2A2540;vertical-align:top}',
    '.fc-t td:first-child{white-space:normal;min-width:150px}',
    '.fc-t td small{display:block;font-size:var(--fs-label,12px);color:var(--ui-mute,#6B6782);font-weight:400;line-height:1.35}',
    '.fc-t tr.sub td:first-child{padding-left:20px;color:#4F4A68}.fc-t tr.tot td{font-weight:700;border-top:1px solid var(--ui-line,#E9E7F0)}',
    '.fc-t tr.net td{font-weight:700;background:#FAFAFD}.fc-t .past{color:#7C7893;background:#FCFCFE}.fc-t th.past{background:#FCFCFE}.fc-t .cur{background:#F7FBFC}',
    '.fc-t .in{color:var(--ui-in,#2E7D5B)}.fc-t .out{color:var(--ui-out,#B5533C)}.fc-t .na{color:#97600F;font-weight:700}',
    '.fc-sc{overflow-x:auto;-webkit-overflow-scrolling:touch;margin:0 -4px;padding:0 4px}',
    '.fc-t tr.wk{cursor:pointer}.fc-t tr.wk:hover td{background:#FAFAFD}.fc-t tr.wk:focus-visible{outline:2px solid var(--ui-teal,#01b0bf);outline-offset:-2px}',
    '.fc-t tr.det td{background:#FAFAFD;text-align:left;white-space:normal;padding:4px 10px 12px}',
    '.fc-it{display:grid;grid-template-columns:auto 1fr auto;gap:2px 12px;font-size:var(--fs-small,13px);align-items:baseline}.fc-it .r{text-align:right;white-space:nowrap}',
    '.fc-leg{display:flex;gap:6px 14px;flex-wrap:wrap;font-size:var(--fs-small,13px);color:var(--ui-mute,#6B6782);margin:8px 2px 0}',
    '.fc-two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:12px}',
    '.fc-as{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px 18px}',
    '.fc-f label{display:block;font-size:var(--fs-small,13px);font-weight:700;color:var(--ui-ink,#2f2752);margin-bottom:3px}',
    '.fc-f .row3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px}.fc-f .row2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px}',
    '.fc-f input,.fc-f select{width:100%;box-sizing:border-box;height:var(--ui-ctl,36px);border:1px solid var(--ui-line,#E9E7F0);border-radius:10px;padding:0 8px;font-size:var(--fs-table,15px);color:var(--ui-ink,#2f2752);background:#fff;margin:0}',
    '.fc-f .hint{font-size:var(--fs-label,12px);color:var(--ui-mute,#6B6782);margin-top:3px;line-height:1.4}',
    '.fc-f .sl{font-size:var(--fs-label,12px);color:var(--ui-mute,#6B6782)}',
    '.fc-mi{display:grid;grid-template-columns:120px 80px 90px 1fr 110px 44px;gap:6px;align-items:center;margin-bottom:6px}',
    '.fc-mi button,.fc-x{height:var(--ui-ctl,36px);min-width:36px;border:1px solid var(--ui-line,#E9E7F0);background:#fff;border-radius:10px;cursor:pointer;color:var(--ui-out,#B5533C);font-weight:700}',
    '.fc-acts{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;align-items:center}',
    '.fc-ch ul{margin:6px 0 0;padding-left:18px;font-size:var(--fs-small,13px);line-height:1.5;color:#3D3857}.fc-ch li{margin:2px 0}',
    '.fc-chart svg{display:block;width:100%;height:170px}',
    '.fc-cards{display:none}',
    '.fc-card{border:1px solid var(--ui-line,#E9E7F0);border-radius:12px;padding:10px 12px;margin-bottom:8px;background:#fff}',
    '.fc-card h3{margin:0 0 6px;font-size:var(--fs-table,15px);color:var(--ui-ink,#2f2752);display:flex;gap:6px;align-items:center;flex-wrap:wrap}',
    '.fc-card .ln{display:flex;justify-content:space-between;gap:10px;font-size:var(--fs-table,15px);padding:4px 0;border-top:1px solid #F3F2F7;font-variant-numeric:tabular-nums}',
    '.fc-card .ln span:first-child{color:#4F4A68}.fc-card .ln b{font-weight:700;text-align:right}.fc-card .ln small{display:block;font-size:var(--fs-label,12px);color:var(--ui-mute,#6B6782);font-weight:400}',
    '@media(max-width:900px){#v-forecast .fx-k{grid-template-columns:1fr 1fr}.fc-two{grid-template-columns:1fr}}',
    '@media(max-width:640px){.fc-wide{display:none}.fc-cards{display:block}#v-forecast .fx-seg{width:100%;height:auto}#v-forecast .fx-seg button{flex:1;min-height:44px}#v-forecast .btn.sm{min-height:44px}',
    '.fc-mi{grid-template-columns:1fr 1fr;}.fc-mi .lb{grid-column:1/-1}.fc-f input,.fc-f select{height:44px;font-size:var(--fs-body,16px)}.fc-mi button,.fc-x{height:44px}#v-forecast .fx-k b{font-size:var(--fs-kpi,20px)}.fc-t{font-size:var(--fs-table,15px)}}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'ui980'; st.textContent = css; document.head.appendChild(st);

  /* ───────── helpers ───────── */
  var E = function(x){ return String(x == null ? '' : x).replace(/[&<>"']/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var N = function(v){ if(typeof v === 'number') return isFinite(v) ? v : 0; var n = parseFloat(String(v == null ? '' : v).replace(/[^\d.\-]/g, '')); return isNaN(n) ? 0 : n; };
  var NB = function(v){ if(v == null || v === '') return null; var n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[^\d.\-]/g, '')); return isNaN(n) ? null : n; };
  var MON = { jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06', jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12' };
  function mKey(t){ t = String(t || ''); var m = t.match(/^(\d{4})-(\d{2})/); if(m) return m[1] + '-' + m[2]; m = t.match(/([A-Za-z]{3})[a-z]*\.?(?:\s+|\/\/|\s*\/\s*)(\d{4})/); return m && MON[m[1].toLowerCase()] ? m[2] + '-' + MON[m[1].toLowerCase()] : ''; }
  function addM(m, k){ var y = +m.slice(0, 4), mo = +m.slice(5, 7) - 1 + k; y += Math.floor(mo / 12); mo = ((mo % 12) + 12) % 12; return y + '-' + (mo < 9 ? '0' : '') + (mo + 1); }
  function dim(m){ return new Date(Date.UTC(+m.slice(0, 4), +m.slice(5, 7), 0)).getUTCDate(); }
  function addD(d, k){ var t = new Date(Date.parse(d + 'T00:00:00Z') + k * 864e5); return t.toISOString().slice(0, 10); }
  function dow(d){ return new Date(Date.parse(d + 'T00:00:00Z')).getUTCDay(); }
  function q(arr, p){ var a = arr.filter(function(x){ return isFinite(x); }).slice().sort(function(x, y){ return x - y; }); if(!a.length) return null; var pos = (a.length - 1) * p, lo = Math.floor(pos), hi = Math.ceil(pos); return a[lo] + (a[hi] - a[lo]) * (pos - lo); }
  function med(a){ return q(a, 0.5); }
  var MS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function mL(m, y){ return MS[+m.slice(5, 7) - 1] + (y ? ' ' + m.slice(0, 4) : ''); }
  function dL(d){ return (+d.slice(8, 10)) + ' ' + MS[+d.slice(5, 7) - 1]; }
  function P0(n){ return (n < 0 ? '−' : '') + '₱' + Math.round(Math.abs(n || 0)).toLocaleString('en-US'); }
  function Y0(n){ return (n < 0 ? '−' : '') + '¥' + Math.round(Math.abs(n || 0)).toLocaleString('en-US'); }
  function K(n, cur){ var a = Math.abs(n || 0), s = n < 0 ? '−' : ''; var c = cur === 'CNY' ? '¥' : '₱'; return s + c + (a >= 1e6 ? (a / 1e6).toFixed(2) + 'M' : a >= 1e4 ? (a / 1e3).toFixed(1) + 'k' : Math.round(a).toLocaleString('en-US')); }
  function phToday(){ return new Date(Date.now() + 8 * 3600e3).toISOString().slice(0, 10); }
  function at(t){ if(!t) return '—'; var d = new Date(t); if(isNaN(d)) return String(t); var p = new Date(d.getTime() + 8 * 3600e3).toISOString(); return (+p.slice(8, 10)) + ' ' + MS[+p.slice(5, 7) - 1] + ' ' + p.slice(11, 16); }
  var SC3 = ['c', 'e', 'o'], SCL = { c: 'Conservative', e: 'Expected', o: 'Optimistic' };
  var TAGW = { A: 'Actual', C: 'Committed', E: 'Estimated', M: 'Manual', X: 'Missing' };
  function tg(t){ return String(t || '').split('+').filter(Boolean).map(function(x){ return '<span class="fc-tg ' + x + '" title="' + TAGW[x] + '">' + TAGW[x] + '</span>'; }).join(' '); }
  function tgS(t){ return String(t || '').split('+').filter(Boolean).join('+'); }

  /* ───────── parse what the app already loaded ───────── */
  function parseMoney(MNv){ if(!MNv || !MNv.rows) return null; var R = MNv.rows.map(function(r){ return (r || []).map(function(x){ return String(x == null ? '' : x).trim(); }); });
    var h = R.findIndex(function(r){ return /^MONTH$/i.test(r[0]) && /SALES/i.test(r[1]) && /EXPENSES/i.test(r[2]); }); if(h < 0) return null;
    var H = R[h].map(function(x){ return x.toUpperCase(); }), c = function(k){ return H.indexOf(k); }, L = [], skipped = 0;
    for(var k = h + 1; k < R.length && R[k][0]; k++){ var r = R[k], m = mKey(r[0]); if(!m){ skipped++; continue; }
      L.push({ m: m, sales: N(r[c('SALES')]), exp: N(r[c('EXPENSES')]), sal: N(r[c('SALARIES')]), gov: N(r[c('GOV DUES')]), cost: N(r[c('TOTAL COSTS')]), net: N(r[c('NET')]), note: r[8] || '' }); }
    var g = R.findIndex(function(r){ return /^MONTH$/i.test(r[0]) && r.some(function(x){ return /^TOTAL$/i.test(x); }) && r.some(function(x){ return /^PAID ON$/i.test(x); }); }), G = [];
    if(g > -1){ var GH = R[g].map(function(x){ return x.toUpperCase(); }); for(var j = g + 1; j < R.length && R[j][0]; j++){ var gm = mKey(R[j][0]); if(!gm) continue; G.push({ m: gm, total: N(R[j][GH.indexOf('TOTAL')]), paid: R[j][GH.indexOf('PAID ON')] || '' }); } }
    var u = (R[1] && R[1][0] || '').match(/Updated\s+([A-Za-z]{3} \d{1,2})(?:, \d{4})?\s+·\s+(\d{1,2}:\d{2})/);
    return { L: L, G: G, upd: u ? u[1] + ', ' + u[2] : '', skipped: skipped }; }
  function parsePL(PLv){ if(!PLv || !PLv.rows) return null; var H = (PLv.head || []).map(function(x){ return String(x).toUpperCase(); });
    var ix = function(re, d){ var j = H.findIndex(function(x){ return re.test(x); }); return j < 0 ? d : j; };
    var c = { paid: ix(/DATE OF PAYMENT/, 0), name: ix(/TEACHER/, 1), m: ix(/^MONTH/, 2), base: ix(/BASE/, 3), reg: ix(/REG UNITS/, 4), sub: ix(/SUB UNITS/, 5), tri: ix(/TRIAL UNITS/, 6), rate: ix(/RATE/, 7), lp: ix(/LESSON PAY/, 8), inc: ix(/INCENTIVE|BONUS/, 9), ded: ix(/DEDUCTION/, 10), sss: ix(/^SSS/, 11), pi: ix(/PAG/, 12), ph: ix(/PHILHEALTH/, 13), bir: ix(/^BIR/, 14), gross: ix(/GROSS/, 15), net: ix(/NET/, 16), st: ix(/STATUS/, 17) };
    var rows = PLv.rows.map(function(r){ var m = mKey(r[c.m]); if(!m) return null; var units = N(r[c.reg]) + N(r[c.sub]) + N(r[c.tri]);
      return { paid: String(r[c.paid] || '').trim(), name: String(r[c.name] || '').trim(), m: m, base: N(r[c.base]), units: units, rate: N(r[c.rate]), lp: N(r[c.lp]), inc: N(r[c.inc]), ded: N(r[c.ded]),
        gov: N(r[c.sss]) + N(r[c.pi]) + N(r[c.ph]) + N(r[c.bir]), gross: N(r[c.gross]), net: N(r[c.net]), st: String(r[c.st] || '') }; }).filter(Boolean);
    return { rows: rows }; }
  function monthAgg(PLp, m){ var A = { n: 0, base: 0, units: 0, lp: 0, inc: 0, ded: 0, gov: 0, gross: 0, net: 0, withheld: 0, paidN: 0 };
    (PLp ? PLp.rows : []).forEach(function(r){ if(r.m !== m) return; A.n++; A.base += r.base; A.units += r.units; A.lp += r.lp; A.inc += r.inc; A.ded += r.ded; A.gov += r.gov; A.gross += r.gross; A.net += r.net; if(r.paid) A.paidN++;
      var w = r.gross - r.ded - r.net; if(w > 0.005) A.withheld += w; });
    return A; }

  /* ───────── defaults (measured where possible, else blank = missing) ───────── */
  function defaults(){ return {
    v: 1, sc: 'e', view: 'm',
    phpBank: null, phpBankDate: '',          /* Manual: peso bank + cash on hand. Missing → forecast "incomplete" */
    rate: null,                              /* Manual: ₱ per ¥ when remitting. Missing → remittance pesos "incomplete" (book rate 7 is NOT a remittance rate) */
    remitFee: 50,                            /* coe-wallet default charge per remittance (¥) */
    remits: [],                              /* Manual: { d, cny, rate, fee, from } */
    items: [],                               /* Manual: { d, cur, dir, amt, label, kind } (one-off income, BIR, 13th month, big spends) */
    held: { c: 0.881, e: 0.816, o: 0.728 },  /* share of scheduled units held; conservative = more lessons held = more salary */
    heldSrc: 'Measured 25 Oct from the calendar copy (classes): 8 weeks 31 Aug–25 Oct, 1,193 of 1,462 scheduled units held; weekly 72.8%–88.1%',
    payDay: { c: 5, e: 9, o: 12 }, govDay: { c: 10, e: 15, o: 22 },
    misc: null,                              /* Manual monthly plan for Miscellaneous; null → estimated from history and flagged */
    wkUnits: null                            /* optional override: scheduled units per week for future months */
  }; }

  /* ───────── the engine ───────── */
  function build(I, A){
    A = Object.assign(defaults(), A || {}); var today = I.today, cur = today.slice(0, 7), dom = +today.slice(8, 10), miss = [], notes = [];
    var M = I.money, PLp = I.pl, X = I.exp || { rows: [], sales: [] };
    if(!M) miss.push({ k: 'money', t: 'MONEY tab not loaded — monthly actuals unavailable' });
    var hist = M ? M.L.slice() : [], mrow = function(m){ return hist.find(function(x){ return x.m === m; }); };
    var full = hist.filter(function(x){ return x.m < cur; }).sort(function(a, b){ return a.m < b.m ? 1 : -1; }).slice(0, 12);
    if(M && M.skipped) notes.push(M.skipped + ' month row(s) in MONEY could not be read and were skipped (not counted as zero).');
    /* one-offs: payments with no RMB (bank / cash in pesos) of ₱50,000 or more */
    var sales = (X.sales || []).filter(function(r){ return r.d && r.d <= today; });
    var isOne = function(r){ return !(N(r.rmb) > 0) && N(r.a) >= 50000; };
    var oneBy = {}; sales.forEach(function(r){ if(isOne(r)){ var m = r.d.slice(0, 7); oneBy[m] = (oneBy[m] || 0) + N(r.a); } });
    /* recurring monthly sales (MONEY sales − one-offs), last 12 full months */
    var recS = full.map(function(x){ return x.sales - (oneBy[x.m] || 0); });
    var recQ = { c: q(recS, 0.25), e: med(recS), o: q(recS, 0.75) };
    /* sales on the rest-of-month days (day > today's day), last 12 full months, without one-offs */
    var lateS = full.map(function(x){ return sales.filter(function(r){ return r.d.slice(0, 7) === x.m && +r.d.slice(8, 10) > dom && !isOne(r); }).reduce(function(a, r){ return a + N(r.a); }, 0); });
    var lateQ = { c: q(lateS, 0.25), e: med(lateS), o: q(lateS, 0.75) };
    /* wallet split since 1 Jun (payment method) */
    var spl = { Alipay: 0, WeChat: 0, CCB: 0, other: 0 }, splN = 0;
    sales.forEach(function(r){ if(r.d < '2026-06-01' || !(N(r.rmb) > 0)) return; var p = String(r.pay || ''); var k = /ali/i.test(p) ? 'Alipay' : /we ?chat/i.test(p) ? 'WeChat' : /ccb|construction/i.test(p) ? 'CCB' : 'other'; spl[k] += N(r.rmb); splN += N(r.rmb); });
    if(!splN){ spl = { Alipay: 0.82, WeChat: 0.17, CCB: 0, other: 0.01 }; } else { for(var sk in spl) spl[sk] /= splN; }
    /* expenses */
    var exRows = (X.rows || []).filter(function(r){ return r.d && !/government contributions/i.test(r.c || ''); });
    var committed = exRows.filter(function(r){ return r.d > today; });
    var lateX = full.map(function(x){ return exRows.filter(function(r){ return r.d.slice(0, 7) === x.m && +r.d.slice(8, 10) > dom && !/^rent$/i.test(r.c || ''); }).reduce(function(a, r){ return a + N(r.a); }, 0); });
    var lateXQ = { c: q(lateX, 0.75), e: med(lateX), o: q(lateX, 0.25) };
    var usual = full.map(function(x){ return exRows.filter(function(r){ return r.d.slice(0, 7) === x.m && !/^(rent|miscellaneous)$/i.test(r.c || ''); }).reduce(function(a, r){ return a + N(r.a); }, 0); });
    var usualQ = { c: q(usual, 0.75), e: med(usual), o: q(usual, 0.25) };
    var miscH = full.map(function(x){ return exRows.filter(function(r){ return r.d.slice(0, 7) === x.m && /^miscellaneous$/i.test(r.c || ''); }).reduce(function(a, r){ return a + N(r.a); }, 0); });
    var miscQ = A.misc != null ? { c: +A.misc, e: +A.misc, o: +A.misc } : { c: q(miscH, 0.75), e: med(miscH), o: q(miscH, 0.25) };
    var rentRows = exRows.filter(function(r){ return /^rent$/i.test(r.c || '') && r.d <= today; }).sort(function(a, b){ return a.d < b.d ? 1 : -1; });
    var rentLast = rentRows.length ? rentRows.filter(function(r){ return r.d.slice(0, 7) === rentRows[0].d.slice(0, 7); }).reduce(function(a, r){ return a + N(r.a); }, 0) : null;
    if(!X.rows || !X.rows.length) miss.push({ k: 'exp', t: 'Sales and expenses copy (coe-expenses) not loaded — usual bills and late-month sales cannot be estimated' });
    if(A.misc == null) miss.push({ k: 'misc', t: 'Miscellaneous: no monthly plan entered — estimated from 12 months of history (' + P0(miscQ.o) + '–' + P0(miscQ.c) + ' a month)', soft: 1 });

    /* ── payroll: current month ── */
    var acc = monthAgg(PLp, cur), mCur = mrow(cur), accrued = mCur ? mCur.sal : (acc.n ? acc.net : null);
    if(!PLp) miss.push({ k: 'pl', t: 'PAYROLL not loaded — teacher rates unavailable' });
    var rates = {}; (PLp ? PLp.rows : []).forEach(function(r){ if(r.m === cur && r.rate > 0){ var k = r.name.toLowerCase(); rates[k] = Math.max(rates[k] || 0, r.rate); } });
    var rateOf = function(t){ t = String(t || '').toLowerCase().trim(); if(rates[t]) return rates[t]; var f = t.split(/\s+/)[0]; for(var k in rates) if(k.split(/\s+/)[0] === f) return rates[k]; return null; };
    var S = I.sched || { days: {} }, nowT = I.now, last = cur + '-' + (dim(cur) < 10 ? '0' : '') + dim(cur), dayList = [], d0 = today;
    while(d0 <= last){ dayList.push(d0); d0 = addD(d0, 1); }
    var rem = { sched: 0, nc: 0, ncRated: 0, pay: 0, norate: 0, rows: 0, canc: 0, missDays: [] };
    dayList.forEach(function(d){ var ev = S.days[d]; if(!ev){ rem.missDays.push(d); return; }
      ev.forEach(function(e){ if(!e.start || !e.end) return; if(Date.parse(e.start) <= nowT) return; var u = (Date.parse(e.end) - Date.parse(e.start)) / 3e6; if(!(u > 0)) return;
        rem.rows++; rem.sched += u; if(e.cancelled){ rem.canc += u; return; } rem.nc += u; var rt = rateOf(e.teacher); if(rt){ rem.ncRated += u; rem.pay += u * rt; } else rem.norate += u; }); });
    var mix = rem.ncRated ? rem.pay / rem.ncRated : (acc.units ? acc.lp / acc.units : null);
    if(rem.missDays.length) miss.push({ k: 'sched', t: 'Calendar not loaded for ' + rem.missDays.map(dL).join(', ') + ' — remaining lessons on those days are not counted' });
    if(rem.norate) notes.push(rem.norate + ' scheduled unit(s) belong to a teacher with no rate in this month\'s PAYROLL; priced at the average ' + (mix ? P0(mix) : '—') + ' per unit.');
    /* base and bonus still to come: the gap between the to-date figure and recent full months (never below zero) */
    var pm = [1, 2, 3, 4, 5].map(function(k){ return monthAgg(PLp, addM(cur, -k)); }).filter(function(a){ return a.n; });
    var baseH = pm.map(function(a){ return a.base; }), bonH = pm.slice(0, 2).map(function(a){ return a.inc; });
    var baseRest = { c: Math.max(0, (Math.max.apply(null, baseH.length ? baseH : [0])) - acc.base), e: Math.max(0, (med(baseH) || 0) - acc.base), o: Math.max(0, (Math.min.apply(null, baseH.length ? baseH : [0])) - acc.base) };
    var bonRest = { c: Math.max(0, (Math.max.apply(null, bonH.length ? bonH : [0])) - acc.inc), e: Math.max(0, (bonH.length ? bonH.reduce(function(a, b){ return a + b; }, 0) / bonH.length : 0) - acc.inc), o: 0 };
    var payCur = {}; SC3.forEach(function(k){ var held = Math.min(rem.nc, rem.sched * A.held[k]); var lp = mix ? held * mix : 0;
      payCur[k] = { held: held, lp: lp, base: baseRest[k], bonus: bonRest[k], rest: lp + baseRest[k] + bonRest[k], total: (accrued || 0) + lp + baseRest[k] + bonRest[k] }; });
    /* ── payroll: future months (from the loaded calendar's weekly level × held share × rate mix, + base + bonus − deductions − withheld gov shares) ── */
    var loadedFuture = Object.keys(S.days).filter(function(d){ return d > today; }), fu = 0; loadedFuture.forEach(function(d){ (S.days[d] || []).forEach(function(e){ var u = (Date.parse(e.end) - Date.parse(e.start)) / 3e6; if(u > 0) fu += u; }); });
    var wk = A.wkUnits != null ? +A.wkUnits : (loadedFuture.length ? fu / loadedFuture.length * 7 : null);
    if(wk == null) miss.push({ k: 'wk', t: 'No calendar days loaded ahead — next months\' salaries cannot be estimated' });
    var lastFull = pm[0] || null, dedH = pm.slice(0, 3).map(function(a){ return a.ded; }), withheld = lastFull ? lastFull.withheld : 0;
    var baseM = med(pm.slice(0, 3).map(function(a){ return a.base; })) || 0, bonM = med(pm.slice(0, 3).map(function(a){ return a.inc; })) || 0;
    function payFuture(m, k){ if(wk == null || !mix) return null; var u = wk / 7 * dim(m) * A.held[k]; var ded = k === 'c' ? 0 : (med(dedH) || 0);
      return { units: u, lp: u * mix, base: baseM, bonus: bonM, ded: ded, withheld: withheld, total: u * mix + baseM + bonM - ded - withheld }; }
    var netH = pm.map(function(a){ return a.net; });

    /* ── gov dues ── */
    var G = M ? M.G : [], gCur = G.find(function(g){ return g.m === cur; }), g3 = G.filter(function(g){ return g.m < cur; }).slice(0, 3).map(function(g){ return g.total; }), g6 = G.filter(function(g){ return g.m < cur; }).map(function(g){ return g.total; });
    var govQ = { c: g6.length ? Math.max.apply(null, g6) : null, e: med(g3), o: g3.length ? Math.min.apply(null, g3) : null };
    miss.push({ k: 'bir', t: 'BIR quarterly / annual dues: the BIR tab has no due dates for the coming months — add them as Manual items (forecast assumes none)' });
    miss.push({ k: 'govf', t: 'GOV rows already entered for coming months are not loaded by the app — gov dues for coming months are estimated from the last months (' + (govQ.o != null ? P0(govQ.o) + '–' + P0(govQ.c) : '—') + ')', soft: 1 });

    /* ── manual items ── */
    var items = (A.items || []).filter(function(x){ return x && x.d && N(x.amt) > 0; });
    var itemsIn = function(m, cur2){ return items.filter(function(x){ return x.d.slice(0, 7) === m && x.dir === 'in' && (x.cur || 'PHP') === cur2; }); };
    var itemsOut = function(m){ return items.filter(function(x){ return x.d.slice(0, 7) === m && x.dir !== 'in'; }); };

    /* ── MONTHLY ── */
    var months = [], past = full.slice(0, 3).reverse();
    past.forEach(function(x){ months.push({ m: x.m, kind: 'past', sales: { A: x.sales }, one: oneBy[x.m] || 0, exp: x.exp, sal: x.sal, gov: x.gov, cost: x.cost, net: x.net }); });
    function rng(f){ var o = {}; SC3.forEach(function(k){ o[k] = f(k); }); return o; }
    var mList = [cur]; for(var a = 1; a <= 5; a++) mList.push(addM(cur, a));
    mList.forEach(function(m, ix){ var isCur = ix === 0, r = { m: m, kind: isCur ? 'cur' : 'fut', lines: {} };
      var act = isCur && mCur ? mCur : null, one = (oneBy[m] || 0), manIn = itemsIn(m, 'PHP').reduce(function(s2, x){ return s2 + N(x.amt); }, 0) + itemsIn(m, 'CNY').reduce(function(s2, x){ return s2 + N(x.amt) * 7; }, 0);
      var oneMan = items.filter(function(x){ return x.d.slice(0, 7) === m && x.dir === 'in' && x.kind === 'oneoff'; }).reduce(function(s2, x){ return s2 + N(x.amt) * ((x.cur || 'PHP') === 'CNY' ? 7 : 1); }, 0);
      r.lines.salesA = act ? { v: rng(function(){ return act.sales - one; }), t: 'A' } : null;
      r.lines.renew = { v: rng(function(k){ var v = isCur ? lateQ[k] : recQ[k]; return v == null ? null : v; }), t: 'E', note: isCur ? 'sales on ' + (dom + 1) + '–' + dim(m) + ' in the last 12 months (P25–P75)' : 'usual monthly sales, last 12 full months without one-offs (P25–P75)' };
      r.lines.one = { v: rng(function(){ return one + oneMan; }), t: one && oneMan ? 'A+M' : one ? 'A' : oneMan ? 'M' : '' };
      r.lines.manIn = { v: rng(function(){ return manIn - oneMan; }), t: manIn - oneMan ? 'M' : '' };
      r.lines.sales = { v: rng(function(k){ var e2 = r.lines.renew.v[k]; return e2 == null ? null : (act ? act.sales : 0) + e2 + oneMan + (manIn - oneMan); }) };
      var com = committed.filter(function(x){ return x.d.slice(0, 7) === m; }).reduce(function(s2, x){ return s2 + N(x.a); }, 0), hasRent = committed.some(function(x){ return x.d.slice(0, 7) === m && /^rent$/i.test(x.c || ''); });
      var outMan = itemsOut(m).filter(function(x){ return x.kind !== 'bir'; }).reduce(function(s2, x){ return s2 + N(x.amt) * ((x.cur || 'PHP') === 'CNY' ? 7 : 1); }, 0);
      r.lines.expA = act ? { v: rng(function(){ return act.exp; }), t: 'A' } : null;
      r.lines.expC = { v: rng(function(){ return com; }), t: com ? 'C' : '' };
      r.lines.expE = { v: rng(function(k){ if(isCur) return lateXQ[k]; var u2 = usualQ[k], mi = miscQ[k]; if(u2 == null) return null; return u2 + (mi || 0) + (hasRent ? 0 : (rentLast || 0)); }), t: 'E', note: isCur ? 'bills dated ' + (dom + 1) + '–' + dim(m) + ' in the last 12 months (P25–P75, without rent)' : 'usual bills (median, P25–P75) + Miscellaneous ' + (A.misc != null ? '(your plan)' : '(estimated)') + (hasRent ? '' : ' + rent as last month') };
      r.lines.expM = { v: rng(function(){ return outMan; }), t: outMan ? 'M' : '' };
      r.lines.exp = { v: rng(function(k){ var e3 = r.lines.expE.v[k]; return e3 == null ? null : (act ? act.exp : 0) + com + e3 + outMan; }) };
      if(isCur){ r.lines.salA = { v: rng(function(){ return accrued; }), t: accrued == null ? 'X' : 'A', note: 'accrued in PAYROLL to date (net)' };
        r.lines.salE = { v: rng(function(k){ return mix ? payCur[k].rest : null; }), t: 'E', note: 'lessons still on the calendar × held share × each teacher\'s rate, + base and bonus still to come' };
        r.lines.sal = { v: rng(function(k){ return accrued == null || !mix ? null : payCur[k].total; }) };
      } else { r.lines.salE = { v: rng(function(k){ var p = payFuture(m, k); return p ? p.total : null; }), t: 'E', note: 'calendar ≈ ' + (wk != null ? Math.round(wk) : '—') + ' units a week × held share × rate mix + base + usual bonus − deductions − gov shares withheld' };
        r.lines.sal = { v: r.lines.salE.v }; }
      var birM = itemsOut(m).filter(function(x){ return x.kind === 'bir'; }).reduce(function(s2, x){ return s2 + N(x.amt); }, 0);
      if(isCur){ var paidG = gCur && gCur.paid; r.lines.gov = { v: rng(function(k){ return (act ? act.gov : 0) + (paidG ? 0 : Math.max(0, (govQ[k] || 0) - (act ? act.gov : 0))) + birM; }), t: (paidG ? 'A' : 'A+E') + (birM ? '+M' : ''), note: paidG ? 'GOV for ' + mL(m) + ' paid ' + E(gCur.paid) : 'GOV not paid yet — estimated' };
      } else r.lines.gov = { v: rng(function(k){ return govQ[k] == null ? null : govQ[k] + birM; }), t: 'E' + (birM ? '+M' : ''), note: 'last months\' GOV totals (BIR not included unless entered)' };
      r.lines.cost = { v: rng(function(k){ var a2 = r.lines.exp.v[k], b2 = r.lines.sal.v[k], c2 = r.lines.gov.v[k]; return a2 == null || b2 == null || c2 == null ? null : a2 + b2 + c2; }) };
      /* conservative = low sales + high costs; optimistic = high sales + low costs */
      r.lines.net = { v: rng(function(k){ var s3 = r.lines.sales.v[k], c3 = r.lines.cost.v[k]; return s3 == null || c3 == null ? null : s3 - c3; }) };
      r.lines.netR = { v: rng(function(k){ var n3 = r.lines.net.v[k]; return n3 == null ? null : n3 - (one + oneMan); }) };
      months.push(r); });
    var be = med(full.map(function(x){ return x.cost; }));

    /* ── 13-WEEK CASH ── */
    /* W1 = the Monday–Sunday week that contains tomorrow (PH time); days up to today are never forecast */
    var w1 = addD(today, 1); while(dow(w1) !== 1) w1 = addD(w1, -1);
    var weeks = []; for(var w = 0; w < 13; w++){ var ws = addD(w1, w * 7); weeks.push({ i: w + 1, s: ws, e: addD(ws, 6) }); }
    var W = I.wallet, wal = { Alipay: null, WeChat: null, CCB: null }, walChecked = '';
    if(W && W.wallets){ W.wallets.forEach(function(x){ if(x.wallet in wal) wal[x.wallet] = +x.balance || 0; if(x.base_day && (!walChecked || x.base_day < walChecked)) walChecked = x.base_day; }); }
    if(!W) miss.push({ k: 'wallet', t: 'Wallet balances (coe-wallet) not loaded — yuan opening balance unknown' });
    if(A.phpBank == null || A.phpBank === '') miss.push({ k: 'bank', t: 'Peso bank balance (and cash on hand): not recorded anywhere — enter it in Assumptions' });
    else if(A.phpBankDate && (Date.parse(today) - Date.parse(A.phpBankDate)) / 864e5 > 14) miss.push({ k: 'bank', t: 'Peso bank balance was entered on ' + dL(A.phpBankDate) + ' — more than 14 days ago' });
    var lastRemit = W && W.entries ? W.entries.find(function(x){ return x.kind === 'remit' && !x.void_at && x.php; }) : null;
    var rateM = A.rate != null && A.rate !== '' ? +A.rate : null;
    if(rateM == null) miss.push({ k: 'rate', t: 'Remittance rate (₱ per ¥): ' + (lastRemit ? 'last recorded ' + (lastRemit.php / lastRemit.cny).toFixed(2) + ' on ' + dL(lastRemit.day) + ' — confirm it' : 'no remittance recorded yet; SALES uses ×7 as a book rate only') });
    if(!(A.remits || []).length) miss.push({ k: 'remit', t: 'Planned remittances (date, amount, rate): none entered — no pesos arrive from the yuan wallets in this forecast' });
    var has13 = items.some(function(x){ return x.kind === '13th'; });
    if(!has13 && weeks.some(function(w){ return w.s <= cur.slice(0, 4) + '-12-24' && w.e >= cur.slice(0, 4) + '-12-24'; })) miss.push({ k: '13th', t: '13th-month pay ' + cur.slice(0, 4) + ': not entered (last year is in the 13TH MONTH tab) — forecast assumes none' });
    var oldUnpaid = (PLp ? PLp.rows : []).filter(function(r){ return !r.paid && r.m < addM(cur, -1) && Math.abs(r.net) > 0.005 && !/paid/i.test(r.st); });
    if(oldUnpaid.length) notes.push(oldUnpaid.length + ' older PAYROLL row(s) without a payment date (' + P0(oldUnpaid.reduce(function(s4, r){ return s4 + r.net; }, 0)) + ') — shown as "check", not added to the cash out.');
    var lastAgg = monthAgg(PLp, addM(cur, -1)), lastUnpaid = (PLp ? PLp.rows : []).filter(function(r){ return r.m === addM(cur, -1) && !r.paid && Math.abs(r.net) > 0.005; });
    function inW(d, w){ return d >= w.s && d <= w.e; }
    function payDate(m, k){ var nm = addM(m, 1); return nm + '-' + (A.payDay[k] < 10 ? '0' : '') + A.payDay[k]; }
    function govDate(m, k){ var nm = addM(m, 1); return nm + '-' + (A.govDay[k] < 10 ? '0' : '') + A.govDay[k]; }
    var dailyIn = function(d, k){ var m = d.slice(0, 7); if(m === cur){ var nd = dim(cur) - dom; return nd > 0 && lateQ[k] != null ? lateQ[k] / nd : 0; } return recQ[k] != null ? recQ[k] / dim(m) : 0; };
    var dailyOut = function(d, k){ var m = d.slice(0, 7); if(m === cur){ var nd = dim(cur) - dom; return nd > 0 && lateXQ[k] != null ? lateXQ[k] / nd : 0; }
      var hasR = committed.some(function(x){ return x.d.slice(0, 7) === m && /^rent$/i.test(x.c || ''); }); return ((usualQ[k] || 0) + (miscQ[k] || 0)) / dim(m) + (hasR ? 0 : (rentLast || 0) / dim(m)); };
    var cash = {}; SC3.forEach(function(k){
      var cny = { Alipay: wal.Alipay, WeChat: wal.WeChat, CCB: wal.CCB }, php = A.phpBank == null || A.phpBank === '' ? null : +A.phpBank, rows = [], minP = null, minW = null, inTot = 0, outTot = 0, cnyInTot = 0;
      weeks.forEach(function(w){ var it = [], o = { w: w, cnyOpen: Object.assign({}, cny), phpOpen: php };
        /* CNY in: expected renewals & new packages (estimate), split by wallet */
        var ein = 0; for(var d = w.s; d <= w.e; d = addD(d, 1)) if(d > today) ein += dailyIn(d, k);
        var einC = ein / 7; o.expIn = einC; if(einC) it.push({ t: 'E', l: 'Expected renewals & new packages (book ₱' + Math.round(ein).toLocaleString('en-US') + ' ÷ 7)', cur: 'CNY', a: einC });
        var conf = items.filter(function(x){ return x.dir === 'in' && inW(x.d, w); }), confC = 0, confP = 0;
        conf.forEach(function(x){ if((x.cur || 'PHP') === 'CNY'){ confC += N(x.amt); it.push({ t: 'M', l: x.label || 'Money in', cur: 'CNY', a: N(x.amt), d: x.d }); } else { confP += N(x.amt); it.push({ t: 'M', l: x.label || 'Money in', cur: 'PHP', a: N(x.amt), d: x.d }); } });
        o.confIn = confC; o.phpIn = confP;
        var add = function(wn, v){ if(cny[wn] != null) cny[wn] += v; };
        add('Alipay', (einC) * (spl.Alipay + spl.other) + confC); add('WeChat', einC * spl.WeChat); add('CCB', einC * spl.CCB);
        /* remittances */
        var rOut = 0, rFee = 0, rIn = 0, rMissing = false;
        (A.remits || []).filter(function(x){ return x.d && inW(x.d, w) && N(x.cny) > 0; }).forEach(function(x){ var from = x.from || 'CCB', fee = x.fee === '' || x.fee == null ? +A.remitFee || 0 : N(x.fee), rt = x.rate ? N(x.rate) : rateM;
          if(cny[from] != null) cny[from] -= N(x.cny) + fee; rOut += N(x.cny); rFee += fee;
          if(rt){ var rr = k === 'c' ? rt * 0.98 : k === 'o' ? rt * 1.01 : rt; rIn += N(x.cny) * rr; it.push({ t: 'M', l: 'Remittance ' + Y0(N(x.cny)) + ' from ' + from + ' @ ₱' + rr.toFixed(2) + ' + ¥' + fee + ' charge', cur: 'PHP', a: N(x.cny) * rr, d: x.d }); }
          else { rMissing = true; it.push({ t: 'X', l: 'Remittance ' + Y0(N(x.cny)) + ' — no rate entered, pesos unknown', cur: 'PHP', a: null, d: x.d }); } });
        o.remOut = rOut; o.remFee = rFee; o.remIn = rIn; o.remMissing = rMissing;
        /* PHP out: payroll on pay day */
        var pay = 0, payParts = [];
        [addM(cur, -1), cur, addM(cur, 1), addM(cur, 2)].forEach(function(m){ var pd = payDate(m, k); if(m === addM(cur, -1)){ if(!lastUnpaid.length) return; if(pd <= today) pd = w1; }
          if(!inW(pd, w)) return;
          if(m === addM(cur, -1)){ var v0 = lastUnpaid.reduce(function(s5, r){ return s5 + r.net; }, 0); pay += v0; payParts.push({ t: 'C', l: 'Payroll · ' + mL(m) + ' work, still unpaid (PAYROLL)', a: v0, d: pd }); return; }
          if(m === cur){ if(accrued != null) payParts.push({ t: 'C', l: 'Payroll · ' + mL(m) + ' work · accrued to date (PAYROLL)', a: accrued, d: pd }); if(mix) payParts.push({ t: 'E', l: 'Payroll · ' + mL(m) + ' work · rest of month (estimate)', a: payCur[k].rest, d: pd });
            pay += (accrued || 0) + (mix ? payCur[k].rest : 0); return; }
          var pf = payFuture(m, k); if(pf){ pay += pf.total; payParts.push({ t: 'E', l: 'Payroll · ' + mL(m) + ' work (estimate)', a: pf.total, d: pd }); } else payParts.push({ t: 'X', l: 'Payroll · ' + mL(m) + ' work — cannot estimate', a: null, d: pd }); });
        o.pay = pay; payParts.forEach(function(p){ it.push(Object.assign({ cur: 'PHP', out: 1 }, p)); });
        /* operating: committed future-dated rows + usual bills estimate */
        var opC = committed.filter(function(x){ return inW(x.d, w); }), opCv = opC.reduce(function(s6, x){ return s6 + N(x.a); }, 0);
        opC.forEach(function(x){ it.push({ t: 'C', l: (x.t || x.c || 'Expense') + ' (future-dated in EXPENSES)', cur: 'PHP', out: 1, a: N(x.a), d: x.d }); });
        var opE = 0; for(var d2 = w.s; d2 <= w.e; d2 = addD(d2, 1)) if(d2 > today) opE += dailyOut(d2, k);
        if(opE) it.push({ t: 'E', l: 'Usual bills + Miscellaneous (estimate, spread by day)', cur: 'PHP', out: 1, a: opE });
        o.opC = opCv; o.opE = opE;
        /* gov dues on the GOV pay day of the next month */
        var gv = 0; [addM(cur, -1), cur, addM(cur, 1), addM(cur, 2)].forEach(function(m){ var gd = govDate(m, k); if(!inW(gd, w)) return; var gr = G.find(function(g){ return g.m === m; });
          if(gr && gr.paid) return; if(m < cur && !gr) return; var v1 = govQ[k]; if(v1 == null) return; gv += v1; it.push({ t: 'E', l: 'Gov dues · ' + mL(m) + ' (estimate; GOV rows for coming months not loaded)', cur: 'PHP', out: 1, a: v1, d: gd }); });
        o.gov = gv;
        /* manual outflows */
        var mo = items.filter(function(x){ return x.dir !== 'in' && inW(x.d, w); }), moP = 0, moC = 0;
        mo.forEach(function(x){ if((x.cur || 'PHP') === 'CNY'){ moC += N(x.amt); if(cny.CCB != null) cny.CCB -= N(x.amt); } else moP += N(x.amt); it.push({ t: 'M', l: x.label || x.kind || 'Payment', cur: x.cur || 'PHP', out: 1, a: N(x.amt), d: x.d }); });
        o.manOut = moP; o.manOutC = moC;
        var phIn = rIn + confP, phOut = pay + opCv + opE + gv + moP; inTot += phIn; outTot += phOut; cnyInTot += einC + confC;
        o.phpChange = phIn - phOut;
        if(php != null) php += phIn - phOut;
        o.phpClose = php; o.cnyClose = Object.assign({}, cny); o.items = it;
        o.cnyTotal = cny.Alipay == null ? null : cny.Alipay + cny.WeChat + cny.CCB;
        if(php != null && (minP == null || php < minP)){ minP = php; minW = w; }
        rows.push(o); });
      cash[k] = { rows: rows, minP: minP, minW: minW, phpIn: inTot, phpOut: outTot, cnyIn: cnyInTot };
    });
    var hard = miss.filter(function(x){ return !x.soft; });
    return { today: today, cur: cur, months: months, be: be, cash: cash, weeks: weeks, wal: wal, walChecked: walChecked, spl: spl, miss: miss, incomplete: hard.length > 0, notes: notes,
      pay: { accrued: accrued, acc: acc, rem: rem, mix: mix, cur: payCur, baseRest: baseRest, bonRest: bonRest, netH: netH, withheld: withheld, wk: wk, lastAgg: lastAgg },
      q: { recQ: recQ, lateQ: lateQ, lateXQ: lateXQ, usualQ: usualQ, miscQ: miscQ, govQ: govQ, rentLast: rentLast, oneBy: oneBy }, A: A, src: I.src || {} }; }

  /* ───────── state, loading (reads only) ───────── */
  var KEY = 'coe.fc980', SNAP = 'coe.fc980.snap';
  function loadA(){ try{ var v = JSON.parse(localStorage.getItem(KEY) || 'null'); return v && v.v === 1 ? Object.assign(defaults(), v) : defaults(); }catch(e){ return defaults(); } }
  function saveA(a){ try{ localStorage.setItem(KEY, JSON.stringify(a)); return true; }catch(e){ return false; } }
  var ST = { A: loadA(), wallet: null, walletAt: null, walletErr: '', exp: null, sched: {}, schedAt: null, busy: 0, open: {}, edit: false };
  var WURL = 'https://rlxkiahqjsabopmuhern.supabase.co/functions/v1/coe-wallet';
  var pres = function(){ try{ return typeof isPres === 'function' && isPres(); }catch(e){ return false; } };
  var tok = function(){ try{ return TOKEN; }catch(e){ return ''; } };
  function expData(){ try{ var k = JSON.parse(localStorage.getItem('coe.exp') || 'null'); if(k && k.rows) return k; }catch(e){} return ST.exp; }
  function load(){ if(ST.busy || !pres()) return; ST.busy = 1; var jobs = [];
    try{ if(typeof MN === 'undefined' || !MN){ if(typeof loadMoney === 'function'){ var p1 = loadMoney(true); if(p1 && p1.then) jobs.push(p1); } } }catch(e){}
    try{ if(typeof PL === 'undefined' || !PL){ if(typeof loadPayLedger === 'function'){ var p2 = loadPayLedger(); if(p2 && p2.then) jobs.push(p2); } } }catch(e){}
    if(!expData() && typeof FAST_URL !== 'undefined') jobs.push(fetch(FAST_URL + '-expenses', { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: tok() }) }).then(function(x){ return x.json(); }).then(function(r){ if(r && r.ok) ST.exp = { rows: r.rows, sales: r.sales || [], at: r.at }; }).catch(function(){}));
    jobs.push(fetch(WURL, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: JSON.stringify({ token: tok(), action: 'get' }) }).then(function(x){ return x.json(); }).then(function(r){ if(r && r.ok){ ST.wallet = r; ST.walletAt = new Date().toISOString(); } else ST.walletErr = (r && r.error) || 'not available'; }).catch(function(e){ ST.walletErr = 'not reachable'; }));
    var t = phToday(), last = t.slice(0, 7) + '-' + dim(t.slice(0, 7)), d = t, days = [];
    while(d <= addD(last, 0) || days.length < 7){ days.push(d); d = addD(d, 1); if(days.length > 14) break; }
    if(typeof schedGet === 'function') days.forEach(function(dd){ jobs.push(Promise.resolve().then(function(){ return schedGet(dd); }).then(function(v){ if(v && v.events){ ST.sched[dd] = v.events; ST.schedAt = new Date().toISOString(); } }).catch(function(){})); });
    Promise.all(jobs.map(function(p){ return Promise.resolve(p).catch(function(){}); })).then(function(){ ST.busy = 0; if(typeof VIEW !== 'undefined' && VIEW === 'forecast') paint(); });
    setTimeout(function(){ if(typeof VIEW !== 'undefined' && VIEW === 'forecast') paint(); }, 2500); }
  function inputs(){ var X = expData(); var nowMs = Date.now();
    return { today: phToday(), now: nowMs, money: parseMoney(typeof MN !== 'undefined' ? MN : null), pl: parsePL(typeof PL !== 'undefined' ? PL : null), exp: X, wallet: ST.wallet, sched: { days: ST.sched },
      src: { money: (function(){ var m = parseMoney(typeof MN !== 'undefined' ? MN : null); return m && m.upd ? 'MONEY tab, updated ' + m.upd : 'MONEY tab'; })(), exp: X && X.at ? 'database copy ' + at(X.at) : '—', pl: 'PAYROLL (database copy)', wal: ST.walletAt ? 'coe-wallet, read ' + at(ST.walletAt) : '—', sched: ST.schedAt ? 'calendar days read ' + at(ST.schedAt) : '—' } }; }

  /* ───────── painting ───────── */
  function cell(v, cls, cur){ if(v == null) return '<span class="na">incomplete</span>'; return '<span class="' + (cls || '') + '">' + (cur === 'CNY' ? Y0(v) : P0(v)) + '</span>'; }
  function rangeCell(L, sc, sign){ if(!L || !L.v) return ''; var v = L.v[sc]; if(v == null) return '<span class="na">incomplete</span>';
    var lo = Math.min(L.v.c == null ? v : L.v.c, L.v.o == null ? v : L.v.o), hi = Math.max(L.v.c == null ? v : L.v.c, L.v.o == null ? v : L.v.o), sp = Math.abs(hi - lo) > 0.5;
    return '<span class="' + (sign ? (v >= 0 ? 'in' : 'out') : '') + '">' + P0(v) + '</span>' + (sp ? '<small>' + K(lo) + ' – ' + K(hi) + '</small>' : ''); }
  function chart(R, sc){ var ms = R.months.filter(function(x){ return x.kind !== 'past' || true; }); var Wd = 640, Hd = 170, pl = 8, pr = 8, pt = 12, pb = 26, n = ms.length;
    var vals = []; ms.forEach(function(x){ if(x.kind === 'past') vals.push(x.net); else SC3.forEach(function(k){ var v = x.lines.net.v[k]; if(v != null) vals.push(v); }); });
    if(!vals.length) return ''; var mx = Math.max.apply(null, vals.concat([0])), mn = Math.min.apply(null, vals.concat([0])); var pad = (mx - mn) * 0.1 || 1; mx += pad; mn -= pad;
    var Xp = function(j){ return pl + (j + 0.5) * (Wd - pl - pr) / n; }, Yp = function(v){ return pt + (Hd - pt - pb) * (mx - v) / (mx - mn); };
    var h = '<svg viewBox="0 0 ' + Wd + ' ' + Hd + '" preserveAspectRatio="none" role="img" aria-label="Net per month: actual for past months, expected with the conservative to optimistic range for coming months">';
    h += '<line x1="0" x2="' + Wd + '" y1="' + Yp(0).toFixed(1) + '" y2="' + Yp(0).toFixed(1) + '" stroke="#C9C5D8" stroke-dasharray="4 4"/>';
    var bw = Math.min(46, (Wd - pl - pr) / n * 0.55);
    ms.forEach(function(x, j){ var cx = Xp(j);
      if(x.kind === 'past'){ var y = Yp(x.net); h += '<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + Math.min(y, Yp(0)).toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.abs(Yp(0) - y).toFixed(1) + '" rx="4" fill="' + (x.net >= 0 ? '#9CC9B3' : '#E3B1A4') + '"><title>' + mL(x.m, 1) + ' · actual net ' + P0(x.net) + '</title></rect>'; }
      else { var vc = x.lines.net.v.c, vo = x.lines.net.v.o, ve = x.lines.net.v[sc]; if(vc != null && vo != null){ var y1 = Yp(Math.max(vc, vo)), y2 = Yp(Math.min(vc, vo)); h += '<rect x="' + (cx - bw / 2).toFixed(1) + '" y="' + y1.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + Math.max(2, y2 - y1).toFixed(1) + '" rx="4" fill="#FFF0D6" stroke="#E7C47F" stroke-dasharray="3 3"><title>' + mL(x.m, 1) + ' · range ' + P0(Math.min(vc, vo)) + ' to ' + P0(Math.max(vc, vo)) + '</title></rect>'; }
        if(ve != null) h += '<line x1="' + (cx - bw / 2 - 3).toFixed(1) + '" x2="' + (cx + bw / 2 + 3).toFixed(1) + '" y1="' + Yp(ve).toFixed(1) + '" y2="' + Yp(ve).toFixed(1) + '" stroke="#2f2752" stroke-width="2.5"><title>' + mL(x.m, 1) + ' · ' + SCL[sc].toLowerCase() + ' ' + P0(ve) + '</title></line>'; }
      h += '<text x="' + cx.toFixed(1) + '" y="' + (Hd - 8) + '" text-anchor="middle" font-size="12" fill="' + (x.kind === 'cur' ? '#2f2752' : '#6B6782') + '" font-weight="' + (x.kind === 'cur' ? '700' : '400') + '">' + mL(x.m) + '</text>'; });
    return h + '</svg>'; }
  function head(R){ return '<div class="fx-h"><h1>Forecast</h1><span class="fx-sub">Finance · prototype for review · ' + E(dL(R.today)) + '</span><span class="grow"></span>' +
      '<button class="btn ghost sm" onclick="fc980Edit()" aria-expanded="' + (ST.edit ? 'true' : 'false') + '">' + (ST.edit ? 'Close assumptions' : 'Assumptions') + '</button></div>' +
      '<div class="fc-proto" role="note"><span aria-hidden="true">ⓘ</span><div><b>Prototype — not released.</b> Read-only: it reads the MONEY tab, PAYROLL, the sales/expenses copy, wallet balances and the calendar, and never changes them. ' +
      'Your assumptions are kept on this device only. Scheduled lessons and expected renewals are <b>estimates, not guaranteed</b>. The "expected net" tiles on Home and Sales &amp; costs are unchanged.</div></div>'; }
  function bar(R){ var A = ST.A; return '<div class="fx-bar"><div class="fx-seg" role="tablist" aria-label="Forecast view">' + [['m', 'Monthly'], ['w', '13-week cash']].map(function(x){ return '<button role="tab" aria-selected="' + (A.view === x[0]) + '" class="' + (A.view === x[0] ? 'on' : '') + '" onclick="fc980Set(\'view\',\'' + x[0] + '\')">' + x[1] + '</button>'; }).join('') + '</div>' +
      '<div class="fx-seg" role="group" aria-label="Scenario">' + SC3.map(function(k){ return '<button aria-pressed="' + (A.sc === k) + '" class="' + (A.sc === k ? 'on' : '') + '" onclick="fc980Set(\'sc\',\'' + k + '\')">' + SCL[k] + '</button>'; }).join('') + '</div></div>'; }
  function incBanner(R){ var hard = R.miss.filter(function(x){ return !x.soft; }), soft = R.miss.filter(function(x){ return x.soft; });
    if(!R.miss.length) return '';
    return '<div class="fc-inc" role="status"><b>' + (hard.length ? 'Forecast incomplete' : 'Forecast uses estimates') + ' — ' + R.miss.length + ' input' + (R.miss.length === 1 ? '' : 's') + ' to check.</b> Missing figures are shown as "incomplete", never as zero.<ul>' +
      hard.map(function(x){ return '<li>' + E(x.t) + '</li>'; }).join('') + soft.map(function(x){ return '<li>' + E(x.t) + '</li>'; }).join('') + '</ul></div>'; }
  function legend(){ return '<div class="fc-leg">' + ['A', 'C', 'E', 'M'].map(function(t){ return tg(t) + ' ' + { A: 'already happened (recorded)', C: 'recorded, amount fixed, not paid yet', E: 'worked out from the assumptions', M: 'entered by you' }[t]; }).join('<span aria-hidden="true">·</span>') + '</div>'; }

  function paintMonthly(R){ var sc = ST.A.sc, ms = R.months, cm = ms.find(function(x){ return x.kind === 'cur'; }), nx = ms.filter(function(x){ return x.kind === 'fut'; });
    var neg = nx.filter(function(x){ return x.lines.net.v.c != null && x.lines.net.v.c < 0; }).length;
    var h = '<div class="fx-k">' +
      '<div><span>' + mL(cm.m) + ' · net to month end</span><b class="' + ((cm.lines.net.v[sc] || 0) >= 0 ? 'in' : 'out') + '">' + (cm.lines.net.v[sc] == null ? 'incomplete' : P0(cm.lines.net.v[sc])) + '</b><small>' + SCL[sc] + ' · range ' + (cm.lines.net.v.c == null ? '—' : K(cm.lines.net.v.c) + ' – ' + K(cm.lines.net.v.o)) + '</small></div>' +
      '<div><span>' + mL(cm.m) + ' · without one-offs</span><b class="' + ((cm.lines.netR.v[sc] || 0) >= 0 ? 'in' : 'out') + '">' + (cm.lines.netR.v[sc] == null ? 'incomplete' : P0(cm.lines.netR.v[sc])) + '</b><small>recurring business · range ' + (cm.lines.netR.v.c == null ? '—' : K(cm.lines.netR.v.c) + ' – ' + K(cm.lines.netR.v.o)) + '</small></div>' +
      '<div><span>' + mL(nx[0].m) + ' · net</span><b class="' + ((nx[0].lines.net.v[sc] || 0) >= 0 ? 'in' : 'out') + '">' + (nx[0].lines.net.v[sc] == null ? 'incomplete' : P0(nx[0].lines.net.v[sc])) + '</b><small>estimate · range ' + (nx[0].lines.net.v.c == null ? '—' : K(nx[0].lines.net.v.c) + ' – ' + K(nx[0].lines.net.v.o)) + '</small></div>' +
      '<div><span>Months below zero</span><b>' + neg + ' of ' + nx.length + '</b><small>in the conservative case · break-even ≈ ' + (R.be ? K(R.be) : '—') + ' costs (12-month median)</small></div></div>';
    h += '<div class="fx-card fc-chart"><div class="fx-ch"><h2>Net per month</h2><span class="fx-sub">past 3 months actual · shaded = conservative–optimistic range · line = ' + SCL[sc].toLowerCase() + '</span></div>' + chart(R, sc) + '</div>';
    var L = [
      ['Sales received', 'sales', 'tot', ''],
      ['Confirmed collections', 'salesA', 'sub', 'A'],
      ['Expected renewals & new packages', 'renew', 'sub', 'E'],
      ['One-off payments', 'one', 'sub', ''],
      ['Other money in (you entered)', 'manIn', 'sub', ''],
      ['Expenses', 'exp', 'tot', ''],
      ['Recorded so far', 'expA', 'sub', 'A'],
      ['Future-dated (rent etc.)', 'expC', 'sub', 'C'],
      ['Usual bills + Miscellaneous', 'expE', 'sub', 'E'],
      ['Planned spends (you entered)', 'expM', 'sub', ''],
      ['Salaries (net, earned in month)', 'sal', 'tot', ''],
      ['Accrued so far', 'salA', 'sub', 'A'],
      ['Still to earn (estimate)', 'salE', 'sub', 'E'],
      ['Gov dues', 'gov', 'tot', ''],
      ['Total costs', 'cost', 'tot', ''],
      ['Net', 'net', 'net', ''],
      ['Net without one-offs', 'netR', 'net', '']];
    var pastVal = function(x, k){ return { sales: x.sales.A, salesA: x.sales.A - x.one, one: x.one, exp: x.exp, expA: x.exp, sal: x.sal, salA: x.sal, gov: x.gov, cost: x.cost, net: x.net, netR: x.net - x.one }[k]; };
    var all = ms; ms = ms.filter(function(x, j){ return x.kind !== 'past' || j === all.findIndex(function(y){ return y.kind === 'cur'; }) - 1; });
    var t = '<div class="fx-card fc-wide"><div class="fx-ch"><h2>Month by month</h2><span class="fx-sub">MONEY tab definitions · last full month for comparison · ' + SCL[sc].toLowerCase() + ' figure, range underneath</span></div><div class="fc-sc"><table class="fc-t"><thead><tr><th scope="col">PHP</th>' +
      ms.map(function(x){ return '<th scope="col" class="' + (x.kind === 'past' ? 'past' : x.kind === 'cur' ? 'cur' : '') + '">' + mL(x.m) + '<br><span style="font-weight:400;text-transform:none;letter-spacing:0">' + (x.kind === 'past' ? 'actual' : x.kind === 'cur' ? 'to date + rest' : 'forecast') + '</span></th>'; }).join('') + '</tr></thead><tbody>';
    L.forEach(function(row){ var any = ms.some(function(x){ if(x.kind === 'past') return pastVal(x, row[1]) != null; var l = x.lines[row[1]]; return l && (l.t !== '' || row[2] !== 'sub'); }); if(!any) return;
      t += '<tr class="' + row[2] + '"><th scope="row" style="vertical-align:top;text-align:left;font-size:inherit;text-transform:none;letter-spacing:0;color:inherit;font-weight:' + (row[2] === 'sub' ? 400 : 700) + ';border-bottom:1px solid #F3F2F7;padding:7px 8px' + (row[2] === 'sub' ? ';padding-left:20px' : '') + '">' + row[0] + '</th>' + ms.map(function(x){
        if(x.kind === 'past'){ var pv = pastVal(x, row[1]); return '<td class="past">' + (pv == null ? '' : (row[2] === 'net' ? '<span class="' + (pv >= 0 ? 'in' : 'out') + '">' + P0(pv) + '</span>' : P0(pv))) + (row[2] === 'sub' && pv != null && pv !== 0 ? '<small>' + TAGW.A + '</small>' : '') + '</td>'; }
        var l = x.lines[row[1]]; if(!l || (row[2] === 'sub' && !l.t)) return '<td class="' + (x.kind === 'cur' ? 'cur' : '') + '">—</td>';
        return '<td class="' + (x.kind === 'cur' ? 'cur' : '') + '"' + (l.note ? ' title="' + E(l.note) + '"' : '') + '>' + rangeCell(l, sc, row[2] === 'net') + (l.t ? '<small>' + tgS(l.t).split('+').map(function(z){ return TAGW[z]; }).join(' + ') + '</small>' : '') + '</td>'; }).join('') + '</tr>'; });
    t += '</tbody></table></div>' + legend() + '<div class="fc-leg">Hover a figure for how it is worked out. Past months are copied from the MONEY tab as they are. Conservative = lower sales and higher costs; optimistic = the opposite.</div></div>';
    var cards = '<div class="fc-cards">' + ms.filter(function(x){ return x.kind !== 'past'; }).map(function(x){ var g = function(k, lab, sub){ var l = x.lines[k]; if(!l || (sub && !l.t)) return ''; return '<div class="ln"><span>' + lab + (l.t ? ' ' + tg(l.t) : '') + '</span><b>' + rangeCell(l, sc, k === 'net' || k === 'netR') + '</b></div>'; };
      return '<div class="fc-card"><h3>' + mL(x.m, 1) + ' <span class="fc-s">' + (x.kind === 'cur' ? 'to date + rest of month' : 'forecast') + '</span></h3>' + g('salesA', 'Confirmed collections', 1) + g('renew', 'Expected renewals & new', 1) + g('one', 'One-off', 1) + g('sales', 'Sales') + g('exp', 'Expenses') + g('sal', 'Salaries') + g('gov', 'Gov dues') + g('net', 'Net') + g('netR', 'Net without one-offs') + '</div>'; }).join('') + legend() + '</div>';
    ms = all; return h + t + cards + payCard(R); }
  function payCard(R){ var P = R.pay, sc = ST.A.sc, c = P.cur[sc] || {}, r = P.rem;
    return '<div class="fx-card"><div class="fx-ch"><h2>' + mL(R.cur, 1) + ' salaries · how the estimate is built</h2><span class="grow"></span><a onclick="go(\'payroll\')">Open payroll ›</a></div><table class="fc-t"><tbody>' +
      '<tr><td>Accrued in PAYROLL to date (net, ' + (P.acc.n || 0) + ' rows, ' + (Math.round(P.acc.units * 10) / 10) + ' units) ' + tg('A') + '</td><td>' + cell(P.accrued) + '</td></tr>' +
      '<tr><td>Lessons still on the calendar this month: ' + (Math.round(r.sched * 10) / 10) + ' units scheduled (' + (Math.round(r.canc * 10) / 10) + ' already cancelled) ' + tg('E') + '<small>held share ' + Math.round(R.A.held.o * 1000) / 10 + '% / ' + Math.round(R.A.held.e * 1000) / 10 + '% / ' + Math.round(R.A.held.c * 1000) / 10 + '% (optimistic / expected / conservative) → ' + (Math.round((c.held || 0) * 10) / 10) + ' units held × ' + (P.mix ? P0(P.mix) : '—') + ' per unit (each teacher\'s rate in this month\'s PAYROLL)</small></td><td>' + cell(P.mix ? c.lp : null) + '</td></tr>' +
      '<tr><td>Base salary still to come ' + tg('E') + '<small>recent full months minus the to-date figure (not below zero)</small></td><td>' + P0(c.base) + '</td></tr>' +
      '<tr><td>Bonuses still to come ' + tg('E') + '<small>last two months\' bonus total minus the to-date bonuses; optimistic assumes none. Deductions are case-by-case and not forecast for the rest of the month.</small></td><td>' + P0(c.bonus) + '</td></tr>' +
      '<tr class="tot"><td>' + mL(R.cur) + ' salaries, ' + SCL[sc].toLowerCase() + ' <small>range ' + (P.cur.o && P.accrued != null && P.mix ? K(P.cur.o.total) + ' – ' + K(P.cur.c.total) : '—') + ' · paid about ' + R.A.payDay.e + ' ' + mL(addM(R.cur, 1)) + '</small></td><td>' + cell(P.accrued != null && P.mix ? c.total : null) + '</td></tr>' +
      '</tbody></table><div class="fc-leg">Gov shares withheld from teachers (' + P0(P.withheld) + ' last month) are already inside the GOV payment and are not added again. Recent months\' net salaries: ' + (P.netH.length ? P.netH.map(function(v){ return K(v); }).join(' · ') : '—') + '.</div></div>'; }

  function paintCash(R){ var sc = ST.A.sc, C = R.cash[sc], rows = C.rows, cnyNow = R.wal.Alipay == null ? null : R.wal.Alipay + R.wal.WeChat + R.wal.CCB;
    var h = '<div class="fx-k">' +
      '<div><span>Lowest peso balance</span><b class="' + (C.minP != null && C.minP < 0 ? 'out' : '') + '">' + (C.minP == null ? 'incomplete' : P0(C.minP)) + '</b><small>' + (C.minP == null ? 'needs your peso bank balance' : 'week of ' + dL(C.minW.s) + ' · ' + SCL[sc].toLowerCase()) + '</small></div>' +
      '<div><span>Yuan in wallets now</span><b>' + (cnyNow == null ? 'incomplete' : Y0(cnyNow)) + '</b><small>' + (cnyNow == null ? 'wallet balances not loaded' : 'Alipay ' + Y0(R.wal.Alipay) + ' · WeChat ' + Y0(R.wal.WeChat) + ' · CCB ' + Y0(R.wal.CCB) + (R.walChecked ? ' · checked ' + dL(R.walChecked) + ' + sales since' : '')) + '</small></div>' +
      '<div><span>Expected in · 13 weeks</span><b class="in">' + Y0(C.cnyIn) + '</b><small>estimate · range ' + Y0(R.cash.c.cnyIn) + ' – ' + Y0(R.cash.o.cnyIn) + ' (book ₱ ÷ 7)</small></div>' +
      '<div><span>Pesos out · 13 weeks</span><b class="out">' + P0(C.phpOut) + '</b><small>payroll, bills, dues · range ' + K(R.cash.o.phpOut) + ' – ' + K(R.cash.c.phpOut) + '</small></div></div>';
    var cn = '<div class="fx-card fc-wide"><div class="fx-ch"><h2>Yuan wallets (CNY)</h2><span class="fx-sub">Alipay · WeChat · CCB · tap a week for its lines</span></div><div class="fc-sc"><table class="fc-t"><thead><tr><th scope="col">Week</th><th scope="col">Opening</th><th scope="col">Confirmed in</th><th scope="col">Expected renewals<br>&amp; new (range)</th><th scope="col">Remitted out</th><th scope="col">Charges</th><th scope="col">Closing</th></tr></thead><tbody>';
    var ph = '<div class="fx-card fc-wide"><div class="fx-ch"><h2>Peso bank (PHP)</h2><span class="fx-sub">' + (ST.A.phpBank == null || ST.A.phpBank === '' ? '<b class="na">opening balance missing — closing balances incomplete</b>' : 'opening entered by you' + (ST.A.phpBankDate ? ' on ' + dL(ST.A.phpBankDate) : '')) + '</span></div><div class="fc-sc"><table class="fc-t"><thead><tr><th scope="col">Week</th><th scope="col">Opening</th><th scope="col">From remittances</th><th scope="col">Other in</th><th scope="col">Payroll</th><th scope="col">Operating</th><th scope="col">Gov dues</th><th scope="col">Other out</th><th scope="col">Closing</th></tr></thead><tbody>';
    var cards = '<div class="fc-cards">';
    rows.forEach(function(o, j){ var w = o.w, lab = 'W' + w.i + ' · ' + dL(w.s) + '–' + dL(w.e), op = ST.open[j];
      var lo = R.cash.c.rows[j].expIn, hi = R.cash.o.rows[j].expIn, tot = function(x){ return x.Alipay == null ? null : x.Alipay + x.WeChat + x.CCB; };
      var det = '<tr class="det"><td colspan="9"><div class="fc-it">' + (o.items.length ? o.items.map(function(x){ return '<span>' + tg(x.t) + '</span><span>' + E(x.l) + (x.d ? ' · ' + dL(x.d) : '') + '</span><span class="r ' + (x.out ? 'out' : 'in') + '">' + (x.a == null ? '<span class="na">incomplete</span>' : (x.out ? '−' : '+') + (x.cur === 'CNY' ? Y0(x.a) : P0(x.a))) + '</span>'; }).join('') : '<span></span><span>Nothing planned this week.</span><span></span>') + '</div></td></tr>';
      cn += '<tr class="wk" tabindex="0" onclick="fc980Open(' + j + ')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();fc980Open(' + j + ')}" aria-expanded="' + (!!op) + '"><td>' + lab + '</td><td>' + cell(tot(o.cnyOpen), '', 'CNY') + (j === 0 && o.cnyOpen.Alipay != null ? '<small>wallet records</small>' : '') + '</td><td>' + (o.confIn ? Y0(o.confIn) + '<small>Manual</small>' : '—') + '</td><td class="in">' + Y0(o.expIn) + '<small>' + Y0(lo) + ' – ' + Y0(hi) + ' · Estimated</small></td><td>' + (o.remOut ? '−' + Y0(o.remOut) + '<small>Manual</small>' : '—') + '</td><td>' + (o.remFee ? '−' + Y0(o.remFee) : '—') + '</td><td><b>' + cell(tot(o.cnyClose), '', 'CNY') + '</b>' + (o.cnyClose.Alipay != null ? '<small>A ' + K(o.cnyClose.Alipay, 'CNY') + ' · W ' + K(o.cnyClose.WeChat, 'CNY') + ' · C ' + K(o.cnyClose.CCB, 'CNY') + '</small>' : '') + '</td></tr>' + (op ? det.replace('colspan="9"', 'colspan="7"') : '');
      ph += '<tr class="wk" tabindex="0" onclick="fc980Open(' + j + ')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();fc980Open(' + j + ')}" aria-expanded="' + (!!op) + '"><td>' + lab + '</td><td>' + cell(o.phpOpen) + '</td><td>' + (o.remMissing ? '<span class="na">incomplete</span>' : o.remIn ? '+' + P0(o.remIn) + '<small>Manual rate</small>' : '—') + '</td><td>' + (o.phpIn ? '+' + P0(o.phpIn) + '<small>Manual</small>' : '—') + '</td>' +
        '<td>' + (o.pay ? '<span class="out">−' + P0(o.pay) + '</span><small>' + o.items.filter(function(x){ return /^Payroll/.test(x.l); }).map(function(x){ return TAGW[x.t]; }).join(' + ') + '</small>' : '—') + '</td><td>' + (o.opC + o.opE ? '<span class="out">−' + P0(o.opC + o.opE) + '</span><small>' + (o.opC ? 'Committed ' + K(o.opC) + ' + ' : '') + 'Est. ' + K(o.opE) + '</small>' : '—') + '</td><td>' + (o.gov ? '<span class="out">−' + P0(o.gov) + '</span><small>Estimated</small>' : '—') + '</td><td>' + (o.manOut ? '<span class="out">−' + P0(o.manOut) + '</span><small>Manual</small>' : '—') + '</td><td><b>' + (o.phpClose == null ? '<span class="na">incomplete</span><small>change ' + P0(o.phpChange) + '</small>' : '<span class="' + (o.phpClose < 0 ? 'out' : '') + '">' + P0(o.phpClose) + '</span>') + '</b></td></tr>' + (op ? det : '');
      cards += '<div class="fc-card"><h3>' + lab + '</h3>' +
        '<div class="ln"><span>Yuan · opening → closing</span><b>' + cell(tot(o.cnyOpen), '', 'CNY') + ' → ' + cell(tot(o.cnyClose), '', 'CNY') + '</b></div>' +
        '<div class="ln"><span>Expected renewals & new ' + tg('E') + '</span><b class="in">' + Y0(o.expIn) + '<small>' + Y0(lo) + ' – ' + Y0(hi) + '</small></b></div>' +
        (o.remOut ? '<div class="ln"><span>Remitted ' + tg('M') + '</span><b>−' + Y0(o.remOut) + ' → ' + (o.remMissing ? '<span class="na">incomplete</span>' : '+' + P0(o.remIn)) + '</b></div>' : '') +
        (o.pay ? '<div class="ln"><span>Payroll</span><b class="out">−' + P0(o.pay) + '</b></div>' : '') +
        (o.opC + o.opE ? '<div class="ln"><span>Operating</span><b class="out">−' + P0(o.opC + o.opE) + '</b></div>' : '') +
        (o.gov ? '<div class="ln"><span>Gov dues ' + tg('E') + '</span><b class="out">−' + P0(o.gov) + '</b></div>' : '') +
        (o.manOut ? '<div class="ln"><span>Other out ' + tg('M') + '</span><b class="out">−' + P0(o.manOut) + '</b></div>' : '') +
        '<div class="ln"><span>Pesos · closing</span><b>' + (o.phpClose == null ? '<span class="na">incomplete</span><small>change ' + P0(o.phpChange) + '</small>' : P0(o.phpClose)) + '</b></div></div>'; });
    cn += '</tbody></table></div><div class="fc-leg">Wallet split of expected yuan: Alipay ' + Math.round((R.spl.Alipay + R.spl.other) * 100) + '% · WeChat ' + Math.round(R.spl.WeChat * 100) + '% · CCB ' + Math.round(R.spl.CCB * 100) + '% (payment methods since 1 Jun). Transfers between wallets are not income; only their charges leave.</div></div>';
    ph += '</tbody></table></div>' + legend() + '<div class="fc-leg">Payroll leaves on the pay day (' + ST.A.payDay.c + ' / ' + ST.A.payDay.e + ' / ' + ST.A.payDay.o + ' of the next month — conservative / expected / optimistic); the accrued part is Committed, the rest Estimated. Gov dues leave on day ' + ST.A.govDay.c + ' / ' + ST.A.govDay.e + ' / ' + ST.A.govDay.o + ' of the next month.</div></div>';
    cards += legend() + '</div>';
    return h + cn + ph + cards; }

  function paintAssump(R){ var A = ST.A, q2 = R.q, P = R.pay;
    var num = function(id, v, ph2, step){ return '<input id="' + id + '" type="number" inputmode="decimal" ' + (step ? 'step="' + step + '" ' : '') + 'value="' + (v == null ? '' : E(v)) + '" placeholder="' + E(ph2 || '') + '">'; };
    var h = '<div class="fx-card" id="fcAs"><div class="fx-ch"><h2>Assumptions</h2><span class="fx-sub">kept apart from the records · stored on this device only (prototype) · nothing is sent to the database</span></div><div class="fc-as fc-f">' +
      '<div><label for="fcBank">Peso bank + cash on hand (₱) ' + tg('M') + '</label><div class="row2">' + num('fcBank', A.phpBank, 'not entered') + '<input id="fcBankD" type="date" value="' + E(A.phpBankDate || '') + '" aria-label="Date of the peso balance"></div><div class="hint">Not recorded anywhere in the app. Without it the peso closing balances show "incomplete".</div></div>' +
      '<div><label for="fcRate">Remittance rate (₱ per ¥) ' + tg('M') + '</label>' + num('fcRate', A.rate, 'not entered', '0.01') + '<div class="hint">No remittance recorded yet in Wallets. SALES uses ×7 as a book rate only. Conservative uses 2% less, optimistic 1% more.</div></div>' +
      '<div><label>Lessons held of those scheduled ' + tg('E') + '</label><div class="row3">' + SC3.map(function(k){ return '<div><span class="sl">' + SCL[k] + '</span>' + num('fcH' + k, Math.round(A.held[k] * 1000) / 10, '', '0.1') + '</div>'; }).join('') + '</div><div class="hint">% · ' + E(A.heldSrc) + '. Conservative = more lessons held = more salary.</div></div>' +
      '<div><label>Payroll pay day (day of next month) ' + tg('E') + '</label><div class="row3">' + SC3.map(function(k){ return '<div><span class="sl">' + SCL[k] + '</span>' + num('fcP' + k, A.payDay[k], '', '1') + '</div>'; }).join('') + '</div><div class="hint">PAYROLL dates of payment: usually 5th–12th.</div></div>' +
      '<div><label>Gov dues pay day (day of next month) ' + tg('E') + '</label><div class="row3">' + SC3.map(function(k){ return '<div><span class="sl">' + SCL[k] + '</span>' + num('fcG' + k, A.govDay[k], '', '1') + '</div>'; }).join('') + '</div><div class="hint">GOV "paid on" dates: 0–60 days after the month.</div></div>' +
      '<div><label for="fcMisc">Miscellaneous plan per month (₱) ' + tg('M') + '</label>' + num('fcMisc', A.misc, 'not planned') + '<div class="hint">Empty = estimated from 12 months of EXPENSES: ' + (q2.miscQ.o != null ? P0(q2.miscQ.o) + ' / ' + P0(q2.miscQ.e) + ' / ' + P0(q2.miscQ.c) : '—') + ' (optimistic / expected / conservative).</div></div>' +
      '<div><label for="fcWk">Scheduled units per week, coming months ' + tg('E') + '</label>' + num('fcWk', A.wkUnits, P.wk != null ? 'calendar: ' + Math.round(P.wk) : 'not loaded', '0.5') + '<div class="hint">Empty = from the calendar days loaded (' + E(R.src.sched || '—') + '). Recurring series run past package ends, so this is an upper level before the held share.</div></div>' +
      '<div><label for="fcFee">Remittance charge (¥) ' + tg('M') + '</label>' + num('fcFee', A.remitFee, '50', '1') + '<div class="hint">Wallets default charge ¥50 per remittance.</div></div>' +
      '</div>';
    h += '<h2 style="margin:16px 0 6px">Planned remittances ' + tg('M') + '</h2><div class="fc-f" id="fcRem">' + (A.remits || []).map(function(x, j){ return '<div class="fc-mi"><input type="date" aria-label="Remittance date" data-r="' + j + '" data-k="d" value="' + E(x.d || '') + '"><select aria-label="From wallet" data-r="' + j + '" data-k="from">' + ['CCB', 'Alipay', 'WeChat'].map(function(w){ return '<option' + ((x.from || 'CCB') === w ? ' selected' : '') + '>' + w + '</option>'; }).join('') + '</select><input type="number" aria-label="Yuan sent" placeholder="¥ sent" data-r="' + j + '" data-k="cny" value="' + E(x.cny || '') + '"><input class="lb" type="number" step="0.01" aria-label="Rate pesos per yuan" placeholder="rate ₱/¥ (empty = default)" data-r="' + j + '" data-k="rate" value="' + E(x.rate || '') + '"><input type="number" aria-label="Charge in yuan" placeholder="charge ¥" data-r="' + j + '" data-k="fee" value="' + E(x.fee == null ? '' : x.fee) + '"><button type="button" aria-label="Remove remittance" onclick="fc980Del(\'remits\',' + j + ')">×</button></div>'; }).join('') +
      '<button type="button" class="btn ghost sm" onclick="fc980Add(\'remits\')">+ Remittance</button></div>';
    h += '<h2 style="margin:16px 0 6px">Other planned items ' + tg('M') + '</h2><div class="fc-s" style="margin-bottom:6px">One-off income (e.g. a university programme), BIR dues, 13th-month pay, big purchases. Never extrapolated.</div><div class="fc-f" id="fcItems">' + (A.items || []).map(function(x, j){ return '<div class="fc-mi"><input type="date" aria-label="Date" data-i="' + j + '" data-k="d" value="' + E(x.d || '') + '"><select aria-label="In or out" data-i="' + j + '" data-k="dir"><option value="out"' + (x.dir !== 'in' ? ' selected' : '') + '>Out</option><option value="in"' + (x.dir === 'in' ? ' selected' : '') + '>In</option></select><select aria-label="Kind" data-i="' + j + '" data-k="kind">' + [['other', 'Other'], ['oneoff', 'One-off income'], ['bir', 'BIR dues'], ['13th', '13th month'], ['big', 'Big purchase']].map(function(o){ return '<option value="' + o[0] + '"' + ((x.kind || 'other') === o[0] ? ' selected' : '') + '>' + o[1] + '</option>'; }).join('') + '</select><input class="lb" aria-label="Description" placeholder="description (no personal details)" data-i="' + j + '" data-k="label" value="' + E(x.label || '') + '"><input type="number" aria-label="Amount" placeholder="amount" data-i="' + j + '" data-k="amt" value="' + E(x.amt || '') + '"><select aria-label="Currency" data-i="' + j + '" data-k="cur"><option' + ((x.cur || 'PHP') === 'PHP' ? ' selected' : '') + '>PHP</option><option' + (x.cur === 'CNY' ? ' selected' : '') + '>CNY</option></select><button type="button" aria-label="Remove item" onclick="fc980Del(\'items\',' + j + ')">×</button></div>'; }).join('') +
      '<button type="button" class="btn ghost sm" onclick="fc980Add(\'items\')">+ Item</button></div>';
    h += '<div class="fc-acts"><button class="btn teal sm" onclick="fc980Save()">Use these assumptions</button><button class="btn ghost sm" onclick="fc980Reset()">Reset to measured values</button><span class="fc-s">Applies on this device only. In the real version a change would need a short "why" note and would be kept as a new version.</span></div>';
    h += '<div class="fc-leg" style="margin-top:12px">Sources: ' + E(R.src.money || '—') + ' · sales/expenses ' + E(R.src.exp || '—') + ' · ' + E(R.src.pl || '—') + ' · wallets ' + E(R.src.wal || '—') + ' · ' + E(R.src.sched || '—') + '</div></div>';
    return h; }
  function readForm(){ var A = JSON.parse(JSON.stringify(ST.A)); var v = function(id){ var el = document.getElementById(id); return el ? el.value : ''; }; var nb = function(id){ var x = v(id); return x === '' ? null : +x; };
    A.phpBank = nb('fcBank'); A.phpBankDate = v('fcBankD'); A.rate = nb('fcRate'); A.misc = nb('fcMisc'); A.wkUnits = nb('fcWk'); A.remitFee = nb('fcFee') == null ? 50 : nb('fcFee');
    SC3.forEach(function(k){ var h2 = nb('fcH' + k); if(h2 != null) A.held[k] = Math.max(0, Math.min(100, h2)) / 100; var p = nb('fcP' + k); if(p != null) A.payDay[k] = Math.max(1, Math.min(28, Math.round(p))); var g = nb('fcG' + k); if(g != null) A.govDay[k] = Math.max(1, Math.min(28, Math.round(g))); });
    document.querySelectorAll('#fcRem [data-r]').forEach(function(el){ var r = A.remits[+el.dataset.r]; if(r) r[el.dataset.k] = el.value; });
    document.querySelectorAll('#fcItems [data-i]').forEach(function(el){ var r = A.items[+el.dataset.i]; if(r) r[el.dataset.k] = el.value; });
    return A; }
  window.fc980Edit = function(){ ST.edit = !ST.edit; paint(); if(ST.edit) setTimeout(function(){ var a = document.getElementById('fcAs'); if(a) a.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 50); };
  window.fc980Set = function(k, v){ ST.A[k] = v; saveA(ST.A); paint(); };
  window.fc980Open = function(j){ ST.open[j] = !ST.open[j]; paint(); };
  window.fc980Add = function(k){ ST.A = readForm(); ST.A[k] = (ST.A[k] || []).concat([k === 'remits' ? { d: '', cny: '', rate: '', fee: '', from: 'CCB' } : { d: '', dir: 'out', kind: 'other', label: '', amt: '', cur: 'PHP' }]); paint(); };
  window.fc980Del = function(k, j){ ST.A = readForm(); ST.A[k].splice(j, 1); paint(); };
  window.fc980Save = function(){ ST.A = readForm(); var ok = saveA(ST.A); paint(); try{ toast(ok ? 'Assumptions applied · kept on this device only' : 'Applied for now · this device could not keep them'); }catch(e){} };
  window.fc980Reset = function(){ var keep = { view: ST.A.view, sc: ST.A.sc }; ST.A = Object.assign(defaults(), keep); saveA(ST.A); paint(); };

  function changed(R){ var sc = 'e', cm = R.months.find(function(x){ return x.kind === 'cur'; }), now = { at: Date.now(), net: cm.lines.net.v[sc], netR: cm.lines.netR.v[sc], pay: R.pay.cur[sc] ? R.pay.cur[sc].total : null, low: R.cash[sc].minP, cny: R.cash[sc].cnyIn, miss: R.miss.length };
    var prev = null; try{ prev = JSON.parse(localStorage.getItem(SNAP) || 'null'); }catch(e){}
    var L = [];
    if(prev && prev.at && Date.now() - prev.at > 60e3){ var d = function(lab, a, b){ if(a == null || b == null) return; var x = a - b; if(Math.abs(x) >= 500) L.push(lab + ': ' + (x > 0 ? 'up ' : 'down ') + P0(Math.abs(x)) + ' (now ' + P0(a) + ')'); };
      d(mL(R.cur) + ' net, expected', now.net, prev.net); d(mL(R.cur) + ' salaries, expected', now.pay, prev.pay); d('Lowest peso balance', now.low, prev.low); if(now.miss !== prev.miss) L.push('Missing inputs: ' + prev.miss + ' → ' + now.miss);
      if(!L.length) L.push('No change of ₱500 or more since ' + at(new Date(prev.at).toISOString()) + '.'); }
    else L.push('First build on this device — next time this lists what moved (new actuals, records, assumptions, calendar).');
    try{ if(!prev || Date.now() - prev.at > 3600e3) localStorage.setItem(SNAP, JSON.stringify(now)); }catch(e){}
    var corr = ['Remaining ' + mL(R.cur) + ' salaries now use each teacher\'s rate and the lessons still on the calendar after the PAYROLL copy (including later today), plus base and bonus still to come — the proposal used a ₱177 average and left those out.',
      'Held share: conservative now means MORE lessons held (higher salary). The proposal had it the other way round for payroll.',
      'Held share measured from 8 weeks of the calendar (72.8%–88.1% a week, 81.6% overall) instead of the assumed 80/85/90%.',
      'The recurring-business range for ' + mL(R.cur) + ' is recalculated step by step — see FORECAST-RECONCILIATION.md.'];
    return '<div class="fx-card fc-ch"><div class="fx-ch"><h2>What changed</h2></div><div class="fc-two"><div><b class="fc-s" style="font-weight:700">Since the last build on this device</b><ul>' + L.map(function(x){ return '<li>' + E(x) + '</li>'; }).join('') + '</ul></div><div><b class="fc-s" style="font-weight:700">Corrections to the 25 Oct proposal</b><ul>' + corr.map(function(x){ return '<li>' + E(x) + '</li>'; }).join('') + '</ul></div></div>' +
      (R.notes.length ? '<div class="fc-leg" style="display:block"><b>Notes:</b> ' + R.notes.map(E).join(' · ') + '</div>' : '') + '</div>'; }

  function paint(){ var v = document.getElementById('v-forecast'); if(!v) return; var tabs = v.querySelector(':scope > .grp-tabs'); var th = tabs ? tabs.outerHTML : '';
    if(!pres()){ v.innerHTML = th + '<div class="fx"><div class="fx-h"><h1>Forecast</h1></div><div class="fx-card">' + (typeof D !== 'undefined' && D && D.mgr ? 'The forecast is for the President only.' : 'Loading…') + '</div></div>'; return; }
    var I = inputs(), R;
    if(!I.money && !I.pl){ v.innerHTML = th + '<div class="fx">' + '<div class="fx-h"><h1>Forecast</h1><span class="fx-sub">loading the MONEY tab, PAYROLL, wallets and the calendar…</span></div><div class="sk"></div><div class="sk"></div></div>'; return; }
    try{ R = build(I, ST.A); }catch(e){ v.innerHTML = th + '<div class="fx"><div class="fx-h"><h1>Forecast</h1></div><div class="fx-card">Could not build the forecast: ' + E(e && e.message) + '</div></div>'; try{ console.warn('980', e); }catch(x){} return; }
    window.__fc980R = R;
    var h = head(R) + bar(R) + incBanner(R) + (ST.edit ? paintAssump(R) : '') + (ST.A.view === 'w' ? paintCash(R) : paintMonthly(R)) + changed(R) + (ST.edit ? '' : '<div class="fx-card"><div class="fx-ch"><h2>Assumptions</h2><span class="grow"></span><a onclick="fc980Edit()">Open and edit ›</a></div><div class="fc-s">Held share ' + Math.round(ST.A.held.e * 1000) / 10 + '% (expected) · pay day ' + ST.A.payDay.e + ' · peso balance ' + (ST.A.phpBank == null || ST.A.phpBank === '' ? '<b class="na">not entered</b>' : P0(ST.A.phpBank)) + ' · rate ' + (ST.A.rate ? '₱' + ST.A.rate + '/¥' : '<b class="na">not entered</b>') + ' · ' + (ST.A.remits || []).length + ' remittance(s) · ' + (ST.A.items || []).length + ' item(s)</div></div>') +
      '<div class="fx-sync" style="display:flex;gap:6px 16px;flex-wrap:wrap;font-size:var(--fs-small,13px);color:var(--ui-mute,#6B6782);margin:4px 2px 0"><span>' + E(R.src.money) + '</span><span>Sales/expenses: ' + E(R.src.exp) + '</span><span>' + E(R.src.pl) + '</span><span>Wallets: ' + E(R.src.wal) + (ST.walletErr ? ' (' + E(ST.walletErr) + ')' : '') + '</span><span>Calendar: ' + E(R.src.sched) + '</span></div>';
    var y = window.scrollY; v.innerHTML = th + '<div class="fx">' + h + '</div>'; try{ window.scrollTo(0, y); }catch(e){} }

  window.fc980 = { build: build, defaults: defaults, parseMoney: parseMoney, parsePL: parsePL, q: q };
  try{ if(typeof VIEWS !== 'undefined' && VIEWS.indexOf('forecast') < 0) VIEWS.push('forecast'); if(!document.getElementById('v-forecast')){ var dv = document.createElement('div'); dv.id = 'v-forecast'; dv.className = 'hide'; var ref = document.getElementById('v-money'); if(ref) ref.parentNode.insertBefore(dv, ref.nextSibling); } }catch(e){ try{ console.warn('980', e); }catch(x){} }
  var _go = window.go; if(typeof _go === 'function') window.go = function(v){ var r = _go.apply(this, arguments); try{ if(v === 'forecast'){ paint(); load(); setTimeout(paint, 400); } }catch(e){ try{ console.warn('980', e); }catch(x){} } return r; };
  try{ if(typeof VIEW !== 'undefined' && VIEW === 'forecast'){ paint(); load(); } }catch(e){}
})();
</script>
` + s.slice(i);
fs.writeFileSync(file, s);
