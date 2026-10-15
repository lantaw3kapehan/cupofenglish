/* 15 Oct night · Sales & costs, redesigned: this month first (with the month-end pace), last full month, a cleaner
   12-month chart, and the rest of the MONEY tab (years, partners, expenses, government dues, checks) as designed cards
   instead of a raw sheet grid. Same numbers, read from the same MONEY data; anything not recognised falls back to the grid. */
(function(){
const css = `
#v-money .mx-top{display:flex;align-items:flex-end;gap:12px;flex-wrap:wrap;margin-bottom:18px}
#v-money .mx-top h1{margin:0;font-family:var(--brand);font-weight:400;font-size:38px;letter-spacing:.2px;color:var(--ink)}
#v-money .mx-top .sub{font-size:13px;color:#8F8CA3;margin-top:4px}
#v-money .mx-top .sub a{color:var(--teal);font-weight:700;text-decoration:none}
#v-money .mx-act{display:flex;gap:8px;margin-left:auto}
.mx-hero{position:relative;overflow:hidden;border-radius:24px;padding:24px 26px 22px;color:#fff;background:radial-gradient(120% 140% at 100% 0%,#3B5D8F 0%,#2B2253 55%,#221B44 100%);box-shadow:0 18px 40px -22px rgba(43,34,83,.55)}
.mx-hero::after{content:"";position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(circle,rgba(0,210,180,.22),transparent 70%)}
.mx-hero .row1{display:flex;align-items:baseline;gap:10px}
.mx-hero h2::before{display:none!important}
.mx-hero h2{margin:0;font-family:var(--brand);font-weight:400;font-size:20px;color:#fff;flex:1}
.mx-hero .day{font-size:12.5px;color:#CFCBE6}
.mx-big{display:grid;grid-template-columns:1.25fr 1fr 1fr;gap:18px;margin-top:16px;position:relative;z-index:1}
.mx-big span{display:block;font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#BDB8DC}
.mx-big b{display:block;font-family:var(--brand);font-weight:400;font-size:34px;line-height:1.15;white-space:nowrap;margin-top:4px}
.mx-big div:not(:first-child) b{font-size:26px;margin-top:8px}
.mx-big b.neg{color:#FFB4A3} .mx-big b.pos{color:#7FE3D2}
.mx-pace{position:relative;height:10px;border-radius:10px;background:rgba(255,255,255,.13);margin:20px 0 8px;z-index:1}
.mx-pace i{position:absolute;left:0;top:0;bottom:0;border-radius:10px;background:linear-gradient(90deg,#26C6B0,#00D2B4)}
.mx-pace em{position:absolute;top:-5px;width:2px;height:20px;border-radius:2px;background:#fff}
.mx-pace em::after{content:attr(data-l);position:absolute;top:22px;transform:translateX(-50%);font-style:normal;font-size:10.5px;color:#CFCBE6;white-space:nowrap}
.mx-note{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:12.5px;color:#D9D6EC;margin-top:26px;position:relative;z-index:1}
.mx-note b{color:#fff;font-weight:700}
.mx-cap{display:flex;align-items:baseline;gap:8px;margin:26px 2px 10px}
.mx-cap h3{margin:0;font-family:var(--brand);font-weight:400;font-size:19px;color:var(--ink)}
.mx-cap span{font-size:12.5px;color:#8F8CA3}
.mx-k{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.mx-t{background:#fff;border:1px solid rgba(236,234,241,.9);border-radius:18px;box-shadow:var(--sh1);padding:16px 18px 14px;min-width:0}
.mx-t>span:first-child{display:block;font-size:11px;font-weight:700;letter-spacing:1.1px;text-transform:uppercase;color:#A3A0B5}
.mx-t b{display:block;font-family:var(--brand);font-weight:400;font-size:28px;line-height:1.15;margin:6px 0 8px;white-space:nowrap;color:var(--ink)}
.mx-t.pos b{color:#2F6F77} .mx-t.neg b{color:var(--red)}
.mx-ch{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:999px;font-size:11.5px;font-weight:700}
.mx-ch.up{background:#E4F3EC;color:#1F6B45} .mx-ch.dn{background:#FBE7E1;color:#9A3B26} .mx-ch.eq{background:#F1F0F5;color:#76738A}
.mx-ch small{font-weight:400;opacity:.8;font-size:11px}
.mx-c{background:#fff;border:1px solid rgba(236,234,241,.9);border-radius:20px;box-shadow:var(--sh1);padding:18px 20px 16px;min-width:0}
.mx-h{display:flex;align-items:baseline;gap:10px;margin-bottom:12px}
.mx-h h3{margin:0;flex:1;font-family:var(--brand);font-weight:400;font-size:18px;color:var(--ink)}
.mx-h .c{font-size:12px;color:#A3A0B5}
.mx-lg{display:flex;gap:14px;font-size:12px;color:#8F8CA3} .mx-lg i{display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:5px;vertical-align:-1px}
.mx-lg i.s{background:var(--teal)} .mx-lg i.k{background:#E3B4A8}
.mx-chart{position:relative;display:flex;align-items:flex-end;gap:10px;height:210px;padding:26px 0 0;margin-top:4px;background:repeating-linear-gradient(to top,transparent 0,transparent calc(25% - 1px),#F1F0F5 calc(25% - 1px),#F1F0F5 25%)}
.mx-chart>div{flex:1;min-width:0;height:100%;display:flex;flex-direction:column;align-items:center;cursor:default}
.mx-chart .bw{flex:1;width:100%;display:flex;align-items:flex-end;justify-content:center;gap:3px}
.mx-chart .bw i{width:38%;max-width:18px;min-height:2px;border-radius:6px 6px 2px 2px;transition:opacity .15s}
.mx-chart .bw i.s{background:linear-gradient(180deg,#6FB3BA,var(--teal))} .mx-chart .bw i.k{background:linear-gradient(180deg,#EDC6BC,#E3B4A8)}
.mx-chart>div:hover .bw i{opacity:.8}
.mx-chart .nt{font-size:10.5px;font-weight:700;padding:2px 6px;border-radius:999px;margin-bottom:6px;white-space:nowrap;background:#E4F3EC;color:#1F6B45}
.mx-chart .nt.neg{background:#FBE7E1;color:#9A3B26}
.mx-chart .lb{font-size:11.5px;color:#8F8CA3;margin-top:8px}
.mx-chart .cur .lb{color:var(--ink);font-weight:700}
.mx-2{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;margin-top:14px}
.mx-yr{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
.mx-yr>div{border:1px solid var(--line);border-radius:16px;padding:14px 16px;background:linear-gradient(180deg,#FFFFFF,#FAFAFC)}
.mx-yr .y{font-family:var(--brand);font-size:17px;color:var(--ink)}
.mx-yr .y small{font-family:var(--f,inherit);font-size:11.5px;color:#A3A0B5;margin-left:6px}
.mx-yr dl{display:grid;grid-template-columns:auto 1fr;gap:5px 10px;margin:10px 0 0;font-size:13px}
.mx-yr dt{color:#8F8CA3} .mx-yr dd{margin:0;text-align:right;font-variant-numeric:tabular-nums;color:var(--ink)}
.mx-yr dd.net{font-weight:700} .mx-yr dd.net.neg{color:var(--red)} .mx-yr dd.net.pos{color:#2F6F77}
.mx-foot{font-size:12px;color:#8F8CA3;margin-top:12px;line-height:1.45}
.mx-pr{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:4px 12px;align-items:center;padding:9px 0;border-top:1px solid #F1F0F5}
.mx-pr:first-of-type{border-top:0}
.mx-pr .n{font-weight:700;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mx-pr .v{font-variant-numeric:tabular-nums;font-weight:700;color:var(--ink)}
.mx-pr .bar{grid-column:1/-1;height:6px;border-radius:6px;background:#F1F0F5;overflow:hidden}
.mx-pr .bar i{display:block;height:100%;border-radius:6px;background:linear-gradient(90deg,#6FB3BA,var(--teal))}
.mx-pr .m{grid-column:1/-1;font-size:11.5px;color:#8F8CA3}
.mx-ex{width:100%;border-collapse:collapse;font-size:13.5px}
.mx-ex th{font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#A3A0B5;text-align:right;padding:0 0 8px}
.mx-ex th:first-child,.mx-ex td:first-child{text-align:left}
.mx-ex td{padding:9px 0;border-top:1px solid #F1F0F5;text-align:right;font-variant-numeric:tabular-nums;color:var(--ink)}
.mx-ex td:first-child{font-weight:700;padding-right:8px}
.mx-ex td.mu{color:#A3A0B5}
.mx-ex .mx-ch{padding:2px 8px;font-size:11px}
.mx-ex tr.mx-cur td{background:#F6FAFA}
.mx-ex tr.mx-cur td:first-child{box-shadow:inset 3px 0 0 var(--teal);padding-left:8px}
.mx-pay{display:inline-block;padding:2px 9px;border-radius:999px;font-size:11.5px;font-weight:700;background:#E4F3EC;color:#1F6B45;white-space:nowrap}
.mx-pay.due{background:#FBE7E1;color:#9A3B26}
.mx-chk{display:flex;gap:12px;padding:11px 0;border-top:1px solid #F1F0F5}
.mx-chk:first-of-type{border-top:0}
.mx-chk i{flex:none;width:8px;height:8px;border-radius:50%;background:var(--coral);margin-top:6px}
.mx-chk.soft i{background:#E0A43A}
.mx-chk .w{min-width:0;flex:1} .mx-chk b{display:block;color:var(--ink);font-size:13.5px;overflow-wrap:anywhere}
.mx-chk span{display:block;font-size:12.5px;color:#7C7990;line-height:1.4;overflow-wrap:anywhere}
.mx-chk em{font-style:normal;font-size:11.5px;color:#A3A0B5;white-space:nowrap}
.mx-er{display:grid;grid-template-columns:minmax(0,1fr) auto auto;gap:2px 12px;align-items:center;padding:10px 0;border-top:1px solid #F1F0F5}
.mx-er:first-of-type{border-top:0}
.mx-er .n{font-weight:700;color:var(--ink);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.mx-er .v{font-variant-numeric:tabular-nums;font-weight:700;color:var(--ink);text-align:right}
.mx-er .v.mu{color:#B9B7C8;font-weight:400}
.mx-er .m{grid-column:1/-1;font-size:11.5px;color:#8F8CA3}
.mx-er .mx-ch{min-width:58px;justify-content:center}
.mx-more{margin-top:8px;border:0;background:none;color:var(--teal);font:inherit;font-weight:700;cursor:pointer;padding:6px 0}
#v-money details.mx-c>summary{display:flex;align-items:center;justify-content:space-between;cursor:pointer;list-style:none}
#v-money details.mx-c>summary::-webkit-details-marker{display:none}
#v-money details.mx-c[open]>summary .chev{transform:rotate(90deg)}
#v-money details.mx-c>summary .chev{transition:transform .2s;color:#A3A0B5;font-size:20px}
@media(max-width:1000px){ .mx-k{grid-template-columns:repeat(2,minmax(0,1fr))} .mx-2{grid-template-columns:minmax(0,1fr)} }
@media(max-width:640px){ #v-money .mx-top h1{font-size:30px} #v-money .mx-act{margin-left:0;width:100%} #v-money .mx-act .btn{flex:1}
  .mx-hero{padding:20px 18px;border-radius:20px} .mx-big{grid-template-columns:1fr 1fr;gap:14px} .mx-big div:first-child{grid-column:1/-1} .mx-big b{font-size:30px} .mx-big div:not(:first-child) b{font-size:22px;margin-top:2px}
  .mx-t{padding:13px 14px 12px;border-radius:16px} .mx-t b{font-size:22px} .mx-chart{height:160px;gap:4px} .mx-chart .nt{font-size:9px;padding:1px 4px} .mx-chart .lb{font-size:10px}
  .mx-yr{display:flex;overflow-x:auto;scroll-snap-type:x mandatory;gap:10px;margin:0 -4px;padding:0 4px 4px} .mx-yr>div{flex:0 0 82%;scroll-snap-align:start} .mx-c{padding:16px 14px 14px;border-radius:18px} .mx-ex .hide-s{display:none} }`;
const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

const T = s => String(s == null ? '' : s).trim();
// the MONEY tab's own sections (title row, header row, rows) → { rows, notes, head }
function mxSec(R, re){
  const i = R.findIndex(r => re.test(r[0] || '')); if(i < 0) return null;
  const isTitle = r => r && /^[A-Z][A-Z0-9 &·\-()]{3,}(\s{2}·|$)/.test(r[0] || '') && r.slice(1).every(x => !x) && !/\d{4}/.test(r[0]);
  const head = (R[i + 1] || []).map(x => T(x).toUpperCase()), rows = [], notes = [];
  for(let k = i + 2; k < R.length; k++){ const r = R[k]; if(!r.some(Boolean)) { if(rows.length) break; else continue; } if(isTitle(r)) break;
    if(r[0] && r.slice(1).every(x => !x)) notes.push(r[0]); else rows.push(r); }
  return { title: R[i][0], head, rows, notes, col: re2 => head.findIndex(h => re2.test(h)) };
}
const chip = (d, good, sfx) => { if(d == null || !isFinite(d)) return ''; if(!Math.round(d)) return '<span class="mx-ch eq">same</span>';
  const up = d > 0, ok = good ? up : !up; return `<span class="mx-ch ${ok ? 'up' : 'dn'}">${up ? '▲' : '▼'} ${Math.abs(Math.round(d))}${sfx || '%'}</span>`; };
const pct = (a, b) => a == null || b == null || b <= 0 ? null : (a - b) / Math.abs(b) * 100;

window.renderMoney = function(){
  if(!MN) return;
  const R = (MN.rows || []).map(r => r.map(T)), L = hmMoney();
  const upd = ((R.find(r => /^Updated/i.test(r[0])) || [''])[0].match(/^Updated\s+(.*?\d{1,2}:\d{2}H?)/) || [])[1] || '';
  const top = `<div class="mx-top"><div><h1>Sales &amp; costs</h1><div class="sub">${upd ? 'Updated ' + esc(upd) + ' · ' : ''}PHP · from the MONEY tab${sheetLink('MONEY')}</div></div>
    <div class="mx-act"><button class="btn teal" onclick="saleSheet()">+ Sale</button><button class="btn ghost" onclick="expSheet()">+ Expense</button></div></div>`;
  if(!L){ $('v-money').innerHTML = top + grid(MN.rows.slice(1)); return; }
  const now = new Date(), ym = now.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }), cur = L.find(m => m.m === ym), full = L.filter(m => m !== cur);
  const p = full[0], q = full[1], mg = m => m && m.sales ? Math.round(m.net / m.sales * 100) : null, mon = m => esc(m.m.split(' ')[0]);
  let h = top;

  // ── this month
  if(cur){ const dim = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate(), day = now.getDate(), left = dim - day;
    const proj = day ? Math.round((cur.sales || 0) / day * dim) : null, ofP = p && p.sales ? Math.round((cur.sales || 0) / p.sales * 100) : null;
    h += `<section class="mx-hero"><div class="row1"><h2>${now.toLocaleDateString('en-US', { month: 'long' })} so far</h2><span class="day">day ${day} of ${dim}</span></div>
    <div class="mx-big"><div><span>Sales</span><b>${hmPeso(cur.sales)}</b></div><div><span>Costs</span><b>${hmPeso(cur.costs)}</b></div><div><span>Net</span><b class="${cur.net < 0 ? 'neg' : 'pos'}">${hmPeso(cur.net)}</b></div></div>
    ${ofP != null ? `<div class="mx-pace"><i style="width:${Math.min(100, ofP)}%"></i><em style="left:${Math.round(day / dim * 100)}%" data-l="today"></em></div>` : ''}
    <div class="mx-note">${ofP != null ? `<div><b>${ofP}%</b> of ${mon(p)}'s sales</div>` : ''}<div><b>${left}</b> day${left === 1 ? '' : 's'} to go</div>${proj != null && day >= 5 ? `<div>On this pace: <b>${hmPeso(proj)}</b> by month end</div>` : ''}<div>Salaries and government dues usually arrive after month end</div></div></section>`; }

  // ── last full month
  if(p){ const qn = q ? 'vs ' + mon(q) : '';
    const t = (lab, v, c, cls) => `<div class="mx-t ${cls || ''}"><span>${lab}</span><b>${v}</b>${c ? c + ' <small style="font-size:11.5px;color:#A3A0B5">' + qn + '</small>' : '<span style="height:20px"></span>'}</div>`;
    h += `<div class="mx-cap"><h3>${esc(p.m)}</h3><span>last full month</span></div><div class="mx-k">
    ${t('Sales', hmPeso(p.sales), q ? chip(pct(p.sales, q.sales), 1) : '')}
    ${t('Costs', hmPeso(p.costs), q ? chip(pct(p.costs, q.costs), 0) : '')}
    ${t('Net', hmPeso(p.net), q && q.net != null && p.net != null ? `<span class="mx-ch ${p.net >= q.net ? 'up' : 'dn'}">${p.net >= q.net ? '▲' : '▼'} ${hmPeso(Math.abs(p.net - q.net))}</span>` : '', p.net < 0 ? 'neg' : 'pos')}
    ${t('Margin', mg(p) == null ? '—' : mg(p) + '%', q && mg(q) != null && mg(p) != null ? chip(mg(p) - mg(q), 1, ' pts') : '')}</div>`; }

  // ── 12 months
  const C = L.slice(0, 12).reverse(), mx = Math.max(1, ...C.map(m => Math.max(m.sales || 0, m.costs || 0)));
  const k = n => n == null ? '' : (n < 0 ? '−' : '+') + (Math.abs(n) >= 1000 ? Math.round(Math.abs(n) / 1000) + 'k' : Math.round(Math.abs(n)));
  h += `<div class="mx-cap"><h3>Last ${C.length} months</h3><span>net above each month</span></div><section class="mx-c">
    <div class="mx-h"><span class="c" style="flex:1">Sales and costs per month</span><div class="mx-lg"><span><i class="s"></i>Sales</span><span><i class="k"></i>Costs</span></div></div>
    <div class="mx-chart">${C.map(m => `<div class="${m === cur ? 'cur' : ''}" title="${esc(m.m)} · sales ${hmPeso(m.sales)} · costs ${hmPeso(m.costs)} · net ${hmPeso(m.net)}"><span class="nt ${m.net < 0 ? 'neg' : ''}">${k(m.net)}</span><div class="bw"><i class="s" style="height:${Math.round((m.sales || 0) / mx * 100)}%"></i><i class="k" style="height:${Math.round((m.costs || 0) / mx * 100)}%"></i></div><span class="lb">${esc(m.m.slice(0, 3))}</span></div>`).join('')}</div></section>`;

  // ── years
  const Y = mxSec(R, /^BY YEAR/i);
  if(Y && Y.rows.length){ const cs = Y.col(/^SALES/), cc = Y.col(/TOTAL COSTS/), cn = Y.col(/^NET/), cm = Y.col(/MARGIN/), ce = Y.col(/EXPENSES/), cw = Y.col(/SALAR/), cg = Y.col(/GOV/);
    const yrs = Y.rows.filter(r => /^\d{4}/.test(r[0])).slice(0, 3), tot = Y.rows.filter(r => !/^\d{4}/.test(r[0]));
    h += `<div class="mx-cap"><h3>By year</h3><span>sales, costs and net</span></div><section class="mx-c"><div class="mx-yr">${yrs.map(r => { const n = hmN(r[cn]), yy = r[0].match(/^\d{4}/)[0], more = T(r[0].slice(4)).replace(/[()]/g, '');
      return `<div><div class="y">${yy}${more ? `<small>${esc(more)}</small>` : ''}</div><dl><dt>Sales</dt><dd>${esc(r[cs] || '—')}</dd>${ce > -1 ? `<dt>Expenses</dt><dd>${esc(r[ce] || '—')}</dd>` : ''}${cw > -1 ? `<dt>Salaries</dt><dd>${esc(r[cw] || '—')}</dd>` : ''}${cg > -1 ? `<dt>Gov dues</dt><dd>${esc(r[cg] || '—')}</dd>` : ''}<dt>Total costs</dt><dd>${esc(r[cc] || '—')}</dd><dt>Net</dt><dd class="net ${n < 0 ? 'neg' : 'pos'}">${esc(r[cn] || '—')}${cm > -1 && r[cm] ? ' · ' + esc(r[cm]) : ''}</dd></dl></div>`; }).join('')}</div>
      ${tot.length ? `<div class="mx-foot">${tot.map(r => `<b>${esc(r[0])}:</b> net ${esc(r[cn] || '—')}${cm > -1 && r[cm] ? ' (' + esc(r[cm]) + ')' : ''}${r[8] ? ' — ' + esc(r[8]) : ''}`).join('<br>')}</div>` : ''}</section>`; }

  // ── partners and expenses side by side
  const P = mxSec(R, /^SALES BY PARTNER/i), X = mxSec(R, /^EXPENSES BY CATEGORY/i); let two = '';
  if(P && P.rows.length){ const cy = P.col(/THIS YEAR/), ct = P.col(/THIS MONTH/), cl = P.col(/LAST MONTH/), cp = P.col(/PAYMENT/), csh = P.col(/SHARE/);
    const rows = P.rows.filter(r => r[0]), mxy = Math.max(1, ...rows.map(r => hmN(r[cy]) || 0)), show = rows.slice(0, 6), rest = rows.slice(6);
    const one = r => `<div class="mx-pr"><span class="n">${esc(r[0])}</span><span class="v">${esc(r[cy] || '—')}</span><div class="bar"><i style="width:${Math.round((hmN(r[cy]) || 0) / mxy * 100)}%"></i></div><span class="m">${csh > -1 && r[csh] ? esc(r[csh]) + ' of the year' : ''}${ct > -1 && r[ct] && r[ct] !== '—' ? ' · this month ' + esc(r[ct]) : ''}${cl > -1 && r[cl] && r[cl] !== '—' ? ' · last month ' + esc(r[cl]) : ''}${cp > -1 && r[cp] ? ' · ' + esc(r[cp]) + ' payments' : ''}</span></div>`;
    two += `<section class="mx-c"><div class="mx-h"><h3>Sales by partner</h3><span class="c">${esc((P.title.match(/\d{4}/) || [''])[0])}</span></div>${show.map(one).join('')}
      ${rest.length ? `<div id="mxPrMore" class="hide">${rest.map(one).join('')}</div><button class="mx-more" onclick="this.previousElementSibling.classList.remove('hide');this.remove()">Show ${rest.length} more</button>` : ''}
      ${P.notes.length ? `<div class="mx-foot">${P.notes.map(esc).join('<br>')}</div>` : ''}</section>`; }
  if(X && X.rows.length){ const ct = X.col(/THIS MONTH/), cl = X.col(/LAST MONTH/), ca = X.col(/AVG$/), cv = X.col(/VS AVG/);
    two += `<section class="mx-c"><div class="mx-h"><h3>Expenses by category</h3><span class="c">last month · vs its usual level</span></div>
      ${X.rows.filter(r => r[0]).map(r => { const v = T(r[cv]), up = /▲/.test(v), d = hmN(v), tm = T(r[cl]), none = !tm || tm === '—';
        return `<div class="mx-er"><span class="n">${esc(r[0])}</span><span class="v ${none ? 'mu' : ''}">${none ? '—' : esc(tm)}</span><span>${v ? `<span class="mx-ch ${up ? 'dn' : 'up'}">${up ? '▲' : '▼'} ${Math.abs(d || 0)}%</span>` : ''}</span><span class="m">this month so far ${esc(r[ct] || '—')} · usual (12-month average) ${esc(r[ca] || '—')}</span></div>`; }).join('')}
      ${X.notes.length ? `<div class="mx-foot">${X.notes.map(esc).join('<br>')}</div>` : ''}</section>`; }
  if(two) h += `<div class="mx-cap"><h3>Where it comes from and goes</h3></div><div class="mx-2" style="margin-top:0">${two}</div>`;

  // ── government dues
  const G = mxSec(R, /^GOVERNMENT DUES/i);
  if(G && G.rows.length){ const cols = G.head.map((x, i) => ({ x, i })).filter(o => o.x && !/^GO$/.test(o.x) && o.i > 0), cpd = G.col(/PAID ON/);
    h += `<div class="mx-cap"><h3>Government dues</h3><span>${esc(T(G.title.split('·')[1] || ''))}</span></div><section class="mx-c" style="overflow-x:auto">
      <table class="mx-ex"><tr><th>Month</th>${cols.map(o => `<th class="${/OTHER|BIR/.test(o.x) ? 'hide-s' : ''}">${esc(o.x.charAt(0) + o.x.slice(1).toLowerCase()).replace('Pag-ibig', 'Pag-IBIG').replace('Philhealth', 'PhilHealth').replace('Sss', 'SSS').replace('Bir', 'BIR')}</th>`).join('')}</tr>
      ${G.rows.filter(r => r[0]).map(r => `<tr${r[0] === ym ? ' class="mx-cur"' : ''}><td>${esc(r[0])}</td>${cols.map(o => o.i === cpd ? `<td><span class="mx-pay ${/due/i.test(r[o.i]) ? 'due' : ''}">${/due/i.test(r[o.i]) ? 'Due' : esc(r[o.i] ? 'Paid ' + r[o.i] : '—')}</span></td>` : `<td class="${/OTHER|BIR/.test(o.x) ? 'hide-s ' : ''}${!r[o.i] || r[o.i] === '—' ? 'mu' : ''}${/TOTAL/.test(o.x) ? '" style="font-weight:700' : ''}">${esc(r[o.i] || '—')}</td>`).join('')}</tr>`).join('')}</table></section>`; }

  // ── checks
  const K = mxSec(R, /^CHECKS/i);
  if(K && K.rows.length){ const cd = K.col(/^DATE/), ci = K.col(/^ITEM/), cs = K.col(/^ISSUE/);
    const one = r => { const iss = T(r[cs]), soft = /future-dated|counted on their dates/i.test(iss);
      return `<div class="mx-chk ${soft ? 'soft' : ''}"><i></i><div class="w"><b>${esc(r[ci] || '')}</b><span>${esc(iss)}</span></div><em>${esc(r[cd] || '')}</em></div>`; };
    const n = (K.title.match(/(\d+)\s+items?/) || [])[1] || K.rows.length, show = K.rows.slice(0, 5), rest = K.rows.slice(5);
    h += `<div class="mx-cap"><h3>Needs a look</h3><span>${esc(n)} item${n == 1 ? '' : 's'} · fixed items disappear at the next update</span></div><section class="mx-c">${show.map(one).join('')}
      ${rest.length ? `<div class="hide">${rest.map(one).join('')}</div><button class="mx-more" onclick="this.previousElementSibling.classList.remove('hide');this.remove()">Show ${rest.length} more</button>` : ''}</section>`; }

  // ── every month
  h += `<details class="mx-c" style="margin-top:26px"><summary><h3 style="margin:0;font-family:var(--brand);font-weight:400;font-size:18px">Every month</h3><span class="chev">›</span></summary>
    <table class="mx-ex" style="margin-top:12px"><tr><th>Month</th><th>Sales</th><th>Costs</th><th>Net</th><th class="hide-s">Margin</th></tr>
    ${L.map(m => `<tr${m === cur ? ' class="mx-cur"' : ''}><td>${esc(m.m)}${m === cur ? ' <span class="chip teal">so far</span>' : ''}</td><td>${hmPeso(m.sales)}</td><td>${hmPeso(m.costs)}</td><td style="font-weight:700;color:${m.net < 0 ? 'var(--red)' : '#2F6F77'}">${hmPeso(m.net)}</td><td class="hide-s mu">${mg(m) == null ? '—' : mg(m) + '%'}</td></tr>`).join('')}</table></details>`;

  // anything in the MONEY tab not shown above stays reachable as it is in the sheet
  const iM = R.findIndex(r => /^MONTH$/i.test(r[0])); let end = iM + 1; while(end < R.length && R[end][0] && /\d{4}/.test(R[end][0])) end++;
  const unknown = [Y, P, X, G, K].some(s => !s) ? MN.rows.slice(end).filter(r => r.some(x => T(x))) : [];
  if(unknown.length) h += `<details class="mx-c" style="margin-top:14px"><summary><h3 style="margin:0;font-family:var(--brand);font-weight:400;font-size:18px">More from the MONEY tab</h3><span class="chev">›</span></summary><div style="margin-top:12px">${grid(unknown)}</div></details>`;
  $('v-money').innerHTML = h;
};
if(typeof VIEW !== 'undefined' && VIEW === 'money') try{ renderMoney(); }catch(e){}
})();
