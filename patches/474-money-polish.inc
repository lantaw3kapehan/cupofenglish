/* 20 Oct · 473 + 474 polish · Sales & costs, executive view (Misty: "the best screen of all, because this is money — top-executive point of
   view: when we see it, it's easy to understand what to do and how to plan").
   Same MONEY data as before; nothing removed, only shown better:
   · "The picture": four answers first — this month vs last, 12-month net, the break-even level, 2026 vs 2025.
   · "What to do next": actions worked out from the numbers (spending above usual, sales below break-even, reliance on two
     sources, payments to link, salaries still to come); each one jumps to its section.
   · This month: white card, coloured tiles, pace against last month, and an estimate of the month's net after salaries.
   · 12 months: sales next to costs split into expenses / salaries / government dues, a dashed break-even line, net above;
     tap any month to see it on the right (replaces the separate "last full month" tiles — no repeat).
   · By year as bars; where sales come from as one share bar; expenses as bars against their usual level; government dues
     as stacked bars (the table is one tap away); "Needs a look" grouped by kind with filter chips; Every month table kept. */
(function(){
const css = `
#v-money .x73{--s:#00939D;--e:#E07A5F;--w:#7B6CC4;--g:#E0A43A;--ok:#2E9E6F;--bad:#D4705A;--mu:#8A86A0}
.x73 .cap{display:flex;align-items:baseline;gap:8px;margin:26px 2px 10px}
.x73 .cap h3{margin:0;font-family:var(--brand);font-weight:400;font-size:19px;color:var(--ink)}
.x73 .cap span{font-size:12.5px;color:var(--mu)}
.x73 .cd{background:#fff;border:1px solid var(--line);border-radius:20px;box-shadow:var(--sh1);padding:18px 20px 16px;min-width:0}
.x73 .kp{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.x73 .kp>div{background:var(--b);border-left:4px solid var(--c);border-radius:14px;padding:12px 15px 11px;min-width:0;cursor:pointer;transition:transform .12s}
.x73 .kp>div:hover{transform:translateY(-1px)}
.x73 .kp span{display:block;font-size:10.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--c)}
.x73 .kp b{display:block;font-family:var(--brand);font-weight:400;font-size:25px;color:var(--ink);margin:4px 0 3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.x73 .kp small{display:block;font-size:12px;color:#55526E;line-height:1.35}
.x73 .t-ok{--c:#2E9E6F;--b:#EEF8F3} .x73 .t-bad{--c:#C4553D;--b:#FCEFEB} .x73 .t-s{--c:#00828B;--b:#E9F6F6} .x73 .t-w{--c:#6C5FC7;--b:#F2F0FB} .x73 .t-g{--c:#B97F17;--b:#FCF6EA}
.x73 .todo{margin-top:12px}
.x73 .todo h4{margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--mu)}
.x73 .ac{display:flex;gap:12px;align-items:flex-start;padding:10px 0;border-top:1px solid #F1F0F5;cursor:pointer}
.x73 .ac:first-of-type{border-top:0}
.x73 .ac .ic{flex:none;width:26px;height:26px;border-radius:9px;display:grid;place-items:center;font-size:13px;font-weight:700;color:#fff;background:var(--c)}
.x73 .ac .w{flex:1;min-width:0} .x73 .ac b{display:block;font-size:14px;color:var(--ink)} .x73 .ac span b{display:inline;font-size:inherit} .x73 .ac span{display:block;font-size:12.5px;color:#6F6C85;line-height:1.4;margin-top:1px}
.x73 .ac em{flex:none;font-style:normal;font-size:12px;font-weight:700;color:var(--teal);align-self:center}
.x73 .hero .r1{display:flex;align-items:baseline;gap:10px}
.x73 .hero h2{margin:0;flex:1;font-family:var(--brand);font-weight:400;font-size:20px;color:var(--ink)} .x73 .hero h2::before{display:none!important}
.x73 .hero .day{font-size:12.5px;color:var(--mu)}
.x73 .t3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin-top:12px}
.x73 .t3>div{background:var(--b);border-left:4px solid var(--c);border-radius:12px;padding:9px 14px}
.x73 .t3 span{display:block;font-size:10.5px;font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--c)}
.x73 .t3 b{display:block;font-family:var(--brand);font-weight:400;font-size:24px;color:var(--ink);white-space:nowrap}
.x73 .t3 small{display:block;font-size:12px;color:#55526E}
.x73 .pace{position:relative;height:10px;border-radius:10px;background:var(--soft);margin:18px 0 22px}
.x73 .pace i{position:absolute;left:0;top:0;bottom:0;border-radius:10px;background:linear-gradient(90deg,#26B5AE,#00939D)}
.x73 .pace em{position:absolute;top:-4px;width:2px;height:18px;border-radius:2px;background:var(--ink)}
.x73 .pace em::after{content:attr(data-l);position:absolute;top:20px;transform:translateX(-50%);font-style:normal;font-size:10.5px;color:var(--mu);white-space:nowrap}
.x73 .pace em.r::after{transform:translateX(-100%)}
.x73 .nt{display:flex;flex-wrap:wrap;gap:4px 18px;font-size:12.5px;color:#55526E} .x73 .nt b{color:var(--ink)}
.x73 .bd{display:grid;grid-template-columns:minmax(0,1.65fr) minmax(0,1fr);gap:14px}
.x73 .lg{display:flex;flex-wrap:wrap;gap:6px 14px;font-size:12px;color:#6F6C85}
.x73 .lg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:-1px}
.x73 .lg i.be{height:0;border-top:2px dashed #8A86A0;border-radius:0;vertical-align:3px;width:14px}
.x73 .ch{position:relative;display:flex;align-items:flex-end;gap:6px;height:290px;padding-top:28px;margin-top:10px;border-bottom:1px solid var(--line)}
.x73 .ch>.col{flex:1;min-width:0;height:100%;display:flex;flex-direction:column;align-items:center;cursor:pointer;border-radius:10px;padding:0 2px;transition:background .12s}
.x73 .ch>.col:hover{background:#F7F7FA} .x73 .ch>.col.sel{background:#EEF6F7}
.x73 .ch .bw{flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center;gap:3px}
.x73 .ch .bw>i{width:40%;max-width:18px;min-height:2px;border-radius:5px 5px 0 0;background:var(--s)}
.x73 .ch .bw>u{width:40%;max-width:18px;display:flex;flex-direction:column-reverse;gap:1px}
.x73 .ch .bw>u>i{display:block;min-height:1px} .x73 .ch .bw>u>i:last-child{border-radius:5px 5px 0 0}
.x73 .ch .so .bw>*{opacity:.55}
.x73 .ch .n{font-size:10.5px;font-weight:700;padding:1px 6px;border-radius:999px;margin-bottom:5px;white-space:nowrap;background:#E4F3EC;color:#1F6B45}
.x73 .ch .n.neg{background:#FBE7E1;color:#9A3B26}
.x73 .ch .lb{font-size:11.5px;color:var(--mu);padding:7px 0 4px} .x73 .ch .sel .lb{color:var(--ink);font-weight:700}
.x73 .ch .be{position:absolute;left:0;right:0;border-top:2px dashed rgba(138,134,160,.75);pointer-events:none;z-index:1}
.x73 .ch .be span{position:absolute;left:0;top:-19px;font-size:10.5px;font-weight:700;color:#6F6C85;background:#fff;padding:0 4px;border-radius:6px}
.x73 .dt h4{margin:0;font-family:var(--brand);font-weight:400;font-size:20px;color:var(--ink)}
.x73 .dt .sb{font-size:12px;color:var(--mu);margin:2px 0 12px}
.x73 .dt .ln{display:flex;align-items:baseline;gap:8px;padding:8px 0;border-top:1px solid #F1F0F5}
.x73 .dt .ln:first-of-type{border-top:0}
.x73 .dt .ln>span:first-child{flex:1;font-size:13px;color:#55526E} .x73 .dt .ln b{font-size:15px;color:var(--ink);font-variant-numeric:tabular-nums}
.x73 .dt .ln b.ok{color:#23885A} .x73 .dt .ln b.bad{color:#C4553D}
.x73 .sp{display:flex;height:12px;border-radius:7px;overflow:hidden;gap:2px;margin:6px 0 8px;background:var(--soft)}
.x73 .sp i{display:block;height:100%}
.x73 .sl{display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:4px 8px;font-size:12.5px;color:#55526E;align-items:center}
.x73 .sl i{width:9px;height:9px;border-radius:3px;display:inline-block} .x73 .sl b{color:var(--ink);font-variant-numeric:tabular-nums;text-align:right}
.x73 .c{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:700;white-space:nowrap}
.x73 .c.up{background:#E4F3EC;color:#1F6B45} .x73 .c.dn{background:#FBE7E1;color:#9A3B26} .x73 .c.eq{background:#F1F0F5;color:#76738A}
.x73 .yr{display:grid;grid-template-columns:110px minmax(0,1fr) 150px;gap:6px 14px;align-items:center;padding:10px 0;border-top:1px solid #F1F0F5}
.x73 .yr:first-of-type{border-top:0}
.x73 .yr .y{font-family:var(--brand);font-size:18px;color:var(--ink)} .x73 .yr .y small{display:block;font-family:inherit;font-size:11px;color:var(--mu)}
.x73 .yr .bars{display:flex;flex-direction:column;gap:4px} .x73 .yr .bars>div{display:flex;height:11px;gap:1px}
.x73 .yr .bars>div>i{display:block;height:100%} .x73 .yr .bars>div>i:first-child{border-radius:4px 0 0 4px} .x73 .yr .bars>div>i:last-child{border-radius:0 4px 4px 0}
.x73 .yr .v{text-align:right} .x73 .yr .v b{display:block;font-size:16px;color:#23885A;font-variant-numeric:tabular-nums} .x73 .yr .v b.neg{color:#C4553D}
.x73 .yr .v small{font-size:11.5px;color:var(--mu)}
.x73 .yr .bt{grid-column:2/3;font-size:11.5px;color:var(--mu);margin-top:-2px}
.x73 .foot{font-size:12px;color:var(--mu);margin-top:10px;line-height:1.5} .x73 .foot b{color:#55526E}
.x73 .two{align-items:start;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px}
.x73 .hd73{flex-wrap:wrap;display:flex;align-items:baseline;gap:10px;margin-bottom:10px}
.x73 .hd73 h3{margin:0;padding:0!important;flex:1;font-family:var(--brand);font-weight:400;font-size:18px;color:var(--ink)} .x73 .hd73 h3::before{display:none!important}
.x73 .hd73 span{font-size:12px;color:var(--mu)}
.x73 .share{display:flex;height:22px;border-radius:9px;overflow:hidden;gap:2px;margin-bottom:6px}
.x73 .share i{display:block;height:100%;min-width:3px}
.x73 .pr{display:grid;grid-template-columns:auto minmax(0,1fr) auto auto;gap:3px 9px;align-items:center;padding:8px 0;border-top:1px solid #F1F0F5}
.x73 .pr .d{width:10px;height:10px;border-radius:3px} .x73 .pr .n{font-weight:700;color:var(--ink);font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.x73 .pr .v{font-weight:700;color:var(--ink);font-variant-numeric:tabular-nums;font-size:13.5px} .x73 .pr .p{font-size:12px;color:var(--mu);min-width:34px;text-align:right}
.x73 .pr .m{grid-column:2/-1;font-size:11.5px;color:var(--mu)}
.x73 .ex{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:3px 10px;align-items:center;padding:8px 0;border-top:1px solid #F1F0F5}
.x73 .ex:first-of-type{border-top:0}
.x73 .ex .n{font-weight:700;color:var(--ink);font-size:13.5px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.x73 .ex .v{font-weight:700;font-variant-numeric:tabular-nums;color:var(--ink);font-size:13.5px} .x73 .ex .v.mu{color:#B9B7C8;font-weight:400}
.x73 .ex .tr{grid-column:1/-1;position:relative;height:8px;border-radius:5px;background:var(--soft)}
.x73 .ex .tr i{position:absolute;left:0;top:0;bottom:0;border-radius:5px;background:#9FC9CD}
.x73 .ex.hi .tr i{background:var(--e)} .x73 .ex.lo .tr i{background:#7CC4A0}
.x73 .ex .tr em{position:absolute;top:-3px;width:2px;height:14px;background:var(--ink);border-radius:2px}
.x73 .ex .m{grid-column:1/-1;font-size:11.5px;color:var(--mu)}
.x73 .gv{display:grid;grid-template-columns:76px minmax(0,1fr) 82px 92px;gap:10px;align-items:center;padding:8px 0;border-top:1px solid #F1F0F5;font-size:13px}
.x73 .gv:first-of-type{border-top:0} .x73 .gv .mo{font-weight:700;color:var(--ink)} .x73 .gv.cur .mo{color:var(--teal)}
.x73 .gv .st{display:flex;height:14px;gap:1px} .x73 .gv .st i{display:block;height:100%} .x73 .gv .st i:first-child{border-radius:4px 0 0 4px} .x73 .gv .st i:last-child{border-radius:0 4px 4px 0}
.x73 .gv .tot{text-align:right;font-weight:700;color:var(--ink);font-variant-numeric:tabular-nums}
.x73 .pay{display:inline-block;padding:2px 9px;border-radius:999px;font-size:11.5px;font-weight:700;background:#E4F3EC;color:#1F6B45;white-space:nowrap}
.x73 .pay.due{background:#FBE7E1;color:#9A3B26}
.x73 .fl{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:6px}
.x73 .fl button{border:1px solid var(--line);background:#fff;border-radius:999px;padding:5px 11px;font:inherit;font-size:12.5px;color:#55526E;cursor:pointer}
.x73 .fl button b{color:var(--ink);margin-left:3px} .x73 .fl button.on{background:var(--ink);border-color:var(--ink);color:#fff} .x73 .fl button.on b{color:#fff}
.x73 .ck{display:flex;gap:12px;padding:10px 0;border-top:1px solid #F1F0F5}
.x73 .ck>i{flex:none;width:8px;height:8px;border-radius:50%;background:var(--c,#D4705A);margin-top:6px}
.x73 .ck .w{flex:1;min-width:0} .x73 .ck b{display:block;color:var(--ink);font-size:13.5px;overflow-wrap:anywhere}
.x73 .ck span{display:block;font-size:12.5px;color:#6F6C85;line-height:1.4;overflow-wrap:anywhere} .x73 .ck em{font-style:normal;font-size:11.5px;color:var(--mu);white-space:nowrap}
.x73 .more{margin-top:6px;border:0;background:none;color:var(--teal);font:inherit;font-weight:700;cursor:pointer;padding:6px 0}
.x73 .lnk{border:0;background:none;color:var(--teal);font:inherit;font-size:12.5px;font-weight:700;cursor:pointer;padding:0}
.x73 details.cd>summary{display:flex;align-items:center;justify-content:space-between;cursor:pointer;list-style:none}
.x73 details.cd>summary::-webkit-details-marker{display:none}
.x73 details.cd>summary .chev{transition:transform .2s;color:#A3A0B5;font-size:20px} .x73 details.cd[open]>summary .chev{transform:rotate(90deg)}
.x73 table.mt{width:100%;border-collapse:collapse;font-size:13.5px;margin-top:12px}
.x73 table.mt th{font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#A3A0B5;text-align:right;padding:0 0 8px}
.x73 table.mt th:first-child,.x73 table.mt td:first-child{text-align:left}
.x73 table.mt td{padding:9px 0;border-top:1px solid #F1F0F5;text-align:right;font-variant-numeric:tabular-nums;color:var(--ink)}
.x73 table.mt td:first-child{font-weight:700}
.x73 .vt td{vertical-align:middle} .x73 .vt .cb{display:flex;flex-direction:column;align-items:flex-end;gap:4px;min-width:120px}
.x73 .vt .cb i{display:block;height:5px;border-radius:3px;opacity:.85}
.x73 .vt .nb{position:relative;width:150px;height:12px;margin:0 auto;background:linear-gradient(90deg,transparent calc(50% - 1px),#D8D6E2 calc(50% - 1px),#D8D6E2 calc(50% + 1px),transparent calc(50% + 1px))}
.x73 .vt .nb i{position:absolute;top:1px;bottom:1px;border-radius:3px} .x73 .vt .nb i.r{left:50%;background:#2E9E6F} .x73 .vt .nb i.l{right:50%;background:#D4705A}
.x73 .mg{display:inline-block;min-width:42px;text-align:center;padding:2px 8px;border-radius:999px;font-size:12px;font-weight:700}
.x73 .mg.hi{background:#DDF2E7;color:#1F6B45} .x73 .mg.ok{background:#EEF6F0;color:#3C7A57} .x73 .mg.lo{background:#FCF4E4;color:#946312} .x73 .mg.bad{background:#FBE7E1;color:#9A3B26}
.x73 .vt tr.avg73 td{border-top:2px solid var(--line);font-weight:700;color:#55526E;background:#FAFAFC} .x73 table.mt td.mu{color:#A3A0B5} .x73 table.mt tr.cu td{background:#F6FAFA}
@media(max-width:1000px){ .x73 .kp{grid-template-columns:repeat(2,minmax(0,1fr))} .x73 .bd,.x73 .two{grid-template-columns:minmax(0,1fr)} }
@media(max-width:640px){ .x73 .kp b{font-size:21px} .x73 .t3{grid-template-columns:1fr 1fr} .x73 .t3>div:first-child{grid-column:1/-1} .x73 .t3 b{font-size:21px}
  .x73 .ch{height:210px;gap:2px} .x73 .ac em{display:none} .x73 .vt .cb{min-width:0} .x73 .vt .cb i{display:none} .x73 table.mt{font-size:12.5px} .x73 .hd73 h3{flex-basis:100%} .x73 .ch .n{font-size:8.5px;padding:1px 3px} .x73 .ch .lb{font-size:10px} .x73 .ch .bw{gap:1px} .x73 .ch .bw>i,.x73 .ch .bw>u{width:44%}
  .x73 .yr{grid-template-columns:64px minmax(0,1fr) 96px;gap:6px 8px} .x73 .yr .y{font-size:15px} .x73 .yr .v b{font-size:14px}
  .x73 .gv{grid-template-columns:62px minmax(0,1fr) 68px} .x73 .gv .pd{grid-column:2/-1;justify-self:start;margin-top:-4px} .x73 .cd{padding:16px 14px 14px;border-radius:18px} .x73 .hide-s{display:none} }`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

const T = s => String(s == null ? '' : s).trim(), N = s => hmN(s), P = n => hmPeso(n);
const k = n => n == null ? '' : (n < 0 ? '−' : '+') + (Math.abs(n) >= 1000 ? Math.round(Math.abs(n) / 1000) + 'k' : Math.round(Math.abs(n)));
const pct = (a, b) => a == null || b == null || b <= 0 ? null : (a - b) / Math.abs(b) * 100;
const chip = (d, good, sfx) => { if(d == null || !isFinite(d)) return ''; if(!Math.round(d)) return '<span class="c eq">same</span>';
  const up = d > 0, ok = good ? up : !up; return `<span class="c ${ok ? 'up' : 'dn'}">${up ? '▲' : '▼'} ${Math.abs(Math.round(d))}${sfx || '%'}</span>`; };
function sec(R, re){
  const i = R.findIndex(r => re.test(r[0] || '')); if(i < 0) return null;
  const isTitle = r => r && /^[A-Z][A-Z0-9 &·\-()]{3,}(\s{2}·|$)/.test(r[0] || '') && r.slice(1).every(x => !x) && !/\d{4}/.test(r[0]);
  const head = (R[i + 1] || []).map(x => T(x).toUpperCase()), rows = [], notes = [];
  for(let j = i + 2; j < R.length; j++){ const r = R[j]; if(!r.some(Boolean)) { if(rows.length) break; else continue; } if(isTitle(r)) break;
    if(r[0] && r.slice(1).every(x => !x)) notes.push(r[0]); else rows.push(r); }
  return { title: R[i][0], head, rows, notes, col: re2 => head.findIndex(h => re2.test(h)) };
}
const go = id => { const el = document.getElementById(id); if(el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
window.x73Go = go;
let SEL = null, CKF = '';

window.renderMoney = function(){
  if(!MN) return;
  const v = $('v-money'), R = (MN.rows || []).map(r => r.map(T));
  const upd = ((R.find(r => /^Updated/i.test(r[0])) || [''])[0].match(/^Updated\s+(.*?\d{1,2}:\d{2}H?)/) || [])[1] || '';
  const top = `<div class="mx-top"><div><h1>Sales &amp; costs</h1><div class="sub">${upd ? 'Updated ' + esc(upd) + ' · ' : ''}PHP · from the MONEY tab${sheetLink('MONEY')}</div></div>
    <div class="mx-act"><button class="btn teal" onclick="saleSheet()">+ Sale</button><button class="btn ghost" onclick="expSheet()">+ Expense</button></div></div>`;
  // the 12 months, with the cost split
  const M = sec(R, /^LAST 12 MONTHS/i); let L = [];
  if(M){ const c = re => M.col(re), cs = c(/^SALES/), ce = c(/^EXPENSES/), cw = c(/^SALAR/), cg = c(/^GOV/), cc = c(/TOTAL COSTS/), cn = c(/^NET/);
    L = M.rows.filter(r => /\d{4}/.test(r[0])).map(r => ({ m: r[0], sales: N(r[cs]), exp: N(r[ce]) || 0, sal: N(r[cw]) || 0, gov: N(r[cg]) || 0, costs: N(r[cc]), net: N(r[cn]), so: /so far/i.test(r[8] || '') })); }
  if(!L.length){ const H = hmMoney(); if(H) L = H.map(m => Object.assign({ exp: 0, sal: 0, gov: 0 }, m)); }
  if(!L.length){ v.innerHTML = top + grid(MN.rows.slice(1)); return; }
  const now = new Date(), ym = now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const cur = L.find(m => m.m === ym || m.so), full = L.filter(m => m !== cur), p = full[0], q = full[1];
  const mg = m => m && m.sales ? Math.round(m.net / m.sales * 100) : null, mon = m => m.m.split(' ')[0];
  const avg = a => a.length ? a.reduce((s, x) => s + x, 0) / a.length : null;
  const be = avg(full.map(m => m.costs || 0)), avgSal = avg(full.map(m => m.sal + m.gov)), avgNet = avg(full.map(m => m.net || 0));
  const prof = full.filter(m => (m.net || 0) > 0), loss = full.filter(m => (m.net || 0) < 0);
  const net12 = full.reduce((s, m) => s + (m.net || 0), 0);
  const Y = sec(R, /^BY YEAR/i), Pt = sec(R, /^SALES BY PARTNER/i), X = sec(R, /^EXPENSES BY CATEGORY/i), G = sec(R, /^GOVERNMENT DUES/i), K = sec(R, /^CHECKS/i);
  let h = top + '<div class="x73">';

  // ── this month numbers used twice (picture + card)
  const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), day = now.getDate(), left = dim - day;
  const ofP = cur && p && p.sales ? Math.round((cur.sales || 0) / p.sales * 100) : null;
  const avgW = avg(full.map(m => m.sal)), avgG = avg(full.map(m => m.gov));
  const gPaid = (() => { const g = sec(R, /^GOVERNMENT DUES/i); if(!g || !cur) return false; const r = g.rows.find(x => x[0] === cur.m), c = g.col(/PAID ON/); return !!(r && c > -1 && r[c] && !/due/i.test(r[c]) && r[c] !== '—'); })();
  const stillW = cur && avgW != null ? Math.max(0, Math.round(avgW - cur.sal)) : 0, stillG = cur && avgG != null && !gPaid ? Math.max(0, Math.round(avgG - cur.gov)) : 0;
  const still = stillW + stillG;
  const estNet = cur && cur.net != null ? cur.net - still : null;

  // ── years
  let yrs = [], yNow = null, yPrev = null;
  if(Y){ const cs = Y.col(/^SALES/), ce = Y.col(/^EXPENSES/), cw = Y.col(/^SALAR/), cg = Y.col(/^GOV/), cc = Y.col(/TOTAL COSTS/), cn = Y.col(/^NET/), cm = Y.col(/MARGIN/);
    yrs = Y.rows.filter(r => /^\d{4}/.test(r[0])).map(r => ({ y: r[0].slice(0, 4), more: T(r[0].slice(4)).replace(/[()]/g, ''), sales: N(r[cs]), exp: N(r[ce]) || 0, sal: N(r[cw]) || 0, gov: N(r[cg]) || 0, costs: N(r[cc]), net: N(r[cn]), mg: r[cm], note: r[8] || '' }));
    yNow = yrs.find(y => /to date/i.test(y.more)); yPrev = yNow && yrs.find(y => +y.y === +yNow.y - 1); }

  // ── partners
  let prs = [], top2 = 0;
  if(Pt){ const cy = Pt.col(/THIS YEAR/), ct = Pt.col(/THIS MONTH/), cl = Pt.col(/LAST MONTH/), cp = Pt.col(/PAYMENT/);
    prs = Pt.rows.filter(r => r[0]).map(r => ({ n: r[0], y: N(r[cy]) || 0, t: r[ct], l: r[cl], pay: r[cp] })).sort((a, b) => b.y - a.y);
    const tot = prs.reduce((s, x) => s + x.y, 0) || 1; prs.forEach(x => x.sh = x.y / tot * 100); top2 = prs.slice(0, 2).reduce((s, x) => s + x.sh, 0); }
  // a single large payment this month (e.g. a university programme) — real money, but not a monthly habit
  const one = cur ? prs.filter(x => +x.pay <= 2 && N(x.t) && N(x.t) >= (cur.sales || 0) * .25 && Math.abs(N(x.t) - x.y) < 1) : [];
  const oneAmt = one.reduce((s, x) => s + N(x.t), 0), usual = cur ? (cur.sales || 0) - oneAmt : null;
  // ── expenses
  let exs = [];
  if(X){ const ct = X.col(/THIS MONTH/), cl = X.col(/LAST MONTH/), ca = X.col(/AVG$/), cv = X.col(/VS AVG/);
    exs = X.rows.filter(r => r[0]).map(r => ({ n: r[0], t: N(r[ct]), l: N(r[cl]), a: N(r[ca]), vs: T(r[cv]) })); }
  // ── checks
  const kind = s => /not linked/i.test(s) ? 'Not linked to a student' : /no amount/i.test(s) ? 'No amount' : /counts as ₱?0/i.test(s) ? 'Counts as ₱0' : /future-dated/i.test(s) ? 'Future-dated' : /invoice|used \d+ times|missing in sales/i.test(s) ? 'Invoice numbers' : /pending/i.test(s) ? 'Salary pending' : 'Other';
  let cks = [];
  if(K){ const cd = K.col(/^DATE/), ci = K.col(/^ITEM/), cs = K.col(/^ISSUE/); cks = K.rows.map(r => ({ d: r[cd], i: r[ci], s: T(r[cs]), k: kind(T(r[cs]) + ' ' + T(r[ci])) })); }

  // ── 1 · the picture
  const t = (cls, lab, val, sub, to) => `<div class="${cls}" onclick="x73Go('${to}')"><span>${lab}</span><b>${val}</b><small>${sub}</small></div>`;
  h += `<div class="cap" style="margin-top:4px"><h3>The picture</h3><span>the four answers first · tap a tile for the detail</span></div><div class="kp">`;
  if(cur) h += t(estNet != null && estNet < 0 ? 't-bad' : ofP != null && ofP >= Math.round(day / dim * 100) ? 't-ok' : 't-g', mon(cur) + ' · expected net', '≈ ' + P(estNet != null ? estNet : cur.net), still ? `what ${esc(mon(cur))} should end with, after about ${P(still)} in salaries still to pay` : `${esc(mon(cur))}'s profit so far`, 'x73m');
  h += t(net12 >= 0 ? 't-ok' : 't-bad', `Net · last ${full.length} months`, P(net12), `profit after the losing months · ${prof.length} up, ${loss.length} down`, 'x73c');
  if(be != null) h += t('t-w', 'Break-even', P(be) + '<small style="display:inline;font-size:13px;color:#6F6C85"> / month</small>', `sales needed each month just to cover all costs`, 'x73c');
  if(yNow) h += t(yPrev && yNow.net >= yPrev.net ? 't-ok' : 't-s', yNow.y + ' net so far', P(yNow.net), yPrev ? (yNow.net >= yPrev.net ? `profit this year · already ${P(yNow.net - yPrev.net)} more than all of ${yPrev.y}` : `${P(yPrev.net - yNow.net)} to reach ${yPrev.y}'s ${P(yPrev.net)}`) : esc(yNow.mg || ''), 'x73y');
  h += `</div>`;

  // ── 2 · what to do next
  const A = [];
  const add = (c, ic, b, s, to) => A.push(`<div class="ac" style="--c:${c}" onclick="x73Go('${to}')"><span class="ic">${ic}</span><div class="w"><b>${b}</b><span>${s}</span></div><em>See ›</em></div>`);
  if(one.length && be != null) add('#2F6FD0', '★', `${esc(mon(cur))} includes a one-off ${P(oneAmt)} (${esc(one.map(x => x.n).join(', '))})`, `Without it, ${esc(mon(cur))}'s sales are <b>${P(usual)}</b>${usual < be ? ' — under break-even' : ''}. Don't plan on it repeating every month.`, 'x73m');
  if(cur && still > 0) add('#6C5FC7', '₱', `Set aside about ${P(still)} for ${esc(mon(cur))}'s remaining salaries${stillG ? ' and dues' : ''}`, `Net is ${P(cur.net)} so far; after them ${esc(mon(cur))} should land near <b>${P(estNet)}</b>.`, 'x73m');
  const seen = {}; exs.filter(e => e.a && e.l && e.l - e.a >= 5000 && e.l > e.a * 1.3).sort((a, b) => (b.l - b.a) - (a.l - a.a)).slice(0, 2).forEach(e =>
    (seen[e.n] = 1) && add('#D4705A', '!', `${esc(e.n)} ran ${Math.round((e.l / e.a - 1) * 100)}% above usual`, `${P(e.l)} last month against a usual ${P(e.a)} — check what went in.`, 'x73x'));
  exs.filter(e => !seen[e.n] && e.a && e.t && e.t > e.a * 1.6 && e.t - e.a >= 5000).slice(0, 1).forEach(e =>
    add('#E0A43A', '!', `${esc(e.n)} this month is already ${P(e.t)}`, `About ${Math.round(e.t / e.a * 10) / 10}× its usual ${P(e.a)} — paid ahead, or a one-off?`, 'x73x'));
  if(loss.length && be != null){ const under = loss.map(m => mon(m)); add('#C4553D', '↓', `Keep monthly sales above ${P(Math.ceil(be / 1000) * 1000)}`, `${loss.length} of the last ${full.length} months lost money (${esc(under.join(', '))}) ${loss.every(m => (m.sales || 0) < be) ? ' — each had sales under the break-even line.' : '.'}`, 'x73c'); }
  if(prs.length >= 3 && top2 >= 60) add('#2F6FD0', '◐', `${Math.round(top2)}% of ${esc((Pt.title.match(/\d{4}/) || [''])[0])} sales come from two sources`, `${esc(prs[0].n)} and ${esc(prs[1].n)}. Growing the others makes income steadier.`, 'x73p');
  const nl = cks.filter(c => c.k === 'Not linked to a student').length; if(nl) add('#E0A43A', '⇄', `Link ${nl} payment${nl === 1 ? '' : 's'} to ${nl === 1 ? 'its student' : 'their students'} in ACTIVE`, `Paid lessons not linked yet don't count toward the students' packages.`, 'x73k');
  if(A.length) h += `<section class="cd todo"><h4>What to do next</h4>${A.slice(0, 7).join('')}</section>`;

  // ── 3 · this month
  if(cur){ const tickL = Math.round(day / dim * 100);
    h += `<div class="cap" id="x73m"><h3>${now.toLocaleDateString('en-US', { month: 'long' })} so far</h3><span>day ${day} of ${dim} · ${left} day${left === 1 ? '' : 's'} to go</span></div><section class="cd hero">
    <div class="t3"><div class="t-s"><span>Sales</span><b>${P(cur.sales)}</b><small>${ofP != null ? ofP + '% of ' + esc(mon(p)) + ' (' + P(p.sales) + ')' : ''}</small></div>
      <div class="t-bad"><span>Costs so far</span><b>${P(cur.costs)}</b><small>expenses ${P(cur.exp)} · salaries ${P(cur.sal)}</small></div>
      <div class="${cur.net < 0 ? 't-bad' : 't-ok'}"><span>Net so far</span><b>${P(cur.net)}</b><small>${estNet != null && still ? 'about ' + P(estNet) + ' after the salaries to come' : (mg(cur) != null ? mg(cur) + '% margin' : '')}</small></div></div>
    ${ofP != null ? `<div class="pace" title="Sales so far against ${esc(mon(p))}'s whole month"><i style="width:${Math.min(100, ofP)}%"></i><em style="left:${tickL}%" class="${tickL > 85 ? 'r' : ''}" data-l="today"></em>${ofP <= 96 ? `<em style="left:100%;background:#B9B7C8" class="r" data-l="${esc(mon(p))} total"></em>` : ''}</div>` : ''}
    <div class="nt">${ofP != null ? `<div>${ofP >= 100 ? `<b>Already past ${esc(mon(p))}</b> with ${left} days to go` : `<b>${P(p.sales - cur.sales)}</b> more to match ${esc(mon(p))}`}</div>` : ''}${be != null ? `<div>${cur.sales >= be ? (one.length && usual < be ? `<b>Above break-even</b> (${P(be)}) only with the one-off` : `<b>Above break-even</b> (${P(be)})`) : `<b>${P(be - cur.sales)}</b> to break-even`}</div>` : ''}${one.length ? `<div>Includes a one-off <b>${P(oneAmt)}</b> · usual sales <b>${P(usual)}</b></div>` : ''}<div>Salaries usually arrive after month end${gPaid ? ' · government dues paid' : ''}</div></div></section>`; }

  // ── 4 · 12 months, clickable
  const C = L.slice(0, 12).reverse(); if(SEL == null || SEL >= C.length) SEL = Math.max(0, C.indexOf(p));
  const mx = Math.max(1, ...C.map(m => Math.max(m.sales || 0, m.costs || 0)), be || 0);
  const H = n => (Math.max(0, n || 0) / mx * 100).toFixed(1) + '%';
  const seg = m => { const sum = m.exp + m.sal + m.gov, rest = Math.max(0, (m.costs || 0) - sum); return sum ? [[m.gov, 'g'], [m.sal, 'w'], [m.exp + rest, 'e']] : [[m.costs, 'e']]; };
  h += `<div class="cap" id="x73c"><h3>Last ${C.length} months</h3><span>tap a month · dashed line = break-even</span></div><div class="bd"><section class="cd">
    <div class="lg"><span><i style="background:var(--s)"></i>Sales</span><span><i style="background:var(--e)"></i>Expenses</span><span><i style="background:var(--w)"></i>Salaries</span><span><i style="background:var(--g)"></i>Gov dues</span>${be != null ? `<span><i class="be"></i>Break-even ${P(be)}</span>` : ''}</div>
    <div class="ch">${be != null ? `<div class="be" data-f="${(be / mx).toFixed(4)}"></div>` : ''}
    ${C.map((m, i) => `<div class="col ${i === SEL ? 'sel' : ''} ${m === cur ? 'so' : ''}" onclick="x73Pick(${i})" title="${esc(m.m)} · sales ${P(m.sales)} · costs ${P(m.costs)} · net ${P(m.net)}"><span class="n ${m.net < 0 ? 'neg' : ''}">${k(m.net)}</span>
      <div class="bw"><i style="height:${H(m.sales)}"></i><u style="height:${H(m.costs)}">${seg(m).map(([v, c]) => `<i style="flex:${Math.max(0, v || 0)} 0 0;background:var(--${c})"></i>`).join('')}</u></div><span class="lb">${esc(m.m.slice(0, 3))}${m === cur ? '*' : ''}</span></div>`).join('')}</div>
    ${cur ? `<div class="foot">* ${esc(mon(cur))} so far — salaries and dues arrive after month end.</div>` : ''}</section>
    <section class="cd dt" id="x73d"></section></div>`;

  // ── 5 · years
  if(yrs.length){ const ym2 = Math.max(1, ...yrs.map(y => Math.max(y.sales || 0, y.costs || 0)));
    const W = n => (Math.max(0, n || 0) / ym2 * 100).toFixed(1) + '%', tot = Y.rows.filter(r => !/^\d{4}/.test(r[0])), cn = Y.col(/^NET/), cm = Y.col(/MARGIN/);
    h += `<div class="cap" id="x73y"><h3>By year</h3><span>sales against costs · net on the right</span></div><section class="cd">
    <div class="lg" style="margin-bottom:6px"><span><i style="background:var(--s)"></i>Sales</span><span><i style="background:var(--e)"></i>Expenses</span><span><i style="background:var(--w)"></i>Salaries</span><span><i style="background:var(--g)"></i>Gov dues</span></div>
    ${yrs.slice(0, 4).map(y => `<div class="yr"${/not recorded|start/i.test(y.note) ? ' style="opacity:.6"' : ''}><div class="y">${esc(y.y)}${y.more ? `<small>${esc(y.more)}</small>` : ''}</div>
      <div class="bars"><div><i style="width:${W(y.sales)};background:var(--s)"></i></div><div>${[[y.exp, 'e'], [y.sal, 'w'], [y.gov, 'g']].filter(x => x[0] > 0).map(([n, c]) => `<i style="width:${W(n)};background:var(--${c})"></i>`).join('')}</div></div>
      <div class="v"><b class="${(y.net || 0) < 0 ? 'neg' : ''}">${P(y.net)}</b><small>${esc(y.mg || '')} margin · sales ${P(y.sales)}</small></div>${y.note ? `<div class="bt">${esc(y.note)}</div>` : ''}</div>`).join('')}
    ${tot.length ? `<div class="foot">${tot.map(r => `<b>${esc(r[0])}:</b> net ${esc(r[cn] || '—')}${cm > -1 && r[cm] ? ' (' + esc(r[cm]) + ')' : ''}${r[8] ? ' — ' + esc(r[8]) : ''}`).join('<br>')}</div>` : ''}</section>`; }

  // ── 6 · where it comes from and goes
  const PC = ['#00939D', '#6C5FC7', '#E0A43A', '#2F6FD0', '#2E9E6F'], pc = i => i < PC.length ? PC[i] : '#C9C6D6';
  let two = '';
  if(prs.length){ const show = prs.slice(0, 6), rest = prs.slice(6), oth = prs.slice(PC.length).reduce((s, x) => s + x.sh, 0);
    const one = (x, i) => `<div class="pr"><span class="d" style="background:${pc(i)}"></span><span class="n">${esc(x.n)}</span><span class="v">${P(x.y)}</span><span class="p">${Math.round(x.sh)}%</span><span class="m">${x.t && x.t !== '—' ? 'this month ' + esc(x.t) : 'none this month'}${x.l && x.l !== '—' ? ' · last month ' + esc(x.l) : ''}${x.pay ? ' · ' + esc(x.pay) + ' payment' + (x.pay == 1 ? '' : 's') : ''}</span></div>`;
    two += `<section class="cd" id="x73p"><div class="hd73"><h3>Where sales come from</h3><span>${esc((Pt.title.match(/\d{4}/) || [''])[0])} · share of the year</span></div>
      <div class="share">${prs.slice(0, PC.length).map((x, i) => `<i style="flex:${x.sh} 0 0;background:${pc(i)}" title="${esc(x.n)} · ${Math.round(x.sh)}%"></i>`).join('')}${oth > 0 ? `<i style="flex:${oth} 0 0;background:#C9C6D6" title="Others · ${Math.round(oth)}%"></i>` : ''}</div>
      ${show.map(one).join('')}${rest.length ? `<div class="hide">${rest.map((x, i) => one(x, i + 6)).join('')}</div><button class="more" onclick="this.previousElementSibling.classList.remove('hide');this.remove()">Show ${rest.length} more</button>` : ''}
      ${Pt.notes.length ? `<div class="foot">${Pt.notes.map(esc).join('<br>')}</div>` : ''}</section>`; }
  if(exs.length){ const em = Math.max(1, ...exs.map(e => Math.max(e.l || 0, e.a || 0)));
    two += `<section class="cd" id="x73x"><div class="hd73"><h3>Where money goes</h3><span>${P(exs.reduce((s, e) => s + (e.l || 0), 0))} last month · bar = last month, line = usual</span></div>
      ${exs.map(e => { const hi = e.a && e.l > e.a * 1.15, lo = e.a && (e.l || 0) < e.a * .85, d = /[▲▼]/.test(e.vs) ? (/▼/.test(e.vs) ? -1 : 1) * (N(e.vs) || 0) : e.a ? pct(e.l || 0, e.a) : null;
        return `<div class="ex ${hi ? 'hi' : lo ? 'lo' : ''}"><span class="n">${esc(e.n)}</span><span class="v ${e.l ? '' : 'mu'}">${e.l ? P(e.l) : '—'}</span><span>${d != null ? chip(d, 0) : ''}</span>
          <div class="tr"><i style="width:${((e.l || 0) / em * 100).toFixed(1)}%"></i>${e.a ? `<em style="left:${(e.a / em * 100).toFixed(1)}%"></em>` : ''}</div>
          <span class="m">usual ${e.a ? P(e.a) : '—'} · this month so far ${e.t ? P(e.t) : '—'}</span></div>`; }).join('')}
      ${X.notes.length ? `<div class="foot">${X.notes.map(esc).join('<br>')}</div>` : ''}</section>`; }
  if(two) h += `<div class="cap"><h3>Where it comes from and goes</h3></div><div class="two">${two}</div>`;

  // ── 7 · government dues
  if(G && G.rows.length){ const cols = G.head.map((x, i) => ({ x, i })).filter(o => o.x && !/^GO$/.test(o.x) && o.i > 0), cpd = G.col(/PAID ON/), ctot = G.col(/^TOTAL/);
    const parts = cols.filter(o => o.i !== cpd && o.i !== ctot), GC = ['#2F6FD0', '#00939D', '#2E9E6F', '#E0A43A', '#B9B7C8'];
    const nm = x => (x.charAt(0) + x.slice(1).toLowerCase()).replace('Pag-ibig', 'Pag-IBIG').replace('Philhealth', 'PhilHealth').replace('Sss', 'SSS').replace('Bir', 'BIR');
    const rows = G.rows.filter(r => r[0]), gm = Math.max(1, ...rows.map(r => N(r[ctot]) || 0));
    const gT = rows.reduce((s, r) => s + (N(r[ctot]) || 0), 0);
    h += `<div class="cap"><h3>Government dues</h3><span>${esc(T(G.title.split('·')[1] || ''))} · ${P(gT)} in all · about ${P(gT / (rows.length || 1))} a month</span></div><section class="cd">
      <div class="lg" style="margin-bottom:6px">${parts.map((o, j) => `<span><i style="background:${GC[j] || '#B9B7C8'}"></i>${esc(nm(o.x))}</span>`).join('')}</div>
      ${rows.map(r => `<div class="gv ${r[0] === ym ? 'cur' : ''}"><span class="mo">${esc(r[0])}</span><div class="st" style="width:${((N(r[ctot]) || 0) / gm * 100).toFixed(1)}%">${parts.map((o, j) => (N(r[o.i]) || 0) > 0 ? `<i style="flex:${N(r[o.i])} 0 0;background:${GC[j] || '#B9B7C8'}" title="${esc(nm(o.x))} ${esc(r[o.i])}"></i>` : '').join('')}</div>
        <span class="tot">${esc(r[ctot] || '—')}</span><span class="pd">${cpd > -1 ? `<span class="pay ${/due/i.test(r[cpd]) ? 'due' : ''}">${/due/i.test(r[cpd]) ? 'Due' : esc(r[cpd] ? 'Paid ' + r[cpd] : '—')}</span>` : ''}</span></div>`).join('')}
      <details style="margin-top:8px"><summary class="lnk">Show as a table</summary><div style="overflow-x:auto"><table class="mt"><tr><th>Month</th>${cols.map(o => `<th>${esc(nm(o.x))}</th>`).join('')}</tr>
      ${rows.map(r => `<tr><td>${esc(r[0])}</td>${cols.map(o => `<td class="${!r[o.i] || r[o.i] === '—' ? 'mu' : ''}">${esc(r[o.i] || '—')}</td>`).join('')}</tr>`).join('')}</table></div></details></section>`; }

  // ── 8 · needs a look
  if(cks.length){ const n = (K.title.match(/(\d+)\s+items?/) || [])[1] || cks.length, kinds = {}; cks.forEach(c => kinds[c.k] = (kinds[c.k] || 0) + 1);
    h += `<div class="cap" id="x73k"><h3>Needs a look</h3><span>${esc(n)} item${n == 1 ? '' : 's'} · fixed items disappear at the next update</span></div><section class="cd">
      <div class="fl"><button class="${CKF ? '' : 'on'}" onclick="x73F('')">All<b>${cks.length}</b></button>${Object.keys(kinds).sort((a, b) => kinds[b] - kinds[a]).map(kk => `<button class="${CKF === kk ? 'on' : ''}" onclick="x73F('${esc(kk)}')">${esc(kk)}<b>${kinds[kk]}</b></button>`).join('')}</div>
      <div id="x73ck"></div></section>`; }

  // ── 9 · every month: a table with bars in it (sales, costs, net either side of zero, margin)
  const tM = Math.max(1, ...L.map(m => Math.max(m.sales || 0, m.costs || 0))), nM = Math.max(1, ...L.map(m => Math.abs(m.net || 0)));
  const fs = full.reduce((a, m) => ({ s: a.s + (m.sales || 0), c: a.c + (m.costs || 0), n: a.n + (m.net || 0) }), { s: 0, c: 0, n: 0 }), fn = full.length || 1;
  const nb = n => { const w = Math.min(50, Math.abs(n || 0) / nM * 50).toFixed(1); return `<div class="nb">${(n || 0) < 0 ? `<i class="l" style="width:${w}%"></i>` : `<i class="r" style="width:${w}%"></i>`}</div>`; };
  const mc = x => x == null ? '<span class="mu">—</span>' : `<span class="mg ${x >= 30 ? 'hi' : x >= 10 ? 'ok' : x >= 0 ? 'lo' : 'bad'}">${x}%</span>`;
  h += `<details class="cd" style="margin-top:26px" id="x73t"><summary><h3 style="margin:0;font-family:var(--brand);font-weight:400;font-size:18px">Every month <span style="font-family:var(--f,inherit);font-size:12.5px;color:var(--mu)">· the full table</span></h3><span class="chev">›</span></summary>
    <table class="mt vt"><tr><th>Month</th><th>Sales</th><th class="hide-s">Costs</th><th class="hide-s" style="text-align:center">Profit / loss</th><th>Net</th><th>Margin</th></tr>
    ${L.map(m => `<tr${m === cur ? ' class="cu"' : ''}><td>${esc(m.m)}${m === cur ? ' <span class="chip teal">so far</span>' : ''}</td>
      <td><div class="cb"><b>${P(m.sales)}</b><i style="width:${((m.sales || 0) / tM * 100).toFixed(1)}%;background:var(--s)"></i></div></td>
      <td class="hide-s"><div class="cb"><b>${P(m.costs)}</b><i style="width:${((m.costs || 0) / tM * 100).toFixed(1)}%;background:var(--e)"></i></div></td>
      <td class="hide-s">${nb(m.net)}</td><td style="font-weight:700;color:${m.net < 0 ? '#C4553D' : '#23885A'}">${P(m.net)}</td><td>${mc(mg(m))}</td></tr>`).join('')}
    <tr class="avg73"><td>Average · ${fn} full months</td><td>${P(fs.s / fn)}</td><td class="hide-s">${P(fs.c / fn)}</td><td class="hide-s"></td><td style="color:${fs.n < 0 ? '#C4553D' : '#23885A'}">${P(fs.n / fn)}</td><td>${mc(fs.s ? Math.round(fs.n / fs.s * 100) : null)}</td></tr></table></details>`;
  const iM = R.findIndex(r => /^MONTH$/i.test(r[0])); let end = iM + 1; while(end < R.length && R[end][0] && /\d{4}/.test(R[end][0])) end++;
  const unknown = [Y, Pt, X, G, K].some(s => !s) ? MN.rows.slice(end).filter(r => r.some(x => T(x))) : [];
  if(unknown.length) h += `<details class="cd" style="margin-top:14px"><summary><h3 style="margin:0;font-family:var(--brand);font-weight:400;font-size:18px">More from the MONEY tab</h3><span class="chev">›</span></summary><div style="margin-top:12px">${grid(unknown)}</div></details>`;
  v.innerHTML = h + '</div>';

  // the break-even line sits on the bars' own scale (measured, since the net chips and month labels take room)
  function place(){ const ch = v.querySelector('.x73 .ch'), ln = ch && ch.querySelector('.be'), bw = ch && ch.querySelector('.bw'); if(!ln || !bw) return;
    ln.style.bottom = Math.round(ch.clientHeight - (bw.offsetTop + bw.offsetHeight) + bw.offsetHeight * +ln.dataset.f) + 'px'; }
  if(!window.__x73r){ window.__x73r = 1; addEventListener('resize', () => { try{ if(VIEW === 'money') renderMoney(); }catch(e){} }); }
  // month detail
  window.x73Pick = i => { SEL = i; v.querySelectorAll('.x73 .ch>.col').forEach((c, j) => c.classList.toggle('sel', j === i)); paint(); };
  function paint(){ const m = C[SEL], j = L.indexOf(m), pv = L[j + 1], el = $('x73d'); if(!m || !el) return;
    const sum = m.exp + m.sal + m.gov, cov = m.costs ? Math.round((m.sales || 0) / m.costs * 100) / 100 : null;
    const parts = sum ? [['Expenses', m.exp + Math.max(0, (m.costs || 0) - sum), 'e'], ['Salaries', m.sal, 'w'], ['Gov dues', m.gov, 'g']] : [['Costs', m.costs, 'e']];
    el.innerHTML = `<h4>${esc(m.m)}${m === cur ? ' <span class="chip teal" style="font-size:11px;vertical-align:3px">so far</span>' : ''}</h4>
      <div class="sb">${m === p ? 'last full month' : m === cur ? 'salaries and dues still to come' : ''}${pv ? (m === p || m === cur ? ' · ' : '') + 'compared with ' + esc(mon(pv)) : ''}</div>
      <div class="ln"><span>Sales</span>${pv ? chip(pct(m.sales, pv.sales), 1) : ''}<b>${P(m.sales)}</b></div>
      <div class="ln"><span>Costs</span>${pv ? chip(pct(m.costs, pv.costs), 0) : ''}<b>${P(m.costs)}</b></div>
      <div class="sp">${parts.map(([, n, c]) => `<i style="flex:${Math.max(0, n || 0)} 0 0;background:var(--${c})"></i>`).join('')}</div>
      <div class="sl">${parts.map(([l, n, c]) => `<i style="background:var(--${c})"></i><span>${l}${m.sales ? ' · ' + Math.round((n || 0) / m.sales * 100) + '% of sales' : ''}</span><b>${P(n)}</b>`).join('')}</div>
      <div class="ln" style="margin-top:8px"><span>Net</span>${pv && pv.net != null ? `<span class="c ${m.net >= pv.net ? 'up' : 'dn'}">${m.net >= pv.net ? '▲' : '▼'} ${P(Math.abs(m.net - pv.net))}</span>` : ''}<b class="${m.net < 0 ? 'bad' : 'ok'}">${P(m.net)}</b></div>
      <div class="ln"><span>Margin</span>${pv && mg(pv) != null && mg(m) != null ? chip(mg(m) - mg(pv), 1, ' pts') : ''}<b>${mg(m) == null ? '—' : mg(m) + '%'}</b></div>
      ${be != null ? `<div class="foot">${(m.sales || 0) >= be ? `Sales were <b>${P(m.sales - be)}</b> above break-even.` : `Sales were <b>${P(be - m.sales)}</b> under break-even.`}${cov ? ` Every ₱1 of cost brought in ₱${cov.toFixed(2)} of sales.` : ''}</div>` : ''}`; }
  paint(); place();
  // checks list with a filter
  window.x73F = f => { CKF = f; v.querySelectorAll('.x73 .fl button').forEach(b => b.classList.toggle('on', (b.getAttribute('onclick').match(/x73F\('(.*)'\)/) || [])[1] === esc(f))); ck(); };
  function ck(){ const el = $('x73ck'); if(!el) return; const list = cks.filter(c => !CKF || c.k === CKF), show = list.slice(0, 6), rest = list.slice(6);
    const col = c => /Future|Salary pending|Invoice/.test(c.k) ? '#E0A43A' : '#D4705A';
    const one = c => `<div class="ck" style="--c:${col(c)}"><i></i><div class="w"><b>${esc(c.i || '')}</b><span>${esc(c.s)}</span></div><em>${esc(c.d || '')}</em></div>`;
    el.innerHTML = show.map(one).join('') + (rest.length ? `<div class="hide">${rest.map(one).join('')}</div><button class="more" onclick="this.previousElementSibling.classList.remove('hide');this.remove()">Show ${rest.length} more</button>` : ''); }
  ck();
};
if(typeof VIEW !== 'undefined' && VIEW === 'money') try{ renderMoney(); }catch(e){ console.warn('money', e); }
})();
